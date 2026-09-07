<script setup lang="ts">
import { Lightbulb } from 'lucide-vue-next'
import { BaseEmptyState } from '~/shared/ui'
import type { Quiz, QuizQuestion } from '~/entities/quiz/model/types'
import type { QuizAnswerResult, QuizMistake } from '~/features/quiz-answer'
import QuizReviewItem from './QuizReviewItem.vue'

interface Props {
  quiz: Quiz
  result: QuizAnswerResult | null
}

const props = defineProps<Props>()

const mistakesWithQuestions = computed(() => {
  if (!props.result) {
    return []
  }

  return props.result.mistakes
    .map((mistake) => ({
      mistake,
      question: props.quiz.questions.find((question) => question.id === mistake.questionId),
    }))
    .filter((item): item is { mistake: QuizMistake; question: QuizQuestion } =>
      Boolean(item.question),
    )
})
</script>

<template>
  <section aria-labelledby="quiz-review-title">
    <div class="mb-6">
      <p class="text-overline text-primary">Разбор ошибок</p>
      <h1 id="quiz-review-title" class="mt-2 text-h1 text-text-primary">
        Повторите сложные вопросы
      </h1>
      <p class="mt-2 text-body-sm leading-6 text-text-secondary">
        Правильные ответы и объяснения помогут закрепить материал.
      </p>
    </div>

    <BaseEmptyState
      v-if="!result"
      :icon="Lightbulb"
      title="Сначала пройдите тест"
      description="После завершения теста здесь появятся вопросы, в которых понадобилось больше практики."
    />

    <BaseEmptyState
      v-else-if="mistakesWithQuestions.length === 0"
      :icon="Lightbulb"
      title="Ошибок нет"
      description="Отличный результат — все ответы были правильными."
    />

    <div v-else class="space-y-5">
      <QuizReviewItem
        v-for="item in mistakesWithQuestions"
        :key="item.question.id"
        :question="item.question"
        :mistake="item.mistake"
      />
    </div>
  </section>
</template>
