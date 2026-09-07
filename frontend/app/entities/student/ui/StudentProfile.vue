<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { BaseCard } from '~/shared/ui'
import type { Student } from '../model/types'
import StudentAvatar from './StudentAvatar.vue'

interface Props {
  student: Student
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  compact: false,
})
</script>

<template>
  <BaseCard :padding="compact ? 'sm' : 'md'" class="flex items-center gap-3">
    <StudentAvatar :student="student" :size="compact ? 'md' : 'lg'" status="online" />

    <div class="min-w-0">
      <p class="truncate text-sm font-semibold text-text-primary">{{ student.name }}</p>

      <p
        v-if="!compact"
        class="mt-1 flex items-center gap-1.5 truncate text-xs text-text-secondary"
      >
        <Mail class="size-3.5 shrink-0" aria-hidden="true" />
        {{ student.email }}
      </p>

      <p v-else class="mt-0.5 text-xs text-text-secondary">Студент</p>
    </div>
  </BaseCard>
</template>
