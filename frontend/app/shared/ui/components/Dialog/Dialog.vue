<script setup lang="ts">
import { dialogKey } from './context'

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
  open: []
  close: []
}>()

const open = ref(props.modelValue ?? props.defaultOpen)

const baseId = useId()

const contentId = `${baseId}-content`

const titleId = `${baseId}-title`

const descriptionId = `${baseId}-description`

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined && value !== open.value) {
      open.value = value
    }
  },
)

function setOpen(value: boolean) {
  if (value === open.value) {
    return
  }

  open.value = value

  emit('update:modelValue', value)

  if (value) {
    emit('open')
  } else {
    emit('close')
  }
}

function close() {
  setOpen(false)
}

provide(dialogKey, {
  open,
  contentId,
  titleId,
  descriptionId,
  setOpen,
  close,
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>
