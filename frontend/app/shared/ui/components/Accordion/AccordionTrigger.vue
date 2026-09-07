<script setup lang="ts">
import { inject } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { accordionKey } from './context'

const accordion = inject(accordionKey)
const item = inject<{
  value: string
  id: string
}>('accordion-item')

if (!accordion || !item) {
  throw new Error('AccordionTrigger must be used inside AccordionItem')
}
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-text-primary"
    :aria-expanded="accordion.isOpen(item.value)"
    @click="accordion.toggle(item.value)"
  >
    <slot />

    <ChevronDown
      class="size-4 text-text-secondary transition-transform"
      :class="{
        'rotate-180': accordion.isOpen(item.value),
      }"
    />
  </button>
</template>
