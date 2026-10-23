import type { GlobalState, ModuleId } from '../core/types'
import { MODULE_INFO, SECTION_MODULES } from '../core/constants'
import { getModulePercent, MODULE_TO_MISSION_ID } from '../core/moduleProgress'
import { calculateStars } from '../core/starSystem'

type Props = {
    state: GlobalState
    onBack: () => void
    onSelectModule: (id: ModuleId) => void
}

const MODULE_IMAGES: Record<string, string> = {
    viet_number: '/dao-so-hoc.png',
    viet_word: '/rung-phep-tinh.png',
    viet_pattern: '/hang-quy-luat.png',
    viet_geometry: '/nui-hinh-hoc.png',
    viet_arena: '/thuyen-hai-tac.png',
    viet_measure: '/dao-kho-bau.png',
}

export default function VietnameseMath({ state, onBack, onSelectModule }: Props) {
    const modules = SECTION_MODULES.vietnamese

    return (
        <main className="section-page section-vietnamese">
            <header className="section-header">
                <button className="section-back-btn" onClick={onBack}>← Trang chủ</button>
                <div className="section-title-wrapper">
                    <span className="section-icon">🧮</span>
                    <div>
                        <h1>Toán Tiếng Việt</h1>
                        <p>Bám sát chương trình Bộ Giáo dục & Luyện thi Violympic</p>
                    </div>
                </div>
            </header>

            <section className="module-grid">
                {modules.map(moduleId => {
                    const info = MODULE_INFO[moduleId]
                    const percent = getModulePercent(moduleId, state)
                    const missionId = MODULE_TO_MISSION_ID[moduleId]
                    const stars = missionId
                        ? calculateStars(state.missionProgress[missionId])
                        : (moduleId === 'viet_arena' ? Math.min(5, state.bossWins) : 0)
                    const isPlaceholder = info.placeholder
                    const cardImg = MODULE_IMAGES[moduleId]

                    return (
                        <button
                            key={moduleId}
                            className={`module-card ${isPlaceholder ? 'module-card-placeholder' : ''}`}
                            onClick={() => !isPlaceholder && onSelectModule(moduleId)}
                            disabled={isPlaceholder}
                        >
                            {cardImg && (
                                <div className="module-card-img-wrapper">
                                    <img src={cardImg} alt={info.title} className="module-card-img" />
                                </div>
                            )}
                            <h3 className="module-card-title">{info.title}</h3>
                            <p className="module-card-desc">{info.description}</p>

                            {isPlaceholder ? (
                                <div className="module-card-badge">🚧 Sắp ra mắt</div>
                            ) : (
                                <>
                                    <div className="module-card-stars">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className={i < stars ? 'star-filled' : 'star-empty'}>
                                                {i < stars ? '⭐' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="module-card-progress">
                                        <div className="module-card-progress-bar">
                                            <div className="module-card-progress-fill" style={{ width: `${percent}%` }} />
                                        </div>
                                        <span className="module-card-percent">{percent}%</span>
                                    </div>
                                </>
                            )}
                        </button>
                    )
                })}
            </section>
        </main>
    )
}