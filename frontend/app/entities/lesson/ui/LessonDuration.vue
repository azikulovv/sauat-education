<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'

interface Props {
  minutes: number
}

const props = defineProps<Props>()

const formattedDuration = computed(() => {
  const hours = Math.floor(props.minutes / 60)
  const minutes = props.minutes % 60

  if (hours === 0) {
    return `${minutes} мин`
  }

  if (minutes === 0) {
    return `${hours} ч`
  }

  return `${hours} ч ${minutes} мин`
})
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-xs text-text-secondary">
    <Clock3 class="size-3.5" aria-hidden="true" />
    {{ formattedDuration }}
  </span>
</template>
