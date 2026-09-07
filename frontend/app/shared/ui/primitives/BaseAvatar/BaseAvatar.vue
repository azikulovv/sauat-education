<script setup lang="ts">
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

interface Props {
  src?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
  status?: AvatarStatus
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fallback: '?',
  size: 'md',
})

const hasImage = ref(Boolean(props.src))

watch(
  () => props.src,
  (value) => {
    hasImage.value = Boolean(value)
  },
)

const initials = computed(() => {
  if (!props.fallback) {
    return '?'
  }

  return props.fallback
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
})
</script>

<template>
  <div
    class="relative inline-flex shrink-0"
    :class="{
      'size-6': size === 'xs',
      'size-8': size === 'sm',
      'size-10': size === 'md',
      'size-12': size === 'lg',
      'size-16': size === 'xl',
    }"
  >
    <img
      v-if="src && hasImage"
      :src="src"
      :alt="alt"
      class="size-full rounded-full object-cover"
      @error="hasImage = false"
    />

    <span
      v-else
      class="flex size-full items-center justify-center rounded-full bg-(--color-primary-subtle) text-primary font-semibold"
      :class="{
        'text-[9px]': size === 'xs',
        'text-[10px]': size === 'sm',
        'text-xs': size === 'md',
        'text-sm': size === 'lg',
        'text-lg': size === 'xl',
      }"
      aria-hidden="true"
    >
      {{ initials }}
    </span>

    <span
      v-if="status"
      class="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-surface"
      :class="{
        'bg-success': status === 'online',
        'bg-text-tertiary': status === 'offline',
        'bg-error': status === 'busy',
        'bg-warning': status === 'away',
      }"
    />
  </div>
</template>
