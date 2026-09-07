export type LessonStatus = 'not-started' | 'in-progress' | 'completed'

export interface LessonTimecode {
  id: string
  label: string
  time: string
}

export interface Lesson {
  id: string
  subjectId: string
  title: string
  description: string
  duration: number
  videoUrl?: string
  completed: boolean
  required: boolean
  progress?: number
  notes?: string
  timecodes: LessonTimecode[]
}
