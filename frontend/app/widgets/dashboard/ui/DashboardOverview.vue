<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { BaseCard } from '~/shared/ui'
import { StudentProfile } from '~/entities/student'
import { ProgressCard } from '~/entities/progress'
import type { Student } from '~/entities/student'
import type { Progress } from '~/entities/progress'
import type { Lesson } from '~/entities/lesson'
import { LessonDuration } from '~/entities/lesson'

interface Props {
  student: Student
  progress: Progress
  currentLesson: Lesson
}

defineProps<Props>()
</script>

<template>
  <section aria-labelledby="dashboard-overview-title">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-overline text-primary">Личный кабинет</p>
        <h1 id="dashboard-overview-title" class="mt-2 text-h1 text-text-primary">
          Добрый день, {{ student.name.split(' ')[0] }}
        </h1>
        <p class="mt-2 max-w-xl text-body-sm text-text-secondary">
          Продолжайте обучение с того места, где остановились, и сохраняйте темп.
        </p>
      </div>

      <StudentProfile :student="student" compact class="w-full sm:w-auto lg:min-w-56" />
    </div>

    <div class="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)]">
      <ProgressCard :progress="progress" />

      <BaseCard class="flex flex-col justify-between">
        <div>
          <p class="text-sm font-semibold text-text-primary">Текущая активность</p>
          <p class="mt-1 text-sm leading-6 text-text-secondary">Вернитесь к последнему уроку</p>
        </div>

        <div class="mt-6">
          <div class="flex items-start gap-3">
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary"
            >
              <ArrowUpRight class="size-4" aria-hidden="true" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-text-primary">
                {{ currentLesson.title }}
              </p>
              <LessonDuration :minutes="currentLesson.duration" />
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </section>
</template>
