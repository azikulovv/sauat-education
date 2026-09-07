import type { Lesson } from './types'

export const currentLesson: Lesson = {
  id: 'lesson-quadratic-equations',
  subjectId: 'subject-math',
  title: 'Квадратные уравнения',
  description: 'Разбираем дискриминант и учимся находить корни квадратного уравнения.',
  duration: 24,
  completed: false,
  required: true,
  progress: 64,
  timecodes: [
    { id: 'intro', label: 'Введение', time: '00:00' },
    { id: 'formula', label: 'Формула дискриминанта', time: '06:42' },
    { id: 'practice', label: 'Практика', time: '15:10' },
  ],
}

export const lessons: Lesson[] = [currentLesson]
