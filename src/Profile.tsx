import { useMemo } from 'react'
import type { GlobalState, SkillId } from './core/types'
import {
    SKILL_INFO,
    SUB_SKILL_LABELS,
    RANK_LABELS,
    PROFILE_MIN_QUESTIONS,
    PROFILE_IMPROVE_THRESHOLD,
    PROFILE_PRACTICE_THRESHOLD,
} from './core/constants'
import { getSkillFromSubSkill } from './core/constants'

type Props = {
    state: GlobalState
    onClose: () => void
    onReset: () => void
}

export default function Profile({ state, onClose, onReset }: Props) {
    const { globalStats, skillStats, subSkillStats, xp, gems, currentRank } = state
    const level = Math.floor(xp / 100) + 1

    // --- 1. Tính toán tỷ lệ chung ---
    const accuracy = globalStats.totalAnswered > 0
        ? Math.round((globalStats.totalCorrect / globalStats.totalAnswered) * 100)
        : 0

    // --- 2. Tính toán Đảo chơi nhiều nhất ---
    const mostPlayedIsland = useMemo(() => {
        const islands = [
            { id: 1, name: 'Đảo Số Học' },
            { id: 2, name: 'Rừng Phép Tính' },
            { id: 3, name: 'Hang Quy Luật' },
            { id: 4, name: 'Núi Hình Học' },
        ]
        let maxXp = -1
        let bestIsland = 'Chưa chơi'
        islands.forEach(island => {
            const p = state.missionProgress[island.id as 1 | 2 | 3 | 4]
            if (p && p.xp > maxXp && p.xp > 0) {
                maxXp = p.xp
                bestIsland = island.name
            }
        })
        return bestIsland
    }, [state.missionProgress])

    // --- 3. Logic Nhận xét (Best / Worst) ---
    const evaluation = useMemo(() => {
        // Lấy danh sách kỹ năng đã chơi đủ 10 câu
        const eligibleSkills = (Object.keys(skillStats) as SkillId[]).filter(
            id => skillStats[id].answered >= PROFILE_MIN_QUESTIONS
        )

        if (eligibleSkills.length === 0) {
            return {
                best: null,
                worst: null,
                message: 'Hãy chơi thêm để hệ thống đánh giá nhé!'
            }
        }

        // Sắp xếp theo % giảm dần
        const sorted = eligibleSkills.map(id => {
            const { correct, answered } = skillStats[id]
            const percent = Math.round((correct / answered) * 100)
            return { id, percent }
        }).sort((a, b) => b.percent - a.percent)

        const best = sorted[0]

        // Worst là kỹ năng có % thấp nhất VÀ dưới 70%
        const worstCandidate = sorted[sorted.length - 1]
        const worst = worstCandidate.percent < PROFILE_PRACTICE_THRESHOLD ? worstCandidate : null

        return { best, worst, message: null }
    }, [skillStats])

    // Tìm sub-skill thấp nhất của một skill lớn
    const getLowestSubSkill = (parentSkillId: SkillId) => {
        const subSkills = (Object.keys(subSkillStats) as string[]).filter(
            key => getSkillFromSubSkill(key as any) === parentSkillId
        )
        let lowest: { name: string; percent: number } | null = null

        subSkills.forEach(key => {
            const stat = subSkillStats[key as keyof typeof subSkillStats]
            if (stat.answered >= PROFILE_MIN_QUESTIONS) {
                const percent = Math.round((stat.correct / stat.answered) * 100)
                if (!lowest || percent < lowest.percent) {
                    lowest = { name: SUB_SKILL_LABELS[key as keyof typeof SUB_SKILL_LABELS], percent }
                }
            }
        })
        return lowest
    }

    const handleReset = () => {
        if (window.confirm('Bạn có chắc chắn muốn XÓA TOÀN BỘ tiến trình chơi không? Hành động này không thể hoàn tác!')) {
            if (window.confirm('Xác nhận lần cuối: Xóa hết Đá quý, XP và Sao?')) {
                onReset()
                onClose()
            }
        }
    }

    // Helper render thanh tiến độ
    const renderBar = (correct: number, answered: number) => {
        if (answered === 0) {
            return <div className="p-bar" > <div className="p-bar-fill" style = {{ width: '0%' }
        }> </div></div >
        }
    const percent = Math.round((correct / answered) * 100)
    let colorClass = 'good'
    if (percent < PROFILE_IMPROVE_THRESHOLD) colorClass = 'improve'
    else if (percent < PROFILE_PRACTICE_THRESHOLD) colorClass = 'practice'

    return (
        <div className= "p-bar" >
        <div className={ `p-bar-fill ${colorClass}` } style = {{ width: `${percent}%` }
}> </div>
    </div>
        )
    }

return (
    <div className= "profile-overlay" onClick = { onClose } >
        <div className="profile-modal" onClick = { e => e.stopPropagation() } >
            <button className="profile-close" onClick = { onClose } >✕</button>

                < header className = "profile-header" >
                    <div className="profile-avatar" >🏴‍☠️</div>
                        < h2 > Hồ sơ của con </h2>
                            < p className = "profile-rank" >⚓ { RANK_LABELS[currentRank] } · Cấp { level } · 💎 { gems } </p>
                                </header>

{/* TỔNG QUAN */ }
<div className="profile-global-stats" >
    <div className="p-stat-box" >
        <span className="p-stat-label" > Đã trả lời </span>
            < strong > { globalStats.totalAnswered } câu </strong>
                </div>
                < div className = "p-stat-box" >
                    <span className="p-stat-label" > Trả lời đúng </span>
                        < strong className = "text-green" > { globalStats.totalCorrect } câu({ accuracy } %) </strong>
                            </div>
                            </div>

                            < div className = "profile-meta" >
                                <span>📅 Lần cuối học: <b>{ state.lastActiveDate } < /b></span >
                                    <span>🏝️ Chơi nhiều nhất: <b>{ mostPlayedIsland } < /b></span >
                                        </div>

{/* NHẬN XÉT */ }
<div className="profile-evaluation" >
    {
        evaluation.message ? (
            <p className= "p-msg" > { evaluation.message } </p>
                    ) : (
                <>
                {
                    evaluation.best && (
                        <div className="p-comment best">
                            <strong>🌟 Kỹ năng tốt nhất: { SKILL_INFO[evaluation.best.id].label }({ evaluation.best.percent } %) </strong>
                                < p > Con đang làm rất tốt ở mảng này, hãy tiếp tục phát huy nhé!</ p >
                </div>
            )}
{
    evaluation.worst ? (
        <div className= "p-comment worst" >
        <strong>💪 Cần cải thiện: { SKILL_INFO[evaluation.worst.id].label } ({ evaluation.worst.percent } %) </strong>
            <p>
                                        Con làm tốt nhất ở phần { SKILL_INFO[evaluation.best?.id || 'math'].label }, nhưng phần này vẫn cần luyện thêm. 
                                        { getLowestSubSkill(evaluation.worst.id) && ` Đặc biệt là dạng "${getLowestSubSkill(evaluation.worst.id)?.name}".` }
    </p>
        </div>
                            ) : (
        <div className= "p-comment best" >
        <strong>🌟 Con đều giỏi cả 6 kỹ năng! Tuyệt vời! </strong>
            < p > Hãy tiếp tục duy trì phong độ này nhé! </p>
                </div>
                            )
}
</>
                    )}
</div>

{/* BIỂU ĐỒ KỸ NĂNG */ }
<h3 className="profile-chart-title" >📊 Biểu đồ kỹ năng chi tiết </h3>
    < div className = "profile-chart" >
        {(Object.keys(SKILL_INFO) as SkillId[]).map(skillId => {
            const stat = skillStats[skillId]
            const percent = stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0

            // Lấy các sub-skills của skill này
            const subs = (Object.keys(SUB_SKILL_LABELS) as Array<keyof typeof SUB_SKILL_LABELS>)
                .filter(key => getSkillFromSubSkill(key) === skillId)

            return (
                <div key= { skillId } className = "p-skill-group" >
                    <div className="p-skill-header" >
                        <span className="p-skill-icon" > { SKILL_INFO[skillId].icon } </span>
                            < span className = "p-skill-name" > { SKILL_INFO[skillId].label } </span>
                                < span className = "p-skill-percent" > { stat.answered > 0 ? `${percent}% (${stat.answered} câu)` : 'Chưa chơi' } </span>
                                    </div>
            { stat.answered >= PROFILE_MIN_QUESTIONS && renderBar(stat.correct, stat.answered) }

            <div className="p-sub-skills" >
            {
                subs.map(subKey => {
                    const subStat = subSkillStats[subKey]
                    if (subStat.answered === 0) return null // Ẩn dạng con nếu chưa chơi
                    const subPercent = Math.round((subStat.correct / subStat.answered) * 100)

                    return (
                        <div key= { subKey } className = "p-sub-skill-row" >
                            <span className="p-sub-name" > -{ SUB_SKILL_LABELS[subKey]} </span>
                                < div className = "p-sub-bar-wrapper" >
                                { renderBar(subStat.correct, subStat.answered)
            }
                </div>
                < span className = "p-sub-percent" > { subPercent } % </span>
                    </div>
                                        )
                                    })}
</div>
    </div>
                        )
                    })}
</div>

{/* NÚT RESET */ }
<div className="profile-footer" >
    <button className="btn-reset" onClick = { handleReset } >
                        🔄 Chơi lại từ đầu
    </button>
    </div>
    </div>
    </div>
    )
}