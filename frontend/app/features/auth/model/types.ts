import type { Student } from '~/entities/student'

export type AuthStatus = 'idle' | 'loading' | 'error' | 'success'

export interface AuthState {
  user: Student | null
  accessToken: string | null
  status: AuthStatus
  error: string | null
  initialized: boolean
}
