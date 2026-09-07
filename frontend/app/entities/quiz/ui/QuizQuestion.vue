<script setup lang="ts">
import type { QuizQuestion as QuizQuestionModel } from '../model/types'
import QuizOption from './QuizOption.vue'

interface Props {
  question: QuizQuestionModel
  selectedAnswer?: string
  disabled?: boolean
  showResult?: boolean
}

withDefaults(defineProps<Props>(), {
  selectedAnswer: undefined,
  disabled: false,
  showResult: false,
})

defineEmits<{
  select: [answerId: string]
}>()
</script>

<template>
  <section aria-labelledby="quiz-question-title">
    <h2 id="quiz-question-title" class="text-lg font-semibold leading-7 text-text-primary">
      {{ question.question }}
    </h2>

    <div class="mt-5 space-y-2.5" role="radiogroup" aria-label="Варианты ответа">
      <QuizOption
        v-for="option in question.options"
        :key="option.id"
        :label="option.label"
        :selected="selectedAnswer === option.id"
        :correct="showResult && option.id === question.correctAnswer"
        :incorrect="
          showResult && selectedAnswer === option.id && option.id !== question.correctAnswer
        "
        :disabled="disabled || showResult"
        @click="$emit('select', option.id)"
      />
    </div>

    <p
      v-if="showResult && question.explanation"
      class="mt-4 rounded-md bg-bg-subtle px-4 py-3 text-sm leading-6 text-text-secondary"
    >
      {{ question.explanation }}
    </p>
  </section>
</template>
