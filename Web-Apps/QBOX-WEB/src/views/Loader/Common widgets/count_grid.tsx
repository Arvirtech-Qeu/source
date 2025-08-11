import { StatCard, StatCardProps } from "./count_card"

interface StatGridProps {
  items: StatCardProps[]
}

export function StatGrid({ items }: StatGridProps) {

  console.log('items', items)
  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    //   {items.map((item, index) => (
    //     <StatCard key={index} {...item} />
    //   ))}
    // </div>
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${items.length > 5
        ? 'lg:grid-cols-6'
        : items.length > 3
          ? 'lg:grid-cols-4'
          : 'lg:grid-cols-3'
        } gap-4`}
    >

      {items.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>

  )
}
