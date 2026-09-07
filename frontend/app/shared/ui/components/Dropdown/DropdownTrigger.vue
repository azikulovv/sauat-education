<script setup lang="ts">
import { inject } from 'vue'
import { dropdownKey } from './context'

const dropdown = inject(dropdownKey)

if (!dropdown) {
  throw new Error('DropdownTrigger must be used inside Dropdown')
}
</script>

<template>
  <button
    type="button"
    :aria-expanded="dropdown.open.value"
    aria-haspopup="menu"
    @click="dropdown.setOpen(!dropdown.open.value)"
  >
    <slot />
  </button>
</template>
