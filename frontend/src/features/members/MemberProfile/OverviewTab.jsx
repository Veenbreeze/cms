import { useTranslation } from 'react-i18next'

import { Card, CardBody } from '../../../components/ui'
import { formatDate } from '../../../utils/formatDate'

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-neutral-100 py-2.5 text-sm last:border-0 dark:border-neutral-800">
      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="font-medium text-neutral-800 dark:text-neutral-100">{value || '—'}</span>
    </div>
  )
}

export default function OverviewTab({ member }) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <InfoRow label={t('common.phone')} value={member.phone} />
        <InfoRow label={t('common.email')} value={member.email} />
        <InfoRow label={t('members.residentialAddress')} value={member.residential_address} />
        <InfoRow label={t('members.emergencyContact')} value={member.emergency_contact_name && `${member.emergency_contact_name} (${member.emergency_contact_phone || '—'})`} />
        <InfoRow label={t('members.jumuia')} value={member.jumuia_name} />
        <InfoRow label={t('members.dateOfBirth')} value={formatDate(member.date_of_birth)} />
        <InfoRow label={t('members.dateJoinedChurch')} value={formatDate(member.date_joined_church)} />
      </CardBody>
    </Card>
  )
}
