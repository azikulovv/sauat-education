<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, onMounted } from 'vue'

import { selectKey } from './context'

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectContent must be used inside Select')
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && select?.open.value) {
    event.preventDefault()

    select.setOpen(false)

    nextTick(() => {
      document.getElementById(select.triggerId)?.focus()
    })
  }
}

function handlePointerDown(event: PointerEvent) {
  const target = event.target as Node

  const trigger = document.getElementById(select!.triggerId)

  const content = document.getElementById(select!.contentId)

  if (trigger?.contains(target) || content?.contains(target)) {
    return
  }

  select!.setOpen(false)
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)

  document.addEventListener('pointerdown', handlePointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)

  document.removeEventListener('pointerdown', handlePointerDown)
})
</script>

<template>
  <div
    v-if="select.open.value"
    :id="select.contentId"
    class="absolute left-0 top-full z-40 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-border bg-surface p-1 shadow-lg"
    role="listbox"
    :aria-labelledby="select.triggerId"
    tabindex="-1"
  >
    <slot />
  </div>
</template>
