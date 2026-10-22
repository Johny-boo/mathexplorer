import type { GlobalState, ModuleId, SectionType, EnglishLevel } from './types'
import { SECTION_MODULES } from './constants'
import { getEffectiveXp } from './starSystem'

// Map module → mission id (4 module Toán Việt đầu tiên)
export const MODULE_TO_MISSION_ID: Partial<Record<ModuleId, 1 | 2 | 3 | 4>> = {
    viet_number: 1,
    viet_word: 2,
    viet_pattern: 3,
    viet_geometry: 4,
}

// Map module → English level
export const MODULE_TO_ENG_LEVEL: Partial<Record<ModuleId, EnglishLevel>> = {
    eng_level1: 1,
    eng_level2: 2,
    eng_level3: 3,
    eng_level4: 4,
    eng_level5: 5,
}

/** Tính % hoàn thành của 1 module (0-100) */
export function getModulePercent(moduleId: ModuleId, state: GlobalState): number {
    const mid = MODULE_TO_MISSION_ID[moduleId]
    if (mid) {
        const eff = getEffectiveXp(state.missionProgress[mid])
        return Math.min(100, Math.round((eff / 1100) * 100))
    }
    const eng = MODULE_TO_ENG_LEVEL[moduleId]
    if (eng) {
        const eff = getEffectiveXp(state.englishProgress.levels[eng])
        return Math.min(100, Math.round((eff / 1100) * 100))
    }
    if (moduleId === 'viet_arena') {
        return Math.min(100, Math.round((state.bossWins / 5) * 100))
    }
    return 0
}

/** Tính % hoàn thành trung bình của 1 section (0-100) */
export function getSectionPercent(section: SectionType, state: GlobalState): number {
    const mods = SECTION_MODULES[section]
    if (mods.length === 0) return 0
    const total = mods.reduce((s, m) => s + getModulePercent(m, state), 0)
    return Math.round(total / mods.length)
}