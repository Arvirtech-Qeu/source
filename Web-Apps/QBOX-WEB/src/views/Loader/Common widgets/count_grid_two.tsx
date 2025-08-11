import { StatCardTwo, StatCardTwoProps } from "./count_card_two"

interface StatGridTwoProps {
  items: any[]
}

export function StatGridTwo({ items }: StatGridTwoProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <StatCardTwo key={index} {...item} />
      ))}
    </div>
  )
}
