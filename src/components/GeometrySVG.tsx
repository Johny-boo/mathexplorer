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

    // 7. Khối 3D Isometric (Đếm khối / Nhìn từ trên / Hoàn thiện khối)
    if (visual.type === 'iso_blocks') {
        const cellW = 46
        const cellH = 24
        const cellL = 26

        // Thu thập toàn bộ khối 3D (x, y, z)
        type Block = { x: number; y: number; z: number }
        const blocks: Block[] = []

        if (visual.blocks && visual.blocks.length > 0) {
            blocks.push(...visual.blocks)
        } else if (visual.layout && visual.layout.length > 0) {
            visual.layout.forEach((row, r) => {
                row.forEach((val, c) => {
                    for (let z = 0; z < val; z++) {
                        blocks.push({ x: c, y: r, z })
                    }
                })
            })
        }

        // Kích thước lưới sàn
        const maxCols = visual.layout ? visual.layout[0].length : Math.max(...blocks.map(b => b.x), 2) + 1
        const maxRows = visual.layout ? visual.layout.length : Math.max(...blocks.map(b => b.y), 2) + 1

        // Sắp xếp theo thuật toán Painter (vẽ từ xa tới gần, từ dưới lên trên)
        const sortedBlocks = [...blocks].sort((a, b) => {
            if ((a.x + a.y) !== (b.x + b.y)) {
                return (a.x + a.y) - (b.x + b.y)
            }
            if (a.z !== b.z) {
                return a.z - b.z
            }
            return a.x - b.x
        })

        // Bảng màu cho từng tầng hoặc theme
        const theme = visual.colorTheme || 'multi'
        const getColors = (z: number) => {
            if (theme === 'multi') {
                if (z === 0) return { top: '#67e8f9', left: '#22d3ee', right: '#0891b2', stroke: '#155e75' }
                if (z === 1) return { top: '#fde047', left: '#fbbf24', right: '#d97706', stroke: '#78350f' }
                if (z === 2) return { top: '#fda4af', left: '#fb7185', right: '#e11d48', stroke: '#881337' }
                return { top: '#d8b4fe', left: '#c084fc', right: '#9333ea', stroke: '#4c1d95' }
            }
            if (theme === 'emerald') {
                return { top: '#86efac', left: '#34d399', right: '#059669', stroke: '#064e3b' }
            }
            if (theme === 'amber') {
                return { top: '#fde047', left: '#fbbf24', right: '#d97706', stroke: '#78350f' }
            }
            if (theme === 'purple') {
                return { top: '#d8b4fe', left: '#c084fc', right: '#9333ea', stroke: '#4c1d95' }
            }
            if (theme === 'rose') {
                return { top: '#fda4af', left: '#fb7185', right: '#e11d48', stroke: '#881337' }
            }
            // default blue
            return { top: '#93c5fd', left: '#60a5fa', right: '#2563eb', stroke: '#1e3a8a' }
        }

        // Tính toán bounding box chính xác để auto-center và không bao giờ bị cắt
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

        // Kiểm tra toạ độ đỉnh sàn
        for (let r = 0; r <= maxRows; r++) {
            for (let c = 0; c <= maxCols; c++) {
                const fx = (c - r) * (cellW / 2)
                const fy = (c + r) * (cellH / 2) + cellL
                if (fx < minX) minX = fx
                if (fx > maxX) maxX = fx
                if (fy < minY) minY = fy
                if (fy > maxY) maxY = fy
            }
        }

        // Kiểm tra toạ độ đỉnh các khối
        sortedBlocks.forEach(b => {
            const cx = (b.x - b.y) * (cellW / 2)
            const cy = (b.x + b.y) * (cellH / 2) - b.z * cellL
            const ptsX = [cx - cellW / 2, cx + cellW / 2]
            const ptsY = [cy, cy + cellH + cellL]
            ptsX.forEach(px => {
                if (px < minX) minX = px
                if (px > maxX) maxX = px
            })
            ptsY.forEach(py => {
                if (py < minY) minY = py
                if (py > maxY) maxY = py
            })
        })

        // Nếu có targetCuboid (khối lập phương mục tiêu)
        if (visual.targetCuboid) {
            const tx = visual.targetCuboid.x
            const ty = visual.targetCuboid.y
            const tz = visual.targetCuboid.z
            const topPeakY = (0 + 0) * (cellH / 2) - (tz - 1) * cellL
            if (topPeakY < minY) minY = topPeakY
            const cornerX1 = (tx - 0) * (cellW / 2)
            const cornerX2 = (0 - ty) * (cellW / 2)
            if (cornerX1 > maxX) maxX = cornerX1
            if (cornerX2 < minX) minX = cornerX2
        }

        const pad = 18
        const viewW = Math.max(160, Math.ceil(maxX - minX + pad * 2))
        const viewH = Math.max(140, Math.ceil(maxY - minY + pad * 2))
        const viewX = Math.floor(minX - pad)
        const viewY = Math.floor(minY - pad)

        return (
            <div style={{ margin: '16px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {visual.subtitle && (
                    <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                        <span style={{
                            display: 'inline-block',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            fontSize: '13px',
                            fontWeight: 600,
                            padding: '4px 14px',
                            borderRadius: '999px',
                            border: '1px solid #bfdbfe'
                        }}>
                            🧊 {visual.subtitle}
                        </span>
                    </div>
                )}
                <svg
                    viewBox={`${viewX} ${viewY} ${viewW} ${viewH}`}
                    style={{
                        width: '100%',
                        maxWidth: '280px',
                        maxHeight: '240px',
                        height: 'auto',
                        display: 'block'
                    }}
                >
                    {/* 1. Lưới mặt sàn đáy (Ground plate) */}
                    {visual.showGridFloor !== false && (
                        <g opacity="0.6">
                            {Array.from({ length: maxRows }).map((_, r) =>
                                Array.from({ length: maxCols }).map((__, c) => {
                                    const cx = (c - r) * (cellW / 2)
                                    const cy = (c + r) * (cellH / 2) + cellL
                                    return (
                                        <polygon
                                            key={`floor-${r}-${c}`}
                                            points={`${cx},${cy} ${cx + cellW / 2},${cy + cellH / 2} ${cx},${cy + cellH} ${cx - cellW / 2},${cy + cellH / 2}`}
                                            fill="#f8fafc"
                                            stroke="#cbd5e1"
                                            strokeWidth="1.2"
                                            strokeDasharray="2,2"
                                        />
                                    )
                                })
                            )}
                        </g>
                    )}

                    {/* 2. Khung khối lập phương mục tiêu (Target Cuboid Wireframe) nếu có */}
                    {visual.targetCuboid && (
                        <g opacity="0.45">
                            {(() => {
                                const tx = visual.targetCuboid.x
                                const ty = visual.targetCuboid.y
                                const tz = visual.targetCuboid.z
                                // 4 góc đỉnh sàn đáy
                                const b0 = { x: 0, y: cellL }
                                const b1 = { x: tx * (cellW / 2), y: tx * (cellH / 2) + cellL }
                                const b2 = { x: (tx - ty) * (cellW / 2), y: (tx + ty) * (cellH / 2) + cellL }
                                const b3 = { x: -ty * (cellW / 2), y: ty * (cellH / 2) + cellL }
                                // 4 góc đỉnh trên
                                const tShift = tz * cellL
                                const t0 = { x: b0.x, y: b0.y - tShift }
                                const t1 = { x: b1.x, y: b1.y - tShift }
                                const t2 = { x: b2.x, y: b2.y - tShift }
                                const t3 = { x: b3.x, y: b3.y - tShift }

                                return (
                                    <>
                                        {/* Viền ngoài trên cùng */}
                                        <polygon
                                            points={`${t0.x},${t0.y} ${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}`}
                                            fill="#e0e7ff"
                                            fillOpacity="0.15"
                                            stroke="#6366f1"
                                            strokeWidth="1.5"
                                            strokeDasharray="4,4"
                                        />
                                        {/* Các cột góc đứng */}
                                        <line x1={b0.x} y1={b0.y} x2={t0.x} y2={t0.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" />
                                        <line x1={b1.x} y1={b1.y} x2={t1.x} y2={t1.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" />
                                        <line x1={b2.x} y1={b2.y} x2={t2.x} y2={t2.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" />
                                        <line x1={b3.x} y1={b3.y} x2={t3.x} y2={t3.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" />
                                    </>
                                )
                            })()}
                        </g>
                    )}

                    {/* 3. Các khối lập phương 3D vẽ theo thứ tự Painter */}
                    {sortedBlocks.map((b, idx) => {
                        const cx = (b.x - b.y) * (cellW / 2)
                        const cy = (b.x + b.y) * (cellH / 2) - b.z * cellL
                        const col = getColors(b.z)

                        return (
                            <g key={`b-${b.x}-${b.y}-${b.z}-${idx}`} style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.06))' }}>
                                {/* Mặt trên (Top face) */}
                                <polygon
                                    points={`${cx},${cy} ${cx + cellW / 2},${cy + cellH / 2} ${cx},${cy + cellH} ${cx - cellW / 2},${cy + cellH / 2}`}
                                    fill={col.top}
                                    stroke={col.stroke}
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />
                                {/* Mặt trái (Left face) */}
                                <polygon
                                    points={`${cx - cellW / 2},${cy + cellH / 2} ${cx},${cy + cellH} ${cx},${cy + cellH + cellL} ${cx - cellW / 2},${cy + cellH / 2 + cellL}`}
                                    fill={col.left}
                                    stroke={col.stroke}
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />
                                {/* Mặt phải (Right face) */}
                                <polygon
                                    points={`${cx},${cy + cellH} ${cx + cellW / 2},${cy + cellH / 2} ${cx + cellW / 2},${cy + cellH / 2 + cellL} ${cx},${cy + cellH + cellL}`}
                                    fill={col.right}
                                    stroke={col.stroke}
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />
                            </g>
                        )
                    })}
                </svg>
            </div>
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