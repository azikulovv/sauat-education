import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { Quiz } from '~/entities/quiz'

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

  const currentQuestion = computed(() => toValue(quiz).questions[questionIndex.value])
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

  const submitAnswer = () => {
    const question = currentQuestion.value

    if (!question || !selectedAnswer.value || answerState.value !== 'answered') {
      return
    }

    if (selectedAnswer.value === question.correctAnswer) {
      correctAnswers.value += 1
      answerState.value = 'correct'
    } else {
      mistakes.value.push({
        questionId: question.id,
        selectedAnswer: selectedAnswer.value,
        correctAnswer: question.correctAnswer,
      })
      answerState.value = 'incorrect'
    }
  }

  const nextQuestion = () => {
    if (answerState.value !== 'correct' && answerState.value !== 'incorrect') {
      return
    }

    if (isLastQuestion.value) {
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
  }
}
