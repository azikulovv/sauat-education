export interface DialogContext {
  open: Ref<boolean>

  contentId: string
  titleId: string
  descriptionId: string

  setOpen: (value: boolean) => void
  close: () => void
}

export const dialogKey: InjectionKey<DialogContext> = Symbol('dialog')
