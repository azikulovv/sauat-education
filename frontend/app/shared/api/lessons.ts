import type { Lesson } from '~/entities/lesson'
import { apiFetch } from './client'

export function getLessons(subjectId?: string): Promise<Lesson[]> {
  const query = subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : ''
  return apiFetch<Lesson[]>(`/lessons${query}`)
}

export function getLesson(lessonId: string): Promise<Lesson> {
  return apiFetch<Lesson>(`/lessons/${lessonId}`)
}

export function completeLesson(lessonId: string): Promise<Lesson> {
  return apiFetch<Lesson>(`/lessons/${lessonId}/complete`, { method: 'POST' })
}
