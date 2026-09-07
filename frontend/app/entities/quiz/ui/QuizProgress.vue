<script setup lang="ts">
import { BaseProgress } from '~/shared/ui'

interface Props {
  current: number
  total: number
}

const props = defineProps<Props>()

const percentage = computed(() => {
  if (props.total <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, (props.current / props.total) * 100))
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-3 text-xs font-semibold text-text-secondary">
      <span>Вопрос {{ current }} из {{ total }}</span>
      <span>{{ Math.round(percentage) }}%</span>
    </div>

    <BaseProgress :value="percentage" size="sm" aria-label="Прогресс теста" />
  </div>
</template>
