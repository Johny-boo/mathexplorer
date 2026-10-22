type Props = { shape: 'paper_plane' | 'star' | 'house' }
export default function CountLines({ shape }: Props) {
    if (shape === 'paper_plane') {
        return (
            <svg viewBox= "0 0 100 100" style = {{ width: '150px', height: '150px', margin: '20px auto', display: 'block' }
    }>
        <polygon points="10,50 90,10 50,90" fill = "none" stroke = "#334155" strokeWidth = "3" />
            <line x1="90" y1 = "10" x2 = "50" y2 = "50" stroke = "#334155" strokeWidth = "3" />
                <line x1="10" y1 = "50" x2 = "50" y2 = "50" stroke = "#334155" strokeWidth = "3" />
                    <line x1="50" y1 = "50" x2 = "50" y2 = "90" stroke = "#334155" strokeWidth = "3" />
                        </svg>
        )
}
return null
}