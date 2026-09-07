<script setup lang="ts">
import { selectKey } from './context'

interface Props {
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите значение',
})

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectValue must be used inside Select')
}

const label = computed(() => {
  const selected = select.getSelectedItem()

  return selected?.label ?? props.placeholder
})

const hasValue = computed(() => {
  return select.value.value !== undefined
})
</script>

<template>
  <span :class="hasValue ? 'text-text-primary' : 'text-text-tertiary'">
    {{ label }}
  </span>
</template>
