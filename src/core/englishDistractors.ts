export function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export function numberOptions(answer: number, extra: number[] = [], min = 0, max = Infinity): string[] {
    const valid = (n: number) => Number.isInteger(n) && n >= min && n <= max && n !== answer
    const pool: number[] = []
    for (const n of extra) if (valid(n) && !pool.includes(n)) pool.push(n)

    const near = shuffle([1, -1, 2, -2, 3, -3, 5, -5, 10, -10].map(d => answer + d).filter(valid))
    for (const n of near) if (!pool.includes(n)) pool.push(n)

    for (let k = 1; pool.length < 3 && k <= 200; k++) {
        for (const n of [answer + k, answer - k]) {
            if (valid(n) && !pool.includes(n)) pool.push(n)
        }
    }

    if (pool.length < 3) {
        // Nếu vẫn chưa đủ, nới lỏng max
        for (let k = 1; pool.length < 3 && k <= 500; k++) {
            for (const n of [answer + k, answer - k]) {
                if (n !== answer && !pool.includes(n) && n >= 0) pool.push(n)
            }
        }
    }

    return shuffle([answer, ...pool.slice(0, 3)]).map(String)
}

export function wordOptions(answer: string, family: string[]): string[] {
    const others = shuffle(family.filter(w => w !== answer))
    if (others.length < 3) throw new Error(`Họ từ quá nhỏ cho "${answer}"`)
    return shuffle([answer, ...others.slice(0, 3)])
}

export function timeOptions(hour: number, minute: 0 | 30): string[] {
    const format = (h: number, m: number) => `${h}:${m === 0 ? '00' : '30'}`
    const correct = format(hour, minute)

    const pool = new Set<string>()
    const add = (h: number, m: 0 | 30) => {
        let newH = h
        if (newH > 12) newH -= 12
        if (newH < 1) newH += 12
        const str = format(newH, m)
        if (str !== correct) pool.add(str)
    }

    add(hour, minute === 0 ? 30 : 0)
    add(hour + 1, minute)
    add(hour - 1, minute)
    add(hour + 2, minute)
    add(hour - 2, minute)

    const picked = shuffle([...pool]).slice(0, 3)
    return shuffle([correct, ...picked])
}