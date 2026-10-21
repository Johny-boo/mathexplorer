import { useState } from 'react'
import type { Difficulty, SubSkillId } from './core/types'

type Props = {
    onBack: () => void
    onCorrect: (difficulty: Difficulty, subSkill: SubSkillId) => void
    onWrong: (difficulty: Difficulty, subSkill: SubSkillId) => void
}

const LESSONS = [
    { id: 1, topic: 'Quy luật', title: 'Nhận diện quy luật', theory: 'Quy luật là sự lặp lại hoặc thay đổi theo một trật tự nhất định.', example: 'Ví dụ: 1, 2, 3, 4, ? (Số tiếp theo là 5)' },
    { id: 2, topic: 'Quy luật', title: 'Dãy số tăng/giảm', theory: 'Các số có thể tăng đều hoặc giảm đều.', example: 'Ví dụ: 2, 4, 6, 8, ? (Số tiếp theo là 10)' },
    { id: 3, topic: 'Quy luật', title: 'Dãy xen kẽ', theory: 'Có 2 quy luật đan xen nhau.', example: 'Ví dụ: 1, 10, 3, 10, 5, ? (Số tiếp theo là 10)' },
    { id: 4, topic: 'Logic', title: 'Suy luận loại trừ', theory: 'Loại bỏ những đáp án sai để tìm ra đáp án đúng.', example: 'Ví dụ: Hình nào khác biệt?' },
    { id: 5, topic: 'Logic', title: 'So sánh', theory: 'Sử dụng dấu >, <, = để so sánh.', example: 'Ví dụ: 5 + 3 ? 10 - 2' },
    { id: 6, topic: 'Logic', title: 'Suy luận chuỗi', theory: 'Tìm mối liên hệ giữa các sự vật.', example: 'A > B, B > C. Vậy A > C.' },
    { id: 7, topic: 'Không gian', title: 'Nhận diện khối', theory: 'Nhận biết các khối 3D cơ bản.', example: 'Khối lập phương có 6 mặt.' },
    { id: 8, topic: 'Không gian', title: 'Xoay hình', theory: 'Tưởng tượng hình khi xoay.', example: 'Mũi tên chỉ lên, xoay 90 độ sang phải.' },
    { id: 9, topic: 'Không gian', title: 'Gấp giấy', theory: 'Tưởng tượng hình khi gấp giấy.', example: 'Gấp đôi hình vuông ta được hình chữ nhật.' },
    { id: 10, topic: 'Bài đố', title: 'Đố tuổi', theory: 'Tính toán dựa trên sự thay đổi tuổi tác.', example: 'Mẹ 30, con 5. Mấy năm nữa mẹ gấp 5 lần con?' },
    { id: 11, topic: 'Bài đố', title: 'Đố cân nặng', theory: 'Suy luận từ các hình ảnh cân.', example: '1 quả táo = 2 quả cam...' },
    { id: 12, topic: 'Bài đố', title: 'Đố logic mẹo', theory: 'Đọc kỹ đề bài để tránh bẫy.', example: 'Có 3 quả táo trên bàn, lấy đi 2 quả. Bạn còn mấy quả? (Còn 2 quả vì bạn đã lấy).' },
    { id: 13, topic: 'Tổng hợp', title: 'Mix Quy luật & Logic', theory: 'Kết hợp cả 2 kỹ năng.', example: 'Tìm quy luật và suy ra hình còn thiếu.' },
    { id: 14, topic: 'Tổng hợp', title: 'Mix Không gian & Đố', theory: 'Kết hợp tư duy không gian và tính toán.', example: 'Xếp hình lập phương cần bao nhiêu khối.' },
    { id: 15, topic: 'Tổng hợp', title: 'Đề tổng hợp', theory: 'Thử thách cuối cùng.', example: 'Hoàn thành 5 câu hỏi tổng hợp.' },
]

const PRACTICE_TOPICS = [
    { id: 'pattern', name: 'Quy luật & Dãy số', icon: '🔍' },
    { id: 'logic', name: 'Logic & Suy luận', icon: '🧠' },
    { id: 'space', name: 'Hình học không gian', icon: '🧊' },
    { id: 'riddle', name: 'Bài toán đố', icon: '🎩' },
    { id: 'mixed', name: 'Tổng hợp', icon: '🌟' },
]

export default function ThinkingMath({ onBack, onCorrect, onWrong }: Props) {
    const [mode, setMode] = useState<'menu' | 'learn' | 'practice'>('menu')
    const [currentLesson, setCurrentLesson] = useState(0)
    const [learnStep, setLearnStep] = useState<'theory' | 'quiz'>('theory')
    const [practiceTopic, setPracticeTopic] = useState<string | null>(null)

    if (mode === 'menu') {
        return (
            <main className= "thinking-practice" >
            <div className="math-top-bar" >
                <button className="math-back-button" onClick = { onBack } >← Quay về bản đồ </button>
                    </div>
                    < div className = "thinking-container" >
                        <header className="thinking-header" >
                            <h1>🧠 TOÁN TƯ DUY </h1>
                                < p > Rèn luyện trí thông minh và khả năng suy luận! </p>
                                    </header>

                                    < div className = "thinking-options" >
                                        <button className="thinking-card learn-card" onClick = {() => { setMode('learn'); setCurrentLesson(0); setLearnStep('theory'); }
    }>
        <span className="t-icon" >📚</span>
            < h2 > Học tập </h2>
                < p > 15 bài học từ cơ bản đến nâng cao </p>
                    < div className = "t-progress" > Đã học: 0 / 15 </div>
                        </button>

                        < button className = "thinking-card practice-card" onClick = {() => setMode('practice')
}>
    <span className="t-icon" >🎯</span>
        < h2 > Luyện tập </h2>
            < p > 5 chủ đề luyện tập tự do để cày Sao </p>
                < div className = "t-progress" > Tiến độ: 0 % </div>
                    </button>
                    </div>
                    </div>
                    </main>
        )
    }

if (mode === 'learn') {
    const lesson = LESSONS[currentLesson]
    return (
        <main className= "thinking-practice" >
        <div className="math-top-bar" >
            <button className="math-back-button" onClick = {() => setMode('menu')
}>← Menu Tư duy </button>
    </div>
    < div className = "thinking-container" >
        <header className="thinking-header" >
            <h1>📚 Bài { lesson.id }: { lesson.title } </h1>
                < p > Chủ đề: { lesson.topic } </p>
                    </header>

                    < div className = "thinking-lesson-card" >
                    { learnStep === 'theory' ? (
                        <>
                        <div className= "theory-box" >
                    <h3>📖 Lý thuyết </h3>
                        < p > { lesson.theory } </p>
                        <h3>💡 Ví dụ minh họa </h3>
                            < p > { lesson.example } </p>
                            </div>
                            < button className = "btn-next-question" onClick = {() => setLearnStep('quiz')}>
                                Luyện tập ngay ➜
</button>
    </>
                        ) : (
    <div className= "quiz-box" >
    <h3>🎯 Bài tập áp dụng </h3>
        < p style = {{ fontSize: '20px', margin: '20px 0' }}> Câu hỏi mẫu: Dựa vào lý thuyết, hãy chọn đáp án đúng! </p>
            < div style = {{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                <button className="pattern-option" style = {{ padding: '10px 20px', fontSize: '18px' }} onClick = {() => {
    onCorrect('easy', 'thinking.pattern')
    if (currentLesson < 14) { setCurrentLesson(c => c + 1); setLearnStep('theory'); }
    else { setMode('menu'); alert('Đã hoàn thành xuất sắc 15 bài học Tư duy!'); }
}}> Đáp án A(Đúng) </button>
    < button className = "pattern-option" style = {{ padding: '10px 20px', fontSize: '18px' }} onClick = {() => onWrong('easy', 'thinking.pattern')}> Đáp án B </button>
        </div>
        </div>
                        )}
</div>
    </div>
    </main>
        )
    }

if (mode === 'practice') {
    if (!practiceTopic) {
        return (
            <main className= "thinking-practice" >
            <div className="math-top-bar" >
                <button className="math-back-button" onClick = {() => setMode('menu')
    }>← Menu Tư duy </button>
        </div>
        < div className = "thinking-container" >
            <header className="thinking-header" >
                <h1>🎯 Chọn chủ đề luyện tập </h1>
                    </header>
                    < div className = "topic-grid" >
                    {
                        PRACTICE_TOPICS.map(t => (
                            <button key= { t.id } className = "topic-card" onClick = {() => setPracticeTopic(t.id)} >
                        <span className="t-icon" > { t.icon } </span>
                            < span > { t.name } </span>
                            </button>
                            ))
}
</div>
    </div>
    </main>
            )
        }

return (
    <main className= "thinking-practice" >
    <div className="math-top-bar" >
        <button className="math-back-button" onClick = {() => setPracticeTopic(null)}>← Chọn chủ đề khác </button>
            </div>
            < div className = "thinking-container" >
                <header className="thinking-header" >
                    <h1>Đang luyện tập: { PRACTICE_TOPICS.find(t => t.id === practiceTopic)?.name } </h1>
                        < p > Chọn đáp án đúng để nhận Đá quý! </p>
                            </header>

                            < div className = "thinking-lesson-card" style = {{ textAlign: 'center' }}>
                                <h2 style={ { fontSize: '32px', margin: '40px 0' } }> Tư duy Logic: 1 + 1 = 2. Vậy 2 + 2 = ?</h2>
                                    < div className = "pattern-options" style = {{ maxWidth: '600px', margin: '0 auto' }}>
                                    {
                                        ['3', '4', '5', '6'].map(opt => (
                                            <button key= { opt } className = "pattern-option" onClick = {() => {
                                                if(opt === '4') {
    onCorrect('medium', 'thinking.logic')
    alert('Chính xác!')
} else {
    onWrong('medium', 'thinking.logic')
    alert('Sai rồi!')
}
                                }}> { opt } </button>
                            ))}
</div>
    </div>
    </div>
    </main>
        )
    }

return null
}