<script setup lang="ts">
import { ArrowRight, PlayCircle } from 'lucide-vue-next'
import { BaseCard, BaseProgress, BaseBadge } from '~/shared/ui'
import type { Lesson } from '../model/types'
import LessonDuration from './LessonDuration.vue'
import LessonStatus from './LessonStatus.vue'

interface Props {
  lesson: Lesson
  showProgress?: boolean
}

withDefaults(defineProps<Props>(), {
  showProgress: true,
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <BaseCard
    as="button"
    type="button"
    variant="interactive"
    class="group block w-full text-left"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between gap-4">
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary"
      >
        <PlayCircle class="size-5" aria-hidden="true" />
      </span>

      <LessonStatus :lesson="lesson" />
    </div>

    <div class="mt-5 flex items-start justify-between gap-4">
      <div>
        <h3 class="text-base font-semibold text-text-primary">{{ lesson.title }}</h3>
        <p class="mt-1 text-sm leading-5 text-text-secondary">{{ lesson.description }}</p>
      </div>

      <BaseBadge v-if="lesson.required" variant="warning">Обязательный</BaseBadge>
    </div>

    <div class="mt-5 flex items-center gap-4">
      <LessonDuration :minutes="lesson.duration" />

      <span class="text-xs font-semibold text-text-tertiary">Урок</span>
    </div>

    <BaseProgress
      v-if="
        showProgress && lesson.progress !== undefined && lesson.progress > 0 && !lesson.completed
      "
      class="mt-4"
      :value="lesson.progress"
      size="sm"
      label="Просмотрено"
      show-value
    />

    <span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
      Продолжить
      <ArrowRight
        class="size-3.5 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </span>
  </BaseCard>
</template>
