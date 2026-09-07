<script setup lang="ts">
import { BaseAlert, BaseCard, BaseEmptyState, BaseGrid, BaseSkeleton } from '~/shared/ui'
import { LessonCard } from '~/entities/lesson'
import { SubjectProgress } from '~/entities/subject'
import type { Lesson } from '~/entities/lesson'
import type { Subject } from '~/entities/subject'

interface Props {
  subject: Subject
  lessons?: Lesson[]
  loading?: boolean
  error?: string | null
}

withDefaults(defineProps<Props>(), {
  lessons: () => [],
  loading: false,
  error: null,
})

defineEmits<{
  lessonClick: [lesson: Lesson]
}>()
</script>

<template>
  <div>
    <BaseCard>
      <p class="text-overline text-primary">Предмет</p>
      <h1 class="mt-2 text-h1 text-text-primary">{{ subject.title }}</h1>
      <p class="mt-2 max-w-2xl text-body-sm leading-6 text-text-secondary">
        {{ subject.description }}
      </p>
      <div class="mt-6 max-w-xl">
        <SubjectProgress :subject="subject" />
      </div>
    </BaseCard>

    <section class="mt-10" aria-labelledby="subject-lessons-title">
      <div class="mb-5">
        <h2 id="subject-lessons-title" class="text-h2 text-text-primary">Темы и уроки</h2>
        <p class="mt-1 text-sm text-text-secondary">
          {{ subject.completedTopics }} из {{ subject.totalTopics }} тем пройдено ·
          {{ subject.completedRequiredTopics }} из {{ subject.requiredTopics }} обязательных
        </p>
      </div>

      <BaseAlert v-if="error" variant="error" title="Не удалось загрузить уроки">
        {{ error }}
      </BaseAlert>

      <BaseGrid v-else-if="loading" :cols="2" gap="md">
        <BaseSkeleton v-for="item in 2" :key="item" variant="rect" width="100%" height="220px" />
      </BaseGrid>

      <BaseEmptyState
        v-else-if="lessons.length === 0"
        title="Уроков пока нет"
        description="Материалы для этого предмета появятся здесь."
      />

      <BaseGrid v-else :cols="2" gap="md">
        <LessonCard
          v-for="lesson in lessons"
          :key="lesson.id"
          :lesson="lesson"
          @click="$emit('lessonClick', lesson)"
        />
      </BaseGrid>
    </section>
  </div>
</template>
