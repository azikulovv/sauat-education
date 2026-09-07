<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { dropdownKey } from './context'

interface Props {
  modelValue?: boolean
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultOpen: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const open = ref(props.modelValue ?? props.defaultOpen)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      open.value = value
    }
  },
)

function setOpen(value: boolean) {
  open.value = value
  emit('update:modelValue', value)
}

provide(dropdownKey, {
  open,
  setOpen,
  close: () => setOpen(false),
})
</script>

<template>
  <div class="relative inline-block">
    <slot />
  </div>
</template>
