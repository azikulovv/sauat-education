<script setup lang="ts">
import { computed, inject } from 'vue'
import { selectKey } from './context'

interface Props {
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите значение',
})

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectValue must be used inside Select')
}

const value = computed(() => select.value)
</script>

<template>
  <span :class="[value ? 'text-text-primary' : 'text-text-tertiary']">
    <slot>
      {{ value ?? placeholder }}
    </slot>
  </span>
</template>
