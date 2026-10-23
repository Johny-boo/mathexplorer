// ════════════════════════════════════════════════════════════
// MATH EXPLORER — TYPES
// ════════════════════════════════════════════════════════════

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type EnglishLevel = 1 | 2 | 3 | 4 | 5

export type Rank =
    | 'explorer' | 'intermediate' | 'master'
    | 'expert' | 'professor' | 'grandmaster'

export type SkillId =
    | 'math' | 'word' | 'pattern' | 'geometry' | 'thinking' | 'english'

export type SubSkillId =
    | 'math.add' | 'math.sub' | 'math.mul'
    | 'word.addsub' | 'word.muldiv' | 'word.multistep' | 'word.divideadd'
    | 'pattern.ab' | 'pattern.abc' | 'pattern.step'
    | 'pattern.mulstep' | 'pattern.increasing' | 'pattern.interleave'
    | 'pattern.geometry' | 'pattern.matrix'
    | 'geometry.identify' | 'geometry.edges' | 'geometry.count'
    | 'geometry.symmetry' | 'geometry.sticks'
    | 'thinking.pattern' | 'thinking.logic' | 'thinking.space'
    | 'thinking.riddle' | 'thinking.mixed'
    | 'english.number' | 'english.addsub' | 'english.muldiv' | 'english.word'
    | 'english.pattern' | 'english.geometry' | 'english.measure' | 'english.logic'
    | 'english.detective' | 'english.elimination'
    | 'english.algebra' | 'english.cryptarithm' | 'english.arithmetic_series'
    // 10 dạng mới P0, P1, P2
    | 'english.position' | 'english.age' | 'english.sequence'
    | 'english.day_calc' | 'english.mult_principle' | 'english.even_odd'
    | 'english.permutation' | 'english.fill_operators' | 'english.distribution' | 'english.pictograph' | 'english.fibonacci' | 'english.alternating_seq' | 'english.balance_chain' | 'english.magic_square' | 'english.coin_combination'

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

export type VocabProgress = Record<string, {
    box: 1 | 2 | 3 | 4
    lastSeen: string
    tapCount: number
    correctStreak: number
}>

export type EnglishProgress = {
    vocabProgress: VocabProgress
    levels: Record<EnglishLevel, ProgressEntry>
    recent: Record<EnglishLevel, boolean[]>
    recentNoTranslate: Record<EnglishLevel, boolean[]>
    mockTestPassed: Record<EnglishLevel, boolean>
}

export type GlobalStats = {
    totalAnswered: number
    totalCorrect: number
}

export type RankProgress = Record<Difficulty, number>

export type CelebratedStarsMap = Partial<Record<string, 0 | 1 | 2 | 3 | 4 | 5>>

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
    celebratedStars: CelebratedStarsMap
}

export type ActivityBaseProps = {
    onBack: () => void
    onScoreChange?: (points: number) => void
    onCorrectAnswer?: (difficulty: Difficulty, subSkill?: SubSkillId) => void
    startDifficulty?: Difficulty
}

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

export type BossQuestion = Question & {
    source: MissionId
}

export type EnglishTopic =
    | 'number' | 'addsub' | 'muldiv' | 'word'
    | 'pattern' | 'geometry' | 'measure' | 'logic'
    | 'detective' | 'elimination' | 'algebra' | 'cryptarithm'
    | 'arithmetic_series'
    // 10 dạng mới
    | 'position' | 'age' | 'sequence'
    | 'day_calc' | 'mult_principle' | 'even_odd'
    | 'permutation' | 'fill_operators' | 'distribution' | 'pictograph'
    | 'fibonacci' | 'alternating_seq' | 'balance_chain' | 'magic_square' | 'coin_combination'

export type QuestionVisual =
    | { type: 'clock'; hour: number; minute: 0 | 30 }
    | { type: 'emoji'; text: string }
    | {
        type: 'balance';
        leftWeight: number;
        rightWeight: number;
        mysteryWeight: number;
        itemEmoji: string;
        itemWeight: number;
        numLeft: number;
        numRight: number;
    }
    | { type: 'equation'; lines: string[]; targetEmoji: string }
    | { type: 'pictograph'; data: { name: string; count: number }[]; icon: string; multiplier: number }
    | { type: 'thermometer'; temp: number }
    | { type: 'peopleLine'; letters: string[]; swap1: number; swap2: number }
    | { type: 'calendar'; monthName: string; startDay: number; daysInMonth: number; eventDay: number }
    | { type: 'lines'; shape: 'paper_plane' | 'star' }
    | { type: 'line_segments'; dots: number }
    | { type: 'count_squares'; rows: number; cols: number }
    | { type: 'count_circles'; count: number }
    | { type: 'composite_triangles' }
    | { type: 'symmetry'; shapeName: string }
    | { type: 'iso_blocks'; layout: number[][] }
    | { type: 'route_path'; rows: number; cols: number }

export type EnglishQuestion = Question & {
    level: EnglishLevel
    topic: EnglishTopic
    audioText: string
    promptVi: string
    vocab: string[]
    explanationVi: string[]
    visual?: QuestionVisual
}

export type AnswerMeta = {
    usedAudio: boolean
    usedTranslate: boolean
    wordsTapped: string[]
    timeSpent: number
}

// Cấu trúc mới
export type SectionType = 'vietnamese' | 'english' | 'thinking'

export type ModuleId =
    | 'viet_number' | 'viet_word' | 'viet_pattern' | 'viet_geometry' | 'viet_measure' | 'viet_arena'
    | 'eng_level1' | 'eng_level2' | 'eng_level3' | 'eng_level4' | 'eng_level5' | 'eng_mocktest'
    | 'think_algorithmic' | 'think_computational' | 'think_automation' | 'think_logical' | 'think_spatial' | 'think_pattern'