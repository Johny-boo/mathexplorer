type Props = { letters: string[]; swap1: number; swap2: number }
export default function PeopleLine({ letters, swap1, swap2 }: Props) {
    return (
        <div style= {{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }
}>
{
    letters.map((l, i) => (
        <div key= { i } style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
    <div style={ { fontSize: '40px' } }>👤</div>
        < span style = {{ fontWeight: 'bold', color: i === swap1 || i === swap2 ? '#ef4444' : '#1e293b' }}> { l } </span>
            </div>
            ))}
</div>
    )
}