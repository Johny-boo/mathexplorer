import { useState, type ReactNode } from 'react'
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
            { label: 'Đồng hồ (Mặt tròn)', shape: 'Hình tròn' },
            { label: 'Quyển sách (Mặt chữ nhật)', shape: 'Hình chữ nhật' },
            { label: 'Miếng pizza (Mặt tam giác)', shape: 'Hình tam giác' },
            { label: 'Viên xúc xắc (Mặt vuông)', shape: 'Hình vuông' },
        ]
        const target = pick(items)
        prompt = `Vật nào trong hình có dạng ${target.shape}?`
        answer = target.label
        options = generateStringOptions(answer, items.map(i => i.label))
        explanation = `${target.label} có bề mặt dạng ${target.shape}.`
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
        const shapes: Record<string, ReactNode> = {
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
            <div className="geo-real-life-grid">
                <div className="real-life-card">
                    <svg viewBox="0 0 80 80" width="70" height="70">
                        <circle cx="40" cy="40" r="34" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" />
                        <line x1="40" y1="40" x2="40" y2="18" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                        <line x1="40" y1="40" x2="56" y2="40" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="40" cy="40" r="4" fill="#1e293b" />
                    </svg>
                    <span className="real-life-label">Đồng hồ (Mặt tròn)</span>
                </div>
                <div className="real-life-card">
                    <svg viewBox="0 0 80 80" width="70" height="70">
                        <rect x="15" y="12" width="50" height="56" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
                        <rect x="22" y="16" width="38" height="48" fill="#ffffff" />
                        <line x1="28" y1="26" x2="52" y2="26" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="28" y1="36" x2="52" y2="36" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="28" y1="46" x2="44" y2="46" stroke="#94a3b8" strokeWidth="2" />
                    </svg>
                    <span className="real-life-label">Quyển sách (Mặt chữ nhật)</span>
                </div>
                <div className="real-life-card">
                    <svg viewBox="0 0 80 80" width="70" height="70">
                        <polygon points="40,12 70,66 10,66" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
                        <path d="M 10 66 Q 40 76 70 66" fill="#b45309" stroke="#78350f" strokeWidth="3" />
                        <circle cx="36" cy="42" r="4" fill="#dc2626" />
                        <circle cx="48" cy="52" r="4" fill="#dc2626" />
                        <circle cx="28" cy="54" r="4" fill="#dc2626" />
                    </svg>
                    <span className="real-life-label">Miếng pizza (Mặt tam giác)</span>
                </div>
                <div className="real-life-card">
                    <svg viewBox="0 0 80 80" width="70" height="70">
                        <rect x="14" y="14" width="52" height="52" rx="8" fill="#f8fafc" stroke="#334155" strokeWidth="3.5" />
                        <circle cx="26" cy="26" r="3.5" fill="#ef4444" />
                        <circle cx="54" cy="26" r="3.5" fill="#ef4444" />
                        <circle cx="40" cy="40" r="3.5" fill="#ef4444" />
                        <circle cx="26" cy="54" r="3.5" fill="#ef4444" />
                        <circle cx="54" cy="54" r="3.5" fill="#ef4444" />
                    </svg>
                    <span className="real-life-label">Viên xúc xắc (Mặt vuông)</span>
                </div>
            </div>
        )
    }

    if (type === '3d') {
        return (
            <div className="geo-3d-grid">
                <div className="shape-3d-card">
                    <svg viewBox="0 0 100 100" width="80" height="80">
                        <polygon points="50,15 85,32 50,50 15,32" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="2.5" />
                        <polygon points="15,32 50,50 50,85 15,67" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="2.5" />
                        <polygon points="85,32 50,50 50,85 85,67" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2.5" />
                    </svg>
                    <span className="shape-3d-label">Khối lập phương</span>
                </div>
                <div className="shape-3d-card">
                    <svg viewBox="0 0 100 100" width="80" height="80">
                        <defs>
                            <radialGradient id="sphereGradGeo" cx="35%" cy="35%" r="65%">
                                <stop offset="0%" stopColor="#fecaca" />
                                <stop offset="40%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#991b1b" />
                            </radialGradient>
                        </defs>
                        <circle cx="50" cy="50" r="36" fill="url(#sphereGradGeo)" stroke="#7f1d1d" strokeWidth="2.5" />
                        <ellipse cx="40" cy="35" rx="8" ry="5" fill="#ffffff" opacity="0.5" transform="rotate(-30 40 35)" />
                    </svg>
                    <span className="shape-3d-label">Khối cầu</span>
                </div>
                <div className="shape-3d-card">
                    <svg viewBox="0 0 100 100" width="80" height="80">
                        <defs>
                            <linearGradient id="cylBodyGeo" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#34d399" />
                                <stop offset="50%" stopColor="#a7f3d0" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                        <path d="M 24 32 L 24 68 A 26 10 0 0 0 76 68 L 76 32 Z" fill="url(#cylBodyGeo)" stroke="#065f46" strokeWidth="2.5" />
                        <ellipse cx="50" cy="68" rx="26" ry="10" fill="none" stroke="#065f46" strokeWidth="1.5" strokeDasharray="3,3" />
                        <ellipse cx="50" cy="32" rx="26" ry="10" fill="#6ee7b7" stroke="#065f46" strokeWidth="2.5" />
                    </svg>
                    <span className="shape-3d-label">Khối trụ</span>
                </div>
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
    const sticks: ReactNode[] = [];
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