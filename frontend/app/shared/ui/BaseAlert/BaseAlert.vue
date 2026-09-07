<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-vue-next'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface Props {
  variant?: AlertVariant
  title?: string
  closable?: boolean
  icon?: Component
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
  closable: false,
})

const emit = defineEmits<{
  close: []
}>()

const variantConfig = {
  info: {
    icon: Info,
    classes: 'border-info/20 bg-info/5 text-info',
  },
  success: {
    icon: CheckCircle2,
    classes: 'border-success/20 bg-success/5 text-success',
  },
  warning: {
    icon: TriangleAlert,
    classes: 'border-warning/20 bg-warning/5 text-warning',
  },
  error: {
    icon: AlertCircle,
    classes: 'border-error/20 bg-error/5 text-error',
  },
}
</script>

<template>
  <div :class="['flex gap-3 rounded-lg border p-4', variantConfig[variant].classes]" role="alert">
    <component
      :is="icon ?? variantConfig[variant].icon"
      class="mt-0.5 size-5 shrink-0"
      aria-hidden="true"
    />

    <div class="min-w-0 flex-1">
      <p v-if="title" class="text-sm font-semibold">
        {{ title }}
      </p>

      <div class="text-sm">
        <slot />
      </div>
    </div>

    <button
      v-if="closable"
      type="button"
      class="shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
      aria-label="Закрыть"
      @click="emit('close')"
    >
      <X class="size-4" />
    </button>
  </div>
</template>
