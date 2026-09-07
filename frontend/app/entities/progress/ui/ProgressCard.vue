<script setup lang="ts">
import { BookOpenCheck, CirclePlay, ListChecks } from 'lucide-vue-next'
import { BaseCard, BaseProgress } from '~/shared/ui'
import type { Progress } from '../model/types'
import ProgressStat from './ProgressStat.vue'

interface Props {
  progress: Progress
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Прогресс обучения',
})
</script>

<template>
  <BaseCard>
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-text-primary">{{ title }}</p>
        <p class="mt-1 text-xs text-text-secondary">Ваш текущий результат за весь курс</p>
      </div>

      <span class="text-2xl font-bold tracking-tight text-primary">{{ progress.percentage }}%</span>
    </div>

    <BaseProgress
      class="mt-6"
      :value="progress.percentage"
      size="lg"
      aria-label="Общий прогресс обучения"
    />

    <div class="mt-6 grid grid-cols-2 gap-4 border-t border-border-subtle pt-5 sm:grid-cols-3">
      <ProgressStat
        :icon="BookOpenCheck"
        label="Тем пройдено"
        :value="`${progress.completed} из ${progress.total}`"
      />
      <ProgressStat :icon="CirclePlay" label="Текущая активность" :value="progress.current" />
      <ProgressStat
        :icon="ListChecks"
        label="Осталось тем"
        :value="progress.total - progress.completed"
      />
    </div>
  </BaseCard>
</template>
