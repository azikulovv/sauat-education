<script setup lang="ts">
import { dialogKey } from './context'

const dialog = inject(dialogKey)

if (!dialog) {
  throw new Error('DialogTrigger must be used inside Dialog')
}
</script>

<template>
  <button
    type="button"
    :aria-haspopup="'dialog'"
    :aria-expanded="dialog.open.value"
    @click="dialog.setOpen(true)"
  >
    <slot />
  </button>
</template>
