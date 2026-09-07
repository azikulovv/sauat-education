<script lang="ts" setup>
import { ArrowRight, Settings } from 'lucide-vue-next'
import BaseAvatar from '~/shared/ui/BaseAvatar/BaseAvatar.vue'
import BaseBadge from '~/shared/ui/BaseBadge/BaseBadge.vue'
import BaseButton from '~/shared/ui/BaseButton/BaseButton.vue'
import BaseCheckbox from '~/shared/ui/BaseCheckbox/BaseCheckbox.vue'
import BaseIconButton from '~/shared/ui/BaseIconButton/BaseIconButton.vue'
import BaseInput from '~/shared/ui/BaseInput/BaseInput.vue'
import BaseProgress from '~/shared/ui/BaseProgress/BaseProgress.vue'
import BaseRadio from '~/shared/ui/BaseRadio/BaseRadio.vue'
import BaseSkeleton from '~/shared/ui/BaseSkeleton/BaseSkeleton.vue'
import BaseSwitch from '~/shared/ui/BaseSwitch/BaseSwitch.vue'
</script>

<template>
  <main class="p-4">
    <BaseButton :trailing-icon="ArrowRight"> Следующая тема </BaseButton>
    <BaseButton variant="secondary" size="sm"> Отмена </BaseButton>
    <BaseIconButton :icon="Settings" label="Настройки" />
    <BaseInput label="Email" type="email" placeholder="student@example.com" />
    <BaseInput
      label="Email"
      type="email"
      placeholder="student@example.com"
      error="Введите корректный email"
    />

    <BaseCheckbox value="a" name="answer" label="Checkbox" />
    <BaseRadio value="a" name="answer" label="Вариант A" />
    <BaseRadio value="b" name="answer" label="Вариант B" />
    <BaseSwitch value="b" name="answer" label="Вариант B" />
    <BaseBadge variant="success"> Пройдено </BaseBadge>

    <BaseBadge variant="warning"> В процессе </BaseBadge>

    <BaseBadge variant="neutral"> Не начато </BaseBadge>

    <BaseBadge variant="error"> Ошибка </BaseBadge>

    <BaseAvatar />
    <div class="space-y-2">
      <BaseProgress :size="'md'" :value="20" :variant="'warning'" />
      <BaseProgress :size="'md'" :value="20" :variant="'error'" />
      <BaseProgress :size="'md'" :value="20" :variant="'primary'" />
      <BaseProgress :size="'md'" :value="20" :variant="'success'" />

      <BaseProgress :value="72" label="Прогресс обучения" show-value size="md" />
    </div>

    <div class="space-y-3">
      <BaseSkeleton variant="text" width="60%" />

      <BaseSkeleton variant="text" width="90%" />

      <BaseSkeleton variant="rect" width="100%" height="200px" />
    </div>
  </main>
</template>
