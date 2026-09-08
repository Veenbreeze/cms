import { useState } from 'react'
import { HandHeart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom'

import { Button, Card, CardBody, EmptyState, FormField, Input } from '../components/ui'

export default function PrayerRequestPage() {
  const { t } = useTranslation()
  const { church } = useOutletContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [request, setRequest] = useState('')

  if (!church?.email) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 md:px-6">
        <Card>
          <CardBody>
            <EmptyState
              icon={HandHeart}
              title={t('prayerRequest.missingEmailTitle')}
              description={t('prayerRequest.missingEmailBody')}
            />
          </CardBody>
        </Card>
      </div>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const subject = encodeURIComponent(`${t('prayerRequest.heroTitle')} - ${name}`)
    const body = encodeURIComponent(`${name}\n${email}\n\n${request}`)
    window.location.href = `mailto:${church.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 md:px-6">
      <h1 className="mb-2 font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{t('prayerRequest.heroTitle')}</h1>
      <p className="mb-6 text-neutral-600 dark:text-neutral-300">{t('prayerRequest.intro')}</p>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField label={t('prayerRequest.nameLabel')} htmlFor="pr-name" required>
              <Input id="pr-name" required value={name} onChange={(event) => setName(event.target.value)} />
            </FormField>
            <FormField label={t('prayerRequest.emailLabel')} htmlFor="pr-email" required>
              <Input id="pr-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </FormField>
            <FormField label={t('prayerRequest.requestLabel')} htmlFor="pr-request" required>
              <textarea
                id="pr-request"
                required
                rows={5}
                placeholder={t('prayerRequest.requestPlaceholder')}
                value={request}
                onChange={(event) => setRequest(event.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </FormField>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('prayerRequest.confidentialNote')}</p>
            <Button type="submit">{t('prayerRequest.submit')}</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
