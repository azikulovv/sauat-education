<script setup lang="ts">
type ProgressVariant = 'primary' | 'success' | 'warning' | 'error'

type ProgressSize = 'sm' | 'md' | 'lg'

interface Props {
  value?: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  showValue?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  variant: 'primary',
  size: 'sm',
  showValue: false,
})

const normalizedValue = computed(() => {
  if (props.max <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})

const valueLabel = computed(() => `${Math.round(normalizedValue.value)}%`)
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="mb-2 flex items-center justify-between gap-3">
      <span v-if="label" class="text-xs font-medium text-text-secondary">
        {{ label }}
      </span>

      <span v-if="showValue" class="text-xs font-semibold text-text-primary">
        {{ valueLabel }}
      </span>
    </div>

    <div
      class="w-full overflow-hidden rounded-full bg-bg-muted"
      :class="{
        'h-1': size === 'sm',
        'h-1.5': size === 'md',
        'h-2': size === 'lg',
      }"
      role="progressbar"
      :aria-valuenow="value"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-label="label"
    >
      <div
        class="h-full rounded-full transition-[width] duration-300 ease-out"
        :class="{
          'bg-primary': variant === 'primary',
          'bg-success': variant === 'success',
          'bg-warning': variant === 'warning',
          'bg-error': variant === 'error',
        }"
        :style="{
          width: `${normalizedValue}%`,
        }"
      />
    </div>
  </div>
</template>
