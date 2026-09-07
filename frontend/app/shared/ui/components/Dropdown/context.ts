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

  setOpen: (value: boolean) => void
  toggle: () => void
  close: () => void
  setTriggerElement: (element: HTMLElement | null) => void
  registerItem: (item: DropdownItemData) => void
  unregisterItem: (value: string) => void
  highlight: (value?: string, focus?: boolean) => void
  moveHighlight: (direction: 1 | -1) => void
  highlightFirst: () => void
  highlightLast: () => void
  getEnabledItems: () => DropdownItemData[]
  select: (value: string) => void
}

export const dropdownKey: InjectionKey<DropdownContext> = Symbol('dropdown')
