export interface QuizOption {
  id: string
  label: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  correctAnswer?: string
  explanation?: string
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  description: string
  questions: QuizQuestion[]
  passingScore: number
  attempts: number
}
