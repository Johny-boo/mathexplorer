import { useState, useEffect, useCallback } from 'react'
import type { GlobalState, Difficulty, SubSkillId, MissionId, EnglishLevel, EnglishTopic, AnswerMeta, Rank, ModuleId } from './types'
import { loadGlobalState, saveGlobalState, resetGlobalState } from './storage'
import { addCorrectAnswer as addStarXp } from './starSystem'
import { applyCorrectAnswer as applyRankXp } from './rankSystem'
import { getSkillFromSubSkill, XP_PER_CORRECT } from './constants'

function processCorrectAnswer(prev: GlobalState, difficulty: Difficulty, subSkill: SubSkillId): GlobalState {
    const newState = { ...prev }
    newState.gems += 1
    newState.xp += XP_PER_CORRECT
    newState.globalStats = { ...prev.globalStats, totalAnswered: prev.globalStats.totalAnswered + 1, totalCorrect: prev.globalStats.totalCorrect + 1 }

    const skillId = getSkillFromSubSkill(subSkill)
    newState.skillStats = {
        ...prev.skillStats,
        [skillId]: {
            answered: (prev.skillStats[skillId]?.answered || 0) + 1,
            correct: (prev.skillStats[skillId]?.correct || 0) + 1
        }
    }
    newState.subSkillStats = {
        ...prev.subSkillStats,
        [subSkill]: {
            answered: (prev.subSkillStats[subSkill]?.answered || 0) + 1,
            correct: (prev.subSkillStats[subSkill]?.correct || 0) + 1
        }
    }

    const { newRank, newProgress } = applyRankXp(prev.currentRank, prev.rankProgress, difficulty)
    newState.currentRank = newRank as Rank
    newState.rankProgress = newProgress
    newState.lastActiveDate = new Date().toISOString().split('T')[0]
    return newState
}

export function useGameState() {
    const [state, setState] = useState<GlobalState>(() => loadGlobalState())

    useEffect(() => { saveGlobalState(state) }, [state])

    const handleCorrectAnswer = useCallback((missionId: MissionId | null, difficulty: Difficulty, subSkill: SubSkillId) => {
        setState(prev => {
            let newState = processCorrectAnswer(prev, difficulty, subSkill)
            if (missionId && missionId >= 1 && missionId <= 4) {
                const currentMission = prev.missionProgress[missionId as 1 | 2 | 3 | 4]
                newState.missionProgress = { ...prev.missionProgress, [missionId]: addStarXp(currentMission, difficulty, XP_PER_CORRECT) }
            }
            return newState
        })
    }, [])

    const handleEnglishAnswer = useCallback((
        level: EnglishLevel,
        difficulty: Difficulty,
        topic: EnglishTopic,
        correct: boolean,
        _meta: AnswerMeta,
        vocabIds?: string[] // <-- THÊM THAM SỐ THỨ 6
    ) => {
        setState(prev => {
            if (!correct) {
                const newState = { ...prev }
                newState.globalStats = { ...prev.globalStats, totalAnswered: prev.globalStats.totalAnswered + 1 }
                const subSkill = `english.${topic}` as SubSkillId
                const skillId = 'english'
                newState.skillStats = { ...prev.skillStats, [skillId]: { ...prev.skillStats[skillId], answered: (prev.skillStats[skillId]?.answered || 0) + 1 } }
                newState.subSkillStats = { ...prev.subSkillStats, [subSkill]: { ...prev.subSkillStats[subSkill], answered: (prev.subSkillStats[subSkill]?.answered || 0) + 1 } }
                newState.lastActiveDate = new Date().toISOString().split('T')[0]
                return newState
            }

            const subSkill = `english.${topic}` as SubSkillId
            let newState = processCorrectAnswer(prev, difficulty, subSkill)
            const currentLevelProgress = prev.englishProgress.levels[level]
            newState.englishProgress = {
                ...prev.englishProgress,
                levels: { ...prev.englishProgress.levels, [level]: addStarXp(currentLevelProgress, difficulty, XP_PER_CORRECT) }
            }
            return newState
        })
    }, [])

    const handleWrongAnswer = useCallback((difficulty: Difficulty, subSkill: SubSkillId) => {
        setState(prev => {
            const newState = { ...prev }
            newState.globalStats = { ...prev.globalStats, totalAnswered: prev.globalStats.totalAnswered + 1 }
            const skillId = getSkillFromSubSkill(subSkill)
            newState.skillStats = { ...prev.skillStats, [skillId]: { ...prev.skillStats[skillId], answered: (prev.skillStats[skillId]?.answered || 0) + 1 } }
            newState.subSkillStats = { ...prev.subSkillStats, [subSkill]: { ...prev.subSkillStats[subSkill], answered: (prev.subSkillStats[subSkill]?.answered || 0) + 1 } }
            newState.lastActiveDate = new Date().toISOString().split('T')[0]
            return newState
        })
    }, [])

    const resetGame = useCallback(() => { setState(resetGlobalState()) }, [])
    const handleBossWin = useCallback(() => { setState(prev => ({ ...prev, bossWins: Math.min(5, prev.bossWins + 1) })) }, [])

    // THÊM LẠI 2 HÀM NÀY
    const handleVocabTap = useCallback((wordId: string) => {
        // Logic đơn giản để không lỗi, bạn có thể mở rộng sau
        console.log('Vocab tapped:', wordId)
    }, [])

    const handleMockTestPass = useCallback((level: EnglishLevel) => {
        setState(prev => ({
            ...prev,
            englishProgress: {
                ...prev.englishProgress,
                mockTestPassed: { ...prev.englishProgress.mockTestPassed, [level]: true }
            }
        }))
    }, [])

    const handleCelebrateStar = useCallback((moduleId: ModuleId, star: 1 | 2 | 3 | 4 | 5) => {
        setState(prev => ({
            ...prev,
            celebratedStars: { ...prev.celebratedStars, [moduleId]: star },
        }))
    }, [])

    return {
        state, handleCorrectAnswer, handleWrongAnswer, resetGame, handleBossWin,
        handleEnglishAnswer, handleVocabTap, handleMockTestPass, handleCelebrateStar
    }
}