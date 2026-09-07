<script setup lang="ts">
type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'

type BadgeSize = 'sm' | 'md'

interface Props {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: Component
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'sm',
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5',
      'rounded-full',
      'font-semibold',
      'whitespace-nowrap',
      {
        'min-h-5.5 px-2 text-[11px]': size === 'sm',
        'min-h-6 px-2.5 text-xs': size === 'md',
        'bg-(--color-bg-subtle) text-text-secondary': variant === 'neutral',
        'bg-(--color-primary-subtle) text-primary': variant === 'primary',
        'bg-(--color-success-subtle) text-success': variant === 'success',
        'bg-(--color-warning-subtle) text-warning': variant === 'warning',
        'bg-(--color-error-subtle) text-error': variant === 'error',
        'bg-(--color-info-subtle) text-info': variant === 'info',
      },
    ]"
  >
    <component :is="icon" v-if="icon" class="size-3.5" aria-hidden="true" />

    <slot />
  </span>
</template>
