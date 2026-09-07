export type AccordionType = 'single' | 'multiple'

export interface AccordionContext {
  type: AccordionType
  collapsible: boolean

  openItems: Ref<string[]>

  toggle: (value: string) => void
  isOpen: (value: string) => boolean
}

export const accordionKey: InjectionKey<AccordionContext> = Symbol('accordion')
