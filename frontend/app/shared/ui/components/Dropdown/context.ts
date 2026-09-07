import type { InjectionKey, Ref } from 'vue'

export interface DropdownItemData {
  value: string
  id: string
  disabled: boolean
  element: HTMLElement | null
}

export interface DropdownContext {
  open: Ref<boolean>
  highlightedValue: Ref<string | undefined>
  items: Ref<DropdownItemData[]>

  triggerId: string
  contentId: string

  triggerElement: Ref<HTMLElement | null>
  setTriggerElement: (element: HTMLElement | null) => void

  setOpen: (value: boolean) => void
  toggle: () => void
  close: () => void

  registerItem: (item: DropdownItemData) => void
  unregisterItem: (value: string) => void

  highlight: (value?: string) => void
  moveHighlight: (direction: 1 | -1) => void
}

export const dropdownKey: InjectionKey<DropdownContext> = Symbol('dropdown')
