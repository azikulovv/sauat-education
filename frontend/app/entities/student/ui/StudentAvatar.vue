<script setup lang="ts">
import { BaseAvatar } from '~/shared/ui'
import type { Student } from '../model/types'

interface Props {
  student: Student
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})
</script>

<template>
  <BaseAvatar
    :src="student.avatar"
    :alt="student.name"
    :fallback="student.name"
    :size="size"
    :status="status"
  />
</template>
