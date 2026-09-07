<script setup lang="ts">
import { BookOpen, ChartNoAxesColumnIncreasing, Home, Menu, Settings } from 'lucide-vue-next'
import { BaseIconButton } from '~/shared/ui'
</script>

<template>
  <div class="min-h-screen bg-bg text-text-primary">
    <header
      class="sticky top-0 z-(--z-header) border-b border-border bg-surface/95 backdrop-blur-sm"
    >
      <div
        class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <div class="flex items-center gap-3">
          <span class="flex size-8 items-center justify-center rounded-md bg-primary text-white">
            <BookOpen class="size-4" aria-hidden="true" />
          </span>
          <span class="text-sm font-bold tracking-tight text-text-primary w-16">
            Sauat Education
          </span>
        </div>

        <nav class="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          <a
            href="/student"
            class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-subtle"
          >
            <Home class="size-4" aria-hidden="true" />
            Главная
          </a>
          <a
            href="#subjects"
            class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
          >
            <ChartNoAxesColumnIncreasing class="size-4" aria-hidden="true" />
            Прогресс
          </a>
        </nav>

        <div class="flex items-center gap-1">
          <BaseIconButton :icon="Settings" label="Настройки" variant="ghost" />
          <BaseIconButton :icon="Menu" label="Открыть меню" variant="ghost" class="md:hidden" />
        </div>
      </div>
    </header>

    <slot />
  </div>
</template>
