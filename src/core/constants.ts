import type {
    Difficulty, Rank, SkillId, SubSkillId, MissionProgressMap,
    ThinkingProgress, EnglishProgress, SkillStats, SubSkillStats,
    GlobalState, ProgressEntry, RankProgress, EnglishLevel, EnglishTopic
} from './types'

// --- XP & SAO CHUNG ---
export const XP_PER_CORRECT = 10
export const QUESTION_CAP: Record<Difficulty, number> = { easy: 15, medium: 20, hard: 40, expert: 35 }
export const XP_CAP: Record<Difficulty, number> = { easy: 150, medium: 200, hard: 400, expert: 350 }
export const STAR_THRESHOLDS: number[] = [150, 350, 500, 750, 1100]

// --- BOSS ---
export const BOSS_QUESTION_COUNT = 10
export const BOSS_PASS_XP = 80
export const BOSS_MAX_STARS = 5
export const BOSS_MIN_AVERAGE_STARS = 3
export const BOSS_HARD_RATIO = 0.7
export const BOSS_EXPERT_RATIO = 0.3

// --- THỜI GIAN CÁC ĐẢO ---
export const MATH_TIME_BY_TIER = { 1: 10, 2: 13, 3: 15, 4: 18 } as const
export const MATH_TIER_TO_DIFFICULTY = { 1: 'easy', 2: 'medium', 3: 'hard', 4: 'expert' } as const
export const WORD_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 30, medium: 30, hard: 45, expert: 60 }
export const PATTERN_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 15, medium: 20, hard: 30, expert: 45 }
export const GEOMETRY_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 15, medium: 20, hard: 30, expert: 45 }
export const THINKING_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 20, medium: 30, hard: 40, expert: 55 }

// --- TIẾNG ANH ---
export const ENGLISH_TIME_BY_LEVEL: Record<EnglishLevel, number> = { 1: 30, 2: 40, 3: 50, 4: 60, 5: 75 }
export const ENGLISH_LEVEL_TO_DIFFICULTY: Record<EnglishLevel, Difficulty> = { 1: 'easy', 2: 'medium', 3: 'hard', 4: 'hard', 5: 'expert' }
export const ENGLISH_STAR_THRESHOLDS = [100, 200, 300, 400, 500]
export const ENGLISH_SESSION_SIZE = 10
export const MOCK_TEST_SIZE = 10

export const ENGLISH_TOPIC_BADGE: Record<EnglishTopic, string> = {
    number: '🔢 Số', addsub: '➕ Cộng trừ', muldiv: '✖️ Nhân chia', word: '📖 Lời văn',
    pattern: '🔍 Quy luật', geometry: '📐 Hình học', measure: '⏰ Đo lường', logic: '🧩 Logic',
}

// --- CÁC HẰNG SỐ KHÁC ---
export const THINKING_LESSONS_TOTAL = 15
export const THINKING_TOPICS_TOTAL = 5
export const THINKING_LESSON_MIN_PER_TOPIC = 3
export const PROFILE_MIN_QUESTIONS = 10
export const PROFILE_IMPROVE_THRESHOLD = 60
export const PROFILE_PRACTICE_THRESHOLD = 70
export const STORAGE_VERSION = 'v6'
export const INITIAL_GEMS = 3
export const TOTAL_STARS_MAX = 75

// --- NHÃN HIỂN THỊ ---
export const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Nâng cao', expert: 'Siêu khó' }
export const RANK_LABELS: Record<Rank, string> = { explorer: 'Nhà thám hiểm', intermediate: 'Hạng Trung', master: 'Cao thủ', expert: 'Chuyên gia', professor: 'Giáo sư', grandmaster: 'Bậc thầy' }
export const SKILL_INFO: Record<SkillId, { icon: string; label: string }> = {
    math: { icon: '🧮', label: 'Toán số học' }, word: { icon: '📖', label: 'Lời văn' },
    pattern: { icon: '🔍', label: 'Quy luật' }, geometry: { icon: '📐', label: 'Hình học' },
    thinking: { icon: '🧠', label: 'Toán tư duy' }, english: { icon: '🇬🇧', label: 'Toán tiếng Anh' }
}

export const SUB_SKILL_LABELS: Record<SubSkillId, string> = {
    'math.add': 'Cộng', 'math.sub': 'Trừ', 'math.mul': 'Nhân',
    'word.addsub': 'Cộng trừ đơn', 'word.muldiv': 'Nhân chia', 'word.multistep': 'Đa bước', 'word.divideadd': 'Chia đều + thêm',
    'pattern.ab': 'Lặp AB', 'pattern.abc': 'Lặp ABC', 'pattern.step': 'Cộng/trừ đều', 'pattern.mulstep': 'Nhân/chia đều', 'pattern.increasing': 'Tăng dần', 'pattern.interleave': 'Xen kẽ', 'pattern.geometry': 'Quy luật hình học',
    'geometry.identify': 'Nhận diện hình', 'geometry.edges': 'Đếm cạnh/đỉnh', 'geometry.count': 'Đếm hình', 'geometry.symmetry': 'Đối xứng', 'geometry.sticks': 'Que tính',
    'thinking.pattern': 'Quy luật & dãy số', 'thinking.logic': 'Logic & suy luận', 'thinking.space': 'Hình học không gian', 'thinking.riddle': 'Bài toán đố', 'thinking.mixed': 'Tổng hợp',
    'english.number': 'Số & Đọc số', 'english.addsub': 'Cộng & Trừ', 'english.muldiv': 'Nhân & Chia', 'english.word': 'Bài toán có lời văn', 'english.pattern': 'Quy luật', 'english.geometry': 'Hình học', 'english.measure': 'Đo lường & Thời gian', 'english.logic': 'Logic & Dữ liệu'
}


// --- HÀM HELPER ---
export function getSkillFromSubSkill(subSkill: SubSkillId): SkillId {
    return subSkill.split('.')[0] as SkillId
}

export function englishSubSkill(topic: EnglishTopic): SubSkillId {
    return `english.${topic}` as SubSkillId
}

// --- FACTORY FUNCTIONS (TẠO STATE MẶC ĐỊNH) ---
export function createProgressEntry(): ProgressEntry {
    return { xp: 0, xpByDifficulty: { easy: 0, medium: 0, hard: 0, expert: 0 }, highestDifficulty: 'easy' }
}

export function createDefaultMissionProgress(): MissionProgressMap {
    return { 1: createProgressEntry(), 2: createProgressEntry(), 3: createProgressEntry(), 4: createProgressEntry() }
}

export function createDefaultThinkingProgress(): ThinkingProgress {
    return {
        lessonsCompleted: [],
        topics: { pattern: createProgressEntry(), logic: createProgressEntry(), space: createProgressEntry(), riddle: createProgressEntry(), mixed: createProgressEntry() }
    }
}

export function createDefaultEnglishProgress(): EnglishProgress {
    return {
        vocabProgress: {},
        levels: { 1: createProgressEntry(), 2: createProgressEntry(), 3: createProgressEntry(), 4: createProgressEntry(), 5: createProgressEntry() },
        recent: { 1: [], 2: [], 3: [], 4: [], 5: [] },
        recentNoTranslate: { 1: [], 2: [], 3: [], 4: [], 5: [] } // MỚI
    }
}

export function createDefaultSkillStats(): SkillStats {
    return { math: { answered: 0, correct: 0 }, word: { answered: 0, correct: 0 }, pattern: { answered: 0, correct: 0 }, geometry: { answered: 0, correct: 0 }, thinking: { answered: 0, correct: 0 }, english: { answered: 0, correct: 0 } }
}

export function createDefaultSubSkillStats(): SubSkillStats {
    const s = { answered: 0, correct: 0 };
    return {
        'math.add': { ...s }, 'math.sub': { ...s }, 'math.mul': { ...s },
        'word.addsub': { ...s }, 'word.muldiv': { ...s }, 'word.multistep': { ...s }, 'word.divideadd': { ...s },
        'pattern.ab': { ...s }, 'pattern.abc': { ...s }, 'pattern.step': { ...s }, 'pattern.mulstep': { ...s }, 'pattern.increasing': { ...s }, 'pattern.interleave': { ...s }, 'pattern.geometry': { ...s },
        'geometry.identify': { ...s }, 'geometry.edges': { ...s }, 'geometry.count': { ...s }, 'geometry.symmetry': { ...s }, 'geometry.sticks': { ...s },
        'thinking.pattern': { ...s }, 'thinking.logic': { ...s }, 'thinking.space': { ...s }, 'thinking.riddle': { ...s }, 'thinking.mixed': { ...s },
        'english.number': { ...s }, 'english.addsub': { ...s }, 'english.muldiv': { ...s }, 'english.word': { ...s }, 'english.pattern': { ...s }, 'english.geometry': { ...s }, 'english.measure': { ...s }, 'english.logic': { ...s }
    }
}

export function createDefaultRankProgress(): RankProgress {
    return { easy: 0, medium: 0, hard: 0, expert: 0 }
}

export function createDefaultGlobalState(): GlobalState {
    const today = new Date().toISOString().split('T')[0]
    return {
        xp: 0, gems: INITIAL_GEMS, missionProgress: createDefaultMissionProgress(), bossWins: 0,
        thinkingProgress: createDefaultThinkingProgress(), englishProgress: createDefaultEnglishProgress(),
        skillStats: createDefaultSkillStats(), subSkillStats: createDefaultSubSkillStats(), globalStats: { totalAnswered: 0, totalCorrect: 0 },
        rankProgress: createDefaultRankProgress(), currentRank: 'explorer', lastActiveDate: today,
    }
}