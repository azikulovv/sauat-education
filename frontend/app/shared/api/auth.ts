import type { Student } from '~/entities/student'
import { currentStudent } from '~/entities/student'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: Student
  accessToken: string
}

export async function loginStudent(credentials: LoginCredentials): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 450))

  if (!credentials.email || !credentials.password) {
    throw new Error('Введите email и пароль.')
  }

  if (credentials.password.length < 6) {
    throw new Error('Пароль должен содержать минимум 6 символов.')
  }

  return {
    user: {
      ...currentStudent,
      email: credentials.email,
    },
    accessToken: `mock-token-${currentStudent.id}`,
  }
}
