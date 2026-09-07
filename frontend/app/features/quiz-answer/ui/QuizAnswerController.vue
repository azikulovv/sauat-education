<script setup lang="ts">
import { ArrowRight, Check, Send } from 'lucide-vue-next'
import { computed } from 'vue'
import { BaseButton } from '~/shared/ui'
import { QuizProgress, QuizQuestion } from '~/entities/quiz'
import type { Quiz } from '~/entities/quiz'
import { useQuizAnswer, type QuizAnswerResult } from '../model/useQuizAnswer'

interface Props {
  quiz: Quiz
}

const props = defineProps<Props>()

const emit = defineEmits<{
  completed: [result: QuizAnswerResult]
}>()

const answer = useQuizAnswer(() => props.quiz)
const currentNumber = computed(() => answer.questionIndex.value + 1)
const isAnswerChecked = computed(
  () => answer.answerState.value === 'correct' || answer.answerState.value === 'incorrect',
)

const handleNext = () => {
  answer.nextQuestion()

  if (answer.answerState.value === 'completed') {
    emit('completed', answer.result.value)
  }
}
</script>

<template>
  <div v-if="answer.currentQuestion.value" class="space-y-6">
    <QuizProgress :current="currentNumber" :total="quiz.questions.length" />

    <QuizQuestion
      :question="answer.currentQuestion.value"
      :selected-answer="answer.selectedAnswer.value ?? undefined"
      :show-result="isAnswerChecked"
      :disabled="isAnswerChecked"
      @select="answer.selectAnswer"
    />

    <div
      class="flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end"
    >
      <BaseButton
        v-if="isAnswerChecked"
        variant="secondary"
        :trailing-icon="answer.isLastQuestion.value ? Check : ArrowRight"
        @click="handleNext"
      >
        {{ answer.isLastQuestion.value ? 'Завершить тест' : 'Следующий вопрос' }}
      </BaseButton>

      <BaseButton
        v-else
        :disabled="!answer.selectedAnswer.value"
        :leading-icon="Send"
        @click="answer.submitAnswer"
      >
        Проверить ответ
      </BaseButton>
    </div>
  </div>
</template>
