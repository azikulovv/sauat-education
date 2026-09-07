<script setup lang="ts">
import { dropdownKey } from './context'

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownContent must be used inside Dropdown')
}

const contentRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)

function handleDocumentClick(event: MouseEvent) {
  if (!dropdown?.open.value) {
    return
  }

  const target = event.target as Node

  if (contentRef.value?.contains(target) || triggerRef.value?.contains(target)) {
    return
  }

  dropdown.close()
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      dropdown!.close()
      triggerRef.value?.focus()
      break

    case 'ArrowDown':
      event.preventDefault()
      dropdown!.moveHighlight(1)
      break

    case 'ArrowUp':
      event.preventDefault()
      dropdown!.moveHighlight(-1)
      break

    case 'Home':
      event.preventDefault()

      dropdown!.highlight(dropdown!.items.value.find((item) => !item.disabled)?.value)

      break

    case 'End':
      event.preventDefault()

      dropdown!.highlight(
        [...dropdown!.items.value].reverse().find((item) => !item.disabled)?.value,
      )

      break

    case 'Tab':
      dropdown!.close()
      break
  }
}

watch(
  () => dropdown.open.value,
  async (value) => {
    if (!value) {
      return
    }

    await nextTick()

    const firstItem = dropdown.items.value.find((item) => !item.disabled)

    firstItem?.element?.focus()
  },
)

onMounted(() => {
  document.addEventListener('mousedown', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentClick)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="dropdown.open.value"
        :id="dropdown.contentId"
        ref="contentRef"
        class="absolute z-50 mt-2 min-w-48 overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-lg outline-none"
        role="menu"
        :aria-labelledby="dropdown.triggerId"
        tabindex="-1"
        @keydown="handleKeydown"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
