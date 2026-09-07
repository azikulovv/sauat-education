<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { selectKey } from './context'

interface Props {
  value: string
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  disabled: false,
})

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectItem must be used inside Select')
}

const element = ref<HTMLDivElement | null>(null)
const id = useId()
const selected = computed(() => select.value.value === props.value)
const highlighted = computed(() => select.highlightedValue.value === props.value)
const resolvedLabel = computed(
  () => props.label ?? element.value?.textContent?.trim() ?? props.value,
)

function register() {
  select!.registerItem({
    value: props.value,
    label: resolvedLabel.value,
    disabled: props.disabled,
    id,
    element: element.value,
  })
}

function selectItem() {
  if (props.disabled) {
    return
  }

  select!.select(props.value)
}

function handleMouseEnter() {
  if (props.disabled) {
    return
  }

  select!.highlight(props.value, false)
}

onMounted(() => {
  register()
})

onBeforeUnmount(() => {
  select.unregisterItem(props.value)
})
</script>

<template>
  <div
    :id="id"
    ref="element"
    role="option"
    :aria-selected="selected"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="highlighted ? 0 : -1"
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
    ]"
    @mouseenter="handleMouseEnter"
    @click="selectItem"
  >
    <span class="min-w-0 flex-1">
      <slot />
    </span>

    <Check v-if="selected" class="size-4 shrink-0 text-primary" aria-hidden="true" />
  </div>
</template>
