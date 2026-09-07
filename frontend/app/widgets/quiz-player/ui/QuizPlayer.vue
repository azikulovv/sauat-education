<script setup lang="ts">
import { ref } from 'vue'
import type { Quiz } from '~/entities/quiz'
import type { QuizAnswerResult } from '~/features/quiz-answer'
import QuizHeader from './QuizHeader.vue'
import QuizQuestionView from './QuizQuestionView.vue'
import QuizResult from './QuizResult.vue'

interface Props {
  quiz: Quiz
}

const props = defineProps<Props>()

const emit = defineEmits<{
  review: [quizId: string]
}>()

const result = ref<QuizAnswerResult | null>(null)
const questionViewKey = ref(0)

const handleCompleted = (nextResult: QuizAnswerResult) => {
  result.value = nextResult
}

const retry = () => {
  result.value = null
  questionViewKey.value += 1
}
</script>

<template>
  <section class="space-y-8">
    <QuizHeader
      :title="quiz.title"
      :description="quiz.description"
      :question-count="quiz.questions.length"
      :passing-score="quiz.passingScore"
    />

    <QuizResult
      v-if="result"
      :result="result"
      :passing-score="quiz.passingScore"
      @review="emit('review', quiz.id)"
      @retry="retry"
    />

    <QuizQuestionView
      v-else
      :key="questionViewKey"
      :quiz="props.quiz"
      @completed="handleCompleted"
    />
  </section>
</template>
