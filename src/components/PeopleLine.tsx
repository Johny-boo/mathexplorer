type Props = {
    letters: string[]
    swap1: number
    swap2: number
}

// 6 màu áo rực rỡ cho các bạn nhỏ
const SHIRT_COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#eab308']

export default function PeopleLine({ letters, swap1, swap2 }: Props) {
    return (
        <div className="people-line-container">
            <div className="people-line-header">
                Hàng ngũ xếp hàng (Từ trái sang phải)
            </div>

            <div className="people-line-queue">
                {letters.map((letter, idx) => {
                    const isSwapped = idx === swap1 || idx === swap2
                    const shirtColor = SHIRT_COLORS[idx % SHIRT_COLORS.length]

                    return (
                        <div key={idx} className={`person-slot ${isSwapped ? 'swapped-active' : ''}`}>
                            <div className="person-pos-pill">Số {idx + 1}</div>

                            {/* SVG Hình bạn nhỏ đáng yêu */}
                            <svg viewBox="0 0 60 70" className="child-avatar-svg">
                                {/* Đầu và khuôn mặt */}
                                <circle cx="30" cy="22" r="14" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
                                {/* Mắt cười */}
                                <circle cx="25" cy="20" r="2" fill="#1e293b" />
                                <circle cx="35" cy="20" r="2" fill="#1e293b" />
                                {/* Miệng cười */}
                                <path d="M 26 26 Q 30 30 34 26" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                                {/* Tóc / Mũ */}
                                <path d="M 16 18 Q 30 6 44 18" fill={shirtColor} />
                                {/* Thân áo */}
                                <path d="M 12 40 Q 30 34 48 40 L 52 66 L 8 66 Z" fill={shirtColor} stroke="#1e293b" strokeWidth="2" />
                                {/* Huy hiệu chữ cái trước ngực */}
                                <circle cx="30" cy="52" r="9" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                                <text x="30" y="55" fontSize="11" fontWeight="900" textAnchor="middle" dominantBaseline="central" fill="#1e293b">
                                    {letter}
                                </text>
                            </svg>

                            <div className={`person-name-badge ${isSwapped ? 'name-swapped' : ''}`}>
                                Bạn {letter}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}