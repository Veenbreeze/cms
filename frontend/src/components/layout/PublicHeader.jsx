import { useState } from 'react'
import { Church, HandHeart, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../routes/routePaths'
import { Button } from '../ui'
import LanguageSwitcher from './LanguageSwitcher'
import PublicMobileDrawer from './PublicMobileDrawer'
import PublicNavMenu from './PublicNavMenu'
import ThemeSwitcher from './ThemeSwitcher'

export default function PublicHeader() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-t-2 border-t-primary-600 border-b border-neutral-200 bg-white/95 shadow-[var(--shadow-warm-sm)] backdrop-blur-md dark:border-b-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between gap-3 px-4 md:px-6 xl:gap-5">
        <Link to={ROUTES.HOME} className="flex min-w-0 shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Church className="h-5 w-5" />
          </span>
          <span className="max-w-[8.5rem] truncate font-display text-sm font-semibold text-neutral-900 sm:max-w-[11rem] sm:text-lg dark:text-neutral-100">
            {t('app.name')}
          </span>
        </Link>

        <PublicNavMenu />

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <div className="hidden 2xl:block">
            <Button as={Link} to={ROUTES.PRAYER_REQUEST} variant="secondary" size="sm">
              <HandHeart className="h-4 w-4" />
              {t('nav.prayerRequest')}
            </Button>
          </div>
          <div className="hidden xl:block">
            <Button as={Link} to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} size="sm">
              {isAuthenticated ? t('nav.dashboard') : t('nav.login')}
            </Button>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 transition-colors hover:bg-accent-50 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 xl:hidden dark:text-neutral-200 dark:hover:bg-primary-900/40 dark:hover:text-accent-200"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <PublicMobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
