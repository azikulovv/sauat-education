<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rows?: number
  maxlength?: number
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  required: false,
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaId = computed(() => props.id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`)

const hasError = computed(() => Boolean(props.error))

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement

  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex w-full flex-col gap-1.5">
    <label v-if="label" :for="textareaId" class="text-label text-text-primary">
      {{ label }}

      <span v-if="required" class="text-error" aria-hidden="true"> * </span>
    </label>

    <textarea
      :id="textareaId"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      :aria-invalid="hasError"
      :class="[
        'w-full resize-y bg-surface',
        'rounded-md border',
        'px-3 py-2.5',
        'text-sm leading-5 text-text-primary',
        'placeholder:text-text-tertiary',
        'transition-colors duration-150',
        'focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-text-disabled',

        {
          'border-error focus:border-error focus:ring-3 focus:ring-(--color-error-subtle)':
            hasError,

          'border-border hover:border-(--color-border-strong) focus:border-primary focus:ring-3 focus:ring-(--color-primary-subtle)':
            !hasError,
        },
      ]"
      @input="onInput"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />

    <p v-if="error" class="text-xs text-error">
      {{ error }}
    </p>

    <p v-else-if="hint" class="text-xs text-text-tertiary">
      {{ hint }}
    </p>
  </div>
</template>
