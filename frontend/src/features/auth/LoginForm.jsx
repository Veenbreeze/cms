import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button, FormField, Input } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../routes/routePaths'
import { getErrorDetail } from '../../services/api/apiError'

const REMEMBERED_EMAIL_KEY = 'cmsa_remembered_email'

export default function LoginForm() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY)))
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login(email, password, rememberMe)
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY)
      }
      const redirectTo = location.state?.from?.pathname || ROUTES.DASHBOARD
      navigate(redirectTo, { replace: true })
    } catch (submitError) {
      const status = submitError?.response?.status
      setError(status === 401 ? t('auth.loginError') : getErrorDetail(submitError, t('common.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label={t('auth.email')} htmlFor="email" required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <FormField label={t('auth.password')} htmlFor="password" required>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      <label htmlFor="remember_me" className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200">
        <input
          id="remember_me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 accent-primary-600 dark:border-neutral-700"
        />
        {t('auth.rememberMe')}
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-950/40">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t('common.loading') : t('auth.loginButton')}
      </Button>
    </form>
  )
}
