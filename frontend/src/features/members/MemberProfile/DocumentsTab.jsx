import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, Card, CardBody, EmptyState } from '../../../components/ui'
import { formatDate } from '../../../utils/formatDate'

export default function DocumentsTab({ member }) {
  const { t } = useTranslation()
  const documents = (member?.spiritual_records || []).filter((record) => record.supporting_document)

  if (documents.length === 0) {
    return <EmptyState icon={FileText} title={t('members.documents.noDocuments')} />
  }

  return (
    <div className="space-y-3">
      {documents.map((record) => (
        <Card key={record.id}>
          <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {record.custom_label || record.milestone_type_display}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatDate(record.date)}</p>
            </div>
            <Button as="a" href={record.supporting_document} target="_blank" rel="noreferrer" variant="outline" size="sm">
              <FileText className="h-4 w-4" />
              {t('members.documents.openDocument')}
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
