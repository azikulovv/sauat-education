<script setup lang="ts">
import { selectKey } from './context'

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

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectContent must be used inside Select')
}

const element = ref<HTMLDivElement | null>(null)

const style = ref<Record<string, string>>({})

let resizeObserver: ResizeObserver | undefined

let typeaheadBuffer = ''

let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

function updatePosition() {
  const trigger = select?.triggerElement.value
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
  const availableBottom = viewportHeight - triggerRect.bottom - padding
  const availableTop = triggerRect.top - padding

  if (
    side === 'bottom' &&
    contentRect.height + offset > availableBottom &&
    availableTop > availableBottom
  ) {
    side = 'top'
  }

  if (
    side === 'top' &&
    contentRect.height + offset > availableTop &&
    availableBottom > availableTop
  ) {
    side = 'bottom'
  }

  let top =
    side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - contentRect.height - offset

  let left = 0

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

function handleOutsideClick(event: MouseEvent) {
  if (!select?.open.value) {
    return
  }

  const target = event.target as Node

  const content = element.value

  const trigger = select.triggerElement.value

  if (content?.contains(target) || trigger?.contains(target)) {
    return
  }

  select.close()
}

function handleEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !select?.open.value) {
    return
  }

  event.preventDefault()

  select.close()

  requestAnimationFrame(() => {
    select.triggerElement.value?.focus()
  })
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()

      select?.moveHighlight(1)

      break

    case 'ArrowUp':
      event.preventDefault()

      select?.moveHighlight(-1)

      break

    case 'Home':
      event.preventDefault()

      select?.highlightFirst()

      break

    case 'End':
      event.preventDefault()

      select?.highlightLast()

      break

    case 'Enter':
    case ' ':
      event.preventDefault()

      if (select?.highlightedValue.value) {
        select.select(select.highlightedValue.value)
      }

      break

    case 'Escape':
      event.preventDefault()

      select?.close()

      requestAnimationFrame(() => {
        select?.triggerElement.value?.focus()
      })

      break

    case 'Tab':
      select?.close()

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

  const enabled = select!.getEnabledItems()

  if (!enabled.length) {
    return
  }

  const currentIndex = enabled.findIndex((item) => item.value === select!.highlightedValue.value)

  const ordered = [...enabled.slice(currentIndex + 1), ...enabled.slice(0, currentIndex + 1)]

  const match = ordered.find((item) => {
    const label = item.label.trim().toLocaleLowerCase()

    return label.startsWith(typeaheadBuffer)
  })

  if (match) {
    select?.highlight(match.value)
  }
}

function handleResize() {
  if (select?.open.value) {
    updatePosition()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)

  document.addEventListener('keydown', handleEscape)

  window.addEventListener('resize', handleResize)

  window.addEventListener('scroll', handleResize, true)

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (select.open.value) {
        updatePosition()
      }
    })

    if (element.value) {
      resizeObserver.observe(element.value)
    }

    if (select.triggerElement.value) {
      resizeObserver.observe(select.triggerElement.value)
    }
  }
})

watch(
  () => select.open.value,
  async (isOpen) => {
    if (!isOpen) {
      return
    }

    await nextTick()

    requestAnimationFrame(() => {
      updatePosition()

      const selected = select.getSelectedItem()

      select.highlight(selected?.value ?? select.getEnabledItems()[0]?.value, false)
    })
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)

  document.removeEventListener('keydown', handleEscape)

  window.removeEventListener('resize', handleResize)

  window.removeEventListener('scroll', handleResize, true)

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
        v-show="select.open.value"
        :id="select.contentId"
        ref="element"
        class="z-50 max-h-[min(24rem,calc(100vh-1rem))] overflow-y-auto overscroll-contain rounded-lg border border-border bg-surface p-1 text-text-primary shadow-lg outline-none"
        :style="style"
        role="listbox"
        :aria-labelledby="select.triggerId"
        tabindex="-1"
        @keydown="handleKeydown"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
