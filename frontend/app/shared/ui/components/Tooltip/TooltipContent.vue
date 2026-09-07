<script setup lang="ts">
import { inject } from 'vue'
import { tooltipKey } from './context'

const tooltip = inject(tooltipKey)

if (!tooltip) {
  throw new Error('TooltipContent must be used inside Tooltip')
}
</script>

<template>
  <div
    v-if="tooltip.open.value"
    class="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-text-primary px-2.5 py-1.5 text-xs text-text-inverse shadow-md"
    role="tooltip"
  >
    <slot />
  </div>
</template>
