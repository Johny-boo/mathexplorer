type Props = {
    leftWeight: number
    rightWeight: number
    itemEmoji: string
    itemWeight: number
    numLeft: number
    numRight: number
}

export default function BalanceScale({ leftWeight, rightWeight, itemEmoji, numLeft, numRight }: Props) {
    const leftBlocks = Array.from({ length: numLeft }, (_, i) => i)
    const rightBlocks = Array.from({ length: numRight }, (_, i) => i)

    return (
        <div className="balance-scale-wrapper">
            <div className="scale-status-badge">⚖️ Trạng thái: Cân thăng bằng (Hai đĩa có khối lượng bằng nhau)</div>

            <div className="scale-visual-stage">
                {/* SVG Cái cân kỹ thuật trực quan */}
                <svg viewBox="0 0 500 240" className="balance-svg" preserveAspectRatio="xMidYMid meet">
                    {/* Trụ đứng và đế cân */}
                    <polygon points="250,90 235,190 265,190" fill="#475569" stroke="#1e293b" strokeWidth="3" />
                    <rect x="200" y="190" width="100" height="20" rx="6" fill="#334155" stroke="#1e293b" strokeWidth="3" />

                    {/* Khớp xoay tâm */}
                    <circle cx="250" cy="90" r="10" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
                    <circle cx="250" cy="90" r="4" fill="#ffffff" />

                    {/* Cần cân ngang */}
                    <rect x="80" y="85" width="340" height="10" rx="4" fill="#64748b" stroke="#1e293b" strokeWidth="3" />

                    {/* Dây treo đĩa trái */}
                    <line x1="100" y1="95" x2="60" y2="160" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="100" y1="95" x2="140" y2="160" stroke="#94a3b8" strokeWidth="2.5" />
                    {/* Đĩa trái */}
                    <path d="M 50 160 Q 100 180 150 160 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="3" />

                    {/* Dây treo đĩa phải */}
                    <line x1="400" y1="95" x2="360" y2="160" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="400" y1="95" x2="440" y2="160" stroke="#94a3b8" strokeWidth="2.5" />
                    {/* Đĩa phải */}
                    <path d="M 350 160 Q 400 180 450 160 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="3" />
                </svg>

                {/* Vật phẩm trên đĩa trái */}
                <div className="pan-content-left">
                    <div className="pan-items-grid">
                        {leftBlocks.map((_, i) => (
                            <span key={`l-${i}`} className="scale-item-icon">
                                {itemEmoji || '📦'}
                            </span>
                        ))}
                    </div>
                    <div className="pan-weight-tag">{leftWeight} kg</div>
                </div>

                {/* Vật phẩm trên đĩa phải */}
                <div className="pan-content-right">
                    <div className="pan-items-grid">
                        {rightBlocks.map((_, i) => (
                            <span key={`r-${i}`} className="scale-item-icon">
                                {itemEmoji || '📦'}
                            </span>
                        ))}
                        <div className="mystery-weight-box">
                            <span className="mystery-box-q">?</span>
                        </div>
                    </div>
                    <div className="pan-weight-tag">{rightWeight} kg</div>
                </div>
            </div>
        </div>
    )
}