import type { QuestionVisual } from '../types'

/**
 * Kết quả chung mà mọi Generator phải trả về.
 */
export type GeneratorResult = {
    prompt: string
    audioText: string
    promptVi: string
    answer: string
    options: string[]
    explanation: string[]
    explanationVi: string[]
    vocab: string[]
    visual?: QuestionVisual
}