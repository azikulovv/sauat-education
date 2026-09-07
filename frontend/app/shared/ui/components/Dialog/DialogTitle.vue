<script setup lang="ts">
import { dialogKey } from './context'

const dialog = inject(dialogKey)

if (!dialog) {
  throw new Error('DialogTitle must be used inside Dialog')
}
</script>

<template>
  <h2 :id="dialog.titleId" class="pr-8 text-lg font-semibold text-text-primary">
    <slot />
  </h2>
</template>
