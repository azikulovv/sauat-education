<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

import { ChevronDown } from 'lucide-vue-next'

import { selectKey } from './context'

interface Props {
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите значение',
})

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectTrigger must be used inside Select')
}

const element = ref<HTMLButtonElement | null>(null)

const activeDescendant = computed(() => {
  const value = select.highlightedValue.value

  if (!value) {
    return undefined
  }

  return select.getItemByValue(value)?.id
})

const selectedLabel = computed(() => {
  return select.getSelectedItem()?.label ?? props.placeholder
})

const hasValue = computed(() => {
  return select.value.value !== undefined
})

onMounted(() => {
  select.setTriggerElement(element.value)
})

onBeforeUnmount(() => {
  select.setTriggerElement(null)
})

function openAndHighlight(direction: 1 | -1) {
  select!.setOpen(true)

  requestAnimationFrame(() => {
    if (direction === 1) {
      select!.highlightFirst()
    } else {
      select!.highlightLast()
    }
  })
}

function handleKeydown(event: KeyboardEvent) {
  if (select?.disabled.value) {
    return
  }

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()

      if (!select?.open.value) {
        const selected = select!.getSelectedItem()

        select!.setOpen(true)

        requestAnimationFrame(() => {
          select!.highlight(selected?.value ?? select!.getEnabledItems()[0]?.value)
        })
      } else {
        const highlighted = select.highlightedValue.value

        if (highlighted) {
          select.select(highlighted)
        }
      }

      break

    case 'ArrowDown':
      event.preventDefault()

      if (!select?.open.value) {
        openAndHighlight(1)
      } else {
        select.moveHighlight(1)
      }

      break

    case 'ArrowUp':
      event.preventDefault()

      if (!select?.open.value) {
        openAndHighlight(-1)
      } else {
        select.moveHighlight(-1)
      }

      break

    case 'Home':
      if (!select?.open.value) {
        return
      }

      event.preventDefault()

      select.highlightFirst()

      break

    case 'End':
      if (!select?.open.value) {
        return
      }

      event.preventDefault()

      select.highlightLast()

      break

    case 'Escape':
      if (!select?.open.value) {
        return
      }

      event.preventDefault()

      select.close()

      break
  }
}
</script>

<template>
  <button
    :id="select.triggerId"
    ref="element"
    type="button"
    role="combobox"
    :aria-expanded="select.open.value"
    :aria-controls="select.contentId"
    aria-haspopup="listbox"
    :aria-activedescendant="activeDescendant"
    :disabled="select.disabled.value"
    class="flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors hover:bg-surface-hover focus:ring-2 focus:ring-primary/30 disabled:pointer-events-none disabled:opacity-50"
    @click="select.toggle"
    @keydown="handleKeydown"
  >
    <span
      :class="[
        'min-w-0 flex-1 truncate text-left',

        hasValue ? 'text-text-primary' : 'text-text-tertiary',
      ]"
    >
      {{ selectedLabel }}
    </span>

    <ChevronDown
      class="size-4 shrink-0 text-text-tertiary transition-transform duration-150"
      :class="{
        'rotate-180': select.open.value,
      }"
      aria-hidden="true"
    />
  </button>
</template>
