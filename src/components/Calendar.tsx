type Props = { monthName: string; startDay: number; daysInMonth: number; eventDay: number }
export default function Calendar({ monthName, startDay, daysInMonth, eventDay }: Props) {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    const cells = Array(startDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))
    return (
        <div style= {{ background: '#fff', padding: '12px', borderRadius: '12px', border: '2px solid #cbd5e1', margin: '20px auto', maxWidth: '300px' }
}>
    <h4 style={ { margin: '0 0 8px', textAlign: 'center', color: '#ef4444' } }> { monthName } </h4>
        < div style = {{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '12px' }}>
        { days.map(d => <div key={ d } style = {{ fontWeight: 'bold', color: '#64748b' }} > { d } </div>)}
{
    cells.map((c, i) => (
        <div key= { i } style = {{ padding: '4px', background: c === eventDay ? '#fca5a5' : 'transparent', borderRadius: '50%' }}>
        { c || ''}
</div>
                ))}
</div>
    </div>
    )
}