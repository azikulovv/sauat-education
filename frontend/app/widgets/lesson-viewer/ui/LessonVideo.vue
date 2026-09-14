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
const youtubeIframe = ref<HTMLIFrameElement | null>(null)

const youtubeVideoId = computed(() => {
  if (!props.videoUrl) {
    return null
  }

  try {
    const url = new URL(props.videoUrl)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    const isYouTubeHost = hostname === 'youtube.com' || hostname.endsWith('.youtube.com') || hostname === 'youtu.be'

    if (!isYouTubeHost) {
      return null
    }

    const pathParts = url.pathname.split('/').filter(Boolean)
    const videoId = hostname === 'youtu.be'
      ? pathParts[0]
      : url.searchParams.get('v') ?? (['embed', 'shorts', 'live'].includes(pathParts[0] ?? '') ? pathParts[1] : undefined)

    return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null
  } catch {
    return null
  }
})

const youtubeEmbedUrl = computed(() => {
  if (!youtubeVideoId.value) {
    return null
  }

  return `https://www.youtube.com/embed/${youtubeVideoId.value}?enablejsapi=1&rel=0`
})

const seekYouTubeTo = (seconds: number) => {
  youtubeIframe.value?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
    'https://www.youtube.com',
  )
}

const seekTo = (seconds: number) => {
  if (youtubeEmbedUrl.value) {
    seekYouTubeTo(seconds)
    return
  }

  if (!videoElement.value) {
    return
  }

  videoElement.value.currentTime = seconds
  void videoElement.value.play()
}

defineExpose({ seekTo })
</script>

<template>
  <iframe
    v-if="youtubeEmbedUrl"
    ref="youtubeIframe"
    class="aspect-video w-full rounded-lg bg-black"
    :src="youtubeEmbedUrl"
    :title="title"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    referrerpolicy="strict-origin-when-cross-origin"
  />

  <video
    v-else-if="props.videoUrl"
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
