<script setup lang="ts">
import { selectKey, type SelectContext, type SelectItemData } from './context'

interface Props {
  modelValue?: string
  defaultValue?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  change: [value: string | undefined]
  open: []
  close: []
}>()

const internalValue = ref<string | undefined>(props.defaultValue)

const value = computed({
  get() {
    return props.modelValue ?? internalValue.value
  },

  set(newValue) {
    internalValue.value = newValue

    emit('update:modelValue', newValue)

    emit('change', newValue)
  },
})

const open = ref(false)
const highlightedValue = ref<string>()
const items = ref<SelectItemData[]>([])
const disabled = computed(() => props.disabled)
const triggerElement = ref<HTMLElement | null>(null)
const triggerId = useId()
const contentId = useId()

function setValue(value: string) {
  const item = items.value.find((item) => item.value === value)

  if (!item || item.disabled) {
    return
  }

  internalValue.value = value

  emit('update:modelValue', value)
  emit('change', value)

  close()
}

function setOpen(newValue: boolean) {
  if (disabled.value && newValue) {
    return
  }

  if (open.value === newValue) {
    return
  }

  open.value = newValue

  if (newValue) {
    emit('open')
  } else {
    emit('close')
  }
}

function toggle() {
  if (disabled.value) {
    return
  }

  setOpen(!open.value)
}

function close() {
  setOpen(false)

  highlightedValue.value = undefined
}

function setTriggerElement(element: HTMLElement | null) {
  triggerElement.value = element
}

function registerItem(item: SelectItemData) {
  const index = items.value.findIndex((current) => current.value === item.value)

  if (index === -1) {
    items.value.push(item)
  } else {
    items.value[index] = item
  }

  if (value.value && item.value === value.value) {
    highlightedValue.value = item.value
  }
}

function unregisterItem(itemValue: string) {
  items.value = items.value.filter((item) => item.value !== itemValue)

  if (highlightedValue.value === itemValue) {
    highlightedValue.value = undefined
  }
}

function getEnabledItems() {
  return items.value.filter((item) => !item.disabled)
}

function getItemByValue(itemValue: string) {
  return items.value.find((item) => item.value === itemValue)
}

function getSelectedItem() {
  if (!value.value) {
    return undefined
  }

  return getItemByValue(value.value)
}

function highlight(itemValue?: string, focus = true) {
  highlightedValue.value = itemValue

  if (!itemValue || !focus) {
    return
  }

  const item = getItemByValue(itemValue)

  item?.element?.scrollIntoView({
    block: 'nearest',
  })
}

function highlightFirst() {
  const first = getEnabledItems()[0]

  highlight(first?.value)
}

function highlightLast() {
  const enabled = getEnabledItems()

  highlight(enabled[enabled.length - 1]?.value)
}

function moveHighlight(direction: 1 | -1) {
  const enabled = getEnabledItems()

  if (!enabled.length) {
    return
  }

  const currentIndex = enabled.findIndex((item) => item.value === highlightedValue.value)

  if (currentIndex === -1) {
    const selectedIndex = enabled.findIndex((item) => item.value === value.value)

    if (selectedIndex !== -1) {
      highlight(enabled[selectedIndex]?.value)

      return
    }

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

watch(
  () => value.value,
  (newValue) => {
    if (newValue) {
      highlightedValue.value = newValue
    }
  },
)

const context: SelectContext = {
  value,
  open,
  highlightedValue,
  disabled,
  items,
  triggerId,
  contentId,
  triggerElement,
  setValue,
  setOpen,
  toggle,
  close,
  setTriggerElement,
  registerItem,
  unregisterItem,
  highlight,
  highlightFirst,
  highlightLast,
  moveHighlight,
  getEnabledItems,
  getSelectedItem,
  select: setValue,
  getItemByValue,
}

provide(selectKey, context)
</script>

<template>
  <div class="relative inline-block">
    <slot />
  </div>
</template>
