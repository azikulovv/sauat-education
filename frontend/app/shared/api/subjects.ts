import type { Subject } from '~/entities/subject'
import { apiFetch } from './client'

export function getSubjects(): Promise<Subject[]> {
  return apiFetch<Subject[]>('/subjects')
}

export function getSubject(subjectId: string): Promise<Subject> {
  return apiFetch<Subject>(`/subjects/${subjectId}`)
}
