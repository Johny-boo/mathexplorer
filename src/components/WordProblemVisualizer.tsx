export type WordProblemVisualData = {
    generatorIndex: number // 0 to 9
    char: string
    item: string
    a?: number
    b?: number
    c?: number
    k?: number
    n?: number
    m?: number
    char2?: string
}

type Props = {
    data: WordProblemVisualData
}

export default function WordProblemVisualizer({ data }: Props) {
    const { generatorIndex, char, item, a = 10, b = 5, c = 2, k = 3, n = 3, m = 4, char2 = 'Bạn' } = data

    // Item theme color & SVG icon renderer
    const getItemIllustration = (count: number, label: string) => {
        return (
            <div className="word-item-group-card">
                <div className="item-card-header">
                    <span className="item-card-count">{count}</span>
                    <span className="item-card-unit">{label}</span>
                </div>
                <div className="item-card-icons">
                    {/* Vẽ các biểu tượng nhóm chấm tròn đồ vật có tổ chức */}
                    <div className="item-dots-cluster">
                        {Array.from({ length: Math.min(count, 12) }).map((_, i) => (
                            <span key={i} className="item-visual-dot" />
                        ))}
                        {count > 12 && <span className="item-more-tag">+{count - 12}</span>}
                    </div>
                </div>
            </div>
        )
    }

    // 1. DẠNG CỘNG ĐƠN: Ban đầu có `a`, mua thêm `b`
    if (generatorIndex === 0) {
        const total = a + b
        const aRatio = Math.max(30, Math.min(70, Math.round((a / total) * 100)))
        const bRatio = 100 - aRatio

        return (
            <div className="word-visual-box">
                <div className="visual-banner">
                    <span className="banner-title">SƠ ĐỒ ĐOẠN THẲNG — PHÉP CỘNG</span>
                </div>

                {/* Sơ đồ đoạn thẳng */}
                <div className="bar-model-diagram">
                    <div className="bar-labels-top">
                        <span style={{ width: `${aRatio}%` }}>{char} có ban đầu ({a})</span>
                        <span style={{ width: `${bRatio}%` }}>Được thêm ({b})</span>
                    </div>
                    <div className="bar-container">
                        <div className="bar-part bar-primary" style={{ width: `${aRatio}%` }}>
                            {a} {item}
                        </div>
                        <div className="bar-part bar-secondary" style={{ width: `${bRatio}%` }}>
                            +{b} {item}
                        </div>
                    </div>
                    <div className="bar-bracket-total">
                        <div className="bracket-brace" />
                        <div className="bracket-text">Tất cả có = <strong className="q-highlight">? {item}</strong></div>
                    </div>
                </div>

                {/* Thẻ minh họa sự vật trực quan */}
                <div className="visual-items-row">
                    {getItemIllustration(a, `Ban đầu của ${char}`)}
                    <span className="visual-plus-badge">➕</span>
                    {getItemIllustration(b, 'Được thêm')}
                </div>
            </div>
        )
    }

    // 2. DẠNG TRỪ ĐƠN: Ban đầu có `a`, đã cho/ăn `b`
    if (generatorIndex === 1) {
        const bRatio = Math.max(25, Math.min(75, Math.round((b / a) * 100)))
        const remRatio = 100 - bRatio

        return (
            <div className="word-visual-box">
                <div className="visual-banner">
                    <span className="banner-title">SƠ ĐỒ ĐOẠN THẲNG — PHÉP TRỪ</span>
                </div>

                <div className="bar-model-diagram">
                    <div className="total-header-line">Tổng số ban đầu của {char}: <strong>{a} {item}</strong></div>
                    <div className="bar-container">
                        <div className="bar-part bar-remaining" style={{ width: `${remRatio}%` }}>
                            Còn lại: <strong className="q-highlight">?</strong>
                        </div>
                        <div className="bar-part bar-taken" style={{ width: `${bRatio}%` }}>
                            Đã bớt: {b}
                        </div>
                    </div>
                </div>

                <div className="visual-items-row">
                    {getItemIllustration(a, `Tổng ban đầu`)}
                    <span className="visual-minus-badge">➖ bớt {b}</span>
                    <div className="visual-result-placeholder">Còn lại: <strong>?</strong></div>
                </div>
            </div>
        )
    }

    // 3. CỘNG RỒI CỘNG (3 phần)
    if (generatorIndex === 2) {
        const total = a + b + c
        const aR = Math.round((a / total) * 100)
        const bR = Math.round((b / total) * 100)
        const cR = 100 - aR - bR

        return (
            <div className="word-visual-box">
                <div className="visual-banner">
                    <span className="banner-title">SƠ ĐỒ 3 BƯỚC CỘNG DỒN</span>
                </div>

                <div className="bar-model-diagram">
                    <div className="bar-container">
                        <div className="bar-part bar-step1" style={{ width: `${aR}%` }}>{char}: {a}</div>
                        <div className="bar-part bar-step2" style={{ width: `${bR}%` }}>Thêm: {b}</div>
                        <div className="bar-part bar-step3" style={{ width: `${cR}%` }}>Thêm: {c}</div>
                    </div>
                    <div className="bar-bracket-total">
                        <div className="bracket-brace" />
                        <div className="bracket-text">Tổng cả 3 lần = <strong className="q-highlight">? {item}</strong></div>
                    </div>
                </div>
            </div>
        )
    }

    // 5. NHÂN RỒI CỘNG: `n` hộp, mỗi hộp `m`, thêm `k` rời
    if (generatorIndex === 4) {
        return (
            <div className="word-visual-box">
                <div className="visual-banner">
                    <span className="banner-title">MÔ HÌNH HỘP & VẬT RỜI ({n} hộp × {m} + {k} rời)</span>
                </div>

                {/* Minh họa các hộp thực tế */}
                <div className="boxes-illustration-grid">
                    {Array.from({ length: n }).map((_, i) => (
                        <div key={i} className="package-box-card">
                            <div className="box-lid">Hộp số {i + 1}</div>
                            <div className="box-content">
                                <span className="box-number-badge">{m}</span>
                                <span className="box-unit-label">{item}</span>
                            </div>
                        </div>
                    ))}
                    <div className="loose-items-card">
                        <div className="loose-header">Bên ngoài rời:</div>
                        <div className="loose-content">
                            <span className="loose-number-badge">+{k}</span>
                            <span className="loose-unit-label">{item} rời</span>
                        </div>
                    </div>
                </div>

                {/* Sơ đồ đoạn thẳng */}
                <div className="bar-model-diagram">
                    <div className="bar-container">
                        <div className="bar-part bar-primary" style={{ width: '75%' }}>
                            {n} hộp × {m} = {n * m} {item}
                        </div>
                        <div className="bar-part bar-accent" style={{ width: '25%' }}>
                            +{k} rời
                        </div>
                    </div>
                    <div className="bar-bracket-total">
                        <div className="bracket-brace" />
                        <div className="bracket-text">Tổng tất cả = <strong className="q-highlight">? {item}</strong></div>
                    </div>
                </div>
            </div>
        )
    }

    // 6. NHÂN RỒI TRỪ: `n` đĩa, mỗi đĩa `m`, ăn mất `k`
    if (generatorIndex === 5) {
        return (
            <div className="word-visual-box">
                <div className="visual-banner">
                    <span className="banner-title">MÔ HÌNH NHÓM ĐỒ VẬT VÀ PHẦN ĐÃ DÙNG</span>
                </div>

                <div className="boxes-illustration-grid">
                    {Array.from({ length: n }).map((_, i) => (
                        <div key={i} className="package-box-card">
                            <div className="box-lid">Đĩa {i + 1}</div>
                            <div className="box-content">
                                <span className="box-number-badge">{m}</span>
                                <span className="box-unit-label">{item}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bar-model-diagram">
                    <div className="total-header-line">Tổng ban đầu ({n} đĩa × {m}) = <strong>{n * m} {item}</strong></div>
                    <div className="bar-container">
                        <div className="bar-part bar-remaining" style={{ width: '70%' }}>
                            Còn lại: <strong className="q-highlight">? {item}</strong>
                        </div>
                        <div className="bar-part bar-taken" style={{ width: '30%' }}>
                            Đã ăn/bớt: {k}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 8. CHIA RỒI CỘNG: Chia đều `a` vào `n` phần, rồi thêm `k`
    if (generatorIndex === 7) {
        return (
            <div className="word-visual-box">
                <div className="visual-banner">
                    <span className="banner-title">MÔ HÌNH CHIA ĐỀU VÀ CỘNG THÊM</span>
                </div>

                <div className="division-slots-grid">
                    {Array.from({ length: n }).map((_, i) => (
                        <div key={i} className="slot-box">
                            <div className="slot-header">Túi {i + 1}</div>
                            <div className="slot-detail">Được chia đều</div>
                            {i === 0 && <div className="slot-extra-tag">+ {k} thêm</div>}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // 9. SO SÁNH HƠN KÉM: `char` có `a`, `char2` nhiều hơn `b`
    if (generatorIndex === 8) {
        return (
            <div className="word-visual-box">
                <div className="visual-banner">
                    <span className="banner-title">SƠ ĐỒ SO SÁNH HƠN KÉM TOÁN TIỂU HỌC</span>
                </div>

                <div className="comparison-bars-diagram">
                    {/* Thanh người 1 */}
                    <div className="comp-item-row">
                        <span className="comp-name-badge">{char}:</span>
                        <div className="comp-bar-container">
                            <div className="comp-bar bar-teal" style={{ width: '55%' }}>
                                {a} {item}
                            </div>
                        </div>
                    </div>

                    {/* Thanh người 2 */}
                    <div className="comp-item-row">
                        <span className="comp-name-badge">{char2}:</span>
                        <div className="comp-bar-container">
                            <div className="comp-bar bar-teal" style={{ width: '55%' }}>
                                {a} {item}
                            </div>
                            <div className="comp-bar-extra" style={{ width: '25%' }}>
                                Nhiều hơn: {b}
                            </div>
                        </div>
                    </div>

                    <div className="bar-bracket-total">
                        <div className="bracket-brace" />
                        <div className="bracket-text">Cả hai bạn có = <strong className="q-highlight">? {item}</strong></div>
                    </div>
                </div>
            </div>
        )
    }

    // 10. GẤP SỐ LẦN / TỈ LỆ
    if (generatorIndex === 9) {
        return (
            <div className="word-visual-box">
                <div className="visual-banner">
                    <span className="banner-title">SƠ ĐỒ ĐOẠN THẲNG TỈ LỆ GẤP {k} LẦN</span>
                </div>

                <div className="comparison-bars-diagram">
                    <div className="comp-item-row">
                        <span className="comp-name-badge">{char} (1 phần):</span>
                        <div className="comp-bar-container">
                            <div className="comp-bar bar-primary" style={{ width: '25%' }}>
                                {a} {item}
                            </div>
                        </div>
                    </div>

                    <div className="comp-item-row">
                        <span className="comp-name-badge">{char2} ({k} phần bằng nhau):</span>
                        <div className="comp-bar-container">
                            {Array.from({ length: k }).map((_, i) => (
                                <div key={i} className="comp-bar bar-primary" style={{ width: `${75 / k}%` }}>
                                    {a}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bar-bracket-total">
                        <div className="bracket-brace" />
                        <div className="bracket-text">Số của {char2} = <strong className="q-highlight">? {item}</strong></div>
                    </div>
                </div>
            </div>
        )
    }

    // Mặc định: Thanh tổng quát 2 phần
    return (
        <div className="word-visual-box">
            <div className="visual-banner">
                <span className="banner-title">SƠ ĐỒ TỔNG THỂ BÀI TOÁN</span>
            </div>
            <div className="bar-model-diagram">
                <div className="bar-container">
                    <div className="bar-part bar-primary" style={{ width: '60%' }}>
                        Ban đầu: {a} {item}
                    </div>
                    <div className="bar-part bar-secondary" style={{ width: '40%' }}>
                        Thao tác tiếp theo
                    </div>
                </div>
                <div className="bar-bracket-total">
                    <div className="bracket-brace" />
                    <div className="bracket-text">Đáp số bài toán = <strong className="q-highlight">?</strong></div>
                </div>
            </div>
        </div>
    )
}
