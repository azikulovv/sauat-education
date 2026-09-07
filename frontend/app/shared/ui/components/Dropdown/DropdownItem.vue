<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { dropdownKey } from './context'

interface Props {
  value: string
  disabled?: boolean
  destructive?: boolean
  inset?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  destructive: false,
  inset: false,
})

const emit = defineEmits<{
  select: [value: string]
}>()

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownItem must be used inside Dropdown')
}

const element = ref<HTMLDivElement | null>(null)

const id = useId()

const highlighted = computed(() => dropdown.highlightedValue.value === props.value)

function register() {
  dropdown?.registerItem({
    value: props.value,
    id,
    disabled: props.disabled,
    element: element.value,
  })
}

function select() {
  if (props.disabled) {
    return
  }

  emit('select', props.value)

  dropdown?.select(props.value)
}

function handleClick() {
  select()
}

function handleMouseEnter() {
  if (props.disabled) {
    return
  }

  dropdown?.highlight(props.value, false)
}

onMounted(register)

onBeforeUnmount(() => {
  dropdown.unregisterItem(props.value)
})
</script>

<template>
  <div
    :id="id"
    ref="element"
    role="menuitem"
    :tabindex="disabled ? -1 : highlighted ? 0 : -1"
    :aria-disabled="disabled ? 'true' : undefined"
    :class="[
      `
        flex
        min-h-9
        select-none
        items-center
        gap-2
        rounded-md
        px-3
        py-2
        text-sm
        outline-none
        transition-colors
      `,

      inset ? 'pl-9' : '',

      disabled
        ? `
          pointer-events-none
          cursor-not-allowed
          opacity-40
        `
        : `
          cursor-pointer
        `,

      highlighted && !disabled
        ? `
          bg-surface-hover
          text-text-primary
        `
        : `
          text-text-secondary
        `,

      destructive && !disabled ? 'text-error' : '',
    ]"
    @mouseenter="handleMouseEnter"
    @click="handleClick"
  >
    <slot />

    <Check v-if="highlighted" class="ml-auto size-4 shrink-0" aria-hidden="true" />
  </div>
</template>
