import { Church, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

import { Button, Card, CardBody } from '../components/ui'
import LanguageSwitcher from '../components/layout/LanguageSwitcher'
import ThemeSwitcher from '../components/layout/ThemeSwitcher'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../features/auth/LoginForm'
import { ROUTES } from '../routes/routePaths'

export default function LoginPage() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuth()

  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      <div className="flex items-center justify-between gap-2 p-4">
        <Button as={Link} to={ROUTES.HOME} variant="ghost" size="sm">
          <Home className="h-4 w-4" />
          {t('nav.home')}
        </Button>
        <div className="flex gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Church className="h-6 w-6" />
            </span>
            <h1 className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('auth.loginSubtitle')}</p>
          </div>
          <Card>
            <CardBody>
              <LoginForm />
            </CardBody>
          </Card>
          <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {t('auth.noSelfRegistration')}
          </p>
        </div>
      </div>
    </div>
  )
}
