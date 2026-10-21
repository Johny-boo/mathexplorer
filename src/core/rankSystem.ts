import type { Difficulty, Rank, RankProgress } from './types'
import { createDefaultRankProgress } from './constants'

export const NEXT_RANK: Record<Rank, Rank | null> = {
    explorer: 'intermediate',
    intermediate: 'master',
    master: 'expert',
    expert: 'professor',
    professor: 'grandmaster',
    grandmaster: null,
}

export function checkPromotion(rank: Rank, progress: RankProgress): Rank | null {
    switch (rank) {
        case 'explorer':
            if (progress.easy >= 100 || progress.medium >= 75 || progress.hard >= 50) return 'intermediate'
            return null
        case 'intermediate':
            if (progress.medium >= 150 || progress.hard >= 100) return 'master'
            return null
        case 'master':
            if (progress.hard >= 150) return 'expert'
            return null
        case 'expert':
            if (progress.hard >= 250) return 'professor'
            return null
        case 'professor':
            if (progress.hard * 4 + progress.expert * 6 >= 400) return 'grandmaster'
            return null
        case 'grandmaster':
            return null
    }
}

export function applyCorrectAnswer(
    rank: Rank,
    progress: RankProgress,
    difficulty: Difficulty
): { newRank: Rank; newProgress: RankProgress } {
    const updated: RankProgress = {
        easy: progress.easy,
        medium: progress.medium,
        hard: progress.hard,
        expert: progress.expert,
    }
    updated[difficulty] += 1

    const promoted = checkPromotion(rank, updated)
    if (promoted) {
        return { newRank: promoted, newProgress: createDefaultRankProgress() }
    }

    return { newRank: rank, newProgress: updated }
}

export function getNextRank(rank: Rank): Rank | null {
    return NEXT_RANK[rank]
}