<script setup lang="ts">
import { dropdownKey } from './context'

interface Props {
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  collisionPadding?: number
  minWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  side: 'bottom',
  align: 'start',
  sideOffset: 6,
  collisionPadding: 8,
  minWidth: 180,
})

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownContent must be used inside Dropdown')
}

const element = ref<HTMLDivElement | null>(null)

const style = ref<Record<string, string>>({})

let resizeObserver: ResizeObserver | undefined

let typeaheadBuffer = ''

let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

function updatePosition() {
  const trigger = dropdown!.triggerElement.value

  const content = element.value

  if (!trigger || !content) {
    return
  }

  const triggerRect = trigger.getBoundingClientRect()

  const contentRect = content.getBoundingClientRect()

  const viewportWidth = window.innerWidth

  const viewportHeight = window.innerHeight

  const padding = props.collisionPadding

  const offset = props.sideOffset

  let side = props.side

  let top = 0
  let left = 0

  const availableBottom = viewportHeight - triggerRect.bottom - padding

  const availableTop = triggerRect.top - padding

  const shouldFlipBottom =
    side === 'bottom' &&
    contentRect.height + offset > availableBottom &&
    availableTop > availableBottom

  const shouldFlipTop =
    side === 'top' && contentRect.height + offset > availableTop && availableBottom > availableTop

  if (shouldFlipBottom) {
    side = 'top'
  }

  if (shouldFlipTop) {
    side = 'bottom'
  }

  if (side === 'bottom') {
    top = triggerRect.bottom + offset
  } else {
    top = triggerRect.top - contentRect.height - offset
  }

  switch (props.align) {
    case 'start':
      left = triggerRect.left
      break

    case 'center':
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
      break

    case 'end':
      left = triggerRect.right - contentRect.width
      break
  }

  left = Math.max(padding, Math.min(left, viewportWidth - contentRect.width - padding))

  top = Math.max(padding, Math.min(top, viewportHeight - contentRect.height - padding))

  style.value = {
    position: 'fixed',
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
    minWidth: `${Math.max(props.minWidth, triggerRect.width)}px`,
  }
}

function focusHighlighted() {
  const value = dropdown!.highlightedValue.value

  if (!value) {
    return
  }

  const item = dropdown!.items.value.find((item) => item.value === value)

  item?.element?.focus()
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()

      dropdown?.moveHighlight(1)

      break

    case 'ArrowUp':
      event.preventDefault()

      dropdown?.moveHighlight(-1)

      break

    case 'Home':
      event.preventDefault()

      dropdown?.highlightFirst()

      break

    case 'End':
      event.preventDefault()

      dropdown?.highlightLast()

      break

    case 'Enter':
    case ' ':
      event.preventDefault()

      if (dropdown?.highlightedValue.value) {
        dropdown.select(dropdown.highlightedValue.value)
      }

      break

    case 'Escape':
      event.preventDefault()

      dropdown?.close()

      requestAnimationFrame(() => {
        dropdown?.triggerElement.value?.focus()
      })

      break

    case 'Tab':
      dropdown?.close()

      break

    default:
      handleTypeahead(event)
  }
}

function handleTypeahead(event: KeyboardEvent) {
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
    return
  }

  typeaheadBuffer += event.key.toLocaleLowerCase()

  if (typeaheadTimer) {
    clearTimeout(typeaheadTimer)
  }

  typeaheadTimer = setTimeout(() => {
    typeaheadBuffer = ''
  }, 500)

  const enabled = dropdown!.getEnabledItems()

  if (!enabled.length) {
    return
  }

  const currentIndex = enabled.findIndex((item) => item.value === dropdown!.highlightedValue.value)

  const ordered = [...enabled.slice(currentIndex + 1), ...enabled.slice(0, currentIndex + 1)]

  const match = ordered.find((item) => {
    const text = item.element?.textContent?.trim().toLocaleLowerCase()

    return text?.startsWith(typeaheadBuffer)
  })

  if (match) {
    dropdown!.highlight(match.value)
  }
}

function handleOutsideClick(event: MouseEvent) {
  if (!dropdown?.open.value) {
    return
  }

  const target = event.target as Node

  const content = element.value

  const trigger = dropdown.triggerElement.value

  if (content?.contains(target) || trigger?.contains(target)) {
    return
  }

  dropdown.close()
}

function handleEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !dropdown?.open.value) {
    return
  }

  event.preventDefault()

  dropdown.close()

  requestAnimationFrame(() => {
    dropdown.triggerElement.value?.focus()
  })
}

function handleWindowChange() {
  if (!dropdown?.open.value) {
    return
  }

  updatePosition()
}

watch(
  () => dropdown.open.value,
  async (isOpen) => {
    if (!isOpen) {
      return
    }

    await nextTick()

    requestAnimationFrame(() => {
      updatePosition()
      focusHighlighted()
    })
  },
)

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)

  document.addEventListener('keydown', handleEscape)

  window.addEventListener('resize', handleWindowChange)

  window.addEventListener('scroll', handleWindowChange, true)

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (dropdown.open.value) {
        updatePosition()
      }
    })

    if (element.value) {
      resizeObserver.observe(element.value)
    }

    if (dropdown.triggerElement.value) {
      resizeObserver.observe(dropdown.triggerElement.value)
    }
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)

  document.removeEventListener('keydown', handleEscape)

  window.removeEventListener('resize', handleWindowChange)

  window.removeEventListener('scroll', handleWindowChange, true)

  resizeObserver?.disconnect()

  if (typeaheadTimer) {
    clearTimeout(typeaheadTimer)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="
        transition
        duration-100
        ease-out
      "
      enter-from-class="
        opacity-0
        scale-95
      "
      enter-to-class="
        opacity-100
        scale-100
      "
      leave-active-class="
        transition
        duration-75
        ease-in
      "
      leave-from-class="
        opacity-100
        scale-100
      "
      leave-to-class="
        opacity-0
        scale-95
      "
    >
      <div
        v-if="dropdown.open.value"
        :id="dropdown.contentId"
        ref="element"
        class="z-50 max-h-[min(24rem,calc(100vh-1rem))] overflow-y-auto overscroll-contain rounded-lg border border-border bg-surface p-1 text-text-primary shadow-lg outline-none"
        :style="style"
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
