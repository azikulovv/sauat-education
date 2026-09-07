<script setup lang="ts">
import { popoverKey, type PopoverAlign, type PopoverSide } from './context'
import { usePopoverPosition } from './composables/usePopoverPosition'

interface Props {
  side?: PopoverSide
  align?: PopoverAlign
  sideOffset?: number
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  side: 'bottom',
  align: 'start',
  sideOffset: 8,
  closeOnOutsideClick: true,
  closeOnEscape: true,
})

const popover = inject(popoverKey)

if (!popover) {
  throw new Error('PopoverContent must be used inside Popover')
}

const element = ref<HTMLElement | null>(null)

const { style, update } = usePopoverPosition({
  triggerElement: popover.triggerElement,
  contentElement: popover.contentElement,
  open: popover.open,
  side: props.side,
  align: props.align,
  offset: props.sideOffset,
})

function setElement(value: HTMLElement | null) {
  element.value = value

  popover?.setContentElement(value)
}

async function handleOpen() {
  await nextTick()
  update()
}

function handleOutsideClick(event: MouseEvent) {
  if (!props.closeOnOutsideClick || !popover?.open.value) {
    return
  }

  const target = event.target as Node

  const content = popover.contentElement.value

  const trigger = popover.triggerElement.value

  if (content?.contains(target) || trigger?.contains(target)) {
    return
  }

  popover.close()
}

function handleEscape(event: KeyboardEvent) {
  if (!props.closeOnEscape || !popover?.open.value) {
    return
  }

  if (event.key !== 'Escape') {
    return
  }

  event.preventDefault()

  popover.close()

  requestAnimationFrame(() => {
    popover.triggerElement.value?.focus()
  })
}

watch(
  () => popover.open.value,
  (value) => {
    if (value) {
      handleOpen()
    }
  },
)

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)

  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)

  document.removeEventListener('keydown', handleEscape)

  popover.setContentElement(null)
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
        v-if="popover.open.value"
        :id="popover.contentId"
        :ref="(val) => setElement(val as any)"
        :style="style"
        tabindex="-1"
        class="z-50 outline-none"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
