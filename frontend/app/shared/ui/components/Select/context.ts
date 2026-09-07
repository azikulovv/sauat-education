import type { InjectionKey, Ref } from 'vue'

export interface SelectContext {
  value: Ref<string | undefined>
  open: Ref<boolean>

  setValue: (value: string) => void
  setOpen: (value: boolean) => void
}

export const selectKey: InjectionKey<SelectContext> = Symbol('select')
