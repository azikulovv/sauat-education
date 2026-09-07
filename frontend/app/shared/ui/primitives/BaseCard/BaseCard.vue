<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

type CardVariant = 'default' | 'muted' | 'interactive'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface Props {
  variant?: CardVariant
  padding?: CardPadding
  as?: keyof HTMLElementTagNameMap
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  as: 'div',
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'rounded-lg border transition-colors',
      {
        'border-border bg-surface': variant === 'default',
        'border-border-subtle bg-bg-muted': variant === 'muted',
        'border-border bg-surface hover:border-border-strong hover:bg-surface-hover':
          variant === 'interactive',
      },
      {
        'p-0': padding === 'none',
        'p-3': padding === 'sm',
        'p-4': padding === 'md',
        'p-6': padding === 'lg',
      },
      props.class,
    ]"
  >
    <slot />
  </component>
</template>
