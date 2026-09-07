<script lang="ts" setup>
import { getSubjects } from '~/shared/api/subjects'
import { BaseContainer } from '~/shared/ui'
import { SubjectList } from '~/widgets/subject-list'
import { AppShell } from '~/widgets/app-shell'
import type { Subject } from '~/entities/subject'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { data: subjects, pending, error } = await useAsyncData('subjects-list', getSubjects)

const openSubject = (subject: Subject) => navigateTo(`/subjects/${subject.id}`)
</script>

<template>
  <AppShell active="subjects">
    <BaseContainer>
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <SubjectList
          :subjects="subjects ?? []"
          :loading="pending"
          :error="error?.message ?? null"
          @subject-click="openSubject"
        />
      </div>
    </BaseContainer>
  </AppShell>
</template>
