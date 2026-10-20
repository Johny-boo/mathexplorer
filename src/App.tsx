import { useEffect, useState, useRef } from 'react'
import './App.css'
import MathPractice from './MathPractice'
import WordProblem from './WordProblem'

function useInView(options = { threshold: 0.1 }) {
    const ref = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsInView(true)
        }, options)
        const currentRef = ref.current
        if (currentRef) observer.observe(currentRef)
        return () => {
            if (currentRef) observer.unobserve(currentRef)
        }
    }, [options])
    return { ref, isInView }
}

const missions = [
    { number: 1, title: 'Đảo Kho Báu', image: '/dao-kho-bau.png' },
    { number: 2, title: 'Núi Hình Học', image: '/nui-hinh-hoc.png' },
    { number: 3, title: 'Hang Quy Luật', image: '/hang-quy-luat.png' },
    { number: 4, title: 'Rừng Phép Tính', image: '/rung-phep-tinh.png' },
    { number: 5, title: 'Đảo Số Học', image: '/dao-so-hoc.png' },
]

const shipPositions = [
    { top: '16%', left: '8%' },
    { top: '30%', left: '62%' },
    { top: '48%', left: '22%' },
    { top: '73%', left: '63%' },
    { top: '82%', left: '32%' },
]

type Rank = 'explorer' | 'intermediate' | 'master' | 'expert' | 'professor' | 'grandmaster'
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

const rankNames: Record<Rank, string> = {
    explorer: 'Nhà thám hiểm', intermediate: 'Hạng Trung', master: 'Cao thủ',
    expert: 'Chuyên gia', professor: 'Giáo sư', grandmaster: 'Bậc thầy',
}

type RankProgress = Record<Difficulty, number>

function checkPromotion(rank: Rank, progress: RankProgress): Rank | null {
    switch (rank) {
        case 'explorer': if (progress.easy >= 100 || progress.medium >= 75 || progress.hard >= 50) return 'intermediate'; break
        case 'intermediate': if (progress.medium >= 150 || progress.hard >= 100) return 'master'; break
        case 'master': if (progress.hard >= 150) return 'expert'; break
        case 'expert': if (progress.hard >= 250) return 'professor'; break
        case 'professor': if (progress.expert * 4 >= 400) return 'grandmaster'; break
    }
    return null
}

function calculateStars(score: number) {
    return score >= 10 ? Math.min(5, Math.floor(score / 10)) : 0
}

const DEFAULT_MISSION_SCORES: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

export default function App() {
    const [selectedMission, setSelectedMission] = useState(1)
    const [showCaptain, setShowCaptain] = useState(false)
    const [showPractice, setShowPractice] = useState(false)
    const [showWordProblem, setShowWordProblem] = useState(false)

    const mapSection = useInView()
    const actionSection = useInView()

    const [xp, setXp] = useState(() => Number(localStorage.getItem('mathExplorerXP')) || 0)
    const [mathScore, setMathScore] = useState(() => Number(localStorage.getItem('mathExplorerMathScore')) || 0)

    const [missionScores, setMissionScores] = useState<Record<number, number>>(() => {
        try {
            const saved = localStorage.getItem('mathExplorerMissionScores')
            if (saved) return { ...DEFAULT_MISSION_SCORES, ...JSON.parse(saved) }
        } catch {
            /* ignore corrupted storage */
        }
        return DEFAULT_MISSION_SCORES
    })

    const [rankProgress, setRankProgress] = useState<RankProgress>(() => {
        const saved = localStorage.getItem('mathExplorerRankProgress')
        return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0, expert: 0 }
    })
    const [currentRank, setCurrentRank] = useState<Rank>(() => {
        const saved = localStorage.getItem('mathExplorerRank')
        return (saved as Rank) || 'explorer'
    })

    const level = Math.floor(xp / 100) + 1
    const xpInLevel = xp % 100
    const currentMission = missions[selectedMission - 1]
    const currentShipPos = shipPositions[selectedMission - 1]

    useEffect(() => { localStorage.setItem('mathExplorerMathScore', String(mathScore)) }, [mathScore])
    useEffect(() => { localStorage.setItem('mathExplorerXP', String(xp)) }, [xp])
    useEffect(() => { localStorage.setItem('mathExplorerMissionScores', JSON.stringify(missionScores)) }, [missionScores])
    useEffect(() => { localStorage.setItem('mathExplorerRankProgress', JSON.stringify(rankProgress)) }, [rankProgress])
    useEffect(() => { localStorage.setItem('mathExplorerRank', currentRank) }, [currentRank])

    function handleCorrectAnswer(difficulty: Difficulty) {
        setRankProgress(previous => {
            const updated = { ...previous, [difficulty]: previous[difficulty] + 1 }
            const promoted = checkPromotion(currentRank, updated)
            if (promoted) {
                setCurrentRank(promoted)
                return { easy: 0, medium: 0, hard: 0, expert: 0 }
            }
            return updated
        })
    }

    function handleScoreChange(points: number) {
        setMathScore(previous => previous + points)
        setXp(previous => previous + points * 10)
        setMissionScores(previous => ({
            ...previous,
            [selectedMission]: (previous[selectedMission] ?? 0) + points,
        }))
    }

    if (showWordProblem) {
        return (
            <WordProblem
                onBack={() => setShowWordProblem(false)}
                onScoreChange={handleScoreChange}
                onCorrectAnswer={handleCorrectAnswer}
            />
        )
    }

    if (showPractice) {
        return (
            <MathPractice
                onScoreChange={handleScoreChange}
                onBack={() => setShowPractice(false)}
                onCorrectAnswer={handleCorrectAnswer}
            />
        )
    }

    return (
        <main className="game ocean-game">
            <header className="topbar">
                <a className="brand" href="#home">
                    <span className="brand-icon">🧭</span>
                    <span>
                        <strong>Math Explorer</strong>
                        <small>THÁM HIỂM KHO BÁU TOÁN HỌC</small>
                    </span>
                </a>
                <button type="button" className="player captain-trigger" onClick={() => setShowCaptain(true)}>
                    <span className="avatar">🏴‍☠️</span>
                    <span className="player-name">Thuyền trưởng</span>
                    <span className="star-count">⭐ {3 + mathScore}</span>
                </button>
            </header>

            <section className="hero-new" id="home">
                <div className="hero-new-content">
                    <div className="hero-badges">
                        <span className="badge-top">🧭 TOÁN LỚP 2</span>
                        <span className="badge-sub">⚓ TIẾNG GỌI ĐẠI DƯƠNG</span>
                    </div>

                    <h1 className="hero-title">
                        <span className="text-blue">Thuyền trưởng</span><br />
                        <span className="text-blue">nhí, </span>
                        <span className="text-orange">ra khơi săn</span><br />
                        <span className="text-orange">kho báu!</span>
                    </h1>

                    <p className="hero-desc">
                        Năm hòn đảo bí ẩn đang chờ được khám phá. Hãy giải những câu đố toán học, thu thập huy hiệu và trở thành thuyền trưởng tài ba!
                    </p>

                    <button
                        type="button"
                        className="btn-start-adventure"
                        onClick={() => document.getElementById('treasure-map')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        ⚓ Bắt đầu ra khơi! <span className="arrow">➜</span>
                    </button>

                    <div className="hero-features">
                        <span>🌴 5 hòn đảo</span>
                        <span>⭐ Săn huy hiệu</span>
                        <span>🗝️ Tìm kho báu</span>
                    </div>
                </div>

                <div className="hero-new-image">
                    <img src="/main-background.png" alt="Thuyền trưởng nhí" />
                </div>
            </section>

            <section
                className={`journey ocean-journey reveal ${mapSection.isInView ? 'in-view' : ''}`}
                id="treasure-map"
                ref={mapSection.ref}
            >
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">🗺️ HÀNH TRÌNH CỦA BẠN</span>
                        <h2>Bản đồ kho báu</h2>
                        <p>Chọn một hòn đảo để khám phá!</p>
                    </div>
                    <span className="progress-pill">⭐ {mathScore} Điểm</span>
                </div>

                <div className="ocean-map">
                    <div className="map-deco cloud-1">☁️</div>
                    <div className="map-deco cloud-2">☁️</div>
                    <div className="map-deco sun">☀️</div>
                    <div className="map-deco fish-1">🐠</div>
                    <div className="map-deco fish-2">🐟</div>
                    <div className="map-deco coral-1">🪸</div>
                    <div className="map-deco octopus">🐙</div>

                    <svg className="voyage-route" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
                        <path
                            d="M 200 150 C 400 100, 650 100, 750 150 C 850 200, 500 300, 350 300 C 200 300, 350 450, 750 450 C 850 450, 400 550, 200 500"
                            fill="none"
                            stroke="#fcd34d"
                            strokeWidth="6"
                            strokeDasharray="12 16"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <div className="captain-ship" style={{ top: currentShipPos.top, left: currentShipPos.left }}>
                        <img src="/thuyen-hai-tac.png" alt="Thuyền của bạn" />
                        <strong>Thuyền của bạn</strong>
                    </div>

                    {missions.map(mission => {
                        const islandStars = calculateStars(missionScores[mission.number] ?? 0)
                        return (
                            <button
                                key={mission.number}
                                type="button"
                                className={`map-island island-${mission.number} ${selectedMission === mission.number ? 'selected' : ''}`}
                                onClick={() => setSelectedMission(mission.number)}
                                aria-label={mission.title}
                            >
                                <img src={mission.image} alt={mission.title} />

                                {islandStars > 0 && (
                                    <div className="island-stars">
                                        {[...Array(islandStars)].map((_, i) => (
                                            <span key={i} className="star-icon">⭐</span>
                                        ))}
                                    </div>
                                )}
                            </button>
                        )
                    })}

                    <span className="map-caption">🌊 Đại dương Tri Thức 🌊</span>
                </div>
            </section>

            <section
                className={`action-section reveal ${actionSection.isInView ? 'in-view' : ''}`}
                ref={actionSection.ref}
            >
                <div className="daily-challenge">
                    <span className="challenge-icon">🧭</span>
                    <div>
                        <strong>Điểm đến: {currentMission.title}</strong>
                        <p>Hãy chọn một chế độ luyện tập để nhận thêm sao và XP nhé!</p>
                    </div>
                </div>

                <div className="adventure-options">
                    <button type="button" className="adventure-tile tile-practice" onClick={() => setShowPractice(true)}>
                        <span className="adventure-icon">🎯</span>
                        <strong>Bắt đầu luyện toán</strong>
                        <span>Luyện phép tính và tăng tốc</span>
                    </button>
                    <button type="button" className="adventure-tile tile-word" onClick={() => setShowWordProblem(true)}>
                        <span className="adventure-icon">🗺️</span>
                        <strong>Giải mã kho báu</strong>
                        <span>Giải toán có lời văn</span>
                    </button>
                </div>

                <div className="new-xp-panel">
                    <div className="xp-header">
                        <span className="xp-rank">🏅 {rankNames[currentRank]} · Cấp {level}</span>
                        <span className="xp-total">{xp} XP</span>
                    </div>
                    <div className="xp-bar">
                        <div className="xp-bar-fill" style={{ width: `${xpInLevel}%` }} />
                    </div>
                    <p className="xp-footer">{xpInLevel} / 100 XP để thăng cấp</p>
                </div>
            </section>

            <footer className="footer">
                <span>🏴‍☠️ Math Explorer</span>
                <span>Học vui • Nghĩ giỏi • Khám phá mỗi ngày</span>
            </footer>

            {showCaptain && (
                <div className="captain-overlay" onClick={() => setShowCaptain(false)}>
                    <section className="captain-modal" onClick={e => e.stopPropagation()}>
                        <button type="button" className="captain-close" onClick={() => setShowCaptain(false)}>✕</button>
                        <div className="captain-avatar">🏴‍☠️</div>
                        <h2>Thuyền trưởng nhí</h2>
                        <p className="captain-rank">⚓ {rankNames[currentRank]}</p>
                        <div className="captain-stats">
                            <div><strong>{3 + mathScore} ⭐</strong><span>Sao</span></div>
                            <div><strong>1 / 5</strong><span>Đảo</span></div>
                            <div><strong>{level}</strong><span>Cấp độ</span></div>
                        </div>
                        <p className="captain-note">Hãy hoàn thành nhiệm vụ để mở thêm đảo và nhận phần thưởng!</p>
                    </section>
                </div>
            )}
        </main>
    )
}