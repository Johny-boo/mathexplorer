type Props = { temp: number }

export default function Thermometer({ temp }: Props) {
    const maxTemp = 50
    const svgHeight = 300
    const paddingTop = 40
    const paddingBottom = 40
    const trackHeight = svgHeight - paddingTop - paddingBottom

    // Tính toán vị trí mực nước đỏ dựa trên nhiệt độ
    const fillHeight = (temp / maxTemp) * trackHeight
    const fillY = svgHeight - paddingBottom - fillHeight

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <svg viewBox={`0 0 120 ${svgHeight}`} style={{ width: '120px', height: '300px' }}>
                {/* Ống thủy tinh */}
                <rect x="40" y={paddingTop} width="20" height={trackHeight} rx="10" fill="#f8fafc" stroke="#334155" strokeWidth="3" />

                {/* Bầu chứa đáy */}
                <circle cx="50" cy={svgHeight - paddingBottom} r="24" fill="#f8fafc" stroke="#334155" strokeWidth="3" />

                {/* Cột mực đỏ */}
                <rect x="43" y={fillY} width="14" height={fillHeight} rx="7" fill="#ef4444" />
                <circle cx="50" cy={svgHeight - paddingBottom} r="21" fill="#ef4444" />

                {/* Các vạch chia độ */}
                {[0, 10, 20, 30, 40, 50].map(val => {
                    const y = svgHeight - paddingBottom - (val / maxTemp) * trackHeight
                    return (
                        <g key={val}>
                            <line x1="60" y1={y} x2="75" y2={y} stroke="#334155" strokeWidth="3" />
                            <text x="80" y={y + 5} fontSize="16" fontWeight="bold" fill="#334155">{val}</text>
                        </g>
                    )
                })}

                {/* Vạch chia nhỏ (mỗi 2 độ) */}
                {Array.from({ length: 24 }).map((_, i) => {
                    const val = (i + 1) * 2
                    const y = svgHeight - paddingBottom - (val / maxTemp) * trackHeight
                    return <line key={`small-${i}`} x1="60" y1={y} x2="68" y2={y} stroke="#94a3b8" strokeWidth="1.5" />
                })}
            </svg>
        </div>
    )
}