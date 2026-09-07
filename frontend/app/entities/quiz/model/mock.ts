import type { Quiz } from './types'

export const lessonQuiz: Quiz = {
  id: 'quiz-quadratic-equations',
  lessonId: 'lesson-quadratic-equations',
  title: 'Проверка: квадратные уравнения',
  description: 'Проверьте, насколько хорошо вы усвоили материал урока.',
  passingScore: 70,
  attempts: 1,
  questions: [
    {
      id: 'question-1',
      question: 'Чему равен дискриминант уравнения x² + 4x + 3 = 0?',
      options: [
        { id: 'a', label: '4' },
        { id: 'b', label: '16' },
        { id: 'c', label: '−4' },
        { id: 'd', label: '28' },
      ],
      correctAnswer: 'b',
      explanation: 'D = b² − 4ac = 4² − 4 × 1 × 3 = 4.',
    },
  ],
}
