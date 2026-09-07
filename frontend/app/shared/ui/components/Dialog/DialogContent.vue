<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { dialogKey } from './context'
import { useFocusTrap } from './composables/useFocusTrap'
import { useScrollLock } from './composables/useScrollLock'

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

const content = ref<HTMLElement | null>(null)

useFocusTrap(dialog.open, content)

useScrollLock(dialog.open)

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape && dialog?.open.value) {
    event.preventDefault()

    dialog.close()
  }
}

function handleOverlay(event: MouseEvent) {
  if (!props.closeOnOverlay) {
    return
  }

  if (event.target === event.currentTarget) {
    dialog!.close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="dialog.open.value"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
        role="presentation"
        @mousedown="handleOverlay"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <Transition
          appear
          enter-active-class="transition duration-150"
          enter-from-class="scale-[0.98] opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-100"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-[0.98] opacity-0"
        >
          <section
            v-if="dialog.open.value"
            :id="dialog.contentId"
            ref="content"
            :class="[
              `
                relative z-10
                my-auto w-full
                overflow-hidden
                rounded-xl
                border border-border
                bg-surface
                shadow-xl
                outline-none
              `,
              {
                'max-w-sm': maxWidth === 'sm',

                'max-w-md': maxWidth === 'md',

                'max-w-lg': maxWidth === 'lg',

                'max-w-xl': maxWidth === 'xl',
              },
            ]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="dialog.titleId"
            :aria-describedby="dialog.descriptionId"
            tabindex="-1"
          >
            <button
              v-if="showClose"
              type="button"
              class="absolute right-4 top-4 z-10 rounded-md p-1.5 text-text-secondary transition-colors hover:bg-bg-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Закрыть"
              @click="dialog.close()"
            >
              <X class="size-4" />
            </button>

            <slot />
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
