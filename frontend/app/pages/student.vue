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
import type { Subject } from '~/entities/subject'

definePageMeta({
  layout: 'student',
})

const selectedSubjectId = ref<string | null>(null)
const isLessonSelected = ref(false)

const selectedSubject = computed(() =>
  subjects.find((subject) => subject.id === selectedSubjectId.value),
)

const handleSubjectClick = (subject: Subject) => {
  selectedSubjectId.value = subject.id
}

const handleContinueLearning = () => {
  isLessonSelected.value = true
}

const handleAlertClose = () => {
  selectedSubjectId.value = null
  isLessonSelected.value = false
}
</script>

<template>
  <main>
    <BaseContainer>
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <DashboardOverview
          :student="currentStudent"
          :progress="overallProgress"
          :current-lesson="currentLesson"
        />

        <div class="mt-12">
          <DashboardSubjects :subjects="subjects" @subject-click="handleSubjectClick" />
        </div>

        <div class="mt-12">
          <DashboardContinueLearning :lesson="currentLesson" @continue="handleContinueLearning" />
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
          Этот экран демонстрирует entity UI и пока работает на mock-данных.
        </BaseAlert>
      </div>
    </BaseContainer>
  </main>
</template>
