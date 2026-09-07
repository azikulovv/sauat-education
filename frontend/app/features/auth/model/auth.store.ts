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
  const persistedAuth = useCookie<PersistedAuth | null>('sauat-auth', {
    default: () => null,
    sameSite: 'lax',
  })

  const isAuthenticated = computed(() => Boolean(user.value && accessToken.value))

  const initialize = () => {
    if (initialized.value) {
      return
    }

    if (isPersistedAuth(persistedAuth.value)) {
      user.value = persistedAuth.value.user
      accessToken.value = persistedAuth.value.accessToken
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

      persistedAuth.value = { user: result.user, accessToken: result.accessToken }
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

    persistedAuth.value = null
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
