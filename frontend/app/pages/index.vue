<script lang="ts" setup>
import { ArrowRight, BookOpen, Settings } from 'lucide-vue-next'
import BaseAlert from '~/shared/ui/BaseAlert/BaseAlert.vue'
import BaseAvatar from '~/shared/ui/BaseAvatar/BaseAvatar.vue'
import BaseBadge from '~/shared/ui/BaseBadge/BaseBadge.vue'
import BaseButton from '~/shared/ui/BaseButton/BaseButton.vue'
import BaseCard from '~/shared/ui/BaseCard/BaseCard.vue'
import BaseCheckbox from '~/shared/ui/BaseCheckbox/BaseCheckbox.vue'
import BaseContainer from '~/shared/ui/BaseContainer/BaseContainer.vue'
import BaseEmptyState from '~/shared/ui/BaseEmptyState/BaseEmptyState.vue'
import BaseIconButton from '~/shared/ui/BaseIconButton/BaseIconButton.vue'
import BaseInput from '~/shared/ui/BaseInput/BaseInput.vue'
import BaseProgress from '~/shared/ui/BaseProgress/BaseProgress.vue'
import BaseRadio from '~/shared/ui/BaseRadio/BaseRadio.vue'
import BaseSkeleton from '~/shared/ui/BaseSkeleton/BaseSkeleton.vue'
import BaseSpinner from '~/shared/ui/BaseSpinner/BaseSpinner.vue'
import BaseStack from '~/shared/ui/BaseStack/BaseStack.vue'
import BaseSwitch from '~/shared/ui/BaseSwitch/BaseSwitch.vue'
</script>

<template>
  <BaseContainer>
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

    <BaseCard>
      <h2 class="text-lg font-semibold text-text-primary">Прогресс обучения</h2>

      <p class="mt-1 text-sm text-text-secondary">68% курса завершено</p>
    </BaseCard>

    <BaseSpinner size="lg" />

    <BaseAlert variant="error" title="Не удалось загрузить урок" closable>
      Проверьте подключение к интернету и попробуйте снова.
    </BaseAlert>

    <BaseEmptyState
      :icon="BookOpen"
      title="Предметов пока нет"
      description="После добавления предметов они появятся здесь."
    />

    <BaseStack gap="sm">
      <h1>Мои предметы</h1>
      <p>Продолжите обучение</p>
    </BaseStack>
  </BaseContainer>
</template>
