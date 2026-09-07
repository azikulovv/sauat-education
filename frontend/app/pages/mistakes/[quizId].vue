<script lang="ts" setup>
import { ChevronLeft, Lightbulb } from 'lucide-vue-next'
import {
  BaseAlert,
  BaseButton,
  BaseCard,
  BaseContainer,
  BaseEmptyState,
  BaseSkeleton,
} from '~/shared/ui'
import { QuizQuestion } from '~/entities/quiz'
import { getQuiz } from '~/shared/api/quizzes'

definePageMeta({
  layout: 'student',
})

const route = useRoute()
const quizId = String(route.params.quizId)
const {
  data: quiz,
  pending,
  error,
} = await useAsyncData(`quiz-review-${quizId}`, () => getQuiz(quizId))

const goBack = () => navigateTo(`/quiz/${quizId}`)
</script>

<template>
  <main>
    <BaseContainer size="md">
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <BaseButton variant="ghost" size="sm" :leading-icon="ChevronLeft" @click="goBack">
          Вернуться к тесту
        </BaseButton>

        <div class="mt-6">
          <p class="text-overline text-primary">Разбор ответов</p>
          <h1 class="mt-2 text-h1 text-text-primary">Повторите сложные вопросы</h1>
          <p class="mt-2 text-body-sm text-text-secondary">
            Здесь собраны правильные ответы и короткие объяснения по материалу теста.
          </p>
        </div>

        <BaseSkeleton v-if="pending" class="mt-8" variant="rect" width="100%" height="500px" />

        <BaseAlert
          v-else-if="error"
          class="mt-8"
          variant="error"
          title="Не удалось загрузить разбор"
        >
          {{ error.message }}
        </BaseAlert>

        <BaseEmptyState
          v-else-if="!quiz"
          class="mt-8"
          :icon="Lightbulb"
          title="Тест не найден"
          description="Попробуйте открыть разбор из результата теста."
        />

        <div v-else class="mt-8 space-y-5">
          <BaseCard v-for="(question, index) in quiz.questions" :key="question.id">
            <p class="mb-4 text-xs font-semibold text-text-tertiary">Вопрос {{ index + 1 }}</p>
            <QuizQuestion :question="question" show-result disabled />
          </BaseCard>
        </div>
      </div>
    </BaseContainer>
  </main>
</template>
