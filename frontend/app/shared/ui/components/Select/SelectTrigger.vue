<script setup lang="ts">
import { inject } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { selectKey } from './context'

const select = inject(selectKey)

if (!select) {
  throw new Error('SelectTrigger must be used inside Select')
}
</script>

<template>
  <button
    type="button"
    class="flex h-10 w-full items-center justify-between rounded-md border border-border bg-surface px-3 text-sm text-text-primary transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none"
    :aria-expanded="select.open.value"
    @click="select.setOpen(!select.open.value)"
  >
    <span class="truncate">
      <slot />
    </span>

    <ChevronDown
      class="size-4 shrink-0 text-text-tertiary transition-transform"
      :class="{
        'rotate-180': select.open.value,
      }"
    />
  </button>
</template>
