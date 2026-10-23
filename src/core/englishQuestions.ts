import type { EnglishLevel, EnglishTopic, EnglishQuestion } from './types'
import { ENGLISH_LEVEL_TO_DIFFICULTY, ENGLISH_SESSION_SIZE, englishSubSkill } from './constants'
import { numberToWords } from './englishNumbers'
import { numberOptions, wordOptions, timeOptions, shuffle } from './englishDistractors'
import { PEOPLE, ITEMS, noun, pronoun } from './englishData'
import type { Item } from './englishData'
import { generateArithmeticSeries } from './generators/arithmeticSeries'
import { generateSpatialQuestion } from './generators/spatialBlocks'

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export function generateQuestion(level: EnglishLevel, topic: EnglishTopic): EnglishQuestion {
    const id = `L${level}-${topic}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const difficulty = ENGLISH_LEVEL_TO_DIFFICULTY[level]
    const subSkill = englishSubSkill(topic)

    let prompt = '', audioText = '', promptVi = '', answer = '', options: string[] = [], explanation: string[] = [], explanationVi: string[] = [], vocab: string[] = []
    let visual: EnglishQuestion['visual'] = undefined

    const maxNum = level === 1 ? 20 : level === 2 ? 100 : level === 3 ? 500 : 1000

    // 1. NUMBER
    if (topic === 'number') {
        let words = ''; // <-- KHAI BÁO BIẾN WORDS Ở ĐÂY
        if (level <= 2) {
            const num = level === 1 ? randInt(1, 20) : randInt(20, 99)
            words = numberToWords(num) // <-- BỎ const
            if (Math.random() > 0.5) {
                prompt = `Which number is "${words}"?`; promptVi = `Số nào là "${words}"?`; answer = String(num)
                options = numberOptions(num, [num + 10, num - 10, Number(String(num).split('').reverse().join(''))], 0, maxNum)
            } else {
                prompt = `Which word is ${num}?`; promptVi = `Từ nào là ${num}?`; answer = words
                options = wordOptions(answer, [answer, ...numberToWords(num + 1), ...numberToWords(num - 1)].filter(Boolean))
            }
            explanation = [`🔍 Step 1: Read the number carefully.`, `🧠 Step 2: Break the number into tens and ones.`, `🎯 Step 3: The correct match is ${answer}.`]
            explanationVi = [`🔍 Bước 1: Đọc kỹ con số.`, `🧠 Bước 2: Phân tích số thành hàng chục và hàng đơn vị.`, `🎯 Bước 3: Đáp án đúng là ${answer}.`]
        } else {
            const num = randInt(100, 999)
            words = numberToWords(num) // <-- BỎ const
            prompt = `Which number is "${words}"?`; promptVi = `Số nào là "${words}"?`; answer = String(num)
            options = numberOptions(num, [num + 100, num - 100, Number(String(num).split('').reverse().join(''))], 100, 1000)
            explanation = [`🔍 Step 1: Listen to the hundreds digit first.`, `🧠 Step 2: Then find the tens and ones digits.`, `🎯 Step 3: "${words}" is written as ${num}.`]
            explanationVi = [`🔍 Bước 1: Nghe chữ số hàng trăm trước.`, `🧠 Bước 2: Sau đó tìm chữ số hàng chục và hàng đơn vị.`, `🎯 Bước 3: "${words}" được viết là ${num}.`]
        }
        audioText = `Which number is ${words}?`; vocab.push('number')
    }

    // 2. ADDSUB
    else if (topic === 'addsub') {
        if (level === 1) {
            const isAdd = Math.random() > 0.5
            const a = randInt(5, 15), b = randInt(2, 5)
            const ans = isAdd ? a + b : Math.max(a, b) - Math.min(a, b)
            prompt = isAdd ? `${a} plus ${b} is ___` : `${Math.max(a, b)} minus ${Math.min(a, b)} is ___`
            promptVi = isAdd ? `${a} cộng ${b} là ___` : `${Math.max(a, b)} trừ ${Math.min(a, b)} là ___`
            answer = String(ans); options = numberOptions(ans, [ans + 1, ans - 1, ans + 2], 0, 20)
            explanation = [`🔍 Step 1: We need to ${isAdd ? 'add' : 'subtract'}.`, `🧠 Step 2: Start at ${Math.max(a, b)} and ${isAdd ? 'count up' : 'count back'}.`, `🎯 Step 3: ${Math.max(a, b)} ${isAdd ? '+' : '-'} ${Math.min(a, b)} = ${ans}.`]
            explanationVi = [`🔍 Bước 1: Chúng ta làm phép ${isAdd ? 'cộng' : 'trừ'}.`, `🧠 Bước 2: Bắt đầu từ ${Math.max(a, b)}.`, `🎯 Bước 3: ${Math.max(a, b)} ${isAdd ? '+' : '-'} ${Math.min(a, b)} = ${ans}.`]
        } else if (level <= 3) {
            const isAdd = Math.random() > 0.5
            const a = randInt(25, 65), b = randInt(15, 35)
            const ans = isAdd ? a + b : a - b
            prompt = isAdd ? `What is ${a} plus ${b}?` : `What is ${a} minus ${b}?`
            promptVi = isAdd ? `${a} cộng ${b} bằng mấy?` : `${a} trừ ${b} bằng mấy?`
            answer = String(ans); options = numberOptions(ans, [a - b, ans + 10, ans - 10], 0, 100)
            explanation = [`🔍 Step 1: Split both numbers into tens and ones.`, `🧠 Step 2: ${isAdd ? 'Add' : 'Subtract'} the ones, then tens.`, `🎯 Step 3: The answer is ${ans}.`]
            explanationVi = [`🔍 Bước 1: Tách thành hàng chục và đơn vị.`, `🧠 Bước 2: ${isAdd ? 'Cộng' : 'Trừ'} hàng đơn vị rồi đến hàng chục.`, `🎯 Bước 3: Đáp án là ${ans}.`]
        } else {
            const a = randInt(100, 500), b = randInt(50, 200), c = randInt(20, 100)
            const isAddFirst = Math.random() > 0.5
            const ans = isAddFirst ? a + b - c : a - b + c
            prompt = `A shop starts with ${a} items. They ${isAddFirst ? 'receive' : 'sell'} ${b} items, then ${isAddFirst ? 'sell' : 'receive'} ${c} items. How many items do they have now?`
            promptVi = `Cửa hàng có ${a} món. Họ ${isAddFirst ? 'nhập' : 'bán'} ${b} món, rồi ${isAddFirst ? 'bán' : 'nhập'} ${c} món. Hỏi còn bao nhiêu?`
            answer = String(ans); options = numberOptions(ans, [a + b + c, a - b - c, ans + 10], 0, 1000)
            explanation = [`🔍 Step 1: Break into 2 steps.`, `🧠 Step 2: First, ${isAddFirst ? 'add' : 'subtract'} ${b} to ${a}.`, `🎯 Step 3: Then ${isAddFirst ? 'subtract' : 'add'} ${c} = ${ans}.`]
            explanationVi = [`🔍 Bước 1: Chia thành 2 bước.`, `🧠 Bước 2: Đầu tiên, ${a} ${isAddFirst ? 'cộng' : 'trừ'} ${b}.`, `🎯 Bước 3: Sau đó ${isAddFirst ? 'trừ' : 'cộng'} ${c} = ${ans}.`]
        }
    }

    // 3. MULDIV
    else if (topic === 'muldiv') {
        if (level === 1) {
            const a = randInt(2, 3), b = randInt(2, 4)
            const ans = a * b
            prompt = `${a} groups of ${b}. How many altogether?`; promptVi = `Có ${a} nhóm, mỗi nhóm ${b} cái. Hỏi có tất cả bao nhiêu?`
            answer = String(ans); options = numberOptions(ans, [a + b, ans + 1], 0, 12)
            explanation = [`🔍 Step 1: We have ${a} groups of ${b}.`, `🧠 Step 2: Multiplication is repeated addition: ${Array(a).fill(b).join(' + ')}.`, `🎯 Step 3: The total is ${ans}.`]
            explanationVi = [`🔍 Bước 1: Có ${a} nhóm, mỗi nhóm ${b}.`, `🧠 Bước 2: Phép nhân là cộng lặp lại: ${Array(a).fill(b).join(' + ')}.`, `🎯 Bước 3: Tổng cộng là ${ans}.`]
        } else if (level <= 3) {
            const a = randInt(2, 9), b = randInt(3, 9)
            const isMul = Math.random() > 0.5
            const ans = isMul ? a * b : a
            prompt = isMul ? `What is ${a} times ${b}?` : `What is ${a * b} divided by ${b}?`
            promptVi = isMul ? `${a} nhân ${b} bằng mấy?` : `${a * b} chia ${b} bằng mấy?`
            answer = String(ans); options = numberOptions(ans, [a + b, ans + 2, ans - 1], 0, 100)
            explanation = [`🔍 Step 1: Use your times tables.`, `🧠 Step 2: Think about ${a} ${isMul ? 'times' : 'groups'}.`, `🎯 Step 3: The answer is ${ans}.`]
            explanationVi = [`🔍 Bước 1: Sử dụng bảng cửu chương.`, `🧠 Bước 2: Nghĩ về ${a}.`, `🎯 Bước 3: Đáp án là ${ans}.`]
        } else {
            const boxes = randInt(3, 6), perBox = randInt(4, 9), extra = randInt(10, 30)
            const ans = boxes * perBox + extra
            prompt = `There are ${boxes} boxes. Each box has ${perBox} pens. You add ${extra} more pens. How many pens are there?`
            promptVi = `Có ${boxes} hộp, mỗi hộp ${perBox} bút. Thêm ${extra} bút nữa. Hỏi tổng cộng bao nhiêu bút?`
            answer = String(ans); options = numberOptions(ans, [boxes + perBox + extra, boxes * perBox, ans - extra], 0, 100)
            explanation = [`🔍 Step 1: First, find the pens inside boxes.`, `🧠 Step 2: ${boxes} × ${perBox} = ${boxes * perBox}.`, `🎯 Step 3: Add extra: ${boxes * perBox} + ${extra} = ${ans}.`]
            explanationVi = [`🔍 Bước 1: Tìm số bút trong hộp trước.`, `🧠 Bước 2: ${boxes} × ${perBox} = ${boxes * perBox}.`, `🎯 Bước 3: Cộng thêm: ${boxes * perBox} + ${extra} = ${ans}.`]
        }
    }

    // 4. WORD
    else if (topic === 'word') {
        const p = pick(PEOPLE), item = pick(ITEMS), pr = pronoun(p)
        if (level <= 2) {
            const a = randInt(15, 50), b = randInt(5, 15)
            prompt = `${p.en} has ${noun(a, item)}. ${pr.subj} gets ${b} more. How many now?`
            promptVi = `${p.vi} có ${a} ${item.viNoun}. Được thêm ${b} cái. Hỏi bây giờ có bao nhiêu?`
            const ansNum = a + b; answer = String(ansNum); options = numberOptions(ansNum, [a - b, ansNum + 10], 0, 100)
            explanation = [`🔍 Step 1: "Gets more" means addition.`, `🧠 Step 2: ${a} + ${b}.`, `🎯 Step 3: ${a + b}.`]
            explanationVi = [`🔍 Bước 1: "Được thêm" là phép cộng.`, `🧠 Bước 2: ${a} + ${b}.`, `🎯 Bước 3: ${a + b}.`]
        } else if (level === 3) {
            const a = randInt(50, 90), b = randInt(10, 20), c = randInt(5, 15)
            prompt = `${p.en} has ${noun(a, item)}. ${pr.subj} buys ${b} more, then gives ${c} to a friend. How many now?`
            promptVi = `${p.vi} có ${a} ${item.viNoun}. Mua thêm ${b}, rồi cho bạn ${c}. Hỏi còn bao nhiêu?`
            const ansNum = a + b - c; answer = String(ansNum); options = numberOptions(ansNum, [a + b + c, a - b + c, ansNum + 5], 0, 150)
            explanation = [`🔍 Step 1: First find the total after buying.`, `🧠 Step 2: ${a} + ${b} = ${a + b}.`, `🎯 Step 3: Subtract given away: ${a + b} - ${c} = ${answer}.`]
            explanationVi = [`🔍 Bước 1: Tìm tổng sau khi mua.`, `🧠 Bước 2: ${a} + ${b} = ${a + b}.`, `🎯 Bước 3: Trừ đi số đã cho: ${a + b} - ${c} = ${answer}.`]
        } else if (level === 4) {
            const p2 = pick(PEOPLE.filter(x => x.en !== p.en))
            const a = randInt(20, 40), b = randInt(5, 15)
            prompt = `${p.en} has ${noun(a, item)}. ${p2.en} has ${b} more than ${p.en}. How many altogether?`
            promptVi = `${p.vi} có ${a} ${item.viNoun}. ${p2.vi} có nhiều hơn ${b} cái. Hỏi cả hai có bao nhiêu?`
            answer = String(a + (a + b)); options = numberOptions(a + (a + b), [a + b, (a + b) + b, a * 2], 0, 150)
            explanation = [`🔍 Step 1: Find ${p2.en}'s count.`, `🧠 Step 2: ${a} + ${b} = ${a + b}.`, `🎯 Step 3: Add both: ${a} + ${a + b} = ${answer}.`]
            explanationVi = [`🔍 Bước 1: Tìm số của ${p2.vi}.`, `🧠 Bước 2: ${a} + ${b} = ${a + b}.`, `🎯 Bước 3: Cộng cả hai: ${a} + ${a + b} = ${answer}.`]
        } else {
            const extraItem = pick(ITEMS.filter(i => i.id !== item.id))
            const a = randInt(60, 100), b = randInt(20, 40), c = randInt(10, 25)
            prompt = `${p.en} has ${noun(a, item)} and some ${extraItem.pl}. ${pr.subj} buys ${b} more ${item.pl}, then gives ${c} to a brother. How many ${item.pl} now?`
            promptVi = `${p.vi} có ${a} ${item.viNoun} và một ít ${extraItem.viNoun}. Mua thêm ${b} ${item.viNoun}, cho em ${c} cái. Hỏi còn bao nhiêu?`
            const ansNum = a + b - c; answer = String(ansNum); options = numberOptions(ansNum, [a + b + c, a - b + c, ansNum + 10], 0, 200)
            explanation = [`🔍 Step 1: Only count ${item.pl}. ${extraItem.pl} is extra info.`, `🧠 Step 2: ${a} + ${b} = ${a + b}.`, `🎯 Step 3: ${a + b} - ${c} = ${answer}.`]
            explanationVi = [`🔍 Bước 1: Chỉ đếm ${item.viNoun}. ${extraItem.viNoun} là dữ kiện thừa.`, `🧠 Step 2: ${a} + ${b} = ${a + b}.`, `🎯 Step 3: ${a + b} - ${c} = ${answer}.`]
        }
    }

    // 5. PATTERN
    else if (topic === 'pattern') {
        if (level <= 2) {
            const start = randInt(1, 10), step = randInt(2, 5)
            const s = [start, start + step, start + step * 2, start + step * 3]
            prompt = `${s[0]}, ${s[1]}, ${s[2]}, ___`; promptVi = `${s[0]}, ${s[1]}, ${s[2]}, ___`
            answer = String(s[3]); options = numberOptions(s[3], [s[3] + step, s[3] - 1, s[3] + 10], 0, 100)
            explanation = [`🔍 Step 1: Look at how much we add.`, `🧠 Step 2: The rule is "add ${step}".`, `🎯 Step 3: ${s[2]} + ${step} = ${s[3]}.`]
            explanationVi = [`🔍 Bước 1: Xem mỗi lần thêm mấy.`, `🧠 Bước 2: Quy luật là cộng ${step}.`, `🎯 Bước 3: ${s[2]} + ${step} = ${s[3]}.`]
        } else {
            const start = randInt(1, 10), step1 = randInt(1, 3), step2 = step1 + randInt(1, 3)
            const s1 = start, s2 = s1 + step1, s3 = s2 + step1 + step2, s4 = s3 + step1 + step2 * 2, s5 = s4 + step1 + step2 * 3
            prompt = `${s1}, ${s2}, ${s3}, ${s4}, ___`; promptVi = `${s1}, ${s2}, ${s3}, ${s4}, ___`
            answer = String(s5); options = numberOptions(s5, [s5 + step2, s5 - 1, s4 + step1], 0, 500)
            explanation = [`🔍 Step 1: Look at the differences.`, `🧠 Step 2: The steps are getting bigger by ${step2}.`, `🎯 Step 3: ${s4} + ${s5 - s4} = ${s5}.`]
            explanationVi = [`🔍 Bước 1: Xem khoảng cách.`, `🧠 Bước 2: Bước nhảy tăng thêm ${step2}.`, `🎯 Bước 3: ${s4} + ${s5 - s4} = ${s5}.`]
        }
    }

    // 6. GEOMETRY
    else if (topic === 'geometry') {
        const types = level <= 2
            ? ['identify', 'count_squares', 'count_circles', 'count_triangles', 'symmetry', 'line_segments']
            : ['iso_blocks', 'iso_blocks', 'iso_blocks', 'identify', 'count_squares', 'count_triangles', 'symmetry', 'route_path']
        const type = pick(types)
        if (type === 'identify') {
            const shapes = [{ en: 'triangle', vi: 'tam giác', sides: 3, emoji: '🔺' }, { en: 'square', vi: 'vuông', sides: 4, emoji: '🟦' }, { en: 'pentagon', vi: 'ngũ giác', sides: 5, emoji: '⬟' }, { en: 'hexagon', vi: 'lục giác', sides: 6, emoji: '⬢' }]
            const s = pick(shapes); prompt = `How many sides does a ${s.en} have?`; promptVi = `Hình ${s.vi} có bao nhiêu cạnh?`
            answer = String(s.sides); options = numberOptions(s.sides, [s.sides + 1, s.sides - 1], 3, 8); visual = { type: 'emoji', text: s.emoji }
            explanation = [`🔍 Step 1: Look at the shape.`, `🧠 Step 2: Count the sides.`, `🎯 Step 3: A ${s.en} has ${s.sides} sides.`]
            explanationVi = [`🔍 Bước 1: Nhìn hình.`, `🧠 Bước 2: Đếm số cạnh.`, `🎯 Bước 3: Hình ${s.vi} có ${s.sides} cạnh.`]
        } else if (type === 'count_squares') {
            const rows = pick([2, 3]), cols = pick([2, 3]); let ans = 0; for (let i = 1; i <= Math.min(rows, cols); i++) ans += (rows - i + 1) * (cols - i + 1)
            prompt = `How many squares are there?`; promptVi = `Có bao nhiêu hình vuông?`
            answer = String(ans); options = numberOptions(ans, [rows * cols, ans + 2, ans - 1], 1, 20); visual = { type: 'count_squares', rows, cols }
            explanation = [`🔍 Step 1: Count 1x1 squares.`, `🧠 Step 2: Count larger squares.`, `🎯 Step 3: Total ${ans}.`]
            explanationVi = [`🔍 Bước 1: Đếm hình 1x1.`, `🧠 Bước 2: Đếm hình lớn hơn.`, `🎯 Bước 3: Tổng cộng ${ans}.`]
        } else if (type === 'count_circles') {
            prompt = `How many circles are there?`; promptVi = `Có bao nhiêu hình tròn?`
            answer = '3'; options = numberOptions(3, [1, 2, 4, 5], 1, 10); visual = { type: 'count_circles', count: 3 }
            explanation = [`🔍 Step 1: Look at the target.`, `🧠 Step 2: Count outside-in.`, `🎯 Step 3: 3 circles.`]
            explanationVi = [`🔍 Bước 1: Nhìn hình.`, `🧠 Bước 2: Đếm từ ngoài vào.`, `🎯 Bước 3: 3 hình tròn.`]
        } else if (type === 'count_triangles') {
            prompt = `How many triangles are there?`; promptVi = `Có bao nhiêu hình tam giác?`
            answer = '5'; options = numberOptions(5, [4, 6, 3], 1, 10); visual = { type: 'composite_triangles' }
            explanation = [`🔍 Step 1: Count 4 small.`, `🧠 Step 2: Add 1 big.`, `🎯 Step 3: 5 total.`]
            explanationVi = [`🔍 Bước 1: Đếm 4 nhỏ.`, `🧠 Bước 2: Thêm 1 lớn.`, `🎯 Bước 3: Tổng 5.`]
        } else if (type === 'symmetry') {
            prompt = `How many lines of symmetry does a square have?`; promptVi = `Hình vuông có mấy trục đối xứng?`
            answer = '4'; options = numberOptions(4, [2, 3, 5], 1, 10); visual = { type: 'symmetry', shapeName: 'square' }
            explanation = [`🔍 Step 1: What is symmetry?`, `🧠 Step 2: Draw lines across and diagonals.`, `🎯 Step 3: 4 lines.`]
            explanationVi = [`🔍 Bước 1: Đối xứng là gì?`, `🧠 Bước 2: Vẽ các đường chéo và ngang dọc.`, `🎯 Bước 3: 4 đường.`]
        } else if (type === 'line_segments') {
            const dots = pick([3, 4, 5]); const ans = (dots * (dots - 1)) / 2
            prompt = `How many line segments?`; promptVi = `Có bao nhiêu đoạn thẳng?`
            answer = String(ans); options = numberOptions(ans, [dots, dots * 2, ans + 2], 1, 20); visual = { type: 'line_segments', dots }
            explanation = [`🔍 Step 1: Count small segments.`, `🧠 Step 2: Count larger ones.`, `🎯 Step 3: Total ${ans}.`]
            explanationVi = [`🔍 Bước 1: Đếm đoạn nhỏ.`, `🧠 Bước 2: Đếm đoạn lớn.`, `🎯 Bước 3: Tổng ${ans}.`]
        } else if (type === 'iso_blocks') {
            const spatial = generateSpatialQuestion()
            prompt = spatial.prompt
            promptVi = spatial.promptVi
            audioText = spatial.audioText
            answer = spatial.answer
            options = spatial.options
            explanation = spatial.explanation
            explanationVi = spatial.explanationVi
            visual = spatial.visual
            vocab.push(...spatial.vocab)
        } else {
            prompt = `How many paths from red to green (only up and right)?`; promptVi = `Có bao nhiêu đường đi từ đỏ đến xanh (chỉ lên và phải)?`
            answer = '6'; options = numberOptions(6, [4, 5, 8], 1, 15); visual = { type: 'route_path', rows: 2, cols: 2 }
            explanation = [`🔍 Step 1: Must go Up 2, Right 2.`, `🧠 Step 2: List them.`, `🎯 Step 3: 6 paths.`]
            explanationVi = [`🔍 Bước 1: Đi Lên 2, Phải 2.`, `🧠 Bước 2: Liệt kê.`, `🎯 Bước 3: 6 đường.`]
        }
        vocab.push('shape')
    }

    // 7. MEASURE
    else if (topic === 'measure') {
        const type = randInt(1, 3)
        if (type === 1) {
            const temp = randInt(5, 30), add = randInt(5, 15)
            prompt = `What is ${add}°C more than the temperature?`; promptVi = `Nhiệt độ cộng thêm ${add}°C là bao nhiêu?`
            answer = `${temp + add}°C`; options = shuffle([`${temp + add}°C`, `${temp}°C`, `${temp - add}°C`, `${temp + add + 10}°C`]); visual = { type: 'thermometer', temp }
            explanation = [`🔍 Step 1: Read thermometer: ${temp}°C.`, `🧠 Step 2: Add ${add}.`, `🎯 Step 3: ${temp + add}°C.`]
            explanationVi = [`🔍 Bước 1: Đọc nhiệt kế: ${temp}°C.`, `🧠 Bước 2: Cộng ${add}.`, `🎯 Bước 3: ${temp + add}°C.`]
        } else if (type === 2) {
            const startDay = randInt(1, 3), eventDay = randInt(15, 25)
            prompt = `If today is the ${eventDay}th, what day is it?`; promptVi = `Nếu hôm nay là ngày ${eventDay}, là thứ mấy?`
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; const dayIndex = (startDay + eventDay - 1) % 7
            answer = days[dayIndex]; options = shuffle([days[dayIndex], days[(dayIndex + 1) % 7], days[(dayIndex + 2) % 7], days[(dayIndex + 3) % 7]]); visual = { type: 'calendar', monthName: 'May 2024', startDay, daysInMonth: 31, eventDay }
            explanation = [`🔍 Step 1: Find date ${eventDay}.`, `🧠 Step 2: Look at the column.`, `🎯 Step 3: It is ${answer}.`]
            explanationVi = [`🔍 Bước 1: Tìm ngày ${eventDay}.`, `🧠 Bước 2: Nhìn cột.`, `🎯 Bước 3: Là ${answer}.`]
        } else {
            const hour = randInt(1, 12), minute: 0 | 30 = pick([0, 30] as const)
            prompt = `What time is it?`; promptVi = `Bây giờ là mấy giờ?`
            answer = `${hour}:${minute === 0 ? '00' : '30'}`; options = timeOptions(hour, minute); visual = { type: 'clock', hour, minute }
            explanation = [`🔍 Step 1: Short hand = hour (${hour}).`, `🧠 Step 2: Long hand = minutes.`, `🎯 Step 3: ${answer}.`]
            explanationVi = [`🔍 Bước 1: Kim ngắn = giờ (${hour}).`, `🧠 Bước 2: Kim dài = phút.`, `🎯 Bước 3: ${answer}.`]
        }
    }

    // 8. LOGIC
    else if (topic === 'logic') {
        const type = randInt(1, 2)
        if (type === 1) {
            const data = [{ name: 'Tia', count: randInt(2, 5) }, { name: 'Milo', count: randInt(2, 5) }, { name: 'Bruce', count: randInt(2, 5) }, { name: 'Tom', count: randInt(2, 5) }]
            const maxP = [...data].sort((a, b) => b.count - a.count)[0]
            prompt = `Who has the maximum number of crayons?`; promptVi = `Ai có nhiều bút chì màu nhất?`
            answer = maxP.name; options = data.map(d => d.name); visual = { type: 'pictograph', data, icon: '🖍️', multiplier: 5 }
            explanation = [`🔍 Step 1: Each icon = 5 crayons.`, `🧠 Step 2: Count icons.`, `🎯 Step 3: ${maxP.name} has the most.`]
            explanationVi = [`🔍 Bước 1: Mỗi icon = 5 bút.`, `🧠 Bước 2: Đếm icon.`, `🎯 Bước 3: ${maxP.name} nhiều nhất.`]
        } else {
            const letters = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W']; const swap1 = randInt(0, 5), swap2 = randInt(swap1 + 1, 7)
            const l1 = letters[swap1], l2 = letters[swap2]; const newLetters = [...letters]; const temp = newLetters[swap1]; newLetters[swap1] = newLetters[swap2]; newLetters[swap2] = temp
            const targetPos = swap1 + 1; const ordinal = targetPos === 1 ? 'first' : targetPos === 2 ? 'second' : targetPos === 3 ? 'third' : targetPos === 4 ? 'fourth' : targetPos === 5 ? 'fifth' : 'sixth'
            prompt = `If ${l1} and ${l2} swap, who is ${ordinal} from the left?`; promptVi = `Nếu đổi chỗ ${l1} và ${l2}, ai đứng thứ ${targetPos} từ trái?`
            answer = newLetters[swap1]; const pool = new Set([newLetters[swap1], letters[swap1], l1, l2]); options = Array.from(pool).slice(0, 4); while (options.length < 4) options.push(pick(letters)); options = shuffle(options); visual = { type: 'peopleLine', letters, swap1, swap2 }
            explanation = [`🔍 Step 1: Original: ${letters.join(', ')}.`, `🧠 Step 2: Swap: ${newLetters.join(', ')}.`, `🎯 Step 3: Position ${targetPos} is ${answer}.`]
            explanationVi = [`🔍 Bước 1: Ban đầu: ${letters.join(', ')}.`, `🧠 Bước 2: Đổi chỗ: ${newLetters.join(', ')}.`, `🎯 Bước 3: Vị trí ${targetPos} là ${answer}.`]
        }
    }

    // 9. DETECTIVE
    else if (topic === 'detective') {
        visual = { type: 'emoji', text: '🕵️' }
        if (level === 1) {
            const isEven = Math.random() > 0.5; const target = pick(isEven ? [2, 4, 6, 8] : [1, 3, 5, 7, 9]); const distractors = shuffle(isEven ? [1, 3, 5, 7, 9] : [2, 4, 6, 8]).slice(0, 3)
            prompt = `I am an ${isEven ? 'even' : 'odd'} number between 1 and 10. Who am I?`; promptVi = `Tôi là số ${isEven ? 'chẵn' : 'lẻ'} từ 1-10. Tôi là ai?`
            answer = String(target); options = shuffle([...distractors.map(String), answer])
            explanation = [`🔍 Step 1: Clue is ${isEven ? 'even' : 'odd'}.`, `🧠 Step 2: Cross out wrong ones.`, `🎯 Step 3: ${target}.`]
            explanationVi = [`🔍 Bước 1: Manh mối là ${isEven ? 'chẵn' : 'lẻ'}.`, `🧠 Bước 2: Gạch bỏ sai.`, `🎯 Bước 3: ${target}.`]
        } else {
            const target = randInt(12, 89); const tens = Math.floor(target / 10); const ones = target % 10; const digitSum = tens + ones
            prompt = `I am a 2-digit number. Sum of digits is ${digitSum}. I am between ${target - 4} and ${target + 4}. Who am I?`; promptVi = `Tôi là số 2 chữ số. Tổng chữ số là ${digitSum}. Tôi ở giữa ${target - 4} và ${target + 4}. Tôi là ai?`
            answer = String(target); options = numberOptions(target, [target + 10, target - 10, target + 1], 10, 100)
            explanation = [`🔍 Step 1: Between ${target - 4} and ${target + 4}.`, `🧠 Step 2: Test digit sum.`, `🎯 Step 3: ${tens} + ${ones} = ${digitSum} → ${target}.`]
            explanationVi = [`🔍 Bước 1: Ở giữa ${target - 4} và ${target + 4}.`, `🧠 Bước 2: Thử tổng chữ số.`, `🎯 Bước 3: ${tens} + ${ones} = ${digitSum} → ${target}.`]
        }
        vocab.push('odd', 'even')
    }

    // 10. ELIMINATION
    else if (topic === 'elimination') {
        visual = { type: 'emoji', text: '🎯' }
        const getItemDisplay = (item: Item) => item.emoji || item.sg
        if (level <= 2) {
            const p1 = pick(PEOPLE), p2 = pick(PEOPLE.filter(p => p.en !== p1.en)); const item1 = pick(ITEMS), item2 = pick(ITEMS.filter(i => i.id !== item1.id))
            prompt = `${p1.en} has ${getItemDisplay(item1)}. ${p2.en} has ${getItemDisplay(item2)}. Who has ${getItemDisplay(item1)}?`; promptVi = `${p1.vi} có ${item1.viNoun}. ${p2.vi} có ${item2.viNoun}. Ai có ${item1.viNoun}?`
            answer = p1.en; options = shuffle([p1.en, p2.en, 'Both', 'Neither'])
            explanation = [`🔍 Step 1: Read carefully.`, `🧠 Step 2: Find who has ${item1.sg}.`, `🎯 Step 3: ${p1.en} has it.`]
            explanationVi = [`🔍 Bước 1: Đọc kỹ.`, `🧠 Bước 2: Tìm ai có ${item1.viNoun}.`, `🎯 Bước 3: ${p1.vi} có.`]
        } else {
            const persons = shuffle([...PEOPLE]).slice(0, 4); const items = shuffle([...ITEMS]).slice(0, 4)
            const p1 = persons[0], p2 = persons[1], p3 = persons[2], p4 = persons[3]; const itemA = items[0], itemB = items[1], itemC = items[2], itemD = items[3]
            prompt = `${p1.en} has ${getItemDisplay(itemA)}. ${p2.en} does not have ${getItemDisplay(itemB)}. ${p3.en} has ${getItemDisplay(itemC)}. Who has ${getItemDisplay(itemD)}?`
            promptVi = `${p1.vi} có ${itemA.viNoun}. ${p2.vi} không có ${itemB.viNoun}. ${p3.vi} có ${itemC.viNoun}. Ai có ${itemD.viNoun}?`
            answer = p2.en; options = shuffle([p1.en, p2.en, p3.en, p4.en])
            explanation = [`🔍 Step 1: ${p1.en} has A, ${p3.en} has C.`, `🧠 Step 2: Remaining B, D for ${p2.en}, ${p4.en}. ${p2.en} doesn't have B.`, `🎯 Step 3: ${p2.en} has D.`]
            explanationVi = [`🔍 Bước 1: ${p1.vi} có A, ${p3.vi} có C.`, `🧠 Bước 2: Còn B, D cho ${p2.vi}, ${p4.vi}. ${p2.vi} không có B.`, `🎯 Bước 3: ${p2.vi} có D.`]
        }
        vocab.push('logic')
    }

    // 11. ALGEBRA
    else if (topic === 'algebra') {
        const balanceChance = level <= 2 ? 1.0 : level <= 4 ? 0.7 : 0.5
        if (Math.random() < balanceChance) {
            const itemWeight = pick([2, 5, 10]); const numLeft = randInt(3, 5), numRight = randInt(1, numLeft - 1)
            const totalLeft = itemWeight * numLeft, totalRight = itemWeight * numRight; const mystery = totalLeft - totalRight
            prompt = `The scale is balanced. What is the weight of the mystery box?`; promptVi = `Cân thăng bằng. Hộp bí ẩn nặng bao nhiêu?`
            answer = String(mystery); options = numberOptions(mystery, [totalLeft + totalRight, mystery + itemWeight, mystery - 1], 1, 100); visual = { type: 'balance', leftWeight: totalLeft, rightWeight: totalRight, mysteryWeight: mystery, itemEmoji: '📦', itemWeight, numLeft, numRight }
            explanation = [`🔍 Step 1: Left = Right.`, `🧠 Step 2: Left = ${totalLeft}, Right = ${totalRight} + box.`, `🎯 Step 3: Box = ${mystery}.`]
            explanationVi = [`🔍 Bước 1: Trái = Phải.`, `🧠 Bước 2: Trái = ${totalLeft}, Phải = ${totalRight} + hộp.`, `🎯 Bước 3: Hộp = ${mystery}.`]
        } else {
            const fruits = ['🍎', '🍌', '🍇', '🍊', '🍓']; const f1 = pick(fruits), f2 = pick(fruits.filter(f => f !== f1)), f3 = pick(fruits.filter(f => f !== f1 && f !== f2))
            const val1 = randInt(2, 5), val2 = randInt(2, 5), val3 = randInt(1, 5); const sum1 = val1 + val1, sum2 = val1 + val2, sum3 = val1 + val2 + val3
            const lines = [`${f1} + ${f1} = ${sum1}`, `${f1} + ${f2} = ${sum2}`, `${f1} + ${f2} + ${f3} = ${sum3}`]
            prompt = `What is the value of ${f3}?`; promptVi = `${f3} bằng bao nhiêu?`
            answer = String(val3); options = numberOptions(val3, [val1, val2, val3 + 1], 1, 20); visual = { type: 'equation', lines, targetEmoji: f3 }
            explanation = [`🔍 Step 1: ${f1} = ${val1}.`, `🧠 Step 2: ${val1} + ${f2} = ${sum2} → ${f2} = ${val2}.`, `🎯 Step 3: ${val1} + ${val2} + ${f3} = ${sum3} → ${f3} = ${val3}.`]
            explanationVi = [`🔍 Bước 1: ${f1} = ${val1}.`, `🧠 Bước 2: ${val1} + ${f2} = ${sum2} → ${f2} = ${val2}.`, `🎯 Bước 3: ${val1} + ${val2} + ${f3} = ${sum3} → ${f3} = ${val3}.`]
        }
    }

    // 12. CRYPTARITHM
    else if (topic === 'cryptarithm') {
        const letter = pick(['A', 'B', 'C', 'X', 'Y', 'Z'])
        if (level <= 2) {
            const isAdd = Math.random() > 0.5; const ans = randInt(5, 25), num = randInt(5, 25); const total = isAdd ? ans + num : ans - num
            prompt = isAdd ? `Find ${letter}: ${letter} + ${num} = ${total}` : `Find ${letter}: ${letter} - ${num} = ${total}`; promptVi = isAdd ? `Tìm ${letter}: ${letter} + ${num} = ${total}` : `Tìm ${letter}: ${letter} - ${num} = ${total}`
            answer = String(ans); options = numberOptions(ans, [ans + 1, ans - 1, ans + 10], 1, 50)
            explanation = [`🔍 Step 1: Use inverse operation.`, `🧠 Step 2: ${isAdd ? 'Subtract' : 'Add'}.`, `🎯 Step 3: ${letter} = ${ans}.`]
            explanationVi = [`🔍 Bước 1: Dùng phép ngược.`, `🧠 Bước 2: ${isAdd ? 'Trừ' : 'Cộng'}.`, `🎯 Bước 3: ${letter} = ${ans}.`]
        } else if (level <= 4) {
            let ans = 0, mult = 0, tens = 0; while (true) { ans = randInt(2, 9); mult = randInt(3, 9); const prod = ans * mult; if (prod % 10 === ans && prod > 10) { tens = Math.floor(prod / 10); break } }
            prompt = `Find ${letter}: ${letter} × ${mult} = ${tens}${letter}`; promptVi = `Tìm ${letter}: ${letter} × ${mult} = ${tens}${letter}`
            answer = String(ans); options = numberOptions(ans, [ans + 1, ans - 1, tens], 1, 9)
            explanation = [`🔍 Step 1: Look at ones digit.`, `🧠 Step 2: ${letter} × ${mult} ends in ${letter}.`, `🎯 Step 3: ${letter} = ${ans}.`]
            explanationVi = [`🔍 Bước 1: Nhìn hàng đơn vị.`, `🧠 Bước 2: ${letter} × ${mult} tận cùng là ${letter}.`, `🎯 Bước 3: ${letter} = ${ans}.`]
        } else {
            let A = 0, B = 0, mult = 0, result = 0; while (true) { A = randInt(1, 9); B = randInt(1, 9); mult = randInt(3, 9); const num = A * 10 + B; result = num * mult; if (result >= 100 && result <= 999) { const tensDigit = Math.floor(result / 10) % 10; if (tensDigit === B) break } }
            prompt = `Find A + B: AB × ${mult} = ${Math.floor(result / 100)}B${result % 10}`; promptVi = `Tìm A + B: AB × ${mult} = ${Math.floor(result / 100)}B${result % 10}`
            answer = String(A + B); options = numberOptions(A + B, [A, B, A + B + 2], 2, 20)
            explanation = [`🔍 Step 1: B × ${mult} ends in ${result % 10}.`, `🧠 Step 2: So B = ${B}.`, `🎯 Step 3: Test A. A+B = ${A + B}.`]
            explanationVi = [`🔍 Bước 1: B × ${mult} tận cùng là ${result % 10}.`, `🧠 Bước 2: Vậy B = ${B}.`, `🎯 Bước 3: Thử A. A+B = ${A + B}.`]
        }
        vocab.push('logic')
    }

    // 13. ARITHMETIC SERIES
    else if (topic === 'arithmetic_series') {
        const r = generateArithmeticSeries(level); prompt = r.prompt; audioText = r.audioText; promptVi = r.promptVi; answer = r.answer; options = r.options; explanation = r.explanation; explanationVi = r.explanationVi; vocab = r.vocab; visual = r.visual
    }

    // ==========================================
    // P0, P1, P2 - CÁC DẠNG MỚI (TỪ ĐÂY TRỞ XUỐNG)
    // ==========================================

    // 14. POSITION (P0)
    else if (topic === 'position') {
        if (level <= 2) {
            const total = randInt(10, 30), frontPos = randInt(2, total - 2), backPos = total - frontPos + 1
            prompt = `There are ${total} children in a line. Alice is ${frontPos}th from the front. What is her position from the back?`; promptVi = `Có ${total} bạn xếp hàng. Alice đứng thứ ${frontPos} từ trước. Hỏi từ sau bạn ấy đứng thứ mấy?`
            answer = String(backPos); options = numberOptions(backPos, [frontPos, total - frontPos, backPos + 1], 1, 40)
            explanation = [`🔍 Step 1: Alice is ${frontPos}th.`, `🧠 Step 2: Total - front + 1.`, `🎯 Step 3: ${total} - ${frontPos} + 1 = ${backPos}.`]
            explanationVi = [`🔍 Bước 1: Alice thứ ${frontPos}.`, `🧠 Bước 2: Tổng - trước + 1.`, `🎯 Bước 3: ${total} - ${frontPos} + 1 = ${backPos}.`]
        } else {
            const front = randInt(5, 15), back = randInt(5, 15), total = front + back + 1
            prompt = `There are ${front} children in front of Tom, and ${back} behind. How many children in total?`; promptVi = `Có ${front} bạn trước Tom, ${back} bạn sau Tom. Hỏi tổng cộng bao nhiêu bạn?`
            answer = String(total); options = numberOptions(total, [front + back, total + 1, total - 1], 5, 40)
            explanation = [`🔍 Step 1: Front = ${front}, Back = ${back}.`, `🧠 Step 2: Add Tom!`, `🎯 Step 3: ${front} + ${back} + 1 = ${total}.`]
            explanationVi = [`🔍 Bước 1: Trước = ${front}, Sau = ${back}.`, `🧠 Bước 2: Cộng cả Tom!`, `🎯 Bước 3: ${front} + ${back} + 1 = ${total}.`]
        }
    }

    // 15. AGE (P0)
    else if (topic === 'age') {
        const p1 = pick(PEOPLE)
        if (level <= 2) {
            const p1Age = randInt(20, 40), diff = randInt(3, 10), p2Age = p1Age - diff
            prompt = `${p1.en} is ${p1Age} years old. His sibling is ${diff} years younger. How old is the sibling?`; promptVi = `${p1.vi} ${p1Age} tuổi. Em ít hơn ${diff} tuổi. Hỏi em bao nhiêu tuổi?`
            answer = String(p2Age); options = numberOptions(p2Age, [p1Age + diff, diff, p2Age - 1], 1, 50)
            explanation = [`🔍 Step 1: Younger = subtract.`, `🧠 Step 2: ${p1Age} - ${diff}.`, `🎯 Step 3: ${p2Age} years old.`]
            explanationVi = [`🔍 Bước 1: Ít hơn = trừ.`, `🧠 Bước 2: ${p1Age} - ${diff}.`, `🎯 Bước 3: ${p2Age} tuổi.`]
        } else {
            const currentAge = randInt(10, 15), pastYears = randInt(2, 5), futureYears = randInt(2, 5), pastAge = currentAge - pastYears, ans = currentAge + futureYears
            prompt = `${pastYears} years ago, ${p1.en} was ${pastAge}. How old will he be ${futureYears} years later?`; promptVi = `${pastYears} năm trước, ${p1.vi} ${pastAge} tuổi. Hỏi ${futureYears} năm nữa bao nhiêu tuổi?`
            answer = String(ans); options = numberOptions(ans, [currentAge, pastAge + futureYears, ans + 2], 5, 30)
            explanation = [`🔍 Step 1: Current age = ${pastAge} + ${pastYears} = ${currentAge}.`, `🧠 Step 2: Add future years.`, `🎯 Step 3: ${currentAge} + ${futureYears} = ${ans}.`]
            explanationVi = [`🔍 Bước 1: Tuổi hiện tại = ${pastAge} + ${pastYears} = ${currentAge}.`, `🧠 Bước 2: Cộng năm tương lai.`, `🎯 Bước 3: ${currentAge} + ${futureYears} = ${ans}.`]
        }
    }

    // 16. SEQUENCE (P0)
    else if (topic === 'sequence') {
        if (level <= 2) {
            const start = randInt(1, 20), step = pick([2, 3, 5, 10])
            const seq = [start, start + step, start + step * 2, start + step * 3]
            prompt = `Next number: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ___`; promptVi = `Số tiếp theo: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ___`
            answer = String(start + step * 4); options = numberOptions(start + step * 4, [start + step * 5, start + step * 3, start + step * 4 + 1], 0, 100)
            explanation = [`🔍 Step 1: Check the step.`, `🧠 Step 2: Add ${step}.`, `🎯 Step 3: ${seq[3]} + ${step} = ${start + step * 4}.`]
            explanationVi = [`🔍 Bước 1: Kiểm tra bước nhảy.`, `🧠 Bước 2: Cộng ${step}.`, `🎯 Bước 3: ${seq[3]} + ${step} = ${start + step * 4}.`]
        } else {
            const isMul = Math.random() > 0.5
            if (isMul) {
                const start = randInt(1, 5), mult = pick([2, 3]), seq = [start, start * mult, start * mult * mult, start * mult * mult * mult]
                prompt = `Next number: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ___`; promptVi = `Số tiếp theo: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ___`
                answer = String(start * Math.pow(mult, 4)); options = numberOptions(start * Math.pow(mult, 4), [seq[3] + start, seq[3] * 2, start * Math.pow(mult, 4) + 5], 0, 200)
                explanation = [`🔍 Step 1: Numbers grow fast.`, `🧠 Step 2: Multiply by ${mult}.`, `🎯 Step 3: ${seq[3]} × ${mult} = ${answer}.`]
                explanationVi = [`🔍 Bước 1: Số tăng nhanh.`, `🧠 Bước 2: Nhân ${mult}.`, `🎯 Bước 3: ${seq[3]} × ${mult} = ${answer}.`]
            } else {
                const start = randInt(1, 10), step = pick([3, 4, 5]), seq = [start, start + step, start + step * 2, start + step * 3, start + step * 4]
                prompt = `Missing number: ${seq[0]}, ${seq[1]}, ___, ${seq[3]}, ${seq[4]}`; promptVi = `Số còn thiếu: ${seq[0]}, ${seq[1]}, ___, ${seq[3]}, ${seq[4]}`
                answer = String(seq[2]); options = numberOptions(seq[2], [seq[1] + 1, seq[3] - 1, seq[2] + step], 0, 100)
                explanation = [`🔍 Step 1: Find step: ${seq[1]} - ${seq[0]} = ${step}.`, `🧠 Step 2: Add step.`, `🎯 Step 3: ${seq[1]} + ${step} = ${seq[2]}.`]
                explanationVi = [`🔍 Bước 1: Tìm bước: ${seq[1]} - ${seq[0]} = ${step}.`, `🧠 Bước 2: Cộng bước.`, `🎯 Bước 3: ${seq[1]} + ${step} = ${seq[2]}.`]
            }
        }
    }

    // 17. DAY CALCULATION (P1)
    else if (topic === 'day_calc') {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const todayIdx = randInt(0, 6)
        if (level <= 2) {
            const add = randInt(1, 7)
            const ansIdx = (todayIdx + add) % 7
            prompt = `If today is ${days[todayIdx]}, what day will it be ${add} days later?`; promptVi = `Nếu hôm nay là ${days[todayIdx]}, thì ${add} ngày nữa là thứ mấy?`
            answer = days[ansIdx]; options = shuffle([days[ansIdx], days[(ansIdx + 1) % 7], days[(ansIdx + 2) % 7], days[(ansIdx + 3) % 7]])
            explanation = [`🔍 Step 1: Start at ${days[todayIdx]}.`, `🧠 Step 2: Count forward ${add} days.`, `🎯 Step 3: It lands on ${answer}.`]
            explanationVi = [`🔍 Bước 1: Bắt đầu từ ${days[todayIdx]}.`, `🧠 Bước 2: Đếm tới ${add} ngày.`, `🎯 Bước 3: Rơi vào ${answer}.`]
        } else {
            const add = randInt(10, 25)
            const ansIdx = (todayIdx + add) % 7
            prompt = `If today is ${days[todayIdx]}, what day will it be ${add} days later?`; promptVi = `Nếu hôm nay là ${days[todayIdx]}, thì ${add} ngày nữa là thứ mấy?`
            answer = days[ansIdx]; options = shuffle([days[ansIdx], days[(ansIdx + 1) % 7], days[(ansIdx + 2) % 7], days[(ansIdx + 3) % 7]])
            explanation = [`🔍 Step 1: Start at ${days[todayIdx]}.`, `🧠 Step 2: ${add} = 7 + 7 + ${add % 7}. Go forward ${add % 7} more.`, `🎯 Step 3: It lands on ${answer}.`]
            explanationVi = [`🔍 Bước 1: Bắt đầu từ ${days[todayIdx]}.`, `🧠 Bước 2: ${add} = 7 + 7 + ${add % 7}. Đi tiếp ${add % 7} ngày.`, `🎯 Bước 3: Rơi vào ${answer}.`]
        }
        vocab.push('clock', 'time')
    }

    // 18. MULTIPLICATION PRINCIPLE (P1)
    else if (topic === 'mult_principle') {
        const tops = randInt(2, 4), bottoms = randInt(2, 4)
        const ans = tops * bottoms
        prompt = `Lisa has ${tops} different T-shirts and ${bottoms} different pants. How many different outfits can she make?`; promptVi = `Lisa có ${tops} áo và ${bottoms} quần khác nhau. Hỏi có bao nhiêu cách phối đồ?`
        answer = String(ans); options = numberOptions(ans, [tops + bottoms, tops * bottoms + 1, ans - 1], 1, 20)
        explanation = [`🔍 Step 1: Each shirt can match with every pant.`, `🧠 Step 2: Use multiplication.`, `🎯 Step 3: ${tops} × ${bottoms} = ${ans} outfits.`]
        explanationVi = [`🔍 Bước 1: Mỗi áo có thể đi với mọi quần.`, `🧠 Bước 2: Dùng phép nhân.`, `🎯 Bước 3: ${tops} × ${bottoms} = ${ans} bộ.`]
    }

    // 19. EVEN/ODD (P1)
    else if (topic === 'even_odd') {
        const n = pick([5, 10, 15, 20])
        const isSum = Math.random() > 0.5
        if (isSum) {
            const ans = n % 2 === 0 ? 'Even' : 'Odd'
            prompt = `Is the sum of all numbers from 1 to ${n} odd or even?`; promptVi = `Tổng các số từ 1 đến ${n} là số lẻ hay chẵn?`
            answer = ans; options = ['Odd', 'Even']
            explanation = [`🔍 Step 1: Look at pairs: (1+${n}), (2+${n - 1})...`, `🧠 Step 2: Each pair is ${n + 1}. There are ${n / 2} pairs.`, `🎯 Step 3: The sum is ${(n * (n + 1)) / 2}, which is ${ans}.`]
            explanationVi = [`🔍 Bước 1: Xét cặp: (1+${n}), (2+${n - 1})...`, `🧠 Bước 2: Mỗi cặp là ${n + 1}. Có ${n / 2} cặp.`, `🎯 Bước 3: Tổng là ${(n * (n + 1)) / 2}, là số ${ans === 'Even' ? 'chẵn' : 'lẻ'}.`]
        } else {
            const ans = 'Odd' // Sum of odd numbers is always odd if count is odd
            prompt = `Is the sum of the first ${n} odd numbers (1, 3, 5...) odd or even?`; promptVi = `Tổng của ${n} số lẻ đầu tiên (1, 3, 5...) là chẵn hay lẻ?`
            answer = ans; options = ['Odd', 'Even']
            explanation = [`🔍 Step 1: Sum of odds: odd + odd = even.`, `🧠 Step 2: If there is an odd number of terms, result is odd.`, `🎯 Step 3: There are ${n} terms, so it is Odd.`]
            explanationVi = [`🔍 Bước 1: Lẻ + lẻ = chẵn.`, `🧠 Bước 2: Nếu số lượng số lẻ là lẻ, tổng là lẻ.`, `🎯 Bước 3: Có ${n} số, nên tổng là Lẻ.`]
        }
    }

    // 20. PERMUTATION (P2)
    else if (topic === 'permutation') {
        const digits = [1, 2, 3, 4, 5]
        const choices = shuffle(digits).slice(0, 3)
        const ans = 3 * 2 * 1
        prompt = `How many 3-digit numbers can be made from ${choices.join(', ')} without repeating?`; promptVi = `Có thể lập bao nhiêu số 3 chữ số từ ${choices.join(', ')} (không lặp)?`
        answer = String(ans); options = numberOptions(ans, [9, 6, 3], 1, 20)
        explanation = [`🔍 Step 1: 3 choices for hundreds.`, `🧠 Step 2: 2 choices left for tens, 1 for ones.`, `🎯 Step 3: 3 × 2 × 1 = ${ans}.`]
        explanationVi = [`🔍 Bước 1: 3 lựa chọn hàng trăm.`, `🧠 Bước 2: 2 lựa chọn hàng chục, 1 hàng đơn vị.`, `🎯 Bước 3: 3 × 2 × 1 = ${ans}.`]
    }

    // 21. FILL OPERATORS (P2)
    else if (topic === 'fill_operators') {
        const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 9)
        const ansVal = a + b * c
        prompt = `Which operators make this true? ${a} _ ${b} _ ${c} = ${ansVal}`; promptVi = `Điền dấu nào để đúng? ${a} _ ${b} _ ${c} = ${ansVal}`
        answer = '+ and ×'; options = ['+ and +', '+ and ×', '× and +', '− and ×']
        explanation = [`🔍 Step 1: Multiplication goes first.`, `🧠 Step 2: ${b} × ${c} = ${b * c}.`, `🎯 Step 3: ${a} + ${b * c} = ${ansVal}. So + and ×.`]
        explanationVi = [`🔍 Bước 1: Nhân trước.`, `🧠 Bước 2: ${b} × ${c} = ${b * c}.`, `🎯 Bước 3: ${a} + ${b * c} = ${ansVal}. Vậy + và ×.`]
    }

    // 22. DISTRIBUTION (P2)
    else if (topic === 'distribution') {
        const n = 5, k = 3 // 5 candies into 3 boxes, no empty
        const ans = 6
        prompt = `How many ways to put ${n} identical candies into ${k} different boxes so no box is empty?`
        promptVi = `Có bao nhiêu cách chia ${n} kẹo giống nhau vào ${k} hộp khác nhau (không hộp nào trống)?`
        answer = String(ans)
        options = numberOptions(ans, [10, 5, 3], 1, 15)

        explanation = [
            `🔍 Step 1: To make sure no box is empty, give 1 candy to each of the 3 boxes first.`,
            `🧠 Step 2: We had 5 candies, so we have 5 - 3 = 2 candies left.`,
            `🧠 Step 3: Now we need to distribute these 2 candies. Let's list the ways:`,
            `• Put both in one box: 3 ways (Box 1 gets both, or Box 2, or Box 3).`,
            `• Put one in two different boxes: 3 ways (Box 3 is empty, or Box 2, or Box 1).`,
            `🎯 Step 4: Total ways = 3 + 3 = 6.`
        ]
        explanationVi = [
            `🔍 Bước 1: Để chắc chắn không hộp nào trống, hãy cho mỗi hộp 1 viên kẹo trước.`,
            `🧠 Bước 2: Ban đầu có 5 viên, vậy chúng ta còn lại 5 - 3 = 2 viên kẹo.`,
            `🧠 Bước 3: Bây giờ chia 2 viên kẹo này. Cùng liệt kê các cách nhé:`,
            `• Dồn cả 2 viên vào 1 hộp: 3 cách (Hộp 1 nhận cả 2, hoặc Hộp 2, hoặc Hộp 3).`,
            `• Chia mỗi hộp 1 viên: 3 cách (Hộp 3 trống, hoặc Hộp 2 trống, hoặc Hộp 1 trống).`,
            `🎯 Bước 4: Tổng cộng = 3 + 3 = 6 cách.`
        ]
    }

    // 23. PICTOGRAPH COMPARE (P2 - Nâng cấp từ logic)
    else if (topic === 'pictograph') {
        const data = [
            { name: 'Disney', count: randInt(2, 5) },
            { name: 'Comedy', count: randInt(1, 3) },
            { name: 'Action', count: randInt(1, 4) }
        ]
        const d = data[0], c = data[1]
        const diff = (d.count - c.count) * 10
        prompt = `How many more children prefer Disney over Comedy?`; promptVi = `Có bao nhiêu bạn thích Disney hơn Comedy?`
        answer = String(diff); options = numberOptions(diff, [d.count + c.count, diff + 10, 10], 0, 50)
        visual = { type: 'pictograph', data, icon: '🍿', multiplier: 10 }
        explanation = [`🔍 Step 1: Disney = ${d.count * 10}, Comedy = ${c.count * 10}.`, `🧠 Step 2: Subtract them.`, `🎯 Step 3: ${d.count * 10} - ${c.count * 10} = ${diff}.`]
        explanationVi = [`🔍 Bước 1: Disney = ${d.count * 10}, Comedy = ${c.count * 10}.`, `🧠 Bước 2: Trừ đi.`, `🎯 Bước 3: ${d.count * 10} - ${c.count * 10} = ${diff}.`]
    }
    // ==========================================
    // 24. FIBONACCI (Dãy số cộng dồn)
    // ==========================================
    else if (topic === 'fibonacci') {
        const start1 = randInt(1, 5)
        const start2 = randInt(1, 5)
        const seq = [start1, start2, start1 + start2, start1 + 2 * start2, 2 * start1 + 3 * start2, 3 * start1 + 5 * start2]

        if (level <= 2) {
            prompt = `Find the next number: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ___`
            promptVi = `Tìm số tiếp theo: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ___`
            answer = String(seq[4])
            options = numberOptions(seq[4], [seq[4] + 1, seq[4] - 1, seq[3] * 2], 0, 100)
        } else {
            prompt = `Find the next number: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ${seq[4]}, ___`
            promptVi = `Tìm số tiếp theo: ${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ${seq[4]}, ___`
            answer = String(seq[5])
            options = numberOptions(seq[5], [seq[5] + 2, seq[5] - 1, seq[4] + 5], 0, 200)
        }

        explanation = [
            `🔍 Step 1: Look at how the numbers grow. Add the two numbers before to get the next one.`,
            `🧠 Step 2: ${seq[0]} + ${seq[1]} = ${seq[2]}. Then ${seq[1]} + ${seq[2]} = ${seq[3]}.`,
            `🎯 Step 3: Add the last two numbers: ${seq[seq.length - 2]} + ${seq[seq.length - 3]} = ${answer}.`
        ]
        explanationVi = [
            `🔍 Bước 1: Nhìn xem các số tăng lên như thế nào. Lấy 2 số trước cộng lại để được số tiếp theo.`,
            `🧠 Bước 2: ${seq[0]} + ${seq[1]} = ${seq[2]}. Rồi ${seq[1]} + ${seq[2]} = ${seq[3]}.`,
            `🎯 Bước 3: Cộng 2 số cuối lại: ${seq[seq.length - 2]} + ${seq[seq.length - 3]} = ${answer}.`
        ]
        vocab.push('next', 'pattern')
    }

    // ==========================================
    // 25. ALTERNATING SEQUENCE (Dãy số xen kẽ)
    // ==========================================
    else if (topic === 'alternating_seq') {
        const start1 = randInt(10, 50)
        const start2 = randInt(1, 9)
        const step1 = pick([-5, -10])
        const step2 = pick([2, 3])

        const seq = [
            start1, start2,
            start1 + step1, start2 + step2,
            start1 + step1 * 2, start2 + step2 * 2
        ]
        const ans = start1 + step1 * 3

        prompt = `Find the next number: ${seq.join(', ')}, ___`
        promptVi = `Tìm số tiếp theo: ${seq.join(', ')}, ___`
        answer = String(ans)
        options = numberOptions(ans, [ans + 5, ans - 10, start2 + step2 * 3], 0, 100)

        explanation = [
            `🔍 Step 1: Look at the numbers in odd positions (1st, 3rd, 5th) and even positions (2nd, 4th, 6th) separately.`,
            `🧠 Step 2: Odd positions go: ${seq[0]}, ${seq[2]}, ${seq[4]}. They change by ${step1}.`,
            `🎯 Step 3: The next number is in an odd position. ${seq[4]} + ${step1} = ${ans}.`
        ]
        explanationVi = [
            `🔍 Bước 1: Hãy tách các số ở vị trí lẻ (1, 3, 5) và vị trí chẵn (2, 4, 6) ra riêng.`,
            `🧠 Bước 2: Dãy vị trí lẻ là: ${seq[0]}, ${seq[2]}, ${seq[4]}. Chúng thay đổi bằng cách cộng ${step1}.`,
            `🎯 Bước 3: Số tiếp theo nằm ở vị trí lẻ. ${seq[4]} + ${step1} = ${ans}.`
        ]
        vocab.push('next', 'pattern')
    }

    // ==========================================
    // 26. BALANCE CHAIN (Cân chuỗi logic)
    // ==========================================
    else if (topic === 'balance_chain') {
        const items = ['Lion 🦁', 'Dog 🐶', 'Cat 🐱', 'Mouse 🐭']
        const shuffled = shuffle(items)
        const [a, b, c, d] = shuffled

        if (level <= 3) {
            // 3 con vật
            prompt = `Scale 1: ${a} is heavier than ${b}. Scale 2: ${b} is heavier than ${c}. Who is the lightest?`
            promptVi = `Cân 1: ${a} nặng hơn ${b}. Cân 2: ${b} nặng hơn ${c}. Hỏi ai nhẹ nhất?`
            answer = c
            options = shuffle([a, b, c, 'None of them'])
            explanation = [
                `🔍 Step 1: ${a} > ${b}, and ${b} > ${c}.`,
                `🧠 Step 2: This means ${a} is the heaviest, ${c} is the lightest.`,
                `🎯 Step 3: So, ${c} is the lightest.`
            ]
            explanationVi = [
                `🔍 Bước 1: ${a} > ${b}, và ${b} > ${c}.`,
                `🧠 Bước 2: Điều này có nghĩa là ${a} nặng nhất, ${c} nhẹ nhất.`,
                `🎯 Bước 3: Vậy ${c} là người nhẹ nhất.`
            ]
        } else {
            // 4 con vật, câu hỏi bẫy
            prompt = `Scale 1: ${a} is heavier than ${b}. Scale 2: ${c} is lighter than ${b}. Who is the second heaviest?`
            promptVi = `Cân 1: ${a} nặng hơn ${b}. Cân 2: ${c} nhẹ hơn ${b}. Hỏi ai nặng thứ hai?`
            answer = b
            options = shuffle([a, b, c, d])
            explanation = [
                `🔍 Step 1: ${a} > ${b}, and ${b} > ${c}. So we know ${a} > ${b} > ${c}.`,
                `🧠 Step 2: ${a} is the heaviest. ${b} is the second heaviest.`,
                `🎯 Step 3: The second heaviest is ${b}.`
            ]
            explanationVi = [
                `🔍 Bước 1: ${a} > ${b}, và ${b} > ${c}. Vậy ta biết ${a} > ${b} > ${c}.`,
                `🧠 Bước 2: ${a} nặng nhất. ${b} nặng thứ hai.`,
                `🎯 Bước 3: Người nặng thứ hai là ${b}.`
            ]
        }
        vocab.push('logic')
    }

    // ==========================================
    // 27. MAGIC SQUARE (Ma trận 3x3)
    // ==========================================
    else if (topic === 'magic_square') {
        // 8 phép quay/đối xứng chuẩn của ma trận Lo Shu 3x3 (tổng = 15)
        const baseSquares = [
            [[2, 7, 6], [9, 5, 1], [4, 3, 8]],
            [[4, 9, 2], [3, 5, 7], [8, 1, 6]],
            [[8, 3, 4], [1, 5, 9], [6, 7, 2]],
            [[6, 1, 8], [7, 5, 3], [2, 9, 4]],
            [[8, 1, 6], [3, 5, 7], [4, 9, 2]],
            [[6, 7, 2], [1, 5, 9], [8, 3, 4]],
            [[2, 9, 4], [7, 5, 3], [6, 1, 8]],
            [[4, 3, 8], [9, 5, 1], [2, 7, 6]]
        ]
        const base = baseSquares[randInt(0, baseSquares.length - 1)]
        const r = randInt(0, 2)
        const c = randInt(0, 2)
        const answerVal = base[r][c]
        const magicSum = 15

        // Các số đã biết trong hàng chứa ô thiếu
        const rowKnown = base[r].filter((_, idx) => idx !== c)
        const sumKnown = rowKnown[0] + rowKnown[1]
        const completeRowIdx = r === 0 ? 1 : 0
        const compRow = base[completeRowIdx]

        prompt = `In this magic square, the sum of each row, column, and diagonal is the same. What is the missing number?`
        audioText = `In this magic square, what is the missing number?`
        promptVi = `Trong ma trận kỳ diệu này, tổng các số ở mỗi hàng, cột và đường chéo đều bằng 15. Số còn thiếu là gì?`
        answer = String(answerVal)
        options = numberOptions(answerVal, [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== answerVal), 1, 9)

        explanation = [
            `🔍 Step 1: Check a complete row to find the magic sum: ${compRow[0]} + ${compRow[1]} + ${compRow[2]} = ${magicSum}.`,
            `🧠 Step 2: In row ${r + 1}, the numbers are ${rowKnown[0]}, ?, and ${rowKnown[1]}. Their sum must be ${magicSum}: ${rowKnown[0]} + ? + ${rowKnown[1]} = ${magicSum}.`,
            `🎯 Step 3: ${sumKnown} + ? = ${magicSum} ➔ ? = ${magicSum} - ${sumKnown} = ${answerVal}.`
        ]
        explanationVi = [
            `🔍 Bước 1: Xem hàng hoàn chỉnh để biết tổng ma trận: ${compRow[0]} + ${compRow[1]} + ${compRow[2]} = ${magicSum}.`,
            `🧠 Bước 2: Ở hàng ${r + 1}, ta có ${rowKnown[0]}, ? và ${rowKnown[1]}. Tổng phải là ${magicSum}: ${rowKnown[0]} + ? + ${rowKnown[1]} = ${magicSum}.`,
            `🎯 Bước 3: ${sumKnown} + ? = ${magicSum} ➔ ? = ${magicSum} - ${sumKnown} = ${answerVal}.`
        ]

        visual = {
            type: 'magic_square',
            grid: base,
            missingR: r,
            missingC: c,
            magicSum: 15,
            data: { base, missingR: r, missingC: c, magicSum: 15 }
        }
    }

    // ==========================================
    // 28. COIN COMBINATION (Tổ hợp tiền xu)
    // ==========================================
    else if (topic === 'coin_combination') {
        const c1 = 2, c2 = 3, c3 = 1 // Số lượng đồng 1, 2, 5
        const maxVal = c1 * 1 + c2 * 2 + c3 * 5

        if (level <= 3) {
            prompt = `If you have ${c1} coin of 1¢ and ${c2} coins of 2¢, how many different total amounts can you make?`
            audioText = `How many different total amounts can you make?`
            promptVi = `Nếu có ${c1} đồng 1 xu và ${c2} đồng 2 xu, bạn có thể tạo ra bao nhiêu tổng số tiền khác nhau (lớn hơn 0)?`
            answer = '8'
            options = numberOptions(8, [6, 7, 9, 10], 1, 15)
            explanation = [
                `🔍 Step 1: List the amounts you can make starting from 1¢.`,
                `🧠 Step 2: 1¢, 2¢, 3¢ (1+2), 4¢ (2+2), 5¢ (1+2+2), 6¢ (2+2+2), 7¢ (1+1+2+2-wait, 1+2+2+2), 8¢ (1+1+2+2+2).`,
                `🎯 Step 3: All amounts from 1 to 8 can be made, so there are 8 different amounts.`
            ]
            explanationVi = [
                `🔍 Bước 1: Liệt kê các số tiền có thể tạo thành từ 1 xu.`,
                `🧠 Bước 2: 1, 2, 3, 4, 5, 6, 7, 8 xu (tất cả các số từ 1 đến 8 đều ghép được).`,
                `🎯 Bước 3: Có 8 giá trị tiền khác nhau có thể tạo thành.`
            ]
            visual = {
                type: 'coins',
                coins: [
                    { value: 1, count: c1, label: '1¢' },
                    { value: 2, count: c2, label: '2¢' }
                ]
            }
        } else {
            // L4-L5: 1, 2, 5
            prompt = `You have ${c1} coin of 1¢, ${c2} coins of 2¢, and ${c3} coin of 5¢. How many different total amounts can you make (not including 0)?`
            audioText = `How many different total amounts can you make?`
            promptVi = `Bạn có ${c1} đồng 1 xu, ${c2} đồng 2 xu và ${c3} đồng 5 xu. Có bao nhiêu tổng số tiền khác nhau có thể tạo ra (không tính 0)?`
            answer = String(maxVal)
            options = numberOptions(maxVal, [maxVal - 1, maxVal + 1, 10], 1, 20)
            explanation = [
                `🔍 Step 1: Find the maximum amount: ${c1}×1 + ${c2}×2 + ${c3}×5 = ${maxVal}.`,
                `🧠 Step 2: Because we have small change (1¢ and 2¢), every integer amount from 1 to ${maxVal} can be formed.`,
                `🎯 Step 3: So there are ${maxVal} different amounts.`
            ]
            explanationVi = [
                `🔍 Bước 1: Tìm số tiền lớn nhất: ${c1}×1 + ${c2}×2 + ${c3}×5 = ${maxVal}.`,
                `🧠 Bước 2: Vì có đủ tiền lẻ (1¢ và 2¢), mọi số tiền nguyên từ 1 đến ${maxVal} đều tạo được.`,
                `🎯 Bước 3: Vậy có ${maxVal} giá trị khác nhau.`
            ]
            visual = {
                type: 'coins',
                coins: [
                    { value: 1, count: c1, label: '1¢' },
                    { value: 2, count: c2, label: '2¢' },
                    { value: 5, count: c3, label: '5¢' }
                ]
            }
        }
        vocab.push('money')
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
    const base8Topics: EnglishTopic[] = ['number', 'addsub', 'muldiv', 'word', 'pattern', 'geometry', 'measure', 'logic']
    const allTopics: EnglishTopic[] = [
        'number', 'addsub', 'muldiv', 'word', 'pattern',
        'geometry', 'measure', 'logic', 'detective', 'elimination', 'algebra', 'cryptarithm', 'arithmetic_series',
        'position', 'age', 'sequence', 'day_calc', 'mult_principle', 'even_odd', 'permutation', 'fill_operators', 'distribution', 'pictograph', 'fibonacci', 'alternating_seq', 'balance_chain', 'magic_square', 'coin_combination'
    ]

    const selectedTopics: EnglishTopic[] = []
    if (level <= 2) {
        selectedTopics.push(...base8Topics)
        while (selectedTopics.length < count) {
            selectedTopics.push(pick(base8Topics))
        }
    } else {
        const shuffledTopics = shuffle([...allTopics])
        const numDifferent = Math.min(count, allTopics.length)
        for (let i = 0; i < numDifferent; i++) selectedTopics.push(shuffledTopics[i])
    }

    const questions: EnglishQuestion[] = []
    const seenPrompts = new Set<string>()

    for (const t of selectedTopics) {
        let q: EnglishQuestion
        let attempts = 0
        do { q = generateQuestion(level, t); attempts++ } while (seenPrompts.has(q.prompt + q.answer) && attempts < 30)
        seenPrompts.add(q.prompt + q.answer)
        questions.push(q)
    }

    return shuffleNoAdjacent(questions)
}