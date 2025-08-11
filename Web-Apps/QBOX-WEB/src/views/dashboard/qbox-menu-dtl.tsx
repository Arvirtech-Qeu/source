import { AlertCircle, Award, Search, Filter, RefreshCw, Package, TrendingUp, TrendingDown, CheckCircle, XCircle, Eye, Download, ChevronDown, X, Truck } from "lucide-react";
import React, { useState } from "react";

interface SkuDashboardItem {
    description: string;
    restaurantName: string;
    totalCount: number;
    inStockCount: number;
    soldCount: number;
    rejectedCount?: number;
    awaitingDeliveryCount?: number;
    deliveryCount?: number;
    partnerPurchaseOrderId: string;
}

interface Props {
    restaurantNames: string[];
    skuDashboardCountList: SkuDashboardItem[];
}

const QBoxMenuDtl: React.FC<Props> = (
    { restaurantNames, skuDashboardCountList }) => {
    const [restaurantFilter, setRestaurantFilter] = useState("");
    const [skuFilter, setSkuFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState("table");
    const [showFilters, setShowFilters] = useState(false);

    const filteredSkuDashboardCountList = skuDashboardCountList?.filter(item => {
        // Check if required properties exist and are strings
        if (!item.restaurantName || !item.description) {
            return false; // Skip items missing required properties
        }

        const matchesRestaurant = restaurantFilter === "" ||
            (typeof item.restaurantName === 'string' &&
                item.restaurantName.toLowerCase().includes(restaurantFilter.toLowerCase()));
        const matchesSku = typeof item.description === 'string' &&
            item.description.toLowerCase().includes(skuFilter.toLowerCase());
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "low-stock" && item.inStockCount < 20) ||
            (statusFilter === "out-of-stock" && item.inStockCount === 0) ||
            (statusFilter === "high-rejection" && (item.rejectedCount || 0) > 10);

        return matchesRestaurant && matchesSku && matchesStatus;
    });

    const resetFilters = () => {
        setRestaurantFilter("");
        setSkuFilter("");
        setStatusFilter("all");
    };

    const getStockStatus = (inStock: number, total: number) => {
        const percentage = (inStock / total) * 100;
        if (percentage === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800", icon: XCircle };
        if (percentage < 20) return { label: "Low Stock", color: "bg-orange-100 text-orange-800", icon: AlertCircle };
        return { label: "In Stock", color: "bg-green-100 text-green-800", icon: CheckCircle };
    };

    if (skuDashboardCountList?.length === 0) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center px-6 py-8">
                    <AlertCircle className="mx-auto mb-6 text-color" size={64} />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">No  Restaurant Orders Found</h3>
                    <p className="text-lg text-gray-600">There are currently No Restaurant Orders Found to display.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-2">
            <div className="max-w-8xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-color rounded-2xl shadow-lg">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Restaurant Purchase Order</h1>
                                <p className="text-gray-600 mt-2">Track your menu items across all restaurant locations</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-color rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-8">
                        {[
                            { title: "Total SKU", value: filteredSkuDashboardCountList.reduce((sum, item) => sum + item.totalCount, 0), icon: Package, color: "bg-blue-500", change: "+12%" },
                            { title: "Awaiting Delivery", value: filteredSkuDashboardCountList.reduce((sum, item) => sum + (item.awaitingDeliveryCount || 0), 0), icon: AlertCircle, color: "bg-orange-500", change: "+10%" },
                            { title: "Delivered To Store", value: filteredSkuDashboardCountList.reduce((sum, item) => sum + (item.deliveryCount || 0), 0), icon: Truck, color: "bg-yellow-500", change: "+10%" },
                            { title: "In Stock", value: filteredSkuDashboardCountList.reduce((sum, item) => sum + item.inStockCount, 0), icon: CheckCircle, color: "bg-green-500", change: "+8%" },
                            { title: "Delivered", value: filteredSkuDashboardCountList.reduce((sum, item) => sum + item.soldCount, 0), icon: TrendingUp, color: "bg-purple-500", change: "+15%" },
                            { title: "Rejected", value: filteredSkuDashboardCountList.reduce((sum, item) => sum + (item.rejectedCount || 0), 0), icon: XCircle, color: "bg-red-500", change: "-3%" }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} p-2 rounded-lg`}>
                                        <stat.icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters Section */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Menu Item</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search menu items..."
                                            value={skuFilter}
                                            onChange={(e) => setSkuFilter(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant</label>
                                    <select
                                        value={restaurantFilter}
                                        onChange={(e) => setRestaurantFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Restaurants</option>
                                        {restaurantNames.map((restaurant, index) => (
                                            <option key={index} value={restaurant}>{restaurant}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={resetFilters}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-color">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Menu Items Overview</h2>
                            <div className="text-md text-white">
                                Showing {filteredSkuDashboardCountList.length} of {skuDashboardCountList.length} items
                            </div>
                        </div>
                    </div>

                    {filteredSkuDashboardCountList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Menu Item</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Restaurant</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Total Sku</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Awaiting Delivery</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Delivered</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Current Stock</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Sold</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Rejected</th>
                                        {/* <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th> */}
                                        {/* <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredSkuDashboardCountList.map((item, index) => {
                                        const stockStatus = getStockStatus(item.inStockCount, item.totalCount);
                                        const StatusIcon = stockStatus.icon;

                                        return (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-md font-semibold text-gray-900">{item.partnerPurchaseOrderId}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                            <Award className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{item.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                        {item.restaurantName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-lg font-semibold text-gray-900">{item.totalCount}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-lg font-semibold text-gray-900">{item.awaitingDeliveryCount}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-lg font-semibold text-gray-900">{item.deliveryCount}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-lg font-semibold text-green-600">{item.inStockCount}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-lg font-semibold text-blue-600">{item.soldCount}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="text-lg font-semibold text-red-600">{item.rejectedCount || 0}</div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-gray-50">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <AlertCircle className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No Items Found
                            </h3>
                            <p className="text-gray-500 text-center mb-4">
                                No menu items match your current filters.<br />
                                Try adjusting your search criteria.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QBoxMenuDtl;
