import { apiFetch } from './client'

export interface AdminStats {
  users: number
  subjects: number
  lessons: number
  quizzes: number
  attempts: number
  passedAttempts: number
  completionRate: number
}

export interface AdminSubject {
  id: string
  title: string
  description: string
  icon?: string | null
  sortOrder: number
  lessonsCount: number
  requiredLessonsCount: number
}

export interface AdminLesson {
  id: string
  subjectId: string
  subjectTitle?: string
  title: string
  description: string
  duration: number
  required: boolean
  notes?: string | null
  videoUrl?: string | null
  timecodes: { id: string; label: string; time: string }[]
  sortOrder: number
  quizId?: string | null
  quizTitle?: string | null
}

export interface AdminUser {
  id: string
  email: string
  name: string
  locale: string
  role: 'student' | 'admin'
  createdAt: string
  attempts: number
  completedLessons: number
}

export interface AdminSubjectInput {
  id: string
  title: string
  description: string
  icon?: string
  sortOrder: number
}

export interface AdminLessonInput {
  id: string
  subjectId: string
  title: string
  description: string
  duration: number
  required: boolean
  notes?: string
  videoUrl?: string
  timecodes: { id: string; label: string; time: string }[]
  sortOrder: number
}

export function getAdminStats() {
  return apiFetch<AdminStats>('/admin/stats')
}

export function getAdminSubjects() {
  return apiFetch<AdminSubject[]>('/admin/subjects')
}

export function createAdminSubject(input: AdminSubjectInput) {
  return apiFetch<AdminSubject>('/admin/subjects', { method: 'POST', body: input })
}

export function updateAdminSubject(id: string, input: Partial<AdminSubjectInput>) {
  return apiFetch<AdminSubject>(`/admin/subjects/${id}`, { method: 'PATCH', body: input })
}

export function deleteAdminSubject(id: string) {
  return apiFetch<void>(`/admin/subjects/${id}`, { method: 'DELETE' })
}

export function getAdminLessons(subjectId?: string) {
  const query = subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : ''
  return apiFetch<AdminLesson[]>(`/admin/lessons${query}`)
}

export function createAdminLesson(input: AdminLessonInput) {
  return apiFetch<AdminLesson>('/admin/lessons', { method: 'POST', body: input })
}

export function updateAdminLesson(id: string, input: Partial<AdminLessonInput>) {
  return apiFetch<AdminLesson>(`/admin/lessons/${id}`, { method: 'PATCH', body: input })
}

export function deleteAdminLesson(id: string) {
  return apiFetch<void>(`/admin/lessons/${id}`, { method: 'DELETE' })
}

export function getAdminUsers() {
  return apiFetch<AdminUser[]>('/admin/users')
}
