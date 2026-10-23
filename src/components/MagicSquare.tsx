export type MagicSquareVisualData = {
    type: 'magic_square'
    grid?: number[][]
    missingR?: number
    missingC?: number
    magicSum?: number
    data?: {
        base?: number[][]
        missingR?: number
        missingC?: number
        magicSum?: number
    }
}

interface Props {
    visual: MagicSquareVisualData
}

export default function MagicSquare({ visual }: Props) {
    const rawGrid = visual.grid || visual.data?.base || [
        [2, 7, 6],
        [9, 5, 1],
        [4, 3, 8]
    ]
    const missingR = visual.missingR ?? visual.data?.missingR ?? 1
    const missingC = visual.missingC ?? visual.data?.missingC ?? 1
    const magicSum = visual.magicSum ?? visual.data?.magicSum ?? 15

    // Lấy hàng chứa ô cần tìm
    const targetRow = rawGrid[missingR] || [9, 5, 1]
    const knownInRow = targetRow.filter((_, idx) => idx !== missingC)
    const knownSum = knownInRow.reduce((sum, n) => sum + n, 0)

    // Lấy một hàng hoàn chỉnh để làm ví dụ
    const completeRowIdx = missingR === 0 ? 1 : 0
    const completeRow = rawGrid[completeRowIdx] || [2, 7, 6]

    return (
        <div className="magic-square-container my-5 flex flex-col items-center select-none">
            {/* Header huy hiệu ma trận */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-black bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm">
                    🔮 Ma trận kỳ diệu • Magic Square
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    ✨ Tổng hàng = cột = chéo = <strong className="text-sm font-black text-amber-700 ml-0.5">{magicSum}</strong>
                </span>
            </div>

            {/* Khung ma trận 3x3 */}
            <div className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-sky-50/80 to-purple-50/90 border-4 border-indigo-300 shadow-lg">
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                    {rawGrid.map((row, r) =>
                        row.map((val, c) => {
                            const isMissing = r === missingR && c === missingC
                            if (isMissing) {
                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 border-4 border-amber-500 shadow-inner flex flex-col items-center justify-center relative animate-pulse ring-4 ring-amber-300/60"
                                        title="Ô cần tìm"
                                    >
                                        <span className="text-3xl sm:text-4xl font-black text-amber-700 leading-none">
                                            ?
                                        </span>
                                        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-800 mt-0.5 bg-amber-400/80 px-1.5 py-0.5 rounded-full">
                                            Số thiếu
                                        </span>
                                    </div>
                                )
                            }
                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-3 border-indigo-100 hover:border-indigo-300 shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                                >
                                    <span className="text-2xl sm:text-3xl font-black text-slate-800 font-sans">
                                        {val}
                                    </span>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Dòng hướng dẫn suy luận trực quan cho học sinh */}
            <div className="mt-3.5 max-w-md w-full bg-slate-50 border-2 border-indigo-100 rounded-2xl p-3 text-center shadow-xs">
                <div className="text-xs sm:text-sm font-bold text-slate-600 flex items-center justify-center gap-1.5 flex-wrap">
                    <span>💡 Hàng hoàn chỉnh:</span>
                    <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                        {completeRow[0]} + {completeRow[1]} + {completeRow[2]} = {magicSum}
                    </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-amber-900 mt-1.5 flex items-center justify-center gap-1.5 flex-wrap">
                    <span>🔍 Hàng chứa ?:</span>
                    <span className="font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-lg border border-amber-300">
                        {targetRow.map((v, idx) => (idx === missingC ? '?' : v)).join(' + ')} = {magicSum}
                    </span>
                    <span className="text-slate-500 text-xs font-semibold">
                        ({knownSum} + ? = {magicSum})
                    </span>
                </div>
            </div>
        </div>
    )
}
