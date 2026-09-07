import type { InjectionKey, Ref } from 'vue'

export interface SelectItemData {
  value: string
  label: string
  disabled: boolean
  id: string
  element: HTMLElement | null
}

export interface SelectContext {
  value: Ref<string | undefined>
  open: Ref<boolean>
  highlightedValue: Ref<string | undefined>

  disabled: Ref<boolean>

  items: Ref<SelectItemData[]>

  triggerId: string
  contentId: string

  setValue: (value: string) => void
  setOpen: (value: boolean) => void
  toggle: () => void

  registerItem: (item: SelectItemData) => void
  unregisterItem: (value: string) => void

  highlight: (value?: string) => void
  moveHighlight: (direction: 1 | -1) => void

  getSelectedItem: () => SelectItemData | undefined
}

export const selectKey: InjectionKey<SelectContext> = Symbol('select')
