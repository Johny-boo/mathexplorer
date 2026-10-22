import { useEffect, useState } from 'react'

type Props = {
    starCount: number
    maxStars?: number
    moduleTitle: string
    onClose: () => void
}

export default function CelebrationModal({ starCount, maxStars = 5, moduleTitle, onClose }: Props) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setShow(true), 50)
        return () => clearTimeout(t)
    }, [])

    return (
        <div className="celebration-overlay" onClick={onClose}>
            <div className={`celebration-modal ${show ? 'show' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="celebration-sparkles">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <span
                            key={i}
                            className="celebration-sparkle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 0.8}s`,
                            }}
                        >✨</span>
                    ))}
                </div>
                <div className="celebration-content">
                    <div className="celebration-stars">
                        {Array.from({ length: maxStars }).map((_, i) => (
                            <span
                                key={i}
                                className={`celebration-star ${i < starCount ? 'filled' : 'empty'}`}
                                style={{ animationDelay: `${i * 0.15}s` }}
                            >
                                {i < starCount ? '⭐' : '☆'}
                            </span>
                        ))}
                    </div>
                    <h2 className="celebration-title">🎉 Chúc mừng!</h2>
                    <p className="celebration-message">
                        Con đã đạt <strong>{starCount} sao</strong> ở module
                    </p>
                    <p className="celebration-module">{moduleTitle}</p>
                    <button className="celebration-btn" onClick={onClose}>
                        Tuyệt vời! Tiếp tục →
                    </button>
                </div>
            </div>
        </div>
    )
}