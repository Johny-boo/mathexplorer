type Props = { data: { name: string; count: number }[]; icon: string; multiplier: number }
export default function Pictograph({ data, icon, multiplier }: Props) {
    return (
        <div style= {{ background: '#fff', padding: '16px', borderRadius: '12px', border: '2px solid #cbd5e1', margin: '20px auto', maxWidth: '500px' }
}>
    <table style={ { width: '100%', borderCollapse: 'collapse', textAlign: 'left' } }>
        <tbody>
        {
            data.map((d, i) => (
                <tr key= { i } style = {{ borderBottom: '1px solid #e2e8f0' }} >
        <td style={ { padding: '8px', fontWeight: 'bold', width: '100px' } }> { d.name } </td>
            < td style = {{ padding: '8px', display: 'flex', gap: '4px' }}>
            {
                Array.from({ length: d.count }).map((_, j) => (
                    <span key= { j } style = {{ fontSize: '24px' }} > { icon } </span>
                                ))}
</td>
    </tr>
                    ))}
<tr>
    <td colSpan={ 2 } style = {{ padding: '12px 8px', fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>
        Each { icon } stands for { multiplier } items.
                        </td>
            </tr>
            </tbody>
            </table>
            </div>
    )
}