import { Card, CardBody, EmptyState } from '../../components/ui'

export default function PreviewSection({ id, title, icon, emptyTitle, tinted = false, items, renderItem }) {
  return (
    <section id={id} className={tinted ? 'bg-neutral-50 dark:bg-neutral-900/40' : ''}>
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <h2 className="mb-6 font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
        <Card>
          <CardBody>
            {items && items.length > 0 ? (
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li key={item.id || index} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0 dark:border-neutral-800">
                    {renderItem(item)}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={icon} title={emptyTitle} />
            )}
          </CardBody>
        </Card>
      </div>
    </section>
  )
}
