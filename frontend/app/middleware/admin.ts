import { useAuthStore } from '~/features/auth'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.initialize()

  if (!auth.isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (auth.user.value?.role !== 'admin') {
    return navigateTo('/')
  }
})
