<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

import { Check } from 'lucide-vue-next'

import { selectKey } from './context'

interface Props {
  value: string
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectItem must be used inside Select')
}

const element = ref<HTMLElement | null>(null)

const id = useId()

const selected = computed(() => select.value.value === props.value)

const highlighted = computed(() => select.highlightedValue.value === props.value)

function handleClick() {
  if (props.disabled) {
    return
  }

  select!.setValue(props.value)
}

function handleMouseEnter() {
  if (props.disabled) {
    return
  }

  select!.highlight(props.value)
}

onMounted(() => {
  select.registerItem({
    value: props.value,
    label: props.label ?? element.value?.textContent?.trim() ?? props.value,
    disabled: props.disabled,
    id,
    element: element.value,
  })
})

onBeforeUnmount(() => {
  select.unregisterItem(props.value)
})
</script>

<template>
  <button
    :id="id"
    ref="element"
    type="button"
    role="option"
    :aria-selected="selected"
    :aria-disabled="disabled"
    :data-state="selected ? 'checked' : 'unchecked'"
    :data-highlighted="highlighted ? '' : undefined"
    :disabled="disabled"
    :class="[
      'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors',
      'disabled:pointer-events-none disabled:opacity-40',

      highlighted && !selected ? 'bg-bg-muted text-text-primary' : '',

      selected ? 'bg-primary/10 text-primary' : 'text-text-primary',

      !highlighted && !selected ? 'hover:bg-bg-muted' : '',
    ]"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <span class="min-w-0 truncate">
      <slot />
    </span>

    <Check v-if="selected" class="ml-2 size-4 shrink-0" aria-hidden="true" />
  </button>
</template>
