import { Church } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import { SIDEBAR_ITEMS } from './sidebarConfig'

export default function Sidebar({ onNavigate }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const items = SIDEBAR_ITEMS.filter((item) => item.roles.includes(user?.role))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
          <Church className="h-5 w-5" />
        </div>
        <span className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {t('app.name')}
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
