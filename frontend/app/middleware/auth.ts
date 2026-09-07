import { useAuthStore } from '~/features/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  auth.initialize()

  if (to.path === '/login') {
    if (auth.isAuthenticated.value) {
      return navigateTo('/')
    }

    return
  }

  if (!auth.isAuthenticated.value) {
    return navigateTo('/login')
  }
})
