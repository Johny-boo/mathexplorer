import { useEffect, useState } from 'react'

type Operation = 'addition' | 'subtraction' | 'multiplication'
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

type Question = {
    a: number
    b: number
    answer: number
    options: number[]
    symbol: string
}

type MathPracticeProps = {
    onScoreChange?: (score: number) => void
    onCorrectAnswer?: (difficulty: Difficulty) => void
    onBack?: () => void
}

type FeedbackState = 'none' | 'correct' | 'incorrect' | 'exploding' | 'review'

type Particle = {
    tx: number
    ty: number
    color: string
    delay: number
    id: number
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: readonly T[]): T[] {
    const out = [...arr]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}

const correctSounds = [
    new Audio('/sounds/yes.mp3'),
    new Audio('/sounds/yes1.mp3'),
    new Audio('/sounds/yes2.mp3'),
    new Audio('/sounds/yes3.mp3')
];

const wrongSounds = [
    new Audio('/sounds/no.mp3'),
    new Audio('/sounds/no1.mp3'),
    new Audio('/sounds/no2.mp3'),
    new Audio('/sounds/no3.mp3')
];

const bombSounds = [
    new Audio('/sounds/bom.mp3'),
    new Audio('/sounds/bom1.mp3')
];

function playSound(type: 'correct' | 'incorrect' | 'bomb') {
    try {
        let sounds = correctSounds;
        let volume = 1.0;

        if (type === 'incorrect') {
            sounds = wrongSounds;
            volume = 0.8;
        } else if (type === 'bomb') {
            sounds = bombSounds;
            volume = 1.0;
        }

        const randomIndex = Math.floor(Math.random() * sounds.length);
        const audio = sounds[randomIndex];

        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(e => console.warn("Trình duyệt chặn phát âm thanh:", e));
    } catch (error) {
        console.warn('Lỗi phát âm thanh:', error);
    }
}

function getTimeForTier(tier: number): number {
    switch (tier) {
        case 1: return 10
        case 2: return 13
        case 3: return 15
        case 4: return 18
        case 5: return 25
        default: return 10
    }
}

function getDifficultyFromTier(tier: number): Difficulty {
    if (tier <= 2) return 'easy'
    if (tier === 3) return 'medium'
    if (tier === 4) return 'hard'
    return 'expert'
}

function createQuestion(operation: Operation, tier: number): Question {
    let a = 0, b = 0, answer = 0, symbol = '+'

    if (operation === 'addition') {
        symbol = '+'
        if (tier === 1) { a = randInt(1, 5); b = randInt(1, 4) }
        else if (tier === 2) { a = randInt(1, 4) * 10; b = randInt(1, 4) * 10 }
        else if (tier === 3) { a = randInt(11, 79); b = randInt(2, 9) }
        else if (tier === 4) {
            const unitA = randInt(1, 5); const unitB = randInt(1, 9 - unitA)
            a = randInt(1, 4) * 10 + unitA; b = randInt(1, 4) * 10 + unitB
        }
        else { a = randInt(15, 89); b = randInt(15, 89) }
        answer = a + b
    }
    else if (operation === 'subtraction') {
        symbol = '−'
        if (tier === 1) { a = randInt(2, 9); b = randInt(1, a - 1) }
        else if (tier === 2) { a = randInt(2, 9) * 10; b = randInt(1, (a / 10) - 1) * 10 }
        else if (tier === 3) { a = randInt(12, 79); b = randInt(2, 9) }
        else if (tier === 4) {
            const unitA = randInt(3, 9); const unitB = randInt(1, unitA - 1)
            a = randInt(3, 8) * 10 + unitA; b = randInt(1, 2) * 10 + unitB
        }
        else {
            const unitA = randInt(1, 5); const unitB = randInt(6, 9)
            a = randInt(4, 9) * 10 + unitA; b = randInt(1, 3) * 10 + unitB
        }
        answer = a - b
    }
    else {
        symbol = '×'
        if (tier === 1) { a = randInt(2, 5); b = randInt(2, 5) }
        else if (tier === 2) { a = randInt(2, 5); b = 10 }
        else if (tier === 3) { a = randInt(6, 9); b = randInt(6, 9) }
        else if (tier === 4) {
            const unit = randInt(1, 4)
            a = randInt(1, 4) * 10 + unit
            b = randInt(2, Math.floor(9 / unit))
        }
        else { a = randInt(11, 29); b = randInt(2, 5) }
        answer = a * b
    }

    const choices = new Set<number>([answer])
    const offsets = shuffle([-1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -10, 10, -20, 20])
    for (const off of offsets) {
        if (choices.size >= 4) break
        const candidate = answer + off
        if (candidate > 0 && candidate !== answer) choices.add(candidate)
    }
    let extra = 1
    while (choices.size < 4) {
        if (!choices.has(answer + extra)) choices.add(answer + extra)
        extra++
    }

    return { a, b, answer, options: shuffle([...choices]), symbol }
}

export default function MathPractice({ onScoreChange, onCorrectAnswer, onBack }: MathPracticeProps) {
    const [operation, setOperation] = useState<Operation>('addition')
    const [baseTier, setBaseTier] = useState<number>(1)
    const [currentTier, setCurrentTier] = useState<number>(1)
    const [recentAnswers, setRecentAnswers] = useState<boolean[]>([])
    const [promotionMessage, setPromotionMessage] = useState<string | null>(null)

    const [question, setQuestion] = useState(() => createQuestion('addition', 1))
    const [selected, setSelected] = useState<number | null>(null)
    const [score, setScore] = useState(0)
    const [answered, setAnswered] = useState(0)

    const maxTime = getTimeForTier(currentTier)
    const [timeLeft, setTimeLeft] = useState(maxTime)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [timedOut, setTimedOut] = useState(false)

    const [feedbackState, setFeedbackState] = useState<FeedbackState>('none')
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        const interval = window.setInterval(() => setElapsedSeconds(p => p + 1), 1000)
        return () => window.clearInterval(interval)
    }, [])

    useEffect(() => {
        if (selected !== null || timedOut || feedbackState !== 'none') return
        const interval = window.setInterval(() => {
            setTimeLeft(previous => {
                if (previous <= 1) {
                    window.clearInterval(interval)
                    setTimedOut(true)
                    return 0
                }
                return previous - 1
            })
        }, 1000)
        return () => window.clearInterval(interval)
    }, [question, selected, timedOut, feedbackState])

    useEffect(() => {
        if (!timedOut || feedbackState !== 'none') return
        setFeedbackState('exploding')
        playSound('bomb')
    }, [timedOut, feedbackState])

    useEffect(() => {
        if (feedbackState === 'none' || feedbackState === 'review') return

        const timer = setTimeout(() => {
            if (feedbackState === 'correct') {
                nextQuestion()
            } else {
                setFeedbackState('review')
            }
        }, 3000)

        return () => clearTimeout(timer)
    }, [feedbackState])

    useEffect(() => {
        if (!promotionMessage) return
        const timer = setTimeout(() => setPromotionMessage(null), 3000)
        return () => clearTimeout(timer)
    }, [promotionMessage])

    function checkPromotion(isCorrect: boolean) {
        const newRecents = [...recentAnswers, isCorrect]
        if (newRecents.length >= 10) {
            const correctCount = newRecents.filter(Boolean).length
            let newTier = currentTier
            let msg = ''

            if (correctCount >= 8 && currentTier < 5) {
                newTier = currentTier + 1
                msg = '🎉 Tuyệt vời! Đã thăng cấp độ khó!'
            } else if (correctCount <= 3 && currentTier > baseTier) {
                newTier = currentTier - 1
                msg = '💪 Cố lên! Độ khó vừa được giảm nhẹ.'
            }

            if (newTier !== currentTier) {
                setCurrentTier(newTier)
                setPromotionMessage(msg)
            }
            setRecentAnswers([])
        } else {
            setRecentAnswers(newRecents)
        }
    }

    function nextQuestion() {
        setQuestion(createQuestion(operation, currentTier))
        setSelected(null)
        setTimedOut(false)
        setFeedbackState('none')
        setTimeLeft(getTimeForTier(currentTier))
    }

    function changeSettings(newOperation: Operation, newBaseTier: number) {
        setOperation(newOperation)
        setBaseTier(newBaseTier)
        setCurrentTier(newBaseTier)
        setRecentAnswers([])

        setQuestion(createQuestion(newOperation, newBaseTier))
        setSelected(null)
        setTimedOut(false)
        setFeedbackState('none')
        setTimeLeft(getTimeForTier(newBaseTier))
    }

    function chooseAnswer(value: number) {
        if (selected !== null || timedOut || feedbackState !== 'none') return
        setSelected(value)
        setAnswered(previous => previous + 1)

        const isCorrect = value === question.answer
        if (isCorrect) {
            setScore(previous => previous + 1)
            onScoreChange?.(1)
            onCorrectAnswer?.(getDifficultyFromTier(currentTier))
            setFeedbackState('correct')
            playSound('correct')

            const newParticles = Array.from({ length: 80 }).map((_, i) => {
                const angle = Math.random() * Math.PI * 2
                const distance = 150 + Math.random() * 350
                const tx = Math.cos(angle) * distance
                const ty = Math.sin(angle) * distance
                const colors = ['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#FF69B4', '#9400D3', '#00FFFF', '#FF1493']
                const color = colors[Math.floor(Math.random() * colors.length)]
                const delay = Math.random() * 0.2
                return { tx, ty, color, delay, id: i }
            })
            setParticles(newParticles)

        } else {
            setFeedbackState('incorrect')
            playSound('incorrect')
        }

        checkPromotion(isCorrect)
    }

    const showResult = feedbackState === 'review'
    const bombScale = 1 + ((maxTime - timeLeft) / maxTime) * 0.8
    const timerPercentage = (timeLeft / maxTime) * 100

    return (
        <main className={`math-practice ${(feedbackState === 'incorrect' || feedbackState === 'exploding') ? 'shake-screen' : ''}`}>

            {feedbackState === 'correct' && (
                <div className="result-overlay">
                    <div className="firework-container">
                        <div className="firework-core"></div>
                        {particles.map((p) => (
                            <div
                                key={p.id}
                                className="firework-particle"
                                style={{
                                    '--tx': `${p.tx}px`,
                                    '--ty': `${p.ty}px`,
                                    backgroundColor: p.color,
                                    boxShadow: `0 0 12px 2px ${p.color}`,
                                    animationDelay: `${p.delay}s`
                                } as React.CSSProperties}
                            />
                        ))}
                    </div>
                </div>
            )}

            {feedbackState === 'incorrect' && (
                <div className="result-overlay">
                    <div className="glass-shatter"></div>
                </div>
            )}

            {feedbackState === 'exploding' && (
                <div className="explosion-overlay">
                    <div className="explosion-flash"></div>
                    <div className="explosion-shockwave"></div>
                    <div className="explosion-particles">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`particle particle-${i + 1}`}>💥</div>
                        ))}
                    </div>
                </div>
            )}

            {promotionMessage && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: '#22C55E', color: 'white', padding: '12px 24px', borderRadius: '30px',
                    fontWeight: 'bold', fontSize: '18px', zIndex: 10000, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    animation: 'fade-slide-up 0.3s ease-out', whiteSpace: 'nowrap'
                }}>
                    {promotionMessage}
                </div>
            )}

            <div className="math-top-bar">
                <button type="button" className="math-back-button" onClick={onBack}>← Quay về bản đồ</button>
            </div>

            <header className="math-header">
                <div className="math-pirate-icon" aria-hidden="true">🏴‍☠️</div>
                <div className="math-heading-text">
                    <h2>THỬ THÁCH CỦA THUYỀN TRƯỞNG</h2>
                    <p>Câu đố số {answered + 1}</p>
                </div>
                <div className="math-question-counter">
                    <span>CÂU HỎI</span>
                    <strong>{answered + 1}</strong>
                </div>
            </header>

            <div className="math-practice-layout">
                <div className="math-practice-main">
                    <div className="math-timer-panel">
                        <div className="timer-left">
                            <div className={`bomb-container ${timeLeft <= 5 ? 'warning' : ''}`}>
                                <span className="bomb-icon" style={{ transform: `scale(${bombScale})` }}>
                                    {timeLeft > 0 ? '💣' : '💥'}
                                </span>
                                {timeLeft > 0 && <span className="bomb-fuse" style={{ transform: `scale(${bombScale})` }}>🔥</span>}
                            </div>
                            <strong className={timeLeft <= 5 ? 'timer-warning' : ''}>{timeLeft}s</strong>
                        </div>

                        <div className="timer-bar-container">
                            <div
                                className={`timer-bar ${timeLeft <= 5 ? 'warning' : ''}`}
                                style={{ width: `${timerPercentage}%` }}
                            ></div>
                        </div>

                        <span className="total-time">🏴‍☠️ Tổng: {elapsedSeconds}s</span>
                    </div>

                    <section className="math-question">
                        <div className="math-equation">
                            <span className="eq-box num">{question.a}</span>
                            <span className="eq-box op">{question.symbol}</span>
                            <span className="eq-box num">{question.b}</span>
                            <span className="eq-box eq">=</span>
                            <span className="eq-box q">?</span>
                        </div>

                        <p className="math-instruction">Chọn đáp án đúng bên dưới nhé!</p>

                        <div className="math-options">
                            {question.options.map((option) => {
                                const isCorrect = option === question.answer
                                const isSelected = option === selected
                                let className = `math-option`

                                if (showResult && isCorrect) {
                                    className += ' correct'
                                } else if (showResult && isSelected && !isCorrect) {
                                    className += ' incorrect'
                                } else if (showResult && !isCorrect) {
                                    className += ' faded'
                                }

                                return (
                                    <button key={option} type="button" className={className} onClick={() => chooseAnswer(option)} disabled={selected !== null || timedOut || feedbackState !== 'none'}>
                                        {option}
                                    </button>
                                )
                            })}
                        </div>

                        {showResult && (
                            <button type="button" className="btn-next-question" onClick={nextQuestion}>
                                CÂU TIẾP THEO ➜
                            </button>
                        )}
                    </section>

                    <footer className="math-score">
                        <div className="math-score-item">
                            <span aria-hidden="true">⭐</span>
                            <div><small>ĐIỂM SỐ</small><strong>{score}</strong></div>
                        </div>
                        <div className="math-score-divider" />
                        <div className="math-score-item">
                            <span aria-hidden="true">📝</span>
                            <div><small>ĐÃ TRẢ LỜI</small><strong>{answered}</strong></div>
                        </div>
                        <div className="math-score-divider" />
                        <div className="math-score-message">🌟 Cố lên, nhà thám hiểm!</div>
                    </footer>
                </div>

                <aside className="math-practice-sidebar">
                    <h3 className="sidebar-title">⚙️ Cài đặt</h3>
                    <section className="math-settings">
                        <label className="math-setting">
                            <span>🧮 Phép tính</span>
                            <select value={operation} onChange={e => changeSettings(e.target.value as Operation, baseTier)} disabled={feedbackState !== 'none' && feedbackState !== 'review'}>
                                <option value="addition">Phép cộng (+)</option>
                                <option value="subtraction">Phép trừ (−)</option>
                                <option value="multiplication">Phép nhân (×)</option>
                            </select>
                        </label>
                        <label className="math-setting">
                            <span>🚩 Điểm xuất phát</span>
                            <select value={baseTier} onChange={e => changeSettings(operation, Number(e.target.value))} disabled={feedbackState !== 'none' && feedbackState !== 'review'}>
                                <option value={1}>Dễ (Level 1)</option>
                                <option value={2}>Khá (Level 2)</option>
                                <option value={3}>Trung bình (Level 3)</option>
                                <option value={4}>Khó (Level 4)</option>
                                <option value={5}>Siêu khó (Level 5)</option>
                            </select>
                        </label>
                    </section>

                    <div style={{ marginTop: '24px', padding: '16px', background: '#FFF8E5', borderRadius: '16px', border: '2px dashed #E6C89C' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--mp-text-dark)', marginBottom: '8px' }}>
                            <span>Cấp độ hiện tại</span>
                            <span style={{ color: 'var(--mp-accent-blue)' }}>Level {currentTier}</span>
                        </div>
                        <div className="xp-bar" style={{ height: '12px', background: '#E6DAC3', borderRadius: '6px', overflow: 'hidden' }}>
                            <div className="xp-bar-fill" style={{ width: `${(recentAnswers.length / 10) * 100}%`, background: 'var(--mp-accent-gold)' }} />
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: '13px', textAlign: 'center', color: 'var(--mp-text-light)', fontWeight: 600 }}>
                            Đúng 8/10 câu để lên Level tiếp theo ({recentAnswers.filter(Boolean).length}/{recentAnswers.length} câu đúng)
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    )
}