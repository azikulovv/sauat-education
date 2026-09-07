import { onBeforeUnmount, watch, type Ref } from 'vue'

export function useScrollLock(enabled: Ref<boolean>) {
  let previousOverflow = ''
  let previousPaddingRight = ''

  function lock() {
    if (typeof document === 'undefined') {
      return
    }

    const body = document.body

    previousOverflow = body.style.overflow

    previousPaddingRight = body.style.paddingRight

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
  }

  function unlock() {
    if (typeof document === 'undefined') {
      return
    }

    const body = document.body

    body.style.overflow = previousOverflow

    body.style.paddingRight = previousPaddingRight
  }

  watch(
    enabled,
    (value) => {
      if (value) {
        lock()
      } else {
        unlock()
      }
    },
    {
      immediate: true,
    },
  )

  onBeforeUnmount(() => {
    unlock()
  })
}
