import type {
    Difficulty, Rank, SkillId, SubSkillId, MissionProgressMap,
    ThinkingProgress, EnglishProgress, SkillStats, SubSkillStats,
    GlobalState, ProgressEntry, RankProgress, EnglishLevel, EnglishTopic
} from './types'

export const XP_PER_CORRECT = 10
export const QUESTION_CAP: Record<Difficulty, number> = { easy: 15, medium: 20, hard: 40, expert: 35 }
export const XP_CAP: Record<Difficulty, number> = { easy: 150, medium: 200, hard: 400, expert: 350 }
export const STAR_THRESHOLDS: number[] = [150, 350, 500, 750, 1100]

export const BOSS_QUESTION_COUNT = 10
export const BOSS_PASS_XP = 80
export const BOSS_MAX_STARS = 5
export const BOSS_MIN_AVERAGE_STARS = 3

export const MATH_TIME_BY_TIER = { 1: 10, 2: 13, 3: 15, 4: 18 } as const
export const MATH_TIER_TO_DIFFICULTY = { 1: 'easy', 2: 'medium', 3: 'hard', 4: 'expert' } as const
export const WORD_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 30, medium: 30, hard: 45, expert: 60 }
export const PATTERN_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 15, medium: 20, hard: 30, expert: 45 }
export const GEOMETRY_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 15, medium: 20, hard: 30, expert: 45 }
export const THINKING_TIME_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 20, medium: 30, hard: 40, expert: 55 }

export const ENGLISH_TIME_BY_LEVEL: Record<EnglishLevel, number> = { 1: 30, 2: 40, 3: 50, 4: 60, 5: 75 }
export const ENGLISH_LEVEL_TO_DIFFICULTY: Record<EnglishLevel, Difficulty> = { 1: 'easy', 2: 'medium', 3: 'hard', 4: 'hard', 5: 'expert' }
export const ENGLISH_STAR_THRESHOLDS = [100, 200, 300, 400, 500]
export const ENGLISH_SESSION_SIZE = 10

export const ENGLISH_TOPIC_BADGE: Record<EnglishTopic, string> = {
    number: '🔢 Số', addsub: '➕ Cộng trừ', muldiv: '✖️ Nhân chia', word: '📖 Lời văn',
    pattern: '🔍 Quy luật', geometry: '📐 Hình học', measure: '⏰ Đo lường', logic: '🧩 Logic',
    detective: '🕵️ Thám tử số', elimination: '🎯 Loại trừ', algebra: '⚖️ Đại số hình ảnh', cryptarithm: '🔠 Mã hóa số',
    arithmetic_series: '➕ Tổng dãy số',
    position: '📍 Xếp hàng', age: '🎂 Tuổi tác', sequence: '🔢 Dãy số',
    day_calc: '📅 Thứ/Ngày', mult_principle: '🛣️ Quy tắc nhân', even_odd: '⚖️ Chẵn lẻ',
    permutation: '🎲 Lập số', fill_operators: '✏️ Điền dấu', distribution: '🎁 Chia đều', pictograph: '📊 Biểu đồ',
    fibonacci: '🐚 Fibonacci', alternating_seq: '⏩ Dãy xen kẽ', balance_chain: '⚖️ Cân chuỗi',
    magic_square: '🔮 Ma trận', coin_combination: '🪙 Tổ hợp xu'
}

export const THINKING_LESSONS_TOTAL = 15
export const THINKING_TOPICS_TOTAL = 5
export const THINKING_LESSON_MIN_PER_TOPIC = 3
export const PROFILE_MIN_QUESTIONS = 10
export const PROFILE_IMPROVE_THRESHOLD = 60
export const PROFILE_PRACTICE_THRESHOLD = 70
export const STORAGE_VERSION = 'v7'
export const INITIAL_GEMS = 3
export const TOTAL_STARS_MAX = 75

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
    'pattern.ab': 'Lặp AB', 'pattern.abc': 'Lặp ABC', 'pattern.step': 'Cộng/trừ đều', 'pattern.mulstep': 'Nhân/chia đều', 'pattern.increasing': 'Tăng dần', 'pattern.interleave': 'Xen kẽ', 'pattern.geometry': 'Quy luật hình học', 'pattern.matrix': 'Ma trận quy luật',
    'geometry.identify': 'Nhận diện hình', 'geometry.edges': 'Đếm cạnh/đỉnh', 'geometry.count': 'Đếm hình', 'geometry.symmetry': 'Đối xứng', 'geometry.sticks': 'Que tính',
    'thinking.pattern': 'Quy luật & dãy số', 'thinking.logic': 'Logic & suy luận', 'thinking.space': 'Hình học không gian', 'thinking.riddle': 'Bài toán đố', 'thinking.mixed': 'Tổng hợp',
    'english.number': 'Số & Đọc số', 'english.addsub': 'Cộng & Trừ', 'english.muldiv': 'Nhân & Chia', 'english.word': 'Bài toán có lời văn', 'english.pattern': 'Quy luật', 'english.geometry': 'Hình học', 'english.measure': 'Đo lường & Thời gian', 'english.logic': 'Logic & Dữ liệu',
    'english.detective': 'Thám tử số', 'english.elimination': 'Loại trừ logic', 'english.algebra': 'Đại số hình ảnh', 'english.cryptarithm': 'Mã hóa số', 'english.arithmetic_series': 'Tính tổng dãy số',
    'english.position': 'Bài toán xếp hàng', 'english.age': 'Bài toán tuổi', 'english.sequence': 'Dãy số cách đều',
    'english.day_calc': 'Tính thứ/ngày', 'english.mult_principle': 'Quy tắc nhân', 'english.even_odd': 'Chẵn lẻ',
    'english.permutation': 'Lập số', 'english.fill_operators': 'Điền dấu', 'english.distribution': 'Chia đều', 'english.pictograph': 'Biểu đồ tranh',
    'english.fibonacci': 'Dãy Fibonacci',
    'english.alternating_seq': 'Dãy số xen kẽ',
    'english.balance_chain': 'Cân chuỗi logic',
    'english.magic_square': 'Ma trận số',
    'english.coin_combination': 'Tổ hợp tiền xu'
}

export function getSkillFromSubSkill(subSkill: SubSkillId): SkillId { return subSkill.split('.')[0] as SkillId }
export function englishSubSkill(topic: EnglishTopic): SubSkillId { return `english.${topic}` as SubSkillId }

export function createProgressEntry(): ProgressEntry { return { xp: 0, xpByDifficulty: { easy: 0, medium: 0, hard: 0, expert: 0 }, highestDifficulty: 'easy' } }
export function createDefaultMissionProgress(): MissionProgressMap { return { 1: createProgressEntry(), 2: createProgressEntry(), 3: createProgressEntry(), 4: createProgressEntry() } }
export function createDefaultThinkingProgress(): ThinkingProgress { return { lessonsCompleted: [], topics: { pattern: createProgressEntry(), logic: createProgressEntry(), space: createProgressEntry(), riddle: createProgressEntry(), mixed: createProgressEntry() } } }
export function createDefaultEnglishProgress(): EnglishProgress { return { vocabProgress: {}, levels: { 1: createProgressEntry(), 2: createProgressEntry(), 3: createProgressEntry(), 4: createProgressEntry(), 5: createProgressEntry() }, recent: { 1: [], 2: [], 3: [], 4: [], 5: [] }, recentNoTranslate: { 1: [], 2: [], 3: [], 4: [], 5: [] }, mockTestPassed: { 1: false, 2: false, 3: false, 4: false, 5: false } } }
export function createDefaultSkillStats(): SkillStats { return { math: { answered: 0, correct: 0 }, word: { answered: 0, correct: 0 }, pattern: { answered: 0, correct: 0 }, geometry: { answered: 0, correct: 0 }, thinking: { answered: 0, correct: 0 }, english: { answered: 0, correct: 0 } } }
export function createDefaultSubSkillStats(): SubSkillStats {
    const s = { answered: 0, correct: 0 };
    return {
        'math.add': { ...s }, 'math.sub': { ...s }, 'math.mul': { ...s },
        'word.addsub': { ...s }, 'word.muldiv': { ...s }, 'word.multistep': { ...s }, 'word.divideadd': { ...s },
        'pattern.ab': { ...s }, 'pattern.abc': { ...s }, 'pattern.step': { ...s }, 'pattern.mulstep': { ...s }, 'pattern.increasing': { ...s }, 'pattern.interleave': { ...s }, 'pattern.geometry': { ...s }, 'pattern.matrix': { ...s },
        'geometry.identify': { ...s }, 'geometry.edges': { ...s }, 'geometry.count': { ...s }, 'geometry.symmetry': { ...s }, 'geometry.sticks': { ...s },
        'thinking.pattern': { ...s }, 'thinking.logic': { ...s }, 'thinking.space': { ...s }, 'thinking.riddle': { ...s }, 'thinking.mixed': { ...s },
        'english.number': { ...s }, 'english.addsub': { ...s }, 'english.muldiv': { ...s }, 'english.word': { ...s }, 'english.pattern': { ...s }, 'english.geometry': { ...s }, 'english.measure': { ...s }, 'english.logic': { ...s },
        'english.detective': { ...s }, 'english.elimination': { ...s }, 'english.algebra': { ...s }, 'english.cryptarithm': { ...s }, 'english.arithmetic_series': { ...s },
        'english.position': { ...s }, 'english.age': { ...s }, 'english.sequence': { ...s },
        'english.day_calc': { ...s }, 'english.mult_principle': { ...s }, 'english.even_odd': { ...s },
        'english.permutation': { ...s }, 'english.fill_operators': { ...s }, 'english.distribution': { ...s }, 'english.pictograph': { ...s }, 'english.fibonacci': { ...s },
        'english.alternating_seq': { ...s },
        'english.balance_chain': { ...s },
        'english.magic_square': { ...s },
        'english.coin_combination': { ...s },
    }
}
export function createDefaultRankProgress(): RankProgress { return { easy: 0, medium: 0, hard: 0, expert: 0 } }

export function createDefaultGlobalState(): GlobalState {
    const today = new Date().toISOString().split('T')[0]
    return {
        xp: 0, gems: INITIAL_GEMS, missionProgress: createDefaultMissionProgress(), bossWins: 0,
        thinkingProgress: createDefaultThinkingProgress(), englishProgress: createDefaultEnglishProgress(),
        skillStats: createDefaultSkillStats(), subSkillStats: createDefaultSubSkillStats(), globalStats: { totalAnswered: 0, totalCorrect: 0 },
        rankProgress: createDefaultRankProgress(), currentRank: 'explorer', lastActiveDate: today, celebratedStars: {},
    }
}

// Module & Section Config
import type { SectionType, ModuleId } from './types'

export type ModuleInfo = { id: ModuleId; section: SectionType; icon: string; title: string; description: string; color: string; placeholder?: boolean }

export const MODULE_INFO: Record<ModuleId, ModuleInfo> = {
    viet_number: { id: 'viet_number', section: 'vietnamese', icon: '🔢', title: 'Số & Phép tính', description: 'Cộng, trừ, nhân, chia', color: 'from-orange-400 to-red-500' },
    viet_word: { id: 'viet_word', section: 'vietnamese', icon: '📖', title: 'Lời văn', description: 'Toán có lời văn', color: 'from-green-400 to-emerald-500' },
    viet_pattern: { id: 'viet_pattern', section: 'vietnamese', icon: '🔍', title: 'Quy luật', description: 'Tìm quy luật, dãy số', color: 'from-purple-400 to-violet-500' },
    viet_geometry: { id: 'viet_geometry', section: 'vietnamese', icon: '📐', title: 'Hình học', description: 'Hình khối, không gian', color: 'from-blue-400 to-cyan-500' },
    viet_measure: { id: 'viet_measure', section: 'vietnamese', icon: '📏', title: 'Đo lường & Thống kê', description: 'Độ dài, khối lượng, biểu đồ', color: 'from-teal-400 to-green-500', placeholder: true },
    viet_arena: { id: 'viet_arena', section: 'vietnamese', icon: '⚔️', title: 'Đấu trường', description: 'Thử thách tổng hợp', color: 'from-red-500 to-pink-600' },

    eng_level1: { id: 'eng_level1', section: 'english', icon: '🌱', title: 'Level 1 — Seeds', description: 'Số đếm cơ bản', color: 'from-lime-400 to-green-500' },
    eng_level2: { id: 'eng_level2', section: 'english', icon: '🌿', title: 'Level 2 — Sprouts', description: 'Cộng trừ đến 100', color: 'from-green-400 to-teal-500' },
    eng_level3: { id: 'eng_level3', section: 'english', icon: '🌳', title: 'Level 3 — Explorers', description: 'Nhân chia, đo lường', color: 'from-teal-400 to-cyan-500' },
    eng_level4: { id: 'eng_level4', section: 'english', icon: '🚀', title: 'Level 4 — Challengers', description: 'Bài 2 bước, logic', color: 'from-cyan-400 to-blue-500' },
    eng_level5: { id: 'eng_level5', section: 'english', icon: '🏆', title: 'Level 5 — Champions', description: 'Đề thi quốc tế', color: 'from-blue-400 to-indigo-500' },
    eng_mocktest: { id: 'eng_mocktest', section: 'english', icon: '📝', title: 'Thi thử', description: 'Mock Test 10 câu', color: 'from-indigo-400 to-purple-500' },

    think_algorithmic: { id: 'think_algorithmic', section: 'thinking', icon: '🪜', title: 'Algorithmic Thinking', description: 'Sắp xếp bước, tư duy thuật toán', color: 'from-yellow-400 to-orange-500', placeholder: true },
    think_computational: { id: 'think_computational', section: 'thinking', icon: '💻', title: 'Computational Thinking', description: 'Chia nhỏ, mẫu, trừu tượng', color: 'from-orange-400 to-red-500', placeholder: true },
    think_automation: { id: 'think_automation', section: 'thinking', icon: '🤖', title: 'Automation Thinking', description: 'Vòng lặp, điều kiện IF-THEN', color: 'from-red-400 to-pink-500', placeholder: true },
    think_logical: { id: 'think_logical', section: 'thinking', icon: '🧩', title: 'Logical Reasoning', description: 'Loại trừ, suy diễn logic', color: 'from-pink-400 to-fuchsia-500', placeholder: true },
    think_spatial: { id: 'think_spatial', section: 'thinking', icon: '🎲', title: 'Spatial Reasoning', description: 'Xoay hình, không gian 3D', color: 'from-fuchsia-400 to-purple-500', placeholder: true },
    think_pattern: { id: 'think_pattern', section: 'thinking', icon: '🔮', title: 'Pattern Recognition', description: 'Quy luật số, hình, màu', color: 'from-purple-400 to-indigo-500', placeholder: true },
}

export const SECTION_MODULES: Record<SectionType, ModuleId[]> = {
    vietnamese: ['viet_number', 'viet_word', 'viet_pattern', 'viet_geometry', 'viet_measure', 'viet_arena'],
    english: ['eng_level1', 'eng_level2', 'eng_level3', 'eng_level4', 'eng_level5', 'eng_mocktest'],
    thinking: ['think_algorithmic', 'think_computational', 'think_automation', 'think_logical', 'think_spatial', 'think_pattern'],
}

export const SECTION_INFO: Record<SectionType, { icon: string; title: string; description: string; color: string }> = {
    vietnamese: { icon: '🧮', title: 'Toán Tiếng Việt', description: 'Bám sát chương trình Bộ GD & Violympic', color: 'from-orange-500 to-red-600' },
    english: { icon: '🇬🇧', title: 'Toán Tiếng Anh', description: 'Luyện thi TIMO, CREST Olympiad', color: 'from-green-500 to-teal-600' },
    thinking: { icon: '🧠', title: 'Toán Tư Duy', description: 'Algorithmic · Computational · Automation', color: 'from-purple-500 to-indigo-600' },
}

export function getSectionFromModule(id: ModuleId): SectionType { return MODULE_INFO[id].section }