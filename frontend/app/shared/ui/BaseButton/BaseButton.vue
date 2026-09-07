<script setup lang="ts">
import type { Component } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  leadingIcon?: Component
  trailingIcon?: Component
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
})

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <button
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2',
      'rounded-md border border-transparent',
      'font-sans font-semibold',
      'transition-colors duration-150',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      'focus-visible:outline-(--focus-ring-color)',
      'disabled:pointer-events-none disabled:opacity-50',

      {
        'min-h-9 px-3 text-xs': size === 'sm',
        'min-h-10 px-4 text-sm': size === 'md',
        'min-h-11 px-5 text-base': size === 'lg',

        'w-full': fullWidth,

        'bg-primary text-white hover:bg-(--color-primary-hover)': variant === 'primary',

        'border-border bg-surface text-text-primary hover:bg-(--color-surface-hover)':
          variant === 'secondary',

        'text-text-secondary hover:bg-(--color-bg-subtle) hover:text-text-primary':
          variant === 'ghost',

        'bg-error text-white hover:bg-(--color-error-hover)': variant === 'danger',
      },
    ]"
  >
    <component :is="leadingIcon" v-if="leadingIcon && !loading" class="size-4 shrink-0" />

    <svg
      v-if="loading"
      class="size-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" class="opacity-25" stroke="currentColor" stroke-width="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        class="opacity-90"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>

    <span>
      <slot />
    </span>

    <component :is="trailingIcon" v-if="trailingIcon && !loading" class="size-4 shrink-0" />
  </button>
</template>
