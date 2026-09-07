<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { selectKey } from './context'

interface Props {
  modelValue?: string
  defaultValue?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = ref(props.modelValue ?? props.defaultValue)

const open = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue
  },
)

function setValue(newValue: string) {
  value.value = newValue
  emit('update:modelValue', newValue)
  open.value = false
}

provide(selectKey, {
  value,
  open,
  setValue,
  setOpen: (value) => {
    if (!props.disabled) {
      open.value = value
    }
  },
})
</script>

<template>
  <div class="relative w-full">
    <slot />
  </div>
</template>
