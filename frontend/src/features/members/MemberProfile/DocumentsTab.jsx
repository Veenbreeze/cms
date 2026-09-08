import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '../../../components/ui'

export default function DocumentsTab() {
  const { t } = useTranslation()
  return <EmptyState icon={FileText} title={t('common.comingSoon')} />
}
