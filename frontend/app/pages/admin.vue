<script lang="ts" setup>
import { CheckCircle2, FileText, GraduationCap, Pencil, Plus, RefreshCw, Save, Trash2, Users, X } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { BaseAlert, BaseButton, BaseCard, BaseContainer, BaseInput, BaseSkeleton } from '~/shared/ui'
import {
  createAdminLesson,
  createAdminSubject,
  deleteAdminLesson,
  deleteAdminSubject,
  getAdminLessons,
  getAdminStats,
  getAdminSubjects,
  getAdminUsers,
  updateAdminLesson,
  updateAdminSubject,
  type AdminLesson,
  type AdminLessonInput,
  type AdminStats,
  type AdminSubject,
  type AdminSubjectInput,
  type AdminUser,
} from '~/shared/api/admin'

type Section = 'overview' | 'subjects' | 'lessons' | 'users'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({ title: 'Админ-панель | Sauat Education' })

const { data: initialData, pending, error } = await useAsyncData('admin-panel', async () => {
  const [stats, subjects, lessons, users] = await Promise.all([
    getAdminStats(),
    getAdminSubjects(),
    getAdminLessons(),
    getAdminUsers(),
  ])
  return { stats, subjects, lessons, users }
})

const activeSection = ref<Section>('overview')
const stats = ref<AdminStats | null>(initialData.value?.stats ?? null)
const subjects = ref<AdminSubject[]>(initialData.value?.subjects ?? [])
const lessons = ref<AdminLesson[]>(initialData.value?.lessons ?? [])
const users = ref<AdminUser[]>(initialData.value?.users ?? [])
const actionError = ref<string | null>(null)
const actionSuccess = ref<string | null>(null)
const actionLoading = ref(false)

const subjectEditingId = ref<string | null>(null)
const subjectForm = reactive<AdminSubjectInput>({
  id: '',
  title: '',
  description: '',
  icon: '',
  sortOrder: 0,
})
const subjectSortOrder = ref('0')

const lessonEditingId = ref<string | null>(null)
const lessonForm = reactive<AdminLessonInput>({
  id: '',
  subjectId: '',
  title: '',
  description: '',
  duration: 20,
  required: false,
  notes: '',
  videoUrl: '',
  timecodes: [],
  sortOrder: 0,
})
const lessonDuration = ref('20')
const lessonSortOrder = ref('0')
const lessonTimecodes = ref('[]')

const reload = async () => {
  const [nextStats, nextSubjects, nextLessons, nextUsers] = await Promise.all([
    getAdminStats(),
    getAdminSubjects(),
    getAdminLessons(),
    getAdminUsers(),
  ])
  stats.value = nextStats
  subjects.value = nextSubjects
  lessons.value = nextLessons
  users.value = nextUsers
}

const runAction = async (action: () => Promise<void>, successMessage: string) => {
  actionLoading.value = true
  actionError.value = null
  actionSuccess.value = null
  try {
    await action()
    actionSuccess.value = successMessage
  } catch (cause) {
    actionError.value = cause instanceof Error ? cause.message : 'Не удалось сохранить изменения.'
  } finally {
    actionLoading.value = false
  }
}

const resetSubject = () => {
  subjectEditingId.value = null
  Object.assign(subjectForm, { id: '', title: '', description: '', icon: '', sortOrder: 0 })
  subjectSortOrder.value = '0'
}

const editSubject = (subject: AdminSubject) => {
  subjectEditingId.value = subject.id
  Object.assign(subjectForm, {
    id: subject.id,
    title: subject.title,
    description: subject.description,
    icon: subject.icon ?? '',
    sortOrder: subject.sortOrder,
  })
  subjectSortOrder.value = String(subject.sortOrder)
  activeSection.value = 'subjects'
}

const saveSubject = async () => {
  const payload = { ...subjectForm, sortOrder: Number(subjectSortOrder.value) || 0 }
  await runAction(async () => {
    if (subjectEditingId.value) {
      await updateAdminSubject(subjectEditingId.value, { title: payload.title, description: payload.description, icon: payload.icon, sortOrder: payload.sortOrder })
    } else {
      await createAdminSubject(payload)
    }
    await reload()
    resetSubject()
  }, subjectEditingId.value ? 'Предмет обновлён.' : 'Предмет создан.')
}

const removeSubject = async (subject: AdminSubject) => {
  if (!window.confirm(`Удалить предмет «${subject.title}» и все его уроки?`)) return
  await runAction(async () => {
    await deleteAdminSubject(subject.id)
    await reload()
  }, 'Предмет удалён.')
}

const resetLesson = () => {
  lessonEditingId.value = null
  Object.assign(lessonForm, { id: '', subjectId: subjects.value[0]?.id ?? '', title: '', description: '', duration: 20, required: false, notes: '', videoUrl: '', timecodes: [], sortOrder: 0 })
  lessonDuration.value = '20'
  lessonSortOrder.value = '0'
  lessonTimecodes.value = '[]'
}

const editLesson = (lesson: AdminLesson) => {
  lessonEditingId.value = lesson.id
  Object.assign(lessonForm, {
    id: lesson.id,
    subjectId: lesson.subjectId,
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    required: lesson.required,
    notes: lesson.notes ?? '',
    videoUrl: lesson.videoUrl ?? '',
    timecodes: lesson.timecodes ?? [],
    sortOrder: lesson.sortOrder,
  })
  lessonDuration.value = String(lesson.duration)
  lessonSortOrder.value = String(lesson.sortOrder)
  lessonTimecodes.value = JSON.stringify(lesson.timecodes ?? [], null, 2)
  activeSection.value = 'lessons'
}

const saveLesson = async () => {
  let parsedTimecodes: AdminLessonInput['timecodes']
  try {
    parsedTimecodes = JSON.parse(lessonTimecodes.value)
    if (!Array.isArray(parsedTimecodes)) throw new Error()
  } catch {
    actionError.value = 'Timecodes должны быть корректным JSON-массивом.'
    return
  }

  const payload: AdminLessonInput = {
    ...lessonForm,
    duration: Number(lessonDuration.value) || 20,
    sortOrder: Number(lessonSortOrder.value) || 0,
    notes: lessonForm.notes || undefined,
    videoUrl: lessonForm.videoUrl || undefined,
    timecodes: parsedTimecodes,
  }

  await runAction(async () => {
    if (lessonEditingId.value) {
      await updateAdminLesson(lessonEditingId.value, { subjectId: payload.subjectId, title: payload.title, description: payload.description, duration: payload.duration, required: payload.required, notes: payload.notes, videoUrl: payload.videoUrl, timecodes: payload.timecodes, sortOrder: payload.sortOrder })
    } else {
      await createAdminLesson(payload)
    }
    await reload()
    resetLesson()
  }, lessonEditingId.value ? 'Урок обновлён.' : 'Урок создан.')
}

const removeLesson = async (lesson: AdminLesson) => {
  if (!window.confirm(`Удалить урок «${lesson.title}»?`)) return
  await runAction(async () => {
    await deleteAdminLesson(lesson.id)
    await reload()
  }, 'Урок удалён.')
}

const formatDate = (date: string) => new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(date))

resetLesson()
</script>

<template>
  <BaseContainer>
    <div class="py-8 pb-16 sm:py-10 lg:py-12">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-overline text-primary">Управление платформой</p>
          <h1 class="mt-2 text-h1 text-text-primary">Админ-панель</h1>
          <p class="mt-2 max-w-2xl text-body-sm text-text-secondary">Контролируйте учебный контент и активность пользователей.</p>
        </div>
        <BaseButton variant="secondary" size="sm" :loading="actionLoading" :leading-icon="RefreshCw" @click="runAction(async () => reload(), 'Данные обновлены.')">Обновить данные</BaseButton>
      </div>

      <BaseAlert v-if="error" class="mt-6" variant="error" title="Не удалось загрузить админ-панель">{{ error.message }}</BaseAlert>
      <BaseAlert v-if="actionError" class="mt-6" variant="error" title="Ошибка">{{ actionError }}</BaseAlert>
      <BaseAlert v-if="actionSuccess" class="mt-6" variant="success" title="Готово" closable @close="actionSuccess = null">{{ actionSuccess }}</BaseAlert>

      <BaseSkeleton v-if="pending" class="mt-8" variant="rect" width="100%" height="420px" />
      <template v-else>
        <div class="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <BaseCard v-for="item in [
            { label: 'Пользователи', value: stats?.users ?? 0, icon: Users },
            { label: 'Предметы', value: stats?.subjects ?? 0, icon: GraduationCap },
            { label: 'Уроки', value: stats?.lessons ?? 0, icon: FileText },
            { label: 'Прохождение', value: `${stats?.completionRate ?? 0}%`, icon: CheckCircle2 },
          ]" :key="item.label" class="p-4 sm:p-5">
            <component :is="item.icon" class="size-5 text-primary" aria-hidden="true" />
            <p class="mt-4 text-xs font-semibold text-text-tertiary">{{ item.label }}</p>
            <p class="mt-1 text-2xl font-bold tracking-tight text-text-primary">{{ item.value }}</p>
          </BaseCard>
        </div>

        <div class="mt-8 flex gap-1 overflow-x-auto border-b border-border" role="tablist" aria-label="Разделы админ-панели">
          <button v-for="item in [
            { id: 'overview', label: 'Обзор' },
            { id: 'subjects', label: 'Предметы' },
            { id: 'lessons', label: 'Уроки' },
            { id: 'users', label: 'Пользователи' },
          ]" :key="item.id" type="button" class="shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors" :class="activeSection === item.id ? 'border-primary text-primary' : 'border-transparent text-text-tertiary hover:text-text-primary'" @click="activeSection = item.id as Section">
            {{ item.label }}
          </button>
        </div>

        <section v-if="activeSection === 'overview'" id="overview" class="mt-8 grid gap-6 lg:grid-cols-2">
          <BaseCard>
            <h2 class="text-h2 text-text-primary">Активность платформы</h2>
            <div class="mt-6 grid grid-cols-2 gap-4">
              <div class="rounded-md bg-bg-subtle p-4"><p class="text-xs text-text-tertiary">Попытки тестов</p><p class="mt-2 text-xl font-bold">{{ stats?.attempts ?? 0 }}</p></div>
              <div class="rounded-md bg-bg-subtle p-4"><p class="text-xs text-text-tertiary">Успешные попытки</p><p class="mt-2 text-xl font-bold">{{ stats?.passedAttempts ?? 0 }}</p></div>
            </div>
          </BaseCard>
          <BaseCard>
            <h2 class="text-h2 text-text-primary">Последние пользователи</h2>
            <div class="mt-4 divide-y divide-border-subtle">
              <div v-for="user in users.slice(0, 4)" :key="user.id" class="flex items-center justify-between gap-3 py-3">
                <div class="min-w-0"><p class="truncate text-sm font-semibold">{{ user.name }}</p><p class="truncate text-xs text-text-tertiary">{{ user.email }}</p></div>
                <span class="shrink-0 text-xs text-text-tertiary">{{ user.role === 'admin' ? 'Админ' : formatDate(user.createdAt) }}</span>
              </div>
            </div>
          </BaseCard>
        </section>

        <section v-if="activeSection === 'subjects'" id="subjects" class="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <BaseCard class="h-fit">
            <div class="flex items-center justify-between gap-3"><h2 class="text-h2 text-text-primary">{{ subjectEditingId ? 'Изменить предмет' : 'Новый предмет' }}</h2><button v-if="subjectEditingId" type="button" class="text-text-tertiary hover:text-text-primary" aria-label="Отменить редактирование" @click="resetSubject"><X class="size-4" /></button></div>
            <form class="mt-5 space-y-4" @submit.prevent="saveSubject">
              <BaseInput v-model="subjectForm.id" label="ID / slug" placeholder="subject-math" :readonly="Boolean(subjectEditingId)" required />
              <BaseInput v-model="subjectForm.title" label="Название" placeholder="Математика" required />
              <div class="flex flex-col gap-1.5"><label class="text-label text-text-primary">Описание</label><textarea v-model="subjectForm.description" class="min-h-24 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary" required /></div>
              <BaseInput v-model="subjectForm.icon" label="Иконка" hint="Например: calculator, book-open" />
              <BaseInput v-model="subjectSortOrder" type="number" label="Порядок" min="0" />
              <div class="flex gap-2"><BaseButton type="submit" :loading="actionLoading" :leading-icon="subjectEditingId ? Save : Plus">{{ subjectEditingId ? 'Сохранить' : 'Создать' }}</BaseButton><BaseButton v-if="subjectEditingId" type="button" variant="ghost" @click="resetSubject">Отмена</BaseButton></div>
            </form>
          </BaseCard>
          <BaseCard padding="none" class="overflow-hidden">
            <div class="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 class="text-h2 text-text-primary">Предметы</h2><p class="mt-1 text-xs text-text-tertiary">{{ subjects.length }} записей</p></div><BaseButton size="sm" :leading-icon="Plus" @click="resetSubject">Новый</BaseButton></div>
            <div class="overflow-x-auto"><table class="w-full text-left text-sm"><thead class="bg-bg-subtle text-xs text-text-tertiary"><tr><th class="px-5 py-3 font-semibold">Предмет</th><th class="px-5 py-3 font-semibold">Уроки</th><th class="px-5 py-3 text-right font-semibold">Действия</th></tr></thead><tbody class="divide-y divide-border-subtle"><tr v-for="subject in subjects" :key="subject.id"><td class="px-5 py-4"><p class="font-semibold text-text-primary">{{ subject.title }}</p><p class="mt-1 text-xs text-text-tertiary">{{ subject.id }}</p></td><td class="px-5 py-4 text-text-secondary">{{ subject.lessonsCount }} <span class="text-xs text-text-tertiary">({{ subject.requiredLessonsCount }} обяз.)</span></td><td class="px-5 py-4"><div class="flex justify-end gap-1"><button type="button" class="rounded-md p-2 text-text-tertiary hover:bg-bg-subtle hover:text-primary" aria-label="Изменить предмет" @click="editSubject(subject)"><Pencil class="size-4" /></button><button type="button" class="rounded-md p-2 text-text-tertiary hover:bg-error/10 hover:text-error" aria-label="Удалить предмет" @click="removeSubject(subject)"><Trash2 class="size-4" /></button></div></td></tr><tr v-if="subjects.length === 0"><td colspan="3" class="px-5 py-10 text-center text-sm text-text-tertiary">Предметов пока нет.</td></tr></tbody></table></div>
          </BaseCard>
        </section>

        <section v-if="activeSection === 'lessons'" id="lessons" class="mt-8 grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
          <BaseCard class="h-fit">
            <div class="flex items-center justify-between gap-3"><h2 class="text-h2 text-text-primary">{{ lessonEditingId ? 'Изменить урок' : 'Новый урок' }}</h2><button v-if="lessonEditingId" type="button" class="text-text-tertiary hover:text-text-primary" aria-label="Отменить редактирование" @click="resetLesson"><X class="size-4" /></button></div>
            <form class="mt-5 space-y-4" @submit.prevent="saveLesson">
              <BaseInput v-model="lessonForm.id" label="ID / slug" placeholder="lesson-new-topic" :readonly="Boolean(lessonEditingId)" required />
              <div class="flex w-full flex-col gap-1.5"><label class="text-label text-text-primary">Предмет <span class="text-error">*</span></label><select v-model="lessonForm.subjectId" class="h-10.5 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-primary" required><option value="" disabled>Выберите предмет</option><option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.title }}</option></select></div>
              <BaseInput v-model="lessonForm.title" label="Название" placeholder="Новая тема" required />
              <div class="flex flex-col gap-1.5"><label class="text-label text-text-primary">Описание</label><textarea v-model="lessonForm.description" class="min-h-20 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary" required /></div>
              <div class="grid grid-cols-2 gap-3"><BaseInput v-model="lessonDuration" type="number" label="Минут" min="1" required /><BaseInput v-model="lessonSortOrder" type="number" label="Порядок" min="0" /></div>
              <label class="flex items-center gap-2 text-sm font-semibold text-text-primary"><input v-model="lessonForm.required" type="checkbox" class="size-4 accent-primary" /> Обязательный урок</label>
              <div class="flex flex-col gap-1.5"><label class="text-label text-text-primary">Заметки</label><textarea v-model="lessonForm.notes" class="min-h-20 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary" /></div>
              <BaseInput v-model="lessonForm.videoUrl" label="Video URL" type="url" placeholder="https://..." />
              <div class="flex flex-col gap-1.5"><label class="text-label text-text-primary">Timecodes JSON</label><textarea v-model="lessonTimecodes" class="min-h-28 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-primary" /></div>
              <div class="flex gap-2"><BaseButton type="submit" :loading="actionLoading" :leading-icon="lessonEditingId ? Save : Plus">{{ lessonEditingId ? 'Сохранить' : 'Создать' }}</BaseButton><BaseButton v-if="lessonEditingId" type="button" variant="ghost" @click="resetLesson">Отмена</BaseButton></div>
            </form>
          </BaseCard>
          <BaseCard padding="none" class="overflow-hidden">
            <div class="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 class="text-h2 text-text-primary">Уроки</h2><p class="mt-1 text-xs text-text-tertiary">{{ lessons.length }} записей</p></div><BaseButton size="sm" :leading-icon="Plus" @click="resetLesson">Новый</BaseButton></div>
            <div class="overflow-x-auto"><table class="w-full min-w-[680px] text-left text-sm"><thead class="bg-bg-subtle text-xs text-text-tertiary"><tr><th class="px-5 py-3 font-semibold">Урок</th><th class="px-5 py-3 font-semibold">Предмет</th><th class="px-5 py-3 font-semibold">Статус</th><th class="px-5 py-3 text-right font-semibold">Действия</th></tr></thead><tbody class="divide-y divide-border-subtle"><tr v-for="lesson in lessons" :key="lesson.id"><td class="px-5 py-4"><p class="font-semibold text-text-primary">{{ lesson.title }}</p><p class="mt-1 text-xs text-text-tertiary">{{ lesson.duration }} мин · {{ lesson.id }}</p></td><td class="px-5 py-4 text-text-secondary">{{ lesson.subjectTitle }}</td><td class="px-5 py-4"><span class="rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="lesson.required ? 'bg-warning/10 text-warning' : 'bg-bg-subtle text-text-tertiary'">{{ lesson.required ? 'Обязательный' : 'Дополнительный' }}</span></td><td class="px-5 py-4"><div class="flex justify-end gap-1"><button type="button" class="rounded-md p-2 text-text-tertiary hover:bg-bg-subtle hover:text-primary" aria-label="Изменить урок" @click="editLesson(lesson)"><Pencil class="size-4" /></button><button type="button" class="rounded-md p-2 text-text-tertiary hover:bg-error/10 hover:text-error" aria-label="Удалить урок" @click="removeLesson(lesson)"><Trash2 class="size-4" /></button></div></td></tr><tr v-if="lessons.length === 0"><td colspan="4" class="px-5 py-10 text-center text-sm text-text-tertiary">Уроков пока нет.</td></tr></tbody></table></div>
          </BaseCard>
        </section>

        <section v-if="activeSection === 'users'" id="users" class="mt-8">
          <BaseCard padding="none" class="overflow-hidden">
            <div class="border-b border-border px-5 py-4"><h2 class="text-h2 text-text-primary">Пользователи</h2><p class="mt-1 text-xs text-text-tertiary">Аккаунты и учебная активность</p></div>
            <div class="overflow-x-auto"><table class="w-full min-w-[700px] text-left text-sm"><thead class="bg-bg-subtle text-xs text-text-tertiary"><tr><th class="px-5 py-3 font-semibold">Пользователь</th><th class="px-5 py-3 font-semibold">Роль</th><th class="px-5 py-3 font-semibold">Уроки</th><th class="px-5 py-3 font-semibold">Попытки</th><th class="px-5 py-3 font-semibold">Регистрация</th></tr></thead><tbody class="divide-y divide-border-subtle"><tr v-for="user in users" :key="user.id"><td class="px-5 py-4"><p class="font-semibold text-text-primary">{{ user.name }}</p><p class="mt-1 text-xs text-text-tertiary">{{ user.email }}</p></td><td class="px-5 py-4"><span class="rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="user.role === 'admin' ? 'bg-primary-subtle text-primary' : 'bg-bg-subtle text-text-secondary'">{{ user.role === 'admin' ? 'Администратор' : 'Ученик' }}</span></td><td class="px-5 py-4 text-text-secondary">{{ user.completedLessons }}</td><td class="px-5 py-4 text-text-secondary">{{ user.attempts }}</td><td class="px-5 py-4 text-text-tertiary">{{ formatDate(user.createdAt) }}</td></tr></tbody></table></div>
          </BaseCard>
        </section>
      </template>
    </div>
  </BaseContainer>
</template>
