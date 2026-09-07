import type { InjectionKey, Ref } from 'vue'

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left'

export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverContext {
  open: Ref<boolean>

  triggerId: string
  contentId: string

  triggerElement: Ref<HTMLElement | null>
  contentElement: Ref<HTMLElement | null>

  setOpen: (value: boolean) => void
  toggle: () => void
  close: () => void

  setTriggerElement: (element: HTMLElement | null) => void

  setContentElement: (element: HTMLElement | null) => void
}

export const popoverKey: InjectionKey<PopoverContext> = Symbol('popover')
