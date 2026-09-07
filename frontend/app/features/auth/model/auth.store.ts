import { computed } from 'vue'
import type { Student } from '~/entities/student'
import { loginStudent, type LoginCredentials } from '~/shared/api/auth'
import type { AuthStatus } from './types'

interface PersistedAuth {
  user: Student
  accessToken: string
}

const isPersistedAuth = (value: unknown): value is PersistedAuth => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.accessToken === 'string' &&
    Boolean(candidate.user) &&
    typeof candidate.user === 'object'
  )
}

export const useAuthStore = () => {
  const user = useState<Student | null>('auth:user', () => null)
  const accessToken = useState<string | null>('auth:access-token', () => null)
  const status = useState<AuthStatus>('auth:status', () => 'idle')
  const error = useState<string | null>('auth:error', () => null)
  const initialized = useState('auth:initialized', () => false)

  const isAuthenticated = computed(() => Boolean(user.value && accessToken.value))

  const initialize = () => {
    if (initialized.value) {
      return
    }

    if (import.meta.client) {
      const storedAuth = localStorage.getItem('sauat-auth')

      if (storedAuth) {
        try {
          const parsed: unknown = JSON.parse(storedAuth)

          if (isPersistedAuth(parsed)) {
            user.value = parsed.user
            accessToken.value = parsed.accessToken
          }
        } catch {
          localStorage.removeItem('sauat-auth')
        }
      }
    }

    initialized.value = true
  }

  const login = async (credentials: LoginCredentials) => {
    status.value = 'loading'
    error.value = null

    try {
      const result = await loginStudent(credentials)

      user.value = result.user
      accessToken.value = result.accessToken
      status.value = 'success'

      if (import.meta.client) {
        localStorage.setItem(
          'sauat-auth',
          JSON.stringify({ user: result.user, accessToken: result.accessToken }),
        )
      }
    } catch (cause) {
      status.value = 'error'
      error.value = cause instanceof Error ? cause.message : 'Не удалось войти в аккаунт.'
    }
  }

  const logout = () => {
    user.value = null
    accessToken.value = null
    status.value = 'idle'
    error.value = null

    if (import.meta.client) {
      localStorage.removeItem('sauat-auth')
    }
  }

  return {
    user,
    accessToken,
    status,
    error,
    initialized,
    isAuthenticated,
    initialize,
    login,
    logout,
  }
}
