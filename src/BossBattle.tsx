import { useState, useEffect } from 'react'
import type { Difficulty, SubSkillId, BossQuestion } from './core/types'
import { BOSS_QUESTION_COUNT, BOSS_PASS_XP, MATH_TIME_BY_TIER } from './core/constants'
import { createMathQ } from './core/mathQuestions'

type Props = {
    onBack: () => void
    onWin: () => void
    onLose: () => void
    onCorrect: (difficulty: Difficulty, subSkill: SubSkillId) => void
    onWrong: (difficulty: Difficulty, subSkill: SubSkillId) => void
}

export default function BossBattle({ onBack, onWin, onLose, onCorrect, onWrong }: Props) {
    const [questions, setQuestions] = useState<BossQuestion[]>([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [selected, setSelected] = useState<string | null>(null)
    const [phase, setPhase] = useState<'answering' | 'revealed'>('answering')
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(20)
    const [gameOver, setGameOver] = useState(false)

    // Khởi tạo 10 câu hỏi cho Boss (độ khó Hard và Expert)
    useEffect(() => {
        const qs: BossQuestion[] = []
        for (let i = 0; i < BOSS_QUESTION_COUNT; i++) {
            // Xen kẽ Hard và Expert
            const diff: Difficulty = i % 2 === 0 ? 'hard' : 'expert'
            const q = createMathQ(diff)
            qs.push({ ...q, source: 1 }) // source 1 là giả định, có thể bỏ nếu không dùng
        }
        setQuestions(qs)
    }, [])

    const q = questions[currentIdx]

    // Đồng hồ đếm ngược
    useEffect(() => {
        if (phase !== 'answering' || gameOver || !q) return
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleAnswer(null) // Hết giờ tính là sai
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [phase, currentIdx, gameOver, q])

    function handleAnswer(opt: string | null) {
        if (phase === 'revealed' || !q) return
        setSelected(opt)
        setPhase('revealed')

        if (opt === q.answer) {
            setScore(prev => prev + 10) // Mỗi câu đúng được 10 điểm (XP)
            onCorrect(q.difficulty, q.subSkill)
        } else {
            onWrong(q.difficulty, q.subSkill)
        }
    }

    function nextQuestion() {
        if (currentIdx + 1 >= BOSS_QUESTION_COUNT) {
            // Kết thúc
            setGameOver(true)
            if (score >= BOSS_PASS_XP) {
                onWin()
            } else {
                onLose()
            }
        } else {
            setCurrentIdx(prev => prev + 1)
            setSelected(null)
            setPhase('answering')
            setTimeLeft(MATH_TIME_BY_TIER[3]) // 15-20s tùy cấu hình
        }
    }

    if (questions.length === 0 || !q) return <div>Đang tải Boss...</div>

    if (gameOver) {
        return (
            <main className="boss-battle">
                <div className="boss-result-card">
                    <h1>{score >= BOSS_PASS_XP ? '🏆 CHIẾN THẮNG!' : '💀 THẤT BẠI!'}</h1>
                    <p>Điểm của bạn: <strong>{score}</strong> / {BOSS_QUESTION_COUNT * 10}</p>
                    <p>{score >= BOSS_PASS_XP ? 'Bạn đã đánh bại Boss!' : 'Bạn cần ít nhất 80 điểm để chiến thắng.'}</p>
                    <button className="btn-primary" onClick={onBack}>Quay lại</button>
                </div>
            </main>
        )
    }

    return (
        <main className="boss-battle">
            <div className="math-top-bar">
                <button className="math-back-button" onClick={onBack}>← Rút lui</button>
                <div className="boss-top-info">
                    <span className="boss-q-counter">Câu {currentIdx + 1}/{BOSS_QUESTION_COUNT}</span>
                    <span className={`boss-timer ${timeLeft <= 5 ? 'warning' : ''}`}>⏱️ {timeLeft}s</span>
                    <span className="boss-score">🏆 {score} XP</span>
                </div>
            </div>

            <div className="boss-container">
                <div className="boss-header">
                    <span className="boss-avatar">👹</span>
                    <h2>TRẬN CHIẾN CUỐI CÙNG</h2>
                </div>

                <div className="boss-question-card">
                    <h1 className="boss-prompt">{q.prompt}</h1>

                    <div className="boss-options-grid">
                        {q.options.map((opt, i) => {
                            const isChosen = opt === selected
                            const isRight = opt === q.answer
                            let cls = 'boss-option'
                            if (phase === 'revealed') {
                                if (isRight) cls += ' correct'
                                else if (isChosen) cls += ' incorrect'
                            }
                            return (
                                <button key={i} className={cls} onClick={() => handleAnswer(opt)} disabled={phase === 'revealed'}>
                                    {opt}
                                </button>
                            )
                        })}
                    </div>

                    {phase === 'revealed' && (
                        <div className="boss-feedback">
                            <h3>{selected === q.answer ? '✅ Chính xác! Bạn đã giáng một đòn!' : (selected === null ? '⏰ Hết giờ!' : '❌ Sai rồi!')}</h3>
                            <div className="boss-explanation">
                                {q.explanation.map((ex, i) => <p key={i}>{ex}</p>)}
                            </div>
                            <button className="btn-next-boss" onClick={nextQuestion}>
                                {currentIdx + 1 >= BOSS_QUESTION_COUNT ? 'Xem kết quả' : 'Đòn tiếp theo ➜'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}