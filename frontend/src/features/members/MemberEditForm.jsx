import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { updateMember } from '../../services/api/memberService'
import { JUMUIA_SCOPED_ROLES } from '../../utils/roles'

export default function MemberEditForm({ member, jumuiaOptions, onSaved, onCancel }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const isJumuiaLocked = JUMUIA_SCOPED_ROLES.includes(user?.role)

  const [values, setValues] = useState({
    full_name: member.full_name,
    gender: member.gender,
    date_of_birth: member.date_of_birth || '',
    phone: member.phone || '',
    email: member.email || '',
    residential_address: member.residential_address || '',
    emergency_contact_name: member.emergency_contact_name || '',
    emergency_contact_phone: member.emergency_contact_phone || '',
    jumuia: member.jumuia,
    date_joined_church: member.date_joined_church || '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors({})
    setFormError('')
    setIsSubmitting(true)
    try {
      const saved = await updateMember(member.id, {
        ...values,
        date_of_birth: values.date_of_birth || null,
        date_joined_church: values.date_joined_church || null,
      })
      onSaved(saved)
    } catch (error) {
      setErrors(getFieldErrors(error))
      setFormError(getErrorDetail(error, t('common.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label={t('members.fullName')} htmlFor="full_name" required error={errors.full_name}>
        <Input id="full_name" required value={values.full_name} onChange={setField('full_name')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('members.gender')} htmlFor="gender" required error={errors.gender}>
          <Select id="gender" value={values.gender} onChange={setField('gender')}>
            <option value="MALE">{t('common.male')}</option>
            <option value="FEMALE">{t('common.female')}</option>
            <option value="OTHER">{t('common.other')}</option>
          </Select>
        </FormField>
        <FormField label={t('members.dateOfBirth')} htmlFor="date_of_birth" error={errors.date_of_birth}>
          <Input id="date_of_birth" type="date" value={values.date_of_birth} onChange={setField('date_of_birth')} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('common.phone')} htmlFor="phone" error={errors.phone}>
          <Input id="phone" value={values.phone} onChange={setField('phone')} />
        </FormField>
        <FormField label={t('common.email')} htmlFor="email" error={errors.email}>
          <Input id="email" type="email" value={values.email} onChange={setField('email')} />
        </FormField>
      </div>

      <FormField label={t('members.residentialAddress')} htmlFor="residential_address" error={errors.residential_address}>
        <Input id="residential_address" value={values.residential_address} onChange={setField('residential_address')} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('members.emergencyContactName')} htmlFor="emergency_contact_name" error={errors.emergency_contact_name}>
          <Input id="emergency_contact_name" value={values.emergency_contact_name} onChange={setField('emergency_contact_name')} />
        </FormField>
        <FormField label={t('members.emergencyContactPhone')} htmlFor="emergency_contact_phone" error={errors.emergency_contact_phone}>
          <Input id="emergency_contact_phone" value={values.emergency_contact_phone} onChange={setField('emergency_contact_phone')} />
        </FormField>
      </div>

      <FormField label={t('members.jumuia')} htmlFor="jumuia" required error={errors.jumuia}>
        {isJumuiaLocked ? (
          <Input value={user?.jumuia_name || ''} disabled />
        ) : (
          <Select id="jumuia" value={values.jumuia} onChange={setField('jumuia')}>
            {jumuiaOptions.map((jumuia) => (
              <option key={jumuia.id} value={jumuia.id}>
                {jumuia.name}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <FormField label={t('members.dateJoinedChurch')} htmlFor="date_joined_church" error={errors.date_joined_church}>
        <Input id="date_joined_church" type="date" value={values.date_joined_church} onChange={setField('date_joined_church')} />
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
