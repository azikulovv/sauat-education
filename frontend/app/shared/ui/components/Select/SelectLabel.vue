<script setup lang="ts">
import { inject } from 'vue'

const group = inject<{
  id: string
} | null>('select-group', null)
</script>

<template>
  <div
    :id="group ? `${group.id}-label` : undefined"
    class="px-3 py-1.5 text-xs font-medium text-text-tertiary"
  >
    <slot />
  </div>
</template>
