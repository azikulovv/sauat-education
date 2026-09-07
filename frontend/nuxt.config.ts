import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint'],
  runtimeConfig: {
    backendInternalUrl:
      process.env.NUXT_BACKEND_INTERNAL_URL || process.env.BACKEND_INTERNAL_URL || 'http://localhost:3001',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
