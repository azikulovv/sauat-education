<script setup lang="ts">
import { BaseProgress } from '~/shared/ui'
import type { Subject } from '../model/types'

interface Props {
  subject: Subject
  showValue?: boolean
}

withDefaults(defineProps<Props>(), {
  showValue: true,
})
</script>

<template>
  <div class="space-y-2">
    <BaseProgress :value="subject.progress" :show-value="showValue" size="md" label="Прогресс" />

    <p class="text-xs text-text-secondary">
      {{ subject.completedTopics }} из {{ subject.totalTopics }} тем пройдено
    </p>
  </div>
</template>
