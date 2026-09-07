<script setup lang="ts">
interface Props {
  label?: string
}

const props = defineProps<Props>()
const id = useId()
const labelledBy = computed(() => (props.label ? `${id}-label` : undefined))

provide('select-group', {
  id,
})
</script>

<template>
  <div role="group" :aria-labelledby="labelledBy" class="py-1">
    <slot />
  </div>
</template>
