type Props = {
    leftWeight: number
    rightWeight: number
    itemEmoji: string
    itemWeight: number
    numLeft: number
    numRight: number
}

export default function BalanceScale({ leftWeight, rightWeight, itemEmoji, itemWeight, numLeft, numRight }: Props) {
    // Render đúng số quả cân thực tế (numLeft và numRight luôn là số nguyên)
    const leftBlocks = Array.from({ length: numLeft }, (_, i) => i)
    const rightBlocks = Array.from({ length: numRight }, (_, i) => i)

    return (
        <div style= {{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', margin: '40px 0', gap: '20px', flexWrap: 'wrap' }
}>
{/* Bên trái */ }
    < div style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={ { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '140px', gap: '4px' } }>
        {
            leftBlocks.map((_, i) => (
                <span key= {`l${i}`} style = {{ fontSize: '32px', lineHeight: 1 }}>🟦</span>
                    ))}
</div>
    < div style = {{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px' }}>
                    = { leftWeight } kg
    </div>
    </div>

{/* Cái cân */ }
<div style={ { fontSize: '80px', lineHeight: 1, transform: 'translateY(-15px)' } }>⚖️</div>

{/* Bên phải */ }
<div style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' } }>
    <div style={ { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '140px', gap: '4px', alignItems: 'center' } }>
    {
        rightBlocks.map((_, i) => (
            <span key= {`r${i}`} style = {{ fontSize: '32px', lineHeight: 1 }}>🟦</span>
                    ))}
<span style={ { fontSize: '40px', lineHeight: 1, color: '#dc2626', fontWeight: 'bold' } }>? </span>
    </div>
    < div style = {{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '8px' }}>
                    = { rightWeight } kg
    </div>
    </div>
    </div>
    )
}