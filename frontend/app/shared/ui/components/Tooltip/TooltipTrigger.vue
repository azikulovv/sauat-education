<script setup lang="ts">
import { inject } from 'vue'
import { tooltipKey } from './context'

const tooltip = inject(tooltipKey)

if (!tooltip) {
  throw new Error('TooltipTrigger must be used inside Tooltip')
}
</script>

<template>
  <span
    @mouseenter="tooltip.setOpen(true)"
    @mouseleave="tooltip.setOpen(false)"
    @focusin="tooltip.setOpen(true)"
    @focusout="tooltip.setOpen(false)"
  >
    <slot />
  </span>
</template>
