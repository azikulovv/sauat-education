<script setup lang="ts">
import { LogIn } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { BaseAlert, BaseButton, BaseInput } from '~/shared/ui'
import { useAuthStore } from '../model/auth.store'

const emit = defineEmits<{
  success: []
}>()

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const submitted = ref(false)

const emailError = computed(() => {
  if (!submitted.value || email.value.includes('@')) {
    return undefined
  }

  return 'Введите корректный email.'
})

const passwordError = computed(() => {
  if (!submitted.value || password.value.length >= 6) {
    return undefined
  }

  return 'Пароль должен содержать минимум 6 символов.'
})

const canSubmit = computed(() => Boolean(email.value && password.value.length >= 6))

const submit = async () => {
  submitted.value = true

  if (!canSubmit.value || emailError.value) {
    return
  }

  await auth.login({ email: email.value, password: password.value })

  if (auth.status.value === 'success') {
    emit('success')
  }
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="submit">
    <BaseAlert v-if="auth.error.value" variant="error" title="Не удалось войти" role="alert">
      {{ auth.error.value }}
    </BaseAlert>

    <BaseInput
      v-model="email"
      label="Email"
      type="email"
      name="email"
      autocomplete="email"
      placeholder="student@example.com"
      required
      :error="emailError"
    />

    <BaseInput
      v-model="password"
      label="Пароль"
      type="password"
      name="password"
      autocomplete="current-password"
      placeholder="Введите пароль"
      required
      :error="passwordError"
    />

    <BaseButton
      type="submit"
      full-width
      :loading="auth.status.value === 'loading'"
      :disabled="submitted && !canSubmit"
      :leading-icon="LogIn"
    >
      {{ auth.status.value === 'loading' ? 'Выполняем вход...' : 'Войти' }}
    </BaseButton>
  </form>
</template>
