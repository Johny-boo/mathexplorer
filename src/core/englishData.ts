export type Person = { en: string; vi: string; gender: 'm' | 'f' }
export const PEOPLE: Person[] = [
    { en: 'Tom', vi: 'Tom', gender: 'm' },
    { en: 'Ben', vi: 'Ben', gender: 'm' },
    { en: 'Sam', vi: 'Sam', gender: 'm' },
    { en: 'Anna', vi: 'Anna', gender: 'f' },
    { en: 'Lisa', vi: 'Lisa', gender: 'f' },
    { en: 'Mia', vi: 'Mia', gender: 'f' },
]

export type Item = { id: string; sg: string; pl: string; viNoun: string; emoji: string }
export const ITEMS: Item[] = [
    { id: 'apple', sg: 'apple', pl: 'apples', viNoun: 'quả táo', emoji: '🍎' },
    { id: 'pen', sg: 'pen', pl: 'pens', viNoun: 'cái bút', emoji: '🖊️' },
    { id: 'book', sg: 'book', pl: 'books', viNoun: 'quyển sách', emoji: '📕' },
    { id: 'candy', sg: 'candy', pl: 'candies', viNoun: 'viên kẹo', emoji: '🍬' },
    { id: 'sticker', sg: 'sticker', pl: 'stickers', viNoun: 'hình dán', emoji: '🌟' },
    { id: 'ball', sg: 'ball', pl: 'balls', viNoun: 'quả bóng', emoji: '⚽' },
    { id: 'box', sg: 'box', pl: 'boxes', viNoun: 'cái hộp', emoji: '📦' },
    { id: 'hat', sg: 'hat', pl: 'hats', viNoun: 'cái mũ', emoji: '🧢' },
]

export const noun = (n: number, item: Item) => `${n} ${n === 1 ? item.sg : item.pl}`
export const pronoun = (p: Person) => (p.gender === 'm' ? { subj: 'He', obj: 'him' } : { subj: 'She', obj: 'her' })