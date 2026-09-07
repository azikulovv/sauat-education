<script lang="ts" setup>
import { computed, ref } from 'vue'
import { BaseAlert, BaseContainer } from '~/shared/ui'
import { currentStudent } from '~/entities/student'
import { subjects } from '~/entities/subject'
import { currentLesson } from '~/entities/lesson'
import { overallProgress } from '~/entities/progress'
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

const selectedSubjectId = ref<string | null>(null)
const isLessonSelected = ref(false)

const selectedSubject = computed(() =>
  subjects.find((subject) => subject.id === selectedSubjectId.value),
)

const openSubject = (subject: Subject) => {
  selectedSubjectId.value = subject.id
  void navigateTo(`/subjects/${subject.id}`)
}

const continueLearning = () => {
  isLessonSelected.value = true
  void navigateTo(`/subjects/${currentLesson.subjectId}/lessons/${currentLesson.id}`)
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
        <DashboardOverview
          :student="currentStudent"
          :progress="overallProgress"
          :current-lesson="currentLesson"
        />

        <div class="mt-12">
          <DashboardSubjects :subjects="subjects" @subject-click="openSubject" />
        </div>

        <div class="mt-12">
          <DashboardContinueLearning :lesson="currentLesson" @continue="continueLearning" />
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
