<script lang="ts" setup>
import { BookOpen, ChevronLeft } from 'lucide-vue-next'
import { BaseAlert, BaseButton, BaseContainer, BaseEmptyState, BaseSkeleton } from '~/shared/ui'
import { getLessons } from '~/shared/api/lessons'
import { getSubject } from '~/shared/api/subjects'
import { AppShell } from '~/widgets/app-shell'
import { SubjectDetail } from '~/widgets/subject-detail'
import type { Lesson } from '~/entities/lesson'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const subjectId = String(route.params.subjectId)

const [
  { data: subject, pending: subjectPending, error: subjectError },
  { data: lessons, pending: lessonsPending, error: lessonsError },
] = await Promise.all([
  useAsyncData(`subject-${subjectId}`, () => getSubject(subjectId)),
  useAsyncData(`subject-${subjectId}-lessons`, () => getLessons(subjectId)),
])

useHead(() => ({
  title: subject.value ? `${subject.value.title} | Sauat Education` : 'Предмет | Sauat Education',
}))

const goBack = () => navigateTo('/subjects')
const openLesson = (lesson: Lesson) => navigateTo(`/subjects/${subjectId}/lessons/${lesson.id}`)
</script>

<template>
  <AppShell active="subjects">
    <BaseContainer>
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <BaseButton variant="ghost" size="sm" :leading-icon="ChevronLeft" @click="goBack">
          Все предметы
        </BaseButton>

        <BaseSkeleton
          v-if="subjectPending"
          class="mt-6"
          variant="rect"
          width="100%"
          height="520px"
        />

        <BaseAlert
          v-else-if="subjectError"
          class="mt-6"
          variant="error"
          title="Не удалось загрузить предмет"
        >
          Не удалось получить данные предмета. Попробуйте ещё раз.
        </BaseAlert>

        <SubjectDetail
          v-else-if="subject"
          class="mt-6"
          :subject="subject"
          :lessons="lessons ?? []"
          :loading="lessonsPending"
          :error="lessonsError?.message ?? null"
          @lesson-click="openLesson"
        />

        <BaseEmptyState
          v-else
          class="mt-6"
          :icon="BookOpen"
          title="Предмет не найден"
          description="Вернитесь к списку предметов и выберите доступный предмет."
        />
      </div>
    </BaseContainer>
  </AppShell>
</template>
