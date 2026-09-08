<script setup lang="ts">
import { BookOpen, ChartNoAxesColumn, FileText, GraduationCap, LogOut, Users } from 'lucide-vue-next'
import { computed } from 'vue'
import { useAuthStore } from '~/features/auth'
import { StudentAvatar } from '~/entities/student'

const auth = useAuthStore()
auth.initialize()
const user = computed(() => auth.user.value)

const navigation = [
  { id: 'overview', label: 'Обзор', icon: ChartNoAxesColumn },
  { id: 'subjects', label: 'Предметы', icon: GraduationCap },
  { id: 'lessons', label: 'Уроки', icon: FileText },
  { id: 'users', label: 'Пользователи', icon: Users },
]
</script>

<template>
  <div class="min-h-screen bg-bg text-text-primary">
    <aside class="fixed inset-y-0 left-0 z-(--z-sidebar) hidden w-64 border-r border-border bg-surface lg:flex lg:flex-col">
      <div class="flex h-16 items-center gap-3 border-b border-border px-6">
        <span class="flex size-8 items-center justify-center rounded-md bg-primary text-white">
          <BookOpen class="size-4" aria-hidden="true" />
        </span>
        <div>
          <p class="text-sm font-bold tracking-tight text-text-primary">Sauat Education</p>
          <p class="text-[10px] font-semibold uppercase tracking-wider text-primary">Admin panel</p>
        </div>
      </div>

      <nav class="flex-1 space-y-1 p-4" aria-label="Навигация администратора">
        <a
          v-for="item in navigation"
          :key="item.id"
          :href="`#${item.id}`"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-subtle hover:text-text-primary"
        >
          <component :is="item.icon" class="size-4" aria-hidden="true" />
          {{ item.label }}
        </a>
      </nav>

      <div class="border-t border-border p-4">
        <div v-if="user" class="flex items-center gap-3 px-2 py-2">
          <StudentAvatar :student="user" size="sm" status="online" />
          <div class="min-w-0">
            <p class="truncate text-xs font-semibold text-text-primary">{{ user.name }}</p>
            <p class="truncate text-[11px] text-text-tertiary">{{ user.email }}</p>
          </div>
        </div>
        <button
          type="button"
          class="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
          @click="auth.logout(); navigateTo('/login')"
        >
          <LogOut class="size-4" aria-hidden="true" />
          Выйти
        </button>
      </div>
    </aside>

    <header class="sticky top-0 z-(--z-header) border-b border-border bg-surface/95 backdrop-blur-sm lg:ml-64">
      <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 lg:hidden">
          <BookOpen class="size-5 text-primary" aria-hidden="true" />
          <span class="text-sm font-bold">Admin panel</span>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <span class="hidden text-xs font-semibold text-text-tertiary sm:inline">Панель управления</span>
          <NuxtLink to="/" class="text-xs font-semibold text-primary hover:underline">К обучению</NuxtLink>
        </div>
      </div>
    </header>

    <main class="pb-10 lg:ml-64">
      <slot />
    </main>
  </div>
</template>
