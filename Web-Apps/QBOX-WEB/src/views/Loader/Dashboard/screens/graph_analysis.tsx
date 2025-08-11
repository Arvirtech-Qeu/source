"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Medal, RefreshCcw, TrendingUp, X } from "lucide-react"
import DeliveryAgentsGrid from "@view/Loader/Common widgets/agent_grid"
import { BarChart } from "recharts"
import DashboardGraph from "./trending_chartbar"
import Download from '@assets/images/cloud.png';
import Legend from '@assets/images/legend.png';
import { useTheme } from "@view/Loader/Theme Settings/theme_provider"

export default function GraphAndAnalysis() {

  const [selectedRegion, setSelectedRegion] = useState("South Region")
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)

  const regions = ["South Region", "North Region", "East Region", "West Region"]

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="space-y-6">
        <DashboardGraph />
      </div>
    </div>
  )
}
