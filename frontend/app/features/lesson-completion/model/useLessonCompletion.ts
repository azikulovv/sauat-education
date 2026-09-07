import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { completeLesson } from '~/shared/api/lessons'

export function useLessonCompletion(lessonId: MaybeRefOrGetter<string>, initialCompleted = false) {
  const loading = ref(false)
  const completed = ref(initialCompleted)
  const error = ref<string | null>(null)

  const canComplete = computed(
    () => Boolean(toValue(lessonId)) && !completed.value && !loading.value,
  )

  const complete = async () => {
    if (!canComplete.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      await completeLesson(toValue(lessonId))
      completed.value = true
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Не удалось сохранить прогресс.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    completed,
    error,
    complete,
  }
}
