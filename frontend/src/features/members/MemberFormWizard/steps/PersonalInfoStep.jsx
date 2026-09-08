import { useTranslation } from 'react-i18next'

import { FormField, Input, Select } from '../../../../components/ui'

export default function PersonalInfoStep({ values, errors, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <FormField label={t('members.fullName')} htmlFor="full_name" required error={errors.full_name}>
        <Input id="full_name" required value={values.full_name} onChange={(e) => onChange('full_name', e.target.value)} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('members.gender')} htmlFor="gender" required error={errors.gender}>
          <Select id="gender" required value={values.gender} onChange={(e) => onChange('gender', e.target.value)}>
            <option value="" disabled>
              {t('common.select', '—')}
            </option>
            <option value="MALE">{t('common.male')}</option>
            <option value="FEMALE">{t('common.female')}</option>
            <option value="OTHER">{t('common.other')}</option>
          </Select>
        </FormField>
        <FormField label={t('members.dateOfBirth')} htmlFor="date_of_birth" error={errors.date_of_birth}>
          <Input
            id="date_of_birth"
            type="date"
            value={values.date_of_birth}
            onChange={(e) => onChange('date_of_birth', e.target.value)}
          />
        </FormField>
      </div>
    </div>
  )
}
