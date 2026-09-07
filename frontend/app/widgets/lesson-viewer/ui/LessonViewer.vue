<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { BaseButton, BaseCard } from '~/shared/ui'
import { CompleteLessonButton } from '~/features/lesson-completion'
import { LessonDuration, LessonStatus } from '~/entities/lesson'
import type { Lesson } from '~/entities/lesson'
import LessonNotes from './LessonNotes.vue'
import LessonTimecodes from './LessonTimecodes.vue'
import LessonVideo from './LessonVideo.vue'

interface Props {
  lesson: Lesson
  quizId?: string
}

defineProps<Props>()

const emit = defineEmits<{
  quiz: [quizId: string]
  completed: []
}>()

const video = ref<InstanceType<typeof LessonVideo> | null>(null)

const handleTimecodeSelect = (seconds: number) => {
  video.value?.seekTo(seconds)
}
</script>

<template>
  <article>
    <header class="border-b border-border pb-6">
      <div class="flex flex-wrap items-center gap-2">
        <LessonStatus :lesson="lesson" />
        <LessonDuration :minutes="lesson.duration" />
      </div>

      <h1 class="mt-4 text-h1 text-text-primary">{{ lesson.title }}</h1>
      <p class="mt-2 max-w-3xl text-body-sm leading-6 text-text-secondary">
        {{ lesson.description }}
      </p>
    </header>

    <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div class="min-w-0 space-y-8">
        <LessonVideo ref="video" :video-url="lesson.videoUrl" :title="lesson.title" />
        <LessonNotes :content="lesson.notes" />
      </div>

      <aside class="space-y-6 lg:border-l lg:border-border-subtle lg:pl-6">
        <LessonTimecodes :timecodes="lesson.timecodes" @select="handleTimecodeSelect" />

        <BaseCard v-if="quizId" class="bg-bg-subtle">
          <p class="text-sm font-semibold text-text-primary">Закрепите материал</p>
          <p class="mt-1 text-xs leading-5 text-text-secondary">
            Пройдите короткий тест после урока.
          </p>
          <BaseButton
            class="mt-4 w-full"
            size="sm"
            :trailing-icon="ArrowRight"
            @click="emit('quiz', quizId)"
          >
            Пройти тест
          </BaseButton>
        </BaseCard>
      </aside>
    </div>

    <div
      class="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm text-text-secondary">Завершите урок, когда будете готовы перейти дальше.</p>
      <CompleteLessonButton
        :lesson-id="lesson.id"
        :initial-completed="lesson.completed"
        @completed="emit('completed')"
      />
    </div>
  </article>
</template>
