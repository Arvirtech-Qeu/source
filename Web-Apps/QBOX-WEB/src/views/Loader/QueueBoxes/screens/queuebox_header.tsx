import { StatGridTwo } from "@view/Loader/Common widgets/count_grid_two";
import { FilterOption } from "@view/Loader/Common widgets/order_summary_table";
import { Package, ShoppingCart, AlertTriangle, Users, ChevronDown, Search, Calendar, Filter, Upload } from "lucide-react"
import { useState } from "react";


export default function QueueBoxPage() {
  const statItems = [
    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'

    },

    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'
    },
    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'

    },

    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'
    },
    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Warning",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'

    },

    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'
    },
    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'

    },

    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'
    },
    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Critical",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'

    },

    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'
    },
    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'

    },

    {
      title: "Hotbox #1243",
      value: "Temperature : 65°F | Battery : 87%",
      description: "",
      icon: ShoppingCart, // Assuming ShoppingCart is imported and a valid LucideIcon
      iconColor: "bg-red-100",
      valueColor: "text-red-500",
      status: "Active",
      primaryButtonText: "View Hotbox",
      secondaryButtonText: "Track",
      primaryButtonHandler: () => console.log("Restock"),
      secondaryButtonHandler: () => console.log("Restock"),
      valueFontSize: 'sm'
    },
  ];

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const renderFilterOption = (filter: FilterOption) => {
    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id}>
            <button
              className="w-[250px] justify-between flex items-center px-4 py-2 border rounded-lg text-gray-600 focus:outline-none"
            >
              <span>{filter.label}</span>
              <ChevronDown className="ml-2" />
            </button>
          </div>
        );
      case 'status':
        return (
          <div key={filter.id}>
            <button
              className="w-[250px] justify-between flex items-center px-4 py-2 border rounded-lg text-gray-600 focus:outline-none"
            >
              <span>{filter.label}</span>
              <ChevronDown className="ml-2" />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const filterOptions: FilterOption[] = [
    {
      id: 'region',
      label: 'South Region',
      type: 'select',
      options: ['South Region', 'North Region', 'East Region', 'West Region']
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'daterange'
    },
    {
      id: 'status',
      label: 'Status',
      type: 'status',
      options: ['All', 'Pending', 'Awaiting Delivery', 'Order Fulfilled', 'Rejected']
    }
  ];

  return (
    <div className="p-10">
      <div className="py-8 flex justify-between">
        <h1 className="font-bold text-lg">Active Hotboxes</h1>
        {/* <button className="bg-color rounded-lg px-4 py-2 text-white ">Add new Hotbox</button> */}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:border-none focus:ring-1 focus:ring-red-500"
              placeholder="Search by name, ID or category"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filters */}
          {filterOptions.map(filter => (
            <div key={filter.id}>
              {renderFilterOption(filter)}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="py-3 px-3 border rounded-full">
            <Filter size={18} className="text-color" />
          </button>

          <button className="py-3 px-3 border rounded-full">
            <Upload size={18} className="text-color" />
          </button>
        </div>
      </div>
      <div className="py-8">
        <StatGridTwo items={statItems} />
      </div>
    </div>
  )
}
