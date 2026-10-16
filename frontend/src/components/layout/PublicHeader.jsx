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
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-600 text-white">
            <Church className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {t('app.name')}
          </span>
        </Link>

        <PublicNavMenu />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button as={Link} to={ROUTES.PRAYER_REQUEST} variant="secondary" size="sm" className="hidden sm:inline-flex">
            <HandHeart className="h-4 w-4" />
            {t('nav.prayerRequest')}
          </Button>
          <Button as={Link} to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} size="sm" className="hidden sm:inline-flex">
            {isAuthenticated ? t('nav.dashboard') : t('nav.login')}
          </Button>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <PublicMobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
