import { cn } from '../../utils/cn'

/**
 * Renders a normal table on md+ screens. Below that, each row becomes a
 * label/value card instead of forcing horizontal scroll on a cramped table —
 * per the "no unnecessary horizontal scroll on mobile" requirement.
 */
export default function ResponsiveTable({ columns, rows, keyField = 'id', onRowClick, emptyState }) {
  if (!rows || rows.length === 0) {
    return emptyState || null
  }

  return (
    <div>
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[keyField]}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-neutral-100 last:border-0 dark:border-neutral-800/60',
                onRowClick && 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
              )}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-neutral-800 dark:text-neutral-200">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <div
            key={row[keyField]}
            onClick={() => onRowClick?.(row)}
            className={cn(
              'rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900',
              onRowClick && 'cursor-pointer active:bg-neutral-50 dark:active:bg-neutral-800/40'
            )}
          >
            {columns.map((column) => (
              <div key={column.key} className="flex items-center justify-between gap-3 py-1 text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">{column.header}</span>
                <span className="text-right text-neutral-800 dark:text-neutral-200">
                  {column.render ? column.render(row) : row[column.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
