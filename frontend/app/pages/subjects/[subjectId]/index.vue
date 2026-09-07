<script lang="ts" setup>
import { BookOpen, ChevronLeft } from 'lucide-vue-next'
import {
  BaseAlert,
  BaseButton,
  BaseCard,
  BaseContainer,
  BaseEmptyState,
  BaseSkeleton,
} from '~/shared/ui'
import { LessonCard } from '~/entities/lesson'
import { SubjectProgress } from '~/entities/subject'
import { getLessons } from '~/shared/api/lessons'
import { getSubject } from '~/shared/api/subjects'

definePageMeta({
  layout: 'student',
})

const route = useRoute()
const subjectId = String(route.params.subjectId)

const [
  { data: subject, pending: subjectPending, error: subjectError },
  { data: lessons, pending: lessonsPending, error: lessonsError },
] = await Promise.all([
  useAsyncData(`subject-${subjectId}`, () => getSubject(subjectId)),
  useAsyncData(`subject-${subjectId}-lessons`, () => getLessons(subjectId)),
])

const goBack = () => navigateTo('/subjects')
const openLesson = (lessonId: string) => navigateTo(`/subjects/${subjectId}/lessons/${lessonId}`)
</script>

<template>
  <main>
    <BaseContainer>
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <BaseButton variant="ghost" size="sm" :leading-icon="ChevronLeft" @click="goBack">
          Все предметы
        </BaseButton>

        <BaseSkeleton
          v-if="subjectPending"
          class="mt-6"
          variant="rect"
          width="100%"
          height="180px"
        />

        <BaseAlert
          v-else-if="subjectError"
          class="mt-6"
          variant="error"
          title="Не удалось загрузить предмет"
        >
          {{ subjectError.message }}
        </BaseAlert>

        <BaseEmptyState
          v-else-if="!subject"
          class="mt-6"
          :icon="BookOpen"
          title="Предмет не найден"
          description="Проверьте ссылку или вернитесь к списку предметов."
        />

        <template v-else>
          <BaseCard class="mt-6">
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
                {{ subject.completedTopics }} из {{ subject.totalTopics }} тем пройдено
              </p>
            </div>

            <BaseAlert v-if="lessonsError" variant="error" title="Не удалось загрузить уроки">
              {{ lessonsError.message }}
            </BaseAlert>

            <div v-else-if="lessonsPending" class="grid gap-4 lg:grid-cols-2">
              <BaseSkeleton
                v-for="item in 2"
                :key="item"
                variant="rect"
                width="100%"
                height="220px"
              />
            </div>

            <BaseEmptyState
              v-else-if="!lessons?.length"
              title="Уроков пока нет"
              description="Материалы для этого предмета появятся здесь."
            />

            <div v-else class="grid gap-4 lg:grid-cols-2">
              <LessonCard
                v-for="lesson in lessons"
                :key="lesson.id"
                :lesson="lesson"
                @click="openLesson(lesson.id)"
              />
            </div>
          </section>
        </template>
      </div>
    </BaseContainer>
  </main>
</template>
