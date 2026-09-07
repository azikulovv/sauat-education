<script setup lang="ts">
interface Props {
  title?: string
  content?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Конспект урока',
  content: '',
})
</script>

<template>
  <section aria-labelledby="lesson-notes-title">
    <h2 id="lesson-notes-title" class="text-h3 text-text-primary">{{ title }}</h2>

    <p v-if="content" class="mt-4 max-w-3xl text-reading leading-relaxed text-text-secondary">
      {{ content }}
    </p>

    <p v-else class="mt-4 text-sm text-text-tertiary">Конспект для этого урока пока не добавлен.</p>
  </section>
</template>
