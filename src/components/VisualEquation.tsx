type Props = {
    lines: string[]
}

export default function VisualEquation({ lines }: Props) {
    return (
        <div style= {{
        display: 'flex',
            flexDirection: 'column',
                alignItems: 'center',
                    gap: '12px',
                        margin: '30px 0',
                            background: '#ffffff',
                                padding: '24px',
                                    borderRadius: '24px',
                                        border: '3px dashed #38bdf8',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    }
}>
{
    lines.map((line, idx) => (
        <div key= { idx } style = {{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#0f172a',
        letterSpacing: '4px',
        background: '#f0f9ff',
        padding: '8px 24px',
        borderRadius: '16px',
        width: '100%',
        textAlign: 'center'
    }} >
{ line }
    </div>
            ))}
</div>
    )
}