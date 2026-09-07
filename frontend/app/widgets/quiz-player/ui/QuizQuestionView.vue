<script setup lang="ts">
import { QuizAnswerController } from '~/features/quiz-answer'
import type { Quiz } from '~/entities/quiz'
import type { QuizAnswerResult } from '~/features/quiz-answer'

interface Props {
  quiz: Quiz
}

defineProps<Props>()

defineEmits<{
  completed: [result: QuizAnswerResult]
}>()
</script>

<template>
  <QuizAnswerController :quiz="quiz" @completed="$emit('completed', $event)" />
</template>
