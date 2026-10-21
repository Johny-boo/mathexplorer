import { useEffect, useState } from 'react'
import type { Difficulty, SubSkillId } from './core/types'

type Question = {
    story: string
    question: string
    answer: number
    hint: string[]
}

type Round = {
    question: Question
    options: number[]
}

type Props = {
    onBack: () => void
    onCorrect: (difficulty: Difficulty, subSkill: SubSkillId) => void
    onWrong: (difficulty: Difficulty, subSkill: SubSkillId) => void
    startDifficulty?: Difficulty
}

function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle<T>(arr: readonly T[]): T[] {
    const out = [...arr]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}
function generateOptions(answer: number): number[] {
    const options = new Set<number>([answer])
    const offsets = shuffle([-1, 1, -2, 2, -3, 3, -10, 10])
    for (const off of offsets) {
        if (options.size >= 4) break
        const candidate = answer + off
        if (candidate > 0 && candidate !== answer) options.add(candidate)
    }
    let extra = 1
    while (options.size < 4) {
        if (!options.has(answer + extra)) options.add(answer + extra)
        extra++
    }
    return [...options]
}

const CHARS = ['bạn Sóc', 'bạn Thỏ', 'bạn Nhím', 'bạn Gấu', 'bạn Cáo', 'bạn Chim']
const ITEMS = ['hạt dẻ', 'quả thông', 'quả mọng', 'cây nấm', 'củ cà rốt', 'chiếc lá']

type Template = (diff: Difficulty) => Question
const templates: Template[] = [
    // 1. Cộng cơ bản
    (diff) => {
        const max = diff === 'easy' ? 20 : diff === 'medium' ? 50 : 100
        const a = randInt(10, max), b = randInt(5, max / 2), i = pick(ITEMS), c = pick(CHARS)
        return {
            story: `${c} nhặt được ${a} ${i} ở gốc cây. Sau đó ${c} nhặt thêm được ${b} ${i} nữa.`,
            question: `Hỏi ${c} có tất cả bao nhiêu ${i}?`, answer: a + b,
            hint: [`Số ban đầu là ${a}, thêm vào ${b}.`, `Dùng phép CỘNG: ${a} + ${b} = ${a + b}.`]
        }
    },
    // 2. Trừ cơ bản
    (diff) => {
        const max = diff === 'easy' ? 30 : diff === 'medium' ? 80 : 200
        const a = randInt(max / 2, max), b = randInt(10, a / 2), i = pick(ITEMS), c = pick(CHARS)
        return {
            story: `Trong tổ của ${c} có ${a} ${i}. ${c} đã mang ${b} ${i} đi tặng bạn.`,
            question: `Trong tổ còn lại bao nhiêu ${i}?`, answer: a - b,
            hint: [`Ban đầu có ${a}, mang đi ${b}.`, `Dùng phép TRỪ: ${a} − ${b} = ${a - b}.`]
        }
    },
    // 3. Nhân (chia đều nhóm)
    (diff) => {
        const n = randInt(3, diff === 'expert' ? 9 : 6), m = randInt(4, diff === 'expert' ? 12 : 8), c = pick(CHARS), i = pick(ITEMS)
        return {
            story: `${c} có ${n} chiếc giỏ. Mỗi giỏ đựng ${m} ${i}.`,
            question: `Hỏi ${c} có tất cả bao nhiêu ${i}?`, answer: n * m,
            hint: [`Có ${n} giỏ, mỗi giỏ ${m} ${i}.`, `Dùng phép NHÂN: ${n} × ${m} = ${n * m}.`]
        }
    },
    // 4. Chia đều
    (diff) => {
        const n = randInt(3, diff === 'expert' ? 9 : 6), m = randInt(4, diff === 'expert' ? 12 : 8), total = n * m, c = pick(CHARS), i = pick(ITEMS)
        return {
            story: `${c} có ${total} ${i} chia đều vào ${n} chiếc giỏ.`,
            question: `Mỗi giỏ có bao nhiêu ${i}?`, answer: m,
            hint: [`Chia đều ${total} thành ${n} phần.`, `Dùng phép CHIA: ${total} ÷ ${n} = ${m}.`]
        }
    },
    // 5. Nhân rồi cộng
    (diff) => {
        const n = randInt(3, 5), m = randInt(4, 8), k = randInt(5, diff === 'expert' ? 50 : 15), c = pick(CHARS), i = pick(ITEMS)
        return {
            story: `${c} có ${n} chiếc hộp, mỗi hộp chứa ${m} ${i}. Trên bàn còn thêm ${k} ${i} rời.`,
            question: `Hỏi tổng cộng có bao nhiêu ${i}?`, answer: n * m + k,
            hint: [`Trong hộp: ${n} × ${m} = ${n * m}.`, `Cộng thêm ${k} rời: ${n * m} + ${k} = ${n * m + k}.`]
        }
    },
    // 6. Nhân rồi trừ
    (diff) => {
        const n = randInt(3, 5), m = randInt(4, 6), k = randInt(5, n * m - 2), c = pick(CHARS), i = pick(ITEMS)
        return {
            story: `${c} có ${n} đĩa, mỗi đĩa có ${m} ${i}. ${c} đã ăn mất ${k} ${i}.`,
            question: `Hỏi còn lại bao nhiêu ${i}?`, answer: n * m - k,
            hint: [`Tổng ban đầu: ${n} × ${m} = ${n * m}.`, `Ăn mất ${k}: ${n * m} − ${k} = ${n * m - k}.`]
        }
    },
    // 7. Hai bước cộng trừ
    (diff) => {
        const max = diff === 'easy' ? 50 : diff === 'medium' ? 100 : 300
        const a = randInt(max / 2, max), b = randInt(20, max / 3), c = randInt(10, max / 4), char = pick(CHARS), i = pick(ITEMS)
        return {
            story: `${char} có ${a} ${i}. Buổi sáng ${char} kiếm thêm ${b} ${i}, buổi chiều làm rơi mất ${c} ${i}.`,
            question: `Hỏi ${char} còn bao nhiêu ${i}?`, answer: a + b - c,
            hint: [`Sáng có: ${a} + ${b} = ${a + b}.`, `Chiều mất: ${a + b} − ${c} = ${a + b - c}.`]
        }
    },
    // 8. So sánh (tìm phần hơn)
    (diff) => {
        const max = diff === 'easy' ? 30 : diff === 'medium' ? 80 : 150
        const a = randInt(max / 2, max), b = randInt(10, max / 2), c1 = pick(CHARS), c2 = pick(CHARS.filter(x => x !== c1))
        return {
            story: `${c1} có ${a} ${pick(ITEMS)}. ${c2} có ${b} ${pick(ITEMS)}.`,
            question: `${c1} có nhiều hơn ${c2} bao nhiêu?`, answer: a - b,
            hint: [`Để biết phần hơn, ta lấy số lớn trừ số bé.`, `Đặt tính: ${a} − ${b} = ${a - b}.`]
        }
    },
    // 9. Bài toán tuổi
    (diff) => {
        const momAge = randInt(30, 40), childAge = randInt(5, diff === 'expert' ? 15 : 10), c = pick(CHARS)
        return {
            story: `Năm nay mẹ ${momAge} tuổi, ${c} ${childAge} tuổi.`,
            question: `Mẹ hơn ${c} bao nhiêu tuổi?`, answer: momAge - childAge,
            hint: [`Mẹ hơn con số tuổi là: ${momAge} − ${childAge} = ${momAge - childAge}.`]
        }
    },
    // 10. Tính tiền cơ bản
    (diff) => {
        const n = randInt(2, 4), price = randInt(2, 5) * 1000, pay = diff === 'easy' ? 10000 : 50000, c = pick(CHARS)
        return {
            story: `${c} mua ${n} món đồ chơi, mỗi món giá ${price} đồng. ${c} đưa cô bán hàng ${pay} đồng.`,
            question: `${c} được trả lại bao nhiêu tiền?`, answer: pay - (n * price),
            hint: [`Tiền mua đồ: ${n} × ${price} = ${n * price}.`, `Tiền thừa: ${pay} − ${n * price} = ${pay - (n * price)}.`]
        }
    }
]

export function makeRound(diff: Difficulty): Round {
    // Tất cả các dạng đều xuất hiện ở mọi cấp độ, nhưng số liệu bên trong tự scale
    const q = pick(templates)(diff)
    return { question: q, options: shuffle(generateOptions(q.answer)) }
}

const TIME_BY_DIFF: Record<Difficulty, number> = { easy: 30, medium: 30, hard: 45, expert: 60 }
function getSubSkill(diff: Difficulty): SubSkillId {
    if (diff === 'easy') return 'word.addsub'
    if (diff === 'medium') return 'word.muldiv'
    return 'word.multistep'
}

export default function WordProblem({ onBack, onCorrect, onWrong, startDifficulty }: Props) {
    const [difficulty, setDifficulty] = useState<Difficulty>(startDifficulty ?? 'easy')
    const [round, setRound] = useState<Round>(() => makeRound(startDifficulty ?? 'easy'))
    const [selected, setSelected] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState<number>(TIME_BY_DIFF[startDifficulty ?? 'easy'])
    const [timedOut, setTimedOut] = useState(false)

    const { question, options } = round
    const totalTime = TIME_BY_DIFF[difficulty]

    useEffect(() => {
        if (selected !== null || timedOut) return
        const timer = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { window.clearInterval(timer); setTimedOut(true); return 0 }
                return prev - 1
            })
        }, 1000)
        return () => window.clearInterval(timer)
    }, [question, selected, timedOut])

    useEffect(() => {
        if (!timedOut) return
        onWrong(difficulty, getSubSkill(difficulty))
        const timer = window.setTimeout(() => {
            nextQuestion()
        }, 3000)
        return () => window.clearTimeout(timer)
    }, [timedOut, difficulty, onWrong])

    function chooseAnswer(value: number) {
        if (selected !== null || timedOut) return
        setSelected(value)
        if (value === question.answer) {
            onCorrect(difficulty, getSubSkill(difficulty))
        } else {
            onWrong(difficulty, getSubSkill(difficulty))
        }
    }

    function nextQuestion() {
        setRound(makeRound(difficulty))
        setSelected(null)
        setTimeLeft(totalTime)
        setTimedOut(false)
    }

    function changeDifficulty(v: Difficulty) {
        setDifficulty(v)
        setRound(makeRound(v))
        setSelected(null)
        setTimeLeft(TIME_BY_DIFF[v])
        setTimedOut(false)
    }

    const showFeedback = selected !== null || timedOut
    const showHintCard = showFeedback && (timedOut || selected !== question.answer)

    return (
        <main className= "word-practice forest-theme" >
        <div className="word-top-nav" >
            <button className="math-back-button" onClick = { onBack } type = "button" >← Quay về bản đồ </button>
                </div>
                < div className = "word-grid" >
                    <div className="word-main-col" >
                        <header className="word-header" >
                            <div aria-hidden="true" >🌲</div>
                                < div >
                                <h1>RỪNG PHÉP TÍNH </h1>
                                    < p > Hành trình của Sóc Nhỏ </p>
                                        </div>
                                        </header>

                                        < section className = "word-card" >
                                            <div className="word-timer-wrapper" >
                                                <div className="word-timer" >
                                ⏱️ Thời gian: <strong className={ timeLeft <= 5 ? 'timer-warning' : '' }> { timeLeft }s </strong>
        </div>
        </div>
        < div className = "word-story" >
            <span aria-hidden="true" >🐿️</span>
                < p > { question.story } </p>
                </div>
                < h2 > { question.question } </h2>
                < div className = "word-options" >
                {
                    options.map((option, index) => {
                        const correct = option === question.answer
                        const chosen = option === selected
                        let cls = `word-option`
                        if (showFeedback && correct) cls += ' correct'
                        else if (chosen) cls += ' incorrect'
                        return (
                            <button key= { option } type = "button" className = { cls } disabled = { selected !== null || timedOut
                    } onClick = {() => chooseAnswer(option)} >
                    { String.fromCharCode(65 + index) }. { option } { showFeedback && correct ? ' ✓' : '' } { chosen && !correct ? ' ✕' : '' }
    </button>
                                )
})}
</div>
    </section>
    </div>

    < aside className = "word-side-col" >
        <div className="word-side-panel" >
            <label className="word-difficulty" >
                Chọn độ khó:
<select value={ difficulty } onChange = { e => changeDifficulty(e.target.value as Difficulty) } >
    <option value="easy" > Dễ </option>
        < option value = "medium" > Trung bình </option>
            < option value = "hard" > Nâng cao </option>
                < option value = "expert" > Siêu khó </option>
                    </select>
                    </label>
                    </div>
{
    showFeedback && (
        <>
        <div className="word-feedback" role = "status" >
            <strong>{ timedOut? '⏰ Hết giờ!': (selected === question.answer ? '🎉 Chính xác!' : '💡 Chưa đúng!') } </strong>
    { selected !== question.answer && <p>Đáp án: { question.answer } </p> }
    </div>
    {
        showHintCard && (
            <div className="word-hint" >
                <div className="word-hint-title" > <span>📘</span> Giải chi tiết</div >
                    <div className="hint-step-list" >
                    {
                        question.hint.map((step, i) => (
                            <div key= { i } className = "hint-step" > <span className="hint-step-text" > { step } < /span></div >
                                        ))
                    }
                        </div>
                        </div>
                            )
    }
    <button className="btn-next-question" onClick = { nextQuestion } > Tiếp tục ➜</button>
        </>
                    )
}
</aside>
    </div>
    </main>
    )
}