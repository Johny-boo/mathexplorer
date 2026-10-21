import type { EnglishLevel, EnglishTopic, EnglishQuestion } from './types'
import { ENGLISH_LEVEL_TO_DIFFICULTY, ENGLISH_SESSION_SIZE, englishSubSkill } from './constants'
import { numberToWords } from './englishNumbers'
import { numberOptions, wordOptions, timeOptions, shuffle } from './englishDistractors'
import { PEOPLE, ITEMS, noun, pronoun } from './englishData'

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export function generateQuestion(level: EnglishLevel, topic: EnglishTopic): EnglishQuestion {
    const id = `L${level}-${topic}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const difficulty = ENGLISH_LEVEL_TO_DIFFICULTY[level]
    const subSkill = englishSubSkill(topic)

    let prompt = '', audioText = '', promptVi = '', answer = '', options: string[] = [], explanation: string[] = [], explanationVi: string[] = [], vocab: string[] = []
    let visual: EnglishQuestion['visual'] = undefined

    const maxNum = level === 1 ? 20 : 100

    if (topic === 'number') {
        const num = level === 1 ? randInt(1, 20) : randInt(10, 100)
        const words = numberToWords(num)

        if (Math.random() > 0.5) {
            prompt = `Which number is "${words}"?`
            audioText = `Which number is ${words}?`
            promptVi = `Số nào là "${words}"?`
            answer = String(num)

            const extras = [num + 10, num - 10, Number(String(num).split('').reverse().join(''))]
            options = numberOptions(num, extras, 0, maxNum)

            explanation = [`"${words}" is written as ${num}.`]
            explanationVi = [`"${words}" được viết là ${num}.`]
        } else {
            prompt = `Which word is ${num}?`
            audioText = `Which word is ${numberToWords(num)}?` // FIX: Bọc numberToWords
            promptVi = `Từ nào là ${num}?`
            answer = words

            const family = [
                numberToWords(num === maxNum ? num - 1 : num + 1),
                numberToWords(num - 1 >= 0 ? num - 1 : num + 2),
                numberToWords(num + 10 <= maxNum ? num + 10 : num - 10)
            ].filter(Boolean)

            options = wordOptions(answer, [answer, ...family])
            explanation = [`The number ${num} is written as "${words}".`]
            explanationVi = [`Số ${num} được viết là "${words}".`]
        }
        vocab.push('number')
    }

    else if (topic === 'addsub') {
        if (level === 1) {
            const isAdd = Math.random() > 0.5
            const a = randInt(5, 15), b = randInt(2, 5)
            const big = Math.max(a, b), small = Math.min(a, b)
            const ans = isAdd ? a + b : big - small

            prompt = isAdd ? `${a} plus ${b} is ___` : `${big} minus ${small} is ___`
            // FIX: audioText dùng numberToWords
            audioText = isAdd
                ? `${numberToWords(a)} plus ${numberToWords(b)} is blank`
                : `${numberToWords(big)} minus ${numberToWords(small)} is blank`
            promptVi = isAdd ? `${a} cộng ${b} là ___` : `${big} trừ ${small} là ___`
            answer = String(ans)
            options = numberOptions(ans, [isAdd ? big - small : a + b, ans + 1, ans - 1], 0, 20)

            explanation = isAdd ? [`${a} plus ${b} equals ${ans}.`] : [`${big} minus ${small} equals ${ans}.`]
            explanationVi = isAdd ? [`${a} cộng ${b} bằng ${ans}.`] : [`${big} trừ ${small} bằng ${ans}.`]
        } else {
            const isAdd = Math.random() > 0.5
            if (isAdd) {
                const a = randInt(25, 65), b = randInt(15, 35)
                const ans = a + b
                prompt = `What is ${a} plus ${b}?`
                // FIX: audioText dùng numberToWords
                audioText = `What is ${numberToWords(a)} plus ${numberToWords(b)}?`
                promptVi = `${a} cộng ${b} bằng mấy?`
                answer = String(ans)

                const forgotCarry = (a % 10 + b % 10 >= 10) ? ans - 10 : ans - 1
                options = numberOptions(ans, [forgotCarry, a - b, ans + 10], 0, 100)

                explanation = [`${a} plus ${b} equals ${ans}.`]
                explanationVi = [`${a} cộng ${b} bằng ${ans}.`]
            } else {
                const a = randInt(45, 90), b = randInt(15, 40)
                const big = Math.max(a, b), small = Math.min(a, b)
                const ans = big - small
                prompt = `${big} minus ${small} is ___`
                // FIX: audioText dùng numberToWords
                audioText = `${numberToWords(big)} minus ${numberToWords(small)} is blank`
                promptVi = `${big} trừ ${small} là ___`
                answer = String(ans)
                options = numberOptions(ans, [big + small, ans + 10, ans - 1], 0, 100)
                explanation = [`${big} minus ${small} equals ${ans}.`]
                explanationVi = [`${big} trừ ${small} bằng ${ans}.`]
            }
        }
    }

    else if (topic === 'muldiv') {
        if (level === 1) {
            const a = randInt(2, 3), b = randInt(2, 4)
            const ans = a * b
            prompt = `${a} groups of ${b}. How many altogether?`
            // FIX: audioText dùng numberToWords
            audioText = `${numberToWords(a)} groups of ${numberToWords(b)}. How many altogether?`
            promptVi = `Có ${a} nhóm, mỗi nhóm ${b} cái. Hỏi có tất cả bao nhiêu?`
            answer = String(ans)
            options = numberOptions(ans, [a + b, ans + 1], 0, 12)
            explanation = [`${a} groups of ${b} equals ${ans}.`]
            explanationVi = [`${a} nhóm mỗi nhóm ${b} bằng ${ans}.`]
        } else {
            const type = Math.random()
            if (type < 0.4) {
                const a = randInt(2, 5), b = randInt(3, 10)
                const ans = a * b
                prompt = `What is ${a} times ${b}?`
                // FIX: audioText dùng numberToWords
                audioText = `What is ${numberToWords(a)} times ${numberToWords(b)}?`
                promptVi = `${a} nhân ${b} bằng mấy?`
                answer = String(ans)
                options = numberOptions(ans, [a + b, ans + a, ans - b], 0, 100)
                explanation = [`${a} times ${b} equals ${ans}.`]
                explanationVi = [`${a} nhân ${b} bằng ${ans}.`]
            } else if (type < 0.7) {
                const ans = randInt(2, 10), b = randInt(2, 5)
                const a = ans * b
                prompt = `What is half of ${a}?`
                // FIX: audioText dùng numberToWords
                audioText = `What is half of ${numberToWords(a)}?`
                promptVi = `Một nửa của ${a} là bao nhiêu?`
                answer = String(ans)
                options = numberOptions(ans, [a, ans + 1, ans - 1], 0, 50)
                explanation = [`Half of ${a} is ${ans}.`]
                explanationVi = [`Một nửa của ${a} là ${ans}.`]
            } else {
                const a = randInt(5, 15)
                const ans = a * 2
                prompt = `Double ${a} is ___`
                // FIX: audioText dùng numberToWords
                audioText = `Double ${numberToWords(a)} is blank`
                promptVi = `Gấp đôi ${a} là ___`
                answer = String(ans)
                options = numberOptions(ans, [a + 2, ans - 2, ans + 10], 0, 50)
                explanation = [`Double ${a} equals ${ans}.`]
                explanationVi = [`Gấp đôi ${a} bằng ${ans}.`]
            }
        }
    }

    else if (topic === 'word') {
        const p = pick(PEOPLE)
        const item = pick(ITEMS)
        const pr = pronoun(p)

        if (level === 1) {
            const a = randInt(5, 15), b = randInt(2, 5)
            prompt = `${p.en} has ${noun(a, item)}. ${pr.subj} gets ${b} more. How many now?`
            // FIX: audioText dùng numberToWords
            audioText = `${p.en} has ${numberToWords(a)} ${a === 1 ? item.sg : item.pl}. ${pr.subj} gets ${numberToWords(b)} more. How many now?`
            promptVi = `${p.vi} có ${a} ${item.viNoun}. ${p.gender === 'm' ? 'Cậu ấy' : 'Cô ấy'} được thêm ${b} cái. Hỏi bây giờ có bao nhiêu?`
            answer = String(a + b)
            options = numberOptions(answer, [a - b, answer + 1], 0, 20)
            explanation = [`${p.en} has ${a} and gets ${b} more, so ${a} + ${b} = ${a + b}.`]
            explanationVi = [`${p.vi} có ${a} và được thêm ${b}, vậy ${a} + ${b} = ${a + b}.`]
            vocab.push(item.id, 'plus', 'more')
        } else {
            const a = randInt(20, 60), b = randInt(5, 15)
            const isFewer = Math.random() > 0.5
            if (isFewer) {
                prompt = `${p.en} has ${noun(a, item)}. ${pr.subj} has ${b} fewer. How many does ${pr.obj} have?`
                // FIX: audioText dùng numberToWords
                audioText = `${p.en} has ${numberToWords(a)} ${item.pl}. ${pr.subj} has ${numberToWords(b)} fewer. How many does ${pr.obj} have?`
                promptVi = `${p.vi} có ${a} ${item.viNoun}. ${p.gender === 'm' ? 'Cậu ấy' : 'Cô ấy'} có ít hơn ${b} cái. Hỏi ${p.gender === 'm' ? 'cậu ấy' : 'cô ấy'} có bao nhiêu?`
                answer = String(a - b)
                options = numberOptions(answer, [a + b, answer + 10], 0, 100)
                explanation = [`${b} fewer means we subtract: ${a} - ${b} = ${a - b}.`]
                explanationVi = [`Ít hơn ${b} nghĩa là trừ đi: ${a} - ${b} = ${a - b}.`]
            } else {
                prompt = `${p.en} has ${noun(a, item)}. ${pr.subj} gets ${b} more. How many does ${pr.subj.toLowerCase()} have now?`
                // FIX: audioText dùng numberToWords
                audioText = `${p.en} has ${numberToWords(a)} ${item.pl}. ${pr.subj} gets ${numberToWords(b)} more. How many does ${pr.subj.toLowerCase()} have now?`
                promptVi = `${p.vi} có ${a} ${item.viNoun}. ${p.gender === 'm' ? 'Cậu ấy' : 'Cô ấy'} được thêm ${b} cái. Hỏi bây giờ có bao nhiêu?`
                answer = String(a + b)
                options = numberOptions(answer, [a - b, answer + 10], 0, 100)
                explanation = [`${a} plus ${b} equals ${a + b}.`]
                explanationVi = [`${a} cộng ${b} bằng ${a + b}.`]
            }
            vocab.push(item.id, isFewer ? 'left' : 'more')
        }
    }

    else if (topic === 'pattern') {
        const isL1 = level === 1
        const start = randInt(1, isL1 ? 10 : 20)
        const step = isL1 ? randInt(1, 3) : pick([2, 3, 5, 10])

        if (!isL1 && Math.random() > 0.5) {
            const s1 = start, s2 = start + step, s3 = start + step * 2, s4 = start + step * 3
            prompt = `${s1}, ${s2}, ___, ${s4}`
            // FIX: audioText dùng numberToWords
            audioText = `${numberToWords(s1)}, ${numberToWords(s2)}, blank, ${numberToWords(s4)}`
            promptVi = `${s1}, ${s2}, ___, ${s4}`
            answer = String(s3)
            options = numberOptions(s3, [s3 + step, s3 - step], 0, 100)
            explanation = [`The pattern adds ${step}. ${s2} + ${step} = ${s3}.`]
            explanationVi = [`Quy luật là cộng ${step}. ${s2} + ${step} = ${s3}.`]
        } else {
            const s1 = start, s2 = start + step, s3 = start + step * 2, s4 = start + step * 3
            prompt = `${s1}, ${s2}, ${s3}, ___`
            // FIX: audioText dùng numberToWords
            audioText = `${numberToWords(s1)}, ${numberToWords(s2)}, ${numberToWords(s3)}, blank`
            promptVi = `${s1}, ${s2}, ${s3}, ___`
            answer = String(s4)
            options = numberOptions(s4, [s4 + step, s4 - 1, s4 + 10], 0, maxNum)
            explanation = [`The pattern adds ${step}. ${s3} + ${step} = ${s4}.`]
            explanationVi = [`Quy luật là cộng ${step}. ${s3} + ${step} = ${s4}.`]
        }
        vocab.push('next', 'pattern')
    }

    else if (topic === 'geometry') {
        const shapes = [
            { en: 'triangle', vi: 'tam giác', sides: 3, emoji: '🔺' },
            { en: 'square', vi: 'vuông', sides: 4, emoji: '🟦' },
            { en: 'pentagon', vi: 'ngũ giác', sides: 5, emoji: '⬟' },
            { en: 'hexagon', vi: 'lục giác', sides: 6, emoji: '⬢' }
        ]
        const s = level === 1 ? pick(shapes.slice(0, 2)) : pick(shapes)

        if (Math.random() > 0.5) {
            prompt = `How many sides does a ${s.en} have?`
            audioText = `How many sides does a ${s.en} have?`
            promptVi = `Hình ${s.vi} có bao nhiêu cạnh?`
            answer = String(s.sides)
            options = numberOptions(s.sides, [s.sides + 1, s.sides - 1], 3, 8)
            explanation = [`A ${s.en} has ${s.sides} sides.`]
            explanationVi = [`Hình ${s.vi} có ${s.sides} cạnh.`]
        } else {
            prompt = `Which shape has ${s.sides} sides?`
            // FIX: audioText dùng numberToWords
            audioText = `Which shape has ${numberToWords(s.sides)} sides?`
            promptVi = `Hình nào có ${s.sides} cạnh?`
            answer = s.en
            options = wordOptions(answer, shapes.map(x => x.en))
            explanation = [`A ${s.en} has ${s.sides} sides.`]
            explanationVi = [`Hình ${s.vi} có ${s.sides} cạnh.`]
        }
        visual = { type: 'emoji', text: s.emoji }
        vocab.push('side', 'shape', s.en)
    }

    else if (topic === 'measure') {
        if (level === 1) {
            const pairs = [
                { long: 'bus', short: 'pencil', viLong: 'xe buýt', viShort: 'bút chì' },
                { long: 'train', short: 'ruler', viLong: 'tàu hỏa', viShort: 'thước kẻ' },
                { heavy: 'elephant', light: 'apple', viHeavy: 'con voi', viLight: 'quả táo' }
            ]
            const p = pick(pairs)
            if ('long' in p) {
                prompt = `Which is longer, a ${p.long} or a ${p.short}?`
                audioText = `Which is longer, a ${p.long} or a ${p.short}?`
                promptVi = `Cái nào dài hơn, ${p.viLong} hay ${p.viShort}?`
                answer = p.long
                options = wordOptions(answer, [p.long, p.short, 'book', 'pen'])
                explanation = [`A ${p.long} is longer than a ${p.short}.`]
                explanationVi = [`${p.viLong} dài hơn ${p.viShort}.`]
            } else {
                prompt = `Which is heavier, an ${p.heavy} or an ${p.light}?`
                audioText = `Which is heavier, an ${p.heavy} or an ${p.light}?`
                promptVi = `Cái nào nặng hơn, ${p.viHeavy} hay ${p.viLight}?`
                answer = p.heavy
                options = wordOptions(answer, [p.heavy, p.light, 'cat', 'dog'])
                explanation = [`An ${p.heavy} is heavier than an ${p.light}.`]
                explanationVi = [`${p.viHeavy} nặng hơn ${p.viLight}.`]
            }
            vocab.push('long', 'short')
        } else {
            const hour = randInt(1, 12)
            const minute = pick([0, 30])
            prompt = `What time is it?`
            audioText = `What time is it?`
            promptVi = `Bây giờ là mấy giờ?`
            answer = `${hour}:${minute === 0 ? '00' : '30'}`
            options = timeOptions(hour, minute)
            explanation = [`The clock shows ${hour}:${minute === 0 ? '00' : '30'}.`]
            explanationVi = [`Đồng hồ chỉ ${hour} giờ ${minute === 0 ? 'đúng' : 'rưỡi'}.`]
            visual = { type: 'clock', hour, minute }
            vocab.push('clock', 'time')
        }
    }

    else if (topic === 'logic') {
        if (level === 1) {
            const isOdd = Math.random() > 0.5
            const evens = [2, 4, 6, 8, 10], odds = [1, 3, 5, 7, 9]
            if (isOdd) {
                const odd = pick(odds)
                const e1 = pick(evens), e2 = pick(evens.filter(x => x !== e1)), e3 = pick(evens.filter(x => x !== e1 && x !== e2))
                const arr = shuffle([odd, e1, e2, e3])
                prompt = `Which is the odd one out? ${arr.join(', ')}`
                // FIX: audioText dùng numberToWords cho mảng
                audioText = `Which is the odd one out? ${arr.map(n => numberToWords(n)).join(', ')}`
                promptVi = `Số nào là số khác biệt? ${arr.join(', ')}`
                answer = String(odd)
                options = arr.map(String)
                explanation = [`${odd} is odd, the rest are even.`]
                explanationVi = [`${odd} là số lẻ, các số còn lại là số chẵn.`]
            } else {
                const items = ['apple', 'banana', 'orange', 'pen']
                prompt = `Which is the odd one out? ${items.join(', ')}`
                audioText = `Which is the odd one out? ${items.join(', ')}`
                promptVi = `Cái nào khác biệt? ${items.join(', ')}`
                answer = 'pen'
                options = items
                explanation = [`A pen is not a fruit.`]
                explanationVi = [`Bút không phải là trái cây.`]
            }
            vocab.push('odd')
        } else {
            const names = shuffle([...PEOPLE]).slice(0, 3)
            const isTaller = Math.random() > 0.5
            if (isTaller) {
                prompt = `${names[0].en} is taller than ${names[1].en}. ${names[1].en} is taller than ${names[2].en}. Who is the tallest?`
                audioText = `${names[0].en} is taller than ${names[1].en}. ${names[1].en} is taller than ${names[2].en}. Who is the tallest?`
                promptVi = `${names[0].vi} cao hơn ${names[1].vi}. ${names[1].vi} cao hơn ${names[2].vi}. Ai cao nhất?`
                answer = names[0].en
                options = names.map(n => n.en)
                explanation = [`${names[0].en} is taller than ${names[1].en}, and ${names[1].en} is taller than ${names[2].en}. So ${names[0].en} is the tallest.`]
                explanationVi = [`${names[0].vi} cao hơn ${names[1].vi}, và ${names[1].vi} cao hơn ${names[2].vi}. Vậy ${names[0].vi} cao nhất.`]
            } else {
                prompt = `${names[0].en} is older than ${names[1].en}. ${names[1].en} is older than ${names[2].en}. Who is the youngest?`
                audioText = `${names[0].en} is older than ${names[1].en}. ${names[1].en} is older than ${names[2].en}. Who is the youngest?`
                promptVi = `${names[0].vi} lớn tuổi hơn ${names[1].vi}. ${names[1].vi} lớn tuổi hơn ${names[2].vi}. Ai nhỏ tuổi nhất?`
                answer = names[2].en
                options = names.map(n => n.en)
                explanation = [`${names[2].en} is the youngest.`]
                explanationVi = [`${names[2].vi} nhỏ tuổi nhất.`]
            }
            vocab.push('taller', 'older', 'youngest')
        }
    }

    return { id, level, topic, difficulty, subSkill, prompt, audioText, promptVi, options, answer, explanation, explanationVi, vocab, visual }
}

function shuffleNoAdjacent<T extends { topic: string }>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = 0; i < result.length - 1; i++) {
        if (result[i].topic === result[i + 1].topic) {
            for (let j = i + 2; j < result.length; j++) {
                if (result[j].topic !== result[i].topic) {
                    [result[i + 1], result[j]] = [result[j], result[i + 1]];
                    break;
                }
            }
        }
    }
    return result;
}

export function buildSession(level: EnglishLevel, count = ENGLISH_SESSION_SIZE): EnglishQuestion[] {
    const allTopics: EnglishTopic[] = ['number', 'addsub', 'muldiv', 'word', 'pattern', 'geometry', 'measure', 'logic']

    const extra1 = pick(allTopics)
    let extra2 = pick(allTopics)
    while (extra1 === extra2) {
        extra2 = pick(allTopics)
    }

    const topics = shuffle([...allTopics, extra1, extra2])

    const questions: EnglishQuestion[] = []
    const seenPrompts = new Set<string>()

    for (const t of topics) {
        let q: EnglishQuestion
        let attempts = 0
        do {
            q = generateQuestion(level, t)
            attempts++
        } while (seenPrompts.has(q.prompt) && attempts < 20)

        seenPrompts.add(q.prompt)
        questions.push(q)
    }

    return shuffleNoAdjacent(questions)
}