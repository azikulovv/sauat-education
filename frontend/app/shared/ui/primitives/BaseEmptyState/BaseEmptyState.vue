<script setup lang="ts">
interface Props {
  icon?: Component
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-12 text-center">
    <div
      v-if="icon"
      class="mb-4 flex size-12 items-center justify-center rounded-lg bg-bg-muted text-text-secondary"
    >
      <component :is="icon" class="size-6" aria-hidden="true" />
    </div>

    <h3 class="text-base font-semibold text-text-primary">
      {{ title }}
    </h3>

    <p v-if="description" class="mt-1 max-w-md text-sm text-text-secondary">
      {{ description }}
    </p>

    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </div>
</template>
