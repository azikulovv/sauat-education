<script setup lang="ts">
import { computed, inject } from 'vue'
import { tabsKey } from './context'

interface Props {
  value: string
}

const props = defineProps<Props>()

const tabs = inject(tabsKey)

if (!tabs) {
  throw new Error('TabsContent must be used inside Tabs')
}

const active = computed(() => tabs.value.value === props.value)
</script>

<template>
  <div v-if="active" role="tabpanel" class="pt-4">
    <slot />
  </div>
</template>
