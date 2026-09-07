<script setup lang="ts">
import { inject } from 'vue'
import { dropdownKey } from './context'

interface Props {
  disabled?: boolean
  destructive?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  destructive: false,
})

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownItem must be used inside Dropdown')
}
</script>

<template>
  <button
    type="button"
    role="menuitem"
    :disabled="disabled"
    :class="[
      'flex w-full items-center px-3 py-2 text-left text-sm transition-colors',
      'disabled:pointer-events-none disabled:opacity-50',
      destructive ? 'text-error hover:bg-error/5' : 'text-text-primary hover:bg-bg-muted',
    ]"
    @click="dropdown.close()"
  >
    <slot />
  </button>
</template>
