<script setup lang="ts">
import { popoverKey, type PopoverContext } from './context'

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

const internalOpen = ref(props.defaultOpen)

const open = computed({
  get() {
    return props.modelValue ?? internalOpen.value
  },

  set(value: boolean) {
    internalOpen.value = value

    emit('update:modelValue', value)

    if (value) {
      emit('open')
    } else {
      emit('close')
    }
  },
})

const triggerElement = ref<HTMLElement | null>(null)

const contentElement = ref<HTMLElement | null>(null)

const triggerId = useId()
const contentId = useId()

function setOpen(value: boolean) {
  open.value = value
}

function toggle() {
  setOpen(!open.value)
}

function close() {
  setOpen(false)
}

function setTriggerElement(element: HTMLElement | null) {
  triggerElement.value = element
}

function setContentElement(element: HTMLElement | null) {
  contentElement.value = element
}

const context: PopoverContext = {
  open,
  triggerId,
  contentId,
  triggerElement,
  contentElement,
  setOpen,
  toggle,
  close,
  setTriggerElement,
  setContentElement,
}

provide(popoverKey, context)
</script>

<template>
  <div class="relative inline-block">
    <slot />
  </div>
</template>
