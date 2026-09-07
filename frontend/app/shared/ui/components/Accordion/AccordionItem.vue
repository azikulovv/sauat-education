<script setup lang="ts">
interface Props {
  value: string
}

const props = defineProps<Props>()

const id = `accordion-${Math.random().toString(36).slice(2)}`

provide('accordion-item', {
  value: props.value,
  id,
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>
