import bcrypt from 'bcryptjs'
import { pool, withTransaction } from './db.js'

const demoUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'aliya.sadykova@example.com',
  password: 'Demo1234!',
  name: 'Алия Садыкова',
  locale: 'ru',
  role: 'student',
}

const subjects = [
  ['subject-math', 'Математика', 'Алгебра, геометрия и подготовка к экзаменам.', 'calculator', 1],
  ['subject-history', 'История Казахстана', 'Ключевые события и личности от древности до современности.', 'landmark', 2],
  ['subject-physics', 'Физика', 'Понятия, формулы и задачи для уверенного понимания предмета.', 'flask-conical', 3],
  ['subject-biology', 'Биология', 'Клетка, генетика и основы физиологии человека.', 'flask-conical', 4],
  ['subject-kazakh-language', 'Казахский язык', 'Грамматика, синтаксис и практика грамотной речи.', 'languages', 5],
  ['subject-informatics', 'Информатика', 'Алгоритмы, программирование и цифровая грамотность.', 'book-open', 6],
] as const

type LessonSeed = {
  id: string
  subjectId: string
  title: string
  description: string
  duration: number
  required: boolean
  progress: number
  notes: string
  timecodes: { id: string; label: string; time: string }[]
  sortOrder: number
}

const lessons: LessonSeed[] = [
  { id: 'lesson-linear-equations', subjectId: 'subject-math', title: 'Линейные уравнения', description: 'Повторяем свойства равенств и решаем уравнения в несколько действий.', duration: 18, required: true, progress: 100, notes: 'Линейное уравнение содержит переменную только в первой степени.', timecodes: [{ id: 'intro', label: 'Что такое уравнение', time: '00:00' }, { id: 'practice', label: 'Разбор задач', time: '11:45' }], sortOrder: 1 },
  { id: 'lesson-quadratic-equations', subjectId: 'subject-math', title: 'Квадратные уравнения', description: 'Разбираем дискриминант и учимся находить корни квадратного уравнения.', duration: 24, required: true, progress: 64, notes: 'Квадратное уравнение имеет вид ax² + bx + c = 0. Сначала вычисляем дискриминант.', timecodes: [{ id: 'intro', label: 'Введение', time: '00:00' }, { id: 'formula', label: 'Формула дискриминанта', time: '06:42' }, { id: 'practice', label: 'Практика', time: '15:10' }], sortOrder: 2 },
  { id: 'lesson-kazakh-khanate', subjectId: 'subject-history', title: 'Образование Казахского ханства', description: 'Предпосылки создания ханства и роль Керея и Жанибека.', duration: 22, required: true, progress: 100, notes: 'Казахское ханство сформировалось в XV веке после отделения Керея и Жанибека.', timecodes: [{ id: 'context', label: 'Исторический контекст', time: '00:00' }, { id: 'founders', label: 'Керей и Жанибек', time: '08:10' }], sortOrder: 1 },
  { id: 'lesson-golden-horde', subjectId: 'subject-history', title: 'Золотая Орда', description: 'Государственное устройство, торговые пути и культурное наследие.', duration: 29, required: true, progress: 48, notes: 'Золотая Орда была крупным государством Евразии.', timecodes: [{ id: 'state', label: 'Возникновение государства', time: '00:00' }, { id: 'legacy', label: 'Историческое наследие', time: '23:40' }], sortOrder: 2 },
  { id: 'lesson-motion', subjectId: 'subject-physics', title: 'Равномерное движение', description: 'Скорость, путь и время: строим модели движения и читаем графики.', duration: 21, required: true, progress: 100, notes: 'При равномерном движении тело за равные промежутки времени проходит одинаковые расстояния.', timecodes: [{ id: 'values', label: 'Путь, время, скорость', time: '00:00' }, { id: 'task', label: 'Задача на движение', time: '15:36' }], sortOrder: 1 },
  { id: 'lesson-newtons-laws', subjectId: 'subject-physics', title: 'Законы Ньютона', description: 'Разбираем связь силы, массы и ускорения на понятных примерах.', duration: 34, required: true, progress: 34, notes: 'Законы Ньютона описывают, как силы изменяют движение тел.', timecodes: [{ id: 'first', label: 'Первый закон', time: '00:00' }, { id: 'second', label: 'Второй закон', time: '12:30' }], sortOrder: 2 },
  { id: 'lesson-cell', subjectId: 'subject-biology', title: 'Строение клетки', description: 'Органоиды клетки и их функции в жизнедеятельности организма.', duration: 25, required: true, progress: 100, notes: 'Клетка — структурная и функциональная единица живого организма.', timecodes: [{ id: 'membrane', label: 'Мембрана и цитоплазма', time: '00:00' }, { id: 'organelles', label: 'Органоиды', time: '17:50' }], sortOrder: 1 },
  { id: 'lesson-genetics', subjectId: 'subject-biology', title: 'Основы генетики', description: 'Гены, признаки и простые закономерности наследования.', duration: 32, required: true, progress: 52, notes: 'Генетика изучает наследственность и изменчивость организмов.', timecodes: [{ id: 'terms', label: 'Основные термины', time: '00:00' }, { id: 'mendel', label: 'Законы Менделя', time: '14:22' }], sortOrder: 2 },
  { id: 'lesson-kazakh-parts', subjectId: 'subject-kazakh-language', title: 'Части речи', description: 'Распознаём самостоятельные и служебные части речи в предложении.', duration: 19, required: true, progress: 100, notes: 'Части речи различаются по значению, грамматическим признакам и роли в предложении.', timecodes: [{ id: 'noun', label: 'Зат есім', time: '00:00' }, { id: 'verb', label: 'Етістік', time: '07:16' }], sortOrder: 1 },
  { id: 'lesson-kazakh-syntax', subjectId: 'subject-kazakh-language', title: 'Синтаксис простого предложения', description: 'Главные члены предложения и порядок слов в казахском языке.', duration: 28, required: true, progress: 18, notes: 'В простом предложении важно определить грамматическую основу.', timecodes: [{ id: 'base', label: 'Грамматическая основа', time: '00:00' }, { id: 'task', label: 'Разбор предложения', time: '21:30' }], sortOrder: 2 },
  { id: 'lesson-algorithms', subjectId: 'subject-informatics', title: 'Алгоритмы и блок-схемы', description: 'Описываем последовательность действий и находим ветвления.', duration: 23, required: true, progress: 100, notes: 'Алгоритм — точное описание действий, которые приводят к решению задачи.', timecodes: [{ id: 'properties', label: 'Свойства алгоритма', time: '00:00' }, { id: 'flowchart', label: 'Блок-схемы', time: '08:45' }], sortOrder: 1 },
  { id: 'lesson-python-basics', subjectId: 'subject-informatics', title: 'Основы Python', description: 'Переменные, условия и циклы на первых практических примерах.', duration: 38, required: true, progress: 68, notes: 'Python позволяет описывать алгоритмы понятным и лаконичным кодом.', timecodes: [{ id: 'values', label: 'Переменные и типы', time: '00:00' }, { id: 'loops', label: 'Циклы', time: '27:15' }], sortOrder: 2 },
]

type QuizSeed = {
  id: string
  lessonId: string
  title: string
  description: string
  passingScore: number
  attempts: number
  questions: { id: string; question: string; options: { id: string; label: string }[]; correctAnswer: string; explanation: string }[]
}

const quizzes: QuizSeed[] = [
  { id: 'quiz-quadratic-equations', lessonId: 'lesson-quadratic-equations', title: 'Проверка: квадратные уравнения', description: 'Проверьте, насколько хорошо вы усвоили материал урока.', passingScore: 70, attempts: 3, questions: [{ id: 'question-quadratic-1', question: 'Чему равен дискриминант уравнения x² + 4x + 3 = 0?', options: [{ id: 'a', label: '4' }, { id: 'b', label: '16' }, { id: 'c', label: '−4' }, { id: 'd', label: '28' }], correctAnswer: 'a', explanation: 'D = b² − 4ac = 4² − 4 × 1 × 3 = 4.' }, { id: 'question-quadratic-2', question: 'Сколько корней имеет квадратное уравнение при D < 0?', options: [{ id: 'a', label: 'Два корня' }, { id: 'b', label: 'Один корень' }, { id: 'c', label: 'Нет действительных корней' }, { id: 'd', label: 'Всегда три корня' }], correctAnswer: 'c', explanation: 'При отрицательном дискриминанте нет действительных корней.' }, { id: 'question-quadratic-3', question: 'Как называется выражение b² − 4ac?', options: [{ id: 'a', label: 'Коэффициент' }, { id: 'b', label: 'Дискриминант' }, { id: 'c', label: 'Производная' }, { id: 'd', label: 'Модуль' }], correctAnswer: 'b', explanation: 'Выражение b² − 4ac называется дискриминантом.' }] },
  { id: 'quiz-linear-equations', lessonId: 'lesson-linear-equations', title: 'Проверка: линейные уравнения', description: 'Закрепите правила преобразования линейных уравнений.', passingScore: 70, attempts: 3, questions: [{ id: 'question-linear-1', question: 'Чему равен x в уравнении 3x + 6 = 0?', options: [{ id: 'a', label: '−2' }, { id: 'b', label: '2' }, { id: 'c', label: '−3' }, { id: 'd', label: '6' }], correctAnswer: 'a', explanation: '3x = −6, поэтому x = −2.' }, { id: 'question-linear-2', question: 'Какое действие сохраняет равенство?', options: [{ id: 'a', label: 'Прибавить число только слева' }, { id: 'b', label: 'Умножить обе части на одно число' }, { id: 'c', label: 'Изменить знак только у x' }, { id: 'd', label: 'Удалить свободный член' }], correctAnswer: 'b', explanation: 'Одинаковое действие над обеими частями сохраняет равенство.' }] },
  { id: 'quiz-kazakh-khanate', lessonId: 'lesson-kazakh-khanate', title: 'Проверка: Казахское ханство', description: 'Проверьте знания о предпосылках и значении образования ханства.', passingScore: 70, attempts: 3, questions: [{ id: 'question-khanate-1', question: 'Кто считается основателями Казахского ханства?', options: [{ id: 'a', label: 'Керей и Жанибек' }, { id: 'b', label: 'Абылай и Кенесары' }, { id: 'c', label: 'Аль-Фараби и Яссауи' }, { id: 'd', label: 'Тауке и Касым' }], correctAnswer: 'a', explanation: 'Керей и Жанибек стали первыми ханами нового государства.' }, { id: 'question-khanate-2', question: 'В каком веке сформировалось Казахское ханство?', options: [{ id: 'a', label: 'XIII веке' }, { id: 'b', label: 'XIV веке' }, { id: 'c', label: 'XV веке' }, { id: 'd', label: 'XVII веке' }], correctAnswer: 'c', explanation: 'Казахское ханство возникло в XV веке.' }] },
  { id: 'quiz-motion', lessonId: 'lesson-motion', title: 'Проверка: равномерное движение', description: 'Проверьте понимание связи пути, времени и скорости.', passingScore: 70, attempts: 3, questions: [{ id: 'question-motion-1', question: 'Как найти скорость при равномерном движении?', options: [{ id: 'a', label: 'v = s / t' }, { id: 'b', label: 'v = s × t' }, { id: 'c', label: 'v = t / s' }, { id: 'd', label: 'v = s + t' }], correctAnswer: 'a', explanation: 'Скорость равна отношению пути ко времени.' }, { id: 'question-motion-2', question: 'Что показывает наклон графика пути от времени?', options: [{ id: 'a', label: 'Массу тела' }, { id: 'b', label: 'Скорость движения' }, { id: 'c', label: 'Температуру' }, { id: 'd', label: 'Плотность среды' }], correctAnswer: 'b', explanation: 'Наклон линии s(t) характеризует скорость.' }] },
  { id: 'quiz-cell', lessonId: 'lesson-cell', title: 'Проверка: строение клетки', description: 'Повторите функции основных органоидов.', passingScore: 70, attempts: 3, questions: [{ id: 'question-cell-1', question: 'Какой органоид хранит наследственную информацию?', options: [{ id: 'a', label: 'Рибосома' }, { id: 'b', label: 'Ядро' }, { id: 'c', label: 'Вакуоль' }, { id: 'd', label: 'Клеточная стенка' }], correctAnswer: 'b', explanation: 'В ядре клетки находится большая часть генетического материала.' }, { id: 'question-cell-2', question: 'Где происходит синтез белка?', options: [{ id: 'a', label: 'На рибосомах' }, { id: 'b', label: 'В лизосомах' }, { id: 'c', label: 'В клеточной стенке' }, { id: 'd', label: 'В вакуоли' }], correctAnswer: 'a', explanation: 'Рибосомы собирают белковые молекулы.' }] },
  { id: 'quiz-algorithms', lessonId: 'lesson-algorithms', title: 'Проверка: алгоритмы', description: 'Проверьте понимание свойств алгоритмов и блок-схем.', passingScore: 70, attempts: 3, questions: [{ id: 'question-algorithms-1', question: 'Какое свойство означает, что алгоритм состоит из отдельных шагов?', options: [{ id: 'a', label: 'Дискретность' }, { id: 'b', label: 'Массовость' }, { id: 'c', label: 'Результативность' }, { id: 'd', label: 'Определённость' }], correctAnswer: 'a', explanation: 'Дискретность означает разделение алгоритма на последовательные шаги.' }, { id: 'question-algorithms-2', question: 'Какая фигура обозначает условие в блок-схеме?', options: [{ id: 'a', label: 'Прямоугольник' }, { id: 'b', label: 'Ромб' }, { id: 'c', label: 'Овал' }, { id: 'd', label: 'Стрелка' }], correctAnswer: 'b', explanation: 'Ромб обозначает проверку условия и ветвление.' }] },
]

export async function seedDatabase() {
  const passwordHash = await bcrypt.hash(demoUser.password, 12)

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO users(id, email, password_hash, name, locale, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`,
      [demoUser.id, demoUser.email, passwordHash, demoUser.name, demoUser.locale, demoUser.role],
    )

    for (const subject of subjects) {
      await client.query(
        `INSERT INTO subjects(id, title, description, icon, sort_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order`,
        [...subject],
      )
    }

    for (const lesson of lessons) {
      await client.query(
        `INSERT INTO lessons(id, subject_id, title, description, duration, required, notes, timecodes, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
         ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, duration = EXCLUDED.duration, required = EXCLUDED.required, notes = EXCLUDED.notes, timecodes = EXCLUDED.timecodes, sort_order = EXCLUDED.sort_order`,
        [lesson.id, lesson.subjectId, lesson.title, lesson.description, lesson.duration, lesson.required, lesson.notes, JSON.stringify(lesson.timecodes), lesson.sortOrder],
      )
      await client.query(
        `INSERT INTO lesson_progress(user_id, lesson_id, progress, completed)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, lesson_id) DO NOTHING`,
        [demoUser.id, lesson.id, lesson.progress, lesson.progress === 100],
      )
    }

    for (const quiz of quizzes) {
      await client.query(
        `INSERT INTO quizzes(id, lesson_id, title, description, passing_score, max_attempts)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, passing_score = EXCLUDED.passing_score, max_attempts = EXCLUDED.max_attempts`,
        [quiz.id, quiz.lessonId, quiz.title, quiz.description, quiz.passingScore, quiz.attempts],
      )
      for (const [sortOrder, question] of quiz.questions.entries()) {
        await client.query(
          `INSERT INTO quiz_questions(id, quiz_id, question, options, correct_answer, explanation, sort_order)
           VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question, options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer, explanation = EXCLUDED.explanation, sort_order = EXCLUDED.sort_order`,
          [question.id, quiz.id, question.question, JSON.stringify(question.options), question.correctAnswer, question.explanation, sortOrder],
        )
      }
    }
  })

  return { email: demoUser.email, password: demoUser.password }
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase().then((credentials) => {
    console.log(`Seed completed. Demo user: ${credentials.email} / ${credentials.password}`)
  }).catch((error) => {
    console.error(error)
    process.exitCode = 1
  }).finally(() => pool.end())
}
