import type { PopoverAlign, PopoverSide } from '../context'

interface Options {
  triggerElement: Ref<HTMLElement | null>
  contentElement: Ref<HTMLElement | null>

  open: Ref<boolean>

  side: PopoverSide
  align: PopoverAlign
  offset: number
}

export function usePopoverPosition(options: Options) {
  const style = ref<Record<string, string>>({})

  function updatePosition() {
    const trigger = options.triggerElement.value

    const content = options.contentElement.value

    if (!trigger || !content) {
      return
    }

    const triggerRect = trigger.getBoundingClientRect()

    const contentRect = content.getBoundingClientRect()

    const viewportWidth = window.innerWidth

    const viewportHeight = window.innerHeight

    let top = 0
    let left = 0

    switch (options.side) {
      case 'top':
        top = triggerRect.top - contentRect.height - options.offset

        break

      case 'bottom':
        top = triggerRect.bottom + options.offset

        break

      case 'left':
        left = triggerRect.left - contentRect.width - options.offset

        break

      case 'right':
        left = triggerRect.right + options.offset

        break
    }

    if (options.side === 'top' || options.side === 'bottom') {
      switch (options.align) {
        case 'start':
          left = triggerRect.left
          break

        case 'center':
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
          break

        case 'end':
          left = triggerRect.right - contentRect.width
          break
      }
    }

    if (options.side === 'left' || options.side === 'right') {
      switch (options.align) {
        case 'start':
          top = triggerRect.top
          break

        case 'center':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
          break

        case 'end':
          top = triggerRect.bottom - contentRect.height
          break
      }
    }

    const padding = 8

    left = Math.max(padding, Math.min(left, viewportWidth - contentRect.width - padding))

    top = Math.max(padding, Math.min(top, viewportHeight - contentRect.height - padding))

    style.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
    }
  }

  async function update() {
    await nextTick()

    requestAnimationFrame(updatePosition)
  }

  function handleScroll() {
    updatePosition()
  }

  function handleResize() {
    updatePosition()
  }

  watch(options.open, (value) => {
    if (value) {
      update()
    }
  })

  onMounted(() => {
    window.addEventListener('resize', handleResize)

    window.addEventListener('scroll', handleScroll, true)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)

    window.removeEventListener('scroll', handleScroll, true)
  })

  return {
    style,
    update,
  }
}
