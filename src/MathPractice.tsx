import { useEffect, useState } from 'react'
import type { Difficulty, SubSkillId } from './core/types'

type Props = {
    onBack: () => void
    onCorrect: (difficulty: Difficulty, subSkill: SubSkillId) => void
    onWrong: (difficulty: Difficulty, subSkill: SubSkillId) => void
    startDifficulty?: Difficulty
}

export type MathQuestion = {
    prompt: string
    options: string[]
    answer: string
    subSkill: SubSkillId
}

type FeedbackState = 'none' | 'correct' | 'incorrect' | 'exploding' | 'review'

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
    const offsets = shuffle([-1, 1, -2, 2, -3, 3, -10, 10])
    for (const off of offsets) {
        if (set.size >= 4) break
        const candidate = answer + off
        if (candidate >= 0 && candidate !== answer) set.add(candidate)
    }
    let extra = 1
    while (set.size < 4) {
        if (!set.has(answer + extra)) set.add(answer + extra)
        extra++
    }
    return shuffle([...set]).map(String)
}

export function createQuestion(difficulty: Difficulty): MathQuestion {
    // Tất cả các dạng bài đều có mặt ở mọi cấp độ
    const types = ['add', 'sub', 'mul', 'div', 'missing_add', 'missing_sub', 'missing_mul', 'compare', 'mixed3', 'mixed_mul']
    const type = pick(types)

    let prompt = ''
    let answerStr = ''
    let options: string[] = []
    let subSkill: SubSkillId = 'math.add'

    // Thiết lập giới hạn số liệu theo cấp độ
    let max = 20
    let mulMax = 5
    if (difficulty === 'medium') { max = 50; mulMax = 9 }
    else if (difficulty === 'hard') { max = 100; mulMax = 9 }
    else if (difficulty === 'expert') { max = 1000; mulMax = 12 }

    if (type === 'add') {
        const a = randInt(10, max), b = randInt(10, max)
        prompt = `${a} + ${b} = ?`
        answerStr = String(a + b)
        options = generateNumberOptions(a + b)
        subSkill = 'math.add'
    }
    else if (type === 'sub') {
        const a = randInt(max / 2, max), b = randInt(10, a - 5)
        prompt = `${a} − ${b} = ?`
        answerStr = String(a - b)
        options = generateNumberOptions(a - b)
        subSkill = 'math.sub'
    }
    else if (type === 'mul') {
        const a = randInt(2, mulMax), b = randInt(2, 9)
        prompt = `${a} × ${b} = ?`
        answerStr = String(a * b)
        options = generateNumberOptions(a * b)
        subSkill = 'math.mul'
    }
    else if (type === 'div') {
        const b = randInt(2, mulMax), ans = randInt(2, 9)
        const a = b * ans
        prompt = `${a} ÷ ${b} = ?`
        answerStr = String(ans)
        options = generateNumberOptions(ans)
        subSkill = 'math.mul'
    }
    else if (type === 'missing_add') {
        const a = randInt(5, max / 2), ans = randInt(10, max)
        prompt = `${a} + ? = ${ans}`
        answerStr = String(ans - a)
        options = generateNumberOptions(ans - a)
        subSkill = 'math.add'
    }
    else if (type === 'missing_sub') {
        const ans = randInt(5, max / 2), b = randInt(5, max / 2)
        prompt = `? − ${b} = ${ans}`
        answerStr = String(ans + b)
        options = generateNumberOptions(ans + b)
        subSkill = 'math.sub'
    }
    else if (type === 'missing_mul') {
        const a = randInt(2, mulMax), ans = randInt(2, 9) * a
        prompt = `${a} × ? = ${ans}`
        answerStr = String(ans / a)
        options = generateNumberOptions(ans / a)
        subSkill = 'math.mul'
    }
    else if (type === 'compare') {
        const a = randInt(10, max / 2), b = randInt(10, max / 2)
        const c = randInt(10, max / 2), d = randInt(10, max / 2)
        const left = a + b
        const right = c + d
        prompt = `${a} + ${b}  ?  ${c} + ${d}`
        answerStr = left > right ? '>' : left < right ? '<' : '='
        options = shuffle(['>', '<', '='])
        subSkill = 'math.add'
    }
    else if (type === 'mixed3') {
        // Biểu thức 3 số (cộng trừ)
        const a = randInt(10, max / 2), b = randInt(5, max / 2), c = randInt(2, max / 3)
        prompt = `${a} + ${b} − ${c} = ?`
        answerStr = String(a + b - c)
        options = generateNumberOptions(a + b - c)
        subSkill = 'math.add'
    }
    else if (type === 'mixed_mul') {
        // Biểu thức có nhân (nhân trước, cộng sau)
        const a = randInt(2, mulMax), b = randInt(2, 5), c = randInt(5, max / 2)
        prompt = `${a} × ${b} + ${c} = ?`
        answerStr = String(a * b + c)
        options = generateNumberOptions(a * b + c)
        subSkill = 'math.mul'
    }

    return { prompt, options, answer: answerStr, subSkill }
}

const correctSounds = [new Audio('/sounds/yes.mp3'), new Audio('/sounds/yes1.mp3')]
const wrongSounds = [new Audio('/sounds/no.mp3'), new Audio('/sounds/no1.mp3')]
const bombSounds = [new Audio('/sounds/bom.mp3')]
function playSound(type: 'correct' | 'incorrect' | 'bomb') {
    try {
        let sounds = correctSounds
        if (type === 'incorrect') sounds = wrongSounds
        if (type === 'bomb') sounds = bombSounds
        const audio = sounds[Math.floor(Math.random() * sounds.length)]
        audio.currentTime = 0
        audio.play().catch(() => { })
    } catch { /* ignore */ }
}
function getTimeForDifficulty(diff: Difficulty): number {
    switch (diff) {
        case 'easy': return 15
        case 'medium': return 20
        case 'hard': return 25
        case 'expert': return 30
        default: return 15
    }
}

export default function MathPractice({ onBack, onCorrect, onWrong, startDifficulty }: Props) {
    const [difficulty, setDifficulty] = useState<Difficulty>(startDifficulty ?? 'easy')
    const [question, setQuestion] = useState<MathQuestion>(() => createQuestion(startDifficulty ?? 'easy'))
    const [selected, setSelected] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [answered, setAnswered] = useState(0)

    const maxTime = getTimeForDifficulty(difficulty)
    const [timeLeft, setTimeLeft] = useState(maxTime)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [timedOut, setTimedOut] = useState(false)
    const [feedbackState, setFeedbackState] = useState<FeedbackState>('none')

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
        onWrong(difficulty, question.subSkill)
    }, [timedOut, feedbackState, difficulty, question.subSkill, onWrong])

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

    function nextQuestion() {
        setQuestion(createQuestion(difficulty))
        setSelected(null)
        setTimedOut(false)
        setFeedbackState('none')
        setTimeLeft(getTimeForDifficulty(difficulty))
    }

    function changeDifficulty(newDifficulty: Difficulty) {
        setDifficulty(newDifficulty)
        setQuestion(createQuestion(newDifficulty))
        setSelected(null)
        setTimedOut(false)
        setFeedbackState('none')
        setTimeLeft(getTimeForDifficulty(newDifficulty))
    }

    function chooseAnswer(value: string) {
        if (selected !== null || timedOut || feedbackState !== 'none') return
        setSelected(value)
        setAnswered(previous => previous + 1)

        const isCorrect = value === question.answer
        if (isCorrect) {
            setScore(previous => previous + 1)
            setFeedbackState('correct')
            playSound('correct')
            onCorrect(difficulty, question.subSkill)
        } else {
            setFeedbackState('incorrect')
            playSound('incorrect')
            onWrong(difficulty, question.subSkill)
        }
    }

    const showResult = feedbackState === 'review'
    const timerPercentage = (timeLeft / maxTime) * 100

    return (
        <main className= {`math-practice ${(feedbackState === 'incorrect' || feedbackState === 'exploding') ? 'shake-screen' : ''}`
}>
{ feedbackState === 'correct' && <div className="result-overlay" > <div className="firework-container" > <div className="firework-core" > </div></div > </div>}
{ feedbackState === 'incorrect' && <div className="result-overlay" > <div className="glass-shatter" > </div></div >}
{ feedbackState === 'exploding' && <div className="explosion-overlay" > <div className="explosion-flash" > </div><div className="explosion-shockwave"></div > </div> }

<div className="math-top-bar" >
    <button type="button" className = "math-back-button" onClick = { onBack } >← Quay về bản đồ </button>
        </div>

        < header className = "math-header" >
            <div className="math-pirate-icon" aria-hidden="true" >⚔️</div>
                < div className = "math-heading-text" >
                    <h2>CUỘC CHIẾN SỐ HỌC </h2>
                        < p > Đấu trí cùng Thuyền trưởng Bóng Đêm — câu { answered + 1 } </p>
                            </div>
                            < div className = "math-question-counter" >
                                <span>CÂU HỎI </span>
                                    < strong > { answered + 1}</strong>
                                        </div>
                                        </header>

                                        < div className = "math-practice-layout" >
                                            <div className="math-practice-main" >
                                                <div className="math-timer-panel" >
                                                    <div className="timer-left" >
                                                        <div className={ `bomb-container ${timeLeft <= 5 ? 'warning' : ''}` }>
                                                            <span className="bomb-icon" > { timeLeft > 0 ? '💣' : '💥'}</span>
{ timeLeft > 0 && <span className="bomb-fuse" >🔥</span> }
</div>
    < strong className = { timeLeft <= 5 ? 'timer-warning' : ''}> { timeLeft }s </strong>
        </div>
        < div className = "timer-bar-container" >
            <div className={ `timer-bar ${timeLeft <= 5 ? 'warning' : ''}` } style = {{ width: `${timerPercentage}%` }}> </div>
                </div>
                < span className = "total-time" >🏴‍☠️ Tổng: { elapsedSeconds } s </span>
                    </div>

                    < section className = "math-question" >
                        <div style={ { textAlign: 'center', marginBottom: '40px' } }>
                            <span style={ { fontSize: '64px', fontWeight: 900, fontFamily: "'Baloo 2', sans-serif", color: 'var(--mp-accent-blue)', textShadow: '0 4px 0 #D4C4A3' } }>
                            { question.prompt }
                                </span>
                                </div>

                                < p className = "math-instruction" > Chọn đáp án đúng bên dưới nhé! </p>
                                    < div className = "math-options" >
                                    {
                                        question.options.map((option) => {
                                            const isCorrect = option === question.answer
                                            const isSelected = option === selected
                                            let className = `math-option`
                                            if (showResult && isCorrect) className += ' correct'
                                            else if (showResult && isSelected && !isCorrect) className += ' incorrect'
                                            else if (showResult && !isCorrect) className += ' faded'
                                            return (
                                                <button key= { option } type = "button" className = { className } onClick = {() => chooseAnswer(option)
                                        } disabled = { selected !== null || timedOut || feedbackState !== 'none'} >
                                    { option }
                                        </button>
                                )
                            })}
</div>
{
    showResult && (
        <button type="button" className = "btn-next-question" onClick = { nextQuestion } >
            ĐÒN TIẾP THEO ➜
    </button>
                        )
}
</section>

    < footer className = "math-score" >
        <div className="math-score-item" >
            <span aria-hidden="true" >⭐</span>
                < div > <small>ĐIỂM SỐ </small><strong>{score}</strong > </div>
                    </div>
                    < div className = "math-score-divider" />
                        <div className="math-score-item" >
                            <span aria-hidden="true" >📝</span>
                                < div > <small>ĐÃ TRẢ LỜI </small><strong>{answered}</strong > </div>
                                    </div>
                                    </footer>
                                    </div>

                                    < aside className = "math-practice-sidebar" >
                                        <h3 className="sidebar-title" >⚙️ Cài đặt </h3>
                                            < section className = "math-settings" >
                                                <label className="math-setting" >
                                                    <span>🚩 Độ khó </span>
                                                        < select value = { difficulty } onChange = { e => changeDifficulty(e.target.value as Difficulty) } disabled = { feedbackState !== 'none' && feedbackState !== 'review'}>
                                                            <option value="easy" > Dễ(Cấp 1) </option>
                                                                < option value = "medium" > Trung bình(Cấp 2) </option>
                                                                    < option value = "hard" > Nâng cao(Cấp 3) </option>
                                                                        < option value = "expert" > Siêu khó(Cấp 4) </option>
                                                                            </select>
                                                                            </label>
                                                                            </section>
                                                                            </aside>
                                                                            </div>
                                                                            </main>
    )
}