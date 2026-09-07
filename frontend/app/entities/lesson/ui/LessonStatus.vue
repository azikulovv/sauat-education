<script setup lang="ts">
import { Check, Circle, CircleDot } from 'lucide-vue-next'
import { BaseBadge } from '~/shared/ui'
import type { Lesson, LessonStatus as LessonStatusType } from '../model/types'

interface Props {
  lesson: Lesson
}

const props = defineProps<Props>()

const status = computed<LessonStatusType>(() => {
  if (props.lesson.completed) {
    return 'completed'
  }

  if ((props.lesson.progress ?? 0) > 0) {
    return 'in-progress'
  }

  return 'not-started'
})

const statusConfig: Record<
  LessonStatusType,
  { label: string; variant: 'success' | 'primary' | 'neutral'; icon: typeof Check }
> = {
  completed: { label: 'Пройдено', variant: 'success', icon: Check },
  'in-progress': { label: 'В процессе', variant: 'primary', icon: CircleDot },
  'not-started': { label: 'Не начато', variant: 'neutral', icon: Circle },
}

const currentStatus = computed(() => statusConfig[status.value])
</script>

<template>
  <BaseBadge :variant="currentStatus.variant" :icon="currentStatus.icon">
    {{ currentStatus.label }}
  </BaseBadge>
</template>
