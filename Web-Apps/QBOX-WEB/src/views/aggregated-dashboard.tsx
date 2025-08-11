import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Package,
    ShoppingCart,
    XCircle,
    Clock,
    Truck,
    MapPin,
    User,
    Bell,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Calendar,
    BarChart3,
    Activity,
    Target,
    Award,
    CheckCircle,
    ArrowUp,
    ArrowDown,
    Filter,
    Download,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Store,
    Eye,
    Search
} from 'lucide-react';
import { getDashboardAnalytics } from '@state/superAdminDashboardSlice';
import { AppDispatch, RootState } from '@state/store';
// Adjust the import path for your Redux store

interface AggregatorDashboardProps {
    isHovered: any;
}

const AggregatorDashboard: React.FC<AggregatorDashboardProps> = ({ isHovered }) => {
    const dispatch = useDispatch();
    const { dashboardAnalytics, loading, error, refreshing } = useSelector((state: RootState) => state.dashboardSlice);

    const [animatedStats, setAnimatedStats] = useState({
        totalSKUs: 0,
        totalOrders: 0,
        totalRejects: 0,
        avgDeliveryTime: 0,
        avgDeliveryTimeMinutes: 0 || null,
        timeInDateStore: 0,
        timeInDateStoreMinutes: 0 || null,
        timeInQuebox: 0,
        timeInQueboxMinutes: 0 || null,
        rejectedOrders: 0
    });

    const [isLoading, setIsLoading] = useState(true);
    const [showRejectsBreakdown, setShowRejectsBreakdown] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Today');
    const [selectedDayWiseFilter, setSelectedDayWiseFilter] = useState('This Week');
    const [selectedDayForSummary, setSelectedDayForSummary] = useState('All Days');

    // Map API response to day-wise data structure
    const mapApiToDayWiseData = (apiData: any) => {
        const fastMoving = apiData?.fast_moving_items || [];
        const slowMoving = apiData?.slow_moving_items || [];

        return {
            fastest: fastMoving.map((item: any, index: number) => ({
                rank: index + 1,
                item: item.sku_name,
                orders: item.sold_count,
                trend: `+${Math.round(Math.random() * 20)}%`, // Replace with actual trend if available
                category: item.sku_code // Map to appropriate category if available
            })),
            slowest: slowMoving.map((item: any, index: number) => ({
                rank: index + 1,
                item: item.sku_name,
                orders: item.sold_count,
                trend: item.sold_count === 0 ? '0%' : `-${Math.round(Math.random() * 10)}%`,
                category: item.sku_code
            }))
        };
    };

    interface RejectCity {
        city: string;
        fullArea: string; // Add this to store the complete area string
        count: number;
        hotels: string[];
    }

    interface RejectState {
        state: string;
        count: number;
        cities: RejectCity[];
    }

    interface RejectReason {
        reason: string;
        count: number;
        percentage: string;
    }

    interface RejectsBreakdownData {
        stateWise: RejectState[];
        mostCommonReasons: RejectReason[];
        topRegions: any[]; // You can define a proper type for this if needed
        topRestaurants: any[]; // You can define a proper type for this if needed
    }

    // Map API response to detailed day-wise data
    const mapApiToDayWiseDetailedData = (apiData: any, dayFilter: string) => {
        const fastMoving = apiData?.fast_moving_items || [];
        const slowMoving = apiData?.slow_moving_items || [];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        // For simplicity, map the data to a single day or distribute across days
        const dayData = days.map((day, index) => ({
            day,
            date: new Date(new Date().setDate(new Date().getDate() - (4 - index))).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            items: fastMoving.slice(0, 5).map((item: any, itemIndex: number) => ({
                name: item.sku_name,
                orders: item.sold_count,
                trend: `+${Math.round(Math.random() * 25)}%`,
                category: item.sku_code,
                growth: item.sold_count > 1000 ? 'high' : item.sold_count > 500 ? 'medium' : 'low'
            }))
        }));

        const slowDayData = days.map((day, index) => ({
            day,
            date: new Date(new Date().setDate(new Date().getDate() - (4 - index))).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            items: slowMoving.slice(0, 5).map((item: any, itemIndex: number) => ({
                name: item.sku_name,
                orders: item.sold_count,
                trend: item.sold_count === 0 ? '0%' : `-${Math.round(Math.random() * 10)}%`,
                category: item.sku_code,
                growth: item.sold_count === 0 ? 'declining' : item.sold_count < 100 ? 'declining' : 'stable'
            }))
        }));

        return {
            [selectedDayWiseFilter]: {
                fastest: dayFilter === 'All Days' ? dayData : dayData.filter((d: any) => d.day === dayFilter),
                slowest: dayFilter === 'All Days' ? slowDayData : slowDayData.filter((d: any) => d.day === dayFilter)
            }
        };
    };

    const mapApiToRejectsBreakdown = (apiData: any): RejectsBreakdownData => {
        const rejectAnalysis = apiData?.reject_analysis || {};
        const topRegions = rejectAnalysis.top_reject_regions || [];
        const topReasons = rejectAnalysis.top_reject_reasons || [];
        const topRestaurants = rejectAnalysis.top_reject_restaurants || [];

        // Group regions by state
        const stateGroups = topRegions.reduce((acc: Record<string, RejectState>, region: any) => {
            const fullArea = region.area;
            const areaParts = fullArea.split(', ').filter(Boolean);
            let city = areaParts[0] || 'Unknown City';
            let state = areaParts.length > 1 ? areaParts[1] : 'Unknown State';

            // For areas like "Nungambakkam, Chennai, Tamil Nadu, INDIA"
            if (areaParts.length > 2 && areaParts[2] !== 'INDIA') {
                state = areaParts[2]; // Use the state part (Tamil Nadu in this case)
            }

            if (!acc[state]) {
                acc[state] = {
                    state: state,
                    count: 0,
                    cities: []
                };
            }

            acc[state].count += region.count;

            // Check if city already exists in this state
            const existingCity = acc[state].cities.find(c => c.city === city);
            if (existingCity) {
                existingCity.count += region.count;
                existingCity.hotels = Array.from(new Set([...existingCity.hotels, ...topRestaurants.slice(0, 3).map((r: any) => r.restaurant) || ['Unknown Hotel']]));
            } else {
                acc[state].cities.push({
                    city: city,
                    fullArea: fullArea, // Store the complete area string
                    count: region.count,
                    hotels: topRestaurants.slice(0, 3).map((r: any) => r.restaurant) || ['Unknown Hotel']
                });
            }

            return acc;
        }, {});

        return {
            stateWise: Object.values(stateGroups),
            mostCommonReasons: topReasons.map((reason: any) => ({
                reason: reason.reason,
                count: reason.count,
                percentage: apiData.summary.total_reject > 0 ?
                    ((reason.count / apiData.summary.total_reject) * 100).toFixed(1) : '0'
            })),
            topRegions: topRegions,
            topRestaurants: topRestaurants
        };
    };

    // Construct API parameters based on filters
    const getApiParams = () => {
        const today = new Date().toISOString().split('T')[0];
        const params: any = {};

        if (selectedDay === 'Today') {
            // Use transaction_date for single day queries
            params.transaction_date = today;
        } else if (selectedDay === 'Yesterday') {
            const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
            // Use transaction_date for single day queries
            params.transaction_date = yesterday;
        } else if (selectedDay === 'This Week') {
            // Use start_date and end_date for date ranges
            const startOfWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0];
            params.start_date = startOfWeek;
            params.end_date = today;
        }

        // Add day_of_week filter if specific day is selected
        if (selectedDayForSummary !== 'All Days') {
            params.day_of_week = selectedDayForSummary.toLowerCase();
        }

        // Handle last week filter
        if (selectedDayWiseFilter === 'Last Week') {
            const startOfLastWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() - 7)).toISOString().split('T')[0];
            const endOfLastWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() - 1)).toISOString().split('T')[0];
            params.start_date = startOfLastWeek;
            params.end_date = endOfLastWeek;
            // Remove transaction_date if it exists when using date range
            delete params.transaction_date;
        }

        return params;
    };


    // Helper function to format time with appropriate units
    const formatTimeDisplay = (hours, minutes = null) => {
        // Handle negative, null, undefined, or invalid values
        if (hours === null || hours === undefined || isNaN(hours) || hours < 0) {
            return { value: 0, unit: 'minutes' };
        }

        // If hours is very small (less than 0.1) and we have minutes data, use minutes
        if (hours < 0.1 && minutes !== null && minutes !== undefined && !isNaN(minutes) && minutes > 0) {
            const roundedMinutes = Math.round(minutes);
            return {
                value: roundedMinutes,
                unit: roundedMinutes === 1 ? 'minute' : 'minutes'
            };
        }

        if (hours === 0) {
            return { value: 0, unit: 'minutes' };
        } else if (hours < 1) {
            // Less than 1 hour, show in minutes
            const minutesFromHours = Math.round(hours * 60);
            return {
                value: minutesFromHours,
                unit: minutesFromHours === 1 ? 'minute' : 'minutes'
            };
        } else if (hours < 24) {
            // Between 1 hour and 24 hours, show in hours
            const roundedHours = Math.round(hours * 10) / 10; // Round to 1 decimal place
            return {
                value: roundedHours,
                unit: roundedHours === 1 ? 'hour' : 'hours'
            };
        } else {
            // 24 hours or more, show in days
            const days = Math.round((hours / 24) * 10) / 10; // Round to 1 decimal place
            return {
                value: days,
                unit: days === 1 ? 'day' : 'days'
            };
        }
    };


    // Fetch dashboard analytics
    useEffect(() => {
        const params = getApiParams();
        console.log("params", params);
        dispatch(getDashboardAnalytics(params));

        // return () => {
        //     dispatch(clearDashBoardData());
        // };
    }, [dispatch, selectedDay, selectedDayWiseFilter, selectedDayForSummary]);

    // Animate stats when API data changes
    useEffect(() => {
        console.log("dashboardAnalytics", dashboardAnalytics);
        if (dashboardAnalytics && !loading && !error) {
            const targets = {
                totalSKUs: Math.max(0, dashboardAnalytics.summary?.total_sku || 0),
                totalOrders: Math.max(0, dashboardAnalytics.summary?.total_orders || 0),
                totalRejects: Math.max(0, dashboardAnalytics.summary?.total_reject || 0),
                avgDeliveryTime: Math.max(0, dashboardAnalytics.summary?.average_delivery_time_hours || 0),
                avgDeliveryTimeMinutes: dashboardAnalytics.summary?.average_delivery_time_minutes || 0,
                timeInDateStore: Math.max(0, dashboardAnalytics.summary?.average_time_in_store_hours || 0),
                timeInDateStoreMinutes: dashboardAnalytics.summary?.average_time_in_store_minutes || 0,
                timeInQuebox: Math.max(0, dashboardAnalytics.summary?.average_time_in_qbox_hours || 0),
                timeInQueboxMinutes: dashboardAnalytics.summary?.average_time_in_qbox_minutes || 0,
                rejectedOrders: Math.max(0, dashboardAnalytics.summary?.total_reject || 0)
            };

            // Show final values immediately - no counting animation
            setAnimatedStats(targets);

            // Optional: Keep a brief loading state for smooth UI transition
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 100); // Very brief delay just for smooth appearance

            return () => clearTimeout(timeout);
        } else if (error) {
            console.error('API Error:', error);
            setIsLoading(false);
        }
    }, [dashboardAnalytics, loading, error]);

    // Map API data to component data structures
    const dayWiseItemData = dashboardAnalytics ? {
        [selectedDay]: mapApiToDayWiseData(dashboardAnalytics)
    } : {
        'Today': { fastest: [], slowest: [] },
        'Yesterday': { fastest: [], slowest: [] },
        'This Week': { fastest: [], slowest: [] }
    };

    const dayWiseDetailedData = dashboardAnalytics ? mapApiToDayWiseDetailedData(dashboardAnalytics, selectedDayForSummary) : {
        'This Week': { fastest: [], slowest: [] },
        'Last Week': { fastest: [], slowest: [] }
    };

    const rejectsBreakdownData = dashboardAnalytics ? mapApiToRejectsBreakdown(dashboardAnalytics) : {
        stateWise: [],
        mostCommonReasons: []
    };

    const currentItems = dayWiseItemData[selectedDay] || dayWiseItemData['Today'];
    const currentDayWiseData = dayWiseDetailedData[selectedDayWiseFilter] || dayWiseDetailedData['This Week'];

    const filteredDayWiseData = selectedDayForSummary === 'All Days'
        ? currentDayWiseData
        : {
            fastest: currentDayWiseData.fastest.filter((dayData: any) => dayData.day === selectedDayForSummary),
            slowest: currentDayWiseData.slowest.filter((dayData: any) => dayData.day === selectedDayForSummary)
        };

    const getGrowthColor = (growth: string) => {
        switch (growth) {
            case 'high': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-blue-600 bg-blue-100';
            case 'low': return 'text-yellow-600 bg-yellow-100';
            case 'declining': return 'text-red-600 bg-red-100';
            case 'stable': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className={`${isHovered ? 'pl-16 pr-14' : 'pl-16 pr-14 p-12'}`}>
            {loading || refreshing ? (
                <div className="flex justify-center items-center h-64">
                    <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    Error: {error}
                </div>
            ) : (
                <div className="mx-auto">
                    {/* Top Metrics Section - 3 Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total SKUs - India</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {animatedStats.totalSKUs}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-xl">
                                    <Package className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Orders - India</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {animatedStats.totalOrders}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-xl">
                                    <ShoppingCart className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Rejects</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {animatedStats.totalRejects}
                                    </p>
                                    {animatedStats.totalRejects > 2 && (
                                        <button
                                            onClick={() => setShowRejectsBreakdown(!showRejectsBreakdown)}
                                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            View Breakdown
                                            {showRejectsBreakdown ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                                        </button>
                                    )}
                                </div>
                                <div className="bg-red-100 p-4 rounded-xl">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rejects Breakdown Modal/Section */}
                    {showRejectsBreakdown && animatedStats.totalRejects > 2 && (
                        <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                                Rejects Breakdown Details
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">State & City wise Breakdown</h4>
                                    <div className="space-y-4">
                                        {rejectsBreakdownData.stateWise.map((state, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h5 className="font-semibold text-gray-900">{state.state}</h5>
                                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {state.count} rejects
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {state.cities.map((city, cityIndex) => (
                                                        <div key={cityIndex} className="bg-gray-50 rounded p-3">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-medium text-gray-800">{city.fullArea}</span> {/* Changed from city.city to city.fullArea */}
                                                                <span className="text-red-600 font-semibold">{city.count}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Top Hotels: {city.hotels.slice(0, 2).join(', ')}
                                                                {city.hotels.length > 2 && ` +${city.hotels.length - 2} more`}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Most Common Rejection Reasons</h4>
                                    <div className="space-y-3">
                                        {rejectsBreakdownData.mostCommonReasons.map((reason, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                                                <div>
                                                    <p className="font-medium text-gray-900">{reason.reason}</p>
                                                    <p className="text-sm text-gray-600">{reason.percentage}% of total rejects</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-red-600">{reason.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Middle Metrics - Updated Time-based Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="bg-orange-100 p-4 rounded-xl inline-flex mb-4">
                                    <Clock className="h-8 w-8 text-orange-600" />
                                </div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Avg Time to Deliver</p>
                                <p className="text-sm text-gray-500 mb-3">Order Placed to Delivered - Across India</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {(() => {
                                        const safeValue = Math.max(0, animatedStats.avgDeliveryTime || 0);
                                        const timeDisplay = formatTimeDisplay(safeValue, animatedStats.avgDeliveryTimeMinutes);
                                        return `${timeDisplay.value} ${timeDisplay.unit}`;
                                    })()}
                                </p>
                                {(animatedStats.avgDeliveryTime === null || animatedStats.avgDeliveryTime === undefined) && (
                                    <p className="text-xs text-gray-400 mt-1">Data unavailable</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="bg-teal-100 p-4 rounded-xl inline-flex mb-4">
                                    <Store className="h-8 w-8 text-teal-600" />
                                </div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Time in Dark Store</p>
                                <p className="text-sm text-gray-500 mb-3">Intime SKU - Outtime SKU</p>
                                <p className="text-3xl font-bold text-teal-600">
                                    {(() => {
                                        const safeValue = Math.max(0, animatedStats.timeInDateStore || 0);
                                        const timeDisplay = formatTimeDisplay(safeValue, animatedStats.timeInDateStoreMinutes);
                                        return `${timeDisplay.value} ${timeDisplay.unit}`;
                                    })()}
                                </p>
                                {(animatedStats.timeInDateStore === null || animatedStats.timeInDateStore === undefined) && (
                                    <p className="text-xs text-gray-400 mt-1">Data unavailable</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="bg-indigo-100 p-4 rounded-xl inline-flex mb-4">
                                    <Package className="h-8 w-8 text-indigo-600" />
                                </div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Time in Qbox</p>
                                <p className="text-sm text-gray-500 mb-3">Comes In - Comes Out</p>
                                <p className="text-3xl font-bold text-indigo-600">
                                    {(() => {
                                        const safeValue = Math.max(0, animatedStats.timeInQuebox || 0);
                                        const timeDisplay = formatTimeDisplay(safeValue, animatedStats.timeInQueboxMinutes);
                                        return `${timeDisplay.value} ${timeDisplay.unit}`;
                                    })()}
                                </p>
                                {(animatedStats.timeInQuebox === null || animatedStats.timeInQuebox === undefined) && (
                                    <p className="text-xs text-gray-400 mt-1">Data unavailable</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">


                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <BarChart3 className="h-6 w-6 text-blue-500 mr-2" />
                                        Item Movement Analysis - India
                                    </h3>
                                    <div className="flex space-x-2">
                                        {['Today', 'Yesterday', 'This Week'].map((day) => (
                                            <button
                                                key={day}
                                                onClick={() => setSelectedDay(day)}
                                                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${selectedDay === day
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-green-200 rounded-lg p-4 bg-green-50/30">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                                            Fastest Moving Items (Top 5)
                                        </h4>

                                        <div className="space-y-3">
                                            {currentItems.fastest.map((item: any) => (
                                                <div key={item.rank} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-green-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-bold text-white">{item.rank}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{item.item}</p>
                                                            <p className="text-xs text-gray-500">{item.category}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-900">{item.orders}</p>
                                                        <p className="text-xs text-green-600 font-medium">{item.trend}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border border-red-200 rounded-lg p-4 bg-red-50/30">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                                            Slowest Moving Items (Top 5)
                                        </h4>

                                        <div className="space-y-3">
                                            {currentItems.slowest.map((item: any) => (
                                                <div key={item.rank} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-red-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-bold text-white">{item.rank}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{item.item}</p>
                                                            <p className="text-xs text-gray-500">{item.category}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-900">{item.orders}</p>
                                                        <p className="text-xs text-red-600 font-medium">{item.trend}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                        Rejected Orders
                                    </h3>
                                    {/* <Filter className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" /> */}
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-red-800">Total Count</p>
                                                <p className="text-2xl font-bold text-red-600">{animatedStats.rejectedOrders}</p>
                                            </div>
                                            <XCircle className="h-8 w-8 text-red-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Most Common Reason</p>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="font-medium text-gray-900">{rejectsBreakdownData.mostCommonReasons[0]?.reason || 'Unknown'}</p>
                                            <p className="text-sm text-gray-600">{rejectsBreakdownData.mostCommonReasons[0]?.percentage || 0}% of rejections</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Regional Stats</p>
                                        <div className="space-y-2">
                                            {rejectsBreakdownData.stateWise.slice(0, 3).map((state: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                                    <span className="text-sm text-gray-700">{state.state}</span>
                                                    <div className="text-right">
                                                        <span className="text-sm font-semibold text-red-600">{state.count}</span>
                                                        <p className="text-xs text-gray-500">{((state.count / animatedStats.rejectedOrders) * 100).toFixed(1)}%</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3">Most Hotel Rejects</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                                <span className="text-sm text-gray-700">{rejectsBreakdownData.stateWise[0]?.cities[0]?.hotels[0] || 'Unknown'}</span>
                                                <div className="text-right">
                                                    <span className="text-sm font-semibold text-red-600">{rejectsBreakdownData.stateWise[0]?.cities[0]?.count || 0}</span>
                                                    <p className="text-xs text-gray-500">{((rejectsBreakdownData.stateWise[0]?.cities[0]?.count / animatedStats.rejectedOrders) * 100).toFixed(1)}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Calendar className="h-6 w-6 text-blue-500 mr-2" />
                                    Day-wise Items Analysis
                                </h3>

                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-700">Period:</span>
                                        <div className="flex space-x-1">
                                            {['This Week', 'Last Week'].map((period) => (
                                                <button
                                                    key={period}
                                                    onClick={() => setSelectedDayWiseFilter(period)}
                                                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${selectedDayWiseFilter === period
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {period}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-700">Day:</span>
                                        <div className="flex space-x-1">
                                            {['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                                <button
                                                    key={day}
                                                    onClick={() => setSelectedDayForSummary(day)}
                                                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${selectedDayForSummary === day
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-gray-900 flex items-center">
                                        <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                                        Day-wise Fastest Items Summary
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <Eye className="h-4 w-4 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                            {selectedDayForSummary === 'All Days' ? 'All Days' : selectedDayForSummary} | {selectedDayWiseFilter}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {filteredDayWiseData.fastest.map((dayData: any, index: number) => (
                                        <div key={index} className="border border-green-200 bg-green-50/30 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="font-bold text-gray-900">{dayData.day}</p>
                                                    <p className="text-xs text-gray-500">{dayData.date}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Target className="h-4 w-4 text-green-500" />
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                        Top Performers
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {dayData.items.map((item: any, itemIndex: number) => (
                                                    <div key={itemIndex} className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-100">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold">
                                                                {itemIndex + 1}
                                                            </span>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                                                <p className="text-xs text-gray-500">{item.category}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-gray-900">{item.orders}</p>
                                                            <div className="flex items-center space-x-1">
                                                                <span className="text-xs text-green-600 font-medium">{item.trend}</span>
                                                                <span className={`text-xs px-1 py-0.5 rounded ${getGrowthColor(item.growth)}`}>
                                                                    {item.growth}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-lg font-bold text-gray-900 flex items-center">
                                        <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                                        Day-wise Slowest Items Summary
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-4 w-4 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                            {selectedDayForSummary === 'All Days' ? 'All Days' : selectedDayForSummary} | {selectedDayWiseFilter}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {filteredDayWiseData.slowest.map((dayData: any, index: number) => (
                                        <div key={index} className="border border-red-200 bg-red-50/30 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="font-bold text-gray-900">{dayData.day}</p>
                                                    <p className="text-xs text-gray-500">{dayData.date}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                                        Needs Attention
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {dayData.items.map((item: any, itemIndex: number) => (
                                                    <div key={itemIndex} className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full text-xs font-bold">
                                                                {itemIndex + 1}
                                                            </span>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                                                <p className="text-xs text-gray-500">{item.category}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-gray-900">{item.orders}</p>
                                                            <div className="flex items-center space-x-1">
                                                                <span className="text-xs text-red-600 font-medium">{item.trend}</span>
                                                                <span className={`text-xs px-1 py-0.5 rounded ${getGrowthColor(item.growth)}`}>
                                                                    {item.growth}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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
    );
};

export default AggregatorDashboard;