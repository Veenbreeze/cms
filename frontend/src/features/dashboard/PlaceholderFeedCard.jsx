import { Card, CardBody, CardHeader, EmptyState } from '../../components/ui'

export default function PlaceholderFeedCard({ title, icon, emptyTitle, emptyDescription, items, renderItem }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-display text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      </CardHeader>
      <CardBody>
        {items && items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={item.id || index}>{renderItem(item)}</li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
        )}
      </CardBody>
    </Card>
  )
}
