import type { ModuleId } from '../core/types'
import { MODULE_INFO, SECTION_MODULES } from '../core/constants'

type Props = {
    onBack: () => void
    onSelectModule?: (id: ModuleId) => void
}

export default function ThinkingMathSection({ onBack }: Props) {
    const modules = SECTION_MODULES.thinking

    return (
        <main className="section-page section-thinking">
            <header className="section-header">
                <button className="section-back-btn" onClick={onBack}>← Trang chủ</button>
                <div className="section-title-wrapper">
                    <span className="section-icon">🧠</span>
                    <div>
                        <h1>Toán Tư Duy</h1>
                        <p>Algorithmic · Computational · Automation · Logical · Spatial · Pattern</p>
                    </div>
                </div>
            </header>

            <section className="module-grid">
                {modules.map(moduleId => {
                    const info = MODULE_INFO[moduleId]
                    return (
                        <div key={moduleId} className="module-card module-card-placeholder">
                            <div className="module-card-icon">{info.icon}</div>
                            <h3 className="module-card-title">{info.title}</h3>
                            <p className="module-card-desc">{info.description}</p>
                            <div className="module-card-badge">🚧 Sắp ra mắt</div>
                        </div>
                    )
                })}
            </section>
        </main>
    )
}