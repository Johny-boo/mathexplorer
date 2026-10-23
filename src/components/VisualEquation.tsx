type Props = {
    lines: string[]
}

export default function VisualEquation({ lines }: Props) {
    return (
        <div className="visual-equation-container">
            <div className="equation-header-badge">Hệ phương trình hình ảnh (Toán tư duy)</div>
            <div className="equation-cards-list">
                {lines.map((line, idx) => {
                    // Tách các phần tử theo khoảng trắng
                    const parts = line.split(' ')

                    return (
                        <div key={idx} className="equation-line-card">
                            <div className="equation-line-number">Dòng {idx + 1}</div>
                            <div className="equation-tokens-row">
                                {parts.map((part, pIdx) => {
                                    const isOperator = ['+', '−', '-', '×', '*', '÷', '/', '='].includes(part)
                                    const isNumber = !isNaN(Number(part))
                                    const isQuestion = part === '?'

                                    if (isOperator) {
                                        return (
                                            <span key={pIdx} className="equation-operator">
                                                {part === '*' ? '×' : part === '-' ? '−' : part}
                                            </span>
                                        )
                                    }
                                    if (isQuestion) {
                                        return (
                                            <span key={pIdx} className="equation-question-box">
                                                ?
                                            </span>
                                        )
                                    }
                                    if (isNumber) {
                                        return (
                                            <span key={pIdx} className="equation-number-badge">
                                                {part}
                                            </span>
                                        )
                                    }

                                    // Biểu tượng hoặc đồ vật hình ảnh
                                    return (
                                        <span key={pIdx} className="equation-item-token">
                                            {part}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}