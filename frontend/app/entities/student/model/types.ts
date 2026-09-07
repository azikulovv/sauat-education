export type StudentLocale = 'ru' | 'kk'
export type StudentRole = 'student' | 'admin'

export interface Student {
  id: string
  name: string
  avatar?: string
  email: string
  locale: StudentLocale
  role: StudentRole
}
