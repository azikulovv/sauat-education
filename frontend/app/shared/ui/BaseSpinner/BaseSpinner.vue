<script setup lang="ts">
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
  size?: SpinnerSize
  label?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  label: 'Загрузка',
})
</script>

<template>
  <span class="inline-flex items-center justify-center" role="status" :aria-label="label">
    <span
      :class="[
        'animate-spin rounded-full border-2 border-border border-t-primary',
        {
          'size-3': size === 'xs',
          'size-4': size === 'sm',
          'size-5': size === 'md',
          'size-6': size === 'lg',
        },
      ]"
    />

    <span class="sr-only">
      {{ label }}
    </span>
  </span>
</template>
