import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Select } from '../../../../components/ui'
import { useAuth } from '../../../../context/AuthContext'
import { listJumuia } from '../../../../services/api/jumuiaService'
import { suggestJumuia } from '../../../../services/api/memberService'
import { JUMUIA_SCOPED_ROLES } from '../../../../utils/roles'

export default function ChurchInfoStep({ values, errors, onChange }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [jumuiaOptions, setJumuiaOptions] = useState([])
  const isJumuiaLocked = JUMUIA_SCOPED_ROLES.includes(user?.role)

  useEffect(() => {
    if (!isJumuiaLocked) {
      listJumuia().then((res) => setJumuiaOptions(res.results))
    }
  }, [isJumuiaLocked])

  const handleSuggest = async () => {
    const suggestion = await suggestJumuia()
    onChange('jumuia', suggestion.id)
  }

  return (
    <div className="space-y-4">
      <FormField label={t('members.jumuia')} htmlFor="jumuia" required error={errors.jumuia} hint={!isJumuiaLocked && t('members.suggestJumuiaHint')}>
        {isJumuiaLocked ? (
          <Input value={user?.jumuia_name || ''} disabled />
        ) : (
          <div className="flex gap-2">
            <Select id="jumuia" required value={values.jumuia} onChange={(e) => onChange('jumuia', e.target.value)}>
              <option value="">—</option>
              {jumuiaOptions.map((jumuia) => (
                <option key={jumuia.id} value={jumuia.id}>
                  {jumuia.name}
                </option>
              ))}
            </Select>
            <Button type="button" variant="outline" size="md" onClick={handleSuggest} className="shrink-0">
              <Sparkles className="h-4 w-4" />
              {t('members.suggestJumuia')}
            </Button>
          </div>
        )}
      </FormField>

      <FormField label={t('members.dateJoinedChurch')} htmlFor="date_joined_church" error={errors.date_joined_church}>
        <Input
          id="date_joined_church"
          type="date"
          value={values.date_joined_church}
          onChange={(e) => onChange('date_joined_church', e.target.value)}
        />
      </FormField>
    </div>
  )
}
