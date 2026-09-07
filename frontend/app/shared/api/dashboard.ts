import type { Lesson } from '~/entities/lesson'
import type { Progress } from '~/entities/progress'
import type { Student } from '~/entities/student'
import type { Subject } from '~/entities/subject'
import { apiFetch } from './client'

export interface DashboardResponse {
  student: Student
  subjects: Subject[]
  progress: Progress
  currentLesson: Lesson | null
}

export function getDashboard() {
  return apiFetch<DashboardResponse>('/dashboard')
}
