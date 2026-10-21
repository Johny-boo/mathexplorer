import { useState, useEffect, useCallback } from 'react'
import type { GlobalState, Difficulty, SubSkillId, MissionId, EnglishLevel, EnglishTopic, AnswerMeta, Rank, VocabProgress } from './types'
import { loadGlobalState, saveGlobalState, resetGlobalState } from './storage'
import { addCorrectAnswer as addStarXp } from './starSystem'
import { applyCorrectAnswer as applyRankXp } from './rankSystem'
import { getSkillFromSubSkill, XP_PER_CORRECT } from './constants'

function processCorrectAnswer(prev: GlobalState, difficulty: Difficulty, subSkill: SubSkillId): GlobalState {
    const newState = { ...prev }
    newState.gems += 1
    newState.xp += XP_PER_CORRECT
    newState.globalStats = {
        totalAnswered: prev.globalStats.totalAnswered + 1,
        totalCorrect: prev.globalStats.totalCorrect + 1
    }
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

    useEffect(() => {
        saveGlobalState(state)
    }, [state])

    const handleCorrectAnswer = useCallback((missionId: MissionId | null, difficulty: Difficulty, subSkill: SubSkillId) => {
        setState(prev => {
            let newState = processCorrectAnswer(prev, difficulty, subSkill)
            if (missionId && missionId >= 1 && missionId <= 4) {
                const currentMission = prev.missionProgress[missionId as 1 | 2 | 3 | 4]
                newState.missionProgress = {
                    ...prev.missionProgress,
                    [missionId]: addStarXp(currentMission, difficulty, XP_PER_CORRECT)
                }
            }
            return newState
        })
    }, [])

    // Hàm xử lý Leitner
    const updateLeitner = (prevVocab: VocabProgress, vocabIds: string[], correct: boolean, isAssisted: boolean): VocabProgress => {
        const newVocab = { ...prevVocab }
        const today = new Date().toISOString().split('T')[0]

        for (const id of vocabIds) {
            const current = newVocab[id] || { box: 1, lastSeen: today, tapCount: 0, correctStreak: 0 }
            let { box, correctStreak } = current

            if (isAssisted) {
                // Nếu dùng trợ giúp hoặc sai, reset chuỗi đúng
                correctStreak = 0
            } else if (correct) {
                correctStreak += 1
                if (correctStreak >= 3) {
                    box = Math.min(4, box + 1) as 1 | 2 | 3 | 4 // Lên hộp cao hơn
                    correctStreak = 0 // Reset chuỗi để đếm lại
                }
            } else {
                // Sai mà không trợ giúp -> reset chuỗi
                correctStreak = 0
            }

            newVocab[id] = { ...current, box, correctStreak, lastSeen: today }
        }
        return newVocab
    }

    const handleEnglishAnswer = useCallback((
        level: EnglishLevel,
        difficulty: Difficulty,
        topic: EnglishTopic,
        correct: boolean,
        meta: AnswerMeta, // Lưu ý: Cần truyền usedTranslate từ EnglishMath lên
        vocabIds: string[]
    ) => {
        setState(prev => {
            const isAssisted = meta.usedAudio || meta.usedTranslate || meta.wordsTapped.length > 0
            const newVocabProgress = updateLeitner(prev.englishProgress.vocabProgress, vocabIds, correct, isAssisted)

            if (!correct) {
                const newState = { ...prev }
                newState.globalStats = { ...prev.globalStats, totalAnswered: prev.globalStats.totalAnswered + 1 }
                const subSkill = `english.${topic}` as SubSkillId
                const skillId = 'english'
                newState.skillStats = { ...prev.skillStats, [skillId]: { ...prev.skillStats[skillId], answered: prev.skillStats[skillId].answered + 1 } }
                newState.subSkillStats = { ...prev.subSkillStats, [subSkill]: { ...prev.subSkillStats[subSkill], answered: prev.subSkillStats[subSkill].answered + 1 } }

                newState.englishProgress = {
                    ...prev.englishProgress,
                    vocabProgress: newVocabProgress,
                    recent: { ...prev.englishProgress.recent, [level]: [...(prev.englishProgress.recent[level] || []), false].slice(-20) }
                }
                return newState
            }

            const subSkill = `english.${topic}` as SubSkillId
            let newState = processCorrectAnswer(prev, difficulty, subSkill)
            const currentLevelProgress = prev.englishProgress.levels[level]

            // Cập nhật recentNoTranslate nếu không dùng Translate
            const newRecentNoTranslate = { ...prev.englishProgress.recentNoTranslate }
            if (!meta.usedTranslate) {
                newRecentNoTranslate[level] = [...(newRecentNoTranslate[level] || []), true].slice(-20)
            }

            newState.englishProgress = {
                ...prev.englishProgress,
                levels: {
                    ...prev.englishProgress.levels,
                    [level]: addStarXp(currentLevelProgress, difficulty, XP_PER_CORRECT)
                },
                vocabProgress: newVocabProgress,
                recent: { ...prev.englishProgress.recent, [level]: [...(prev.englishProgress.recent[level] || []), true].slice(-20) },
                recentNoTranslate: newRecentNoTranslate
            }
            return newState
        })
    }, [])

    // Hàm xử lý khi tap từ vựng
    const handleVocabTap = useCallback((wordId: string) => {
        setState(prev => {
            const today = new Date().toISOString().split('T')[0]
            const current = prev.englishProgress.vocabProgress[wordId] || { box: 1, lastSeen: today, tapCount: 0, correctStreak: 0 }
            const newVocab = {
                ...prev.englishProgress.vocabProgress,
                [wordId]: { ...current, tapCount: current.tapCount + 1 }
            }
            return {
                ...prev,
                englishProgress: { ...prev.englishProgress, vocabProgress: newVocab }
            }
        })
    }, [])

    const handleWrongAnswer = useCallback((difficulty: Difficulty, subSkill: SubSkillId) => {
        setState(prev => {
            const newState = { ...prev }
            newState.globalStats = { ...prev.globalStats, totalAnswered: prev.globalStats.totalAnswered + 1 }
            const skillId = getSkillFromSubSkill(subSkill)
            newState.skillStats = { ...prev.skillStats, [skillId]: { ...prev.skillStats[skillId], answered: prev.skillStats[skillId].answered + 1 } }
            newState.subSkillStats = { ...prev.subSkillStats, [subSkill]: { ...prev.subSkillStats[subSkill], answered: prev.subSkillStats[subSkill].answered + 1 } }
            newState.lastActiveDate = new Date().toISOString().split('T')[0]
            return newState
        })
    }, [])

    const resetGame = useCallback(() => { setState(resetGlobalState()) }, [])
    const handleBossWin = useCallback(() => { setState(prev => ({ ...prev, bossWins: Math.min(5, prev.bossWins + 1) })) }, [])

    return { state, handleCorrectAnswer, handleWrongAnswer, resetGame, handleBossWin, handleEnglishAnswer, handleVocabTap }
}