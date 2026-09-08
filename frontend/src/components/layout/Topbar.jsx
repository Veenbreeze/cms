import { LogOut, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../../features/notifications/NotificationBell'
import { Avatar } from '../ui'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'

export default function Topbar({ onMenuClick }) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 md:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-1.5 sm:gap-3">
        <NotificationBell />
        <LanguageSwitcher />
        <ThemeSwitcher />
        <div className="mx-1 hidden items-center gap-2 sm:flex">
          <Avatar name={user?.full_name} size="sm" />
          <div className="leading-tight">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{user?.full_name}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{t(`users.roles.${user?.role}`)}</p>
          </div>
        </div>
        <button
          onClick={logout}
          aria-label={t('nav.logout')}
          title={t('nav.logout')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
