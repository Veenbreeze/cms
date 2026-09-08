import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, HandHeart, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../routes/routePaths'
import { cn } from '../../utils/cn'
import { Button } from '../ui'
import { PUBLIC_NAV_ITEMS } from './publicNavConfig'

export default function PublicMobileDrawer({ open, onClose }) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [expandedKey, setExpandedKey] = useState(null)

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-neutral-900/50" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] overflow-y-auto bg-white shadow-[var(--shadow-warm-lg)] dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <span className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-100">{t('app.name')}</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const hasChildren = Boolean(item.children?.length)

            if (!hasChildren) {
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={onClose}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-gold-50 hover:text-gold-800 dark:text-neutral-200 dark:hover:bg-gold-900/40 dark:hover:text-gold-300"
                >
                  {t(item.labelKey)}
                </Link>
              )
            }

            const expanded = expandedKey === item.key
            return (
              <div key={item.key}>
                <button
                  type="button"
                  onClick={() => setExpandedKey(expanded ? null : item.key)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-gold-50 hover:text-gold-800 dark:text-neutral-200 dark:hover:bg-gold-900/40 dark:hover:text-gold-300"
                >
                  {t(item.labelKey)}
                  <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
                </button>
                {expanded && (
                  <div className="ml-3 flex flex-col gap-1 border-l-2 border-gold-600 pl-3 dark:border-gold-500">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-700 dark:text-neutral-300 dark:hover:bg-primary-900/40 dark:hover:text-primary-300"
                      >
                        {t(child.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <Button as={Link} to={ROUTES.PRAYER_REQUEST} onClick={onClose} variant="secondary" size="sm" className="mt-2">
            <HandHeart className="h-4 w-4" />
            {t('nav.prayerRequest')}
          </Button>
          <Button as={Link} to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} onClick={onClose} size="sm">
            {isAuthenticated ? t('nav.dashboard') : t('nav.login')}
          </Button>
        </nav>
      </div>
    </div>,
    document.body
  )
}
