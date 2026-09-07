<script setup lang="ts">
import { BookOpen, Calculator, FlaskConical, Languages, Landmark } from 'lucide-vue-next'
import type { Component } from 'vue'
import { BaseCard } from '~/shared/ui'
import type { Subject, SubjectIconName } from '../model/types'
import SubjectProgress from './SubjectProgress.vue'
import SubjectStatus from './SubjectStatus.vue'

interface Props {
  subject: Subject
  showStatus?: boolean
}

withDefaults(defineProps<Props>(), {
  showStatus: true,
})

defineEmits<{
  click: []
}>()

const subjectIcons: Record<SubjectIconName, Component> = {
  'book-open': BookOpen,
  calculator: Calculator,
  'flask-conical': FlaskConical,
  languages: Languages,
  landmark: Landmark,
}

const getSubjectIcon = (icon?: SubjectIconName) => subjectIcons[icon ?? 'book-open']
</script>

<template>
  <BaseCard
    as="button"
    type="button"
    variant="interactive"
    class="group block w-full text-left"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between gap-4">
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary"
      >
        <component :is="getSubjectIcon(subject.icon)" class="size-5" aria-hidden="true" />
      </span>

      <SubjectStatus v-if="showStatus" :subject="subject" />
    </div>

    <div class="mt-5">
      <h3 class="text-base font-semibold text-text-primary">{{ subject.title }}</h3>

      <p class="mt-1 min-h-10 text-sm leading-5 text-text-secondary">{{ subject.description }}</p>
    </div>

    <div class="mt-5">
      <SubjectProgress :subject="subject" />
    </div>

    <span
      class="mt-4 inline-flex text-xs font-semibold text-primary transition-transform group-hover:translate-x-0.5"
    >
      Открыть предмет <span class="ml-1" aria-hidden="true">→</span>
    </span>
  </BaseCard>
</template>
