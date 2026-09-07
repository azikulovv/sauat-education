import type { Subject } from './types'

export const subjects: Subject[] = [
  {
    id: 'subject-math',
    title: 'Математика',
    description: 'Алгебра, геометрия и подготовка к экзаменам.',
    icon: 'calculator',
    progress: 72,
    completedTopics: 18,
    totalTopics: 25,
    requiredTopics: 20,
    completedRequiredTopics: 16,
  },
  {
    id: 'subject-history',
    title: 'История Казахстана',
    description: 'Ключевые события и личности от древности до современности.',
    icon: 'landmark',
    progress: 48,
    completedTopics: 12,
    totalTopics: 25,
    requiredTopics: 18,
    completedRequiredTopics: 9,
  },
  {
    id: 'subject-physics',
    title: 'Физика',
    description: 'Понятия, формулы и задачи для уверенного понимания предмета.',
    icon: 'flask-conical',
    progress: 26,
    completedTopics: 5,
    totalTopics: 19,
    requiredTopics: 15,
    completedRequiredTopics: 4,
  },
]
