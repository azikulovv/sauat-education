<script setup lang="ts">
import { BaseCard } from '~/shared/ui'
import type { QuizQuestion } from '~/entities/quiz/model/types'
import type { QuizMistake } from '~/features/quiz-answer'

interface Props {
  question: QuizQuestion
  mistake: QuizMistake
}

const props = defineProps<Props>()

const selectedLabel = computed(
  () =>
    props.question.options.find((option) => option.id === props.mistake.selectedAnswer)?.label ??
    'Нет ответа',
)
const correctLabel = computed(
  () =>
    props.question.options.find((option) => option.id === props.mistake.correctAnswer)?.label ??
    props.mistake.correctAnswer,
)
</script>

<template>
  <BaseCard>
    <h3 class="text-base font-semibold leading-6 text-text-primary">{{ question.question }}</h3>

    <div class="mt-5 grid gap-3 sm:grid-cols-2">
      <div class="rounded-md border border-error/20 bg-error/5 p-3">
        <p class="text-overline text-error">Ваш ответ</p>
        <p class="mt-1 text-sm font-semibold text-text-primary">{{ selectedLabel }}</p>
      </div>
      <div class="rounded-md border border-success/20 bg-success/5 p-3">
        <p class="text-overline text-success">Правильный ответ</p>
        <p class="mt-1 text-sm font-semibold text-text-primary">{{ correctLabel }}</p>
      </div>
    </div>

    <div v-if="question.explanation" class="mt-4 rounded-md bg-bg-subtle p-4">
      <p class="text-overline text-text-tertiary">Объяснение</p>
      <p class="mt-1 text-sm leading-6 text-text-secondary">{{ question.explanation }}</p>
    </div>
  </BaseCard>
</template>
