<script setup lang="ts">
import { inject } from 'vue'
import { selectKey } from './context'

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectContent must be used inside Select')
}
</script>

<template>
  <div
    v-if="select.open.value"
    class="absolute left-0 top-full z-40 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-border bg-surface p-1 shadow-lg"
    role="listbox"
  >
    <slot />
  </div>
</template>
