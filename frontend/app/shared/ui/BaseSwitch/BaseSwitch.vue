<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  description?: string
  disabled?: boolean
  id?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const switchId = computed(() => props.id ?? `switch-${Math.random().toString(36).slice(2, 9)}`)

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <label
      v-if="label || description"
      :for="switchId"
      class="flex min-w-0 flex-col gap-0.5 cursor-pointer"
      :class="{
        'cursor-not-allowed': disabled,
      }"
    >
      <span v-if="label" class="text-sm font-medium text-text-primary">
        {{ label }}
      </span>

      <span v-if="description" class="text-xs leading-5 text-text-secondary">
        {{ description }}
      </span>
    </label>

    <button
      :id="switchId"
      :name="name"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      class="relative inline-flex h-6 w-10 shrink-0 rounded-full bg-(--color-bg-muted) transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring-color) disabled:cursor-not-allowed disabled:opacity-50"
      :class="{
        'bg-primary': modelValue,
      }"
      @click="toggle"
    >
      <span
        class="pointer-events-none absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-150"
        :class="{
          'translate-x-4': modelValue,
        }"
      />
    </button>
  </div>
</template>
