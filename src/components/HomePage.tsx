import type { GlobalState, SectionType } from '../core/types'
import { SECTION_INFO } from '../core/constants'
import { getSectionPercent } from '../core/moduleProgress'

type Props = {
    state: GlobalState
    onSelectSection: (section: SectionType) => void
    onOpenProfile: () => void
}

const SECTION_IMAGES: Record<SectionType, string> = {
    vietnamese: '/dao-so-hoc.png',
    english: '/dao-kho-bau.png',
    thinking: '/hang-quy-luat.png',
}

const SECTIONS: SectionType[] = ['vietnamese', 'english', 'thinking']

export default function HomePage({ state, onSelectSection, onOpenProfile }: Props) {
    const level = Math.floor(state.xp / 100) + 1

    return (
        <main className="home-page">
            <header className="home-header">
                <div className="home-brand">
                    <span className="home-brand-icon">🧭</span>
                    <div>
                        <strong>Math Explorer</strong>
                        <small>Hành trình khám phá toán học</small>
                    </div>
                </div>
                <button className="home-profile-btn" onClick={onOpenProfile}>
                    <span className="home-profile-level">Cấp {level}</span>
                    <span className="home-profile-xp">⭐ {state.xp} XP</span>
                    <span className="home-profile-gems">💎 {state.gems}</span>
                </button>
            </header>

            <section className="home-hero">
                <h1>Khám Phá Thế Giới Toán Học</h1>
                <p>Mỗi bài toán là một câu chuyện bằng hình ảnh — quan sát, suy luận và chinh phục đỉnh cao!</p>
            </section>

            <section className="home-cards">
                {SECTIONS.map(section => {
                    const info = SECTION_INFO[section]
                    const percent = getSectionPercent(section, state)
                    const bannerImg = SECTION_IMAGES[section]

                    return (
                        <button
                            key={section}
                            className={`home-section-card home-section-${section}`}
                            onClick={() => onSelectSection(section)}
                        >
                            {bannerImg && (
                                <div className="home-card-banner">
                                    <img src={bannerImg} alt={info.title} className="home-banner-img" />
                                </div>
                            )}
                            <div className="home-card-content">
                                <h2 className="home-section-title">{info.title}</h2>
                                <p className="home-section-desc">{info.description}</p>
                                <div className="home-section-progress">
                                    <div className="home-section-progress-bar">
                                        <div
                                            className="home-section-progress-fill"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <span className="home-section-percent">{percent}%</span>
                                </div>
                                <div className="home-section-cta">Khám phá ngay ➔</div>
                            </div>
                        </button>
                    )
                })}
            </section>

            <footer className="home-footer">
                <span>Học vui · Nghĩ giỏi · Khám phá mỗi ngày</span>
            </footer>
        </main>
    )
}