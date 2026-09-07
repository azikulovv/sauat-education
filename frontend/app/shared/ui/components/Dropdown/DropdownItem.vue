<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { dropdownKey } from './context'

interface Props {
  value: string
  disabled?: boolean
  destructive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  destructive: false,
})

const emit = defineEmits<{
  select: [value: string]
}>()

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownItem must be used inside Dropdown')
}

const element = ref<HTMLElement | null>(null)
const id = useId()

const highlighted = computed(() => dropdown.highlightedValue.value === props.value)

function register() {
  dropdown!.registerItem({
    value: props.value,
    id,
    disabled: props.disabled,
    element: element.value,
  })
}

onMounted(register)

onBeforeUnmount(() => {
  dropdown.unregisterItem(props.value)
})

function select() {
  if (props.disabled) {
    return
  }

  emit('select', props.value)
  dropdown!.close()

  dropdown!.triggerElement.value?.focus()
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    select()
  }
}
</script>

<template>
  <div
    :id="id"
    ref="element"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled || undefined"
    :class="[
      `
        flex
        cursor-default
        select-none
        items-center
        gap-2
        rounded-md
        px-3
        py-2
        text-sm
        outline-none
        transition
      `,
      disabled ? 'pointer-events-none opacity-40' : 'cursor-pointer',
      highlighted && !disabled ? 'bg-surface-hover text-text-primary' : 'text-text-secondary',
      destructive && !disabled ? 'text-error' : '',
    ]"
    @mouseenter="!disabled && dropdown.highlight(props.value)"
    @click="select"
    @keydown="handleKeydown"
  >
    <slot />

    <Check v-if="highlighted" class="ml-auto size-4" aria-hidden="true" />
  </div>
</template>
