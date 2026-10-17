import { useEffect, useState } from 'react'
import { HandHeart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Button, Card, CardBody, EmptyState, FormField, Input, Spinner } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { getErrorDetail, getFieldErrors } from '../services/api/apiError'
import { listMyPrayerRequests, submitPrayerRequest } from '../services/api/prayerRequestService'
import { formatDateTime } from '../utils/formatDate'

export default function PrayerRequestPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [request, setRequest] = useState('')
  const [myRequests, setMyRequests] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [didSubmit, setDidSubmit] = useState(false)

  useEffect(() => {
    if (!user) {
      setMyRequests(null)
      return undefined
    }
    let active = true
    listMyPrayerRequests()
      .then((data) => { if (active) setMyRequests(data.results) })
      .catch(() => { if (active) setMyRequests([]) })
    return () => { active = false }
  }, [user?.id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFieldErrors({})
    setDidSubmit(false)
    setIsSubmitting(true)
    try {
      await submitPrayerRequest({
        name: name || user?.full_name || '',
        email: email || user?.email || '',
        message: request,
      })
      setRequest('')
      setDidSubmit(true)
      if (user) {
        const data = await listMyPrayerRequests()
        setMyRequests(data.results)
      }
    } catch (error) {
      setFieldErrors(getFieldErrors(error))
      setFormError(getErrorDetail(error, t('common.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] lg:py-16">
      <section>
        <p className="mb-2 text-sm font-semibold text-primary-700 dark:text-primary-300">{t('prayerRequest.eyebrow')}</p>
        <h1 className="font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-4xl">{t('prayerRequest.heroTitle')}</h1>
        <p className="mb-6 mt-3 max-w-xl text-neutral-600 dark:text-neutral-300">{t('prayerRequest.intro')}</p>
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <FormField label={t('prayerRequest.nameLabel')} htmlFor="pr-name" required error={fieldErrors.name}>
                <Input id="pr-name" required value={name || user?.full_name || ''} onChange={(event) => setName(event.target.value)} />
              </FormField>
              <FormField label={t('prayerRequest.emailLabel')} htmlFor="pr-email" required error={fieldErrors.email}>
                <Input id="pr-email" type="email" required value={email || user?.email || ''} onChange={(event) => setEmail(event.target.value)} />
              </FormField>
              <FormField label={t('prayerRequest.requestLabel')} htmlFor="pr-request" required error={fieldErrors.message}>
                <textarea
                  id="pr-request"
                  required
                  rows={6}
                  maxLength={5000}
                  placeholder={t('prayerRequest.requestPlaceholder')}
                  value={request}
                  onChange={(event) => setRequest(event.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
              </FormField>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('prayerRequest.confidentialNote')}</p>
              {formError && <p className="text-sm text-danger" role="alert">{formError}</p>}
              {didSubmit && <p className="text-sm font-medium text-success" role="status">{t('prayerRequest.submitted')}</p>}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('prayerRequest.submit')}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>

      {user && (
        <section aria-labelledby="my-prayer-requests-heading">
          <h2 id="my-prayer-requests-heading" className="mb-4 font-display text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {t('prayerRequest.myRequests')}
          </h2>
          {myRequests === null ? (
            <div className="flex justify-center py-12"><Spinner size={28} /></div>
          ) : myRequests.length === 0 ? (
            <Card><CardBody><EmptyState icon={HandHeart} title={t('prayerRequest.noRequests')} /></CardBody></Card>
          ) : (
            <div className="space-y-3">
              {myRequests.map((item) => (
                <Card key={item.id}>
                  <CardBody>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDateTime(item.created_at)}</p>
                      <Badge variant={item.status === 'ANSWERED' ? 'success' : item.status === 'CLOSED' ? 'neutral' : 'primary'}>
                        {t(`prayerRequest.statuses.${item.status}`)}
                      </Badge>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-200">{item.message}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
