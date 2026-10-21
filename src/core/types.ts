// ════════════════════════════════════════════════════════════
// MATH EXPLORER — TYPES
// ════════════════════════════════════════════════════════════

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type EnglishLevel = 1 | 2 | 3 | 4 | 5

export type Rank =
    | 'explorer'
    | 'intermediate'
    | 'master'
    | 'expert'
    | 'professor'
    | 'grandmaster'

export type SkillId =
    | 'math' | 'word' | 'pattern' | 'geometry' | 'thinking' | 'english'

export type SubSkillId =
    | 'math.add' | 'math.sub' | 'math.mul'
    | 'word.addsub' | 'word.muldiv' | 'word.multistep' | 'word.divideadd'
    | 'pattern.ab' | 'pattern.abc' | 'pattern.step'
    | 'pattern.mulstep' | 'pattern.increasing' | 'pattern.interleave'
    | 'pattern.geometry'
    | 'geometry.identify' | 'geometry.edges' | 'geometry.count'
    | 'geometry.symmetry' | 'geometry.sticks'
    | 'thinking.pattern' | 'thinking.logic' | 'thinking.space'
    | 'thinking.riddle' | 'thinking.mixed'
    | 'english.number' | 'english.addsub' | 'english.muldiv' | 'english.word'
    | 'english.pattern' | 'english.geometry' | 'english.measure' | 'english.logic'

export type MissionId = 1 | 2 | 3 | 4 | 5
export type ThinkingTopic = 'pattern' | 'logic' | 'space' | 'riddle' | 'mixed'

export type ActivityType =
    | 'mathPractice' | 'wordProblem' | 'patternCave' | 'geometryMountain'
    | 'boss' | 'thinkingLesson' | 'thinkingPractice' | 'englishPractice'

export type StarCount = 0 | 1 | 2 | 3 | 4 | 5

export type ProgressEntry = {
    xp: number
    xpByDifficulty: Record<Difficulty, number>
    highestDifficulty: Difficulty
}

export type MissionProgressMap = Record<1 | 2 | 3 | 4, ProgressEntry>

export type SkillStat = {
    answered: number
    correct: number
}

export type SkillStats = Record<SkillId, SkillStat>
export type SubSkillStats = Record<SubSkillId, SkillStat>

export type ThinkingProgress = {
    lessonsCompleted: number[]
    topics: Record<ThinkingTopic, ProgressEntry>
}

// Mục 1: Thêm type VocabEntry (đã thêm)
export type VocabEntry = {
    id: string
    en: string
    vi: string
    emoji?: string
    group: 'number' | 'operation' | 'question' | 'shape' | 'logic' | 'life'
    level: EnglishLevel
    example: string
    exampleVi: string
}

// Mục 1: Khôi phục VocabProgress
export type VocabProgress = Record<string, {
    box: 1 | 2 | 3 | 4
    lastSeen: string
    tapCount: number
    correctStreak: number
}>

export type EnglishProgress = {
    vocabProgress: VocabProgress
    levels: Record<EnglishLevel, ProgressEntry>
}

export type GlobalStats = {
    totalAnswered: number
    totalCorrect: number
}

export type RankProgress = Record<Difficulty, number>

export type GlobalState = {
    xp: number
    gems: number
    missionProgress: MissionProgressMap
    bossWins: number
    thinkingProgress: ThinkingProgress
    englishProgress: EnglishProgress
    skillStats: SkillStats
    subSkillStats: SubSkillStats
    globalStats: GlobalStats
    rankProgress: RankProgress
    currentRank: Rank
    lastActiveDate: string
}

export type ActivityBaseProps = {
    onBack: () => void
    onScoreChange?: (points: number) => void
    onCorrectAnswer?: (difficulty: Difficulty, subSkill?: SubSkillId) => void
    startDifficulty?: Difficulty
}

// Mục 1: Khôi phục BossBattleProps
export type BossBattleProps = {
    onBack: () => void
    onWin: () => void
    onLose: () => void
}

export type Question = {
    id: string
    difficulty: Difficulty
    subSkill: SubSkillId
    prompt: string
    options: string[]
    answer: string
    explanation: string[]
}

// Mục 1: Khôi phục BossQuestion
export type BossQuestion = Question & {
    source: MissionId
}

export type EnglishTopic = 'number' | 'addsub' | 'muldiv' | 'word' | 'pattern' | 'geometry' | 'measure' | 'logic'

export type EnglishQuestion = Question & {
    level: EnglishLevel
    topic: EnglishTopic
    audioText: string
    promptVi: string
    vocab: string[]
    explanationVi: string[]
}

export type AnswerMeta = {
    usedAudio: boolean
    usedTranslate: boolean
    wordsTapped: string[]
    timeSpent: number
}
export type EnglishProgress = {
    vocabProgress: VocabProgress
    levels: Record<EnglishLevel, ProgressEntry>
    recent: Record<EnglishLevel, boolean[]>
    recentNoTranslate: Record<EnglishLevel, boolean[]> // MỚI
}