<script setup lang="ts">
import { PlayCircle } from 'lucide-vue-next'
import { BaseCard } from '~/shared/ui'

interface Props {
  videoUrl?: string
  title: string
  poster?: string
}

const props = defineProps<Props>()
const videoElement = ref<HTMLVideoElement | null>(null)

const seekTo = (seconds: number) => {
  if (!videoElement.value) {
    return
  }

  videoElement.value.currentTime = seconds
  void videoElement.value.play()
}

defineExpose({ seekTo })
</script>

<template>
  <video
    v-if="props.videoUrl"
    ref="videoElement"
    class="aspect-video w-full rounded-lg bg-black object-cover"
    controls
    playsinline
    preload="metadata"
    :src="props.videoUrl"
    :poster="props.poster"
    :aria-label="title"
  >
    Ваш браузер не поддерживает воспроизведение видео.
  </video>

  <BaseCard
    v-else
    class="flex aspect-video flex-col items-center justify-center bg-bg-subtle text-center"
  >
    <PlayCircle class="size-10 text-text-tertiary" aria-hidden="true" />
    <p class="mt-3 text-sm font-semibold text-text-primary">Видео урока скоро появится</p>
    <p class="mt-1 max-w-xs text-xs leading-5 text-text-secondary">
      Пока изучите конспект и отметьте урок после просмотра материала.
    </p>
  </BaseCard>
</template>
