<script setup lang="ts">
type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface Props {
  size?: ContainerSize
  as?: keyof HTMLElementTagNameMap
}

withDefaults(defineProps<Props>(), {
  size: 'xl',
  as: 'div',
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'mx-auto w-full px-4 sm:px-6 lg:px-8',
      {
        'max-w-3xl': size === 'sm',
        'max-w-5xl': size === 'md',
        'max-w-6xl': size === 'lg',
        'max-w-7xl': size === 'xl',
        'max-w-none': size === 'full',
      },
    ]"
  >
    <slot />
  </component>
</template>
