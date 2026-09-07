<script lang="ts" setup>
import { ChevronLeft } from 'lucide-vue-next'
import { BaseAlert, BaseButton, BaseContainer, BaseSkeleton } from '~/shared/ui'
import { getLesson } from '~/shared/api/lessons'
import { getQuizForLesson } from '~/shared/api/quizzes'
import { AppShell } from '~/widgets/app-shell'
import { LessonViewer } from '~/widgets/lesson-viewer'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const lessonId = String(route.params.lessonId)
const subjectId = String(route.params.subjectId)

const {
  data: lessonPage,
  pending,
  error,
} = await useAsyncData(`lesson-${lessonId}`, async () => {
  const lesson = await getLesson(lessonId)

  return {
    lesson,
    quiz: lesson ? await getQuizForLesson(lesson.id) : undefined,
  }
})

useHead(() => ({
  title: lessonPage.value?.lesson
    ? `${lessonPage.value.lesson.title} | Sauat Education`
    : 'Урок | Sauat Education',
}))

const goBack = () => navigateTo(`/subjects/${subjectId}`)
const openQuiz = (quizId: string) => navigateTo(`/quiz/${quizId}`)
</script>

<template>
  <AppShell active="subjects">
    <BaseContainer size="lg">
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <BaseButton variant="ghost" size="sm" :leading-icon="ChevronLeft" @click="goBack">
          Вернуться к предмету
        </BaseButton>

        <BaseSkeleton v-if="pending" class="mt-6" variant="rect" width="100%" height="520px" />

        <BaseAlert v-else-if="error" class="mt-6" variant="error" title="Не удалось загрузить урок">
          Не удалось получить данные урока. Попробуйте ещё раз.
        </BaseAlert>

        <BaseAlert
          v-else-if="!lessonPage?.lesson"
          class="mt-6"
          variant="warning"
          title="Урок не найден"
        >
          Вернитесь к предмету и выберите другой урок.
        </BaseAlert>

        <LessonViewer
          v-else
          class="mt-6"
          :lesson="lessonPage.lesson"
          :quiz-id="lessonPage.quiz?.id"
          @quiz="openQuiz"
        />
      </div>
    </BaseContainer>
  </AppShell>
</template>
