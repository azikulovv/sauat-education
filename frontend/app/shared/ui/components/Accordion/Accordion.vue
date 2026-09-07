<script setup lang="ts">
import { provide, ref } from 'vue'
import { accordionKey, type AccordionType } from './context'

interface Props {
  type?: AccordionType
  collapsible?: boolean
  defaultValue?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'single',
  collapsible: true,
})

const openItems = ref<string[]>(
  Array.isArray(props.defaultValue)
    ? props.defaultValue
    : props.defaultValue
      ? [props.defaultValue]
      : [],
)

function isOpen(value: string) {
  return openItems.value.includes(value)
}

function toggle(value: string) {
  if (isOpen(value)) {
    if (props.type === 'single' && !props.collapsible) {
      return
    }

    openItems.value = openItems.value.filter((item) => item !== value)

    return
  }

  if (props.type === 'single') {
    openItems.value = [value]
  } else {
    openItems.value.push(value)
  }
}

provide(accordionKey, {
  type: props.type,
  collapsible: props.collapsible,
  openItems,
  toggle,
  isOpen,
})
</script>

<template>
  <div class="divide-y divide-border">
    <slot />
  </div>
</template>
