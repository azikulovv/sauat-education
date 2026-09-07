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
      id: 'question-quadratic-1',
      question: 'Чему равен дискриминант уравнения x² + 4x + 3 = 0?',
      options: [
        { id: 'a', label: '4' },
        { id: 'b', label: '16' },
        { id: 'c', label: '−4' },
        { id: 'd', label: '28' },
      ],
      correctAnswer: 'a',
      explanation: 'D = b² − 4ac = 4² − 4 × 1 × 3 = 4.',
    },
    {
      id: 'question-quadratic-2',
      question: 'Сколько корней имеет квадратное уравнение при D < 0?',
      options: [
        { id: 'a', label: 'Два корня' },
        { id: 'b', label: 'Один корень' },
        { id: 'c', label: 'Нет действительных корней' },
        { id: 'd', label: 'Всегда три корня' },
      ],
      correctAnswer: 'c',
      explanation:
        'При отрицательном дискриминанте квадратное уравнение не имеет действительных корней.',
    },
    {
      id: 'question-quadratic-3',
      question: 'Как называется выражение b² − 4ac?',
      options: [
        { id: 'a', label: 'Коэффициент' },
        { id: 'b', label: 'Дискриминант' },
        { id: 'c', label: 'Производная' },
        { id: 'd', label: 'Модуль' },
      ],
      correctAnswer: 'b',
      explanation: 'Выражение b² − 4ac называется дискриминантом квадратного уравнения.',
    },
  ],
}

export const quizzes: Quiz[] = [
  lessonQuiz,
  {
    id: 'quiz-linear-equations',
    lessonId: 'lesson-linear-equations',
    title: 'Проверка: линейные уравнения',
    description: 'Закрепите правила преобразования линейных уравнений.',
    passingScore: 70,
    attempts: 2,
    questions: [
      {
        id: 'question-linear-1',
        question: 'Чему равен x в уравнении 3x + 6 = 0?',
        options: [
          { id: 'a', label: '−2' },
          { id: 'b', label: '2' },
          { id: 'c', label: '−3' },
          { id: 'd', label: '6' },
        ],
        correctAnswer: 'a',
        explanation: 'Переносим 6 вправо: 3x = −6, поэтому x = −2.',
      },
      {
        id: 'question-linear-2',
        question: 'Какое действие сохраняет равенство?',
        options: [
          { id: 'a', label: 'Прибавить одно число только слева' },
          { id: 'b', label: 'Умножить обе части на одно и то же число' },
          { id: 'c', label: 'Изменить знак только у x' },
          { id: 'd', label: 'Удалить свободный член' },
        ],
        correctAnswer: 'b',
        explanation:
          'Равенство сохраняется, если выполнить одинаковое действие с обеими его частями.',
      },
    ],
  },
  {
    id: 'quiz-kazakh-khanate',
    lessonId: 'lesson-kazakh-khanate',
    title: 'Проверка: Казахское ханство',
    description: 'Проверьте знания о предпосылках и значении образования ханства.',
    passingScore: 70,
    attempts: 1,
    questions: [
      {
        id: 'question-khanate-1',
        question: 'Кто считается основателями Казахского ханства?',
        options: [
          { id: 'a', label: 'Керей и Жанибек' },
          { id: 'b', label: 'Абылай и Кенесары' },
          { id: 'c', label: 'Аль-Фараби и Яссауи' },
          { id: 'd', label: 'Тауке и Касым' },
        ],
        correctAnswer: 'a',
        explanation:
          'Керей и Жанибек возглавили переселение и стали первыми ханами нового государства.',
      },
      {
        id: 'question-khanate-2',
        question: 'В каком веке сформировалось Казахское ханство?',
        options: [
          { id: 'a', label: 'XIII веке' },
          { id: 'b', label: 'XIV веке' },
          { id: 'c', label: 'XV веке' },
          { id: 'd', label: 'XVII веке' },
        ],
        correctAnswer: 'c',
        explanation: 'Казахское ханство возникло в XV веке, ориентировочно в 1465–1466 годах.',
      },
    ],
  },
  {
    id: 'quiz-motion',
    lessonId: 'lesson-motion',
    title: 'Проверка: равномерное движение',
    description: 'Проверьте понимание связи пути, времени и скорости.',
    passingScore: 70,
    attempts: 3,
    questions: [
      {
        id: 'question-motion-1',
        question: 'Как найти скорость при равномерном движении?',
        options: [
          { id: 'a', label: 'v = s / t' },
          { id: 'b', label: 'v = s × t' },
          { id: 'c', label: 'v = t / s' },
          { id: 'd', label: 'v = s + t' },
        ],
        correctAnswer: 'a',
        explanation: 'Скорость равна отношению пройденного пути ко времени движения.',
      },
      {
        id: 'question-motion-2',
        question: 'Что показывает наклон графика пути от времени?',
        options: [
          { id: 'a', label: 'Массу тела' },
          { id: 'b', label: 'Скорость движения' },
          { id: 'c', label: 'Температуру' },
          { id: 'd', label: 'Плотность среды' },
        ],
        correctAnswer: 'b',
        explanation: 'На графике s(t) наклон линии характеризует скорость движения тела.',
      },
    ],
  },
  {
    id: 'quiz-cell',
    lessonId: 'lesson-cell',
    title: 'Проверка: строение клетки',
    description: 'Повторите функции основных органоидов клетки.',
    passingScore: 70,
    attempts: 1,
    questions: [
      {
        id: 'question-cell-1',
        question: 'Какой органоид хранит наследственную информацию?',
        options: [
          { id: 'a', label: 'Рибосома' },
          { id: 'b', label: 'Ядро' },
          { id: 'c', label: 'Вакуоль' },
          { id: 'd', label: 'Клеточная стенка' },
        ],
        correctAnswer: 'b',
        explanation: 'В ядре клетки находится большая часть генетического материала.',
      },
      {
        id: 'question-cell-2',
        question: 'Где происходит синтез белка?',
        options: [
          { id: 'a', label: 'На рибосомах' },
          { id: 'b', label: 'В лизосомах' },
          { id: 'c', label: 'В клеточной стенке' },
          { id: 'd', label: 'В вакуоли' },
        ],
        correctAnswer: 'a',
        explanation: 'Рибосомы собирают белковые молекулы по информации, записанной в РНК.',
      },
    ],
  },
  {
    id: 'quiz-algorithms',
    lessonId: 'lesson-algorithms',
    title: 'Проверка: алгоритмы',
    description: 'Проверьте понимание свойств алгоритмов и блок-схем.',
    passingScore: 70,
    attempts: 2,
    questions: [
      {
        id: 'question-algorithms-1',
        question: 'Какое свойство означает, что алгоритм состоит из отдельных шагов?',
        options: [
          { id: 'a', label: 'Дискретность' },
          { id: 'b', label: 'Массовость' },
          { id: 'c', label: 'Результативность' },
          { id: 'd', label: 'Определённость' },
        ],
        correctAnswer: 'a',
        explanation:
          'Дискретность означает разделение алгоритма на последовательные элементарные шаги.',
      },
      {
        id: 'question-algorithms-2',
        question: 'Какая фигура обычно обозначает условие в блок-схеме?',
        options: [
          { id: 'a', label: 'Прямоугольник' },
          { id: 'b', label: 'Ромб' },
          { id: 'c', label: 'Овал' },
          { id: 'd', label: 'Стрелка' },
        ],
        correctAnswer: 'b',
        explanation: 'Ромб обозначает проверку условия и ветвление алгоритма.',
      },
    ],
  },
]
