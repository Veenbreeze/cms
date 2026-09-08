import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../components/ui'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { uploadGalleryImage } from '../../services/api/galleryService'

export default function GalleryUploadForm({ categories, onSaved, onCancel }) {
  const { t } = useTranslation()
  const [values, setValues] = useState({ category: '', caption: '', taken_on: '' })
  const [imageFile, setImageFile] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!imageFile) {
      setFormError(t('common.required'))
      return
    }
    setFormError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const saved = await uploadGalleryImage({ image: imageFile, ...values })
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
      <FormField label={t('common.image')} required>
        <input type="file" accept="image/*" required onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
      </FormField>
      <FormField label={t('gallery.category')} htmlFor="category" error={fieldErrors.category}>
        <Select id="category" value={values.category} onChange={setField('category')}>
          <option value="">—</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label={t('gallery.caption')} htmlFor="caption" error={fieldErrors.caption}>
        <Input id="caption" value={values.caption} onChange={setField('caption')} />
      </FormField>
      <FormField label={t('gallery.takenOn')} htmlFor="taken_on" error={fieldErrors.taken_on}>
        <Input id="taken_on" type="date" value={values.taken_on} onChange={setField('taken_on')} />
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
