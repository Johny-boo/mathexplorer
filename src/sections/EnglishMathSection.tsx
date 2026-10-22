import type { GlobalState, ModuleId, EnglishLevel } from '../core/types'
import { MODULE_INFO, SECTION_MODULES } from '../core/constants'
import { getModulePercent, MODULE_TO_ENG_LEVEL } from '../core/moduleProgress'
import { calculateEnglishStars } from '../core/starSystem'

type Props = {
    state: GlobalState
    onBack: () => void
    onSelectModule: (id: ModuleId) => void
}

export default function EnglishMathSection({ state, onBack, onSelectModule }: Props) {
    const modules = SECTION_MODULES.english

    return (
        <main className="section-page section-english">
            <header className="section-header">
                <button className="section-back-btn" onClick={onBack}>← Trang chủ</button>
                <div className="section-title-wrapper">
                    <span className="section-icon">🇬🇧</span>
                    <div>
                        <h1>Toán Tiếng Anh</h1>
                        <p>Luyện thi TIMO, CREST Olympiad</p>
                    </div>
                </div>
            </header>

            <section className="module-grid">
                {modules.map(moduleId => {
                    const info = MODULE_INFO[moduleId]
                    const percent = getModulePercent(moduleId, state)
                    const engLevel = MODULE_TO_ENG_LEVEL[moduleId]
                    const stars = engLevel
                        ? calculateEnglishStars(state.englishProgress.levels[engLevel])
                        : 0

                    return (
                        <button
                            key={moduleId}
                            className="module-card"
                            onClick={() => onSelectModule(moduleId)}
                        >
                            <div className="module-card-icon">{info.icon}</div>
                            <h3 className="module-card-title">{info.title}</h3>
                            <p className="module-card-desc">{info.description}</p>

                            {engLevel && (
                                <div className="module-card-stars">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className={i < stars ? 'star-filled' : 'star-empty'}>
                                            {i < stars ? '⭐' : '☆'}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="module-card-progress">
                                <div className="module-card-progress-bar">
                                    <div className="module-card-progress-fill" style={{ width: `${percent}%` }} />
                                </div>
                                <span className="module-card-percent">{percent}%</span>
                            </div>
                        </button>
                    )
                })}
            </section>
        </main>
    )
}