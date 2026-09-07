import type { StudentLocale } from '~/entities/student'

const localeLabels: Record<StudentLocale, string> = {
  ru: 'Русский',
  kk: 'Қазақша',
}

export function useLanguageSwitching() {
  const locale = useState<StudentLocale>('language:locale', () => 'ru')

  const setLocale = (nextLocale: StudentLocale) => {
    locale.value = nextLocale
  }

  return {
    locale,
    localeLabels,
    setLocale,
  }
}
