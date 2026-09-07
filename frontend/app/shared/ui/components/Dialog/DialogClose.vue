<script setup lang="ts">
import { dialogKey } from './context'

const dialog = inject(dialogKey)

if (!dialog) {
  throw new Error('DialogClose must be used inside Dialog')
}
</script>

<template>
  <button type="button" @click="dialog.close()">
    <slot />
  </button>
</template>
