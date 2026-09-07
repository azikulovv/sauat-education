<script setup lang="ts">
type SkeletonVariant = 'text' | 'rect' | 'circle'

interface Props {
  variant?: SkeletonVariant
  width?: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'rect',
})
</script>

<template>
  <div
    class="animate-pulse bg-bg-muted"
    :class="{
      'h-4 rounded-sm': variant === 'text',
      'rounded-md': variant === 'rect',
      'rounded-full': variant === 'circle',
    }"
    :style="{
      width: width,
      height: height,
    }"
    aria-hidden="true"
  />
</template>
