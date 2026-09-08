import { Baby, HeartHandshake, Sparkles, Users2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge, Card, CardBody } from '../../components/ui'
import { formatDate } from '../../utils/formatDate'

const ICONS = { BAPTISM: Baby, FIRST_COMMUNION: Sparkles, CONFIRMATION: HeartHandshake, MARRIAGE: Users2, OTHER: Sparkles }
const LABEL_KEYS = {
  BAPTISM: 'members.spiritual.baptism',
  FIRST_COMMUNION: 'members.spiritual.firstCommunion',
  CONFIRMATION: 'members.spiritual.confirmation',
  MARRIAGE: 'members.spiritual.marriage',
  OTHER: 'members.spiritual.other',
}

export default function SpiritualRecordCard({ record, onEdit }) {
  const { t } = useTranslation()
  const Icon = ICONS[record.milestone_type] || Sparkles
  const label = record.custom_label || t(LABEL_KEYS[record.milestone_type])

  return (
    <Card as="button" onClick={() => onEdit(record)} className="w-full text-left transition-shadow hover:shadow-[var(--shadow-warm-md)]">
      <CardBody className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{label}</p>
            <Badge variant={record.status === 'COMPLETED' ? 'success' : 'warning'}>
              {t(`members.spiritual.${record.status === 'COMPLETED' ? 'completed' : 'scheduled'}`)}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(record.date)}</p>
          {record.place && <p className="text-sm text-neutral-500 dark:text-neutral-400">{record.place}</p>}
        </div>
      </CardBody>
    </Card>
  )
}
