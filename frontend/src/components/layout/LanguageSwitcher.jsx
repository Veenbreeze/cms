import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'sw', label: 'SW' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('sw') ? 'sw' : 'en'

  const toggle = () => {
    const next = current === 'en' ? 'sw' : 'en'
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      <Languages className="h-4 w-4" />
      {LANGUAGES.find((l) => l.code === current)?.label}
    </button>
  )
}
