<script lang="ts" setup>
import { ChevronLeft } from 'lucide-vue-next'
import { BaseAlert, BaseButton, BaseContainer, BaseSkeleton } from '~/shared/ui'
import { getLesson } from '~/shared/api/lessons'
import { getQuiz } from '~/shared/api/quizzes'
import { AppShell } from '~/widgets/app-shell'
import { QuizPlayer } from '~/widgets/quiz-player'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const quizId = String(route.params.quizId)
const {
  data: quizPage,
  pending,
  error,
} = await useAsyncData(`quiz-${quizId}`, async () => {
  const quiz = await getQuiz(quizId)
  const lesson = quiz ? await getLesson(quiz.lessonId) : undefined

  return { quiz, lesson }
})

const quiz = computed(() => quizPage.value?.quiz)
const lesson = computed(() => quizPage.value?.lesson)

useHead(() => ({
  title: quiz.value ? `${quiz.value.title} | Sauat Education` : 'Тест | Sauat Education',
}))

const goBack = () => {
  if (lesson.value) {
    return navigateTo(`/subjects/${lesson.value.subjectId}/lessons/${lesson.value.id}`)
  }

  return navigateTo('/')
}

const openReview = (id: string) => navigateTo(`/mistakes/${id}`)
const openLesson = (lessonId: string) => {
  const lessonData = lesson.value

  if (!lessonData || lessonData.id !== lessonId) {
    return navigateTo('/')
  }

  return navigateTo(`/subjects/${lessonData.subjectId}/lessons/${lessonData.id}`)
}
</script>

<template>
  <AppShell active="subjects">
    <BaseContainer size="md">
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <BaseButton variant="ghost" size="sm" :leading-icon="ChevronLeft" @click="goBack">
          Вернуться к уроку
        </BaseButton>

        <BaseSkeleton v-if="pending" class="mt-6" variant="rect" width="100%" height="480px" />

        <BaseAlert v-else-if="error" class="mt-6" variant="error" title="Не удалось загрузить тест">
          Не удалось получить данные теста. Попробуйте ещё раз.
        </BaseAlert>

        <BaseAlert v-else-if="!quiz" class="mt-6" variant="warning" title="Тест не найден">
          Вернитесь к уроку и попробуйте открыть тест ещё раз.
        </BaseAlert>

        <QuizPlayer
          v-else-if="quiz"
          class="mt-6"
          :quiz="quiz"
          @review="openReview"
          @lesson="openLesson"
        />
      </div>
    </BaseContainer>
  </AppShell>
</template>
