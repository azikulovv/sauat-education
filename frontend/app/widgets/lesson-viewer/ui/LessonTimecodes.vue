<script setup lang="ts">
import type { LessonTimecode } from '~/entities/lesson'

interface Props {
  timecodes: LessonTimecode[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [seconds: number]
}>()

const toSeconds = (time: string) => {
  const parts = time.split(':').map(Number)

  if (parts.length === 2) {
    return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
  }

  return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0)
}

const selectTimecode = (time: string) => {
  emit('select', toSeconds(time))
}
</script>

<template>
  <section v-if="timecodes.length" aria-labelledby="lesson-timecodes-title">
    <h2 id="lesson-timecodes-title" class="text-h3 text-text-primary">Содержание урока</h2>

    <ol class="mt-4 space-y-1">
      <li v-for="timecode in timecodes" :key="timecode.id">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring-color)"
          @click="selectTimecode(timecode.time)"
        >
          <span class="w-12 shrink-0 font-mono text-xs text-primary">{{ timecode.time }}</span>
          <span class="text-text-secondary">{{ timecode.label }}</span>
        </button>
      </li>
    </ol>
  </section>
</template>
