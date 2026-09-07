<script setup lang="ts">
interface Props {
  modelValue?: string | number
  value: string | number
  label?: string
  description?: string
  disabled?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const radioId = computed(() => props.id ?? `radio-${Math.random().toString(36).slice(2, 9)}`)

const isChecked = computed(() => props.modelValue === props.value)

function onChange() {
  emit('update:modelValue', props.value)
}
</script>

<template>
  <label
    :for="radioId"
    class="group flex cursor-pointer items-start gap-3"
    :class="{
      'cursor-not-allowed opacity-50': disabled,
    }"
  >
    <span class="relative mt-0.5 shrink-0">
      <input
        :id="radioId"
        :name="name"
        type="radio"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
        class="peer sr-only"
        @change="onChange"
      />

      <span
        class="flex size-4 items-center justify-center rounded-full border border-border bg-surface transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus-ring-color) peer-checked:border-primary"
      >
        <span v-if="isChecked" class="size-2 rounded-full bg-primary" />
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
