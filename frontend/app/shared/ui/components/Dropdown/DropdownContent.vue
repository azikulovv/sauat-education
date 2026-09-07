<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { dropdownKey } from './context'

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownContent must be used inside Dropdown')
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    dropdown?.close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div
    v-if="dropdown.open.value"
    class="absolute right-0 top-full z-40 mt-2 min-w-48 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg"
    role="menu"
  >
    <slot />
  </div>
</template>
