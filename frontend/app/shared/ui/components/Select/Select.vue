<script setup lang="ts">
import { computed, nextTick, provide, ref, watch } from 'vue'

import { selectKey, type SelectItemData } from './context'

interface Props {
  modelValue?: string
  defaultValue?: string
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const value = ref<string | undefined>(props.modelValue ?? props.defaultValue)

const open = ref(false)

const highlightedValue = ref<string | undefined>()

const items = ref<SelectItemData[]>([])

const disabled = computed(() => props.disabled)

const triggerId = props.id ?? useId()

const contentId = `${triggerId}-content`

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      value.value = newValue
    }
  },
)

const enabledItems = computed(() => items.value.filter((item) => !item.disabled))

function setValue(newValue: string) {
  const item = items.value.find((item) => item.value === newValue)

  if (!item || item.disabled) {
    return
  }

  value.value = newValue

  emit('update:modelValue', newValue)

  emit('change', newValue)

  open.value = false

  nextTick(() => {
    document.getElementById(triggerId)?.focus()
  })
}

function setOpen(newValue: boolean) {
  if (disabled.value) {
    return
  }

  open.value = newValue

  if (newValue) {
    nextTick(() => {
      highlightedValue.value = value.value ?? enabledItems.value[0]?.value
    })
  }
}

function toggle() {
  setOpen(!open.value)
}

function registerItem(item: SelectItemData) {
  const existingIndex = items.value.findIndex((current) => current.value === item.value)

  if (existingIndex === -1) {
    items.value.push(item)
  } else {
    items.value[existingIndex] = item
  }
}

function unregisterItem(itemValue: string) {
  items.value = items.value.filter((item) => item.value !== itemValue)
}

function highlight(itemValue?: string) {
  if (!itemValue) {
    highlightedValue.value = undefined

    return
  }

  const item = items.value.find((current) => current.value === itemValue)

  if (!item || item.disabled) {
    return
  }

  highlightedValue.value = itemValue
}

function moveHighlight(direction: 1 | -1) {
  if (!enabledItems.value.length) {
    return
  }

  const currentIndex = enabledItems.value.findIndex((item) => item.value === highlightedValue.value)

  let nextIndex

  if (currentIndex === -1) {
    nextIndex = direction === 1 ? 0 : enabledItems.value.length - 1
  } else {
    nextIndex = currentIndex + direction

    if (nextIndex >= enabledItems.value.length) {
      nextIndex = 0
    }

    if (nextIndex < 0) {
      nextIndex = enabledItems.value.length - 1
    }
  }

  highlightedValue.value = enabledItems.value[nextIndex]?.value

  nextTick(() => {
    const item = enabledItems.value[nextIndex]

    item?.element?.scrollIntoView({
      block: 'nearest',
    })
  })
}

function getSelectedItem() {
  return items.value.find((item) => item.value === value.value)
}

provide(selectKey, {
  value,
  open,
  highlightedValue,
  disabled,
  items,

  triggerId,
  contentId,

  setValue,
  setOpen,
  toggle,

  registerItem,
  unregisterItem,

  highlight,
  moveHighlight,

  getSelectedItem,
})
</script>

<template>
  <div class="relative w-full">
    <slot />
  </div>
</template>
