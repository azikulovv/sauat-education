<script setup lang="ts">
import { ArrowLeft, CheckCircle2, RotateCcw, XCircle } from 'lucide-vue-next'
import { BaseButton, BaseCard } from '~/shared/ui'
import type { QuizAnswerResult } from '~/features/quiz-answer'

interface Props {
  result: QuizAnswerResult
  passingScore: number
}

defineProps<Props>()

defineEmits<{
  review: []
  retry: []
}>()
</script>

<template>
  <BaseCard class="text-center">
    <CheckCircle2 v-if="result.passed" class="mx-auto size-12 text-success" aria-hidden="true" />
    <XCircle v-else class="mx-auto size-12 text-error" aria-hidden="true" />

    <p class="mt-5 text-overline" :class="result.passed ? 'text-success' : 'text-error'">
      {{ result.passed ? 'Тест пройден' : 'Нужно повторить' }}
    </p>
    <h2 class="mt-2 text-h2 text-text-primary">{{ result.percentage }}%</h2>
    <p class="mt-2 text-sm text-text-secondary">
      Правильных ответов: {{ result.score }} из {{ result.total }}. Для прохождения нужно
      {{ passingScore }}%.
    </p>

    <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
      <BaseButton variant="secondary" :leading-icon="ArrowLeft" @click="$emit('review')">
        Разобрать ответы
      </BaseButton>
      <BaseButton :leading-icon="RotateCcw" @click="$emit('retry')">Пройти ещё раз</BaseButton>
    </div>
  </BaseCard>
</template>
