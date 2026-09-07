<script setup lang="ts">
import { provide, ref, onBeforeUnmount } from 'vue'
import { tooltipKey } from './context'

interface Props {
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 300,
})

const open = ref(false)

let timer: ReturnType<typeof setTimeout> | undefined

function setOpen(value: boolean) {
  clearTimeout(timer)

  if (value) {
    timer = setTimeout(() => {
      open.value = true
    }, props.delay)
  } else {
    open.value = false
  }
}

onBeforeUnmount(() => {
  clearTimeout(timer)
})

provide(tooltipKey, {
  open,
  setOpen,
})
</script>

<template>
  <div class="relative inline-flex">
    <slot />
  </div>
</template>
