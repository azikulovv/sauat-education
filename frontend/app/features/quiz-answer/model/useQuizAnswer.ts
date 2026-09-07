import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { Quiz } from '~/entities/quiz'
import { checkQuizAnswer, submitQuizAttempt } from '~/shared/api/quizzes'

export type QuizAnswerState = 'idle' | 'answered' | 'correct' | 'incorrect' | 'completed'

export interface QuizMistake {
  questionId: string
  selectedAnswer: string
  correctAnswer: string
}

export interface QuizAnswerResult {
  score: number
  total: number
  percentage: number
  passed: boolean
  mistakes: QuizMistake[]
}

export function useQuizAnswer(quiz: MaybeRefOrGetter<Quiz>) {
  const questionIndex = ref(0)
  const selectedAnswer = ref<string | null>(null)
  const answerState = ref<QuizAnswerState>('idle')
  const correctAnswers = ref(0)
  const mistakes = ref<QuizMistake[]>([])
  const checkedAnswers = ref<Record<string, string>>({})
  const answerMap = ref<Record<string, string>>({})
  const checking = ref(false)
  const error = ref<string | null>(null)

  const currentQuestion = computed(() => {
    const question = toValue(quiz).questions[questionIndex.value]
    if (!question) return undefined
    return { ...question, correctAnswer: checkedAnswers.value[question.id] ?? question.correctAnswer }
  })
  const isLastQuestion = computed(
    () => questionIndex.value === Math.max(0, toValue(quiz).questions.length - 1),
  )

  const selectAnswer = (answerId: string) => {
    if (answerState.value !== 'idle' || !currentQuestion.value) {
      return
    }

    selectedAnswer.value = answerId
    answerState.value = 'answered'
  }

  const submitAnswer = async () => {
    const question = currentQuestion.value

    if (!question || !selectedAnswer.value || answerState.value !== 'answered' || checking.value) {
      return
    }

    checking.value = true
    error.value = null
    try {
      const selected = selectedAnswer.value
      const response = await checkQuizAnswer(toValue(quiz).id, question.id, selected)
      checkedAnswers.value[question.id] = response.correctAnswer
      answerMap.value[question.id] = selected
      if (response.isCorrect) {
        correctAnswers.value += 1
        answerState.value = 'correct'
      } else {
        mistakes.value.push({ questionId: question.id, selectedAnswer: selected, correctAnswer: response.correctAnswer })
        answerState.value = 'incorrect'
      }
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Не удалось проверить ответ.'
    } finally {
      checking.value = false
    }
  }

  const nextQuestion = async () => {
    if (answerState.value !== 'correct' && answerState.value !== 'incorrect') {
      return
    }

    if (isLastQuestion.value) {
      try {
        const response = await submitQuizAttempt(toValue(quiz).id, answerMap.value)
        correctAnswers.value = response.score
        mistakes.value = response.mistakes
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : 'Не удалось сохранить результат теста.'
        return
      }
      answerState.value = 'completed'
      return
    }

    questionIndex.value += 1
    selectedAnswer.value = null
    answerState.value = 'idle'
  }

  const previousQuestion = () => {
    if (questionIndex.value === 0 || answerState.value === 'completed') {
      return
    }

    questionIndex.value -= 1
    selectedAnswer.value = null
    answerState.value = 'idle'
  }

  const result = computed<QuizAnswerResult>(() => {
    const currentQuiz = toValue(quiz)
    const total = currentQuiz.questions.length
    const percentage = total > 0 ? Math.round((correctAnswers.value / total) * 100) : 0

    return {
      score: correctAnswers.value,
      total,
      percentage,
      passed: percentage >= currentQuiz.passingScore,
      mistakes: mistakes.value,
    }
  })

  const reset = () => {
    questionIndex.value = 0
    selectedAnswer.value = null
    answerState.value = 'idle'
    correctAnswers.value = 0
    mistakes.value = []
    checkedAnswers.value = {}
    answerMap.value = {}
    error.value = null
  }

  return {
    questionIndex,
    currentQuestion,
    selectedAnswer,
    answerState,
    isLastQuestion,
    previousQuestion,
    result,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    reset,
    checking,
    error,
  }
}
