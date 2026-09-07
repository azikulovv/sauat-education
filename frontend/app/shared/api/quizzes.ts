import type { Quiz } from '~/entities/quiz'
import { quizzes } from '~/entities/quiz'

export async function getQuiz(quizId: string): Promise<Quiz | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 250))

  return quizzes.find((quiz) => quiz.id === quizId)
}

export async function getQuizForLesson(lessonId: string): Promise<Quiz | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  return quizzes.find((quiz) => quiz.lessonId === lessonId)
}
