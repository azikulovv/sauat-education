<script setup lang="ts">
interface Props {
  inset?: boolean
}

withDefaults(defineProps<Props>(), {
  inset: false,
})
</script>

<template>
  <div
    :class="[
      'px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-text-tertiary',
      {
        'pl-9': inset,
      },
    ]"
  >
    <slot />
  </div>
</template>
