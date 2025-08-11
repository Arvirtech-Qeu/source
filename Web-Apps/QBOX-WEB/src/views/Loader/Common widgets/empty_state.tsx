import type React from "react"
import { FileText, type LucideIcon } from "lucide-react"
import NoData from '@assets/images/nodata.png';

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileText,
  title = "No Data Found",
  description = "Try adjusting your filters or selecting a different date range",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center  rounded-xl backdrop-blur-sm border border-gray-100 py-3 ${className}`}
    >
       <img src={NoData} alt="" className='w-64  animate-pulse'/>
      {/* <Icon className="h-16 w-16 text-gray-300 mb-4 animate-pulse" /> */}
      <h3 className="text-xl text-gray-300 mb-2">{title}</h3>
      {/* <p className="text-gray-500 text-center max-w-md">{description}</p> */}
    </div>
  )
}
