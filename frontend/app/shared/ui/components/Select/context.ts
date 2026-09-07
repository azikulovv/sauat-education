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
  triggerElement: Ref<HTMLElement | null>
  setValue: (value: string) => void
  setOpen: (value: boolean) => void
  toggle: () => void
  close: () => void
  setTriggerElement: (element: HTMLElement | null) => void
  registerItem: (item: SelectItemData) => void
  unregisterItem: (value: string) => void
  highlight: (value?: string, focus?: boolean) => void
  highlightFirst: () => void
  highlightLast: () => void
  moveHighlight: (direction: 1 | -1) => void
  getEnabledItems: () => SelectItemData[]
  getSelectedItem: () => SelectItemData | undefined
  select: (value: string) => void
  getItemByValue: (value: string) => SelectItemData | undefined
}

export const selectKey: InjectionKey<SelectContext> = Symbol('select')
