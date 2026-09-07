import Fastify, { type FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { config } from './config.js'
import { pool, withTransaction } from './db.js'
import { seedDatabase } from './seed.js'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

type AuthUser = { sub: string; email: string; role: 'student' | 'admin' }
type AuthenticatedRequest = FastifyRequest & { user: AuthUser }

const app = Fastify({ logger: true, trustProxy: true })

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
})
const idSchema = z.object({ id: z.string().min(1).max(120) })
const checkSchema = z.object({ questionId: z.string().min(1).max(120), answerId: z.string().min(1).max(30) })
const attemptSchema = z.object({ answers: z.record(z.string(), z.string().max(30)).refine((answers) => Object.keys(answers).length > 0) })

const userSelect = `id, email, name, avatar, locale, role`

function publicUser(row: Record<string, unknown>) {
  return { id: row.id, email: row.email, name: row.name, avatar: row.avatar ?? undefined, locale: row.locale, role: row.role }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error'
}

async function authenticate(request: FastifyRequest) {
  try {
    await request.jwtVerify()
  } catch {
    const error = new Error('Требуется авторизация.') as Error & { statusCode: number }
    error.statusCode = 401
    throw error
  }
}

function userId(request: FastifyRequest) {
  return (request as AuthenticatedRequest).user.sub
}

async function migrate() {
  const migrationPath = fileURLToPath(new URL('./migrations/001_init.sql', import.meta.url))
  await pool.query(await readFile(migrationPath, 'utf8'))
}

await app.register(helmet)
await app.register(cors, { origin: config.CORS_ORIGIN.split(',').map((value) => value.trim()), credentials: true })
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })
await app.register(jwt, { secret: config.JWT_SECRET, sign: { expiresIn: config.JWT_EXPIRES_IN } })
app.decorate('authenticate', authenticate)

app.get('/api/health', async (_request, reply) => {
  try {
    await pool.query('SELECT 1')
    return { status: 'ok', database: 'ok', timestamp: new Date().toISOString() }
  } catch {
    return reply.code(503).send({ status: 'error', database: 'unavailable' })
  }
})

app.post('/api/auth/login', { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, async (request, reply) => {
  const result = loginSchema.safeParse(request.body)
  if (!result.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Проверьте email и пароль.' })

  const { email, password } = result.data
  const { rows } = await pool.query(`SELECT ${userSelect}, password_hash FROM users WHERE lower(email) = lower($1)`, [email])
  const user = rows[0]
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return reply.code(401).send({ error: 'INVALID_CREDENTIALS', message: 'Неверный email или пароль.' })
  }

  const accessToken = await app.jwt.sign({ sub: user.id, email: user.email, role: user.role } satisfies AuthUser)
  return { user: publicUser(user), accessToken }
})

app.get('/api/auth/me', { preHandler: app.authenticate }, async (request, reply) => {
  const { rows } = await pool.query(`SELECT ${userSelect} FROM users WHERE id = $1`, [userId(request)])
  if (!rows[0]) return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'Пользователь не найден.' })
  return { user: publicUser(rows[0]) }
})

app.get('/api/dashboard', { preHandler: app.authenticate }, async (request) => {
  const id = userId(request)
  const [userResult, subjectsResult, currentLessonResult, progressResult] = await Promise.all([
    pool.query(`SELECT ${userSelect} FROM users WHERE id = $1`, [id]),
    pool.query(`
      SELECT s.id, s.title, s.description, s.icon,
        COUNT(l.id)::int AS "totalTopics",
        COUNT(lp.lesson_id) FILTER (WHERE lp.completed)::int AS "completedTopics",
        COUNT(l.id) FILTER (WHERE l.required)::int AS "requiredTopics",
        COUNT(lp.lesson_id) FILTER (WHERE l.required AND lp.completed)::int AS "completedRequiredTopics",
        COALESCE(ROUND(AVG(COALESCE(lp.progress, 0)))::int, 0) AS progress
      FROM subjects s LEFT JOIN lessons l ON l.subject_id = s.id
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
      GROUP BY s.id ORDER BY s.sort_order`, [id]),
    pool.query(`
      SELECT l.*, s.id AS subject_id, COALESCE(lp.progress, 0)::int AS progress, COALESCE(lp.completed, false) AS completed
      FROM lessons l JOIN subjects s ON s.id = l.subject_id
      LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
      WHERE COALESCE(lp.completed, false) = false ORDER BY COALESCE(lp.progress, 0) DESC, l.sort_order LIMIT 1`, [id]),
    pool.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE completed)::int AS completed FROM lesson_progress WHERE user_id = $1`, [id]),
  ])

  const progress = progressResult.rows[0]
  const total = progress?.total ?? 0
  const completed = progress?.completed ?? 0
  return {
    student: publicUser(userResult.rows[0]),
    subjects: subjectsResult.rows,
    progress: { percentage: total ? Math.round((completed / total) * 100) : 0, completed, total, current: total - completed, status: completed === total ? 'completed' : 'in-progress' },
    currentLesson: currentLessonResult.rows[0] ? mapLesson(currentLessonResult.rows[0]) : null,
  }
})

function mapLesson(row: Record<string, any>) {
  return {
    id: row.id, subjectId: row.subject_id, title: row.title, description: row.description,
    duration: row.duration, videoUrl: row.video_url ?? undefined, completed: row.completed,
    required: row.required, progress: row.progress, notes: row.notes ?? undefined, timecodes: row.timecodes ?? [],
  }
}

app.get('/api/subjects', { preHandler: app.authenticate }, async (request) => {
  const { rows } = await pool.query(`
    SELECT s.id, s.title, s.description, s.icon,
      COUNT(l.id)::int AS "totalTopics", COUNT(lp.lesson_id) FILTER (WHERE lp.completed)::int AS "completedTopics",
      COUNT(l.id) FILTER (WHERE l.required)::int AS "requiredTopics", COUNT(lp.lesson_id) FILTER (WHERE l.required AND lp.completed)::int AS "completedRequiredTopics",
      COALESCE(ROUND(AVG(COALESCE(lp.progress, 0)))::int, 0) AS progress
    FROM subjects s LEFT JOIN lessons l ON l.subject_id = s.id LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
    GROUP BY s.id ORDER BY s.sort_order`, [userId(request)])
  return rows
})

app.get('/api/subjects/:id', { preHandler: app.authenticate }, async (request, reply) => {
  const params = idSchema.safeParse(request.params)
  if (!params.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Некорректный идентификатор.' })
  const { rows } = await pool.query(`
    SELECT s.id, s.title, s.description, s.icon, COUNT(l.id)::int AS "totalTopics", COUNT(lp.lesson_id) FILTER (WHERE lp.completed)::int AS "completedTopics",
      COUNT(l.id) FILTER (WHERE l.required)::int AS "requiredTopics", COUNT(lp.lesson_id) FILTER (WHERE l.required AND lp.completed)::int AS "completedRequiredTopics", COALESCE(ROUND(AVG(COALESCE(lp.progress, 0)))::int, 0) AS progress
    FROM subjects s LEFT JOIN lessons l ON l.subject_id = s.id LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
    WHERE s.id = $2 GROUP BY s.id`, [userId(request), params.data.id])
  if (!rows[0]) return reply.code(404).send({ error: 'NOT_FOUND', message: 'Предмет не найден.' })
  return rows[0]
})

app.get('/api/lessons', { preHandler: app.authenticate }, async (request) => {
  const query = z.object({ subjectId: z.string().optional() }).parse(request.query)
  const { rows } = await pool.query(`
    SELECT l.*, COALESCE(lp.progress, 0)::int AS progress, COALESCE(lp.completed, false) AS completed
    FROM lessons l LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1
    WHERE ($2::text IS NULL OR l.subject_id = $2) ORDER BY l.sort_order`, [userId(request), query.subjectId ?? null])
  return rows.map(mapLesson)
})

app.get('/api/lessons/:id', { preHandler: app.authenticate }, async (request, reply) => {
  const params = idSchema.safeParse(request.params)
  if (!params.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Некорректный идентификатор.' })
  const { rows } = await pool.query(`SELECT l.*, COALESCE(lp.progress, 0)::int AS progress, COALESCE(lp.completed, false) AS completed FROM lessons l LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = $1 WHERE l.id = $2`, [userId(request), params.data.id])
  if (!rows[0]) return reply.code(404).send({ error: 'NOT_FOUND', message: 'Урок не найден.' })
  return mapLesson(rows[0])
})

app.post('/api/lessons/:id/complete', { preHandler: app.authenticate }, async (request, reply) => {
  const params = idSchema.safeParse(request.params)
  if (!params.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Некорректный идентификатор.' })
  const { rows } = await pool.query(`
    INSERT INTO lesson_progress(user_id, lesson_id, progress, completed, updated_at) VALUES ($1, $2, 100, true, now())
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET progress = 100, completed = true, updated_at = now()
    RETURNING lesson_id`, [userId(request), params.data.id])
  if (!rows[0]) return reply.code(404).send({ error: 'NOT_FOUND', message: 'Урок не найден.' })
  const lesson = await pool.query(`SELECT l.*, 100::int AS progress, true AS completed FROM lessons l WHERE l.id = $1`, [params.data.id])
  if (!lesson.rows[0]) return reply.code(404).send({ error: 'NOT_FOUND', message: 'Урок не найден.' })
  return mapLesson(lesson.rows[0])
})

function mapQuiz(row: Record<string, any>, questions: Record<string, any>[]) {
  return {
    id: row.id, lessonId: row.lesson_id, title: row.title, description: row.description,
    passingScore: row.passing_score, attempts: row.max_attempts,
    questions: questions.map((question) => ({ id: question.id, question: question.question, options: question.options, explanation: question.explanation ?? undefined })),
  }
}

async function quizWithQuestions(id: string) {
  const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id])
  if (!quizResult.rows[0]) return null
  const questions = await pool.query('SELECT id, question, options, explanation, correct_answer FROM quiz_questions WHERE quiz_id = $1 ORDER BY sort_order', [id])
  return { quiz: quizResult.rows[0], questions: questions.rows }
}

app.get('/api/quizzes/:id', { preHandler: app.authenticate }, async (request, reply) => {
  const params = idSchema.safeParse(request.params)
  if (!params.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Некорректный идентификатор.' })
  const data = await quizWithQuestions(params.data.id)
  if (!data) return reply.code(404).send({ error: 'NOT_FOUND', message: 'Тест не найден.' })
  return mapQuiz(data.quiz, data.questions)
})

app.get('/api/lessons/:id/quiz', { preHandler: app.authenticate }, async (request, reply) => {
  const params = idSchema.safeParse(request.params)
  if (!params.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Некорректный идентификатор.' })
  const quiz = await pool.query('SELECT * FROM quizzes WHERE lesson_id = $1', [params.data.id])
  if (!quiz.rows[0]) return null
  const questions = await pool.query('SELECT id, question, options, explanation, correct_answer FROM quiz_questions WHERE quiz_id = $1 ORDER BY sort_order', [quiz.rows[0].id])
  return mapQuiz(quiz.rows[0], questions.rows)
})

app.post('/api/quizzes/:id/check', { preHandler: app.authenticate }, async (request, reply) => {
  const params = idSchema.safeParse(request.params)
  const body = checkSchema.safeParse(request.body)
  if (!params.success || !body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Некорректный ответ.' })
  const { rows } = await pool.query('SELECT correct_answer, explanation FROM quiz_questions WHERE id = $1 AND quiz_id = $2', [body.data.questionId, params.data.id])
  if (!rows[0]) return reply.code(404).send({ error: 'NOT_FOUND', message: 'Вопрос не найден.' })
  return { isCorrect: rows[0].correct_answer === body.data.answerId, correctAnswer: rows[0].correct_answer, explanation: rows[0].explanation }
})

app.post('/api/quizzes/:id/attempts', { preHandler: app.authenticate }, async (request, reply) => {
  const params = idSchema.safeParse(request.params)
  const body = attemptSchema.safeParse(request.body)
  if (!params.success || !body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Некорректные ответы.' })
  const data = await quizWithQuestions(params.data.id)
  if (!data) return reply.code(404).send({ error: 'NOT_FOUND', message: 'Тест не найден.' })
  const latestAttempts = await pool.query('SELECT COUNT(*)::int AS count FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2', [userId(request), params.data.id])
  if (latestAttempts.rows[0].count >= data.quiz.max_attempts) return reply.code(409).send({ error: 'ATTEMPTS_EXCEEDED', message: 'Лимит попыток для этого теста исчерпан.' })

  const mistakes = data.questions.filter((question) => body.data.answers[question.id] !== question.correct_answer).map((question) => ({ questionId: question.id, selectedAnswer: body.data.answers[question.id] ?? '', correctAnswer: question.correct_answer }))
  const total = data.questions.length
  const score = total - mistakes.length
  const percentage = total ? Math.round((score / total) * 100) : 0
  const passed = percentage >= data.quiz.passing_score
  await pool.query('INSERT INTO quiz_attempts(user_id, quiz_id, answers, score, total, percentage, passed) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7)', [userId(request), params.data.id, JSON.stringify(body.data.answers), score, total, percentage, passed])
  return { score, total, percentage, passed, mistakes }
})

app.setErrorHandler((error, request, reply) => {
  request.log.error(error)
  if (error instanceof z.ZodError) return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Некорректные данные запроса.' })
  if (error instanceof Error && (error as Error & { statusCode?: number }).statusCode === 401) return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'Требуется авторизация.' })
  return reply.code(500).send({ error: 'INTERNAL_ERROR', message: config.NODE_ENV === 'production' ? 'Внутренняя ошибка сервера.' : errorMessage(error) })
})

const start = async () => {
  await migrate()
  await seedDatabase()
  await app.listen({ port: config.PORT, host: '0.0.0.0' })
}

start().catch(async (error) => {
  app.log.error(error)
  await pool.end()
  process.exit(1)
})

const close = async () => {
  await app.close()
  await pool.end()
}
process.on('SIGTERM', close)
process.on('SIGINT', close)
