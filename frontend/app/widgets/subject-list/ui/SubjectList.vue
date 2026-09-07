<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'
import { BaseAlert, BaseEmptyState, BaseGrid, BaseSkeleton } from '~/shared/ui'
import { SubjectCard } from '~/entities/subject'
import type { Subject } from '~/entities/subject'

interface Props {
  subjects?: Subject[]
  loading?: boolean
  error?: string | null
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  subjects: () => [],
  loading: false,
  error: null,
  title: 'Все предметы',
  description: 'Выберите предмет, чтобы продолжить обучение.',
})

defineEmits<{
  subjectClick: [subject: Subject]
}>()
</script>

<template>
  <section aria-labelledby="subject-list-title">
    <div class="mb-6">
      <p class="text-overline text-primary">Каталог обучения</p>
      <h1 id="subject-list-title" class="mt-2 text-h1 text-text-primary">{{ title }}</h1>
      <p class="mt-2 text-body-sm text-text-secondary">{{ description }}</p>
    </div>

    <BaseAlert v-if="error" variant="error" title="Не удалось загрузить предметы">
      {{ error }}
    </BaseAlert>

    <BaseGrid v-else-if="loading" :cols="3" gap="md" aria-label="Загрузка предметов">
      <div v-for="item in 3" :key="item" class="rounded-lg border border-border bg-surface p-4">
        <BaseSkeleton variant="rect" width="40px" height="40px" />
        <BaseSkeleton class="mt-5" variant="text" width="55%" />
        <BaseSkeleton class="mt-2" variant="text" width="90%" />
        <BaseSkeleton class="mt-6" variant="rect" width="100%" height="8px" />
      </div>
    </BaseGrid>

    <BaseEmptyState
      v-else-if="subjects.length === 0"
      :icon="BookOpen"
      title="Предметов пока нет"
      description="Когда появятся новые предметы, они будут отображаться здесь."
    />

    <BaseGrid v-else :cols="3" gap="md">
      <SubjectCard
        v-for="subject in subjects"
        :key="subject.id"
        :subject="subject"
        @click="$emit('subjectClick', subject)"
      />
    </BaseGrid>
  </section>
</template>
