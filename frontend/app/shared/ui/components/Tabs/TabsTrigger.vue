<script setup lang="ts">
import { computed, inject } from 'vue'
import { tabsKey } from './context'

interface Props {
  value: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const tabs = inject(tabsKey)

if (!tabs) {
  throw new Error('TabsTrigger must be used inside Tabs')
}

const active = computed(() => tabs.value.value === props.value)
</script>

<template>
  <button
    type="button"
    role="tab"
    :aria-selected="active"
    :disabled="disabled"
    :class="[
      'relative px-3 py-2.5 text-sm font-medium transition-colors',
      'disabled:pointer-events-none disabled:opacity-50',
      active ? 'text-primary' : 'text-text-secondary hover:text-text-primary',
    ]"
    @click="tabs.setValue(value)"
  >
    <slot />

    <span v-if="active" class="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
  </button>
</template>
