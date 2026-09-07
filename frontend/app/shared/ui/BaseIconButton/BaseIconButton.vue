<script setup lang="ts">
type IconButtonVariant = 'default' | 'ghost' | 'danger'

type IconButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  icon: Component
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
  loading: false,
})

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <button
    v-bind="$attrs"
    :aria-label="label"
    :title="label"
    :disabled="disabled || loading"
    :class="[
      'inline-flex shrink-0 items-center justify-center',
      'rounded-md',
      'transition-colors duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      'focus-visible:outline-(--focus-ring-color)',
      'disabled:pointer-events-none disabled:opacity-50',

      {
        'size-8': size === 'sm',
        'size-9': size === 'md',
        'size-10': size === 'lg',

        'bg-surface text-text-primary hover:bg-(--color-surface-hover)': variant === 'default',

        'text-text-secondary hover:bg-(--color-bg-subtle) hover:text-text-primary':
          variant === 'ghost',

        'text-error hover:bg-(--color-error-subtle)': variant === 'danger',
      },
    ]"
  >
    <svg
      v-if="loading"
      class="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" class="opacity-25" stroke="currentColor" stroke-width="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>

    <component :is="icon" v-else class="size-4" aria-hidden="true" />
  </button>
</template>
