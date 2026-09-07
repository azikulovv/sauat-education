<script setup lang="ts">
import { Play } from 'lucide-vue-next'
import { BaseButton, BaseCard } from '~/shared/ui'
import { LessonDuration, LessonStatus } from '~/entities/lesson'
import type { Lesson } from '~/entities/lesson'

interface Props {
  lesson: Lesson
}

defineProps<Props>()

defineEmits<{
  continue: []
}>()
</script>

<template>
  <section aria-labelledby="continue-learning-title">
    <div class="mb-4">
      <p class="text-overline text-text-tertiary">Следующий шаг</p>
      <h2 id="continue-learning-title" class="mt-1 text-h2 text-text-primary">
        Продолжить обучение
      </h2>
    </div>

    <BaseCard class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex min-w-0 items-start gap-4">
        <span
          class="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-white"
        >
          <Play class="size-5 fill-current" aria-hidden="true" />
        </span>

        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-base font-semibold text-text-primary">{{ lesson.title }}</h3>
            <LessonStatus :lesson="lesson" />
          </div>
          <p class="mt-1 line-clamp-2 text-sm leading-5 text-text-secondary">
            {{ lesson.description }}
          </p>
          <LessonDuration class="mt-3" :minutes="lesson.duration" />
        </div>
      </div>

      <BaseButton class="shrink-0" :leading-icon="Play" @click="$emit('continue')">
        Продолжить
      </BaseButton>
    </BaseCard>
  </section>
</template>
