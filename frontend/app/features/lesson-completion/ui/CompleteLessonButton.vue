<script setup lang="ts">
import { CheckCircle2, CircleCheck } from 'lucide-vue-next'
import { BaseButton } from '~/shared/ui'
import { useLessonCompletion } from '../model/useLessonCompletion'

interface Props {
  lessonId: string
  initialCompleted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialCompleted: false,
})

const emit = defineEmits<{
  completed: []
}>()

const completion = useLessonCompletion(() => props.lessonId, props.initialCompleted)

const completeLesson = async () => {
  await completion.complete()

  if (completion.completed.value) {
    emit('completed')
  }
}
</script>

<template>
  <div>
    <BaseButton
      :disabled="completion.completed.value"
      :loading="completion.loading.value"
      :leading-icon="completion.completed.value ? CheckCircle2 : CircleCheck"
      @click="completeLesson"
    >
      {{
        completion.loading.value
          ? 'Сохранение...'
          : completion.completed.value
            ? 'Урок завершён'
            : 'Завершить урок'
      }}
    </BaseButton>

    <p v-if="completion.error.value" class="mt-2 text-xs text-error" role="alert">
      {{ completion.error.value }}
    </p>
  </div>
</template>
