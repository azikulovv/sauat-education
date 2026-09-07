<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  label: string
  value: string | number
  icon?: Component
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-3">
    <span
      v-if="icon"
      class="flex size-8 shrink-0 items-center justify-center rounded-md bg-bg-subtle text-text-secondary"
    >
      <component :is="icon" class="size-4" aria-hidden="true" />
    </span>

    <div>
      <p class="text-lg font-semibold leading-6 text-text-primary">{{ value }}</p>
      <p class="mt-0.5 text-xs text-text-secondary">{{ label }}</p>
    </div>
  </div>
</template>
