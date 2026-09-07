import type { InjectionKey, Ref } from 'vue'

export interface DropdownContext {
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  close: () => void
}

export const dropdownKey: InjectionKey<DropdownContext> = Symbol('dropdown')
