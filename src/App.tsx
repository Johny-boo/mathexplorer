import { useState, useEffect, useRef } from 'react'
import './App.css'
import MathPractice from './MathPractice'
import WordProblem from './WordProblem'
import PatternCave from './PatternCave'
import GeometryMountain from './GeometryMountain'
import BossBattle from './BossBattle'
import Profile from './Profile'
import ThinkingMath from './ThinkingMath'
import EnglishMath from './EnglishMath'
import { useGameState } from './core/useGameState'
import { calculateStars, isBossUnlocked, getTotalNonBossStars, getCompletedCount } from './core/starSystem'
import { RANK_LABELS, ENGLISH_LEVEL_TO_DIFFICULTY, englishSubSkill } from './core/constants'
import type { Difficulty, ActivityType, EnglishLevel, EnglishTopic, SubSkillId } from './core/types'

function useInView(options = { threshold: 0.1 }) {
    const ref = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsInView(true) }, options)
        const currentRef = ref.current
        if (currentRef) observer.observe(currentRef)
        return () => { if (currentRef) observer.unobserve(currentRef) }
    }, [options])
    return { ref, isInView }
}

const missions = [
    { number: 1, title: 'Đảo Số Học', image: '/dao-so-hoc.png', isBoss: false },
    { number: 2, title: 'Rừng Phép Tính', image: '/rung-phep-tinh.png', isBoss: false },
    { number: 3, title: 'Hang Quy Luật', image: '/hang-quy-luat.png', isBoss: false },
    { number: 4, title: 'Núi Hình Học', image: '/nui-hinh-hoc.png', isBoss: false },
    { number: 5, title: 'Đảo Kho Báu', image: '/dao-kho-bau.png', isBoss: true },
]

const shipPositions = [
    { top: '16%', left: '8%' },
    { top: '30%', left: '62%' },
    { top: '48%', left: '22%' },
    { top: '73%', left: '63%' },
    { top: '82%', left: '32%' },
]

const ISLAND_ACTIVITIES: Record<number, { type: ActivityType, icon: string, title: string, subtitle: string, tileClass: string }[]> = {
    1: [{ type: 'mathPractice', icon: '⚔️', title: 'Cuộc chiến số học', subtitle: 'Cộng, trừ, nhân và tăng tốc', tileClass: 'tile-practice' }],
    2: [{ type: 'wordProblem', icon: '🌲', title: 'Khám phá rừng', subtitle: 'Hành trình của Sóc Nhỏ', tileClass: 'tile-forest' }],
    3: [{ type: 'patternCave', icon: '🔍', title: 'Hang Quy Luật', subtitle: 'Tìm quy luật ẩn giấu', tileClass: 'tile-pattern' }],
    4: [{ type: 'geometryMountain', icon: '📐', title: 'Núi Hình Học', subtitle: 'Tư duy không gian', tileClass: 'tile-geometry' }],
    5: [], // Boss
}

export default function App() {
    const { state, handleCorrectAnswer, handleWrongAnswer, resetGame, handleBossWin, handleEnglishAnswer } = useGameState()

    const [selectedMission, setSelectedMission] = useState(1)
    const [showProfile, setShowProfile] = useState(false)
    const [activeActivity, setActiveActivity] = useState<ActivityType | null>(null)
    const [startDifficulty, setStartDifficulty] = useState<Difficulty | undefined>()
    const [showBoss, setShowBoss] = useState(false)
    const [showThinking, setShowThinking] = useState(false)
    const [showEnglish, setShowEnglish] = useState(false)

    const mapSection = useInView()
    const actionSection = useInView()

    const level = Math.floor(state.xp / 100) + 1
    const xpInLevel = state.xp % 100
    const currentMission = missions[selectedMission - 1]
    const currentShipPos = shipPositions[selectedMission - 1]

    const bossUnlocked = isBossUnlocked(state.missionProgress)
    const totalNonBossStars = getTotalNonBossStars(state.missionProgress)
    const completedCount = getCompletedCount(state.missionProgress)
    const bossStars = Math.min(5, state.bossWins)

    const activities = ISLAND_ACTIVITIES[selectedMission] || []
    const hasActivities = activities.length > 0

    function handleActivityClick(type: ActivityType, forceDiff?: Difficulty) {
        setStartDifficulty(forceDiff)
        setActiveActivity(type)
    }

    function resetActivityState() {
        setActiveActivity(null)
        setStartDifficulty(undefined)
    }

    if (activeActivity === 'mathPractice') {
        return (
            <MathPractice 
                onBack= { resetActivityState }
        onCorrect = {(d, s) => handleCorrectAnswer(1, d, s)
    }
    onWrong = { handleWrongAnswer }
    startDifficulty = { startDifficulty }
        />
        )
}
if (activeActivity === 'wordProblem') {
    return (
        <WordProblem 
                onBack= { resetActivityState }
    onCorrect = {(d, s) => handleCorrectAnswer(2, d, s)
}
onWrong = { handleWrongAnswer }
startDifficulty = { startDifficulty }
    />
        )
    }
if (activeActivity === 'patternCave') {
    return (
        <PatternCave 
                onBack= { resetActivityState }
    onCorrect = {(d, s) => handleCorrectAnswer(3, d, s)
}
onWrong = { handleWrongAnswer }
startDifficulty = { startDifficulty }
    />
        )
    }
if (activeActivity === 'geometryMountain') {
    return (
        <GeometryMountain 
                onBack= { resetActivityState }
    onCorrect = {(d, s) => handleCorrectAnswer(4, d, s)
}
onWrong = { handleWrongAnswer }
startDifficulty = { startDifficulty }
    />
        )
    }
if (showBoss) {
    return (
        <BossBattle 
                onBack= {() => setShowBoss(false)
}
onWin = { handleBossWin }
onLose = {() => { }}
onCorrect = {(d, s) => handleCorrectAnswer(null, d, s)}
onWrong = { handleWrongAnswer }
    />
        )
    }
if (showThinking) {
    return (
        <ThinkingMath 
                onBack= {() => setShowThinking(false)
}
onCorrect = {(d, s) => handleCorrectAnswer(null, d, s)}
onWrong = { handleWrongAnswer }
    />
        )
    }
if (showEnglish) {
    return (
        <EnglishMath 
                onBack= {() => setShowEnglish(false)
}
progress = { state.englishProgress }
onAnswer = {(r) => {
    const diff = ENGLISH_LEVEL_TO_DIFFICULTY[r.level]
    if (r.correct) {
        handleEnglishAnswer(r.level, diff, r.topic, true, {
            usedAudio: r.usedAudio,
            usedTranslate: r.usedTranslate,
            wordsTapped: [], // Có thể lấy từ state nếu cần
            timeSpent: r.timeSpent
        }, r.vocabIds) // Truyền vocabIds
    } else {
        handleWrongAnswer(diff, englishSubSkill(r.topic))
    }
}}
onVocabTap = {(id) => handleVocabTap(id)} // Truyền hàm tra từ
            />
        )
    }

return (
    <main className= "game ocean-game" >
    <header className="topbar" >
        <a className="brand" href = "#home" >
            <span className="brand-icon" >🧭</span>
                < span >
                <strong>Math Explorer </strong>
                    < small > THÁM HIỂM KHO BÁU TOÁN HỌC </small>
                        </span>
                        </a>
                        < button type = "button" className = "player captain-trigger" onClick = {() => setShowProfile(true)}>
                            <span className="avatar" >🏴‍☠️</span>
                                < span className = "player-name" > Thuyền trưởng </span>
                                    < span className = "star-count" >💎 { state.gems } </span>
                                        </button>
                                        </header>

                                        < section className = "hero-new" id = "home" >
                                            <div className="hero-new-content" >
                                                <div className="hero-badges" >
                                                    <span className="badge-top" >🧭 TOÁN LỚP 2 </span>
                                                        < span className = "badge-sub" >⚓ TIẾNG GỌI ĐẠI DƯƠNG </span>
                                                            </div>
                                                            < h1 className = "hero-title" >
                                                                <span className="text-blue" > Thuyền trưởng < /span><br / >
                                                                    <span className="text-blue" > nhí, </span>
                                                                        < span className = "text-orange" > ra khơi săn < /span><br / >
                                                                            <span className="text-orange" > kho báu! </span>
                                                                                </h1>
                                                                                < p className = "hero-desc" >
                                                                                    Năm hòn đảo bí ẩn đang chờ được khám phá.Hãy giải những câu đố toán học, thu thập huy hiệu và trở thành thuyền trưởng tài ba!
                                                                                        </p>
                                                                                        < button type = "button" className = "btn-start-adventure" onClick = {() => document.getElementById('treasure-map')?.scrollIntoView({ behavior: 'smooth' })}>
                        ⚓ Bắt đầu ra khơi! < span className = "arrow" >➜</span>
    </button>
    </div>
    < div className = "hero-new-image" > <img src="/main-background.png" alt = "Thuyền trưởng nhí" /> </div>
        </section>

        < section className = {`journey ocean-journey reveal ${mapSection.isInView ? 'in-view' : ''}`} id = "treasure-map" ref = { mapSection.ref } >
            <div className="section-heading" >
                <div>
                <span className="eyebrow" >🗺️ HÀNH TRÌNH CỦA BẠN </span>
                    < h2 > Bản đồ kho báu </h2>
                        < p > Chọn một hòn đảo để khám phá! </p>
                            </div>
                            < span className = "progress-pill" >⭐ { totalNonBossStars } /20 · 👑 {bossStars}/5 </span>
                                </div>

                                < div className = "ocean-map" >
                                    <div className="map-deco cloud-1" >☁️</div><div className="map-deco cloud-2">☁️</div > <div className="map-deco sun" >☀️</div>
                                        < div className = "map-deco fish-1" >🐠</div><div className="map-deco fish-2">🐟</div > <div className="map-deco coral-1" >🪸</div><div className="map-deco octopus">🐙</div >

                                            <svg className="voyage-route" viewBox = "0 0 1000 600" preserveAspectRatio = "none" aria-hidden="true" >
                                                <path d="M 200 150 C 400 100, 650 100, 750 150 C 850 200, 500 300, 350 300 C 200 300, 350 450, 750 450 C 850 450, 400 550, 200 500" fill = "none" stroke = "#fcd34d" strokeWidth = "6" strokeDasharray = "12 16" strokeLinecap = "round" strokeLinejoin = "round" />
                                                    </svg>

                                                    < div
className = "captain-ship"
style = {{ top: currentShipPos.top, left: currentShipPos.left, cursor: 'pointer' }}
onClick = {() => setShowProfile(true)}
                    >
    <img src="/thuyen-hai-tac.png" alt = "Thuyền của bạn" />
        <strong>Thuyền của bạn </strong>
            </div>

{
    missions.map(mission => {
        const isBoss = mission.isBoss
        const isComingSoon = (ISLAND_ACTIVITIES[mission.number] || []).length === 0 && !isBoss
        const isBossLocked = isBoss && !bossUnlocked
        const stars = isBoss ? bossStars : calculateStars(state.missionProgress[mission.number as 1 | 2 | 3 | 4])

        return (
            <button 
                                key= { mission.number }
        type = "button"
        className = {`map-island island-${mission.number} ${selectedMission === mission.number ? 'selected' : ''} ${isComingSoon || isBossLocked ? 'locked' : ''}`
    }
                                onClick = {() => setSelectedMission(mission.number)}
                            >
    <img src={ mission.image } alt = { mission.title } />
    { isBoss && <div className="island-boss-crown" >👑</div>}
{ (isComingSoon || isBossLocked) && <div className="island-lock" >🔒</div> }
<div className="island-stars" >
{
    [...Array(5)].map((_, i) => (
        <span key= { i } className = {`star-icon ${i < stars ? 'filled' : 'empty'}`} > { i<stars ? '⭐': '☆' } </span>
                                    ))}
</div>
    </button>
                        )
                    })}
<span className="map-caption" >🌊 Đại dương Tri Thức 🌊</span>
    </div>
    </section>

    < section className = {`action-section reveal ${actionSection.isInView ? 'in-view' : ''}`} ref = { actionSection.ref } >
        <div className="daily-challenge" >
            <span className="challenge-icon" > { selectedMission === 5 ? '👑' : '🧭'}</span>
                < div >
                <strong>Điểm đến: { currentMission.title } </strong>
                    <p>
{
    selectedMission === 5
    ? (bossUnlocked ? 'Boss đã xuất hiện! Hãy đánh bại hắn.' : `Cần 4 đảo đạt ≥3⭐ để mở Boss (${completedCount}/4)`)
    : 'Hãy chọn một chế độ để nhận thêm sao và XP nhé!'
}
</p>
    </div>
    </div>

{
    selectedMission === 5 ? (
        bossUnlocked ? (
            <div className= "boss-unlocked-banner" >
            <span className= "boss-crown" >👑</span>
                < strong > Trận chiến cuối cùng! </strong>
                    < p > Đánh bại Thuyền trưởng Bóng Đêm — chơi Siêu khó và thắng ≥8 / 10 câu! </p>
                        < div className = "boss-actions" >
                            <button className="adventure-tile tile-boss" onClick = {() => setShowBoss(true)
}>
    <span className="adventure-icon" >⚔️</span><strong>Đánh Boss</strong > <span>Siêu khó </span>
        </button>
        </div>
        </div>
                    ) : (
    <div className= "boss-locked-banner" >
    <span className="boss-crown" >👑</span>
        < strong > Trận chiến với Bóng Đêm </strong>
            < p > Chinh phục cả 4 hòn đảo(mỗi đảo ≥ 3 sao) để mở khóa! </p>
                </div>
                    )
                ) : hasActivities ? (
    <div className= "adventure-options" >
    {
        activities.map(act => (
            <button key= { act.type } type = "button" className = {`adventure-tile ${act.tileClass}`} onClick = {() => handleActivityClick(act.type)}>
                <span className="adventure-icon" > { act.icon } </span>
                    < strong > { act.title } </strong>
                    < span > { act.subtitle } </span>
                    </button>
                        ))}
</div>
                ) : (
    <div className= "coming-soon-banner" >
    <span className="coming-soon-icon" >🚧</span>
        < strong > Hòn đảo này đang được xây dựng! </strong>
            </div>
                )}

{/* 2 KHU VỰC NÂNG CAO */ }
<div className="advanced-sections" style = {{ marginTop: '32px' }}>
    <h3 style={ { textAlign: 'center', color: '#64748b', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' } }> Khu vực Nâng cao </h3>

        < div
className = "daily-challenge"
style = {{ cursor: 'pointer', background: '#fefce8', borderColor: '#fcd34d', marginBottom: '16px' }}
onClick = {() => setShowThinking(true)}
                    >
    <span className="challenge-icon" >🧠</span>
        < div >
        <strong style={ { color: '#b45309' } }> Toán Tư Duy </strong>
            < p style = {{ color: '#92400e' }}> Rèn luyện trí thông minh, logic và tư duy không gian! </p>
                </div>
                </div>

                < div
className = "daily-challenge"
style = {{ cursor: 'pointer', background: '#f0fdf4', borderColor: '#86efac' }}
onClick = {() => setShowEnglish(true)}
                    >
    <span className="challenge-icon" >🇬🇧</span>
        < div >
        <strong style={ { color: '#15803d' } }> Toán Tiếng Anh </strong>
            < p style = {{ color: '#166534' }}> Học từ vựng và luyện đề thi Toán quốc tế từ dễ đến khó! </p>
                </div>
                </div>
                </div>

                < div className = "new-xp-panel" style = {{ marginTop: '32px' }}>
                    <div className="xp-header" >
                        <span className="xp-rank" >🏅 { RANK_LABELS[state.currentRank] } · Cấp { level } </span>
                            < span className = "xp-total" > { state.xp } XP </span>
                                </div>
                                < div className = "xp-bar" > <div className="xp-bar-fill" style = {{ width: `${xpInLevel}%` }} /></div >
                                    <p className="xp-footer" > { xpInLevel } / 100 XP để thăng cấp </p>
                                        </div>
                                        </section>

                                        < footer className = "footer" >
                                            <span>🏴‍☠️ Math Explorer </span>
                                                < span > Học vui • Nghĩ giỏi • Khám phá mỗi ngày </span>
                                                    </footer>

{
    showProfile && (
        <Profile state={ state } onClose = {() => setShowProfile(false)
} onReset = { resetGame } />
            )}
</main>
    )
}