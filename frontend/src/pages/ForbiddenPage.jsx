import { ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '../components/ui'
import { ROUTES } from '../routes/routePaths'

export default function ForbiddenPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center dark:bg-neutral-950">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        {t('errors.forbiddenTitle')}
      </h1>
      <p className="max-w-sm text-neutral-600 dark:text-neutral-400">{t('errors.forbiddenBody')}</p>
      <Button as={Link} to={ROUTES.DASHBOARD}>
        {t('errors.goHome')}
      </Button>
    </div>
  )
}
