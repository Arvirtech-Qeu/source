import React, { useMemo, useState } from "react";
import {
  AlertCircle, Package, Search, Filter, ChevronDown, RefreshCw, X,
  Grid3X3, List, Eye, EyeOff, BarChart3, TrendingUp, Building2,
  Box, ChevronRight, ArrowUpDown, SortAsc, SortDesc,
  Clock
} from "lucide-react";

// Mock MasterCard component
interface MasterCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MasterCard: React.FC<MasterCardProps> = ({
  children,
  className = "",
  onClick
}) => (
  <div
    className={`rounded-xl border border-gray-200 shadow-sm ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

interface SkuDetail {
  uniqueCode: string;
  hotboxEntryTime: string;
  qboxLoadTime: string | null;
  currentStatus: string;
  timeInHotbox: string;
}

interface SkuItem {
  skuCode: string;
  description: string;
  hotBoxCount: number;
  skuDetails?: SkuDetail[];
}

interface Hotel {
  restaurantName?: string;
  skuList: SkuItem[];
}

interface Props {
  purchaseOrdersDashboardList: any[];
  getHotboxCountList: {
    hotboxCounts: Hotel[];
  };
}

interface GroupedSkuData {
  skuCode: string;
  description: string;
  restaurants: {
    name?: string;
    count: number;
  }[];
  totalCount: number;
  avgCount: number;
  skuDetails: SkuDetail[];
}

const InventoryBoxDtl: React.FC<Props> = ({ purchaseOrdersDashboardList, getHotboxCountList }) => {

  const [skuNameFilter, setSkuNameFilter] = useState("");
  const [restaurantFilter, setRestaurantFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grouped' | 'table' | 'cards'>('grouped');
  const [expandedSkus, setExpandedSkus] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'totalCount' | 'restaurants'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const mockData = getHotboxCountList?.hotboxCounts;
  const [selectedSku, setSelectedSku] = useState<GroupedSkuData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Group SKUs across all restaurants
  const groupedSkuData = useMemo(() => {
    const skuMap = new Map<string, GroupedSkuData>();

    mockData?.forEach(hotel => {
      if (!hotel.restaurantName?.toLowerCase().includes(restaurantFilter.toLowerCase()) && restaurantFilter) {
        return;
      }

      hotel.skuList.forEach(sku => {
        if (!sku.description?.toLowerCase().includes(skuNameFilter.toLowerCase()) && skuNameFilter) {
          return;
        }

        const key = sku.skuCode;
        if (!skuMap.has(key)) {
          skuMap.set(key, {
            skuCode: sku.skuCode,
            description: sku.description,
            restaurants: [],
            totalCount: 0,
            avgCount: 0,
            skuDetails: []
          });
        }

        const skuData = skuMap.get(key);
        if (skuData) {
          // Add restaurant info
          skuData.restaurants.push({
            name: hotel.restaurantName,
            count: sku.hotBoxCount
          });

          // Update counts
          skuData.totalCount += sku.hotBoxCount;
          skuData.avgCount = Math.round(skuData.totalCount / skuData.restaurants.length);

          // Add skuDetails without duplicates
          if (sku.skuDetails) {
            const existingCodes = new Set(skuData.skuDetails.map(d => d.uniqueCode));
            sku.skuDetails.forEach(newDetail => {
              if (!existingCodes.has(newDetail.uniqueCode)) {
                skuData.skuDetails.push(newDetail);
                existingCodes.add(newDetail.uniqueCode);
              }
            });
          }
        }
      });
    });

    // Sorting logic
    const groupedArray = Array.from(skuMap.values());
    return groupedArray.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name': comparison = a.description.localeCompare(b.description); break;
        case 'totalCount': comparison = a.totalCount - b.totalCount; break;
        case 'restaurants': comparison = a.restaurants.length - b.restaurants.length; break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [mockData, restaurantFilter, skuNameFilter, sortBy, sortOrder]);

  const toggleSkuExpansion = (skuCode: string) => {
    const newExpanded = new Set(expandedSkus);
    if (newExpanded.has(skuCode)) {
      newExpanded.delete(skuCode);
    } else {
      newExpanded.add(skuCode);
    }
    setExpandedSkus(newExpanded);
  };

  const handleSort = (field: 'name' | 'totalCount' | 'restaurants') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Calculate stats
  const totalSkus = groupedSkuData?.length || 0;
  const totalRestaurants = new Set(mockData?.map(h => h.restaurantName)).size;
  const totalBoxes = groupedSkuData?.reduce((acc, sku) => acc + sku.totalCount, 0) || 0;

  const getStockLevelColor = (count: number) => {
    if (count >= 20) return 'bg-green-100 text-green-800 border-green-200';
    if (count >= 10) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStockLevelText = (count: number) => {
    if (count >= 20) return 'High Stock';
    if (count >= 10) return 'Medium Stock';
    return 'Low Stock';
  };

  const handleSkuClick = (sku: GroupedSkuData) => {
    setSelectedSku(sku);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedSku(null);
  };

  if (!mockData || mockData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="text-center px-6 py-8">
          <AlertCircle className="mx-auto mb-6 text-color" size={64} />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Inventory Box Found</h3>
          <p className="text-lg text-gray-600">There are currently no Inventory Box Found to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-color rounded-2xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Inventory Box Stock</h1>
                <p className="text-gray-600 mt-2">Grouped view of all SKUs across restaurants</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setRestaurantFilter("");
                  setSkuNameFilter("");
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('grouped')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'grouped' ? 'bg-white text-color shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid3X3 className="w-4 h-4 mr-1 inline" />
                  Grouped
                </button>
                <button
                  onClick={() => setView('table')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'table' ? 'bg-white text-color shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4 mr-1 inline" />
                  Table
                </button>
              </div>

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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Dish / Menu Item</p>
                  <p className="text-2xl font-bold text-blue-900">{totalSkus}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Restaurants</p>
                  <p className="text-2xl font-bold text-green-900">{totalRestaurants}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Sku's</p>
                  <p className="text-2xl font-bold text-purple-900">{totalBoxes}</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Box className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">Restaurant Filter</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={restaurantFilter}
                      onChange={(e) => setRestaurantFilter(e.target.value)}
                      placeholder="Search restaurants..."
                      className="w-full pl-12 pr-12 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {restaurantFilter && (
                      <button
                        onClick={() => setRestaurantFilter("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">SKU Filter</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={skuNameFilter}
                      onChange={(e) => setSkuNameFilter(e.target.value)}
                      placeholder="Search SKU items..."
                      className="w-full pl-12 pr-12 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {skuNameFilter && (
                      <button
                        onClick={() => setSkuNameFilter("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        {view === 'grouped' ? (
          // Grouped View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groupedSkuData.length > 0 ? (
              groupedSkuData.map((skuData) => (
                <MasterCard
                  key={skuData.skuCode}
                  className="bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Header with SKU Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-color rounded-lg">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{skuData.description}</h3>
                          <p className="text-sm text-gray-500">SKU: {skuData.skuCode}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-600 text-sm font-medium">Restaurants</p>
                        <p className="text-2xl font-bold text-blue-900">{skuData.restaurants.length}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-purple-600 text-sm font-medium">Total Boxes</p>
                        <p className="text-2xl font-bold text-purple-900">{skuData.totalCount}</p>
                      </div>
                    </div>

                    {/* Sample Restaurant */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 low-bg-color rounded-lg">
                        <Building2 className="w-4 h-4 text-color" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {skuData.restaurants[0]?.name || 'No restaurant assigned'}
                      </span>
                    </div>

                    {/* View Details Button */}
                    <div className="mt-auto">
                      <button
                        onClick={() => handleSkuClick(skuData)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 low-bg-color hover:bg-blue-100 text-color font-medium rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </MasterCard>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No SKUs Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No SKUs match your current search criteria. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Table View
          <MasterCard className="bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-color">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">SKU Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">SKU Code</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">Restaurants</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">Total Boxes</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedSkuData.map((skuData, index) => (
                    <tr key={skuData.skuCode} className={`border-b border-gray-100 hover:low-bg-color transition-colors ${index % 2 === 0 ? 'bg-white' : 'low-bg-color'}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{skuData.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{skuData.skuCode}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {skuData.restaurants.map((restaurant, idx) => (
                          <div key={idx} className="mb-1 last:mb-0">
                            {restaurant.name}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">{skuData.totalCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MasterCard>
        )}

        {/* SKU Details Modal */}
        {showDetailsModal && selectedSku && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSku.description}</h2>
                    <p className="text-gray-600">SKU Code: {selectedSku.skuCode}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-blue-600 text-sm font-medium">Total Boxes</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedSku.totalCount}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-purple-600 text-sm font-medium">Restaurants</p>
                    <p className="text-2xl font-bold text-purple-900">{selectedSku.restaurants.length}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Box Details</h3>
                  <div className="space-y-4">
                    {selectedSku.skuDetails.map((detail, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">Unique Code: {detail.uniqueCode}</p>
                            <p className="text-sm text-gray-600">
                              <Clock className="inline w-4 h-4 mr-1" />
                              Entered Hotbox: {new Date(detail.hotboxEntryTime).toLocaleString()}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${detail.currentStatus === 'Return to Inventory Box'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {detail.currentStatus}
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Time in Hotbox</p>
                            <p className="font-medium">{detail.timeInHotbox}</p>
                          </div>
                          {detail.qboxLoadTime && (
                            <div>
                              <p className="text-sm text-gray-500">Loaded to QBox</p>
                              <p className="font-medium">
                                {new Date(detail.qboxLoadTime).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryBoxDtl;


