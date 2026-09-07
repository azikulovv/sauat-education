<script setup lang="ts">
interface Props {
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  cols: 3,
  gap: 'md',
})
</script>

<template>
  <div
    :class="[
      'grid',
      {
        'grid-cols-1': cols === 1,
        'grid-cols-1 sm:grid-cols-2': cols === 2,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': cols === 3,
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': cols === 4,

        'gap-2': gap === 'sm',
        'gap-4': gap === 'md',
        'gap-6': gap === 'lg',
      },
    ]"
  >
    <slot />
  </div>
</template>
