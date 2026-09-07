<script lang="ts" setup>
import { computed, ref } from 'vue'
import { BaseAlert, BaseContainer, BaseSkeleton } from '~/shared/ui'
import { getDashboard } from '~/shared/api/dashboard'
import {
  DashboardContinueLearning,
  DashboardOverview,
  DashboardSubjects,
} from '~/widgets/dashboard'
import { AppShell } from '~/widgets/app-shell'
import type { Subject } from '~/entities/subject'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Главная | Sauat Education',
  meta: [{ name: 'description', content: 'Ваш прогресс и текущие учебные материалы.' }],
})

const { data: dashboard, pending, error } = await useAsyncData('dashboard', getDashboard)
const selectedSubjectId = ref<string | null>(null)
const isLessonSelected = ref(false)

const selectedSubject = computed(() =>
  dashboard.value?.subjects.find((subject) => subject.id === selectedSubjectId.value),
)

const openSubject = (subject: Subject) => {
  selectedSubjectId.value = subject.id
  void navigateTo(`/subjects/${subject.id}`)
}

const continueLearning = () => {
  if (!dashboard.value?.currentLesson) return
  isLessonSelected.value = true
  void navigateTo(`/subjects/${dashboard.value.currentLesson.subjectId}/lessons/${dashboard.value.currentLesson.id}`)
}

const handleAlertClose = () => {
  selectedSubjectId.value = null
  isLessonSelected.value = false
}
</script>

<template>
  <AppShell active="dashboard">
    <BaseContainer>
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <BaseAlert v-if="error" variant="error" title="Не удалось загрузить кабинет">
          {{ error.message }}
        </BaseAlert>
        <BaseSkeleton v-else-if="pending" variant="rect" width="100%" height="420px" />
        <DashboardOverview
          v-else-if="dashboard?.currentLesson"
          :student="dashboard.student"
          :progress="dashboard.progress"
          :current-lesson="dashboard.currentLesson"
        />

        <div v-if="dashboard" class="mt-12">
          <DashboardSubjects :subjects="dashboard.subjects" @subject-click="openSubject" />
        </div>

        <div v-if="dashboard?.currentLesson" class="mt-12">
          <DashboardContinueLearning :lesson="dashboard.currentLesson" @continue="continueLearning" />
        </div>

        <BaseAlert
          v-if="selectedSubject || isLessonSelected"
          class="mt-6"
          variant="info"
          :title="
            selectedSubject
              ? `Выбран предмет: ${selectedSubject.title}`
              : 'Урок готов к продолжению'
          "
          closable
          @close="handleAlertClose"
        >
          Навигация по учебным материалам доступна из карточек предметов и уроков.
        </BaseAlert>
      </div>
    </BaseContainer>
  </AppShell>
</template>
