import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Avatar, FormField } from '../../../../components/ui'

export default function PhotoUploadStep({ values, onChange }) {
  const { t } = useTranslation()

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (file) onChange('photoFile', file)
  }

  const previewUrl = values.photoFile ? URL.createObjectURL(values.photoFile) : null

  return (
    <div className="space-y-4">
      <FormField label={t('members.profilePhoto')} htmlFor="profile_photo">
        <div className="flex items-center gap-4">
          <Avatar src={previewUrl} name={values.full_name} size="xl" />
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:border-primary-400 hover:text-primary-700 dark:border-neutral-700 dark:text-neutral-300">
            <Upload className="h-4 w-4" />
            {t('common.upload', 'Upload photo')}
            <input id="profile_photo" type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        </div>
      </FormField>
    </div>
  )
}
