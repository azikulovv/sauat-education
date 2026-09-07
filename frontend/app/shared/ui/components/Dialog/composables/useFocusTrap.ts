import { onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'details',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useFocusTrap(enabled: Ref<boolean>, container: Ref<HTMLElement | null>) {
  let previouslyFocused: HTMLElement | null = null

  function getFocusableElements() {
    if (!container.value) {
      return []
    }

    return Array.from(container.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => !element.hasAttribute('aria-hidden'),
    )
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!enabled.value) {
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const elements = getFocusableElements()

    if (!elements.length) {
      event.preventDefault()
      return
    }

    const first = elements[0]
    const last = elements[elements.length - 1]

    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last!.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first!.focus()
    }
  }

  function activate() {
    if (typeof document === 'undefined') {
      return
    }

    previouslyFocused = document.activeElement as HTMLElement

    document.addEventListener('keydown', handleKeydown)

    requestAnimationFrame(() => {
      const elements = getFocusableElements()

      elements[0]?.focus()
    })
  }

  function deactivate() {
    document.removeEventListener('keydown', handleKeydown)

    requestAnimationFrame(() => {
      previouslyFocused?.focus()
      previouslyFocused = null
    })
  }

  watch(enabled, (value) => {
    if (value) {
      activate()
    } else {
      deactivate()
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
