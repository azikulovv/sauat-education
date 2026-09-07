<script setup lang="ts">
import { inject } from 'vue'
import { dialogKey } from './context'

interface Props {
  as?: string
}

withDefaults(defineProps<Props>(), {
  as: 'button',
})

const dialog = inject(dialogKey)

if (!dialog) {
  throw new Error('DialogTrigger must be used inside Dialog')
}
</script>

<template>
  <component :is="as" type="button" @click="dialog.setOpen(true)">
    <slot />
  </component>
</template>
