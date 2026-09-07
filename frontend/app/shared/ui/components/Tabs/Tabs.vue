<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { tabsKey } from './context'

interface Props {
  modelValue?: string
  defaultValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = ref(props.modelValue ?? props.defaultValue)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      value.value = newValue
    }
  },
)

function setValue(newValue: string) {
  value.value = newValue
  emit('update:modelValue', newValue)
}

provide(tabsKey, {
  value,
  setValue,
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>
