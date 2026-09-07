<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <div v-if="orientation === 'horizontal'" class="flex items-center gap-3" role="separator">
    <div class="h-px flex-1 bg-border" />

    <span v-if="label" class="text-xs text-text-tertiary">
      {{ label }}
    </span>

    <div class="h-px flex-1 bg-border" />
  </div>

  <div v-else class="h-full w-px bg-border" role="separator" aria-orientation="vertical" />
</template>
