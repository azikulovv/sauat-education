import type { Student } from '~/entities/student'
import { apiFetch } from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: Student
  accessToken: string
}

export function loginStudent(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: credentials })
}
