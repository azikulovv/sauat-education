<script lang="ts" setup>
import { BookOpen, ShieldCheck } from 'lucide-vue-next'
import { BaseCard, BaseContainer } from '~/shared/ui'
import { LanguageSwitcher } from '~/features/language-switching'
import { LoginForm } from '~/features/auth'
import { useAuthStore } from '~/features/auth'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Вход | Sauat Education',
  meta: [{ name: 'description', content: 'Войдите в Sauat Education и продолжите обучение.' }],
})

const auth = useAuthStore()
const handleLogin = () => navigateTo(auth.user.value?.role === 'admin' ? '/admin' : '/')
</script>

<template>
  <main class="min-h-screen bg-bg">
    <BaseContainer size="md">
      <div class="flex min-h-screen flex-col py-6 sm:py-8">
        <header class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="flex size-8 items-center justify-center rounded-md bg-primary text-white">
              <BookOpen class="size-4" aria-hidden="true" />
            </span>
            <span class="text-sm font-bold tracking-tight text-text-primary">Sauat Education</span>
          </div>

          <LanguageSwitcher />
        </header>

        <div class="flex flex-1 items-center justify-center py-12">
          <div class="w-full max-w-md">
            <div class="mb-6 text-center">
              <div
                class="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary-subtle text-primary"
              >
                <ShieldCheck class="size-6" aria-hidden="true" />
              </div>
              <h1 class="mt-5 text-h1 text-text-primary">С возвращением</h1>
              <p class="mt-2 text-body-sm text-text-secondary">
                Войдите, чтобы продолжить обучение.
              </p>
            </div>

            <BaseCard padding="lg">
              <LoginForm @success="handleLogin" />
            </BaseCard>

            <p class="mt-5 text-center text-xs text-text-tertiary">
              Демо-ученик: aliya.sadykova@example.com / Demo1234! · Администратор: admin@sauat-education.kz / Admin1234!
            </p>
          </div>
        </div>
      </div>
    </BaseContainer>
  </main>
</template>
