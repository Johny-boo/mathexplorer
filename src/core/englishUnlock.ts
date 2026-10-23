import type { EnglishLevel, EnglishProgress } from './types'

// TẠM THỜI MỞ KHÓA TẤT CẢ CÁC LEVEL
export const MAX_PLAYABLE_LEVEL: EnglishLevel = 5

export type LevelStatus =
    | { state: 'open' }
    | { state: 'locked'; reason: string }
    | { state: 'soon' }

export function getLevelStatus(_level: EnglishLevel, _p: EnglishProgress): LevelStatus {
    // ==========================================
    // TẠM THỜI MỞ KHÓA ĐỂ TEST (Xóa dòng này khi muốn bật lại quy tắc)
    return { state: 'open' }
    // ==========================================

    /*
    // --- LOGIC QUY TẮC CŨ (BỎ COMMENT KHI MUỐN BẬT LẠI) ---
    if (level > MAX_PLAYABLE_LEVEL) return { state: 'soon' }
    if (level === 1) return { state: 'open' }

    const prev = (level - 1) as EnglishLevel
    
    // 1. Điều kiện đặc cách: Đạt >80% bài Thi thử (Mock Test) -> Mở ngay
    if (p.mockTestPassed[prev]) return { state: 'open' }

    // 2. Các điều kiện thường
    const stars = calculateEnglishStars(p.levels[prev])
    const recent = p.recent[prev] || []
    const acc = recent.length === 0 ? 0 : recent.filter(Boolean).length / recent.length

    if (stars < 3) return { state: 'locked', reason: `Đạt 3 ⭐ ở Level ${prev} để mở` }
    if (recent.length < 20 || acc < 0.8) {
        return { state: 'locked', reason: `Đúng ≥ 80% trong 20 câu gần nhất ở Level ${prev}` }
    }

    // 3. Điều kiện từ vựng
    const vocabOfPrevLevel = VOCABULARY_BANK.filter(v => v.level === prev)
    const knownVocab = vocabOfPrevLevel.filter(v => (p.vocabProgress[v.id]?.box || 1) === 4)
    const vocabAcc = vocabOfPrevLevel.length === 0 ? 1 : knownVocab.length / vocabOfPrevLevel.length
    
    if (vocabAcc < 0.85) {
        return { state: 'locked', reason: `Cần biết ≥ 85% từ vựng Level ${prev} (${knownVocab.length}/${vocabOfPrevLevel.length})` }
    }

    // 4. Điều kiện đặc biệt cho Level 5
    if (level === 5) {
        const noTransRecent = p.recentNoTranslate[4] || []
        const noTransAcc = noTransRecent.length === 0 ? 0 : noTransRecent.filter(Boolean).length / noTransRecent.length
        if (noTransRecent.length < 20 || noTransAcc < 0.7) {
            return { state: 'locked', reason: `Đúng ≥ 70% ở L4 không dùng dịch (${noTransRecent.length}/20 câu)` }
        }
    }

    return { state: 'open' }
    */
}