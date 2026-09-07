<script setup lang="ts">
import { dropdownKey, type DropdownItemData } from './context'

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
}>()

const openState = ref(props.defaultOpen)

const open = computed({
  get() {
    return props.modelValue ?? openState.value
  },

  set(value: boolean) {
    openState.value = value
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

const triggerId = useId()
const contentId = useId()

function setOpen(value: boolean) {
  open.value = value
}

function toggle() {
  setOpen(!open.value)
}

function close() {
  setOpen(false)
}

function registerItem(item: DropdownItemData) {
  const exists = items.value.some((existing) => existing.value === item.value)

  if (!exists) {
    items.value.push(item)
  }
}

function unregisterItem(value: string) {
  items.value = items.value.filter((item) => item.value !== value)
}

function highlight(value?: string) {
  highlightedValue.value = value

  if (!value) {
    return
  }

  const item = items.value.find((item) => item.value === value)

  item?.element?.focus()
}

function getEnabledItems() {
  return items.value.filter((item) => !item.disabled)
}

function moveHighlight(direction: 1 | -1) {
  const enabledItems = getEnabledItems()

  if (!enabledItems.length) {
    return
  }

  const currentIndex = enabledItems.findIndex((item) => item.value === highlightedValue.value)

  let nextIndex

  if (currentIndex === -1) {
    nextIndex = direction === 1 ? 0 : enabledItems.length - 1
  } else {
    nextIndex = (currentIndex + direction + enabledItems.length) % enabledItems.length
  }

  highlight(enabledItems[nextIndex]?.value)
}

const triggerElement = ref<HTMLElement | null>(null)

function setTriggerElement(element: HTMLElement | null) {
  triggerElement.value = element
}

provide(dropdownKey, {
  open,
  highlightedValue,
  triggerElement,
  items,
  triggerId,
  contentId,
  setOpen,
  toggle,
  close,
  registerItem,
  unregisterItem,
  highlight,
  moveHighlight,
  setTriggerElement,
})
</script>

<template>
  <div class="relative inline-block">
    <slot />
  </div>
</template>
