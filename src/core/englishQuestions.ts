import type { EnglishLevel, EnglishTopic, EnglishQuestion } from './types'
import { ENGLISH_LEVEL_TO_DIFFICULTY, ENGLISH_SESSION_SIZE, englishSubSkill } from './constants'
import { numberToWords } from './englishNumbers'
import { numberOptions, wordOptions, timeOptions, shuffle } from './englishDistractors'
import { PEOPLE, ITEMS, noun, pronoun, Item } from './englishData'

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export function generateQuestion(level: EnglishLevel, topic: EnglishTopic): EnglishQuestion {
    const id = `L${level}-${topic}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const difficulty = ENGLISH_LEVEL_TO_DIFFICULTY[level]
    const subSkill = englishSubSkill(topic)

    let prompt = '', audioText = '', promptVi = '', answer = '', options: string[] = [], explanation: string[] = [], explanationVi: string[] = [], vocab: string[] = []
    let visual: EnglishQuestion['visual'] = undefined

    const maxNum = level === 1 ? 20 : 100

    // 1. NUMBER
    if (topic === 'number') {
        const num = level === 1 ? randInt(1, 20) : randInt(10, 100)
        const words = numberToWords(num)
        if (Math.random() > 0.5) {
            prompt = `Which number is "${words}"?`
            audioText = `Which number is ${words}?`
            promptVi = `Số nào là "${words}"?`
            answer = String(num)
            options = numberOptions(num, [num + 10, num - 10, Number(String(num).split('').reverse().join(''))], 0, maxNum)
            explanation = [`Strategy: Break the word into parts.`, `Notice the word "${words}".`, `So, "${words}" translates to ${num}.`]
            explanationVi = [`Chiến lược: Tách từ ra để phân tích.`, `Nhận xét từ "${words}".`, `Vậy "${words}" tương ứng với số ${num}.`]
        } else {
            prompt = `Which word is ${num}?`
            audioText = `Which word is ${numberToWords(num)}?`
            promptVi = `Từ nào là ${num}?`
            answer = words
            const family = [numberToWords(num === maxNum ? num - 1 : num + 1), numberToWords(num - 1 >= 0 ? num - 1 : num + 2), numberToWords(num + 10 <= maxNum ? num + 10 : num - 10)].filter(Boolean)
            options = wordOptions(answer, [answer, ...family])
            explanation = [`Strategy: Look at the place value.`, `The number ${num} has ${Math.floor(num / 10)} tens and ${num % 10} ones.`, `Therefore, it is written as "${words}".`]
            explanationVi = [`Chiến lược: Nhìn vào giá trị hàng.`, `Số ${num} có ${Math.floor(num / 10)} chục và ${num % 10} đơn vị.`, `Do đó, nó được viết là "${words}".`]
        }
        vocab.push('number')
    }

    // 2. ADDSUB
    else if (topic === 'addsub') {
        if (level === 1) {
            const isAdd = Math.random() > 0.5
            const a = randInt(5, 15), b = randInt(2, 5)
            const big = Math.max(a, b), small = Math.min(a, b)
            const ans = isAdd ? a + b : big - small
            prompt = isAdd ? `${a} plus ${b} is ___` : `${big} minus ${small} is ___`
            audioText = isAdd ? `${numberToWords(a)} plus ${numberToWords(b)} is blank` : `${numberToWords(big)} minus ${numberToWords(small)} is blank`
            promptVi = isAdd ? `${a} cộng ${b} là ___` : `${big} trừ ${small} là ___`
            answer = String(ans)
            options = numberOptions(ans, [isAdd ? big - small : a + b, ans + 1, ans - 1], 0, 20)
            explanation = [`Strategy: Count on from the bigger number.`, `Start at ${big} and ${isAdd ? 'count up' : 'count back'} ${small} steps.`, `${big} ${isAdd ? '+' : '-'} ${small} = ${ans}.`]
            explanationVi = [`Chiến lược: Đếm tiếp từ số lớn hơn.`, `Bắt đầu từ ${big} và ${isAdd ? 'đếm tới' : 'đếm lùi'} ${small} bước.`, `${big} ${isAdd ? '+' : '-'} ${small} = ${ans}.`]
        } else {
            const isAdd = Math.random() > 0.5
            if (isAdd) {
                const a = randInt(25, 65), b = randInt(15, 35)
                const ans = a + b
                prompt = `What is ${a} plus ${b}?`
                audioText = `What is ${numberToWords(a)} plus ${numberToWords(b)}?`
                promptVi = `${a} cộng ${b} bằng mấy?`
                answer = String(ans)
                const forgotCarry = (a % 10 + b % 10 >= 10) ? ans - 10 : ans - 1
                options = numberOptions(ans, [forgotCarry, a - b, ans + 10], 0, 100)
                explanation = [`Strategy: Break into tens and ones.`, `Tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10}.`, `Ones: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}.`, `Total: ${ans}.`]
                explanationVi = [`Chiến lược: Tách thành hàng chục và hàng đơn vị.`, `Hàng chục: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10}.`, `Hàng đơn vị: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}.`, `Tổng cộng: ${ans}.`]
            } else {
                const a = randInt(45, 90), b = randInt(15, 40)
                const big = Math.max(a, b), small = Math.min(a, b)
                const ans = big - small
                prompt = `${big} minus ${small} is ___`
                audioText = `${numberToWords(big)} minus ${numberToWords(small)} is blank`
                promptVi = `${big} trừ ${small} là ___`
                answer = String(ans)
                options = numberOptions(ans, [big + small, ans + 10, ans - 1], 0, 100)
                explanation = [`Strategy: Check if you need to borrow.`, `Subtract the ones, then subtract the tens.`, `The result is ${ans}.`]
                explanationVi = [`Chiến lược: Kiểm tra xem có cần mượn không.`, `Trừ hàng đơn vị trước, sau đó trừ hàng chục.`, `Kết quả là ${ans}.`]
            }
        }
    }

    // 3. MULDIV
    else if (topic === 'muldiv') {
        if (level === 1) {
            const a = randInt(2, 3), b = randInt(2, 4)
            const ans = a * b
            prompt = `${a} groups of ${b}. How many altogether?`
            audioText = `${numberToWords(a)} groups of ${numberToWords(b)}. How many altogether?`
            promptVi = `Có ${a} nhóm, mỗi nhóm ${b} cái. Hỏi có tất cả bao nhiêu?`
            answer = String(ans)
            options = numberOptions(ans, [a + b, ans + 1], 0, 12)
            explanation = [`Strategy: Multiplication is repeated addition.`, `We have ${a} groups, and each group has ${b}.`, `So, we can add: ${Array(a).fill(b).join(' + ')} = ${ans}.`]
            explanationVi = [`Chiến lược: Phép nhân là phép cộng lặp lại.`, `Chúng ta có ${a} nhóm, mỗi nhóm có ${b} cái.`, `Vậy ta có thể cộng: ${Array(a).fill(b).join(' + ')} = ${ans}.`]
        } else {
            const type = Math.random()
            if (type < 0.4) {
                const a = randInt(2, 5), b = randInt(3, 10)
                const ans = a * b
                prompt = `What is ${a} times ${b}?`
                audioText = `What is ${numberToWords(a)} times ${numberToWords(b)}?`
                promptVi = `${a} nhân ${b} bằng mấy?`
                answer = String(ans)
                options = numberOptions(ans, [a + b, ans + a, ans - b], 0, 100)
                explanation = [`Strategy: Think of your times tables.`, `If you don't remember ${a} × ${b}, try skip counting by ${a}s.`, `The answer is ${ans}.`]
                explanationVi = [`Chiến lược: Nghĩ đến bảng cửu chương.`, `Nếu chưa nhớ ${a} × ${b}, hãy thử đếm cách quãng ${a} đơn vị.`, `Đáp án là ${ans}.`]
            } else if (type < 0.7) {
                const ans = randInt(2, 10), b = randInt(2, 5)
                const a = ans * b
                prompt = `What is half of ${a}?`
                audioText = `What is half of ${numberToWords(a)}?`
                promptVi = `Một nửa của ${a} là bao nhiêu?`
                answer = String(ans)
                options = numberOptions(ans, [a, ans + 1, ans - 1], 0, 50)
                explanation = [`Strategy: "Half" means dividing by 2.`, `We need to share ${a} equally into 2 groups.`, `So, half of ${a} is ${ans}.`]
                explanationVi = [`Chiến lược: "Một nửa" nghĩa là chia cho 2.`, `Chúng ta cần chia đều ${a} thành 2 nhóm.`, `Vậy một nửa của ${a} là ${ans}.`]
            } else {
                const a = randInt(5, 15)
                const ans = a * 2
                prompt = `Double ${a} is ___`
                audioText = `Double ${numberToWords(a)} is blank`
                promptVi = `Gấp đôi ${a} là ___`
                answer = String(ans)
                options = numberOptions(ans, [a + 2, ans - 2, ans + 10], 0, 50)
                explanation = [`Strategy: "Double" means adding a number to itself.`, `${a} doubled is the same as ${a} + ${a}.`, `So, ${a} + ${a} = ${ans}.`]
                explanationVi = [`Chiến lược: "Gấp đôi" nghĩa là cộng một số với chính nó.`, `Gấp đôi ${a} cũng giống như ${a} + ${a}.`, `Vậy, ${a} + ${a} = ${ans}.`]
            }
        }
    }

    // 4. WORD
    else if (topic === 'word') {
        const p = pick(PEOPLE)
        const item = pick(ITEMS)
        const pr = pronoun(p)
        if (level === 1) {
            const a = randInt(5, 15), b = randInt(2, 5)
            prompt = `${p.en} has ${noun(a, item)}. ${pr.subj} gets ${b} more. How many now?`
            audioText = `${p.en} has ${numberToWords(a)} ${a === 1 ? item.sg : item.pl}. ${pr.subj} gets ${numberToWords(b)} more. How many now?`
            promptVi = `${p.vi} có ${a} ${item.viNoun}. ${p.gender === 'm' ? 'Cậu ấy' : 'Cô ấy'} được thêm ${b} cái. Hỏi bây giờ có bao nhiêu?`
            answer = String(a + b)
            options = numberOptions(answer, [a - b, answer + 1], 0, 20)
            explanation = [`Strategy: Look for keywords.`, `The word "gets ... more" means the total is increasing.`, `So, we use addition: ${a} + ${b} = ${a + b}.`]
            explanationVi = [`Chiến lược: Tìm từ khóa.`, `Từ "gets ... more" (được thêm) nghĩa là tổng số tăng lên.`, `Vậy ta dùng phép cộng: ${a} + ${b} = ${a + b}.`]
            vocab.push(item.id, 'plus', 'more')
        } else {
            const a = randInt(20, 60), b = randInt(5, 15)
            const isFewer = Math.random() > 0.5
            if (isFewer) {
                prompt = `${p.en} has ${noun(a, item)}. ${pr.subj} has ${b} fewer. How many does ${pr.obj} have?`
                audioText = `${p.en} has ${numberToWords(a)} ${item.pl}. ${pr.subj} has ${numberToWords(b)} fewer. How many does ${pr.obj} have?`
                promptVi = `${p.vi} có ${a} ${item.viNoun}. ${p.gender === 'm' ? 'Cậu ấy' : 'Cô ấy'} có ít hơn ${b} cái. Hỏi ${p.gender === 'm' ? 'cậu ấy' : 'cô ấy'} có bao nhiêu?`
                answer = String(a - b)
                options = numberOptions(answer, [a + b, answer + 10], 0, 100)
                explanation = [`Strategy: Look for keywords.`, `The word "fewer" means a smaller amount.`, `So, we subtract: ${a} - ${b} = ${a - b}.`]
                explanationVi = [`Chiến lược: Tìm từ khóa.`, `Từ "fewer" (ít hơn) nghĩa là số lượng nhỏ hơn.`, `Vậy ta dùng phép trừ: ${a} - ${b} = ${a - b}.`]
            } else {
                prompt = `${p.en} has ${noun(a, item)}. ${pr.subj} gets ${b} more. How many does ${pr.subj.toLowerCase()} have now?`
                audioText = `${p.en} has ${numberToWords(a)} ${item.pl}. ${pr.subj} gets ${numberToWords(b)} more. How many does ${pr.subj.toLowerCase()} have now?`
                promptVi = `${p.vi} có ${a} ${item.viNoun}. ${p.gender === 'm' ? 'Cậu ấy' : 'Cô ấy'} được thêm ${b} cái. Hỏi bây giờ có bao nhiêu?`
                answer = String(a + b)
                options = numberOptions(answer, [a - b, answer + 10], 0, 100)
                explanation = [`Strategy: Look for keywords.`, `The word "more" means we add to the original amount.`, `So, ${a} + ${b} = ${a + b}.`]
                explanationVi = [`Chiến lược: Tìm từ khóa.`, `Từ "more" (thêm) nghĩa là ta cộng thêm vào số ban đầu.`, `Vậy, ${a} + ${b} = ${a + b}.`]
            }
            vocab.push(item.id, isFewer ? 'left' : 'more')
        }
    }

    // 5. PATTERN
    else if (topic === 'pattern') {
        const isL1 = level === 1
        const start = randInt(1, isL1 ? 10 : 20)
        const step = isL1 ? randInt(1, 3) : pick([2, 3, 5, 10])
        if (!isL1 && Math.random() > 0.5) {
            const s1 = start, s2 = start + step, s3 = start + step * 2, s4 = start + step * 3
            prompt = `${s1}, ${s2}, ___, ${s4}`
            audioText = `${numberToWords(s1)}, ${numberToWords(s2)}, blank, ${numberToWords(s4)}`
            promptVi = `${s1}, ${s2}, ___, ${s4}`
            answer = String(s3)
            options = numberOptions(s3, [s3 + step, s3 - step], 0, 100)
            explanation = [`Strategy: Find the "step size".`, `Look at the first two numbers: ${s2} - ${s1} = ${step}.`, `So, the missing number is ${s2} + ${step} = ${s3}.`]
            explanationVi = [`Chiến lược: Tìm "bước nhảy".`, `Nhìn vào 2 số đầu: ${s2} - ${s1} = ${step}.`, `Vậy số còn thiếu là ${s2} + ${step} = ${s3}.`]
        } else {
            const s1 = start, s2 = start + step, s3 = start + step * 2, s4 = start + step * 3
            prompt = `${s1}, ${s2}, ${s3}, ___`
            audioText = `${numberToWords(s1)}, ${numberToWords(s2)}, ${numberToWords(s3)}, blank`
            promptVi = `${s1}, ${s2}, ${s3}, ___`
            answer = String(s4)
            options = numberOptions(s4, [s4 + step, s4 - 1, s4 + 10], 0, maxNum)
            explanation = [`Strategy: Observe the change.`, `How much do we add to get from ${s1} to ${s2}? It's ${step}.`, `To find the next number, add ${step} to ${s3}: ${s3} + ${step} = ${s4}.`]
            explanationVi = [`Chiến lược: Quan sát sự thay đổi.`, `Cần thêm bao nhiêu để từ ${s1} lên ${s2}? Đó là ${step}.`, `Để tìm số tiếp theo, cộng ${step} vào ${s3}: ${s3} + ${step} = ${s4}.`]
        }
        vocab.push('next', 'pattern')
    }

    // 6. GEOMETRY
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
            explanation = [`Strategy: Sides are the straight lines that make up the shape.`, `Think about the name.`, `A ${s.en} has exactly ${s.sides} sides.`]
            explanationVi = [`Chiến lược: Cạnh là các đường thẳng tạo nên hình.`, `Nghĩ về tên gọi.`, `Hình ${s.vi} có chính xác ${s.sides} cạnh.`]
        } else {
            prompt = `Which shape has ${s.sides} sides?`
            audioText = `Which shape has ${numberToWords(s.sides)} sides?`
            promptVi = `Hình nào có ${s.sides} cạnh?`
            answer = s.en
            options = wordOptions(answer, shapes.map(x => x.en))
            explanation = [`Strategy: Match the number of sides to the shape's name.`, `Look for the shape with ${s.sides} straight edges.`, `The ${s.en} has ${s.sides} sides.`]
            explanationVi = [`Chiến lược: Ghép số cạnh với tên hình.`, `Tìm hình có ${s.sides} cạnh thẳng.`, `Hình ${s.vi} có ${s.sides} cạnh.`]
        }
        visual = { type: 'emoji', text: s.emoji }
        vocab.push('side', 'shape', s.en)
    }

    // 7. MEASURE
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
                explanation = [`Strategy: Compare their real-life sizes.`, `Think about what you see in the real world.`, `A ${p.long} is much bigger and longer than a ${p.short}.`]
                explanationVi = [`Chiến lược: So sánh kích thước thực tế.`, `Hãy nghĩ về những gì con thấy ngoài đời thực.`, `${p.viLong} lớn và dài hơn nhiều so với ${p.viShort}.`]
            } else {
                prompt = `Which is heavier, an ${p.heavy} or an ${p.light}?`
                audioText = `Which is heavier, an ${p.heavy} or an ${p.light}?`
                promptVi = `Cái nào nặng hơn, ${p.viHeavy} hay ${p.viLight}?`
                answer = p.heavy
                options = wordOptions(answer, [p.heavy, p.light, 'cat', 'dog'])
                explanation = [`Strategy: Imagine lifting them.`, `Think about their real-life weight.`, `An ${p.heavy} is much heavier than an ${p.light}.`]
                explanationVi = [`Chiến lược: Tưởng tượng việc nhấc chúng lên.`, `Hãy nghĩ về trọng lượng thực tế của chúng.`, `${p.viHeavy} nặng hơn nhiều so với ${p.viLight}.`]
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
            explanation = [`Strategy: Read the hands on the clock.`, `The short hand tells the hour: ${hour}.`, `The long hand tells the minutes: ${minute === 0 ? '00' : '30'}.`, `So, the time is ${answer}.`]
            explanationVi = [`Chiến lược: Đọc kim trên đồng hồ.`, `Kim ngắn chỉ giờ: ${hour}.`, `Kim dài chỉ phút: ${minute === 0 ? '00' : '30'}.`, `Vậy, thời gian là ${answer}.`]
            visual = { type: 'clock', hour, minute }
            vocab.push('clock', 'time')
        }
    }

    // 8. LOGIC
    else if (topic === 'logic') {
        if (level === 1) {
            const isOdd = Math.random() > 0.5
            const evens = [2, 4, 6, 8, 10], odds = [1, 3, 5, 7, 9]
            if (isOdd) {
                const odd = pick(odds)
                const e1 = pick(evens), e2 = pick(evens.filter(x => x !== e1)), e3 = pick(evens.filter(x => x !== e1 && x !== e2))
                const arr = shuffle([odd, e1, e2, e3])
                prompt = `Which is the odd one out? ${arr.join(', ')}`
                audioText = `Which is the odd one out? ${arr.map(n => numberToWords(n)).join(', ')}`
                promptVi = `Số nào là số khác biệt? ${arr.join(', ')}`
                answer = String(odd)
                options = arr.map(String)
                explanation = [`Strategy: Look for the rule that most numbers follow.`, `Notice that ${e1}, ${e2}, and ${e3} can all be divided by 2.`, `They are EVEN. ${odd} is ODD.`, `So, ${odd} is the odd one out!`]
                explanationVi = [`Chiến lược: Tìm quy luật chung.`, `Nhận xét rằng ${e1}, ${e2}, và ${e3} đều chia hết cho 2.`, `Chúng là số CHẴN. ${odd} là số LẺ.`, `Vậy, ${odd} là số khác biệt!`]
            } else {
                const items = ['apple', 'banana', 'orange', 'pen']
                prompt = `Which is the odd one out? ${items.join(', ')}`
                audioText = `Which is the odd one out? ${items.join(', ')}`
                promptVi = `Cái nào khác biệt? ${items.join(', ')}`
                answer = 'pen'
                options = items
                explanation = [`Strategy: Group the items by category.`, `Apple, banana, and orange are fruits.`, `A pen is used for writing.`, `So, the pen is the odd one out.`]
                explanationVi = [`Chiến lược: Phân loại các đồ vật.`, `Táo, chuối và cam đều là trái cây.`, `Bút dùng để viết.`, `Vậy, cái bút là khác biệt.`]
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
                explanation = [`Strategy: Draw a mental line of their heights.`, `If ${names[0].en} > ${names[1].en}, and ${names[1].en} > ${names[2].en},`, `then ${names[0].en} must be the tallest!`]
                explanationVi = [`Chiến lược: Vẽ một đường tưởng tượng về chiều cao.`, `Nếu ${names[0].vi} > ${names[1].vi}, và ${names[1].vi} > ${names[2].vi},`, `thì ${names[0].vi} phải là người cao nhất!`]
            } else {
                prompt = `${names[0].en} is older than ${names[1].en}. ${names[1].en} is older than ${names[2].en}. Who is the youngest?`
                audioText = `${names[0].en} is older than ${names[1].en}. ${names[1].en} is older than ${names[2].en}. Who is the youngest?`
                promptVi = `${names[0].vi} lớn tuổi hơn ${names[1].vi}. ${names[1].vi} lớn tuổi hơn ${names[2].vi}. Ai nhỏ tuổi nhất?`
                answer = names[2].en
                options = names.map(n => n.en)
                explanation = [`Strategy: Find the end of the chain.`, `The oldest is ${names[0].en}.`, `The youngest is the one at the very bottom: ${names[2].en}.`]
                explanationVi = [`Chiến lược: Tìm điểm cuối của chuỗi.`, `Người lớn tuổi nhất là ${names[0].vi}.`, `Người nhỏ tuổi nhất là người đứng cuối: ${names[2].vi}.`]
            }
            vocab.push('taller', 'older', 'youngest')
        }
    }

    // 9. DETECTIVE
    else if (topic === 'detective') {
        visual = { type: 'emoji', text: '🕵️' }
        if (level === 1) {
            const isEven = Math.random() > 0.5
            const evens = [2, 4, 6, 8]
            const odds = [1, 3, 5, 7, 9]
            const target = pick(isEven ? evens : odds)
            const distractors = shuffle(isEven ? odds : evens).slice(0, 3)

            prompt = `I am an ${isEven ? 'even' : 'odd'} number between 1 and 10. Who am I?`
            audioText = `I am an ${isEven ? 'even' : 'odd'} number between ${numberToWords(1)} and ${numberToWords(10)}. Who am I?`
            promptVi = `Tôi là một số ${isEven ? 'chẵn' : 'lẻ'} từ 1 đến 10. Tôi là số mấy?`

            answer = String(target)
            options = shuffle([...distractors.map(String), answer])

            explanation = [`Strategy: Process of elimination using the clue.`, `The clue says the number must be ${isEven ? 'even' : 'odd'}.`, `Only ${target} is an ${isEven ? 'even' : 'odd'} number in the options.`]
            explanationVi = [`Chiến lược: Dùng manh mối để loại trừ.`, `Manh mối nói số đó phải là số ${isEven ? 'chẵn' : 'lẻ'}.`, `Chỉ có ${target} là số ${isEven ? 'chẵn' : 'lẻ'} trong các đáp án.`]
        } else {
            const target = randInt(12, 89)
            const tens = Math.floor(target / 10)
            const ones = target % 10
            const digitSum = tens + ones

            prompt = `I am a 2-digit number. The sum of my digits is ${digitSum}. I am between ${target - 4} and ${target + 4}. Who am I?`
            audioText = `I am a two-digit number. The sum of my digits is ${numberToWords(digitSum)}. I am between ${numberToWords(target - 4)} and ${numberToWords(target + 4)}. Who am I?`
            promptVi = `Tôi là số có 2 chữ số. Tổng các chữ số của tôi là ${digitSum}. Tôi nằm giữa ${target - 4} và ${target + 4}. Tôi là số mấy?`
            answer = String(target)
            options = numberOptions(target, [target + 10, target - 10, target + 1], 10, 100)
            explanation = [`Strategy: Use the second clue first.`, `The number is between ${target - 4} and ${target + 4}.`, `Test the first clue: ${tens} + ${ones} = ${digitSum}. Yes!`]
            explanationVi = [`Chiến lược: Dùng manh mối thứ 2 trước.`, `Số đó nằm giữa ${target - 4} và ${target + 4}.`, `Thử manh mối 1: ${tens} + ${ones} = ${digitSum}. Đúng!`]
        }
        vocab.push('odd', 'even')
    }

    // 10. ELIMINATION
    else if (topic === 'elimination') {
        visual = { type: 'emoji', text: '🎯' }
        const getItemDisplay = (item: Item) => item.emoji || item.sg

        if (level === 1) {
            const shuffledPeople = shuffle([...PEOPLE])
            const p1 = shuffledPeople[0], p2 = shuffledPeople[1]
            const shuffledItems = shuffle([...ITEMS])
            const item1 = shuffledItems[0], item2 = shuffledItems[1]

            const display1 = getItemDisplay(item1)
            const display2 = getItemDisplay(item2)

            prompt = `${p1.en} has ${display1}. ${p2.en} has ${display2}. Who has ${display1}?`
            audioText = `${p1.en} has an ${item1.sg}. ${p2.en} has a ${item2.sg}. Who has the ${item1.sg}?`
            promptVi = `${p1.vi} có ${item1.viNoun}. ${p2.vi} có ${item2.viNoun}. Ai có ${item1.viNoun}?`

            answer = p1.en
            options = shuffle([p1.en, p2.en, 'Both', 'Neither'])

            explanation = [`Strategy: Match the person to the item.`, `The text says "${p1.en} has ${display1}".`, `So, ${p1.en} is the answer.`]
            explanationVi = [`Chiến lược: Ghép người với đồ vật.`, `Đoạn văn nói "${p1.vi} có ${item1.viNoun}".`, `Vậy, ${p1.vi} là đáp án.`]
        } else {
            const shuffledPeople = shuffle([...PEOPLE]).slice(0, 4)
            const p1 = shuffledPeople[0], p2 = shuffledPeople[1], p3 = shuffledPeople[2], extraPerson = shuffledPeople[3]
            const shuffledItems = shuffle([...ITEMS]).slice(0, 3)
            const itemA = shuffledItems[0], itemB = shuffledItems[1], itemC = shuffledItems[2]

            const displayA = getItemDisplay(itemA)
            const displayB = getItemDisplay(itemB)
            const displayC = getItemDisplay(itemC)

            prompt = `${p1.en} has ${displayA}. ${p2.en} does not have ${displayB}. ${p3.en} has ${displayC}. Who has ${displayB}?`
            audioText = `${p1.en} has an ${itemA.sg}. ${p2.en} does not have a ${itemB.sg}. ${p3.en} has a ${itemC.sg}. Who has the ${itemB.sg}?`
            promptVi = `${p1.vi} có ${itemA.viNoun}. ${p2.vi} KHÔNG có ${itemB.viNoun}. ${p3.vi} có ${itemC.viNoun}. Ai có ${itemB.viNoun}?`

            answer = extraPerson.en
            options = shuffle([p1.en, p2.en, p3.en, extraPerson.en])

            explanation = [`Strategy: Process of elimination.`, `${p1.en} has ${displayA}, and ${p3.en} has ${displayC}.`, `${p2.en} does NOT have ${displayB}.`, `So, ${extraPerson.en} must have it.`]
            explanationVi = [`Chiến lược: Loại trừ.`, `${p1.vi} có ${itemA.viNoun}, và ${p3.vi} có ${itemC.viNoun}.`, `${p2.vi} KHÔNG có ${itemB.viNoun}.`, `Vậy, ${extraPerson.vi} phải là người có nó.`]
        }
        vocab.push('logic')
    }

    // 11. ALGEBRA (CẢI TIẾN: Phân bổ đều theo Level)
    else if (topic === 'algebra') {
        // Cải tiến: Tỉ lệ dạng bài tăng dần theo Level
        // L1-L2: 100% Balance (dễ hiểu trực quan)
        // L3-L4: 70% Balance + 30% Equation
        // L5: 50% Balance + 50% Equation (thử thách)
        const balanceChance = level <= 2 ? 1.0 : level <= 4 ? 0.7 : 0.5
        const isBalance = Math.random() < balanceChance

        if (isBalance) {
            const itemWeight = pick([2, 5, 10])
            const numLeft = randInt(3, 5)
            const numRight = randInt(1, numLeft - 1)
            const totalLeft = itemWeight * numLeft
            const totalRight = itemWeight * numRight
            const mystery = totalLeft - totalRight

            prompt = `The scale is balanced. What is the weight of the mystery box?`
            audioText = `The scale is balanced. What is the weight of the mystery box?`
            promptVi = `Chiếc cân đang thăng bằng. Hộp bí ẩn nặng bao nhiêu kg?`
            answer = String(mystery)
            options = numberOptions(mystery, [totalLeft + totalRight, mystery + itemWeight, mystery - 1], 1, 100)

            visual = { type: 'balance', leftWeight: totalLeft, rightWeight: totalRight, mysteryWeight: mystery, itemEmoji: '📦', itemWeight, numLeft, numRight }

            explanation = [`Strategy: A balanced scale means both sides weigh the same.`, `Left: ${numLeft} blocks × ${itemWeight}kg = ${totalLeft}kg.`, `Right: ${numRight} blocks × ${itemWeight}kg = ${totalRight}kg + mystery box.`, `So, mystery box = ${totalLeft} - ${totalRight} = ${mystery}kg.`]
            explanationVi = [`Chiến lược: Cân thăng bằng nghĩa là hai bên bằng nhau.`, `Trái: ${numLeft} quả × ${itemWeight}kg = ${totalLeft}kg.`, `Phải: ${numRight} quả × ${itemWeight}kg = ${totalRight}kg + hộp bí ẩn.`, `Vậy, hộp bí ẩn = ${totalLeft} - ${totalRight} = ${mystery}kg.`]
            vocab.push('equal', 'weight')
        } else {
            const fruits = ['🍎', '🍌', '🍇', '🍊', '🍓']
            const f1 = pick(fruits), f2 = pick(fruits.filter(f => f !== f1)), f3 = pick(fruits.filter(f => f !== f1 && f !== f2))
            const val1 = randInt(2, 5), val2 = randInt(2, 5), val3 = randInt(1, 5)
            const sum1 = val1 + val1, sum2 = val1 + val2, sum3 = val1 + val2 + val3
            const lines = [`${f1} + ${f1} = ${sum1}`, `${f1} + ${f2} = ${sum2}`, `${f1} + ${f2} + ${f3} = ${sum3}`]

            prompt = `Solve the puzzle. What is the value of ${f3}?`
            audioText = `Solve the puzzle. What is the value of the third fruit?`
            promptVi = `Giải câu đố. ${f3} có giá trị bằng bao nhiêu?`
            answer = String(val3)
            options = numberOptions(val3, [val1, val2, val3 + 1], 1, 20)
            visual = { type: 'equation', lines, targetEmoji: f3 }

            explanation = [`Strategy: Solve the easiest equation first.`, `Step 1: ${f1} + ${f1} = ${sum1}. So ${f1} = ${val1}.`, `Step 2: ${val1} + ${f2} = ${sum2}. So ${f2} = ${val2}.`, `Step 3: ${val1} + ${val2} + ${f3} = ${sum3}. So ${f3} = ${val3}.`]
            explanationVi = [`Chiến lược: Giải phương trình dễ trước.`, `Bước 1: ${f1} + ${f1} = ${sum1}. Vậy ${f1} = ${val1}.`, `Bước 2: ${val1} + ${f2} = ${sum2}. Vậy ${f2} = ${val2}.`, `Bước 3: ${val1} + ${val2} + ${f3} = ${sum3}. Vậy ${f3} = ${val3}.`]
            vocab.push('equal')
        }
    }

    return { id, level, topic, difficulty, subSkill, prompt, audioText, promptVi, options, answer, explanation, explanationVi, vocab, visual }
}

function shuffleNoAdjacent<T extends { topic: string }>(arr: T[]): T[] {
    const result = [...arr]
    for (let i = 0; i < result.length - 1; i++) {
        if (result[i].topic === result[i + 1].topic) {
            for (let j = i + 2; j < result.length; j++) {
                if (result[j].topic !== result[i].topic) {
                    const temp = result[i + 1]; result[i + 1] = result[j]; result[j] = temp; break
                }
            }
        }
    }
    return result
}

export function buildSession(level: EnglishLevel, count = ENGLISH_SESSION_SIZE): EnglishQuestion[] {
    const allTopics: EnglishTopic[] = [
        'number', 'addsub', 'muldiv', 'word', 'pattern',
        'geometry', 'measure', 'logic', 'detective', 'elimination', 'algebra'
    ]
    const shuffledTopics = shuffle([...allTopics])
    const selectedTopics: EnglishTopic[] = []
    const numDifferent = Math.min(count, allTopics.length)
    for (let i = 0; i < numDifferent; i++) selectedTopics.push(shuffledTopics[i])
    while (selectedTopics.length < count) selectedTopics.push(pick(allTopics))

    const questions: EnglishQuestion[] = []
    const seenPrompts = new Set<string>()
    for (const t of selectedTopics) {
        let q: EnglishQuestion
        let attempts = 0
        do { q = generateQuestion(level, t); attempts++ } while (seenPrompts.has(q.prompt) && attempts < 20)
        seenPrompts.add(q.prompt)
        questions.push(q)
    }
    return shuffleNoAdjacent(questions)
}