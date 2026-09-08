import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { getErrorDetail, getFieldErrors } from '../../services/api/apiError'
import { listJumuia } from '../../services/api/jumuiaService'
import { createUser, updateUser } from '../../services/api/userService'
import { JUMUIA_SCOPED_ROLES, ROLES } from '../../utils/roles'

export default function UserForm({ user: editingUser, onSaved, onCancel }) {
  const { t } = useTranslation()
  const { user: currentUser } = useAuth()
  const [jumuiaOptions, setJumuiaOptions] = useState([])
  const [values, setValues] = useState({
    email: editingUser?.email || '',
    first_name: editingUser?.first_name || '',
    last_name: editingUser?.last_name || '',
    phone: editingUser?.phone || '',
    role: editingUser?.role || ROLES.SECRETARY,
    jumuia: editingUser?.jumuia || '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    listJumuia().then((res) => setJumuiaOptions(res.results))
  }, [])

  const availableRoles = Object.values(ROLES).filter(
    (role) => role !== ROLES.SUPER_ADMIN || currentUser?.role === ROLES.SUPER_ADMIN
  )
  const needsJumuia = JUMUIA_SCOPED_ROLES.includes(values.role)
  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrors({})
    setFormError('')
    setIsSubmitting(true)
    try {
      const payload = { ...values, jumuia: needsJumuia ? values.jumuia : null }
      if (editingUser && !payload.password) delete payload.password
      const saved = editingUser ? await updateUser(editingUser.id, payload) : await createUser(payload)
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
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t('users.firstName')} htmlFor="first_name" required error={errors.first_name}>
          <Input id="first_name" required value={values.first_name} onChange={setField('first_name')} />
        </FormField>
        <FormField label={t('users.lastName')} htmlFor="last_name" error={errors.last_name}>
          <Input id="last_name" value={values.last_name} onChange={setField('last_name')} />
        </FormField>
      </div>

      <FormField label={t('auth.email')} htmlFor="email" required error={errors.email}>
        <Input id="email" type="email" required value={values.email} onChange={setField('email')} disabled={!!editingUser} />
      </FormField>

      <FormField label={t('common.phone')} htmlFor="phone" error={errors.phone}>
        <Input id="phone" value={values.phone} onChange={setField('phone')} />
      </FormField>

      <FormField label={t('users.role')} htmlFor="role" required error={errors.role}>
        <Select id="role" value={values.role} onChange={setField('role')}>
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {t(`users.roles.${role}`)}
            </option>
          ))}
        </Select>
      </FormField>

      {needsJumuia && (
        <FormField label={t('members.jumuia')} htmlFor="jumuia" required error={errors.jumuia}>
          <Select id="jumuia" value={values.jumuia} onChange={setField('jumuia')}>
            <option value="">—</option>
            {jumuiaOptions.map((jumuia) => (
              <option key={jumuia.id} value={jumuia.id}>
                {jumuia.name}
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <FormField
        label={t('auth.password')}
        htmlFor="password"
        required={!editingUser}
        hint={editingUser ? t('users.passwordHint') : undefined}
        error={errors.password}
      >
        <Input id="password" type="password" required={!editingUser} value={values.password} onChange={setField('password')} />
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
