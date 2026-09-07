<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'

interface Props {
  label: string
  selected?: boolean
  correct?: boolean
  incorrect?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  selected: false,
  correct: false,
  incorrect: false,
  disabled: false,
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    role="radio"
    :aria-checked="selected"
    class="flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring-color) disabled:pointer-events-none disabled:opacity-70"
    :class="{
      'border-primary bg-primary-subtle text-text-primary': selected && !correct && !incorrect,
      'border-success bg-success-subtle text-text-primary': correct,
      'border-error bg-error-subtle text-text-primary': incorrect,
      'border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-hover':
        !selected && !correct && !incorrect,
    }"
    @click="$emit('click')"
  >
    <span>{{ label }}</span>

    <Check v-if="correct" class="size-4 shrink-0 text-success" aria-label="Правильный ответ" />
    <X v-else-if="incorrect" class="size-4 shrink-0 text-error" aria-label="Неправильный ответ" />
  </button>
</template>
