import type { Lesson } from '~/entities/lesson'
import { lessons } from '~/entities/lesson'

export async function getLessons(subjectId?: string): Promise<Lesson[]> {
  await new Promise((resolve) => setTimeout(resolve, 250))

  if (!subjectId) {
    return lessons
  }

  return lessons.filter((lesson) => lesson.subjectId === subjectId)
}

export async function getLesson(lessonId: string): Promise<Lesson | undefined> {
  const result = await getLessons()

  return result.find((lesson) => lesson.id === lessonId)
}

export async function completeLesson(lessonId: string): Promise<Lesson> {
  const lesson = await getLesson(lessonId)

  if (!lesson) {
    throw new Error('Урок не найден.')
  }

  return {
    ...lesson,
    completed: true,
    progress: 100,
  }
}
