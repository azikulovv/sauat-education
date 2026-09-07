<script lang="ts" setup>
import { ArrowRight, BookOpen, Settings } from 'lucide-vue-next'
import {
  Dialog,
  BaseAlert,
  BaseAvatar,
  BaseBadge,
  BaseButton,
  BaseCard,
  BaseCheckbox,
  BaseContainer,
  BaseEmptyState,
  BaseIconButton,
  BaseInput,
  BaseProgress,
  BaseRadio,
  BaseSkeleton,
  BaseSpinner,
  BaseStack,
  BaseSwitch,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  DropdownContent,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DropdownTrigger,
  DropdownLabel,
  DropdownItem,
  DropdownSeparator,
  SelectTrigger,
  Select,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '~/shared/ui'
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

    <Dialog>
      <DialogTrigger>
        <BaseButton> Открыть </BaseButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle> Завершить урок? </DialogTitle>

          <DialogDescription> Ваш прогресс будет сохранён. </DialogDescription>
        </DialogHeader>

        <div class="px-6 py-4">Контент</div>

        <DialogFooter>
          <DialogClose>
            <BaseButton variant="ghost"> Отмена </BaseButton>
          </DialogClose>

          <BaseButton> Продолжить </BaseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div class="ml-20">
      <Dropdown>
        <DropdownTrigger>
          <BaseButton variant="ghost"> Действия </BaseButton>
        </DropdownTrigger>

        <DropdownContent>
          <DropdownLabel> Управление </DropdownLabel>

          <DropdownItem> Редактировать </DropdownItem>

          <DropdownItem> Архивировать </DropdownItem>

          <DropdownSeparator />

          <DropdownItem destructive> Удалить </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>

    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Выберите предмет" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel> Предметы </SelectLabel>

          <SelectItem value="math"> Математика </SelectItem>

          <SelectItem value="physics"> Физика </SelectItem>

          <SelectItem value="history"> История </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Tabs>
      <TabsList>
        <TabsTrigger value="all"> Все </TabsTrigger>

        <TabsTrigger value="completed"> Завершённые </TabsTrigger>

        <TabsTrigger value="progress"> В процессе </TabsTrigger>
      </TabsList>

      <TabsContent value="all"> ... </TabsContent>

      <TabsContent value="completed"> ... </TabsContent>

      <TabsContent value="progress"> ... </TabsContent>
    </Tabs>

    <Accordion type="single" collapsible>
      <AccordionItem value="notes">
        <AccordionTrigger> Конспект урока </AccordionTrigger>

        <AccordionContent> Основной материал... </AccordionContent>
      </AccordionItem>

      <AccordionItem value="materials">
        <AccordionTrigger> Дополнительные материалы </AccordionTrigger>

        <AccordionContent> ... </AccordionContent>
      </AccordionItem>
    </Accordion>

    <Tooltip>
      <TooltipTrigger>
        <BaseIconButton :icon="Settings" label="Настройки" />
      </TooltipTrigger>

      <TooltipContent> Настройки профиля </TooltipContent>
    </Tooltip>
  </BaseContainer>
</template>
