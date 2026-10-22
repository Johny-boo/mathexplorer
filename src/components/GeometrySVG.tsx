import type { QuestionVisual } from '../core/types'

export default function GeometrySVG({ visual }: { visual: QuestionVisual }) {
    // 1. Đường thẳng (Paper plane, Star)
    if (visual.type === 'lines') {
        if (visual.shape === 'paper_plane') {
            return (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', margin: '20px auto', display: 'block' }}>
                    <polygon points="10,50 90,10 50,90" fill="none" stroke="#334155" strokeWidth="3" />
                    <line x1="90" y1="10" x2="50" y2="50" stroke="#334155" strokeWidth="3" />
                    <line x1="10" y1="50" x2="50" y2="50" stroke="#334155" strokeWidth="3" />
                    <line x1="50" y1="50" x2="50" y2="90" stroke="#334155" strokeWidth="3" />
                </svg>
            )
        }
        if (visual.shape === 'star') {
            return (
                <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', margin: '20px auto', display: 'block' }}>
                    <polygon points="50,5 61,40 98,40 68,62 79,98 50,75 21,98 32,62 2,40 39,40" fill="none" stroke="#334155" strokeWidth="3" />
                </svg>
            )
        }
    }

    // 2. Đếm đoạn thẳng (Các điểm trên đường thẳng)
    if (visual.type === 'line_segments') {
        const dots = Array.from({ length: visual.dots }, (_, i) => i)
        const width = visual.dots * 40 + 20
        return (
            <svg viewBox={`0 0 ${width} 60`} style={{ width: '100%', maxWidth: '300px', height: 'auto', margin: '20px auto', display: 'block' }}>
                <line x1="20" y1="30" x2={width - 20} y2="30" stroke="#334155" strokeWidth="4" />
                {dots.map((_, i) => (
                    <circle key={i} cx={20 + i * 40} cy="30" r="6" fill="#ef4444" />
                ))}
            </svg>
        )
    }

    // 3. Đếm hình vuông (Lưới ô vuông)
    if (visual.type === 'count_squares') {
        const cellSize = 30
        const w = visual.cols * cellSize
        const h = visual.rows * cellSize
        return (
            <svg viewBox={`-10 -10 ${w + 20} ${h + 20}`} style={{ width: '100%', maxWidth: '300px', height: 'auto', margin: '20px auto', display: 'block' }}>
                <rect x="0" y="0" width={w} height={h} fill="#eff6ff" stroke="#1e3a8a" strokeWidth="3" />
                {Array.from({ length: visual.cols - 1 }).map((_, i) => (
                    <line key={`v${i}`} x1={(i + 1) * cellSize} y1="0" x2={(i + 1) * cellSize} y2={h} stroke="#1e3a8a" strokeWidth="2" />
                ))}
                {Array.from({ length: visual.rows - 1 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={(i + 1) * cellSize} x2={w} y2={(i + 1) * cellSize} stroke="#1e3a8a" strokeWidth="2" />
                ))}
            </svg>
        )
    }

    // 4. Đếm hình tròn (Lồng nhau)
    if (visual.type === 'count_circles') {
        return (
            <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', margin: '20px auto', display: 'block' }}>
                <circle cx="50" cy="50" r="45" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
                {visual.count >= 2 && <circle cx="50" cy="50" r="30" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />}
                {visual.count >= 3 && <circle cx="50" cy="50" r="15" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />}
            </svg>
        )
    }

    // 5. Đếm tam giác (Hình lớn chia 4 hình nhỏ)
    if (visual.type === 'composite_triangles') {
        return (
            <svg viewBox="0 0 100 100" style={{ width: '150px', height: '150px', margin: '20px auto', display: 'block' }}>
                <polygon points="50,5 95,95 5,95" fill="#fffbeb" stroke="#b45309" strokeWidth="3" />
                <line x1="27.5" y1="50" x2="72.5" y2="50" stroke="#b45309" strokeWidth="3" />
                <line x1="27.5" y1="50" x2="50" y2="95" stroke="#b45309" strokeWidth="3" />
                <line x1="72.5" y1="50" x2="50" y2="95" stroke="#b45309" strokeWidth="3" />
            </svg>
        )
    }

    // 6. Trục đối xứng
    if (visual.type === 'symmetry') {
        return (
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '20px auto' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    <rect x="10" y="20" width="80" height="60" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="3" />
                    <line x1="50" y1="5" x2="50" y2="95" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
            </div>
        )
    }

    // 7. Khối 3D Isometric (Đếm khối / Nhìn từ trên)
    if (visual.type === 'iso_blocks') {
        const cellW = 40
        const cellH = 23 // ~40 * sin(30) / cos(30)...
        const width = visual.layout[0].length * cellW + 40
        const height = visual.layout.length * cellH + 40

        return (
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxWidth: '250px', height: 'auto', margin: '20px auto', display: 'block' }}>
                {visual.layout.map((row, r) =>
                    row.map((val, c) => {
                        if (val === 0) return null
                        // Tọa độ đỉnh trên cùng của khối
                        const cx = width / 2 + (c - r) * (cellW / 2)
                        const cy = 20 + (c + r) * (cellH / 2)

                        // Vẽ khối lập phương 3 mặt (Top, Left, Right)
                        return (
                            <g key={`${r}-${c}`}>
                                {/* Mặt trên */}
                                <polygon points={`${cx},${cy} ${cx + cellW / 2},${cy + cellH / 2} ${cx},${cy + cellH} ${cx - cellW / 2},${cy + cellH / 2}`} fill="#93c5fd" stroke="#1e3a8a" strokeWidth="2" />
                                {/* Mặt trái */}
                                <polygon points={`${cx - cellW / 2},${cy + cellH / 2} ${cx},${cy + cellH} ${cx},${cy + cellH * 2} ${cx - cellW / 2},${cy + cellH * 1.5}`} fill="#60a5fa" stroke="#1e3a8a" strokeWidth="2" />
                                {/* Mặt phải */}
                                <polygon points={`${cx + cellW / 2},${cy + cellH / 2} ${cx},${cy + cellH} ${cx},${cy + cellH * 2} ${cx + cellW / 2},${cy + cellH * 1.5}`} fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" />
                            </g>
                        )
                    })
                )}
            </svg>
        )
    }

    // 8. Đường đi trên lưới
    if (visual.type === 'route_path') {
        const cellSize = 40
        const w = visual.cols * cellSize
        const h = visual.rows * cellSize
        return (
            <svg viewBox={`-10 -10 ${w + 20} ${h + 20}`} style={{ width: '100%', maxWidth: '200px', height: 'auto', margin: '20px auto', display: 'block' }}>
                <rect x="0" y="0" width={w} height={h} fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                {Array.from({ length: visual.cols - 1 }).map((_, i) => (
                    <line key={`v${i}`} x1={(i + 1) * cellSize} y1="0" x2={(i + 1) * cellSize} y2={h} stroke="#cbd5e1" strokeWidth="2" />
                ))}
                {Array.from({ length: visual.rows - 1 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={(i + 1) * cellSize} x2={w} y2={(i + 1) * cellSize} stroke="#cbd5e1" strokeWidth="2" />
                ))}
                <circle cx="0" cy={h} r="8" fill="#ef4444" /> {/* Start: Bottom-Left */}
                <circle cx={w} cy="0" r="8" fill="#22c55e" /> {/* End: Top-Right */}
            </svg>
        )
    }

    return null
}