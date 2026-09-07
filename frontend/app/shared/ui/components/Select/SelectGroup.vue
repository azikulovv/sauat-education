<script setup lang="ts">
interface Props {
  label?: string
}

const props = defineProps<Props>()
const id = useId()

provide('select-group', {
  id,
})

const labelledBy = computed(() => (props.label ? `${id}-label` : undefined))
</script>

<template>
  <div role="group" :aria-labelledby="labelledBy" class="py-1">
    <slot />
  </div>
</template>
