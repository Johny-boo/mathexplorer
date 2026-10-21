import type { Difficulty, ProgressEntry, StarCount, MissionProgressMap } from './types'
import { XP_CAP, STAR_THRESHOLDS, BOSS_MIN_AVERAGE_STARS } from './constants'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

export function getEffectiveXp(progress: ProgressEntry): number {
    const used = progress.xpByDifficulty
    let total = 0
    let leftover = 0
    for (const d of DIFFICULTIES) {
        const effCap = XP_CAP[d] + leftover
        const counted = Math.min(used[d], effCap)
        total += counted
        leftover = Math.max(0, effCap - used[d])
    }
    return total
}

export function getEffectiveXpByDifficulty(progress: ProgressEntry): Record<Difficulty, number> {
    const used = progress.xpByDifficulty
    const result: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0, expert: 0 }
    let leftover = 0
    for (const d of DIFFICULTIES) {
        const effCap = XP_CAP[d] + leftover
        const counted = Math.min(used[d], effCap)
        result[d] = counted
        leftover = Math.max(0, effCap - used[d])
    }
    return result
}

export function calculateStars(progress: ProgressEntry | undefined): StarCount {
    if (!progress) return 0
    const effectiveXp = getEffectiveXp(progress)
    let stars = 0
    for (let i = 0; i < STAR_THRESHOLDS.length; i++) {
        if (effectiveXp >= STAR_THRESHOLDS[i]) stars = i + 1
        else break
    }
    return stars as StarCount
}

// Mục 2: Tính sao riêng cho English (dùng XP thô, ngưỡng 100-200-300-400-500)
export function calculateEnglishStars(progress: ProgressEntry | undefined): StarCount {
    if (!progress) return 0
    const xp = progress.xp // Dùng raw XP thay vì effective XP
    if (xp >= 500) return 5
    if (xp >= 400) return 4
    if (xp >= 300) return 3
    if (xp >= 200) return 2
    if (xp >= 100) return 1
    return 0
}

export function getTotalNonBossStars(map: MissionProgressMap): number {
    return [1, 2, 3, 4].reduce((sum, id) => sum + calculateStars(map[id as 1 | 2 | 3 | 4]), 0)
}

export function isBossUnlocked(map: MissionProgressMap): boolean {
    return ([1, 2, 3, 4] as const).every(id => calculateStars(map[id]) >= BOSS_MIN_AVERAGE_STARS)
}

export function getCompletedCount(map: MissionProgressMap): number {
    return ([1, 2, 3, 4] as const).filter(id => calculateStars(map[id]) >= BOSS_MIN_AVERAGE_STARS).length
}

export function addCorrectAnswer(progress: ProgressEntry, difficulty: Difficulty, xpPoints: number): ProgressEntry {
    const newXpByDiff: Record<Difficulty, number> = {
        easy: progress.xpByDifficulty.easy,
        medium: progress.xpByDifficulty.medium,
        hard: progress.xpByDifficulty.hard,
        expert: progress.xpByDifficulty.expert,
    }
    newXpByDiff[difficulty] += xpPoints

    let newHighest = progress.highestDifficulty
    if (DIFFICULTIES.indexOf(difficulty) > DIFFICULTIES.indexOf(newHighest)) {
        newHighest = difficulty
    }

    return { xp: progress.xp + xpPoints, xpByDifficulty: newXpByDiff, highestDifficulty: newHighest }
}