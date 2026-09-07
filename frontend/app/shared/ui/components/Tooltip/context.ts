import type { InjectionKey, Ref } from 'vue'

export interface TooltipContext {
  open: Ref<boolean>
  setOpen: (value: boolean) => void
}

export const tooltipKey: InjectionKey<TooltipContext> = Symbol('tooltip')
