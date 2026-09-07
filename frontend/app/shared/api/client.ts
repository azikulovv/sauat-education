export interface ApiError {
  error?: string
  message?: string
}

export async function apiFetch<T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) {
  const config = useRuntimeConfig()
  const auth = useCookie<{ accessToken?: string } | null>('sauat-auth')
  const headers = new Headers(options.headers as HeadersInit | undefined)

  if (auth.value?.accessToken) {
    headers.set('Authorization', `Bearer ${auth.value.accessToken}`)
  }

  try {
    return await $fetch<T>(`${config.public.apiBase}${path}`, { ...options, headers })
  } catch (error: any) {
    throw new Error(error?.data?.message || error?.message || 'Не удалось связаться с сервером.')
  }
}
