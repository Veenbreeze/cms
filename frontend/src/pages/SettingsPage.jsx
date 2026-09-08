import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardBody, FormField, Input, Spinner } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { getErrorDetail, getFieldErrors } from '../services/api/apiError'
import { getChurchSettings, updateChurchSettings } from '../services/api/churchService'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const [values, setValues] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getChurchSettings().then(setValues)
  }, [])

  if (!values) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors({})
    setIsSubmitting(true)
    try {
      const saved = await updateChurchSettings(values)
      setValues(saved)
      showToast({ type: 'success', message: t('common.success') })
    } catch (error) {
      setErrors(getFieldErrors(error))
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('nav.settings')}</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField label={t('app.name')} htmlFor="name" required error={errors.name}>
              <Input id="name" required value={values.name} onChange={setField('name')} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('jumuia.code')} htmlFor="short_name" error={errors.short_name}>
                <Input id="short_name" value={values.short_name} onChange={setField('short_name')} />
              </FormField>
              <FormField label={t('common.phone')} htmlFor="phone" error={errors.phone}>
                <Input id="phone" value={values.phone} onChange={setField('phone')} />
              </FormField>
            </div>
            <FormField label={t('common.email')} htmlFor="email" error={errors.email}>
              <Input id="email" type="email" value={values.email} onChange={setField('email')} />
            </FormField>
            <FormField label={t('members.residentialAddress')} htmlFor="address" error={errors.address}>
              <Input id="address" value={values.address} onChange={setField('address')} />
            </FormField>
            <FormField label={t('jumuia.description')} htmlFor="description" error={errors.description}>
              <Input id="description" value={values.description} onChange={setField('description')} />
            </FormField>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Facebook" htmlFor="facebook_url" error={errors.facebook_url}>
                <Input id="facebook_url" value={values.facebook_url} onChange={setField('facebook_url')} />
              </FormField>
              <FormField label="Instagram" htmlFor="instagram_url" error={errors.instagram_url}>
                <Input id="instagram_url" value={values.instagram_url} onChange={setField('instagram_url')} />
              </FormField>
              <FormField label="YouTube" htmlFor="youtube_url" error={errors.youtube_url}>
                <Input id="youtube_url" value={values.youtube_url} onChange={setField('youtube_url')} />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('contact.givingNumber1')} htmlFor="giving_number_1" error={errors.giving_number_1}>
                <Input id="giving_number_1" value={values.giving_number_1} onChange={setField('giving_number_1')} />
              </FormField>
              <FormField label={t('contact.givingNumber1Label')} htmlFor="giving_number_1_label" error={errors.giving_number_1_label}>
                <Input id="giving_number_1_label" value={values.giving_number_1_label} onChange={setField('giving_number_1_label')} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('contact.givingNumber2')} htmlFor="giving_number_2" error={errors.giving_number_2}>
                <Input id="giving_number_2" value={values.giving_number_2} onChange={setField('giving_number_2')} />
              </FormField>
              <FormField label={t('contact.givingNumber2Label')} htmlFor="giving_number_2_label" error={errors.giving_number_2_label}>
                <Input id="giving_number_2_label" value={values.giving_number_2_label} onChange={setField('giving_number_2_label')} />
              </FormField>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
