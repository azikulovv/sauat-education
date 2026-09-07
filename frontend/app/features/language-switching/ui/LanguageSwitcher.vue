<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/shared/ui'
import type { StudentLocale } from '~/entities/student'
import { useLanguageSwitching } from '../model/useLanguageSwitching'

const { locale, localeLabels, setLocale } = useLanguageSwitching()

const handleChange = (value: string | undefined) => {
  if (value === 'ru' || value === 'kk') {
    setLocale(value)
  }
}
</script>

<template>
  <Select :model-value="locale" @update:model-value="handleChange">
    <SelectTrigger class="min-w-32" :placeholder="localeLabels[locale as StudentLocale]" />

    <SelectContent>
      <SelectItem value="ru">{{ localeLabels.ru }}</SelectItem>
      <SelectItem value="kk">{{ localeLabels.kk }}</SelectItem>
    </SelectContent>
  </Select>
</template>
