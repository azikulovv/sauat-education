<script setup lang="ts">
import { popoverKey } from './context'

const popover = inject(popoverKey)

if (!popover) {
  throw new Error('PopoverTrigger must be used inside Popover')
}

const element = ref<HTMLElement | null>(null)

onMounted(() => {
  popover.setTriggerElement(element.value)
})

onBeforeUnmount(() => {
  popover.setTriggerElement(null)
})

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()

    popover!.close()

    element.value?.focus()
  }
}
</script>

<template>
  <button
    :id="popover.triggerId"
    ref="element"
    type="button"
    :aria-expanded="popover.open.value"
    :aria-controls="popover.contentId"
    aria-haspopup="dialog"
    @click="popover.toggle"
    @keydown="handleKeydown"
  >
    <slot />
  </button>
</template>
