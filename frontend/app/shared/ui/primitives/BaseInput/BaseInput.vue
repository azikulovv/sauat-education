<script setup lang="ts">
type InputSize = 'sm' | 'md' | 'lg'

interface Props {
  modelValue?: string
  type?: string
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: InputSize
  id?: string
  name?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputId = computed(() => props.id ?? `input-${Math.random().toString(36).slice(2, 9)}`)

const hasError = computed(() => Boolean(props.error))

function onInput(event: Event) {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex w-full flex-col gap-1.5">
    <label v-if="label" :for="inputId" class="text-label text-text-primary">
      {{ label }}

      <span v-if="required" class="text-error" aria-hidden="true"> * </span>
    </label>

    <input
      :id="inputId"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="hasError"
      :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
      :class="[
        'w-full bg-surface',
        'border rounded-md',
        'text-text-primary placeholder:text-text-tertiary',
        'transition-colors duration-150',
        'focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-text-disabled',
        'readonly:bg-bg-subtle',

        {
          'h-9 px-3 text-xs': size === 'sm',
          'h-10.5 px-3 text-sm': size === 'md',
          'h-12 px-3.5 text-base': size === 'lg',

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

    <p v-if="error" :id="`${inputId}-error`" class="text-xs text-error">
      {{ error }}
    </p>

    <p v-else-if="hint" :id="`${inputId}-hint`" class="text-xs text-text-tertiary">
      {{ hint }}
    </p>
  </div>
</template>
