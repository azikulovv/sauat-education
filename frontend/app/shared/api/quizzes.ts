import type { Quiz } from '~/entities/quiz'
import { lessonQuiz } from '~/entities/quiz'

export async function getQuiz(quizId: string): Promise<Quiz | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 250))

  return quizId === lessonQuiz.id ? lessonQuiz : undefined
}

export async function getQuizForLesson(lessonId: string): Promise<Quiz | undefined> {
  if (lessonId !== lessonQuiz.lessonId) {
    return undefined
  }

  return getQuiz(lessonQuiz.id)
}
