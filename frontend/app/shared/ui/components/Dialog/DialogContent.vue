<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { dialogKey } from './context'

interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  showClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'md',
  closeOnOverlay: true,
  closeOnEscape: true,
  showClose: true,
})

const dialog = inject(dialogKey)

if (!dialog) {
  throw new Error('DialogContent must be used inside Dialog')
}

function handleEscape(event: KeyboardEvent) {
  if (props.closeOnEscape && event.key === 'Escape') {
    dialog?.close()
  }
}

function handleOverlay(event: MouseEvent) {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    dialog?.close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="dialog.open.value"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      @mousedown="handleOverlay"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      <section
        :class="[
          'relative z-10 w-full rounded-xl border border-border bg-surface shadow-xl',
          {
            'max-w-sm': maxWidth === 'sm',
            'max-w-md': maxWidth === 'md',
            'max-w-lg': maxWidth === 'lg',
            'max-w-xl': maxWidth === 'xl',
          },
        ]"
        role="dialog"
        aria-modal="true"
      >
        <button
          v-if="showClose"
          type="button"
          class="absolute right-4 top-4 rounded-md p-1.5 text-text-secondary transition-colors hover:bg-bg-muted hover:text-text-primary"
          aria-label="Закрыть"
          @click="dialog.close()"
        >
          <X class="size-4" />
        </button>

        <slot />
      </section>
    </div>
  </Teleport>
</template>
