import { ScrollText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '../../../components/ui'

export default function HistoryTab() {
  const { t } = useTranslation()
  return <EmptyState icon={ScrollText} title={t('common.comingSoon')} />
}
