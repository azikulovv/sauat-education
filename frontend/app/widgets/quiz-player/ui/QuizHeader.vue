<script setup lang="ts">
interface Props {
  title: string
  description: string
  questionCount: number
  passingScore: number
}

defineProps<Props>()
</script>

<template>
  <header>
    <p class="text-overline text-primary">Проверка знаний</p>
    <h1 class="mt-2 text-h1 text-text-primary">{{ title }}</h1>
    <p class="mt-2 max-w-2xl text-body-sm leading-6 text-text-secondary">{{ description }}</p>

    <div class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-secondary">
      <span>{{ questionCount }} {{ questionCount === 1 ? 'вопрос' : 'вопроса' }}</span>
      <span>Для прохождения нужно {{ passingScore }}%</span>
    </div>
  </header>
</template>
