export interface DialogContext {
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  close: () => void
}

export const dialogKey: InjectionKey<DialogContext> = Symbol('dialog')
