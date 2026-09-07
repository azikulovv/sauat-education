<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  description?: string
  disabled?: boolean
  indeterminate?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checkboxId = computed(() => props.id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`)

function onChange(event: Event) {
  const target = event.target as HTMLInputElement

  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label
    :for="checkboxId"
    class="group flex cursor-pointer items-start gap-3"
    :class="{
      'cursor-not-allowed opacity-50': disabled,
    }"
  >
    <span class="relative mt-0.5 shrink-0">
      <input
        :id="checkboxId"
        :name="name"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :indeterminate="indeterminate"
        class="peer sr-only"
        @change="onChange"
      />

      <span
        class="flex size-4 items-center justify-center rounded-sm border border-border bg-surface transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus-ring-color) peer-checked:border-primary peer-checked:bg-primary"
      >
        <svg
          v-if="modelValue"
          viewBox="0 0 16 16"
          fill="none"
          class="size-3 text-white"
          aria-hidden="true"
        >
          <path
            d="m3.5 8 3 3 6-6"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span v-else-if="indeterminate" class="h-0.5 w-2 bg-white" />
      </span>
    </span>

    <span v-if="label || description" class="flex flex-col gap-0.5">
      <span v-if="label" class="text-sm font-medium text-text-primary">
        {{ label }}
      </span>

      <span v-if="description" class="text-xs leading-5 text-text-secondary">
        {{ description }}
      </span>
    </span>
  </label>
</template>
