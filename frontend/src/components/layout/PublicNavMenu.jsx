import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { PUBLIC_NAV_ITEMS } from './publicNavConfig'

export default function PublicNavMenu() {
  const { t } = useTranslation()
  const location = useLocation()
  const [openKey, setOpenKey] = useState(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    setOpenKey(null)
  }, [location.pathname])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const openMenu = (key) => {
    clearTimeout(closeTimer.current)
    setOpenKey(key)
  }

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenKey(null), 150)
  }

  return (
    <nav
      className="hidden items-center gap-1 lg:flex"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpenKey(null)
      }}
    >
      {PUBLIC_NAV_ITEMS.map((item) => {
        const hasChildren = Boolean(item.children?.length)
        const linkClasses =
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-gold-50 hover:text-gold-800 dark:text-neutral-200 dark:hover:bg-gold-900/40 dark:hover:text-gold-300'

        return (
          <div
            key={item.key}
            className="relative"
            onMouseEnter={() => hasChildren && openMenu(item.key)}
            onMouseLeave={() => hasChildren && scheduleClose()}
          >
            {item.to ? (
              <Link
                to={item.to}
                aria-haspopup={hasChildren || undefined}
                aria-expanded={hasChildren ? openKey === item.key : undefined}
                className={linkClasses}
              >
                {t(item.labelKey)}
                {hasChildren && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
            ) : (
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openKey === item.key}
                onClick={() => setOpenKey((current) => (current === item.key ? null : item.key))}
                className={linkClasses}
              >
                {t(item.labelKey)}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            )}

            {hasChildren && (
              <div
                className={cn(
                  'absolute left-0 top-full z-40 mt-1 w-56 rounded-xl border border-neutral-200 border-t-2 border-t-gold-600 bg-white p-2 shadow-[var(--shadow-warm-md)] transition-opacity dark:border-neutral-800 dark:border-t-gold-500 dark:bg-neutral-900',
                  openKey === item.key ? 'visible opacity-100' : 'invisible opacity-0'
                )}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-gold-50 hover:text-gold-800 dark:text-neutral-200 dark:hover:bg-gold-900/40 dark:hover:text-gold-300"
                  >
                    {t(child.labelKey)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
