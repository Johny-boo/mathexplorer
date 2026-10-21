type Props = {
    hour: number
    minute: 0 | 30
}

export default function ClockFace({ hour, minute }: Props) {
    const cx = 70
    const cy = 70
    const rOuter = 65
    const rNumbers = 50

    // Tính góc (độ -> radian). Trừ 90 độ để số 12 nằm ở trên cùng
    const hourAngle = ((hour % 12 + minute / 60) * 30 - 90) * (Math.PI / 180)
    const minuteAngle = (minute * 6 - 90) * (Math.PI / 180)

    const hourX = cx + 35 * Math.cos(hourAngle)
    const hourY = cy + 35 * Math.sin(hourAngle)

    const minuteX = cx + 55 * Math.cos(minuteAngle)
    const minuteY = cy + 55 * Math.sin(minuteAngle)

    const numbers = Array.from({ length: 12 }, (_, i) => i + 1)

    return (
        <svg viewBox= "0 0 140 140" style = {{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block', margin: '0 auto' }
}>
    <circle cx={ cx } cy = { cy } r = { rOuter } fill = "#ffffff" stroke = "#334155" strokeWidth = "4" />

    {
        numbers.map(num => {
            const angle = (num * 30 - 90) * (Math.PI / 180)
            const x = cx + rNumbers * Math.cos(angle)
            const y = cy + rNumbers * Math.sin(angle)
            return (
                <text
                        key= { num }
            x = { x }
            y = { y }
            fontSize = "14"
            textAnchor = "middle"
            dominantBaseline = "central"
            fontWeight = "bold"
            fill = "#1e293b"
                >
            { num }
                </text>
                )
    })}

{/* Kim giờ: ngắn, dày */ }
<line x1={ cx } y1 = { cy } x2 = { hourX } y2 = { hourY } stroke = "#e11d48" strokeWidth = "6" strokeLinecap = "round" />

{/* Kim phút: dài, mảnh */ }
    < line x1 = { cx } y1 = { cy } x2 = { minuteX } y2 = { minuteY } stroke = "#2563eb" strokeWidth = "4" strokeLinecap = "round" />

    {/* Trục giữa */ }
        < circle cx = { cx } cy = { cy } r = "6" fill = "#334155" />
            </svg>
    )
}