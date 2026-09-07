<script setup lang="ts">
import { inject } from 'vue'

import { ChevronDown } from 'lucide-vue-next'

import { selectKey } from './context'

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectTrigger must be used inside Select')
}

function handleKeydown(event: KeyboardEvent) {
  if (select?.disabled.value) {
    return
  }

  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
      event.preventDefault()

      if (!select?.open.value) {
        select?.setOpen(true)
      } else {
        select.moveHighlight(1)
      }

      break

    case 'ArrowUp':
      event.preventDefault()

      if (!select?.open.value) {
        select?.setOpen(true)
      } else {
        select.moveHighlight(-1)
      }

      break

    case 'Home':
      if (select?.open.value) {
        event.preventDefault()

        select.highlight(select.items.value.find((item) => !item.disabled)?.value)
      }

      break

    case 'End':
      if (select?.open.value) {
        event.preventDefault()

        const enabled = select.items.value.filter((item) => !item.disabled)

        select.highlight(enabled.at(-1)?.value)
      }

      break

    case 'Escape':
      if (select?.open.value) {
        event.preventDefault()
        select.setOpen(false)
      }

      break
  }
}
</script>

<template>
  <button
    :id="select.triggerId"
    type="button"
    role="combobox"
    :aria-expanded="select.open.value"
    :aria-controls="select.contentId"
    :aria-haspopup="'listbox'"
    :disabled="select.disabled.value"
    :data-state="select.open.value ? 'open' : 'closed'"
    class="flex h-10 w-full items-center justify-between rounded-md border border-border bg-surface px-3 text-sm text-text-primary transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
    @click="select.toggle()"
    @keydown="handleKeydown"
  >
    <span class="min-w-0 flex-1 text-left">
      <slot />
    </span>

    <ChevronDown
      class="ml-2 size-4 shrink-0 text-text-tertiary transition-transform"
      :class="{
        'rotate-180': select.open.value,
      }"
      aria-hidden="true"
    />
  </button>
</template>
