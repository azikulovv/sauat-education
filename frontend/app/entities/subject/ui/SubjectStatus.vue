<script setup lang="ts">
import { Check, Circle, CircleDot } from 'lucide-vue-next'
import { BaseBadge } from '~/shared/ui'
import type { Subject, SubjectStatus as SubjectStatusType } from '../model/types'

interface Props {
  subject: Subject
}

const props = defineProps<Props>()

const status = computed<SubjectStatusType>(() => {
  if (props.subject.progress >= 100 || props.subject.completedTopics >= props.subject.totalTopics) {
    return 'completed'
  }

  if (props.subject.progress > 0 || props.subject.completedTopics > 0) {
    return 'in-progress'
  }

  return 'not-started'
})

const statusConfig: Record<
  SubjectStatusType,
  { label: string; variant: 'success' | 'primary' | 'neutral'; icon: typeof Check }
> = {
  completed: { label: 'Завершено', variant: 'success', icon: Check },
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
