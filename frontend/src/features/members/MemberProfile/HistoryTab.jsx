import { ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Card, CardBody, EmptyState } from '../../../components/ui'
import { formatDate } from '../../../utils/formatDate'

export default function HistoryTab({ member }) {
  const { t } = useTranslation()
  const records = [...(member?.spiritual_records || [])].sort(
    (first, second) => new Date(second.date || second.created_at) - new Date(first.date || first.created_at),
  )

  if (records.length === 0) {
    return <EmptyState icon={ScrollText} title={t('members.spiritual.noRecords')} />
  }

  return (
    <ol className="space-y-3">
      {records.map((record) => (
        <li key={record.id}>
          <Card>
            <CardBody className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {record.custom_label || record.milestone_type_display}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(record.date || record.created_at)}
                  {record.place ? ` · ${record.place}` : ''}
                </p>
              </div>
              <Badge variant={record.status === 'COMPLETED' ? 'success' : 'warning'}>
                {t(`members.spiritual.${record.status === 'COMPLETED' ? 'completed' : 'scheduled'}`)}
              </Badge>
            </CardBody>
          </Card>
        </li>
      ))}
    </ol>
  )
}
