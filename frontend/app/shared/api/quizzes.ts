import type { Quiz } from '~/entities/quiz'
import { apiFetch } from './client'

export function getQuiz(quizId: string): Promise<Quiz> {
  return apiFetch<Quiz>(`/quizzes/${quizId}`)
}

export function getQuizForLesson(lessonId: string): Promise<Quiz | null> {
  return apiFetch<Quiz | null>(`/lessons/${lessonId}/quiz`)
}

export interface QuizAnswerCheck {
  isCorrect: boolean
  correctAnswer: string
  explanation?: string
}

export function checkQuizAnswer(quizId: string, questionId: string, answerId: string) {
  return apiFetch<QuizAnswerCheck>(`/quizzes/${quizId}/check`, {
    method: 'POST',
    body: { questionId, answerId },
  })
}

export function submitQuizAttempt(quizId: string, answers: Record<string, string>) {
  return apiFetch<{ score: number; total: number; percentage: number; passed: boolean; mistakes: { questionId: string; selectedAnswer: string; correctAnswer: string }[] }>(
    `/quizzes/${quizId}/attempts`,
    { method: 'POST', body: { answers } },
  )
}
