<script lang="ts" setup>
import { ChevronLeft } from 'lucide-vue-next'
import { BaseAlert, BaseButton, BaseContainer, BaseSkeleton } from '~/shared/ui'
import { getQuiz } from '~/shared/api/quizzes'
import { QuizPlayer } from '~/widgets/quiz-player'

definePageMeta({
  layout: 'student',
})

const route = useRoute()
const quizId = String(route.params.quizId)
const { data: quiz, pending, error } = await useAsyncData(`quiz-${quizId}`, () => getQuiz(quizId))

const goBack = () => navigateTo('/student')
const openReview = (id: string) => navigateTo(`/mistakes/${id}`)
</script>

<template>
  <main>
    <BaseContainer size="md">
      <div class="py-8 pb-20 sm:py-10 lg:py-12">
        <BaseButton variant="ghost" size="sm" :leading-icon="ChevronLeft" @click="goBack">
          Вернуться к обучению
        </BaseButton>

        <BaseSkeleton v-if="pending" class="mt-6" variant="rect" width="100%" height="480px" />

        <BaseAlert v-else-if="error" class="mt-6" variant="error" title="Не удалось загрузить тест">
          {{ error.message }}
        </BaseAlert>

        <BaseAlert v-else-if="!quiz" class="mt-6" variant="warning" title="Тест не найден">
          Вернитесь к уроку и попробуйте открыть тест ещё раз.
        </BaseAlert>

        <QuizPlayer v-else :quiz="quiz" class="mt-6" @review="openReview" />
      </div>
    </BaseContainer>
  </main>
</template>
