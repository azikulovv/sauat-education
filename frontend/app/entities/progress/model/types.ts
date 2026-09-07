export type ProgressStatus = 'not-started' | 'in-progress' | 'completed'

export interface Progress {
  percentage: number
  completed: number
  total: number
  current: number
  status: ProgressStatus
}
