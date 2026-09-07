<script lang="ts" setup>
import { ChevronLeft } from 'lucide-vue-next'
import { BaseAlert, BaseButton, BaseContainer, BaseEmptyState, BaseSkeleton } from '~/shared/ui'
import { getLesson } from '~/shared/api/lessons'
import { getQuiz } from '~/shared/api/quizzes'
import { useQuizReview } from '~/features/quiz-answer'
import { AppShell } from '~/widgets/app-shell'
import { QuizReview } from '~/widgets/quiz-review'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const quizId = String(route.params.quizId)
const reviewResult = useQuizReview(quizId)

const {
  data: reviewPage,
  pending,
  error,
} = await useAsyncData(`quiz-review-${quizId}`, async () => {
  const quiz = await getQuiz(quizId)
  const lesson = quiz ? await getLesson(quiz.lessonId) : undefined

  return { quiz, lesson }
})

useHead(() => ({
  title: reviewPage.value?.quiz ? `Разбор: ${reviewPage.value.quiz.title}` : 'Разбор ошибок',
}))

const goBackToQuiz = () => navigateTo(`/quiz/${quizId}`)
const goBackToLesson = () => {
  const lesson = reviewPage.value?.lesson

  if (!lesson) {
    return navigateTo('/')
  }

  return navigateTo(`/subjects/${lesson.subjectId}/lessons/${lesson.id}`)
}
</script>

<template>
  <AppShell active="subjects">
    <BaseContainer size="md">
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <div class="flex flex-wrap gap-2">
          <BaseButton variant="ghost" size="sm" :leading-icon="ChevronLeft" @click="goBackToQuiz">
            Вернуться к тесту
          </BaseButton>
          <BaseButton variant="ghost" size="sm" @click="goBackToLesson">К уроку</BaseButton>
        </div>

        <BaseSkeleton v-if="pending" class="mt-6" variant="rect" width="100%" height="500px" />

        <BaseAlert
          v-else-if="error"
          class="mt-6"
          variant="error"
          title="Не удалось загрузить разбор"
        >
          Не удалось получить данные теста. Попробуйте открыть разбор снова.
        </BaseAlert>

        <BaseEmptyState
          v-else-if="!reviewPage?.quiz"
          class="mt-6"
          title="Тест не найден"
          description="Попробуйте открыть разбор из результата теста."
        />

        <QuizReview v-else class="mt-6" :quiz="reviewPage.quiz" :result="reviewResult" />
      </div>
    </BaseContainer>
  </AppShell>
</template>
