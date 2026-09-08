<script setup lang="ts">
import { BookOpen, Home, Library, LogOut, Settings } from 'lucide-vue-next'
import { computed } from 'vue'
import { BaseIconButton } from '~/shared/ui'
import { LanguageSwitcher } from '~/features/language-switching'
import { currentStudent, StudentAvatar } from '~/entities/student'
import { useAuthStore } from '~/features/auth'

type AppShellSection = 'dashboard' | 'subjects'

interface Props {
  active?: AppShellSection
}

withDefaults(defineProps<Props>(), {
  active: 'dashboard',
})

const auth = useAuthStore()
auth.initialize()

const user = computed(() => auth.user.value ?? currentStudent)
</script>

<template>
  <div class="min-h-screen bg-bg text-text-primary">
    <aside
      class="fixed inset-y-0 left-0 z-(--z-sidebar) hidden w-60 border-r border-border bg-surface lg:flex lg:flex-col"
    >
      <div class="flex h-16 items-center gap-3 border-b border-border px-6">
        <span class="flex size-8 items-center justify-center rounded-md bg-primary text-white">
          <BookOpen class="size-4" aria-hidden="true" />
        </span>
        <span class="text-sm font-bold tracking-tight text-text-primary">Sauat Education</span>
      </div>

      <nav class="flex-1 space-y-1 p-4" aria-label="Основная навигация">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors"
          :class="
            active === 'dashboard'
              ? 'bg-primary-subtle text-primary'
              : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
          "
        >
          <Home class="size-4" aria-hidden="true" />
          Главная
        </NuxtLink>
        <NuxtLink
          to="/subjects"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors"
          :class="
            active === 'subjects'
              ? 'bg-primary-subtle text-primary'
              : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
          "
        >
          <Library class="size-4" aria-hidden="true" />
          Предметы
        </NuxtLink>
        <NuxtLink
          v-if="auth.user.value?.role === 'admin'"
          to="/admin"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-subtle hover:text-text-primary"
        >
          <Settings class="size-4" aria-hidden="true" />
          Админ-панель
        </NuxtLink>
      </nav>

      <div class="border-t border-border p-4">
        <div class="flex items-center gap-3 px-2 py-2">
          <StudentAvatar :student="user" size="sm" status="online" />
          <div class="min-w-0">
            <p class="truncate text-xs font-semibold text-text-primary">{{ user.name }}</p>
            <p class="truncate text-[11px] text-text-tertiary">{{ user.email }}</p>
          </div>
        </div>
        <NuxtLink
          to="/login"
          class="mt-2 flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
          @click="auth.logout"
        >
          <LogOut class="size-4" aria-hidden="true" />
          Выйти
        </NuxtLink>
      </div>
    </aside>

    <header
      class="sticky top-0 z-(--z-header) border-b border-border bg-surface/95 backdrop-blur-sm lg:ml-60"
    >
      <div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 lg:hidden">
          <span class="flex size-8 items-center justify-center rounded-md bg-primary text-white">
            <BookOpen class="size-4" aria-hidden="true" />
          </span>
          <span class="text-sm font-bold tracking-tight text-text-primary">Sauat Education</span>
        </div>

        <div class="hidden items-center gap-3 lg:flex">
          <StudentAvatar :student="user" size="sm" status="online" />
          <p class="text-sm font-semibold text-text-primary">
            Добрый день, {{ user.name.split(' ')[0] }}
          </p>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <BaseIconButton :icon="Settings" label="Настройки" variant="ghost" />
        </div>
      </div>
    </header>

    <main class="pb-20 lg:ml-60 lg:pb-0">
      <slot />
    </main>

    <nav
      class="fixed inset-x-0 bottom-0 z-(--z-header) flex h-16 items-center justify-around border-t border-border bg-surface px-6 lg:hidden"
      aria-label="Мобильная навигация"
    >
      <NuxtLink
        to="/"
        class="flex flex-col items-center gap-1 text-[11px] font-semibold"
        :class="active === 'dashboard' ? 'text-primary' : 'text-text-tertiary'"
      >
        <Home class="size-4" aria-hidden="true" />
        Главная
      </NuxtLink>
      <NuxtLink
        to="/subjects"
        class="flex flex-col items-center gap-1 text-[11px] font-semibold"
        :class="active === 'subjects' ? 'text-primary' : 'text-text-tertiary'"
      >
        <Library class="size-4" aria-hidden="true" />
        Предметы
      </NuxtLink>
    </nav>
  </div>
</template>
