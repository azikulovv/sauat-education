<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { dropdownKey } from './context'

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownTrigger must be used inside Dropdown')
}
const triggerRef = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  dropdown!.setTriggerElement(triggerRef.value)
})

onBeforeUnmount(() => {
  dropdown!.setTriggerElement(null)
})

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
      event.preventDefault()

      if (!dropdown?.open.value) {
        dropdown!.open.value = true
      }

      requestAnimationFrame(() => {
        dropdown!.moveHighlight(1)
      })

      break

    case 'ArrowUp':
      event.preventDefault()

      if (!dropdown?.open.value) {
        dropdown!.open.value = true
      }

      requestAnimationFrame(() => {
        dropdown!.moveHighlight(-1)
      })

      break

    case 'Escape':
      if (dropdown!.open.value) {
        event.preventDefault()
        dropdown!.close()
      }

      break
  }
}
</script>

<template>
  <button
    :id="dropdown.triggerId"
    ref="triggerRef"
    type="button"
    class="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/30"
    aria-haspopup="menu"
    :aria-expanded="dropdown.open.value"
    :aria-controls="dropdown.contentId"
    @click="dropdown.toggle"
    @keydown="handleKeydown"
  >
    <slot />

    <ChevronDown
      class="size-4 text-text-tertiary transition-transform"
      :class="{
        'rotate-180': dropdown.open.value,
      }"
      aria-hidden="true"
    />
  </button>
</template>
