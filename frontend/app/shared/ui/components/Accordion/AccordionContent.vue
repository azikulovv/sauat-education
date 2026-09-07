<script setup lang="ts">
import { computed, inject } from 'vue'
import { accordionKey } from './context'

const accordion = inject(accordionKey)
const item = inject<{
  value: string
  id: string
}>('accordion-item')

if (!accordion || !item) {
  throw new Error('AccordionContent must be used inside AccordionItem')
}

const open = computed(() => accordion.isOpen(item.value))
</script>

<template>
  <div v-if="open" class="pb-4 text-sm leading-6 text-text-secondary">
    <slot />
  </div>
</template>
