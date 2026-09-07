<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { BaseGrid } from '~/shared/ui'
import { SubjectCard } from '~/entities/subject'
import type { Subject } from '~/entities/subject'

interface Props {
  subjects: Subject[]
}

defineProps<Props>()

defineEmits<{
  subjectClick: [subject: Subject]
}>()
</script>

<template>
  <section id="subjects" aria-labelledby="dashboard-subjects-title">
    <div class="mb-4 flex items-end justify-between gap-4">
      <div>
        <p class="text-overline text-text-tertiary">Обучение</p>
        <h2 id="dashboard-subjects-title" class="mt-1 text-h2 text-text-primary">Мои предметы</h2>
      </div>

      <button
        type="button"
        class="hidden items-center gap-1 text-xs font-semibold text-primary sm:inline-flex"
        aria-label="Посмотреть все предметы"
      >
        Все предметы
        <ArrowRight class="size-3.5" aria-hidden="true" />
      </button>
    </div>

    <BaseGrid :cols="3" gap="md">
      <SubjectCard
        v-for="subject in subjects"
        :key="subject.id"
        :subject="subject"
        @click="$emit('subjectClick', subject)"
      />
    </BaseGrid>
  </section>
</template>
