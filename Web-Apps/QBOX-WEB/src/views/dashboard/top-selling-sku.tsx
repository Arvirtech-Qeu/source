import { useState, useEffect, useMemo, useRef } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts"
import { Calendar, BarChart3, ArrowUpDown, ChevronDown, Filter, Clock, Search, MapPin, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@state/store"
import { getSkuSalesReport } from "@state/superAdminDashboardSlice"
import { getAllQboxEntities } from "@state/qboxEntitySlice"
import { toast } from "react-toastify"
import { Column, Table } from "@components/Table"
import { getFromLocalStorage } from "@utils/storage"
import { getAllDeliiveryPartner } from "@state/deliveryPartnerSlice"

// Define colors for charts
const COLORS = ["#7B68EE", "#FF4136", "#FF851B", "#0074D9", "#39CCCC", "#3D9970"]

interface SkuData {
    sku_code: string
    name: string
    restaurant: string
    entity: string
    area: string
    city: string
    state: string
    country: string
    total_sales: number
    last_sale_date: string
}

interface SkuReport {
    skus: SkuData[]
    start_date: string
    end_date: string
}

interface QboxEntity {
    qboxEntityName: string
}

interface TimeFilter {
    label: string
    value: string
    subFilters?: TimeFilter[]
}

interface CityFilter {
    label: string
    value: "top" | "low" | "all"
    limit?: number
}

interface SortFilter {
    label: string
    value: "top" | "low" | "all"
    limit?: number
}

interface EntitySortFilter {
    label: string
    value: "top" | "low" | "all"
    limit?: number
}

// Updated sorting options for entities
const entitySortFilters: EntitySortFilter[] = [
    { label: "All Entities", value: "all" },
    { label: "Top 5", value: "top", limit: 5 },
    { label: "Lowest 5", value: "low", limit: 5 },
]

// Renamed component for entity sort filter
const EntityFilterDropdown = ({ onSortChange }: { onSortChange: (filter: EntitySortFilter) => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<EntitySortFilter>(entitySortFilters[1]) // Changed to Top 5
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleFilterSelect = (filter: EntitySortFilter) => {
        setActiveFilter(filter)
        onSortChange(filter)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 text-color"
            >
                <BarChart3 className="w-4 h-4" />
                <span>{activeFilter.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                        {entitySortFilters.map((filter) => (
                            <button
                                key={filter.value}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activeFilter.value === filter.value ? "bg-gray-50" : ""
                                    }`}
                                onClick={() => handleFilterSelect(filter)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Updated function to sort entity data
const applyEntityFilter = (data: any[], filter: EntitySortFilter) => {
    const sortedData = [...data]
    switch (filter.value) {
        case "top":
            sortedData.sort((a, b) => b.value - a.value)
            return sortedData.slice(0, 5)
        case "low":
            sortedData.sort((a, b) => a.value - b.value)
            return sortedData.slice(0, 5)
        default:
            return sortedData
    }
}

const LocationPerformanceChart = ({ data }: { data: SkuData[] }) => {
    const [locationSortFilter, setLocationSortFilter] = useState<CityFilter>(cityFilters[1]) // Changed to Top 5

    // Group sales by city
    const citySales = useMemo(() => {
        const cityMap: Record<string, { sales: number; state: string; country: string }> = {}
        data.forEach((sku) => {
            const cityKey = `${sku.city}, ${sku.state}`
            if (cityMap[cityKey]) {
                cityMap[cityKey].sales += sku.total_sales
            } else {
                cityMap[cityKey] = {
                    sales: sku.total_sales,
                    state: sku.state,
                    country: sku.country,
                }
            }
        })
        return Object.keys(cityMap).map((city) => ({
            name: city,
            value: cityMap[city].sales,
            state: cityMap[city].state,
            country: cityMap[city].country,
        }))
    }, [data])

    // Apply sorting filter
    const sortedData = useMemo(() => {
        return applyEntityFilter(citySales, locationSortFilter)
    }, [citySales, locationSortFilter])

    return (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transform transition-all hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-color">Location Performance</h2>
                <div className="flex items-center gap-2">
                    <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-md text-sm font-medium">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Sales by City
                    </div>
                    <CityFilterDropdown
                        onSortChange={(filter) => {
                            setLocationSortFilter(filter)
                        }}
                    />
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sortedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barGap={8} barCategoryGap={16}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                        height={70}
                        angle={-45}
                        textAnchor="end"
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <Tooltip
                        cursor={{ fill: "rgba(255, 165, 0, 0.05)" }}
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            border: "none",
                            padding: "10px",
                        }}
                        formatter={(value, name, props) => [`${value} units`, `Sales in ${props.payload.name}`]}
                    />
                    <Bar
                        dataKey="value"
                        name="Total Sales"
                        barSize={30}
                        radius={[4, 4, 0, 0]}
                        fill="#FF8C00" // Orange color for locations
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

const cityFilters: CityFilter[] = [
    { label: "All cities", value: "all" },
    { label: "Top 5 Sold", value: "top", limit: 5 },
    { label: "Lowest 5 Sold", value: "low", limit: 5 },
]

// Add this new component for the sort filter
const CityFilterDropdown = ({ onSortChange }: { onSortChange: (filter: CityFilter) => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<CityFilter>(cityFilters[1]) // Changed to Top 5
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleFilterSelect = (filter: CityFilter) => {
        setActiveFilter(filter)
        onSortChange(filter)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 text-color"
            >
                <BarChart3 className="w-4 h-4" />
                <span>{activeFilter.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                        {cityFilters.map((filter) => (
                            <button
                                key={filter.value}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activeFilter.value === filter.value ? "bg-gray-50" : ""
                                    }`}
                                onClick={() => handleFilterSelect(filter)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Restaurant sort filters (keeping the original for restaurant chart)
const restaurantSortFilters: EntitySortFilter[] = [
    { label: "All Restaurants", value: "all" },
    { label: "Top 5", value: "top", limit: 5 },
    { label: "Lowest 5", value: "low", limit: 5 },
]

const RestaurantFilterDropdown = ({ onSortChange }: { onSortChange: (filter: EntitySortFilter) => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<EntitySortFilter>(restaurantSortFilters[1]) // Changed to Top 5
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleFilterSelect = (filter: EntitySortFilter) => {
        setActiveFilter(filter)
        onSortChange(filter)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 text-color"
            >
                <BarChart3 className="w-4 h-4" />
                <span>{activeFilter.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                        {restaurantSortFilters.map((filter) => (
                            <button
                                key={filter.value}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activeFilter.value === filter.value ? "bg-gray-50" : ""
                                    }`}
                                onClick={() => handleFilterSelect(filter)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Add these sorting options
const sortFilters: SortFilter[] = [
    { label: "All SKUs", value: "all" },
    { label: "Top 5 Sold", value: "top", limit: 5 },
    { label: "Lowest 5 Sold", value: "low", limit: 5 },
]

// Add this new component for the sort filter
const SortFilterDropdown = ({ onSortChange }: { onSortChange: (filter: SortFilter) => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<SortFilter>(sortFilters[1]) // Changed to Top 5
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleFilterSelect = (filter: SortFilter) => {
        setActiveFilter(filter)
        onSortChange(filter)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 text-color"
            >
                <BarChart3 className="w-4 h-4" />
                <span>{activeFilter.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                        {sortFilters.map((filter) => (
                            <button
                                key={filter.value}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activeFilter.value === filter.value ? "bg-gray-50" : ""
                                    }`}
                                onClick={() => handleFilterSelect(filter)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Generate monthly trend data based on the provided SKUs
const generateTrendData = (period: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    const quarters = ["Q1", "Q2", "Q3", "Q4"]

    const timePoints =
        period === "day" ? days : period === "month" ? months.slice(0, new Date().getMonth() + 1) : quarters

    return timePoints.map((point) => {
        const baseValue = Math.floor(Math.random() * 15) + 5
        const modifier = timePoints.indexOf(point) / timePoints.length + 0.5
        return {
            name: point,
            sales: Math.round(baseValue * modifier),
        }
    })
}

// Restaurant distribution data
const generateRestaurantData = (skus: SkuData[]) => {
    if (!skus || !Array.isArray(skus)) return []

    const restaurantMap: Record<string, number> = {}
    skus.forEach((sku) => {
        if (restaurantMap[sku.restaurant]) {
            restaurantMap[sku.restaurant] += sku.total_sales
        } else {
            restaurantMap[sku.restaurant] = sku.total_sales
        }
    })

    return Object.keys(restaurantMap).map((restaurant) => ({
        name: restaurant,
        value: restaurantMap[restaurant],
    }))
}

// Date range picker component
const DateRangePicker = ({
    startDate,
    endDate,
    onDateChange,
}: {
    startDate: string
    endDate: string
    onDateChange: (start: string, end: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [localStartDate, setLocalStartDate] = useState(startDate)
    const [localEndDate, setLocalEndDate] = useState(endDate)

    const handleApply = () => {
        onDateChange(localStartDate, localEndDate)
        setIsOpen(false)
    }

    const formatDateForDisplay = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center bg-white text-color border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
            >
                <Calendar className="w-4 h-4 mr-2" />
                {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
                <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-1 z-10 bg-white shadow-lg rounded-md border border-gray-200 p-4 w-72">
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                        <input
                            type="date"
                            className="w-full rounded-md border-gray-300 bg-gray-50 py-1 text-sm text-color"
                            value={localStartDate}
                            onChange={(e) => setLocalStartDate(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                        <input
                            type="date"
                            className="w-full rounded-md border-gray-300 bg-gray-50 py-1 text-sm text-color"
                            value={localEndDate}
                            onChange={(e) => setLocalEndDate(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-3 py-1 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-md bg-color"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Period filter component
const PeriodFilter = ({
    timePeriod,
    onChange,
}: {
    timePeriod: string
    onChange: (period: string) => void
}) => {
    return (
        <div className="flex rounded-md shadow-sm bg-white p-1 border border-color">
            <button
                onClick={() => onChange("day")}
                className={`px-4 py-2 rounded-md transition-all text-sm ${timePeriod === "day" ? "low-bg-color text-color font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
            >
                Daily
            </button>
            <button
                onClick={() => onChange("month")}
                className={`px-4 py-2 rounded-md transition-all text-sm ${timePeriod === "month" ? "low-bg-color text-color font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
            >
                Monthly
            </button>
            <button
                onClick={() => onChange("year")}
                className={`px-4 py-2 rounded-md transition-all text-sm ${timePeriod === "year" ? "low-bg-color text-color font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
            >
                Yearly
            </button>
        </div>
    )
}

const timeFilters: TimeFilter[] = [
    {
        label: "Today",
        value: "today",
        subFilters: [
            { label: "Today", value: "today" },
            { label: "Yesterday", value: "yesterday" },
            { label: "Last 3 Days", value: "last_3_days" },
        ],
    },
    {
        label: "This Month",
        value: "this_month",
        subFilters: [
            { label: "This Month", value: "this_month" },
            { label: "Last Month", value: "last_month" },
            { label: "Last 3 Months", value: "last_3_months" },
            { label: "Last 6 Months", value: "last_6_months" },
            { label: "Last 9 Months", value: "last_9_months" },
        ],
    },
    {
        label: "This Year",
        value: "this_year",
        subFilters: [
            { label: "This Year", value: "this_year" },
            { label: "Last Year", value: "last_year" },
        ],
    },
]

// Add this new component
const TimeFilterDropdown = ({ onFilterChange }: { onFilterChange: (filter: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<string>("This Year")
    const [activeMainFilter, setActiveMainFilter] = useState<TimeFilter>(timeFilters[0])
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleFilterSelect = (filter: TimeFilter, subFilter?: TimeFilter) => {
        const selectedFilter = subFilter || filter
        setActiveFilter(selectedFilter.value)
        setActiveMainFilter(filter)
        onFilterChange(selectedFilter.value)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 text-color"
            >
                <Clock className="w-4 h-4" />
                <span>{activeMainFilter.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                        {timeFilters.map((filter) => (
                            <div key={filter.value} className="relative group">
                                <button
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center text-color ${activeMainFilter.value === filter.value ? "bg-gray-50" : ""
                                        }`}
                                    onClick={() => handleFilterSelect(filter)}
                                >
                                    {filter.label}
                                    {filter.subFilters && <ChevronDown className="w-4 h-4" />}
                                </button>
                                {filter.subFilters && (
                                    <div className="absolute left-full top-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block hover:block text-color">
                                        <div className="py-1">
                                            {filter.subFilters.map((subFilter) => (
                                                <button
                                                    key={subFilter.value}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activeFilter === subFilter.value ? "bg-gray-50" : ""
                                                        }`}
                                                    onClick={() => handleFilterSelect(filter, subFilter)}
                                                >
                                                    {subFilter.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Entity filter component
const EntityFilter = ({
    entities,
    selectedEntity,
    onChange,
}: {
    entities: string[]
    selectedEntity: string | null
    onChange: (entity: string | null) => void
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50 w-48"
            >
                <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="truncate">{selectedEntity || "All Entities"}</span>
                </div>
                <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-10 bg-white shadow-lg rounded-md border border-gray-200 p-2 w-48 max-h-60 overflow-y-auto">
                    <button
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md ${!selectedEntity ? "bg-purple-50 text-purple-700" : ""
                            }`}
                        onClick={() => {
                            onChange(null)
                            setIsOpen(false)
                        }}
                    >
                        All Entities
                    </button>
                    {entities.map((entity) => (
                        <button
                            key={entity}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md ${selectedEntity === entity ? "bg-purple-50 text-purple-700" : ""
                                }`}
                            onClick={() => {
                                onChange(entity)
                                setIsOpen(false)
                            }}
                        >
                            {entity}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const SKUSalesDashboard = () => {
    const initialState: SkuReport = {
        skus: [],
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
    }

    const { topSkuSalesReportList } = useSelector((state: RootState) => state.dashboardSlice)
    const { qboxEntityList = [] } = useSelector((state: RootState) => state.qboxEntity)
    const { deliveryPartnerList = [] } = useSelector((state: RootState) => state.deliveryPartners)
    // Initialize filteredSkus with empty array
    const [filteredSkus, setFilteredSkus] = useState<SkuData[]>([])
    const [timePeriod, setTimePeriod] = useState("year")
    const [startDate, setStartDate] = useState(initialState.start_date)
    const [endDate, setEndDate] = useState(initialState.end_date)
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
    const [trendData, setTrendData] = useState(generateTrendData("year"))
    const [restaurantData, setRestaurantData] = useState<any[]>([])
    const [sortFilter, setSortFilter] = useState<SortFilter>(sortFilters[1]) // Changed to Top 5
    const [chartData, setChartData] = useState<SkuData[]>([])
    const [restaurantSortFilter, setRestaurantSortFilter] = useState<EntitySortFilter>(restaurantSortFilters[1]) // Changed to Top 5
    const [filteredRestaurantData, setFilteredRestaurantData] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10) // You can adjust this number
    const [error, setError] = useState<any>({})
    const [roleName, setRoleName]: any = useState(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
    const [selectedAggregator, setSelectedAggregator] = useState('');

    const dispatch = useDispatch<AppDispatch>()

    // useEffect(() => {
    //     const loadData = async () => {
    //         try {
    //             setIsLoading(true);
    //             setError(null);

    //             // Load user data
    //             const storedData = getFromLocalStorage('user');
    //             if (!storedData) {
    //                 throw new Error('No user data found');
    //             }

    //             const { roleId, loginDetails } = storedData;
    //             if (!roleId) {
    //                 throw new Error('Role ID is missing');
    //             }

    //             let currentRoleName = null;
    //             let currentDeliveryPartnerSno = null;

    //             if (loginDetails) {
    //                 currentRoleName = loginDetails.roleName || null;
    //                 currentDeliveryPartnerSno = loginDetails.deliveryPartnerSno || null;
    //                 setRoleName(currentRoleName);
    //                 setDeliveryPartnerSno(currentDeliveryPartnerSno);
    //             }

    //             // Dispatch API calls
    //             if (currentRoleName === 'Aggregator Admin' && currentDeliveryPartnerSno !== null) {
    //                 dispatch(getSkuSalesReport({ deliveryPartnerSno: currentDeliveryPartnerSno }));
    //             } else {
    //                 dispatch(getSkuSalesReport({}));
    //             }
    //             dispatch(getAllQboxEntities({}));
    //             dispatch(getAllDeliiveryPartner({}));

    //         } catch (err: any) {
    //             setError(err.message);
    //             console.error('Error loading data:', err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     loadData();
    // }, [dispatch]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load user data
                const storedData = getFromLocalStorage('user');
                if (!storedData) {
                    throw new Error('No user data found');
                }

                const { roleId, loginDetails } = storedData;
                if (!roleId) {
                    throw new Error('Role ID is missing');
                }

                let currentRoleName = null;
                let currentDeliveryPartnerSno = null;

                if (loginDetails) {
                    currentRoleName = loginDetails.roleName || null;
                    currentDeliveryPartnerSno = loginDetails.deliveryPartnerSno || null;
                    setRoleName(currentRoleName);
                    setDeliveryPartnerSno(currentDeliveryPartnerSno);
                }
                // Prepare API parameters
                const params: any = {};

                // If user is Aggregator Admin, automatically filter by their aggregator
                if (currentRoleName === 'Aggregator Admin' && currentDeliveryPartnerSno !== null) {
                    params.deliveryPartnerSno = currentDeliveryPartnerSno;
                    setSelectedAggregator(currentDeliveryPartnerSno);
                }

                // Dispatch API calls
                dispatch(getSkuSalesReport(params));
                dispatch(getAllQboxEntities({}));
                dispatch(getAllDeliiveryPartner({}));

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [dispatch]);

    // Safe calculation of total sales with null check
    const totalSales = filteredSkus?.reduce((sum, sku) => sum + (sku?.total_sales || 0), 0) || 0

    // Safe finding of top selling SKU
    const topSellingSku = useMemo(() => {
        if (!filteredSkus?.length) {
            return {
                name: "No data",
                total_sales: 0,
                sku_code: "",
                restaurant: "",
                entity: "",
                last_sale_date: "",
            }
        }
        return filteredSkus.reduce((prev, current) => (prev.total_sales > current.total_sales ? prev : current))
    }, [filteredSkus])

    const getPrimaryColor = () => {
        if (typeof window !== 'undefined') {
            const root = document.documentElement;
            return getComputedStyle(root).getPropertyValue('--primary-color').trim();
        }
        return '#7B68EE'; // Fallback color
    };

    const [lineColor, setLineColor] = useState('#7B68EE');

    useEffect(() => {
        const fetchColor = () => {
            const primaryColor = getPrimaryColor();
            setLineColor(primaryColor);
        };

        fetchColor();
        const observer = new MutationObserver(fetchColor);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (topSkuSalesReportList?.skus) {
            const initialSkus = topSkuSalesReportList.skus
            setFilteredSkus(initialSkus)

            // Apply initial Top 5 filter to chart data
            const initialChartData = applySortFilter(initialSkus, sortFilter)
            setChartData(initialChartData)

            const initialRestaurantData = generateRestaurantData(initialSkus)
            setRestaurantData(initialRestaurantData)

            // Apply initial Top 5 filter to restaurant data
            const initialFilteredRestaurantData = applyEntityFilter(initialRestaurantData, restaurantSortFilter)
            setFilteredRestaurantData(initialFilteredRestaurantData)

            setStartDate(topSkuSalesReportList.start_date)
            setEndDate(topSkuSalesReportList.end_date)
        }
    }, [topSkuSalesReportList])

    // Extract unique entities from Qbox entities
    const entities = [...new Set(qboxEntityList.map((entity: QboxEntity) => entity.qboxEntityName))]

    const handleDateChange = (newStartDate: string, newEndDate: string) => {
        setStartDate(newStartDate)
        setEndDate(newEndDate)
        setIsLoading(true)
        // Dispatch action with custom date range
        dispatch(
            getSkuSalesReport({
                time_period: "custom",
                start_date: newStartDate,
                end_date: newEndDate,
            }),
        )
            .then((response) => {
                // Check if response has data and update filtered skus
                if (response?.payload?.skus) {
                    setFilteredSkus(response.payload.skus)
                    setChartData(response.payload.skus)
                    setRestaurantData(generateRestaurantData(response.payload.skus))
                } else {
                    setFilteredSkus([])
                    setChartData([])
                    setRestaurantData([])
                }
                setIsLoading(false)
                // Apply any additional filters if needed
                if (searchTerm || selectedEntity) {
                    applyFilters(searchTerm, selectedEntity, newStartDate, newEndDate)
                }
            })
            .catch((error) => {
                console.error("Error fetching SKU sales report:", error)
                setFilteredSkus([])
                setChartData([])
                setRestaurantData([])
                setIsLoading(false)
                toast.error("Failed to fetch sales data")
            })
    }

    // Handle time period change
    const handleTimePeriodChange = (period: string) => {
        setTimePeriod(period)
        setTrendData(generateTrendData(period))
    }

    const applyFilters = (search: string, entity: string | null, start = startDate, end = endDate) => {
        setIsLoading(true)
        setTimeout(() => {
            // Check if skus exists and is an array
            if (!topSkuSalesReportList?.skus || !Array.isArray(topSkuSalesReportList.skus)) {
                setFilteredSkus([])
                setIsLoading(false)
                return
            }

            try {
                let filtered = [...topSkuSalesReportList.skus]

                // Apply search filter
                if (search) {
                    filtered = filtered.filter(
                        (sku) =>
                            (sku.name || "").toLowerCase().includes(search.toLowerCase()) ||
                            (sku.sku_code || "").toLowerCase().includes(search.toLowerCase()) ||
                            (sku.restaurant || "").toLowerCase().includes(search.toLowerCase()),
                    )
                }

                // Apply entity filter
                if (entity) {
                    filtered = filtered.filter((sku) => sku.entity === entity)
                }

                setFilteredSkus(filtered)
            } catch (error) {
                console.error("Error applying filters:", error)
                setFilteredSkus([])
            } finally {
                setIsLoading(false)
            }
        }, 500)
    }

    // Also update the useEffect dependency array
    useEffect(() => {
        if (topSkuSalesReportList?.skus) {
            applyFilters(searchTerm, selectedEntity)
        }
    }, [searchTerm, selectedEntity, topSkuSalesReportList?.skus])

    const handleTimeFilterChange = (filterValue: string) => {
        setIsLoading(true)
        dispatch(getSkuSalesReport({ time_period: filterValue }))
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false))
    }

    const applySortFilter = (skus: SkuData[], filter: SortFilter) => {
        const sortedSkus = [...skus]
        switch (filter.value) {
            case "top":
                sortedSkus.sort((a, b) => b.total_sales - a.total_sales)
                return sortedSkus.slice(0, 5)
            case "low":
                sortedSkus.sort((a, b) => a.total_sales - b.total_sales)
                return sortedSkus.slice(0, 5)
            default:
                return sortedSkus
        }
    }

    // Fixed EntityPerformanceChart component
    const EntityPerformanceChart = ({ data }: { data: SkuData[] }) => {
        const [entitySortFilter, setEntitySortFilter] = useState<EntitySortFilter>(entitySortFilters[1]) // Changed to Top 5

        // Group sales by entity
        const entitySales = useMemo(() => {
            const entityMap: Record<string, number> = {}
            data.forEach((sku) => {
                if (entityMap[sku.entity]) {
                    entityMap[sku.entity] += sku.total_sales
                } else {
                    entityMap[sku.entity] = sku.total_sales
                }
            })
            return Object.keys(entityMap).map((entity) => ({
                name: entity,
                value: entityMap[entity],
            }))
        }, [data])

        // Apply sorting filter
        const sortedData = useMemo(() => {
            return applyEntityFilter(entitySales, entitySortFilter)
        }, [entitySales, entitySortFilter])

        return (
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transform transition-all hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-color">Delivery Location Performance</h2>
                    <div className="flex items-center gap-2">
                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm font-medium">Sales by Entity</div>
                        <EntityFilterDropdown
                            onSortChange={(filter) => {
                                setEntitySortFilter(filter)
                            }}
                        />
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={sortedData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        barGap={8}
                        barCategoryGap={16}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            height={70}
                            angle={-45}
                            textAnchor="end"
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                        <Tooltip
                            cursor={{ fill: "rgba(123, 104, 238, 0.05)" }}
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "0.5rem",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                border: "none",
                                padding: "10px",
                            }}
                            formatter={(value) => [`${value} units`, "Sales"]}
                        />
                        <Bar
                            dataKey="value"
                            name="Total Sales"
                            barSize={30}
                            radius={[4, 4, 0, 0]}
                            fill="#4CAF50" // Green color for entities
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    const skuTableColumns: Column<SkuData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            width: '5%',
        },
        {
            key: 'name',
            header: 'SKU Name',
            sortable: true,
            width: '20%',
        },
        {
            key: 'sku_code',
            header: 'SKU Code',
            sortable: true,
            width: '15%',
        },
        {
            key: 'restaurant',
            header: 'Restaurant',
            sortable: true,
            width: '15%',
        },
        {
            key: 'entity',
            header: 'Delivery Location',
            sortable: true,
            width: '15%',
        },
        {
            key: 'total_sales',
            header: 'Total Sales',
            sortable: true,
            width: '10%',
            render: (row) => <span className="font-medium">{row.total_sales}</span>,
        },
        {
            key: 'last_sale_date',
            header: 'Last Sale',
            sortable: true,
            width: '15%',
            render: (row) => (
                new Date(row.last_sale_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
            ),
        },
    ];

    // Reset all filters
    const handleResetFilters = () => {
        setSelectedAggregator('');
        // Reset to default date range (you may want to adjust this)
        const defaultStart = new Date();
        defaultStart.setMonth(defaultStart.getMonth() - 1);
        setStartDate(defaultStart.toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);

        // Fetch data with reset filters
        // dispatch(getSkuSalesReport({
        //     start_date: defaultStart.toISOString().split('T')[0],
        //     end_date: new Date().toISOString().split('T')[0],
        //     time_period: "custom"
        // }))
        dispatch(getSkuSalesReport({}))
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    };

    const handleApplyFilters = (aggregatorId = selectedAggregator) => {
        setIsLoading(true);

        // Prepare filter parameters
        const params: any = {
            start_date: startDate,
            end_date: endDate,
            time_period: "custom"
        };

        // Add aggregator filter if selected
        if (aggregatorId) {
            params.deliveryPartnerSno = Number(aggregatorId);
        }

        dispatch(getSkuSalesReport(params))
            .then((response) => {
                if (response?.payload?.skus) {
                    setFilteredSkus(response.payload.skus);
                    setChartData(response.payload.skus);
                    setRestaurantData(generateRestaurantData(response.payload.skus));
                } else {
                    setFilteredSkus([]);
                    setChartData([]);
                    setRestaurantData([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching filtered data:", error);
                toast.error("Failed to apply filters");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-2 md:p-6">
            {/* Header */}
            <div className="bg-color rounded-xl shadow-lg p-6 mb-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">SKU Sales Dashboard</h1>
                        <p className="mt-1 opacity-90">Monitor and analyze SKU performance</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                        <TimeFilterDropdown onFilterChange={handleTimeFilterChange} />
                        <DateRangePicker startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
                    {/* Aggregator Filter */}
                    {/* Aggregator Filter - Only show for non-Aggregator Admin roles */}
                    {roleName !== 'Aggregator Admin' && (
                        <>
                            <div className="w-full md:w-auto">
                                <label htmlFor="aggregator-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                    Filter by Aggregator
                                </label>
                                <select
                                    id="aggregator-filter"
                                    className="block pl-3 w-full md:w-[250px] lg:w-[250px] py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                                    value={selectedAggregator}
                                    onChange={(e) => {
                                        setSelectedAggregator(e.target.value);
                                        handleApplyFilters(e.target.value);
                                    }}
                                >
                                    <option value="">All Aggregators</option>
                                    {deliveryPartnerList?.map((agg) => (
                                        <option key={agg.deliveryPartnerSno} value={agg.deliveryPartnerSno}>
                                            {agg.partnerName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Reset Button */}
                            <div className="w-full md:w-auto flex items-end gap-2 mt-5">
                                {/* Reset Button */}
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    onClick={handleResetFilters}
                                >
                                    <RefreshCcw className="h-5 w-5 mr-2 text-gray-500" />
                                    Reset
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* </div> */}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                <div className="low-bg-color border border-color rounded-xl shadow-md p-6 text-white flex items-center justify-between transform transition-all hover:scale-105 duration-300">
                    <div>
                        <p className="text-sm opacity-80 text-black">Total SKUs</p>
                        <h2 className="text-3xl font-bold text-color">{topSkuSalesReportList?.skus?.length || 0}</h2>
                        <p className="text-sm mt-1 text-black">Unique products</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full p-3 low-bg-color">
                        <Filter className="w-12 h-12 opacity-90 text-color" />
                    </div>
                </div>

                <div className="low-bg-color border border-color rounded-xl shadow-md p-6 text-white flex items-center justify-between transform transition-all hover:scale-105 duration-300">
                    <div>
                        <p className="text-sm opacity-80 text-black">Total Sales</p>
                        <h2 className="text-3xl font-bold text-color">{totalSales}</h2>
                        <p className="text-sm mt-1 text-black">Units sold</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full p-3 low-bg-color">
                        <BarChart3 className="w-12 h-12 opacity-90 text-color" />
                    </div>
                </div>

                <div className="low-bg-color border border-color rounded-xl shadow-md p-6 text-white flex items-center justify-between transform transition-all hover:scale-105 duration-300">
                    <div>
                        <p className="text-sm opacity-80 text-black">Top Performer</p>
                        <h2 className="text-xl font-bold text-color">{topSellingSku.name}</h2>
                        <p className="text-sm mt-1 text-black">{topSellingSku.total_sales} units sold</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full p-3 low-bg-color">
                        <ArrowUpDown className="w-12 h-12 opacity-90 text-color" />
                    </div>
                </div>
            </div>

            {/* Sales Trend Chart */}
            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transform transition-all hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Sales Trend</h2>
                        <PeriodFilter timePeriod={timePeriod} onChange={handleTimePeriodChange} />
                        <div className="low-bg-color text-color px-3 py-1 rounded-md text-sm font-medium">
                            {timePeriod === "day" ? "Daily" : timePeriod === "month" ? "Monthly" : "Quarterly"}
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color"></div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "0.5rem",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                        border: "none",
                                        padding: "10px",
                                    }}
                                    formatter={(value) => [`${value} units`, "Sales"]}
                                />
                                <Line

                                    type="monotone"
                                    dataKey="sales"
                                    stroke={lineColor}
                                    strokeWidth={3}
                                    dot={{ stroke: lineColor, strokeWidth: 2, r: 4, fill: "white" }}
                                    activeDot={{ stroke: lineColor, strokeWidth: 2, r: 6, fill: "white" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* SKU Performance Chart & Restaurant Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">


                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transform transition-all hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-color">SKU Performance</h2>
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">Sales by SKU</div>
                            <SortFilterDropdown
                                onSortChange={(filter) => {
                                    setSortFilter(filter)
                                    const chartData = applySortFilter(filteredSkus, filter)
                                    setChartData(chartData) // Add this new state for chart data
                                }}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={chartData} // Use chartData instead of filteredSkus
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                barGap={8}
                                barCategoryGap={16}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#6B7280" }}
                                    height={70}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                                <Tooltip
                                    cursor={{ fill: "rgba(123, 104, 238, 0.05)" }}
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "0.5rem",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                        border: "none",
                                        padding: "10px",
                                    }}
                                    formatter={(value) => [`${value} units`, "Sales"]}
                                />
                                <Bar dataKey="total_sales" name="Total Sales" barSize={30} radius={[4, 4, 0, 0]} fill="#7B68EE" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 transform transition-all hover:shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-color">Restaurant Performance</h2>
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
                                Sales by Restaurant
                            </div>
                            <RestaurantFilterDropdown
                                onSortChange={(filter) => {
                                    setRestaurantSortFilter(filter)
                                    const filtered = applyEntityFilter(restaurantData, filter)
                                    setFilteredRestaurantData(filtered)
                                }}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center justify-center">
                            <ResponsiveContainer width="100%" height={300} className="mb-4 md:mb-0">
                                <PieChart>
                                    <Pie
                                        data={filteredRestaurantData.length > 0 ? filteredRestaurantData : restaurantData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        innerRadius={60}
                                        paddingAngle={2}
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {(filteredRestaurantData.length > 0 ? filteredRestaurantData : restaurantData).map(
                                            (entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ),
                                        )}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [`${value} units`, name]}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            borderRadius: "0.5rem",
                                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                            border: "none",
                                            padding: "10px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
                <EntityPerformanceChart data={filteredSkus} />
                <LocationPerformanceChart data={filteredSkus} />
            </div>

            {/* SKU Table */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">SKU Details</h2>
                    <div className="text-sm text-gray-500">
                        Showing {filteredSkus.length} of {topSkuSalesReportList?.skus?.length || 0} SKUs
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table<SkuData>
                            columns={skuTableColumns}
                            data={filteredSkus}
                            rowsPerPage={10}
                            loading={isLoading}
                            // rowKey="sku_code"
                            noDataMessage="No SKUs found matching your criteria"
                            className="rounded-lg"
                            globalSearch={true}
                            pageSizeOptions={[5, 10, 20, 50]}
                            // initialSortKey="total_sales"  // Optional: Default sort by total sales
                            // initialSortDirection="desc"   // Optional: Default sort descending
                            onRowClick={(row) => {
                                console.log('Row clicked:', row);
                            }}
                        />

                    </div>
                )}
            </div>
        </div>
    )
}

export default SKUSalesDashboard