<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { dropdownKey } from './context'

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownTrigger must be used inside Dropdown')
}

const element = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  dropdown.setTriggerElement(element.value)
})

onBeforeUnmount(() => {
  dropdown.setTriggerElement(null)
})

function openAndHighlight(direction: 1 | -1) {
  dropdown?.setOpen(true)

  requestAnimationFrame(() => {
    if (direction === 1) {
      dropdown?.highlightFirst()
    } else {
      dropdown?.highlightLast()
    }
  })
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()

      if (dropdown?.open.value) {
        dropdown.close()
      } else {
        openAndHighlight(1)
      }

      break

    case 'ArrowDown':
      event.preventDefault()

      if (!dropdown?.open.value) {
        openAndHighlight(1)
      } else {
        dropdown.moveHighlight(1)
      }

      break

    case 'ArrowUp':
      event.preventDefault()

      if (!dropdown?.open.value) {
        openAndHighlight(-1)
      } else {
        dropdown.moveHighlight(-1)
      }

      break

    case 'Escape':
      if (!dropdown?.open.value) {
        return
      }

      event.preventDefault()

      dropdown.close()

      break

    case 'Home':
      if (!dropdown?.open.value) {
        return
      }

      event.preventDefault()

      dropdown.highlightFirst()

      break

    case 'End':
      if (!dropdown?.open.value) {
        return
      }

      event.preventDefault()

      dropdown.highlightLast()

      break
  }
}
</script>

<template>
  <button
    :id="dropdown.triggerId"
    ref="element"
    type="button"
    class="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:pointer-events-none disabled:opacity-50"
    aria-haspopup="menu"
    :aria-expanded="dropdown.open.value"
    :aria-controls="dropdown.contentId"
    @click="dropdown.toggle"
    @keydown="handleKeydown"
  >
    <slot />

    <ChevronDown
      class="size-4 shrink-0 text-text-tertiary transition-transform duration-150"
      :class="{
        'rotate-180': dropdown.open.value,
      }"
      aria-hidden="true"
    />
  </button>
</template>
