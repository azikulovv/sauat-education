<script setup lang="ts">
type StackDirection = 'row' | 'column'
type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  direction?: StackDirection
  gap?: StackGap
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between'
  wrap?: boolean
}

withDefaults(defineProps<Props>(), {
  direction: 'column',
  gap: 'md',
  align: 'stretch',
  justify: 'start',
  wrap: false,
})
</script>

<template>
  <div
    :class="[
      'flex',
      {
        'flex-row': direction === 'row',
        'flex-col': direction === 'column',

        'gap-1': gap === 'xs',
        'gap-2': gap === 'sm',
        'gap-4': gap === 'md',
        'gap-6': gap === 'lg',
        'gap-8': gap === 'xl',

        'items-start': align === 'start',
        'items-center': align === 'center',
        'items-end': align === 'end',
        'items-stretch': align === 'stretch',

        'justify-start': justify === 'start',
        'justify-center': justify === 'center',
        'justify-end': justify === 'end',
        'justify-between': justify === 'between',

        'flex-wrap': wrap,
      },
    ]"
  >
    <slot />
  </div>
</template>
