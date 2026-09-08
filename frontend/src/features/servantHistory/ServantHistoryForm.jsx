import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { listJumuia } from '../../services/api/jumuiaService'
import { createServant, updateServant } from '../../services/api/servantHistoryService'
import { buildFormData } from '../../utils/buildFormData'
import { cleanPayload } from '../../utils/cleanPayload'

export default function ServantHistoryForm({ servant, onSaved, onCancel }) {
  const { t } = useTranslation()
  const [jumuiaOptions, setJumuiaOptions] = useState([])
  const [values, setValues] = useState({
    full_name: servant?.full_name || '',
    position_title: servant?.position_title || '',
    jumuia: servant?.jumuia || '',
    start_year: servant?.start_year || '',
    end_year: servant?.end_year || '',
    biography: servant?.biography || '',
    achievements: servant?.achievements || '',
    notes: servant?.notes || '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    listJumuia({ page_size: 100 }).then((data) => setJumuiaOptions(data.results))
  }, [])

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const payload = photoFile ? buildFormData({ ...values, photo: photoFile }) : cleanPayload(values)
      const saved = servant ? await updateServant(servant.id, payload) : await createServant(payload)
      onSaved(saved)
    } catch (error) {
      setFieldErrors(getFieldErrors(error))
      setFormError(getErrorDetail(error, t('common.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label={t('servantsHistory.fullName')} htmlFor="full_name" required error={fieldErrors.full_name}>
        <Input id="full_name" required value={values.full_name} onChange={setField('full_name')} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('servantsHistory.positionTitle')} htmlFor="position_title" required error={fieldErrors.position_title}>
          <Input id="position_title" required value={values.position_title} onChange={setField('position_title')} />
        </FormField>
        <FormField label={t('servantsHistory.jumuia')} htmlFor="jumuia" error={fieldErrors.jumuia}>
          <Select id="jumuia" value={values.jumuia} onChange={setField('jumuia')}>
            <option value="">—</option>
            {jumuiaOptions.map((jumuia) => (
              <option key={jumuia.id} value={jumuia.id}>
                {jumuia.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('servantsHistory.startYear')} htmlFor="start_year" required error={fieldErrors.start_year}>
          <Input id="start_year" type="number" required value={values.start_year} onChange={setField('start_year')} />
        </FormField>
        <FormField label={t('servantsHistory.endYear')} htmlFor="end_year" hint={t('servantsHistory.present')} error={fieldErrors.end_year}>
          <Input id="end_year" type="number" value={values.end_year} onChange={setField('end_year')} />
        </FormField>
      </div>
      <FormField label={t('servantsHistory.biography')} htmlFor="biography" error={fieldErrors.biography}>
        <textarea
          id="biography"
          rows={3}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          value={values.biography}
          onChange={setField('biography')}
        />
      </FormField>
      <FormField label={t('servantsHistory.achievements')} htmlFor="achievements" error={fieldErrors.achievements}>
        <textarea
          id="achievements"
          rows={2}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          value={values.achievements}
          onChange={setField('achievements')}
        />
      </FormField>

      <FormField label={t('servantsHistory.photo')}>
        <input type="file" accept="image/*" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} />
      </FormField>

      {formError && <p className="text-sm text-danger">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </form>
  )
}
