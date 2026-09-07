<script lang="ts" setup>
definePageMeta({
  middleware: 'auth',
})

await navigateTo('/')
</script>

<template>
  <div aria-hidden="true" />
</template>
