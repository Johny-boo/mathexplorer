import { useState } from 'react'
import type { Difficulty, SubSkillId } from './core/types'
import { createQuestion as createMathQ } from './MathPractice'
import { makeRound as createWordQ } from './WordProblem'
import { createQuestion as createPatternQ } from './PatternCave'
import { createQuestion as createGeometryQ } from './GeometryMountain'

type Props = {
    onBack: () => void
    onWin: () => void
    onLose: () => void
    onCorrect: (difficulty: Difficulty, subSkill: SubSkillId) => void
    onWrong: (difficulty: Difficulty, subSkill: SubSkillId) => void
}

type BossQuestion = {
    prompt: string
    options: string[]
    answer: string
    explanation: string
    difficulty: Difficulty
    subSkill: SubSkillId
}

function generateBossQuestions(): BossQuestion[] {
    const questions: BossQuestion[] = []

    // 7 câu Nâng cao, 3 câu Siêu khó
    const diffs: Difficulty[] = [
        'hard', 'hard', 'hard', 'hard', 'hard', 'hard', 'hard',
        'expert', 'expert', 'expert'
    ]

    diffs.forEach(diff => {
        // Chọn ngẫu nhiên 1 trong 4 đảo (0, 1, 2, 3)
        const island = Math.floor(Math.random() * 4)

        if (island === 0) {
            // Đảo 1: Toán
            const ops: Array<'addition' | 'subtraction' | 'multiplication'> = ['addition', 'subtraction', 'multiplication']
            const op = ops[Math.floor(Math.random() * ops.length)]
            const q = createMathQ(op, diff)
            questions.push({
                prompt: `${q.a} ${q.symbol} ${q.b} = ?`,
                options: q.options.map(String),
                answer: String(q.answer),
                explanation: `Đặt tính: ${q.a} ${q.symbol} ${q.b} = ${q.answer}`,
                difficulty: diff,
                subSkill: op === 'addition' ? 'math.add' : op === 'subtraction' ? 'math.sub' : 'math.mul'
            })
        } else if (island === 1) {
            // Đảo 2: Lời văn
            const round = createWordQ(diff)
            questions.push({
                prompt: `${round.question.story}\n\n👉 ${round.question.question}`,
                options: round.options.map(String),
                answer: String(round.question.answer),
                explanation: round.question.hint.join(' '),
                difficulty: diff,
                subSkill: diff === 'hard' ? 'word.multistep' : 'word.divideadd'
            })
        } else if (island === 2) {
            // Đảo 3: Quy luật
            const q = createPatternQ(diff)
            questions.push({
                prompt: q.prompt,
                options: q.options,
                answer: q.answer,
                explanation: q.explanation,
                difficulty: diff,
                subSkill: q.subSkill
            })
        } else {
            // Đảo 4: Hình học
            const q = createGeometryQ(diff)
            questions.push({
                prompt: q.prompt,
                options: q.options,
                answer: q.answer,
                explanation: q.explanation,
                difficulty: diff,
                subSkill: q.subSkill
            })
        }
    })

    return questions.sort(() => Math.random() - 0.5)
}

export default function BossBattle({ onBack, onWin, onLose, onCorrect, onWrong }: Props) {
    const [questions] = useState(() => generateBossQuestions())
    const [currentIndex, setCurrentIndex] = useState(0)
    const [correctCount, setCorrectCount] = useState(0)
    const [selected, setSelected] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [isWin, setIsWin] = useState(false)

    const q = questions[currentIndex]
    const bossHp = 10 - correctCount

    function handleChoose(option: string) {
        if (selected !== null) return
        setSelected(option)

        const isCorrect = option === q.answer
        if (isCorrect) {
            setCorrectCount(prev => prev + 1)
            onCorrect(q.difficulty, q.subSkill)
        } else {
            onWrong(q.difficulty, q.subSkill)
        }
    }

    function nextStep() {
        if (currentIndex === questions.length - 1) {
            const won = correctCount >= 8
            setIsWin(won)
            setShowResult(true)
            if (won) onWin()
            else onLose()
        } else {
            setCurrentIndex(prev => prev + 1)
            setSelected(null)
        }
    }

    if (showResult) {
        return (
            <main className= "boss-practice" >
            <div className="boss-result-screen" >
                <span className="boss-result-icon" > { isWin? '🏆': '💀' } </span>
                    < h1 > { isWin? 'CHIẾN THẮNG!': 'THẤT BẠI...' } </h1>
                    < p > Bạn đã trả lời đúng < b > { correctCount } / 10 < /b> câu.</p >
                        <p>{ isWin? 'Bạn đã đánh bại Thuyền trưởng Bóng Đêm và nhận 1 Sao Boss!': 'Thuyền trưởng Bóng Đêm quá mạnh. Hãy thử lại nhé!' } </p>
                        < button className = "btn-start-adventure" onClick = { onBack } >
                        { isWin? 'Về bản đồ': 'Đánh lại' }
                            </button>
                            </div>
                            </main>
        )
    }

    return (
        <main className= "boss-practice" >
        <div className="boss-topbar" >
            <button className="math-back-button" onClick = { onBack } >← Bỏ chạy </button>
                < div className = "boss-name" >👑 Thuyền trưởng Bóng Đêm </div>
                    </div>

                    < div className = "boss-hp-container" >
                        <div className="boss-hp-bar" style = {{ width: `${(bossHp / 10) * 100}%` }
} />
    < span className = "boss-hp-text" > HP: { bossHp } /10</span >
        </div>

        < section className = "boss-question-card" >
            <div className="boss-progress" >
                Câu { currentIndex + 1 } /10 — Đúng: {correctCount}/8(cần đạt)
                    </div>

                    < h2 className = "boss-prompt" style = {{ whiteSpace: 'pre-line' }}> { q.prompt } </h2>

                        < div className = "boss-options" >
                        {
                            q.options.map(opt => {
                                const isCorrect = opt === q.answer
                                const isChosen = opt === selected
                                let cls = 'boss-option'
                                if (selected !== null) {
                                    if (isCorrect) cls += ' correct'
                                    else if (isChosen) cls += ' incorrect'
                                }
                                return (
                                    <button 
                                key= { opt }
                                className = { cls }
                                onClick = {() => handleChoose(opt)
                            }
                                disabled = { selected !== null}
                            >
                        { opt }
                            </button>
                        )
                    })}
</div>

{
    selected !== null && (
        <div className="boss-feedback" >
            <p><b>{ selected === q.answer ? '🎉 Chính xác!' : '💡 Chưa đúng!'
} </b></p >
    <p className="boss-explain" > { q.explanation } </p>
        < button className = "btn-next-question" onClick = { nextStep } >
        { currentIndex === 9 ? 'Xem kết quả ➜' : 'Câu tiếp theo ➜'}
</button>
    </div>
                )}
</section>
    </main>
    )
}