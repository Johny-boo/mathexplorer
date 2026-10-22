import type { EnglishLevel } from '../types'
import { numberToWords } from '../englishNumbers'
import { numberOptions } from '../englishDistractors'
import type { GeneratorResult } from './types'

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

/**
 * P0.1 — Arithmetic Series (Tính tổng dãy số học)
 * Ví dụ: 1 + 3 + 5 + 7 + 9 = ?
 * Phương pháp: Ghép cặp đầu-cuối → mỗi cặp cùng tổng → nhân với số cặp.
 */
export function generateArithmeticSeries(level: EnglishLevel): GeneratorResult {
    // Scale theo level
    const cfg =
        level === 1 ? { count: randInt(4, 6), step: randInt(1, 2), startMax: 3 } :
            level === 2 ? { count: randInt(6, 8), step: randInt(1, 3), startMax: 5 } :
                level === 3 ? { count: randInt(8, 10), step: randInt(1, 5), startMax: 10 } :
                    level === 4 ? { count: randInt(10, 12), step: randInt(2, 10), startMax: 15 } :
                        { count: randInt(10, 15), step: randInt(2, 20), startMax: 20 }

    const start = randInt(1, cfg.startMax)
    const terms: number[] = Array.from({ length: cfg.count }, (_, i) => start + i * cfg.step)
    const count = cfg.count
    const first = terms[0]
    const last = terms[count - 1]
    const sum = (count * (first + last)) / 2

    // Prompt
    const seriesStr = terms.join(' + ')
    const prompt = `Find the value of ${seriesStr}.`
    const audioText = `Find the value of ${terms.map(t => numberToWords(t)).join(' plus ')}.`
    const promptVi = `Tìm giá trị của ${seriesStr}.`

    // Đáp án
    const answer = String(sum)

    // Distractors phản ánh LỖI TƯ DUY thường gặp
    const forgotDivide = count * (first + last)   // Quên chia 2
    const skippedLast = sum - last                // Bỏ sót số cuối
    const doubleFirst = sum + first               // Đếm số đầu 2 lần
    const distractors = [forgotDivide, skippedLast, doubleFirst]
        .filter(n => n !== sum && n > 0 && Number.isInteger(n))

    const options = numberOptions(sum, distractors, 0, sum * 2)

    // Giải thích: dạy phương pháp ghép cặp (KHÔNG chỉ đưa công thức)
    const pairCount = Math.floor(count / 2)
    const pairSum = first + last
    const isOdd = count % 2 === 1
    const middleTerm = isOdd ? terms[Math.floor(count / 2)] : null

    const explanation = [
        `🔍 Step 1: Let's group the numbers from the outside in.`,
        `Pair the first and last: ${first} + ${last} = ${pairSum}.`,
        isOdd
            ? `The middle number ${middleTerm} has no pair.`
            : `Continue pairing until all numbers are grouped.`,
        `🧠 Step 2: Notice that every pair adds up to the same number: ${pairSum}.`,
        `There are ${pairCount} pairs in total.`,
        `🎯 Step 3: So, the total is ${pairSum} × ${pairCount}${isOdd ? ` + ${middleTerm}` : ''} = ${sum}.`,
        `The answer is ${sum}!`
    ]

    const explanationVi = [
        `🔍 Bước 1: Con hãy ghép các số từ ngoài vào trong nhé.`,
        `Ghép số đầu và số cuối: ${first} + ${last} = ${pairSum}.`,
        isOdd
            ? `Số ở giữa ${middleTerm} sẽ đứng một mình.`
            : `Cứ ghép như vậy cho đến khi hết các số.`,
        `🧠 Bước 2: Con thấy không, cặp nào cũng có tổng bằng ${pairSum}!`,
        `Có tất cả là ${pairCount} cặp.`,
        `🎯 Bước 3: Vậy tổng sẽ là ${pairSum} × ${pairCount}${isOdd ? ` + ${middleTerm}` : ''} = ${sum}.`,
        `Đáp án là ${sum}!`
    ]

    return {
        prompt,
        audioText,
        promptVi,
        answer,
        options,
        explanation,
        explanationVi,
        vocab: []
    }
}