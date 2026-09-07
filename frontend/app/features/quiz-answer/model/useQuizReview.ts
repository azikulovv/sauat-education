import type { QuizAnswerResult } from './useQuizAnswer'

export function useQuizReview(quizId: string) {
  return useState<QuizAnswerResult | null>(`quiz-review-result:${quizId}`, () => null)
}
