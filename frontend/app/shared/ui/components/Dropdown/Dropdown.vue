<script setup lang="ts">
import { dropdownKey, type DropdownContext, type DropdownItemData } from './context'

interface Props {
  modelValue?: boolean
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultOpen: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
  select: [value: string]
}>()

const internalOpen = ref(props.defaultOpen)

const open = computed({
  get() {
    return props.modelValue ?? internalOpen.value
  },

  set(value: boolean) {
    if (value === open.value) {
      return
    }

    internalOpen.value = value

    emit('update:modelValue', value)

    if (value) {
      emit('open')
    } else {
      emit('close')
    }
  },
})

const highlightedValue = ref<string>()

const items = ref<DropdownItemData[]>([])

const triggerElement = ref<HTMLElement | null>(null)

const triggerId = useId()
const contentId = useId()

function setOpen(value: boolean) {
  open.value = value
}

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
  highlightedValue.value = undefined
}

function setTriggerElement(element: HTMLElement | null) {
  triggerElement.value = element
}

function registerItem(item: DropdownItemData) {
  const existingIndex = items.value.findIndex((current) => current.value === item.value)

  if (existingIndex === -1) {
    items.value.push(item)
    return
  }

  items.value[existingIndex] = item
}

function unregisterItem(value: string) {
  items.value = items.value.filter((item) => item.value !== value)

  if (highlightedValue.value === value) {
    highlightedValue.value = undefined
  }
}

function getEnabledItems() {
  return items.value.filter((item) => !item.disabled)
}

function highlight(value?: string, focus = true) {
  highlightedValue.value = value

  if (!value || !focus) {
    return
  }

  const item = items.value.find((item) => item.value === value)

  item?.element?.focus()
}

function highlightFirst() {
  const first = getEnabledItems()[0]

  highlight(first?.value)
}

function highlightLast() {
  const enabled = getEnabledItems()

  const last = enabled[enabled.length - 1]

  highlight(last?.value)
}

function moveHighlight(direction: 1 | -1) {
  const enabled = getEnabledItems()

  if (!enabled.length) {
    return
  }

  const currentIndex = enabled.findIndex((item) => item.value === highlightedValue.value)

  if (currentIndex === -1) {
    if (direction === 1) {
      highlightFirst()
    } else {
      highlightLast()
    }

    return
  }

  const nextIndex = (currentIndex + direction + enabled.length) % enabled.length

  highlight(enabled[nextIndex]?.value)
}

function select(value: string) {
  const item = items.value.find((item) => item.value === value)

  if (!item || item.disabled) {
    return
  }

  emit('select', value)

  close()

  requestAnimationFrame(() => {
    triggerElement.value?.focus()
  })
}

const context: DropdownContext = {
  open,
  highlightedValue,
  items,

  triggerId,
  contentId,

  triggerElement,

  setOpen,
  toggle,
  close,

  setTriggerElement,

  registerItem,
  unregisterItem,

  highlight,
  moveHighlight,

  highlightFirst,
  highlightLast,

  getEnabledItems,

  select,
}

provide(dropdownKey, context)
</script>

<template>
  <div class="inline-block">
    <slot />
  </div>
</template>
