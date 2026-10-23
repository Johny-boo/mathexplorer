export type CoinVisualData = {
    type: 'coins'
    coins: { value: number; count: number; label: string }[]
}

interface Props {
    visual: CoinVisualData
}

export default function CoinVisual({ visual }: Props) {
    const coins = visual.coins || [
        { value: 1, count: 2, label: '1¢' },
        { value: 2, count: 3, label: '2¢' }
    ]

    return (
        <div className="coin-visual-container my-4 flex flex-col items-center select-none">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2.5">
                <span>🪙 Các đồng xu bạn đang có / Your coins:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200">
                {coins.map((coinGroup, gIdx) => (
                    <div key={gIdx} className="flex flex-col items-center bg-white/90 px-3.5 py-2.5 rounded-xl border border-amber-200 shadow-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                            {Array.from({ length: coinGroup.count }).map((_, cIdx) => (
                                <div
                                    key={cIdx}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-black shadow-sm ${
                                        coinGroup.value === 1
                                            ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 border-amber-900'
                                            : coinGroup.value === 2
                                            ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 border-slate-500'
                                            : 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 border-yellow-600'
                                    }`}
                                >
                                    <span className="text-xs sm:text-sm">{coinGroup.label}</span>
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                            {coinGroup.count} đồng {coinGroup.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
