import type { Difficulty, Question } from './types'
import { createQuestion } from '../MathPractice'

export function createMathQ(difficulty: Difficulty): Question {
    const q = createQuestion(difficulty)
    return {
        id: `boss_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        difficulty,
        subSkill: q.subSkill,
        prompt: q.prompt,
        options: q.options,
        answer: q.answer,
        explanation: [`Đáp án đúng là ${q.answer}`],
    }
}
