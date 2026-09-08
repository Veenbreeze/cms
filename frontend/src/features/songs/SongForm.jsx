import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { createSong, updateSong } from '../../services/api/songService'

export default function SongForm({ song, onSaved, onCancel }) {
  const { t } = useTranslation()
  const [values, setValues] = useState({
    number: song?.number || '',
    title: song?.title || '',
    lyrics: song?.lyrics || '',
    category: song?.category || '',
    language: song?.language || 'sw',
    notes: song?.notes || '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const saved = song ? await updateSong(song.id, values) : await createSong(values)
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
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('songs.number')} htmlFor="number" error={fieldErrors.number}>
          <Input id="number" value={values.number} onChange={setField('number')} />
        </FormField>
        <FormField label={t('songs.language')} htmlFor="language" error={fieldErrors.language}>
          <Select id="language" value={values.language} onChange={setField('language')}>
            <option value="sw">Kiswahili</option>
            <option value="en">English</option>
          </Select>
        </FormField>
      </div>
      <FormField label={t('songs.title')} htmlFor="title" required error={fieldErrors.title}>
        <Input id="title" required value={values.title} onChange={setField('title')} />
      </FormField>
      <FormField label={t('songs.category')} htmlFor="category" error={fieldErrors.category}>
        <Input id="category" value={values.category} onChange={setField('category')} />
      </FormField>
      <FormField label={t('songs.lyrics')} htmlFor="lyrics" error={fieldErrors.lyrics}>
        <textarea
          id="lyrics"
          rows={6}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          value={values.lyrics}
          onChange={setField('lyrics')}
        />
      </FormField>
      <FormField label={t('common.notes')} htmlFor="notes" error={fieldErrors.notes}>
        <Input id="notes" value={values.notes} onChange={setField('notes')} />
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
