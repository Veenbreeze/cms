import { useTranslation } from 'react-i18next'

import { FormField, Input } from '../../../../components/ui'

export default function ContactStep({ values, errors, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('common.phone')} htmlFor="phone" error={errors.phone}>
          <Input id="phone" value={values.phone} onChange={(e) => onChange('phone', e.target.value)} />
        </FormField>
        <FormField label={t('common.email')} htmlFor="email" error={errors.email}>
          <Input id="email" type="email" value={values.email} onChange={(e) => onChange('email', e.target.value)} />
        </FormField>
      </div>
      <FormField label={t('members.residentialAddress')} htmlFor="residential_address" error={errors.residential_address}>
        <Input
          id="residential_address"
          value={values.residential_address}
          onChange={(e) => onChange('residential_address', e.target.value)}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('members.emergencyContactName')} htmlFor="emergency_contact_name" error={errors.emergency_contact_name}>
          <Input
            id="emergency_contact_name"
            value={values.emergency_contact_name}
            onChange={(e) => onChange('emergency_contact_name', e.target.value)}
          />
        </FormField>
        <FormField label={t('members.emergencyContactPhone')} htmlFor="emergency_contact_phone" error={errors.emergency_contact_phone}>
          <Input
            id="emergency_contact_phone"
            value={values.emergency_contact_phone}
            onChange={(e) => onChange('emergency_contact_phone', e.target.value)}
          />
        </FormField>
      </div>
    </div>
  )
}
