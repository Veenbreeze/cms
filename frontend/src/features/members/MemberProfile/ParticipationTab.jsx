import { HeartHandshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '../../../components/ui'

export default function ParticipationTab() {
  const { t } = useTranslation()
  return <EmptyState icon={HeartHandshake} title={t('common.comingSoon')} />
}
