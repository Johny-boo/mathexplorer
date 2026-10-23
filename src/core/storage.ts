import type {
    GlobalState, Rank, MissionProgressMap, ThinkingProgress,
    EnglishProgress, GlobalStats, RankProgress, CelebratedStarsMap
} from './types'
import { STORAGE_VERSION, createDefaultGlobalState, INITIAL_GEMS } from './constants'

const key = (name: string) => `mathExplorer${name}_${STORAGE_VERSION}`

// Hàm đọc số an toàn (không bị lỗi số 0 bị coi là falsy)
function safeNumber(val: string | null, defaultVal: number): number {
    if (val === null) return defaultVal
    const num = Number(val)
    return isNaN(num) ? defaultVal : num
}

export function loadGlobalState(): GlobalState {
    try {
        const defaults = createDefaultGlobalState()

        const xp = safeNumber(localStorage.getItem(key('XP')), 0)
        const gems = safeNumber(localStorage.getItem(key('Gems')), INITIAL_GEMS)
        const bossWins = safeNumber(localStorage.getItem(key('BossWins')), 0)

        const missionProgress = safeParse<MissionProgressMap>(localStorage.getItem(key('MissionProgress'))) ?? defaults.missionProgress
        const thinkingProgress = safeParse<ThinkingProgress>(localStorage.getItem(key('ThinkingProgress'))) ?? defaults.thinkingProgress
        const englishProgress = safeParse<EnglishProgress>(localStorage.getItem(key('EnglishProgress'))) ?? defaults.englishProgress

        const savedSkills = safeParse<any>(localStorage.getItem(key('SkillStats'))) || {}
        const skillStats = { ...defaults.skillStats, ...savedSkills }

        const savedSubSkills = safeParse<any>(localStorage.getItem(key('SubSkillStats'))) || {}
        const subSkillStats = { ...defaults.subSkillStats, ...savedSubSkills }

        const globalStats = safeParse<GlobalStats>(localStorage.getItem(key('GlobalStats'))) ?? defaults.globalStats
        const rankProgress = safeParse<RankProgress>(localStorage.getItem(key('RankProgress'))) ?? defaults.rankProgress
        const currentRank = (localStorage.getItem(key('Rank')) as Rank) || 'explorer'
        const lastActiveDate = localStorage.getItem(key('LastActiveDate')) || new Date().toISOString().split('T')[0]
        const celebratedStars = safeParse<CelebratedStarsMap>(localStorage.getItem(key('CelebratedStars'))) ?? {}

        return {
            xp, gems, missionProgress, bossWins, thinkingProgress, englishProgress,
            skillStats, subSkillStats, globalStats, rankProgress, currentRank, lastActiveDate,
            celebratedStars,
        }
    } catch (err) {
        console.warn('[storage] load failed, using defaults:', err)
        return createDefaultGlobalState()
    }
}

export function saveGlobalState(state: GlobalState): void {
    try {
        localStorage.setItem(key('XP'), String(state.xp))
        localStorage.setItem(key('Gems'), String(state.gems))
        localStorage.setItem(key('MissionProgress'), JSON.stringify(state.missionProgress))
        localStorage.setItem(key('BossWins'), String(state.bossWins))
        localStorage.setItem(key('ThinkingProgress'), JSON.stringify(state.thinkingProgress))
        localStorage.setItem(key('EnglishProgress'), JSON.stringify(state.englishProgress))
        localStorage.setItem(key('SkillStats'), JSON.stringify(state.skillStats))
        localStorage.setItem(key('SubSkillStats'), JSON.stringify(state.subSkillStats))
        localStorage.setItem(key('GlobalStats'), JSON.stringify(state.globalStats))
        localStorage.setItem(key('RankProgress'), JSON.stringify(state.rankProgress))
        localStorage.setItem(key('Rank'), state.currentRank)
        localStorage.setItem(key('LastActiveDate'), state.lastActiveDate)
        localStorage.setItem(key('CelebratedStars'), JSON.stringify(state.celebratedStars))   // ← thêm
    } catch (err) {
        console.warn('[storage] save failed:', err)
    }
}

export function clearAllStorage(): void {
    try {
        const toRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i)
            if (k && k.startsWith('mathExplorer')) toRemove.push(k)
        }
        toRemove.forEach(k => localStorage.removeItem(k))
    } catch (err) {
        console.warn('[storage] clear failed:', err)
    }
}

export function resetGlobalState(): GlobalState {
    clearAllStorage()
    return createDefaultGlobalState()
}

function safeParse<T>(raw: string | null): T | null {
    if (!raw) return null
    try { return JSON.parse(raw) as T } catch { return null }
}