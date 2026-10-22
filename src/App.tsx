import { useState, useEffect } from 'react'
import './App.css'
import './HomeSection.css'

// Existing activities
import MathPractice from './MathPractice'
import WordProblem from './WordProblem'
import PatternCave from './PatternCave'
import GeometryMountain from './GeometryMountain'
import BossBattle from './BossBattle'
import EnglishMath from './EnglishMath'

// Sections & Pages
import HomePage from './components/HomePage'
import VietnameseMath from './sections/VietnameseMath'
import EnglishMathSection from './sections/EnglishMathSection'
import ThinkingMathSection from './sections/ThinkingMathSection'
import CelebrationModal from './components/CelebrationModal'
import Profile from './Profile'

// Core
import { useGameState } from './core/useGameState'
import { calculateStars, calculateEnglishStars } from './core/starSystem'
import { ENGLISH_LEVEL_TO_DIFFICULTY, englishSubSkill, MODULE_INFO } from './core/constants'
import { MODULE_TO_MISSION_ID, MODULE_TO_ENG_LEVEL } from './core/moduleProgress'
import type { SectionType, ModuleId, EnglishLevel } from './core/types'

type CelebrationItem = { moduleId: ModuleId; stars: number; title: string }

export default function App() {
    const {
        state,
        handleCorrectAnswer,
        handleWrongAnswer,
        resetGame,
        handleBossWin,
        handleEnglishAnswer,
        handleVocabTap,
        handleMockTestPass,
        handleCelebrateStar,
    } = useGameState()

    const [activeSection, setActiveSection] = useState<SectionType | null>(null)
    const [activeActivity, setActiveActivity] = useState<ModuleId | null>(null)
    const [showProfile, setShowProfile] = useState(false)
    const [celebrationQueue, setCelebrationQueue] = useState<CelebrationItem[]>([])

    function checkCelebrations() {
        const toCelebrate: CelebrationItem[] = []

        // Vietnamese modules
        for (const [modId, missionId] of Object.entries(MODULE_TO_MISSION_ID)) {
            const current = calculateStars(state.missionProgress[missionId as 1 | 2 | 3 | 4])
            const celebrated = state.celebratedStars[modId as ModuleId] || 0
            if (current > celebrated) {
                toCelebrate.push({
                    moduleId: modId as ModuleId,
                    stars: current,
                    title: MODULE_INFO[modId as ModuleId].title,
                })
            }
        }

        // Boss arena
        const bossStars = Math.min(5, state.bossWins)
        const bossCelebrated = state.celebratedStars['viet_arena'] || 0
        if (bossStars > bossCelebrated) {
            toCelebrate.push({ moduleId: 'viet_arena', stars: bossStars, title: 'Đấu trường' })
        }

        // English levels
        for (const [modId, lvl] of Object.entries(MODULE_TO_ENG_LEVEL)) {
            const current = calculateEnglishStars(state.englishProgress.levels[lvl as EnglishLevel])
            const celebrated = state.celebratedStars[modId as ModuleId] || 0
            if (current > celebrated) {
                toCelebrate.push({
                    moduleId: modId as ModuleId,
                    stars: current,
                    title: MODULE_INFO[modId as ModuleId].title,
                })
            }
        }

        if (toCelebrate.length > 0) setCelebrationQueue(toCelebrate)
    }

    useEffect(() => {
        if (celebrationQueue.length === 0) return
        const first = celebrationQueue[0]
        if (first.stars >= 1 && first.stars <= 5) {
            handleCelebrateStar(first.moduleId, first.stars as 1 | 2 | 3 | 4 | 5)
        }
    }, [celebrationQueue, handleCelebrateStar])

    function closeCelebration() {
        setCelebrationQueue(prev => prev.slice(1))
    }

    function backToSection() {
        setActiveActivity(null)
        checkCelebrations()
    }

    function backToHome() {
        setActiveActivity(null)
        setActiveSection(null)
        checkCelebrations()
    }

    // ============ CELEBRATION MODAL ============
    if (celebrationQueue.length > 0) {
        const cur = celebrationQueue[0]
        return <CelebrationModal starCount={cur.stars} moduleTitle={cur.title} onClose={closeCelebration} />
    }

    // ============ ACTIVITY RENDERS ============
    if (activeActivity === 'viet_number') {
        return <MathPractice onBack={backToSection} onCorrect={(d, s) => handleCorrectAnswer(1, d, s)} onWrong={handleWrongAnswer} />
    }
    if (activeActivity === 'viet_word') {
        return <WordProblem onBack={backToSection} onCorrect={(d, s) => handleCorrectAnswer(2, d, s)} onWrong={handleWrongAnswer} />
    }
    if (activeActivity === 'viet_pattern') {
        return <PatternCave onBack={backToSection} onCorrect={(d, s) => handleCorrectAnswer(3, d, s)} onWrong={handleWrongAnswer} />
    }
    if (activeActivity === 'viet_geometry') {
        return <GeometryMountain onBack={backToSection} onCorrect={(d, s) => handleCorrectAnswer(4, d, s)} onWrong={handleWrongAnswer} />
    }
    if (activeActivity === 'viet_arena') {
        return (
            <BossBattle
                onBack={backToSection}
                onWin={handleBossWin}
                onLose={() => { }}
                onCorrect={(d, s) => handleCorrectAnswer(null, d, s)}
                onWrong={handleWrongAnswer}
            />
        )
    }

    const englishLevelModules: Record<string, EnglishLevel> = {
        eng_level1: 1, eng_level2: 2, eng_level3: 3, eng_level4: 4, eng_level5: 5,
    }
    if (activeActivity && englishLevelModules[activeActivity] !== undefined) {
        const lvl = englishLevelModules[activeActivity]
        return (
            <EnglishMath
                onBack={backToSection}
                progress={state.englishProgress}
                autoStartLevel={lvl}
                onAnswer={(r) => {
                    const diff = ENGLISH_LEVEL_TO_DIFFICULTY[r.level]
                    if (r.correct) {
                        handleEnglishAnswer(r.level, diff, r.topic, true, {
                            usedAudio: r.usedAudio, usedTranslate: r.usedTranslate, wordsTapped: [], timeSpent: r.timeSpent,
                        }, r.vocabIds)
                    } else {
                        handleWrongAnswer(diff, englishSubSkill(r.topic))
                    }
                }}
                onVocabTap={(id) => handleVocabTap(id)}
                onMockTestPass={(lvl2) => handleMockTestPass(lvl2)}
            />
        )
    }
    if (activeActivity === 'eng_mocktest') {
        return (
            <EnglishMath
                onBack={backToSection}
                progress={state.englishProgress}
                onAnswer={(r) => {
                    const diff = ENGLISH_LEVEL_TO_DIFFICULTY[r.level]
                    if (r.correct) {
                        handleEnglishAnswer(r.level, diff, r.topic, true, {
                            usedAudio: r.usedAudio, usedTranslate: r.usedTranslate, wordsTapped: [], timeSpent: r.timeSpent,
                        }, r.vocabIds)
                    } else {
                        handleWrongAnswer(diff, englishSubSkill(r.topic))
                    }
                }}
                onVocabTap={(id) => handleVocabTap(id)}
                onMockTestPass={(lvl2) => handleMockTestPass(lvl2)}
            />
        )
    }

    // ============ SECTION VIEWS ============
    if (activeSection === 'vietnamese') {
        return <VietnameseMath state={state} onBack={backToHome} onSelectModule={setActiveActivity} />
    }
    if (activeSection === 'english') {
        return <EnglishMathSection state={state} onBack={backToHome} onSelectModule={setActiveActivity} />
    }
    if (activeSection === 'thinking') {
        return <ThinkingMathSection onBack={backToHome} />
    }

    // ============ HOME PAGE ============
    return (
        <>
            <HomePage state={state} onSelectSection={setActiveSection} onOpenProfile={() => setShowProfile(true)} />
            {showProfile && (
                <Profile state={state} onClose={() => setShowProfile(false)} onReset={resetGame} />
            )}
        </>
    )
}