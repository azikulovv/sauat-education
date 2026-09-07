export type SubjectIconName =
  'book-open' | 'calculator' | 'flask-conical' | 'languages' | 'landmark'

export type SubjectStatus = 'not-started' | 'in-progress' | 'completed'

export interface Subject {
  id: string
  title: string
  description: string
  icon?: SubjectIconName
  progress: number
  completedTopics: number
  totalTopics: number
  requiredTopics: number
  completedRequiredTopics: number
}
