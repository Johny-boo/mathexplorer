import { useState } from 'react'
import type { Difficulty, SubSkillId } from './core/types'

type Props = {
    onBack: () => void
    onCorrect: (difficulty: Difficulty, subSkill: SubSkillId) => void
    onWrong: (difficulty: Difficulty, subSkill: SubSkillId) => void
    startDifficulty?: Difficulty
}

export type PatternItem = string | null | { type: 'clock', hour: number }

export type PatternQuestion = {
    prompt: string
    options: string[]
    answer: string
    explanation: string
    subSkill: SubSkillId
    sequenceType: 'row' | 'matrix'
    sequenceData: PatternItem[] | PatternItem[][]
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

function generateOptions(answer: string, pool: string[]): string[] {
    const filtered = pool.filter(e => e !== answer)
    const opts = [answer]
    while (opts.length < 4) {
        const e = pick(filtered)
        if (!opts.includes(e)) opts.push(e)
    }
    return shuffle(opts)
}

function generateNumberOptions(answer: number): string[] {
    const set = new Set<number>([answer])
    const offsets = shuffle([-1, 1, -2, 2, -3, 3, -10, 10])
    for (const off of offsets) {
        if (set.size >= 4) break
        const candidate = answer + off
        if (candidate > 0 && candidate !== answer) set.add(candidate)
    }
    let extra = 1
    while (set.size < 4) {
        if (!set.has(answer + extra)) set.add(answer + extra)
        extra++
    }
    return shuffle([...set]).map(String)
}

function generateClockOptions(answerHour: number): string[] {
    const formatTime = (h: number) => {
        let hour = h % 12
        if (hour === 0) hour = 12
        return `${hour} giờ`
    }
    const opts = new Set<string>([formatTime(answerHour)])
    const offsets = shuffle([-2, -1, 1, 2, 3])
    for (const off of offsets) {
        if (opts.size >= 4) break
        opts.add(formatTime(answerHour + off))
    }
    return shuffle([...opts])
}

function getSizedEmoji(emoji: string, size: 'small' | 'medium' | 'large'): string {
    const sizes = { small: '20px', medium: '40px', large: '60px' };
    return `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:${sizes[size]}; line-height:1">${emoji}</div>`;
}

export function createQuestion(difficulty: Difficulty): PatternQuestion {
    // TẤT CẢ DẠNG BÀI ĐỀU CÓ MẶT Ở MỌI CẤP ĐỘ
    const types = [
        'EmojiAB', 'EmojiAABB', 'Vehicle', 'Size', 'Clock', 'ClockReverse',
        'Rotation', 'NumberStep', 'NumberSkip', 'NumberGeometric', 'NumberInterleave',
        'Matrix2x2', 'Matrix3x3', 'MatrixDiagonal'
    ]
    const type = pick(types)

    const prompt = 'Điền vào dấu ?'
    let options: string[] = []
    let answer = ''
    let explanation = ''
    let subSkill: SubSkillId = 'pattern.ab'
    let sequenceType: 'row' | 'matrix' = 'row'
    let sequenceData: any = []

    const formatNumArray = (arr: (number | null)[]) => arr.map(x => x === null ? null : String(x))

    // Scale theo độ khó
    let max = 20; let stepMax = 3; let multMax = 2;
    if (difficulty === 'medium') { max = 50; stepMax = 5; multMax = 3; }
    else if (difficulty === 'hard') { max = 100; stepMax = 10; multMax = 4; }
    else if (difficulty === 'expert') { max = 500; stepMax = 100; multMax = 5; }

    if (type === 'EmojiAB') {
        subSkill = 'pattern.ab'
        const pool = ['🍎', '🍌', '🍇', '🍓', '🐶', '🐱', '🐭', '🐹', '☀️', '☁️', '🐸', '🦊']
        const a = pick(pool)
        const b = pick(pool.filter(x => x !== a))
        const isReversed = Math.random() > 0.5
        if (isReversed) {
            sequenceData = [b, a, b, a, b, null]
            answer = a
            explanation = `Quy luật lặp lại: ${b} rồi ${a}. Vậy tiếp theo là ${a}.`
        } else {
            sequenceData = [a, b, a, b, a, null]
            answer = b
            explanation = `Quy luật lặp lại: ${a} rồi ${b}. Vậy tiếp theo là ${b}.`
        }
        options = generateOptions(answer, pool)
    }
    else if (type === 'EmojiAABB') {
        subSkill = 'pattern.abc'
        const pool = ['🍎', '🍌', '🍇', '🍓', '🔺', '🟦', '🟢', '⭐']
        const a = pick(pool)
        const b = pick(pool.filter(x => x !== a))
        sequenceData = [a, a, b, b, a, a, null]
        answer = b
        options = generateOptions(answer, pool)
        explanation = `Quy luật lặp lại theo cặp: ${a}${a} rồi ${b}${b}. Vậy tiếp theo là ${b}.`
    }
    else if (type === 'Vehicle') {
        subSkill = 'pattern.abc'
        const pool = ['🚗', '🚕', '🚙', '🚌', '🚑', '🚒', '🚓', '🚚']
        const a = pick(pool)
        const b = pick(pool.filter(x => x !== a))
        const c = pick(pool.filter(x => x !== a && x !== b))
        const all = [a, b, c]
        const startIdx = randInt(0, 2)
        const seq = [...all.slice(startIdx), ...all.slice(0, startIdx)]
        sequenceData = [seq[0], seq[1], seq[2], seq[0], seq[1], null]
        answer = seq[2]
        options = generateOptions(answer, pool)
        explanation = `Quy luật: ${seq[0]}, ${seq[1]}, ${seq[2]} lặp lại theo nhóm 3 xe. Vậy tiếp theo là ${seq[2]}.`
    }
    else if (type === 'Clock') {
        subSkill = 'pattern.step'
        const step = randInt(1, difficulty === 'expert' ? 4 : difficulty === 'hard' ? 3 : 2)
        const startHour = randInt(1, 5)
        const h1 = startHour, h2 = startHour + step, h3 = startHour + step * 2, h4 = startHour + step * 3
        sequenceData = [
            { type: 'clock', hour: h1 }, { type: 'clock', hour: h2 },
            { type: 'clock', hour: h3 }, { type: 'clock', hour: h4 }, null
        ]
        answer = `${(startHour + step * 4 - 1) % 12 + 1} giờ`
        options = generateClockOptions(startHour + step * 4)
        explanation = `Kim đồng hồ tiến thêm ${step} giờ mỗi lần. Vậy tiếp theo là ${answer}.`
    }
    else if (type === 'ClockReverse') {
        subSkill = 'pattern.step'
        const step = randInt(1, difficulty === 'expert' ? 4 : difficulty === 'hard' ? 3 : 2)
        const startHour = randInt(8, 12)
        const h1 = startHour, h2 = startHour - step, h3 = startHour - step * 2, h4 = startHour - step * 3
        sequenceData = [
            { type: 'clock', hour: h1 }, { type: 'clock', hour: h2 },
            { type: 'clock', hour: h3 }, { type: 'clock', hour: h4 }, null
        ]
        answer = `${(startHour - step * 4 - 1 + 12) % 12 + 1} giờ`
        options = generateClockOptions(startHour - step * 4)
        explanation = `Kim đồng hồ quay ngược lại ${step} giờ mỗi lần. Vậy tiếp theo là ${answer}.`
    }
    else if (type === 'Rotation') {
        subSkill = 'pattern.geometry'
        const isArrow = Math.random() > 0.5
        if (isArrow) {
            const arrows = ['⬆️', '➡️', '⬇️', '⬅️']
            const start = randInt(0, 3)
            sequenceData = [arrows[start % 4], arrows[(start + 1) % 4], arrows[(start + 2) % 4], null, arrows[start % 4]]
            answer = arrows[(start + 3) % 4]
            options = generateOptions(answer, arrows)
            explanation = `Mũi tên xoay 90 độ theo chiều kim đồng hồ. Vậy tiếp theo là ${answer}.`
        } else {
            const shapes = Math.random() > 0.5 ? ['🔺', '🟦', '🔺', '🟦', '🔺'] : ['🟦', '🔺', '🟦', '🔺', '🟦']
            sequenceData = [shapes[0], shapes[1], shapes[0], null, shapes[0]]
            answer = shapes[1]
            options = generateOptions(answer, ['🔺', '🟦', '🟢', '⭐', '🔶', '🔷'])
            explanation = `Hình ảnh xen kẽ: ${shapes[0]} rồi ${shapes[1]}. Vậy tiếp theo là ${shapes[1]}.`
        }
    }
    else if (type === 'Size') {
        subSkill = 'pattern.step'
        const s = pick(['🔴', '🔵', '⭐', '🍎'])
        const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large']
        const isReversed = Math.random() > 0.5
        const seqSizes = isReversed ? [sizes[2], sizes[1], sizes[0], sizes[2]] : [sizes[0], sizes[1], sizes[2], sizes[0]]
        sequenceData = [
            getSizedEmoji(s, seqSizes[0]), getSizedEmoji(s, seqSizes[1]),
            getSizedEmoji(s, seqSizes[2]), getSizedEmoji(s, seqSizes[3]), null
        ]
        answer = getSizedEmoji(s, seqSizes[1])
        const otherSizes = shuffle(sizes.filter(x => x !== seqSizes[1]))
        options = shuffle([
            getSizedEmoji(s, seqSizes[0]), getSizedEmoji(s, seqSizes[1]),
            getSizedEmoji(s, seqSizes[2]), getSizedEmoji(pick(['🟩', '🟦']), otherSizes[0])
        ])
        explanation = `Quy luật kích thước thay đổi theo thứ tự. Vậy tiếp theo là hình ${seqSizes[1] === 'small' ? 'nhỏ' : seqSizes[1] === 'medium' ? 'vừa' : 'to'}.`
    }
    else if (type === 'Matrix2x2') {
        subSkill = 'pattern.matrix'
        sequenceType = 'matrix'
        const pool = ['🔺', '🟦', '🟢', '⭐', '🌙', '🍎', '🍌', '🍇']
        const a = pick(pool)
        const b = pick(pool.filter(x => x !== a))
        if (Math.random() > 0.5) {
            sequenceData = [[a, b], [a, null]]
            answer = b
            explanation = `Hàng dưới giống hệt hàng trên. Vậy hình còn thiếu là ${b}.`
        } else {
            sequenceData = [[a, a], [b, null]]
            answer = b
            explanation = `Cột bên phải giống hệt cột bên trái. Vậy hình còn thiếu là ${b}.`
        }
        options = generateOptions(answer, pool)
    }
    else if (type === 'MatrixDiagonal') {
        subSkill = 'pattern.matrix'
        sequenceType = 'matrix'
        const pool = ['🔺', '🟦', '🟢', '⭐', '🌙', '🍎']
        const a = pick(pool)
        const b = pick(pool.filter(x => x !== a))
        const c = pick(pool.filter(x => x !== a && x !== b))
        sequenceData = [[a, b], [b, a], [c, b], [b, null]]
        answer = c
        options = generateOptions(answer, pool)
        explanation = `Quy luật đường chéo: Các hình ở đường chéo giống nhau. Vậy hình còn thiếu là ${c}.`
    }
    else if (type === 'Matrix3x3') {
        subSkill = 'pattern.matrix'
        sequenceType = 'matrix'
        const pool = ['🔺', '🟦', '🟢', '⭐', '🌙', '🔶', '🔷', '🟨']
        const a = pick(pool)
        const b = pick(pool.filter(x => x !== a))
        const c = pick(pool.filter(x => x !== a && x !== b))
        sequenceData = [[a, b, c], [b, c, a], [c, a, null]]
        answer = b
        options = generateOptions(answer, pool)
        explanation = `Mỗi hàng đều có đủ 3 hình khác nhau. Hàng cuối đã có ${c} và ${a}, còn thiếu ${b}.`
    }
    else if (type === 'NumberStep') {
        subSkill = 'pattern.step'
        const start = randInt(1, max)
        const step = randInt(2, stepMax) * (Math.random() > 0.5 ? 1 : -1)
        sequenceData = formatNumArray([start, start + step, start + step * 2, start + step * 3, null])
        answer = String(start + step * 4)
        options = generateNumberOptions(start + step * 4)
        explanation = `Quy luật: ${step > 0 ? 'cộng' : 'trừ'} ${Math.abs(step)} mỗi bước. Vậy tiếp theo là ${answer}.`
    }
    else if (type === 'NumberGeometric') {
        subSkill = 'pattern.mulstep'
        const start = randInt(1, 5)
        const mult = randInt(2, multMax)
        sequenceData = formatNumArray([start, start * mult, start * mult * mult, start * mult * mult * mult, null])
        answer = String(start * mult * mult * mult * mult)
        options = generateNumberOptions(start * mult * mult * mult * mult)
        explanation = `Quy luật: gấp ${mult} lần mỗi bước. Vậy tiếp theo là ${answer}.`
    }
    else if (type === 'NumberSkip') {
        subSkill = 'pattern.step'
        const step = randInt(2, stepMax) * (Math.random() > 0.5 ? 10 : 5)
        const start = randInt(1, max)
        sequenceData = formatNumArray([start, start + step, start + step * 2, start + step * 3, null])
        answer = String(start + step * 4)
        options = generateNumberOptions(start + step * 4)
        explanation = `Quy luật: đếm cách quãng, cộng ${step} mỗi bước. Vậy tiếp theo là ${answer}.`
    }
    else if (type === 'NumberInterleave') {
        subSkill = 'pattern.interleave'
        const start1 = randInt(1, max)
        const step1 = randInt(2, stepMax)
        const start2 = randInt(max / 2, max)
        const step2 = randInt(5, stepMax * 2)
        sequenceData = formatNumArray([start1, start2, start1 + step1, start2 + step2, null])
        answer = String(start1 + step1 * 2)
        options = generateNumberOptions(start1 + step1 * 2)
        explanation = `Hai quy luật xen kẽ: dãy 1 (vị trí 1, 3, 5) tăng ${step1}, dãy 2 (vị trí 2, 4) tăng ${step2}. Vị trí tiếp theo thuộc dãy 1: ${answer}.`
    }

    return { prompt, options, answer, explanation, subSkill, sequenceType, sequenceData }
}

// --- COMPONENT VẼ MẶT ĐỒNG HỒ ĐỦ 12 SỐ ---
function ClockFace({ hour }: { hour: number }) {
    const hourAngle = ((hour % 12) * 30 - 90) * (Math.PI / 180)
    const minuteAngle = -90 * (Math.PI / 180)

    const hourHandX = 50 + 22 * Math.cos(hourAngle)
    const hourHandY = 50 + 22 * Math.sin(hourAngle)
    const minuteHandX = 50 + 32 * Math.cos(minuteAngle)
    const minuteHandY = 50 + 32 * Math.sin(minuteAngle)

    const numbers = Array.from({ length: 12 }, (_, i) => i + 1)

    return (
        <svg viewBox= "0 0 100 100" style = {{ width: '100%', height: '100%' }
}>
    <circle cx="50" cy = "50" r = "45" fill = "#ffffff" stroke = "#334155" strokeWidth = "3" />
    {
        numbers.map(num => {
            const angle = ((num * 30) - 90) * (Math.PI / 180)
            const r = 34
            const x = 50 + r * Math.cos(angle)
            const y = 50 + r * Math.sin(angle)
            return (
                <text key= { num } x = { x } y = { y } fontSize = "11" textAnchor = "middle" dominantBaseline = "central" fontWeight = "bold" fill = "#1e293b" >
                { num }
                    </text>
                )
    })}
<line x1="50" y1 = "50" x2 = { hourHandX } y2 = { hourHandY } stroke = "#e11d48" strokeWidth = "5" strokeLinecap = "round" />
    <line x1="50" y1 = "50" x2 = { minuteHandX } y2 = { minuteHandY } stroke = "#2563eb" strokeWidth = "3" strokeLinecap = "round" />
        <circle cx="50" cy = "50" r = "4" fill = "#334155" />
            </svg>
    )
}

// --- COMPONENT HIỂN THỊ DÃY HÌNH ---
function SequenceDisplay({ type, data }: { type: 'row' | 'matrix', data: any }) {
    const renderItem = (item: PatternItem) => {
        if (item === null) {
            return <div className="seq-card seq-missing" >? </div>
        }
        if (typeof item === 'object' && item.type === 'clock') {
            return (
                <div className= "seq-card" style = {{ padding: '8px' }
        }>
            <ClockFace hour={ item.hour } />
                </div>
            )
}
if (typeof item === 'string' && item.startsWith('<')) {
    return <div className="seq-card" dangerouslySetInnerHTML = {{ __html: item }
} />
        }
return <div className="seq-card" > { item as string } </div>
    }

if (type === 'row') {
    return (
        <div className= "seq-row" >
        {(data as PatternItem[]).map((item, idx) => (
            <div key= { idx } > { renderItem(item) } </div>
        ))
}
</div>
        )
    }

return (
    <div className= "seq-matrix" >
    {(data as PatternItem[][]).map((row, rIdx) => (
        <div key= { rIdx } className = "seq-matrix-row" >
        {
            row.map((item, cIdx) => (
                <div key= { cIdx } > { renderItem(item) } </div>
            ))}
</div>
            ))}
</div>
    )
}

export default function PatternCave({ onBack, onCorrect, onWrong, startDifficulty }: Props) {
    const [difficulty, setDifficulty] = useState<Difficulty>(startDifficulty ?? 'easy')
    const [question, setQuestion] = useState<PatternQuestion>(() => createQuestion(startDifficulty ?? 'easy'))
    const [selected, setSelected] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState(false)

    function handleChoose(opt: string) {
        if (selected !== null) return
        setSelected(opt)
        const correct = opt === question.answer
        setIsCorrect(correct)
        if (correct) onCorrect(difficulty, question.subSkill)
        else onWrong(difficulty, question.subSkill)
    }

    function nextQuestion() {
        setQuestion(createQuestion(difficulty))
        setSelected(null)
    }

    function changeDifficulty(d: Difficulty) {
        setDifficulty(d)
        setQuestion(createQuestion(d))
        setSelected(null)
    }

    return (
        <main className= "pattern-practice" >
        <div className="pattern-top-nav" >
            <button className="math-back-button" onClick = { onBack } >← Quay về bản đồ </button>
                </div>

                < div className = "pattern-container" >
                    <header className="pattern-header" >
                        <h1>🔍 HANG QUY LUẬT </h1>
                            < p > Tìm ra quy luật và chọn đáp án điền vào dấu ? </p>
                                </header>

                                < div className = "pattern-card" >
                                    <SequenceDisplay type={ question.sequenceType } data = { question.sequenceData } />

                                        <div className="pattern-options" style = {{ marginTop: '32px' }
}>
{
    question.options.map(opt => {
        const isChosen = opt === selected
        const isRightAnswer = opt === question.answer
        let cls = 'pattern-option'
        if (selected !== null) {
            if (isRightAnswer) cls += ' correct'
            else if (isChosen) cls += ' incorrect'
        }

        if (opt.includes('giờ')) {
            const hour = parseInt(opt.split(' ')[0])
            return (
                <button key= { opt } className = { cls } onClick = {() => handleChoose(opt)
        } disabled = { selected !== null
    } style = {{ padding: '8px' }} >
    <div style={ { width: '60px', height: '60px', margin: '0 auto' } }>
        <ClockFace hour={ hour } />
            </div>
            </button>
                                )
                            }

if (opt.startsWith('<')) {
    return (
        <button key= { opt } className = { cls } onClick = {() => handleChoose(opt)
} disabled = { selected !== null}>
    <div dangerouslySetInnerHTML={ { __html: opt } } />
        </button>
                                )
                            }

return (
    <button key= { opt } className = { cls } onClick = {() => handleChoose(opt)} disabled = { selected !== null}>
    { opt }
        </button>
                            )
                        })}
</div>

{
    selected !== null && (
        <div className="pattern-feedback" >
            <h3>{ isCorrect? '🎉 Chính xác!': '💡 Chưa đúng rồi!' } </h3>
            < p > { question.explanation } </p>
            < button className = "btn-next-question" onClick = { nextQuestion } > Câu tiếp theo ➜</button>
                </div>
                    )
}
</div>
    </div>

    < aside className = "pattern-side-panel" >
        <label className="word-difficulty" >
            Chọn độ khó:
<select value={ difficulty } onChange = { e => changeDifficulty(e.target.value as Difficulty) } disabled = { selected !== null}>
    <option value="easy" > Dễ </option>
        < option value = "medium" > Trung bình </option>
            < option value = "hard" > Nâng cao </option>
                < option value = "expert" > Siêu khó </option>
                    </select>
                    </label>
                    </aside>
                    </main>
    )
}