import { useState } from 'react'
import type { Difficulty, SubSkillId } from './core/types'

type Props = {
    onBack: () => void
    onCorrect: (difficulty: Difficulty, subSkill: SubSkillId) => void
    onWrong: (difficulty: Difficulty, subSkill: SubSkillId) => void
    startDifficulty?: Difficulty
}

export type GeometryQuestion = {
    prompt: string
    options: string[]
    answer: string
    explanation: string
    subSkill: SubSkillId
    visualType?: 'identify' | 'real-life' | 'count' | 'symmetry' | 'sticks' | 'compose' | 'perimeter' | '3d' | 'angles' | 'truefalse'
    visualData?: any
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
function generateNumberOptions(answer: number): string[] {
    const set = new Set<number>([answer])
    const offsets = shuffle([-1, 1, -2, 2, -3, 3, -4, 4])
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
function generateStringOptions(answer: string, pool: string[]): string[] {
    const filtered = pool.filter(e => e !== answer)
    const opts = [answer]
    while (opts.length < 4) {
        const e = pick(filtered)
        if (!opts.includes(e)) opts.push(e)
    }
    return shuffle(opts)
}

export function createQuestion(difficulty: Difficulty): GeometryQuestion {
    // TẤT CẢ DẠNG BÀI ĐỀU CÓ MẶT Ở MỌI CẤP ĐỘ
    const types = ['Identify', 'RealLife', '3D', 'Perimeter', 'Compose', 'Angles', 'TrueFalse', 'Count', 'Symmetry', 'Sticks']
    const type = pick(types)

    let prompt = ''
    let options: string[] = []
    let answer = ''
    let explanation = ''
    let subSkill: SubSkillId = 'geometry.identify'
    let visualType: GeometryQuestion['visualType'] = undefined
    let visualData: any = undefined

    // Scale theo độ khó
    let maxGrid = 2; let maxSticks = 3;
    if (difficulty === 'medium') { maxGrid = 3; maxSticks = 4; }
    else if (difficulty === 'hard') { maxGrid = 4; maxSticks = 5; }
    else if (difficulty === 'expert') { maxGrid = 5; maxSticks = 6; }

    if (type === 'Identify') {
        subSkill = 'geometry.identify'
        const shapes = [
            { name: 'Hình tam giác', pool: ['Hình tam giác', 'Hình vuông', 'Hình tròn', 'Hình chữ nhật', 'Hình ngũ giác'] },
            { name: 'Hình vuông', pool: ['Hình tam giác', 'Hình vuông', 'Hình tròn', 'Hình chữ nhật', 'Hình ngũ giác'] },
            { name: 'Hình tròn', pool: ['Hình tam giác', 'Hình vuông', 'Hình tròn', 'Hình chữ nhật', 'Hình ngũ giác'] },
            { name: 'Hình chữ nhật', pool: ['Hình tam giác', 'Hình vuông', 'Hình tròn', 'Hình chữ nhật', 'Hình ngũ giác'] },
        ]
        const target = pick(shapes)
        prompt = `Hình trên là hình gì?`
        answer = target.name
        options = generateStringOptions(answer, target.pool)
        explanation = `Đây là ${target.name}.`
        visualType = 'identify'
        visualData = target.name
    }
    else if (type === 'RealLife') {
        subSkill = 'geometry.identify'
        const items = [
            { emoji: '🕰️', shape: 'Hình tròn', pool: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'] },
            { emoji: '📕', shape: 'Hình chữ nhật', pool: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'] },
            { emoji: '🍕', shape: 'Hình tam giác', pool: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'] },
            { emoji: '🎲', shape: 'Hình vuông', pool: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'] },
        ]
        const target = pick(items)
        prompt = `Vật nào sau đây có dạng ${target.shape}?`
        answer = target.emoji
        options = generateStringOptions(answer, items.map(i => i.emoji))
        explanation = `${target.emoji} có dạng ${target.shape}.`
        visualType = 'real-life'
        visualData = 'all'
    }
    else if (type === '3D') {
        subSkill = 'geometry.identify'
        prompt = pick([`Khối nào có thể LĂN được?`, `Khối nào có thể XẾP CHỒNG lên nhau?`])
        if (prompt.includes('LĂN')) {
            answer = 'Khối cầu và Khối trụ'
            options = generateStringOptions(answer, ['Khối cầu và Khối trụ', 'Khối lập phương', 'Chỉ có khối lập phương', 'Cả 3 khối'])
            explanation = `Khối cầu và khối trụ có mặt cong nên có thể lăn được.`
        } else {
            answer = 'Khối lập phương và Khối trụ'
            options = generateStringOptions(answer, ['Khối lập phương và Khối trụ', 'Khối cầu', 'Chỉ có khối cầu', 'Cả 3 khối'])
            explanation = `Khối lập phương và khối trụ có mặt phẳng ở đáy nên xếp chồng được.`
        }
        visualType = '3d'
    }
    else if (type === 'Perimeter') {
        subSkill = 'geometry.edges'
        const r = randInt(1, maxGrid), c = randInt(2, maxGrid + 1)
        prompt = `Hình chữ nhật sau được tạo bởi các ô vuông nhỏ. Chu vi của hình chữ nhật lớn là bao nhiêu? (Đếm số cạnh ngoài cùng)`
        const ans = (r + c) * 2
        answer = String(ans)
        options = generateNumberOptions(ans)
        explanation = `Hình có chiều dài ${c} ô và chiều rộng ${r} ô. Chu vi = (Dài + Rộng) × 2 = (${c} + ${r}) × 2 = ${ans}.`
        visualType = 'perimeter'
        visualData = { rows: r, cols: c }
    }
    else if (type === 'Compose') {
        subSkill = 'geometry.identify'
        prompt = `Nếu ghép 2 hình tam giác vuông (bằng nhau) lại với nhau, ta sẽ được hình gì?`
        answer = 'Hình vuông hoặc Hình chữ nhật'
        options = generateStringOptions(answer, ['Hình vuông hoặc Hình chữ nhật', 'Hình tròn', 'Hình tam giác', 'Hình ngũ giác'])
        explanation = `Hai tam giác vuông ghép lại sẽ tạo thành một hình vuông hoặc hình chữ nhật.`
        visualType = 'compose'
    }
    else if (type === 'Angles') {
        subSkill = 'geometry.identify'
        const shapes = [
            { name: 'Hình tam giác', angles: 3 }, { name: 'Hình vuông', angles: 4 },
            { name: 'Hình ngũ giác', angles: 5 }, { name: 'Hình lục giác', angles: 6 }
        ]
        const target = pick(shapes)
        prompt = `${target.name} có mấy góc (đỉnh)?`
        answer = String(target.angles)
        options = generateNumberOptions(target.angles)
        explanation = `${target.name} có ${target.angles} góc và ${target.angles} cạnh.`
        visualType = 'identify'
        visualData = target.name
    }
    else if (type === 'TrueFalse') {
        subSkill = 'geometry.identify'
        const items = [
            { text: 'Hình tròn có 4 góc.', isTrue: false, exp: 'Hình tròn không có góc nào.' },
            { text: 'Hình vuông có 4 cạnh bằng nhau.', isTrue: true, exp: 'Hình vuông có 4 cạnh bằng nhau.' },
            { text: 'Hình tam giác có 3 cạnh.', isTrue: true, exp: 'Hình tam giác có 3 cạnh.' },
            { text: 'Hình chữ nhật có 5 cạnh.', isTrue: false, exp: 'Hình chữ nhật chỉ có 4 cạnh.' }
        ]
        const target = pick(items)
        prompt = `Nhận định sau ĐÚNG hay SAI?\n"${target.text}"`
        answer = target.isTrue ? 'ĐÚNG' : 'SAI'
        options = ['ĐÚNG', 'SAI']
        explanation = target.exp
    }
    else if (type === 'Count') {
        subSkill = 'geometry.count'
        const isSquare = Math.random() > 0.5
        if (isSquare) {
            prompt = 'Hình lớn được chia làm 4 hình vuông nhỏ bằng nhau. Hỏi có tất cả bao nhiêu hình vuông?'
            answer = '5'; options = generateNumberOptions(5)
            explanation = 'Có 4 hình vuông nhỏ ở trong và 1 hình vuông lớn bao ngoài. Tổng cộng là 5 hình.'
            visualType = 'count'; visualData = 'squares'
        } else {
            prompt = 'Hình lớn được chia làm 4 hình tam giác nhỏ bằng nhau. Hỏi có tất cả bao nhiêu hình tam giác?'
            answer = '5'; options = generateNumberOptions(5)
            explanation = 'Có 4 hình tam giác nhỏ ở trong và 1 hình tam giác lớn bao ngoài. Tổng cộng là 5 hình.'
            visualType = 'count'; visualData = 'triangles'
        }
    }
    else if (type === 'Symmetry') {
        subSkill = 'geometry.symmetry'
        prompt = 'Hình nào sau đây KHÔNG có trục đối xứng?'
        answer = 'Hình bình hành'
        options = shuffle(['Hình bình hành', 'Hình vuông', 'Hình chữ nhật', 'Hình tròn'])
        explanation = 'Hình vuông, hình chữ nhật và hình tròn đều có trục đối xứng. Chỉ có hình bình hành là không có trục đối xứng.'
        visualType = 'symmetry'; visualData = 'parallelogram'
    }
    else if (type === 'Sticks') {
        subSkill = 'geometry.sticks'
        const n = randInt(2, maxSticks)
        prompt = `Để xếp ${n} hình vuông liền nhau (chung cạnh), con cần bao nhiêu que tính?`
        const ans = 3 * n + 1
        answer = String(ans)
        options = generateNumberOptions(ans)
        explanation = `Hình vuông đầu tiên cần 4 que. Mỗi hình vuông nối thêm cần 3 que. Vậy ${n} hình cần: 4 + 3 × (${n} - 1) = ${ans} que.`
        visualType = 'sticks'; visualData = n
    }

    return { prompt, options, answer, explanation, subSkill, visualType, visualData }
}

// --- COMPONENT VẼ HÌNH ---
function ShapeVisual({ type, data }: { type?: string, data?: any }) {
    if (!type) return null;

    if (type === 'identify') {
        const shapes: Record<string, JSX.Element> = {
            'Hình tam giác': <polygon points="50,5 95,95 5,95" fill = "#fbbf24" stroke="#b45309" strokeWidth="3" />,
            'Hình vuông': <rect x="10" y = "10" width="80" height="80" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="3" />,
            'Hình tròn': <circle cx="50" cy = "50" r="45" fill="#f87171" stroke="#7f1d1d" strokeWidth="3" />,
            'Hình chữ nhật': <rect x="5" y = "25" width="90" height="50" fill="#34d399" stroke="#064e3b" strokeWidth="3" />,
            'Hình ngũ giác': <polygon points="50,5 95,38 78,95 22,95 5,38" fill = "#a78bfa" stroke="#4c1d95" strokeWidth="3" />,
            'Hình lục giác': <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill = "#f472b6" stroke="#831843" strokeWidth="3" />
        }
        return (
            <div className= "geo-svg-container" >
            <svg viewBox="0 0 100 100" preserveAspectRatio = "xMidYMid meet" >
            { shapes[data] || shapes['Hình tam giác'] }
                </svg>
                </div>
        )
    }

    if (type === 'real-life') {
        return (
            <div className= "geo-svg-container" style = {{ flexDirection: 'column' }
    }>
        <div style={ { fontSize: '80px', marginBottom: '16px' } }>🕰️ 📕 🍕 🎲</div>
            </div>
        )
}

if (type === '3d') {
    return (
        <div className= "geo-svg-container" style = {{ flexDirection: 'column' }
}>
    <div style={ { fontSize: '80px', marginBottom: '16px' } }>🧊 ⚽ 🥫</div>
        </div>
        )
    }

if (type === 'perimeter') {
    const { rows, cols } = data;
    const cellSize = 40;
    const width = cols * cellSize;
    const height = rows * cellSize;
    const grid = [];

    for (let i = 0; i <= cols; i++) {
        grid.push(<line key={`v${i}`} x1 = { i*cellSize} y1 = { 0} x2 = { i*cellSize} y2 = { height } stroke = "#cbd5e1" strokeWidth = "2" />)
}
for (let j = 0; j <= rows; j++) {
    grid.push(<line key={`h${j}`} x1 = { 0} y1 = { j*cellSize} x2 = { width } y2 = { j*cellSize} stroke = "#cbd5e1" strokeWidth = "2" />)
        }

return (
    <div className= "geo-svg-container" >
    <svg viewBox={ `-10 -10 ${width + 20} ${height + 20}` } preserveAspectRatio = "xMidYMid meet" >
        <rect x="0" y = "0" width = { width } height = { height } fill = "#eff6ff" stroke = "#1e3a8a" strokeWidth = "4" />
        { grid }
            </svg>
            </div>
        )
    }

if (type === 'compose') {
    return (
        <div className= "geo-svg-container" >
        <svg viewBox="0 0 100 100" preserveAspectRatio = "xMidYMid meet" >
            <polygon points="10,80 50,80 50,40" fill = "#fbbf24" stroke = "#b45309" strokeWidth = "3" />
                <polygon points="50,80 50,40 90,80" fill = "#fcd34d" stroke = "#b45309" strokeWidth = "3" />
                    </svg>
                    </div>
        )
}

if (type === 'count' && data === 'squares') {
    return (
        <div className= "geo-svg-container" >
        <svg viewBox="0 0 100 100" preserveAspectRatio = "xMidYMid meet" >
            <rect x="5" y = "5" width = "90" height = "90" fill = "#eff6ff" stroke = "#1e3a8a" strokeWidth = "2" />
                <line x1="50" y1 = "5" x2 = "50" y2 = "95" stroke = "#1e3a8a" strokeWidth = "2" />
                    <line x1="5" y1 = "50" x2 = "95" y2 = "50" stroke = "#1e3a8a" strokeWidth = "2" />
                        </svg>
                        </div>
        )
}

if (type === 'count' && data === 'triangles') {
    return (
        <div className= "geo-svg-container" >
        <svg viewBox="0 0 100 100" preserveAspectRatio = "xMidYMid meet" >
            <polygon points="50,5 95,95 5,95" fill = "#fffbeb" stroke = "#b45309" strokeWidth = "2" />
                <line x1="27.5" y1 = "50" x2 = "72.5" y2 = "50" stroke = "#b45309" strokeWidth = "2" />
                    <line x1="27.5" y1 = "50" x2 = "50" y2 = "95" stroke = "#b45309" strokeWidth = "2" />
                        <line x1="72.5" y1 = "50" x2 = "50" y2 = "95" stroke = "#b45309" strokeWidth = "2" />
                            </svg>
                            </div>
        )
}

if (type === 'symmetry') {
    return (
        <div className= "geo-svg-container" >
        <svg viewBox="0 0 100 100" preserveAspectRatio = "xMidYMid meet" >
            <polygon points="25,20 95,20 75,80 5,80" fill = "#fca5a5" stroke = "#991b1b" strokeWidth = "3" />
                </svg>
                </div>
        )
}

if (type === 'sticks') {
    const n = data as number;
    const sticks: JSX.Element[] = [];
    const size = 40;
    const paddingX = 20;
    const paddingY = 20;

    for (let i = 0; i <= n; i++) {
        sticks.push(<line key={`v${i}`} x1 = { paddingX + i * size
} y1 = { paddingY } x2 = { paddingX + i * size} y2 = { paddingY + size} stroke = "#b45309" strokeWidth = "6" strokeLinecap = "round" />);
        }
for (let i = 0; i < n; i++) {
    sticks.push(<line key={`ht${i}`} x1 = { paddingX + i * size} y1 = { paddingY } x2 = { paddingX + (i + 1) * size} y2 = { paddingY } stroke = "#b45309" strokeWidth = "6" strokeLinecap = "round" />);
sticks.push(<line key={`hb${i}`} x1 = { paddingX + i * size} y1 = { paddingY + size} x2 = { paddingX + (i + 1) * size} y2 = { paddingY + size} stroke = "#b45309" strokeWidth = "6" strokeLinecap = "round" />);
        }
return (
    <div className= "geo-svg-container" >
    <svg viewBox={ `0 0 ${n * size + paddingX * 2} ${size + paddingY * 2}` } preserveAspectRatio = "xMidYMid meet" > { sticks } </svg>
        </div>
        )
    }

return null;
}

export default function GeometryMountain({ onBack, onCorrect, onWrong, startDifficulty }: Props) {
    const [difficulty, setDifficulty] = useState<Difficulty>(startDifficulty ?? 'easy')
    const [question, setQuestion] = useState<GeometryQuestion>(() => createQuestion(startDifficulty ?? 'easy'))
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
        <main className= "pattern-practice geometry-practice" >
        <div className="pattern-top-nav" >
            <button className="math-back-button" onClick = { onBack } >← Quay về bản đồ </button>
                </div>

                < div className = "pattern-container" >
                    <header className="pattern-header" >
                        <h1>📐 NÚI HÌNH HỌC </h1>
                            < p > Quan sát hình ảnh và chọn đáp án đúng! </p>
                                </header>

                                < div className = "pattern-card" >
                                    <ShapeVisual type={ question.visualType } data = { question.visualData } />

                                        <div className="pattern-prompt geo-prompt" style = {{ whiteSpace: 'pre-line' }
}>
{ question.prompt }
    </div>

    < div className = "pattern-options geo-options" >
    {
        question.options.map(opt => {
            const isChosen = opt === selected
            const isRightAnswer = opt === question.answer
            let cls = 'pattern-option geo-option'
            if (selected !== null) {
                if (isRightAnswer) cls += ' correct'
                else if (isChosen) cls += ' incorrect'
            }
            return (
                <button key= { opt } className = { cls } onClick = {() => handleChoose(opt)
        } disabled = { selected !== null} >
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