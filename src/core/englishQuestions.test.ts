import { describe, it, expect } from 'vitest'
import { generateQuestion, buildSession } from './englishQuestions'
import { numberToWords } from './englishNumbers'
import { VOCABULARY_BANK } from './vocabulary'
import type { EnglishLevel, EnglishTopic } from './types'

const topics: EnglishTopic[] = ['number', 'addsub', 'muldiv', 'word', 'pattern', 'geometry', 'measure', 'logic']
const levels: EnglishLevel[] = [1, 2]
const allVocabIds = new Set(VOCABULARY_BANK.map(v => v.id))

describe('English Question Generator', () => {
    it('12. numberToWords works correctly (including 205, 1000)', () => {
        expect(numberToWords(0)).toBe('zero')
        expect(numberToWords(13)).toBe('thirteen')
        expect(numberToWords(20)).toBe('twenty')
        expect(numberToWords(21)).toBe('twenty-one')
        expect(numberToWords(45)).toBe('forty-five')
        expect(numberToWords(100)).toBe('one hundred')
        expect(numberToWords(205)).toBe('two hundred and five')
        expect(numberToWords(1000)).toBe('one thousand')
    })

    levels.forEach(level => {
        topics.forEach(topic => {
            it(`Generates valid questions for Level ${level}, Topic ${topic} (2000 iters)`, () => {
                const maxNum = level === 1 ? 20 : 100

                for (let i = 0; i < 2000; i++) {
                    const q = generateQuestion(level, topic)

                    // 1. Options length, uniqueness, contains answer
                    expect(q.options.length).toBe(4)
                    expect(new Set(q.options).size).toBe(4)
                    expect(q.options).toContain(q.answer)

                    // 2. No NaN/undefined/null
                    expect(q.prompt).toBeTruthy()
                    expect(q.promptVi).toBeTruthy()
                    expect(q.explanation.length).toBe(q.explanationVi.length)
                    q.options.forEach(o => expect(o).toBeTruthy())

                    // 3. Answer range for numbers
                    if (['number', 'addsub', 'pattern'].includes(topic) && !isNaN(Number(q.answer))) {
                        const ansNum = Number(q.answer)
                        expect(ansNum).toBeGreaterThanOrEqual(0)
                        expect(ansNum).toBeLessThanOrEqual(maxNum)
                    }

                    // 4. Distractor format
                    if (/^\d+:\d{2}$/.test(q.answer)) {
                        q.options.forEach(o => expect(/^\d+:\d{2}$/.test(o)).toBe(true))
                    } else if (!isNaN(Number(q.answer))) {
                        q.options.forEach(o => expect(isNaN(Number(o))).toBe(false))
                    }

                    // 5. Audio text (no _, no digits)
                    expect(q.audioText).not.toContain('_')
                    expect(q.audioText).not.toMatch(/[0-9]/)

                    // 6. promptVi no English items
                    const items = ['apples', 'pens', 'books', 'candies', 'stickers', 'balls']
                    items.forEach(item => expect(q.promptVi).not.toContain(item))

                    // 7. Grammar (1 pens, He/She)
                    expect(q.prompt).not.toMatch(/\b1\s+(pens|books|candies|stickers|balls)\b/)
                    if (q.prompt.includes('He')) expect(q.prompt).not.toContain('Anna')
                    if (q.prompt.includes('She')) expect(q.prompt).not.toContain('Tom')

                    // 8. Word count limits
                    const wordCount = q.prompt.split(/\s+/).length
                    if (topic === 'word') {
                        expect(wordCount).toBeLessThanOrEqual(level === 1 ? 14 : 22)
                    } else {
                        expect(wordCount).toBeLessThanOrEqual(level === 1 ? 8 : 12)
                    }

                    // 9. Vocab exists
                    q.vocab.forEach(v => expect(allVocabIds.has(v)).toBe(true))

                    // 10. Explanations not empty
                    expect(q.explanation.length).toBeGreaterThan(0)
                    expect(q.explanationVi.length).toBeGreaterThan(0)

                    // 13. Measure clock format
                    if (topic === 'measure' && level === 2 && q.visual?.type === 'clock') {
                        expect(q.answer).toBe(`${q.visual.hour}:${q.visual.minute === 0 ? '00' : '30'}`)
                    }
                }
            })
        })
    })

    it('11. buildSession contains all 8 topics, no duplicate prompts, no adjacent same topics', () => {
        for (let i = 0; i < 50; i++) {
            const session = buildSession(1, 10)
            expect(session.length).toBe(10)

            const sessionTopics = new Set(session.map(q => q.topic))
            topics.forEach(t => expect(sessionTopics.has(t)).toBe(true))

            const prompts = new Set(session.map(q => q.prompt))
            expect(prompts.size).toBe(10)

            for (let j = 0; j < session.length - 1; j++) {
                expect(session[j].topic).not.toBe(session[j + 1].topic)
            }
        }
    })
})