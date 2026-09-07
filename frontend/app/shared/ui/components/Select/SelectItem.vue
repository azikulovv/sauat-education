<script setup lang="ts">
import { computed, inject } from 'vue'
import { Check } from 'lucide-vue-next'
import { selectKey } from './context'

interface Props {
  value: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectItem must be used inside Select')
}

const selected = computed(() => select.value.value === props.value)
</script>

<template>
  <button
    type="button"
    role="option"
    :aria-selected="selected"
    :disabled="disabled"
    :class="[
      'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm',
      'transition-colors',
      'disabled:pointer-events-none disabled:opacity-50',
      selected ? 'bg-primary/10 text-primary' : 'text-text-primary hover:bg-bg-muted',
    ]"
    @click="select.setValue(value)"
  >
    <slot />

    <Check v-if="selected" class="size-4" />
  </button>
</template>
