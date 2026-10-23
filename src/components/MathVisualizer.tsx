export type MathVisualData = {
    type: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'missing_add' | 'missing_sub' | 'missing_mul' | 'compare' | 'mixed3' | 'mixed_mul'
    a: number
    b?: number
    c?: number
    total?: number
    missing?: number
    ans?: number | string
    op?: string
}

type Props = {
    data: MathVisualData
}

export default function MathVisualizer({ data }: Props) {
    const { type } = data

    // 1. PHÉP CỘNG: Mô hình thanh + Khối đếm trực quan
    if (type === 'addition') {
        const a = data.a
        const b = data.b ?? 0
        const total = a + b
        const showCounters = total <= 24

        // Chiều rộng tương đối cho 2 thanh (tối thiểu 30%, tối đa 70%)
        const aRatio = Math.max(25, Math.min(75, Math.round((a / total) * 100)))
        const bRatio = 100 - aRatio

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">Mô hình trực quan: Sơ đồ đoạn thẳng</div>
                {/* Sơ đồ đoạn thẳng (Tape Diagram) */}
                <div className="tape-diagram-wrapper">
                    <div className="tape-bar-row">
                        <div className="tape-segment segment-blue" style={{ width: `${aRatio}%` }}>
                            <span className="segment-value">{a}</span>
                        </div>
                        <div className="tape-segment segment-amber" style={{ width: `${bRatio}%` }}>
                            <span className="segment-value">{b}</span>
                        </div>
                    </div>
                    {/* Dấu ngoặc tổng bên dưới */}
                    <div className="tape-bracket">
                        <div className="bracket-line" />
                        <div className="bracket-label">Tổng cộng = <span className="bracket-question">?</span></div>
                    </div>
                </div>

                {/* Khối đếm chấm tròn (Counters) cho số nhỏ để bé kiểm đếm */}
                {showCounters && (
                    <div className="counters-box">
                        <div className="counter-group">
                            <span className="counter-tag tag-blue">{a} chấm xanh:</span>
                            <div className="counter-dots">
                                {Array.from({ length: a }).map((_, i) => (
                                    <span key={`a-${i}`} className="dot dot-blue" />
                                ))}
                            </div>
                        </div>
                        <span className="counter-plus">+</span>
                        <div className="counter-group">
                            <span className="counter-tag tag-amber">{b} chấm vàng:</span>
                            <div className="counter-dots">
                                {Array.from({ length: b }).map((_, i) => (
                                    <span key={`b-${i}`} className="dot dot-amber" />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // 2. PHÉP TRỪ: Mô hình thanh bớt đi
    if (type === 'subtraction') {
        const a = data.a
        const b = data.b ?? 0
        const bRatio = Math.max(25, Math.min(75, Math.round((b / a) * 100)))
        const remRatio = 100 - bRatio

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">Mô hình trực quan: Bớt đi một phần</div>
                <div className="tape-diagram-wrapper">
                    {/* Thanh tổng số ban đầu */}
                    <div className="tape-total-label">Ban đầu có tổng cộng: <strong>{a}</strong></div>
                    <div className="tape-bar-row">
                        <div className="tape-segment segment-emerald" style={{ width: `${remRatio}%` }}>
                            <span className="segment-value">Còn lại: <strong className="bracket-question">?</strong></span>
                        </div>
                        <div className="tape-segment segment-subtracted" style={{ width: `${bRatio}%` }}>
                            <span className="segment-value">Bớt đi: {b} ✂️</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 3. PHÉP NHÂN: Ma trận mảng (Array Grid) các chấm theo hàng x cột
    if (type === 'multiplication') {
        const rows = data.a
        const cols = data.b ?? 1
        const maxDots = rows * cols

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">Mô hình mảng: {rows} hàng × {cols} cột</div>
                <div className="multiplication-grid-box">
                    <div className="grid-dimension-top">
                        <span className="dim-arrow">⟵</span>
                        <span className="dim-text">{cols} cột</span>
                        <span className="dim-arrow">⟶</span>
                    </div>
                    <div className="grid-body-with-side">
                        <div className="grid-dimension-left">
                            <span className="dim-text">{rows} hàng</span>
                        </div>
                        <div
                            className="math-dot-grid"
                            style={{
                                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                            }}
                        >
                            {Array.from({ length: maxDots }).map((_, i) => (
                                <div key={i} className="array-dot" title={`Vị trí ${i + 1}`}>
                                    <div className="array-dot-core" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 4. PHÉP CHIA: Chia đều vào các nhóm (Equal Groups)
    if (type === 'division') {
        const total = data.a
        const groups = data.b ?? 1
        const itemsPerGroup = Math.max(1, Math.round(total / groups))

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">
                    Chia đều <strong>{total}</strong> vật phẩm vào <strong>{groups}</strong> nhóm
                </div>
                <div className="division-groups-wrapper">
                    {Array.from({ length: groups }).map((_, gIdx) => (
                        <div key={gIdx} className="division-group-plate">
                            <div className="group-plate-title">Nhóm {gIdx + 1}</div>
                            <div className="group-plate-items">
                                {Array.from({ length: itemsPerGroup }).map((_, iIdx) => (
                                    <span key={iIdx} className="group-dot" />
                                ))}
                            </div>
                            <div className="group-plate-count">? phần tử</div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // 5. TÌM SỐ HẠNG CÒN THIẾU: a + ? = total
    if (type === 'missing_add') {
        const a = data.a
        const total = data.total ?? (a + 10)
        const aRatio = Math.max(25, Math.min(75, Math.round((a / total) * 100)))
        const missingRatio = 100 - aRatio

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">Mô hình phần - tổng (Tìm số hạng chưa biết)</div>
                <div className="tape-diagram-wrapper">
                    <div className="tape-bar-row">
                        <div className="tape-segment segment-blue" style={{ width: `${aRatio}%` }}>
                            <span className="segment-value">Đã biết: {a}</span>
                        </div>
                        <div className="tape-segment segment-missing" style={{ width: `${missingRatio}%` }}>
                            <span className="segment-value">Chưa biết: <strong className="bracket-question">?</strong></span>
                        </div>
                    </div>
                    <div className="tape-bracket">
                        <div className="bracket-line" />
                        <div className="bracket-label">Tổng cả hai phần = <strong>{total}</strong></div>
                    </div>
                </div>
            </div>
        )
    }

    // 6. TÌM SỐ TRỪ / SỐ BỊ TRỪ CÒN THIẾU
    if (type === 'missing_sub') {
        const a = data.a
        const b = data.b ?? 0
        const total = a
        const bRatio = Math.max(25, Math.min(75, Math.round((b / total) * 100)))
        const remRatio = 100 - bRatio

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">Mô hình tìm thành phần phép trừ</div>
                <div className="tape-diagram-wrapper">
                    <div className="tape-total-label">Tổng ban đầu: <strong>{total}</strong></div>
                    <div className="tape-bar-row">
                        <div className="tape-segment segment-emerald" style={{ width: `${remRatio}%` }}>
                            <span className="segment-value">Còn lại: <strong>{b}</strong></span>
                        </div>
                        <div className="tape-segment segment-missing" style={{ width: `${bRatio}%` }}>
                            <span className="segment-value">Đã bớt: <strong className="bracket-question">?</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 7. SO SÁNH: Hai thanh so sánh song song
    if (type === 'compare') {
        const a = data.a
        const b = data.b ?? 0
        const maxVal = Math.max(a, b, 1)
        const aWidth = Math.max(20, Math.round((a / maxVal) * 100))
        const bWidth = Math.max(20, Math.round((b / maxVal) * 100))

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">Mô hình so sánh độ dài số học</div>
                <div className="compare-bars-wrapper">
                    <div className="compare-row">
                        <span className="compare-label">Số thứ nhất:</span>
                        <div className="compare-bar-track">
                            <div className="compare-bar bar-purple" style={{ width: `${aWidth}%` }}>
                                <strong>{a}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="compare-center-symbol">
                        <span className="symbol-box">?</span>
                    </div>
                    <div className="compare-row">
                        <span className="compare-label">Số thứ hai:</span>
                        <div className="compare-bar-track">
                            <div className="compare-bar bar-teal" style={{ width: `${bWidth}%` }}>
                                <strong>{b}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 8. PHÉP TOÁN NHÂN RỒI CỘNG / TRỪ (mixed_mul)
    if (type === 'mixed_mul') {
        const a = data.a
        const b = data.b ?? 1
        const c = data.c ?? 0
        const op = data.op ?? '+'

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">Mô hình thực hiện từng bước</div>
                <div className="mixed-steps-diagram">
                    <div className="step-block step-mult">
                        <div className="step-badge">Bước 1: Nhân</div>
                        <div className="step-expr">{a} × {b}</div>
                        <div className="step-sub">{a * b}</div>
                    </div>
                    <div className="step-arrow-operator">{op === '+' ? '➕' : '➖'}</div>
                    <div className="step-block step-add">
                        <div className="step-badge">Bước 2: {op === '+' ? 'Cộng thêm' : 'Trừ đi'}</div>
                        <div className="step-expr">{c}</div>
                    </div>
                    <div className="step-arrow-operator">➔</div>
                    <div className="step-block step-result">
                        <div className="step-badge">Kết quả</div>
                        <div className="step-expr bracket-question">?</div>
                    </div>
                </div>
            </div>
        )
    }

    // 9. DẠNG 3 SỐ (mixed3)
    if (type === 'mixed3') {
        const a = data.a
        const b = data.b ?? 0
        const c = data.c ?? 0

        return (
            <div className="math-visual-container">
                <div className="visual-header-label">Mô hình chuỗi phép tính 2 bước</div>
                <div className="mixed-steps-diagram">
                    <div className="step-block step-mult">
                        <div className="step-badge">Ban đầu</div>
                        <div className="step-expr">{a}</div>
                    </div>
                    <div className="step-arrow-operator">➕ {b}</div>
                    <div className="step-block step-add">
                        <div className="step-badge">Tổng tạm</div>
                        <div className="step-expr">{a + b}</div>
                    </div>
                    <div className="step-arrow-operator">➖ {c}</div>
                    <div className="step-block step-result">
                        <div className="step-badge">Còn lại</div>
                        <div className="step-expr bracket-question">?</div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
