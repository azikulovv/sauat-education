<script setup lang="ts">
import { dialogKey } from './context'

const dialog = inject(dialogKey)

if (!dialog) {
  throw new Error('DialogDescription must be used inside Dialog')
}
</script>

<template>
  <p :id="dialog.descriptionId" class="mt-1 text-sm leading-6 text-text-secondary">
    <slot />
  </p>
</template>
