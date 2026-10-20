import { useEffect, useState } from 'react'

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

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
    onScoreChange?: (score: number) => void
    onCorrectAnswer?: (difficulty: Difficulty) => void
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle<T>(arr: readonly T[]): T[] {
    const out = [...arr]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}

function generateOptions(answer: number): number[] {
    const options = new Set<number>([answer])
    const offsets = shuffle([-1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -10, 10])
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

type Template = () => Question

const TREASURE_ITEMS = ['đồng vàng', 'đồng xu', 'viên ngọc', 'viên ngọc trai', 'vỏ sò'] as const
const FOOD_ITEMS = ['quả dừa', 'quả cam', 'quả táo', 'viên kẹo', 'chai nước'] as const
const CONTAINERS = ['rương', 'túi', 'hộp', 'giỏ', 'thùng'] as const
const PLACES = ['trong khoang tàu', 'trên boong tàu', 'trên đảo hoang', 'dưới đáy biển'] as const

const easyTemplates: Template[] = [
    () => {
        const a = randInt(15, 55)
        const b = randInt(10, 40)
        const items = pick(TREASURE_ITEMS)
        const place = pick(PLACES)
        return {
            story: `${place.charAt(0).toUpperCase() + place.slice(1)} có ${a} ${items}. Thuyền trưởng tìm thêm được ${b} ${items} nữa.`,
            question: `Thuyền trưởng có tất cả bao nhiêu ${items}?`,
            answer: a + b,
            hint: [
                `Ban đầu có ${a} ${items}, sau đó Thuyền trưởng tìm thêm ${b} ${items}.`,
                `Vì "tìm THÊM" nên số ${items} TĂNG LÊN → dùng phép CỘNG (+).`,
                `Đặt tính: ${a} + ${b} = ${a + b}.`,
                `Kết quả: ${a + b} ${items}.`
            ],
        }
    },
    () => {
        const a = randInt(35, 95)
        const b = randInt(5, Math.min(a - 10, 35))
        const items = pick(FOOD_ITEMS)
        const action = pick(['ăn hết', 'bán đi', 'làm rơi mất', 'dùng hết'])
        return {
            story: `Trên tàu có ${a} ${items}. Thủy thủ đoàn đã ${action} ${b} ${items}.`,
            question: `Trên tàu còn lại bao nhiêu ${items}?`,
            answer: a - b,
            hint: [
                `Ban đầu có ${a} ${items}, sau đó ${action} mất ${b} ${items}.`,
                `Vì đã ${action} nên số ${items} GIẢM ĐI → dùng phép TRỪ (−).`,
                `Đặt tính: ${a} − ${b} = ${a - b}.`,
                `Kết quả: còn ${a - b} ${items}.`
            ],
        }
    },
    () => {
        const a = randInt(12, 48)
        const b = randInt(11, 45)
        const items = pick(['viên bi', 'viên ngọc', 'quả táo', 'chiếc bánh', 'lá cờ'])
        const container = pick(CONTAINERS)
        return {
            story: `Rương nhỏ có ${a} ${items}, rương lớn có ${b} ${items}.`,
            question: `Cả hai chiếc ${container} có bao nhiêu ${items}?`,
            answer: a + b,
            hint: [
                `Có 2 nhóm ${items} — nhóm nhỏ ${a}, nhóm lớn ${b}.`,
                `Hỏi "cả hai" nghĩa là GỘP hai nhóm lại → dùng phép CỘNG (+).`,
                `Đặt tính: ${a} + ${b} = ${a + b}.`,
                `Kết quả: ${a + b} ${items}.`
            ],
        }
    },
    () => {
        const a = randInt(40, 95)
        const b = randInt(10, 35)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Thuyền trưởng có ${a} ${items}. Thuyền trưởng tặng cho em gái ${b} ${items}.`,
            question: `Thuyền trưởng còn bao nhiêu ${items}?`,
            answer: a - b,
            hint: [
                `Ban đầu có ${a} ${items}, đã tặng đi ${b} ${items}.`,
                `Tặng đi nghĩa là số ${items} của mình ÍT hơn → dùng phép TRỪ (−).`,
                `Đặt tính: ${a} − ${b} = ${a - b}.`,
                `Kết quả: còn ${a - b} ${items}.`
            ],
        }
    },
    () => {
        const a = randInt(15, 50)
        const b = randInt(12, 45)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Hôm qua Thuyền trưởng kiếm được ${a} ${items}. Hôm nay Thuyền trưởng kiếm thêm được ${b} ${items}.`,
            question: `Cả hai ngày Thuyền trưởng kiếm được bao nhiêu ${items}?`,
            answer: a + b,
            hint: [
                `Ngày 1 có ${a} ${items}, ngày 2 có ${b} ${items}.`,
                `Hỏi "cả hai ngày" nghĩa là CỘNG DỒN lại → dùng phép CỘNG (+).`,
                `Đặt tính: ${a} + ${b} = ${a + b}.`,
                `Kết quả: ${a + b} ${items}.`
            ],
        }
    },
    () => {
        const a = randInt(50, 95)
        const b = randInt(15, 45)
        return {
            story: `Trên tàu có ${a} chai nước ngọt. Thủy thủ đoàn đã uống hết ${b} chai.`,
            question: `Trên tàu còn lại bao nhiêu chai nước ngọt?`,
            answer: a - b,
            hint: [
                `Ban đầu có ${a} chai, đã uống ${b} chai.`,
                `Uống hết nghĩa là số chai GIẢM ĐI → dùng phép TRỪ (−).`,
                `Đặt tính: ${a} − ${b} = ${a - b}.`,
                `Kết quả: còn ${a - b} chai.`
            ],
        }
    },
]

const mediumTemplates: Template[] = [
    () => {
        const n = randInt(3, 9)
        const m = randInt(3, 9)
        const items = pick(TREASURE_ITEMS)
        const container = pick(CONTAINERS)
        return {
            story: `Có ${n} chiếc ${container}. Mỗi ${container} đựng ${m} ${items}.`,
            question: `Có tất cả bao nhiêu ${items}?`,
            answer: n * m,
            hint: [
                `Có ${n} ${container}, mỗi ${container} đựng ${m} ${items}.`,
                `Các nhóm BẰNG NHAU, thay vì cộng nhiều lần, ta dùng phép NHÂN (×) cho nhanh.`,
                `Đặt tính: ${n} × ${m} = ${n * m}.`,
                `Kết quả: ${n * m} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(3, 9)
        const m = randInt(3, 9)
        const total = n * m
        const items = pick(FOOD_ITEMS)
        return {
            story: `Có ${total} ${items} chia đều vào ${n} chiếc giỏ.`,
            question: `Mỗi giỏ có bao nhiêu ${items}?`,
            answer: m,
            hint: [
                `Có ${total} ${items}, chia đều vào ${n} giỏ.`,
                `"Chia đều" nghĩa là mỗi giỏ bằng nhau → dùng phép CHIA (÷).`,
                `Đặt tính: ${total} ÷ ${n} = ${m}.`,
                `Kết quả: mỗi giỏ có ${m} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(3, 8)
        const m = randInt(3, 9)
        const k = randInt(5, 25)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Có ${n} rương, mỗi rương đựng ${m} ${items}. Thuyền trưởng tìm thêm ${k} ${items} nữa.`,
            question: `Có tất cả bao nhiêu ${items}?`,
            answer: n * m + k,
            hint: [
                `Có 2 nhóm ${items} — trong rương và tìm thêm.`,
                `Nhóm trong rương: ${n} × ${m} = ${n * m} (vì các rương bằng nhau).`,
                `Cộng nhóm tìm thêm: ${n * m} + ${k} = ${n * m + k}.`,
                `Kết quả: ${n * m + k} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(3, 8)
        const m = randInt(4, 9)
        const k = randInt(5, n * m - 5)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Có ${n} rương, mỗi rương đựng ${m} ${items}. Thuyền trưởng bán đi ${k} ${items}.`,
            question: `Thuyền trưởng còn bao nhiêu ${items}?`,
            answer: n * m - k,
            hint: [
                `Ban đầu có ${n} rương × ${m} ${items} = ${n * m} ${items}.`,
                `Sau đó bán đi ${k} ${items}, nghĩa là bớt đi → phép TRỪ (−).`,
                `Đặt tính: ${n * m} − ${k} = ${n * m - k}.`,
                `Kết quả: còn ${n * m - k} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(3, 9)
        const m = randInt(3, 9)
        const k = randInt(5, 20)
        const items = pick(FOOD_ITEMS)
        return {
            story: `Có ${n * m} ${items} chia đều vào ${n} giỏ. Sau đó Thuyền trưởng thêm vào mỗi giỏ ${k} ${items}.`,
            question: `Mỗi giỏ có tất cả bao nhiêu ${items}?`,
            answer: m + k,
            hint: [
                `Chia đều: ${n * m} ÷ ${n} = ${m} ${items}/giỏ.`,
                `Vì thêm ${k} vào mỗi giỏ → số mỗi giỏ TĂNG LÊN → phép CỘNG (+).`,
                `Đặt tính: ${m} + ${k} = ${m + k}.`,
                `Kết quả: mỗi giỏ có ${m + k} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(3, 7)
        const m = randInt(4, 9)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Mỗi ngày Thuyền trưởng kiếm được ${m} ${items}. Thuyền trưởng kiếm liên tục trong ${n} ngày.`,
            question: `Thuyền trưởng kiếm được bao nhiêu ${items}?`,
            answer: n * m,
            hint: [
                `Mỗi ngày ${m} ${items}, lặp lại trong ${n} ngày.`,
                `Số mỗi ngày BẰNG NHAU, dùng phép NHÂN (×) thay vì cộng ${n} lần.`,
                `Đặt tính: ${n} × ${m} = ${n * m}.`,
                `Kết quả: ${n * m} ${items}.`
            ],
        }
    },
]

const hardTemplates: Template[] = [
    () => {
        const a = randInt(80, 200)
        const b = randInt(20, Math.min(a - 30, 80))
        const c = randInt(15, 60)
        const items = pick(['thùng hàng', 'bao gạo', 'đồng xu'])
        return {
            story: `Trên tàu có ${a} ${items}. Buổi sáng dỡ xuống ${b} ${items}, buổi chiều chở thêm ${c} ${items}.`,
            question: `Trên tàu hiện có bao nhiêu ${items}?`,
            answer: a - b + c,
            hint: [
                `Ban đầu trên tàu: ${a} ${items}.`,
                `Dỡ xuống ${b} (bớt đi) → ${a} − ${b} = ${a - b}.`,
                `Chở thêm ${c} (tăng lên) → ${a - b} + ${c} = ${a - b + c}.`,
                `Kết quả: hiện có ${a - b + c} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(4, 9)
        const m = randInt(5, 9)
        const k = randInt(10, n * m - 10)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Có ${n} rương, mỗi rương đựng ${m} ${items}. Thuyền trưởng tiêu mất ${k} ${items}.`,
            question: `Thuyền trưởng còn bao nhiêu ${items}?`,
            answer: n * m - k,
            hint: [
                `Nhân để biết tổng ban đầu: ${n} × ${m} = ${n * m} ${items}.`,
                `Vì tiêu mất ${k} nên số ${items} GIẢM ĐI → phép TRỪ (−).`,
                `Đặt tính: ${n * m} − ${k} = ${n * m - k}.`,
                `Kết quả: còn ${n * m - k} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(4, 9)
        const m = randInt(5, 12)
        const k = randInt(10, 40)
        const items = pick(FOOD_ITEMS)
        return {
            story: `Có ${n * m} ${items} chia đều vào ${n} giỏ. Thuyền trưởng thêm vào mỗi giỏ ${k} ${items} nữa.`,
            question: `Mỗi giỏ hiện có bao nhiêu ${items}?`,
            answer: m + k,
            hint: [
                `Chia đều: ${n * m} ÷ ${n} = ${m} ${items}/giỏ.`,
                `Thêm ${k} vào mỗi giỏ → số mỗi giỏ TĂNG LÊN → phép CỘNG (+).`,
                `Đặt tính: ${m} + ${k} = ${m + k}.`,
                `Kết quả: mỗi giỏ hiện có ${m + k} ${items}.`
            ],
        }
    },
    () => {
        const a = randInt(150, 250)
        const b = randInt(30, 70)
        const c = randInt(30, 70)
        const items = pick(['thùng hàng', 'bao gạo', 'đồng xu'])
        return {
            story: `Trên tàu có ${a} ${items}. Buổi sáng dỡ ${b} ${items}, buổi chiều dỡ tiếp ${c} ${items}.`,
            question: `Trên tàu còn bao nhiêu ${items}?`,
            answer: a - b - c,
            hint: [
                `Ban đầu: ${a} ${items}.`,
                `Buổi sáng dỡ ${b} → ${a} − ${b} = ${a - b}.`,
                `Buổi chiều dỡ tiếp ${c} → ${a - b} − ${c} = ${a - b - c}.`,
                `Kết quả: còn ${a - b - c} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(3, 7)
        const m = randInt(4, 8)
        const p = randInt(2, 6)
        const q = randInt(3, 7)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Có ${n} rương, mỗi rương ${m} ${items}. Và có ${p} túi, mỗi túi ${q} ${items}.`,
            question: `Có tất cả bao nhiêu ${items}?`,
            answer: n * m + p * q,
            hint: [
                `Nhóm rương: ${n} × ${m} = ${n * m} ${items}.`,
                `Nhóm túi: ${p} × ${q} = ${p * q} ${items}.`,
                `Gộp hai nhóm lại: ${n * m} + ${p * q} = ${n * m + p * q}.`,
                `Kết quả: ${n * m + p * q} ${items}.`
            ],
        }
    },
]

const expertTemplates: Template[] = [
    () => {
        const n = randInt(3, 6)
        const m = randInt(5, 9)
        const a = randInt(n * m + 80, 250)
        const k = randInt(20, 60)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Thuyền trưởng có ${a} ${items}. Thuyền trưởng mua ${n} chiếc la bàn, mỗi chiếc giá ${m} ${items}. Rồi kiếm thêm ${k} ${items}.`,
            question: `Thuyền trưởng còn bao nhiêu ${items}?`,
            answer: a - n * m + k,
            hint: [
                `Số ${items} mua la bàn: ${n} × ${m} = ${n * m}.`,
                `Trừ số đã mua: ${a} − ${n * m} = ${a - n * m}.`,
                `Cộng số kiếm thêm: ${a - n * m} + ${k} = ${a - n * m + k}.`,
                `Kết quả: còn ${a - n * m + k} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(4, 8)
        const m = randInt(5, 9)
        const k = randInt(10, n * m - 10)
        const p = randInt(15, 40)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Có ${n} rương, mỗi rương ${m} ${items}. Thuyền trưởng tiêu ${k} ${items}, rồi kiếm thêm ${p} ${items}.`,
            question: `Thuyền trưởng có bao nhiêu ${items}?`,
            answer: n * m - k + p,
            hint: [
                `Tổng ban đầu: ${n} × ${m} = ${n * m} ${items}.`,
                `Trừ số đã tiêu: ${n * m} − ${k} = ${n * m - k}.`,
                `Cộng số kiếm thêm: ${n * m - k} + ${p} = ${n * m - k + p}.`,
                `Kết quả: có ${n * m - k + p} ${items}.`
            ],
        }
    },
    () => {
        const p = randInt(2, 5)
        const mult = randInt(2, 4)
        const n = p * mult
        const m = randInt(3, 9)
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Có ${n} rương, mỗi rương ${m} ${items}. Thuyền trưởng chia đều tất cả cho ${p} thủy thủ.`,
            question: `Mỗi thủy thủ nhận được bao nhiêu ${items}?`,
            answer: (n * m) / p,
            hint: [
                `Tổng số ${items}: ${n} × ${m} = ${n * m}.`,
                `Chia đều cho ${p} thủy thủ → phép CHIA (÷).`,
                `Đặt tính: ${n * m} ÷ ${p} = ${(n * m) / p}.`,
                `Kết quả: mỗi thủy thủ nhận ${(n * m) / p} ${items}.`
            ],
        }
    },
    () => {
        const n = randInt(5, 9)
        const m = randInt(5, 9)
        const p = randInt(2, 4)
        const q = randInt(3, 5)
        const left = n * m
        const right = p * q
        const items = pick(TREASURE_ITEMS)
        return {
            story: `Có ${n} rương, mỗi rương ${m} ${items}. Thuyền trưởng bán ${p} túi, mỗi túi ${q} ${items}.`,
            question: `Thuyền trưởng còn bao nhiêu ${items}?`,
            answer: left - right,
            hint: [
                `Số ${items} ban đầu: ${n} × ${m} = ${left}.`,
                `Số ${items} đã bán: ${p} × ${q} = ${right}.`,
                `Còn lại: ${left} − ${right} = ${left - right}.`,
                `Kết quả: còn ${left - right} ${items}.`
            ],
        }
    },
    () => {
        const a = randInt(200, 300)
        const b = randInt(40, 80)
        const c = randInt(30, 60)
        const d = randInt(20, 50)
        const items = pick(['thùng hàng', 'bao gạo'])
        return {
            story: `Trên tàu có ${a} ${items}. Buổi sáng dỡ ${b} ${items}, buổi chiều dỡ tiếp ${c} ${items}, rồi tối chở thêm ${d} ${items}.`,
            question: `Trên tàu hiện có bao nhiêu ${items}?`,
            answer: a - b - c + d,
            hint: [
                `Ban đầu: ${a} ${items}.`,
                `Sáng dỡ ${b} → ${a} − ${b} = ${a - b}.`,
                `Chiều dỡ ${c} → ${a - b} − ${c} = ${a - b - c}.`,
                `Tối chở thêm ${d} → ${a - b - c} + ${d} = ${a - b - c + d}.`
            ],
        }
    },
]

const TEMPLATES: Record<Difficulty, Template[]> = {
    easy: easyTemplates,
    medium: mediumTemplates,
    hard: hardTemplates,
    expert: expertTemplates,
}

function generateQuestion(difficulty: Difficulty): Question {
    return pick(TEMPLATES[difficulty])()
}

function makeRound(difficulty: Difficulty): Round {
    const question = generateQuestion(difficulty)
    return {
        question,
        options: shuffle(generateOptions(question.answer)),
    }
}

const TIME_BY_DIFFICULTY: Record<Difficulty, number> = {
    easy: 30,
    medium: 30,
    hard: 45,
    expert: 60,
}

function warningThreshold(difficulty: Difficulty): number {
    return Math.max(5, Math.floor(TIME_BY_DIFFICULTY[difficulty] * 0.15))
}

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export default function WordProblem({ onBack, onScoreChange, onCorrectAnswer }: Props) {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy')
    const [round, setRound] = useState<Round>(() => makeRound('easy'))
    const [selected, setSelected] = useState<number | null>(null)
    const [elapsed, setElapsed] = useState(0)
    const [score, setScore] = useState(0)
    const [answered, setAnswered] = useState(0)
    const [questionNumber, setQuestionNumber] = useState(1)
    const [timeLeft, setTimeLeft] = useState<number>(() => TIME_BY_DIFFICULTY.easy)
    const [timedOut, setTimedOut] = useState(false)

    const { question, options } = round
    const totalTime = TIME_BY_DIFFICULTY[difficulty]
    const warn = timeLeft <= warningThreshold(difficulty)

    useEffect(() => {
        if (selected !== null || timedOut) return
        const timer = window.setInterval(() => {
            setTimeLeft(previous => {
                if (previous <= 1) {
                    window.clearInterval(timer)
                    setTimedOut(true)
                    return 0
                }
                return previous - 1
            })
        }, 1000)
        return () => window.clearInterval(timer)
    }, [question, selected, timedOut])

    useEffect(() => {
        if (!timedOut) return
        const timer = window.setTimeout(() => {
            setQuestionNumber(prev => prev + 1)
            setRound(makeRound(difficulty))
            setSelected(null)
            setTimeLeft(TIME_BY_DIFFICULTY[difficulty])
            setTimedOut(false)
        }, 3000)
        return () => window.clearTimeout(timer)
    }, [timedOut, difficulty])

    useEffect(() => {
        const interval = window.setInterval(() => setElapsed(previous => previous + 1), 1000)
        return () => window.clearInterval(interval)
    }, [])

    function chooseAnswer(value: number) {
        if (selected !== null || timedOut) return
        setSelected(value)
        setAnswered(previous => previous + 1)
        if (value === question.answer) {
            setScore(previous => previous + 1)
            onScoreChange?.(1)
            onCorrectAnswer?.(difficulty)
        }
    }

    function nextQuestion() {
        setQuestionNumber(prev => prev + 1)
        setRound(makeRound(difficulty))
        setSelected(null)
        setTimeLeft(totalTime)
        setTimedOut(false)
    }

    function changeDifficulty(value: Difficulty) {
        setDifficulty(value)
        setRound(makeRound(value))
        setSelected(null)
        setTimeLeft(TIME_BY_DIFFICULTY[value])
        setTimedOut(false)
    }

    const showFeedback = selected !== null || timedOut
    const showHintCard = showFeedback && (timedOut || selected !== question.answer)

    return (
        <main className="word-practice">
            <div className="word-top-nav">
                <button className="math-back-button" onClick={onBack} type="button">← Quay về bản đồ</button>
            </div>

            <div className="word-grid">
                <div className="word-main-col">
                    <header className="word-header">
                        <div aria-hidden="true">🗺️</div>
                        <div>
                            <h1>GIẢI MÃ KHO BÁU</h1>
                            <p>Đọc câu chuyện, suy nghĩ và tìm đáp án!</p>
                        </div>
                    </header>

                    <div className="word-stats">
                        <span>⏱️ Tổng thời gian: <strong>{formatTime(elapsed)}</strong></span>
                        <span>⭐ Điểm: <strong>{score}</strong></span>
                        <span>📝 Đã trả lời: <strong>{answered}</strong></span>
                        <span>🗺️ Câu thứ: <strong>{questionNumber}</strong></span>
                    </div>

                    <section className="word-card">
                        <div className="word-timer-wrapper">
                            <div className="word-timer">
                                ⏱️ Thời gian còn lại:
                                <strong className={warn ? 'timer-warning' : ''}>{timeLeft}s</strong>
                            </div>
                        </div>

                        <div className="word-story">
                            <span aria-hidden="true">🏴‍☠️</span>
                            <p>{question.story}</p>
                        </div>

                        <h2>{question.question}</h2>

                        <div className="word-options">
                            {options.map((option, index) => {
                                const correct = option === question.answer
                                const chosen = option === selected
                                let className = `word-option word-option-${index + 1}`
                                if (showFeedback && correct) className += ' correct'
                                else if (chosen) className += ' incorrect'
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        className={className}
                                        disabled={selected !== null || timedOut}
                                        onClick={() => chooseAnswer(option)}
                                    >
                                        {String.fromCharCode(65 + index)}. {option}
                                        {showFeedback && correct ? ' ✓' : ''}
                                        {chosen && !correct ? ' ✕' : ''}
                                    </button>
                                )
                            })}
                        </div>
                    </section>
                </div>

                <aside className="word-side-col">
                    <div className="word-side-panel">
                        <label className="word-difficulty">
                            Chọn độ khó:
                            <select value={difficulty} onChange={e => changeDifficulty(e.target.value as Difficulty)}>
                                <option value="easy">Dễ</option>
                                <option value="medium">Trung bình</option>
                                <option value="hard">Nâng cao</option>
                                <option value="expert">Siêu khó</option>
                            </select>
                        </label>
                    </div>

                    {showFeedback && (
                        <>
                            <div className="word-feedback" role="status">
                                {timedOut ? (
                                    <>
                                        <strong>⏰ Hết giờ rồi!</strong>
                                        <p>Đáp án đúng là: {question.answer}</p>
                                        <p>Chuẩn bị sang câu tiếp theo...</p>
                                    </>
                                ) : (
                                    <>
                                        <strong>
                                            {selected === question.answer
                                                ? '🎉 Chính xác!'
                                                : '💡 Chưa đúng rồi!'}
                                        </strong>
                                        {selected !== question.answer && <p>Đáp án đúng là {question.answer}</p>}
                                    </>
                                )}
                            </div>

                            {showHintCard && (
                                <div className="word-hint">
                                    <div className="word-hint-title">
                                        <span>📘</span> Hướng dẫn giải chi tiết
                                    </div>
                                    <div className="hint-step-list">
                                        {question.hint.map((step, index) => {
                                            const icons = ['📖', '🧠', '✏️', '🎯']
                                            const icon = icons[index] || '✨'
                                            return (
                                                <div
                                                    key={index}
                                                    className="hint-step"
                                                    style={{ animationDelay: `${index * 0.1}s` }}
                                                >
                                                    <span className="hint-step-icon">{icon}</span>
                                                    <span className="hint-step-text">{step}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <button className="btn-next-question" onClick={nextQuestion}>
                                Câu tiếp theo ➜
                            </button>
                        </>
                    )}
                </aside>
            </div>
        </main>
    )
}