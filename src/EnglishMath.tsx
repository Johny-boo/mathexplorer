import { useState, useEffect, useRef } from 'react'
import type { EnglishLevel, EnglishTopic, EnglishProgress, EnglishQuestion } from './core/types'
import {
    ENGLISH_TIME_BY_LEVEL,
    ENGLISH_TOPIC_BADGE,
    ENGLISH_SESSION_SIZE,
    ENGLISH_STAR_THRESHOLDS
} from './core/constants'
import { getLevelStatus } from './core/englishUnlock'
import { calculateEnglishStars } from './core/starSystem'
import { buildSession } from './core/englishQuestions'
import { speak, stopSpeaking, isSpeechSupported } from './core/speech'
import { VOCABULARY_BANK } from './core/vocabulary'
import ClockFace from './components/ClockFace'
import BalanceScale from './components/BalanceScale'
import VisualEquation from './components/VisualEquation'
import Pictograph from './components/Pictograph'
import Thermometer from './components/Thermometer'
import PeopleLine from './components/PeopleLine'
import GeometrySVG from './components/GeometrySVG'
import Calendar from './components/Calendar'
import MagicSquare from './components/MagicSquare'
import CoinVisual from './components/CoinVisual'

export type EnglishAnswerResult = {
    level: EnglishLevel
    topic: EnglishTopic
    correct: boolean
    usedAudio: boolean
    usedTranslate: boolean
    timeSpent: number
    timedOut: boolean
    vocabIds: string[]
}

type Props = {
    onBack: () => void
    progress: EnglishProgress
    onAnswer: (r: EnglishAnswerResult) => void
    onVocabTap: (wordId: string) => void
    onMockTestPass: (level: EnglishLevel) => void
    autoStartLevel?: EnglishLevel
    autoStartMock?: boolean
}

export default function EnglishMath({ onBack, progress, onAnswer, onVocabTap, onMockTestPass, autoStartLevel, autoStartMock }: Props) {
    const [view, setView] = useState<'menu' | 'playing' | 'summary' | 'flashcards'>('menu')
    const [currentLevel, setCurrentLevel] = useState<EnglishLevel>(1)

    const [session, setSession] = useState<EnglishQuestion[]>([])
    const [qIndex, setQIndex] = useState(0)
    const [phase, setPhase] = useState<'answering' | 'revealed'>('answering')
    const [selected, setSelected] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState(30)
    const [sessionCorrect, setSessionCorrect] = useState(0)
    const [showHint, setShowHint] = useState(false)

    const [usedAudio, setUsedAudio] = useState(false)
    const [usedTranslate, setUsedTranslate] = useState(false)
    const [showTranslate, setShowTranslate] = useState(false)

    const [lookupWord, setLookupWord] = useState<string | null>(null)
    const [tappedWords, setTappedWords] = useState<string[]>([])

    const [flashcards, setFlashcards] = useState<any[]>([])
    const [cardIndex, setCardIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    const [isMockTest, setIsMockTest] = useState(false)
    const [mockTimer, setMockTimer] = useState(0)

    const deadlineRef = useRef<number>(0)
    const answeredRef = useRef<boolean>(false)
    const startTimeRef = useRef<number>(0)
    const autoStartedRef = useRef<boolean>(false)

    useEffect(() => { return () => stopSpeaking() }, [view])

    // Auto-start khi được mở từ Section
    useEffect(() => {
        if (autoStartLevel && !autoStartedRef.current) {
            autoStartedRef.current = true
            startLevel(autoStartLevel, autoStartMock || false)
        }
    }, [autoStartLevel, autoStartMock])

    useEffect(() => {
        if (view !== 'playing' || phase !== 'answering') return
        if (isMockTest) {
            const id = setInterval(() => {
                setMockTimer(t => {
                    if (t <= 1) { clearInterval(id); finishQuestion(null); return 0 }
                    return t - 1
                })
            }, 1000)
            return () => clearInterval(id)
        } else {
            const id = setInterval(() => {
                const left = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000))
                setTimeLeft(left)
                if (left === 0) {
                    clearInterval(id)
                    finishQuestion(null)
                }
            }, 250)
            return () => clearInterval(id)
        }
    }, [view, phase, qIndex, isMockTest])

    function startLevel(level: EnglishLevel, isMock = false) {
        try {
            setCurrentLevel(level)
            setIsMockTest(isMock)
            const newSession = buildSession(level, ENGLISH_SESSION_SIZE)
            setSession(newSession)
            setQIndex(0)
            setSessionCorrect(0)
            initQuestionState(level)
            if (isMock) setMockTimer(ENGLISH_TIME_BY_LEVEL[level] * ENGLISH_SESSION_SIZE)
            setView('playing')
        } catch (err) {
            console.error('[EnglishMath] Lỗi khởi tạo level:', err)
            setView('menu')
        }
    }

    function initQuestionState(level: EnglishLevel) {
        setPhase('answering')
        setSelected(null)
        setUsedAudio(false)
        setUsedTranslate(false)
        setShowTranslate(level === 1)
        setTappedWords([])
        setLookupWord(null)
        setShowHint(false) // Reset Hints mỗi câu
        answeredRef.current = false
        startTimeRef.current = Date.now()
        deadlineRef.current = Date.now() + ENGLISH_TIME_BY_LEVEL[level] * 1000
        setTimeLeft(ENGLISH_TIME_BY_LEVEL[level])
        stopSpeaking()
    }

    function finishQuestion(choice: string | null) {
        try {
            if (answeredRef.current) return
            if (!session || !session[qIndex]) { setView('menu'); return }

            answeredRef.current = true
            const q = session[qIndex]
            const isCorrect = choice === q.answer
            const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)

            setSelected(choice)
            setPhase('revealed')
            stopSpeaking()
            setShowTranslate(true)

            if (isCorrect) setSessionCorrect(prev => prev + 1)

            if (q.vocab && onAnswer) {
                onAnswer({ level: currentLevel, topic: q.topic, correct: isCorrect, usedAudio, usedTranslate, timeSpent, timedOut: choice === null, vocabIds: q.vocab })
            }
        } catch (error) {
            console.error('[EnglishMath] Lỗi xử lý câu trả lời:', error)
            setPhase('revealed')
        }
    }

    function handleNext() {
        if (qIndex + 1 >= session.length) {
            if (isMockTest && sessionCorrect >= 8 && onMockTestPass) onMockTestPass(currentLevel)
            setView('summary')
        } else {
            setQIndex(prev => prev + 1)
            initQuestionState(currentLevel)
        }
    }

    function handlePlayAudio() {
        if (isMockTest) return
        if (session[qIndex]) speak(session[qIndex].audioText, currentLevel)
        setUsedAudio(true)
    }

    function handleToggleTranslate() {
        if (isMockTest) return
        if (phase === 'answering' && currentLevel < 5) setUsedTranslate(true)
        setShowTranslate(prev => !prev)
    }

    function handleWordClick(word: string) {
        if (isMockTest) return
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
        const vocab = VOCABULARY_BANK.find(v => v.en.toLowerCase() === cleanWord)
        if (vocab) {
            setLookupWord(vocab.id)
            if (!tappedWords.includes(vocab.id)) {
                setTappedWords(prev => [...prev, vocab.id])
                if (onVocabTap) onVocabTap(vocab.id)
            }
        }
    }

    const renderPromptWithLookup = (prompt: string) => {
        if (!prompt) return null
        if (isMockTest) return <span>{prompt}</span>
        return prompt.split(' ').map((word, idx) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
            const vocab = VOCABULARY_BANK.find(v => v.en.toLowerCase() === cleanWord)
            if (vocab) {
                return <span key={idx} onClick={() => handleWordClick(word)} style={{ cursor: 'pointer', borderBottom: '2px dashed #22c55e', paddingBottom: '2px' }} title="Chạm để tra từ">{word}{' '}</span>
            }
            return <span key={idx}>{word} </span>
        })
    }

    function openFlashcards() {
        const today = new Date().toISOString().split('T')[0]
        const dueVocab = VOCABULARY_BANK.filter(v => {
            const p = progress.vocabProgress[v.id]
            if (!p) return true
            if (p.box === 4) return false
            const daysToWait = p.box === 1 ? 1 : p.box === 2 ? 2 : 4
            const diffDays = Math.ceil(Math.abs(new Date(today).getTime() - new Date(p.lastSeen).getTime()) / (1000 * 60 * 60 * 24))
            return diffDays >= daysToWait
        })
        setFlashcards(dueVocab.sort(() => Math.random() - 0.5).slice(0, 5))
        setCardIndex(0)
        setIsFlipped(false)
        setView('flashcards')
    }

    // ================= MÀN HÌNH MENU =================
    if (view === 'menu') {
        return (
            <main className="english-math">
                <div className="math-top-bar"><button className="math-back-button" onClick={onBack}>← Quay về bản đồ</button></div>
                <div className="eng-container">
                    <header className="eng-header"><h1>🇬🇧 TOÁN TIẾNG ANH</h1><p>Học toán và làm quen với tiếng Anh cùng bạn Sóc!</p></header>
                    <div className="eng-menu">
                        <button className="eng-card vocab-card" onClick={openFlashcards} style={{ padding: '40px', background: '#e0f2fe', border: '4px solid #38bdf8', boxShadow: '0 8px 0 #0284c7' }}>
                            <span className="t-icon" style={{ fontSize: '80px', display: 'block', marginBottom: '16px' }}>🔤</span>
                            <h2 style={{ color: '#0284c7', margin: 0, fontSize: '28px' }}>Học Từ vựng</h2>
                            <p style={{ color: '#0369a1', fontWeight: 700, marginTop: '8px' }}>Ôn tập Flashcard mỗi ngày</p>
                        </button>
                        <div className="eng-levels-card">
                            <h2>🎯 Luyện tập (5 Cấp độ)</h2>
                            <div className="eng-level-grid">
                                {([1, 2, 3, 4, 5] as EnglishLevel[]).map(lvl => {
                                    const status = getLevelStatus(lvl, progress)
                                    const stars = calculateEnglishStars(progress.levels[lvl])
                                    const recent = progress.recent[lvl] || []
                                    const acc = recent.length > 0 ? Math.round((recent.filter(Boolean).length / recent.length) * 100) : 0
                                    return (
                                        <div key={lvl} className="eng-level-wrapper">
                                            <button className={`eng-level-card lvl-${lvl} ${status.state !== 'open' ? 'locked' : ''}`} onClick={() => status.state === 'open' && startLevel(lvl, false)} disabled={status.state !== 'open'}>
                                                <div className="eng-level-title">Level {lvl}</div>
                                                <div className="eng-level-name">{lvl === 1 ? 'Seeds' : lvl === 2 ? 'Sprouts' : lvl === 3 ? 'Explorers' : lvl === 4 ? 'Challengers' : 'Champions'}</div>
                                                <div className="eng-level-stars">{[...Array(5)].map((_, i) => <span key={i}>{i < stars ? '⭐' : '☆'}</span>)}</div>
                                                {status.state === 'locked' && <div className="eng-level-locked-reason">🔒 {status.reason}</div>}
                                                {status.state === 'soon' && <div className="eng-level-locked-reason">🚧 Sắp ra mắt</div>}
                                                {status.state === 'open' && recent.length > 0 && <div className="eng-level-acc">Độ chính xác: {acc}%</div>}
                                            </button>
                                            {status.state === 'open' && (
                                                <button className="mock-test-btn" onClick={() => startLevel(lvl, true)}>📝 Thi thử</button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    // ================= MÀN HÌNH FLASHCARD =================
    if (view === 'flashcards') {
        if (flashcards.length === 0) {
            return (
                <main className="english-math">
                    <div className="math-top-bar"><button className="math-back-button" onClick={() => setView('menu')}>← Menu</button></div>
                    <div className="eng-container" style={{ textAlign: 'center', marginTop: '100px' }}>
                        <h1>🎉 Tuyệt vời! Hôm nay con không có từ nào cần ôn tập.</h1>
                        <button className="btn-start-adventure" onClick={() => setView('menu')} style={{ marginTop: '20px' }}>Về Menu</button>
                    </div>
                </main>
            )
        }
        const card = flashcards[cardIndex]
        return (
            <main className="english-math">
                <div className="math-top-bar"><button className="math-back-button" onClick={() => setView('menu')}>← Menu</button></div>
                <div className="eng-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ color: '#15803d', fontSize: '28px', marginBottom: '20px' }}>Ôn tập từ vựng ({cardIndex + 1}/{flashcards.length})</h2>
                    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                        <div className="flashcard-inner">
                            <div className="flashcard-front">
                                <div className="flashcard-emoji">{card.emoji || '📚'}</div>
                                <h1 className="flashcard-word">{card.en}</h1>
                                <p className="flashcard-hint">(Chạm để xem nghĩa)</p>
                                <button className="audio-btn big" onClick={(e) => { e.stopPropagation(); speak(card.en, 1) }}>🔊 Nghe</button>
                            </div>
                            <div className="flashcard-back">
                                <h2 className="flashcard-meaning">{card.vi}</h2>
                                <p className="flashcard-example-en">{card.example}</p>
                                <p className="flashcard-example-vi">{card.exampleVi}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                        <button className="btn-secondary" onClick={() => { setIsFlipped(false); setCardIndex(prev => Math.max(0, prev - 1)) }} disabled={cardIndex === 0}>Thẻ trước</button>
                        <button className="btn-start-adventure" onClick={() => {
                            if (cardIndex + 1 >= flashcards.length) setView('menu')
                            else { setIsFlipped(false); setCardIndex(prev => prev + 1) }
                        }}>{cardIndex + 1 >= flashcards.length ? 'Hoàn thành' : 'Thẻ tiếp theo'}</button>
                    </div>
                </div>
            </main>
        )
    }

    // ================= MÀN HÌNH TỔNG KẾT =================
    if (view === 'summary') {
        const stars = calculateEnglishStars(progress.levels[currentLevel])
        const nextStars = stars < 5 ? ENGLISH_STAR_THRESHOLDS[stars] : 0
        const currentXp = progress.levels[currentLevel].xp
        return (
            <main className="english-math">
                <div className="math-top-bar"><button className="math-back-button" onClick={() => setView('menu')}>← Menu Tiếng Anh</button></div>
                <div className="eng-container eng-summary">
                    <span style={{ fontSize: '80px' }}>🏆</span>
                    <h1>Hoàn thành bài học!</h1>
                    <p className="eng-summary-score">Kết quả: <strong>{sessionCorrect} / {ENGLISH_SESSION_SIZE}</strong> câu đúng</p>
                    <div className="eng-summary-stars">{[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: '40px' }}>{i < stars ? '⭐' : '☆'}</span>)}</div>
                    {nextStars > 0 && <p className="eng-summary-xp">Cần thêm {nextStars - currentXp} XP để lên sao tiếp theo</p>}
                    <div className="eng-summary-actions">
                        <button className="btn-start-adventure" onClick={() => startLevel(currentLevel, isMockTest)}>Chơi tiếp</button>
                        <button className="btn-secondary" onClick={() => setView('menu')}>Về menu</button>
                    </div>
                </div>
            </main>
        )
    }

    // ================= MÀN HÌNH CHƠI (PLAYING) =================
    const q = session[qIndex]

    if (!q) {
        return (
            <main className="english-math">
                <div className="eng-container" style={{ padding: '50px', textAlign: 'center' }}>
                    <p>Đang tải câu hỏi...</p>
                    <button className="btn-secondary" onClick={() => setView('menu')}>Về menu</button>
                </div>
            </main>
        )
    }

    const canShowTranslate = currentLevel < 5 || phase === 'revealed'
    const lookupVocab = lookupWord ? VOCABULARY_BANK.find(v => v.id === lookupWord) : null

    // LỚP BỌC THÉP: Lọc đáp án rác, chỉ lấy tối đa 4 đáp án duy nhất
    const safeOptions = Array.isArray(q.options) ? Array.from(new Set(q.options)).slice(0, 4) : []

    return (
        <main className="english-math">
            <div className="math-top-bar">
                <button className="math-back-button" onClick={() => setView('menu')}>← Quay lại</button>
                <div className="eng-top-info">
                    <span className="eng-q-counter">Câu {qIndex + 1}/{ENGLISH_SESSION_SIZE}</span>
                    <span className={`eng-timer ${(!isMockTest && timeLeft <= 5) ? 'warning' : ''}`}>
                        {isMockTest ? `⏳ Tổng: ${Math.floor(mockTimer / 60)}:${String(mockTimer % 60).padStart(2, '0')}` : `⏱️ ${timeLeft}s`}
                    </span>
                </div>
            </div>

            <div className="eng-practice-container">
                <div className="eng-practice-header">
                    <span className="eng-badge">{isMockTest ? '📝 THI THỬ' : `Level ${currentLevel}`}</span>
                    <span className="eng-topic-badge">{ENGLISH_TOPIC_BADGE[q.topic] || q.topic}</span>
                </div>

                <div className="eng-question-card">
                    <div className="eng-prompt-row">
                        {!isMockTest && <button className="audio-btn big" onClick={handlePlayAudio} disabled={!isSpeechSupported()}>🔊 Audio</button>}
                        <h2 className="eng-prompt-text">{renderPromptWithLookup(q.prompt)}</h2>
                    </div>

                    {lookupVocab && (
                        <div style={{ background: '#f0fdf4', border: '2px solid #22c55e', padding: '16px', borderRadius: '12px', marginBottom: '20px', position: 'relative' }}>
                            <button onClick={() => setLookupWord(null)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                            <h3 style={{ margin: '0 0 8px', color: '#15803d', fontSize: '22px' }}>{lookupVocab.emoji} {lookupVocab.en} = {lookupVocab.vi}</h3>
                            <p style={{ margin: 0, color: '#475569', fontStyle: 'italic' }}>Ví dụ: {lookupVocab.example}</p>
                            <button className="audio-btn" style={{ marginTop: '8px' }} onClick={() => speak(lookupVocab.en, 1)}>🔊 Nghe</button>
                        </div>
                    )}

                    {/* VISUAL - Defensive Render */}
                    {q.visual && q.visual.type === 'clock' && (
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                            <ClockFace hour={q.visual.hour} minute={q.visual.minute} />
                        </div>
                    )}
                    {q.visual && q.visual.type === 'emoji' && (
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                            {q.visual.text === '🟦' ? (
                                <svg width="120" height="120" viewBox="0 0 100 100">
                                    <rect x="10" y="10" width="80" height="80" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="4" rx="6" />
                                </svg>
                            ) : q.visual.text === '🔺' ? (
                                <svg width="120" height="120" viewBox="0 0 100 100">
                                    <polygon points="50,10 90,90 10,90" fill="#fbbf24" stroke="#b45309" strokeWidth="4" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <div style={{ fontSize: '80px' }}>{q.visual.text}</div>
                            )}
                        </div>
                    )}
                    {q.visual && q.visual.type === 'balance' && (
                        <BalanceScale leftWeight={q.visual.leftWeight} rightWeight={q.visual.rightWeight} itemEmoji={q.visual.itemEmoji} itemWeight={q.visual.itemWeight} numLeft={q.visual.numLeft} numRight={q.visual.numRight} />
                    )}
                    {q.visual && q.visual.type === 'equation' && (
                        <VisualEquation lines={q.visual.lines} />
                    )}
                    {q.visual && q.visual.type === 'pictograph' && (
                        <Pictograph data={q.visual.data} icon={q.visual.icon} multiplier={q.visual.multiplier} />
                    )}
                    {q.visual && q.visual.type === 'thermometer' && (
                        <Thermometer temp={q.visual.temp} />
                    )}
                    {q.visual && q.visual.type === 'peopleLine' && (
                        <PeopleLine letters={q.visual.letters} swap1={q.visual.swap1} swap2={q.visual.swap2} />
                    )}
                    {q.visual && ['lines', 'line_segments', 'count_squares', 'count_circles', 'composite_triangles', 'symmetry', 'iso_blocks', 'route_path'].includes(q.visual.type) && (
                        <GeometrySVG visual={q.visual} />
                    )}
                    {q.visual && q.visual.type === 'calendar' && (
                        <Calendar monthName={q.visual.monthName} startDay={q.visual.startDay} daysInMonth={q.visual.daysInMonth} eventDay={q.visual.eventDay} />
                    )}
                    {q.visual && q.visual.type === 'magic_square' && (
                        <MagicSquare visual={q.visual} />
                    )}
                    {q.visual && q.visual.type === 'coins' && (
                        <CoinVisual visual={q.visual} />
                    )}

                    {!isMockTest && (
                        <div className="eng-translate-section">
                            {canShowTranslate ? (
                                <button className="translate-btn" onClick={handleToggleTranslate}>{showTranslate ? '🙈 Ẩn dịch' : '🇻🇳 Xem dịch'}</button>
                            ) : (
                                <button className="translate-btn locked" disabled>🔒 Mở khóa sau khi trả lời</button>
                            )}
                            {showTranslate && <p className="eng-prompt-vi">{q.promptVi}</p>}
                        </div>
                    )}

                    <div className="eng-options-grid">
                        {safeOptions.map(opt => {
                            const isChosen = opt === selected
                            const isRight = opt === q.answer
                            let cls = 'eng-option'
                            if (phase === 'revealed') {
                                if (isRight) cls += ' correct'
                                else if (isChosen) cls += ' incorrect'
                            }
                            return (
                                <button key={opt} className={cls} onClick={() => finishQuestion(opt)} disabled={phase === 'revealed'}>{opt}</button>
                            )
                        })}
                    </div>

                    {phase === 'revealed' && (
                        <div className="eng-feedback">
                            <div className="eng-feedback-header">
                                <span className={`eng-feedback-icon ${selected === q.answer ? 'correct' : 'incorrect'}`}>
                                    {selected === q.answer ? '✅' : '❌'}
                                </span>
                                <h3>{selected === q.answer ? 'Chính xác!' : (selected === null ? 'Hết giờ!' : 'Chưa đúng!')}</h3>
                            </div>

                            <div className="eng-feedback-actions">
                                <button className="btn-hint" onClick={() => setShowHint(!showHint)}>
                                    {showHint ? '🙈 Ẩn giải thích' : '💡 Hints'}
                                </button>
                                <button className="btn-next-question" onClick={handleNext}>
                                    {qIndex + 1 >= ENGLISH_SESSION_SIZE ? 'Xem kết quả ➜' : 'Câu tiếp theo ➜'}
                                </button>
                            </div>

                            {showHint && (
                                <div className="eng-explanation">
                                    <div className="eng-exp-lang">
                                        <strong>EN:</strong>
                                        <div className="eng-exp-steps">
                                            {(q.explanation || []).map((step, i) => (
                                                <div key={i} className="eng-exp-step">{step}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="eng-exp-lang" style={{ marginTop: '16px' }}>
                                        <strong>VI:</strong>
                                        <div className="eng-exp-steps">
                                            {(q.explanationVi || []).map((step, i) => (
                                                <div key={i} className="eng-exp-step">{step}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}