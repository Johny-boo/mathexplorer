import { useState, useEffect, useRef } from 'react'
import type { EnglishLevel, EnglishTopic, EnglishProgress, EnglishQuestion } from './core/types'
import {
    ENGLISH_LEVEL_TO_DIFFICULTY,
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
}

export default function EnglishMath({ onBack, progress, onAnswer, onVocabTap }: Props) {
    const [view, setView] = useState<'menu' | 'playing' | 'summary' | 'flashcards'>('menu')
    const [currentLevel, setCurrentLevel] = useState<EnglishLevel>(1)

    // --- State Phiên chơi ---
    const [session, setSession] = useState<EnglishQuestion[]>([])
    const [qIndex, setQIndex] = useState(0)
    const [phase, setPhase] = useState<'answering' | 'revealed'>('answering')
    const [selected, setSelected] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState(30)
    const [sessionCorrect, setSessionCorrect] = useState(0)

    // --- State Meta ---
    const [usedAudio, setUsedAudio] = useState(false)
    const [usedTranslate, setUsedTranslate] = useState(false)
    const [showTranslate, setShowTranslate] = useState(false)

    // --- State Tra từ ---
    const [lookupWord, setLookupWord] = useState<string | null>(null)
    const [tappedWords, setTappedWords] = useState<string[]>([])

    // --- State Flashcard ---
    const [flashcards, setFlashcards] = useState<any[]>([])
    const [cardIndex, setCardIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    // --- State Mock Test ---
    const [isMockTest, setIsMockTest] = useState(false)
    const [mockTimer, setMockTimer] = useState(0)

    // --- Refs cho Timer ---
    const deadlineRef = useRef<number>(0)
    const answeredRef = useRef<boolean>(false)
    const startTimeRef = useRef<number>(0)

    // Dọn dẹp âm thanh khi thoát
    useEffect(() => {
        return () => stopSpeaking()
    }, [view])

    // --- Logic Đồng hồ đếm ngược ---
    useEffect(() => {
        if (view !== 'playing' || phase !== 'answering') return

        if (isMockTest) {
            const id = setInterval(() => {
                setMockTimer(t => {
                    if (t <= 1) {
                        clearInterval(id)
                        finishQuestion(null)
                        return 0
                    }
                    return t - 1
                })
            }, 1000)
            return () => clearInterval(id)
        } else {
            const id = setInterval(() => {
                const left = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000))
                setTimeLeft(left)
                if (left === 0) finishQuestion(null)
            }, 250)
            return () => clearInterval(id)
        }
    }, [view, phase, qIndex, isMockTest])

    // ================= KHỞI TẠO BÀI HỌC =================
    function startLevel(level: EnglishLevel, isMock = false) {
        setCurrentLevel(level)
        setIsMockTest(isMock)
        const newSession = buildSession(level, ENGLISH_SESSION_SIZE)
        setSession(newSession)
        setQIndex(0)
        setSessionCorrect(0)
        initQuestionState(level)

        if (isMock) {
            setMockTimer(ENGLISH_TIME_BY_LEVEL[level] * ENGLISH_SESSION_SIZE)
        }
        setView('playing')
    }

    function initQuestionState(level: EnglishLevel) {
        setPhase('answering')
        setSelected(null)
        setUsedAudio(false)
        setUsedTranslate(false)
        setShowTranslate(level === 1)
        setTappedWords([])
        setLookupWord(null)

        answeredRef.current = false
        startTimeRef.current = Date.now()
        deadlineRef.current = Date.now() + ENGLISH_TIME_BY_LEVEL[level] * 1000
        setTimeLeft(ENGLISH_TIME_BY_LEVEL[level])
        stopSpeaking()
    }

    // ================= XỬ LÝ TRẢ LỜI =================
    function finishQuestion(choice: string | null) {
        if (answeredRef.current) return
        answeredRef.current = true

        const q = session[qIndex]
        const isCorrect = choice === q.answer
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)

        setSelected(choice)
        setPhase('revealed')
        stopSpeaking()
        setShowTranslate(true)

        if (isCorrect) setSessionCorrect(prev => prev + 1)

        onAnswer({
            level: currentLevel,
            topic: q.topic,
            correct: isCorrect,
            usedAudio,
            usedTranslate,
            timeSpent,
            timedOut: choice === null,
            vocabIds: q.vocab
        })
    }

    function handleNext() {
        if (qIndex + 1 >= session.length) {
            setView('summary')
        } else {
            setQIndex(prev => prev + 1)
            initQuestionState(currentLevel)
        }
    }

    // ================= AUDIO & DỊCH =================
    function handlePlayAudio() {
        if (isMockTest) return
        const q = session[qIndex]
        speak(q.audioText, currentLevel)
        setUsedAudio(true)
    }

    function handleToggleTranslate() {
        if (isMockTest) return
        if (phase === 'answering' && currentLevel < 5) {
            setUsedTranslate(true)
        }
        setShowTranslate(prev => !prev)
    }

    // ================= TRA TỪ VỰNG (TAP TO LOOKUP) =================
    function handleWordClick(word: string) {
        if (isMockTest) return
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
        const vocab = VOCABULARY_BANK.find(v => v.en.toLowerCase() === cleanWord)
        if (vocab) {
            setLookupWord(vocab.id)
            if (!tappedWords.includes(vocab.id)) {
                setTappedWords(prev => [...prev, vocab.id])
                onVocabTap(vocab.id)
            }
        }
    }

    const renderPromptWithLookup = (prompt: string) => {
        if (isMockTest) return <span>{ prompt } </span>

        const words = prompt.split(' ')
        return words.map((word, idx) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
            const vocab = VOCABULARY_BANK.find(v => v.en.toLowerCase() === cleanWord)

            if (vocab) {
                return (
                    <span 
                        key= { idx }
                onClick = {() => handleWordClick(word)
}
style = {{ cursor: 'pointer', borderBottom: '2px dashed #22c55e', paddingBottom: '2px' }}
title = "Chạm để tra từ"
    >
{ word }{ ' ' }
</span>
                )
            }
return <span key={ idx }> { word } </span>
        })
    }

// ================= FLASHCARDS =================
function openFlashcards() {
    const today = new Date().toISOString().split('T')[0]
    const dueVocab = VOCABULARY_BANK.filter(v => {
        const p = progress.vocabProgress[v.id]
        if (!p) return true
        if (p.box === 4) return false
        const daysToWait = p.box === 1 ? 1 : p.box === 2 ? 2 : 4
        const lastSeen = new Date(p.lastSeen)
        const diffDays = Math.ceil(Math.abs(new Date(today).getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= daysToWait
    })

    const selectedVocab = dueVocab.sort(() => Math.random() - 0.5).slice(0, 5)
    setFlashcards(selectedVocab)
    setCardIndex(0)
    setIsFlipped(false)
    setView('flashcards')
}

// ================= MÀN HÌNH MENU =================
if (view === 'menu') {
    return (
        <main className= "english-math" >
        <div className="math-top-bar" >
            <button className="math-back-button" onClick = { onBack } >← Quay về bản đồ </button>
                </div>
                < div className = "eng-container" >
                    <header className="eng-header" >
                        <h1>🇬🇧 TOÁN TIẾNG ANH </h1>
                            < p > Học toán và làm quen với tiếng Anh cùng bạn Sóc! </p>
                                </header>

                                < div className = "eng-menu" >
                                    <button className="eng-card vocab-card" onClick = { openFlashcards } style = {{ padding: '40px', background: '#e0f2fe', border: '4px solid #38bdf8', boxShadow: '0 8px 0 #0284c7' }
}>
    <span className="t-icon" style = {{ fontSize: '80px', display: 'block', marginBottom: '16px' }}>🔤</span>
        < h2 style = {{ color: '#0284c7', margin: 0, fontSize: '28px' }}> Học Từ vựng </h2>
            < p style = {{ color: '#0369a1', fontWeight: 700, marginTop: '8px' }}> Ôn tập Flashcard mỗi ngày </p>
                </button>

                < div className = "eng-levels-card" >
                    <h2>🎯 Luyện tập(5 Cấp độ) </h2>
                        < div className = "eng-level-grid" >
                            {([1, 2, 3, 4, 5] as EnglishLevel[]).map(lvl => {
                                const status = getLevelStatus(lvl, progress)
                                const stars = calculateEnglishStars(progress.levels[lvl])
                                const recent = progress.recent[lvl] || []
                                const acc = recent.length > 0 ? Math.round((recent.filter(Boolean).length / recent.length) * 100) : 0

                                return (
                                    <div key= { lvl } className = "eng-level-wrapper" >
                                        <button 
                                                className={ `eng-level-card lvl-${lvl} ${status.state !== 'open' ? 'locked' : ''}` }
                                onClick = {() => status.state === 'open' && startLevel(lvl, false)
                            }
                                                disabled = { status.state !== 'open' }
                                >
                                <div className="eng-level-title" > Level { lvl } </div>
                            < div className = "eng-level-name" >
                            { lvl === 1 ? 'Seeds' : lvl === 2 ? 'Sprouts' : lvl === 3 ? 'Explorers' : lvl === 4 ? 'Challengers' : 'Champions'}
                                </div>
                                < div className = "eng-level-stars" >
                                { [...Array(5)].map((_, i) => <span key={ i } > { i<stars ? '⭐': '☆' } </span>) }
                                </div>
                                                { status.state === 'locked' && <div className="eng-level-locked-reason">🔒 { status.reason } </div>}
                                { status.state === 'soon' && <div className="eng-level-locked-reason">🚧 Sắp ra mắt</ div >}
                                { status.state === 'open' && recent.length > 0 && <div className="eng-level-acc"> Độ chính xác: { acc } % </div> }
                                </button>
                                            
                                            {
                                    status.state === 'open' && (
                                        <button 
                                                    className="mock-test-btn"
                                                    onClick = {() => startLevel(lvl, true)
                                }
                                >
                                                    📝 Thi thử
                            </button>
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
            <main className= "english-math" >
            <div className="math-top-bar" > <button className="math-back-button" onClick = {() => setView('menu')
    }>← Menu < /button></div >
        <div className="eng-container" style = {{ textAlign: 'center', marginTop: '100px' }
}>
    <h1>🎉 Tuyệt vời! Hôm nay con không có từ nào cần ôn tập.</h1>
        < button className = "btn-start-adventure" onClick = {() => setView('menu')} style = {{ marginTop: '20px' }}> Về Menu </button>
            </div>
            </main>
            )
        }

const card = flashcards[cardIndex]
return (
    <main className= "english-math" >
    <div className="math-top-bar" > <button className="math-back-button" onClick = {() => setView('menu')}>← Menu < /button></div >
        <div className="eng-container" style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={ { color: '#15803d', fontSize: '28px', marginBottom: '20px' } }> Ôn tập từ vựng({ cardIndex + 1}/{flashcards.length})</h2 >

                <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick = {() => setIsFlipped(!isFlipped)}>
            <div className="flashcard-inner" >
            <div className="flashcard-front" >
            <div className="flashcard-emoji" > { card.emoji || '📚' } </div>
            < h1 className = "flashcard-word" > { card.en } </h1>
            < p className = "flashcard-hint" > (Chạm để xem nghĩa) </p>
                < button
className = "audio-btn big"
onClick = {(e) => { e.stopPropagation(); speak(card.en, 1) }}
                                >
                                    🔊 Nghe
    </button>
    </div>
    < div className = "flashcard-back" >
        <h2 className="flashcard-meaning" > { card.vi } </h2>
            < p className = "flashcard-example-en" > { card.example } </p>
                < p className = "flashcard-example-vi" > { card.exampleVi } </p>
                    </div>
                    </div>
                    </div>

                    < div style = {{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                        <button className="btn-secondary" onClick = {() => { setIsFlipped(false); setCardIndex(prev => Math.max(0, prev - 1)) }} disabled = { cardIndex === 0}> Thẻ trước </button>
                            < button className = "btn-start-adventure" onClick = {() => {
    if (cardIndex + 1 >= flashcards.length) setView('menu')
    else { setIsFlipped(false); setCardIndex(prev => prev + 1) }
}}> { cardIndex + 1 >= flashcards.length ? 'Hoàn thành' : 'Thẻ tiếp theo'}</button>
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
        <main className= "english-math" >
        <div className="math-top-bar" > <button className="math-back-button" onClick = {() => setView('menu')
}>← Menu Tiếng Anh < /button></div >
    <div className="eng-container eng-summary" >
        <span style={ { fontSize: '80px' } }>🏆</span>
            < h1 > Hoàn thành bài học! </h1>
                < p className = "eng-summary-score" > Kết quả: <strong>{ sessionCorrect } / { ENGLISH_SESSION_SIZE } < /strong> câu đúng</p >
                    <div className="eng-summary-stars" >
                    { [...Array(5)].map((_, i) => <span key={ i } style = {{ fontSize: '40px' }} > { i<stars ? '⭐': '☆' } </span>)}
</div>
{ nextStars > 0 && <p className="eng-summary-xp" > Cần thêm { nextStars - currentXp } XP để lên sao tiếp theo </p> }
<div className="eng-summary-actions" >
    <button className="btn-start-adventure" onClick = {() => startLevel(currentLevel, isMockTest)}> Chơi tiếp </button>
        < button className = "btn-secondary" onClick = {() => setView('menu')}> Về menu </button>
            </div>
            </div>
            </main>
        )
    }

// ================= MÀN HÌNH CHƠI (PLAYING) =================
const q = session[qIndex]
const canShowTranslate = currentLevel < 5 || phase === 'revealed'
const lookupVocab = lookupWord ? VOCABULARY_BANK.find(v => v.id === lookupWord) : null

return (
    <main className= "english-math" >
    <div className="math-top-bar" >
        <button className="math-back-button" onClick = {() => setView('menu')}>← Menu Tiếng Anh </button>
            < div className = "eng-top-info" >
                <span className="eng-q-counter" > Câu { qIndex + 1 } /{ENGLISH_SESSION_SIZE}</span >
                    <span className={ `eng-timer ${(!isMockTest && timeLeft <= 5) ? 'warning' : ''}` }>
                        {
                            isMockTest
                            ? `⏳ Tổng: ${Math.floor(mockTimer / 60)}:${String(mockTimer % 60).padStart(2, '0')}` 
                            : `⏱️ ${timeLeft}s`
                        }
</span>
    </div>
    </div>

    < div className = "eng-practice-container" >
        <div className="eng-practice-header" >
            <span className="eng-badge" > { isMockTest? '📝 THI THỬ': `Level ${currentLevel}` } </span>
                < span className = "eng-topic-badge" > { ENGLISH_TOPIC_BADGE[q.topic]} </span>
                    </div>

                    < div className = "eng-question-card" >
                        <div className="eng-prompt-row" >
                            {!isMockTest && (
                                <button className="audio-btn big" onClick = { handlePlayAudio } disabled = {!isSpeechSupported()}>🔊 Audio </button>
                        )}
<h2 className="eng-prompt-text" > { renderPromptWithLookup(q.prompt) } </h2>
    </div>

{
    lookupVocab && (
        <div style={ { background: '#f0fdf4', border: '2px solid #22c55e', padding: '16px', borderRadius: '12px', marginBottom: '20px', position: 'relative' } }>
            <button onClick={ () => setLookupWord(null) } style = {{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }
}>✕</button>
    < h3 style = {{ margin: '0 0 8px', color: '#15803d', fontSize: '22px' }}>
    { lookupVocab.emoji } { lookupVocab.en } = { lookupVocab.vi }
</h3>
    < p style = {{ margin: 0, color: '#475569', fontStyle: 'italic' }}> Ví dụ: { lookupVocab.example } </p>
        < button className = "audio-btn" style = {{ marginTop: '8px' }} onClick = {() => speak(lookupVocab.en, 1)}>🔊 Nghe </button>
            </div>
                    )}

{
    q.visual?.type === 'clock' && (
        <div style={ { display: 'flex', justifyContent: 'center', margin: '20px 0' } }>
            <ClockFace hour={ q.visual.hour } minute = { q.visual.minute } />
                </div>
                    )
}
{
    q.visual?.type === 'emoji' && (
        <div style={ { fontSize: '80px', textAlign: 'center', margin: '20px 0' } }> { q.visual.text } </div>
                    )
}

{
    !isMockTest && (
        <div className="eng-translate-section" >
            {
                canShowTranslate?(
                                <button className = "translate-btn" onClick = { handleToggleTranslate } >
                    { showTranslate? '🙈 Ẩn dịch': '🇻🇳 Xem dịch' }
                        </button>
                ): (
                        <button className = "translate-btn locked" disabled>🔒 Mở khóa sau khi trả lời</ button >
                            )
}
{ showTranslate && <p className="eng-prompt-vi" > { q.promptVi } </p> }
</div>
                    )}

<div className="eng-options-grid" >
{
    q.options.map(opt => {
        const isChosen = opt === selected
        const isRight = opt === q.answer
        let cls = 'eng-option'
        if (phase === 'revealed') {
            if (isRight) cls += ' correct'
            else if (isChosen) cls += ' incorrect'
        }
        return (
            <button key= { opt } className = { cls } onClick = {() => finishQuestion(opt)
    } disabled = { phase === 'revealed'} >
{ opt }
    </button>
                            )
                        })}
</div>

{
    phase === 'revealed' && (
        <div className="eng-feedback" >
            <div className="eng-feedback-header" >
                <span className={ `eng-feedback-icon ${selected === q.answer ? 'correct' : 'incorrect'}` }>
                { selected === q.answer ? '✅' : '❌'
}
</span>
    < h3 > { selected === q.answer ? 'Chính xác!' : (selected === null ? 'Hết giờ!' : 'Chưa đúng!')}</h3>
        </div>
        < div className = "eng-explanation" >
            <p><strong>EN: </strong> {q.explanation.join(' ')}</p >
                <p><strong>VI: </strong> {q.explanationVi.join(' ')}</p >
                    </div>
                    < button className = "btn-next-question" onClick = { handleNext } >
                        { qIndex + 1 >= ENGLISH_SESSION_SIZE ? 'Xem kết quả ➜' : 'Câu tiếp theo ➜'}
</button>
    </div>
                    )}
</div>
    </div>
    </main>
    )
}