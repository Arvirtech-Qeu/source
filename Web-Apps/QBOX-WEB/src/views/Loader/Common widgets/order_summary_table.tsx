import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Filter, Download, Calendar, Clock, Upload, RefreshCw, MapPin, X, Store, ShoppingCart, CircleCheckBig, AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getInwardOrderDetailsV2, setOrderEndDate, setOrderQboxEntitySno, setOrderRestaurantSkuSno, setOrderRestaurantSno, setOrderStartDate, setOrderTransactionDate } from '@state/loaderDashboardSlice';
import { EmptyState } from './empty_state';
import { getFromLocalStorage, removeFromLocalStorage } from '@utils/storage';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getDashboardQboxEntityByauthUser } from '@state/superAdminDashboardSlice';
import { set } from 'date-fns';
import { StatGrid } from "@view/Loader/Common widgets/count_grid"
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import RestaurantFoodSku from '@view/restaurant-masters/restaurans-food-items';
// import 'src/App.css'

// Types
export interface Tab {
    id: string;
    label: string;
}

export interface OrderItem {
    areaName: string;
    qboxEntityName: string;
    restaurantSkuName: string;
    restaurantName: string;
    items: {
        totalCount: number;
        label: string;
    };
    orderStatus: string;
    orderedTime: string;
    partnerPurchaseOrderId: string;
    purchaseOrderDtlSno: string;
    transactionDate: string;
    inStockCount: number;
    rejectSkuCount: number;
}

export interface OrderResponse {
    totals: {
        totalOrders: number;
        inStockCount: number;
        totalSkuCount: number;
        rejectSkuCount: number;
        totalQboxSkuCount: number;
        totalSoldSkuCount: number;
    };
    details: OrderItem[];
}


export interface FilterOption {
    id: string;
    label: string;
    options?: string[] | Area[] | Restaurant[] | RestaurantSku[];
    type?: 'select' | 'daterange' | 'status';
    icon?: React.ReactNode;
}

export interface TableColumn {
    key: string;
    title: string;
    sortable?: boolean;
    render?: (value: any, record: any) => React.ReactNode;
}

interface OrderSummaryProps {
    title?: string;
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    filterOptions: FilterOption[];
    tableColumns: TableColumn[];
    data: OrderResponse | null;
    onSearch?: (searchTerm: string) => void;
    onFilter?: (filters: Record<string, any>) => void;
    onViewDetails?: (orderId: string, purchaseOrderDtlSno: string) => void;
}

// Define the type for each individual item in an order
interface Item {
    totalCount: number;
    label: string;
}

interface Area {
    areaSno: number;
    qboxEntitySno: number;
    qboxEntityName: string;
}

interface Restaurant {
    restaurantSno: number;
    restaurantName: string;
}

interface RestaurantSku {
    restaurantFoodSkuSno: number;
    restaurantFoodSku: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    title = 'Purchase Order Summary',
    tabs,
    activeTab,
    onTabChange,
    filterOptions,
    tableColumns,
    data,
    onSearch,
    onFilter,
    onViewDetails
}) => {

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // ensures 2-digit day
        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // 3-letter lowercase month
        const year = date.getFullYear();
        return `${day} - ${month} - ${year}`;
    };

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentDate, setCurrentDate] = useState<string>(getCurrentDate());
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [selectedRestaurantSku, setSelectedRestaurantSku] = useState<RestaurantSku | null>(null);
    const [isFilterChanged, setIsFilterChanged] = useState<boolean>(false);
    // const [filteredData, setFilteredData] = useState<OrderItem[]>(data);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
    const { restaurantList } = useSelector((state: RootState) => state.restaurant);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);
    const [selectedLocation, setSelectedLocation] = useState<Area | null>(null);
    const [selectedRestaurantName, setSelectedRestaurantName] = useState<string>('');
    const [selectedRestaurantSkuName, setSelectedRestaurantSkuName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [authUserSno, setAuthUserSno]: any = useState(null);
    const [roleName, setRoleName]: any = useState(null);
    const [areaSno, setAreaSno]: any = useState(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
    const [availableLocations, setAvailableLocations] = useState<Area[]>([]);
    const [availableRestautant, setAvailableRestautant] = useState<Restaurant[]>([]);
    const [availableRestautantSku, setAvailableRestautantSku] = useState<RestaurantSku[]>([]);
    const [filteredData, setFilteredData] = useState<OrderResponse | null>(data);


    const dispatch = useDispatch<AppDispatch>();

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Effect to filter data when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    console.log('filteredData', filteredData)
    // Assuming filteredData is of type OrderSummary (the full object you shared)
    const finalFilteredData = filteredData?.details.filter(item => {
        const matchesSearch =
            searchTerm === '' ||
            item.partnerPurchaseOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.areaName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'pending' && item.orderStatus === 'Pending') ||
            (activeTab === 'orderFulfilled' && item.orderStatus === 'Order Fulfilled') ||
            (activeTab === 'awaitingDelivery' && item.orderStatus === 'Awaiting Delivery') ||
            (activeTab === 'rejected' && item.orderStatus === 'Rejected');

        return matchesSearch && matchesTab;
    }) ?? [];

    console.log('finalFilteredData', finalFilteredData)

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedData = getFromLocalStorage('user');

                if (!storedData) {
                    throw new Error('No user data found');
                }

                const { loginDetails } = storedData;

                if (!loginDetails) {
                    throw new Error('Login details not found');
                }

                // Set both values at once to ensure synchronization
                setAuthUserSno(loginDetails.authUserId ? Number(loginDetails.authUserId) : null);
                setRoleName(loginDetails.roleName || null);
                setDeliveryPartnerSno(loginDetails.deliveryPartnerSno)
                setAreaSno(loginDetails.areaSno)
                console.log('User data loaded:', {
                    authUserId: loginDetails.authUserId,
                    roleName: loginDetails.roleName,
                    areaSno: loginDetails.areaSno,
                    deliveryPartnerSno: loginDetails.deliveryPartnerSno
                });

            } catch (err: any) {
                console.error('Error loading user data:', err);
                setError(err.message);
            }
        };

        loadUserData();
    }, []);

    useEffect(() => {
        const handleQboxEntitiesFetch = () => {
            if (!roleName) {
                console.log('Waiting for role to be loaded...');
                return;
            }

            switch (roleName) {
                case 'Super Admin':
                    dispatch(getAllQboxEntities({}));
                    dispatch(getAllRestaurant({}));
                    dispatch(getAllRestaurantFoodSku({}));
                    break;

                case 'Admin':
                    if (!areaSno) {
                        console.log('Waiting for area data...');
                        return;
                    }
                    dispatch(getAllQboxEntities({ areaSno }));
                    dispatch(getAllRestaurant({}));
                    dispatch(getAllRestaurantFoodSku({}));
                    break;

                case 'Aggregator Admin':
                    dispatch(getAllQboxEntities({}));
                    dispatch(getAllRestaurant({}));
                    dispatch(getAllRestaurantFoodSku({}));
                    break;

                case 'Supervisor':
                    if (!authUserSno) {
                        console.log('Waiting for Supervisor data...');
                        return;
                    }
                    dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserSno }));
                    dispatch(getAllRestaurant({}));
                    dispatch(getAllRestaurantFoodSku({}));
                    break;

                default:
                    console.log('Role not authorized for QBox entities:', roleName);
                    break;
            }
        };

        handleQboxEntitiesFetch();
    }, [dispatch, roleName, areaSno]);


    useEffect(() => {
        if (!roleName) return;

        try {
            switch (roleName) {
                case 'Super Admin':
                    setAvailableLocations(qboxEntityList);
                    setAvailableRestautant(restaurantList);
                    setAvailableRestautantSku(RestaurantFoodList);
                    break;

                case 'Admin':
                    const adminLocations = qboxEntityList.filter(entity =>
                        entity.areaSno === areaSno
                    );
                    setAvailableLocations(adminLocations);
                    setAvailableRestautant(restaurantList);
                    setAvailableRestautantSku(RestaurantFoodList);
                    break;

                case 'Supervisor':
                    setAvailableLocations(dashboardQboxEntityByauthUserList);
                    setAvailableRestautant(restaurantList);
                    setAvailableRestautantSku(RestaurantFoodList);
                    break;

                case 'Aggregator Admin':
                    setAvailableLocations(qboxEntityList);
                    setAvailableRestautant(restaurantList);
                    setAvailableRestautantSku(RestaurantFoodList);
                    break;

                default:
                    setAvailableLocations([]);
                    break;
            }
        } catch (error) {
            console.error('Error filtering locations:', error);
            setAvailableLocations([]);
        }
    }, [roleName, qboxEntityList, dashboardQboxEntityByauthUserList, areaSno, deliveryPartnerSno, authUserSno, restaurantList, RestaurantFoodList]);

    // Calculate pagination values
    const totalPages = Math.ceil(finalFilteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = finalFilteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        if (onSearch) {
            onSearch(value);
        }
    };


    const getActiveFilterCount = () => {
        let count = 0;
        if (selectedFilters.qboxEntitySno) count++;
        if (selectedFilters.restaurantSno) count++;
        if (selectedFilters.restaurantFoodSkuSno) count++;
        if (startDate) count++;
        if (endDate) count++;
        return count;
    };

    const activeFilterCount = getActiveFilterCount();


    useEffect(() => {
        const restoreFiltersAndData = async () => {

            const savedFilters = localStorage.getItem('orderFilters');
            if (!savedFilters) return;

            console.log(JSON.stringify(savedFilters))
            try {
                const parsedFilters = JSON.parse(savedFilters);
                console.log(parsedFilters)

                // Set the date filter regardless of location
                if (parsedFilters.transactionDate) {
                    setStartDate(parsedFilters.transactionDate);
                    setSelectedFilters(prev => ({
                        ...prev,
                        transactionDate: parsedFilters.transactionDate
                    }));
                }

                if (parsedFilters.startDate && parsedFilters.endDate) {
                    setStartDate(parsedFilters.startDate);
                    setEndDate(parsedFilters.endDate);
                    setSelectedFilters(prev => ({
                        ...prev,
                        startDate: parsedFilters.startDate,
                        endDate: parsedFilters.endDate
                    }));
                }

                // Handle location if present
                if (parsedFilters.qboxEntitySno) {
                    let savedLocation = roleName === 'Supervisor'
                        ? dashboardQboxEntityByauthUserList.find(
                            entity => entity.qboxEntitySno === parsedFilters.qboxEntitySno
                        )
                        : qboxEntityList.find(
                            entity => entity.qboxEntitySno === parsedFilters.qboxEntitySno
                        );

                    if (savedLocation) {
                        setSelectedLocation(savedLocation);
                        setSelectedArea(savedLocation.qboxEntityName);
                        setSelectedFilters(prev => ({
                            ...prev,
                            qboxEntitySno: savedLocation.qboxEntitySno
                        }));
                    }
                }

                // Build params based on available filters
                const params = {
                    transactionDate: parsedFilters.transactionDate || null,
                    qboxEntitySno: parsedFilters.qboxEntitySno || null,
                    restaurantSno: parsedFilters.restaurantSno || null,
                    restaurantFoodSkuSno: parsedFilters.restaurantFoodSkuSno || null,
                    startDate: parsedFilters.startDate || null,
                    endDate: parsedFilters.endDate || null,
                    ...(roleName === 'Admin' && { locationSno: areaSno }),
                    ...(roleName === 'Supervisor' && { authUserSno }),
                    ...(roleName === 'Aggregator Admin' && { deliveryPartnerSno })
                };

                const response = await dispatch(getInwardOrderDetailsV2(params));
                if (response.payload) {
                    setFilteredData(response.payload);
                    dispatch(setOrderTransactionDate(params.transactionDate));
                    dispatch(setOrderStartDate(params.startDate));
                    dispatch(setOrderEndDate(params.endDate));
                    if (params.qboxEntitySno) {
                        dispatch(setOrderQboxEntitySno(params.qboxEntitySno));
                    } else if (params.restaurantSno) {
                        dispatch(setOrderRestaurantSno(params.restaurantSno));
                    } else if (params.restaurantFoodSkuSno) {
                        dispatch(setOrderRestaurantSkuSno(params.restaurantFoodSkuSno));
                    }
                }
            } catch (error) {
                console.error('Error restoring filters:', error);
            }
        };

        // Only run if we have the necessary data
        if (roleName && (qboxEntityList.length > 0 || dashboardQboxEntityByauthUserList.length > 0)) {
            restoreFiltersAndData();
        }
    }, [roleName, qboxEntityList, dashboardQboxEntityByauthUserList, areaSno,
        authUserSno, deliveryPartnerSno, dispatch
    ]);

    const handleResetFilters = async () => {
        try {
            // Clear filters
            setSelectedFilters({});
            setSelectedArea('');
            setSelectedRestaurantName('');
            setSelectedRestaurantSkuName('');
            setSelectedLocation(null);
            setSelectedRestaurant(null);
            setSelectedRestaurantSku(null);
            setCurrentDate(getCurrentDate());
            setStartDate('');
            setEndDate('');
            setIsFilterChanged(false);

            // Clear localStorage
            localStorage.removeItem('orderFilters');

            // Build resetParams based on role
            let resetParams = {
                transactionDate: getCurrentDate(),
                qboxEntitySno: null,
                locationSno: null,
                authUserSno: null,
                restaurantSno: null,
                restaurantFoodSku: null,
                deliveryPartnerSno: null
            };

            // Add role-specific parameters
            switch (roleName) {
                case 'Admin':
                    resetParams = {
                        ...resetParams,
                        locationSno: areaSno
                    };
                    break;
                case 'Supervisor':
                    resetParams = {
                        ...resetParams,
                        authUserSno: authUserSno
                    };
                    break;
                case 'Aggregator Admin':
                    resetParams = {
                        ...resetParams,
                        deliveryPartnerSno: deliveryPartnerSno
                    };
                    break;
            }

            console.log('Reset params:', resetParams); // Debug log

            const response = await dispatch(getInwardOrderDetailsV2(resetParams));
            if (response.payload) {
                setFilteredData(response.payload);
                dispatch(setOrderTransactionDate(getCurrentDate()));
                dispatch(setOrderStartDate(''));
                dispatch(setOrderEndDate(''));
                dispatch(setOrderQboxEntitySno(null));
                dispatch(setOrderRestaurantSno(null));
                dispatch(setOrderRestaurantSkuSno(null));
            }

            setCurrentPage(1);
        } catch (error) {
            console.error('Error resetting filters:', error);
            // Optionally add error notification here
            // toast.error('Error resetting filters');
        }
    };

    const handleFilterChange = (filterId: string, value: any) => {
        setIsFilterChanged(true);

        if (filterId === 'locationSno') {
            setSelectedArea(value.qboxEntityName);
            setSelectedLocation(value);
            setSelectedFilters(prev => ({
                ...prev,
                qboxEntitySno: value.qboxEntitySno
            }));
        }
        else if (filterId === 'restaurantSno') {
            setSelectedRestaurantName(value.restaurantName)
            setSelectedRestaurant(value);
            console.log('restaurantSno changed:', value);
            setSelectedFilters(prev => ({
                ...prev,
                restaurantSno: value.restaurantSno
            }));
        }
        else if (filterId === 'restaurantFoodSkuSno') {
            setSelectedRestaurantSkuName(value.restaurantFoodSku)
            setSelectedRestaurantSku(value);
            console.log('restaurantFoodSkuSno changed:', value);
            setSelectedFilters(prev => ({
                ...prev,
                restaurantFoodSkuSno: value.restaurantFoodSkuSno
            }));
        }
        else if (filterId === 'startDate') {
            setStartDate(value);
            console.log('Start date changed:', value);
        } else if (filterId === 'endDate') {
            setEndDate(value);
        }
    };

    const handleApplyFilters = async () => {
        try {
            console.log('Applying filters with:', selectedFilters);

            const params = {
                qboxEntitySno: selectedFilters.qboxEntitySno || null,
                restaurantSno: selectedFilters.restaurantSno || null,
                restaurantFoodSkuSno: selectedFilters.restaurantFoodSkuSno || null,
                // transactionDate: currentDate,
                startDate: startDate || null,
                endDate: endDate || null,
                deliveryPartnerSno: deliveryPartnerSno || null
            };

            console.log('API params:', params);

            const response = await dispatch(getInwardOrderDetailsV2(params));

            if (response.payload) {
                console.log(response.payload)
                setFilteredData(response.payload);
                localStorage.setItem('orderFilters', JSON.stringify({
                    qboxEntitySno: selectedFilters.qboxEntitySno,
                    restaurantSno: selectedFilters.restaurantSno,
                    restaurantFoodSkuSno: selectedFilters.restaurantFoodSkuSno,
                    // transactionDate: currentDate,
                    startDate: startDate,
                    endDate: endDate,
                    selectedArea,
                    totals: response.payload.totals
                }));
            }

            dispatch(setOrderTransactionDate(currentDate));
            dispatch(setOrderStartDate(startDate));
            dispatch(setOrderEndDate(endDate));
            dispatch(setOrderQboxEntitySno(selectedFilters.qboxEntitySno));
            dispatch(setOrderRestaurantSno(selectedFilters.restaurantSno));
            dispatch(setOrderRestaurantSkuSno(selectedFilters.restaurantFoodSkuSno));
            setIsFilterChanged(false);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error applying filters:', error);
        }

    };


    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value);
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    // Function to render status badges with appropriate colors
    const renderStatusBadge = (status: string) => {
        let bgColor = '';
        let textColor = '';

        switch (status) {
            case 'Order Fulfilled':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                break;
            case 'Pending':
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                break;
            case 'Awaiting Delivery':
                bgColor = 'bg-blue-100';
                textColor = 'text-blue-800';
                break;
            case 'Rejected':
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
                break;
            default:
                bgColor = 'bg-gray-100';
                textColor = 'text-gray-800';
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                {status}
            </span>
        );
    };

    const renderFilterOption = (filter: FilterOption) => {
        switch (filter.type) {
            case 'select':
                return (
                    <>
                        <div className="relative ">
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Delivery Location
                            </label>
                            <select
                                className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                                value={selectedFilters.qboxEntitySno || ''}
                                onChange={(e) => {
                                    const selectedEntity = availableLocations.find(
                                        entity => entity.qboxEntitySno.toString() === e.target.value
                                    );
                                    if (selectedEntity) {
                                        handleFilterChange('locationSno', selectedEntity);
                                    }
                                }}
                            >
                                <option value="">Select Location</option>
                                {availableLocations.map((entity) => (
                                    <option
                                        key={entity.qboxEntitySno}
                                        value={entity.qboxEntitySno}
                                    >
                                        {entity.qboxEntityName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Restaurant
                            </label>
                            <select
                                className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                                value={selectedFilters.restaurantSno || ''}
                                onChange={(e) => {
                                    const selectedRestautant = availableRestautant.find(
                                        restaurant => restaurant.restaurantSno.toString() === e.target.value
                                    );
                                    if (selectedRestautant) {
                                        handleFilterChange('restaurantSno', selectedRestautant);
                                    }
                                }}
                            >
                                <option value="">Select Restaurant</option>
                                {availableRestautant.map((restaurant) => (
                                    <option
                                        key={restaurant.restaurantSno}
                                        value={restaurant.restaurantSno}
                                    >
                                        {restaurant.restaurantName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative ">
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Restaurant Sku
                            </label>
                            <select
                                className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                                value={selectedFilters.restaurantFoodSkuSno || ''}
                                onChange={(e) => {
                                    const selectedRestautantSku = availableRestautantSku.find(
                                        sku => sku.restaurantFoodSkuSno.toString() === e.target.value
                                    );
                                    if (selectedRestautantSku) {
                                        handleFilterChange('restaurantFoodSkuSno', selectedRestautantSku);
                                    }
                                }}
                            >
                                <option value="">Select Restaurant Sku</option>
                                {availableRestautantSku.map((sku) => (
                                    <option
                                        key={sku.restaurantFoodSkuSno}
                                        value={sku.restaurantFoodSkuSno}
                                    >
                                        {sku.restaurantFoodSku}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>

                );
            case 'daterange':
                return (
                    <>
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2  text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                                value={startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                max={endDate || undefined} // Optional: prevent selecting a start date after end date
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                End Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 pl-9 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                                value={endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                min={startDate || undefined} // Ensures end date can't be before start date
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showLocationDropdown && event.target instanceof Node) {
                const dropdown = document.querySelector('.location-dropdown');
                if (dropdown && !dropdown.contains(event.target)) {
                    setShowLocationDropdown(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLocationDropdown]);


    // Render items count with color
    // const renderItems = (items: { totalCount: number; label: string }) => {
    //     return (
    //         <span className="text-color">
    //             {items.totalCount} {items.label}
    //         </span>
    //     );
    // };
    const renderItems = (items?: { totalCount: number; label: string }) => {
        if (!items) return null;

        return (
            <span className="text-color">
                {items.totalCount} {items.label}
            </span>
        );
    };



    // Calculate count for each tab status 
    const statusCounts = {
        pending: data?.details?.filter(item => item.orderStatus === 'Pending').length,
        awaitingDelivery: data?.details?.filter(item => item.orderStatus === 'Awaiting Delivery').length,
        orderFulfilled: data?.details?.filter(item => item.orderStatus === 'Order Fulfilled').length,
        rejected: data?.details?.filter(item => item.orderStatus === 'Rejected').length
    };

    // Function to export data to CSV
    const exportToCSV = () => {
        // Define the headers based on table columns
        const headers = tableColumns.map(col => col.title);

        // Create CSV content with headers
        let csvContent = headers.join(',') + '\n';

        // Add data rows - using finalFilteredData to include current filters
        finalFilteredData.forEach(item => {
            const row = [
                item.partnerPurchaseOrderId,
                item.areaName,
                item.qboxEntityName,
                item.restaurantName,
                item.restaurantSkuName,
                `${item.items.totalCount} ${item.items.label}`,
                item.inStockCount,
                item.orderStatus,
                item.transactionDate,
                item.orderedTime
            ];
            csvContent += row.join(',') + '\n';
        });

        // Create a blob with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        // Set link properties
        link.setAttribute('href', url);
        link.setAttribute('download', `order_summary_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        // Add link to document, trigger click to download, then remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [showFilters, setShowFilters] = useState(false);

    const renderFilterSummary = () => {
        return (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border-l-4 border-color">
                <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-500">Location</div>
                            <div className="text-sm font-semibold low-bg-color px-3 py-1 rounded-full text-color">
                                {selectedArea || 'All Locations'}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-500">Current Date</div>
                            <div className="text-sm font-semibold low-bg-color px-3 py-1 rounded-full text-color">
                                {formatDate(currentDate) || getCurrentDate()}
                            </div>
                        </div>
                        {roleName === 'Admin' && (
                            <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-500">Area</div>
                                <div className="text-sm font-semibold low-bg-color px-3 py-1 rounded-full text-color">
                                    {qboxEntityList.find(entity => entity.areaSno === areaSno)?.areaName || 'N/A'}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-500">Total Records</div>
                        <div className="text-sm font-semibold text-color low-bg-color px-3 py-1 rounded-full">
                            {finalFilteredData.length}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const statItems = [
        {
            title: "TOTAL ORDER",
            value: data?.totals?.totalOrders?.toLocaleString() || "0",
            description: "Active orders today",
            icon: ShoppingCart,
            actionText: "",
            actionHandler: () => null,
            isDisabled: false,
        },
        {
            title: "TOTAL SKU's",
            value: data?.totals?.totalSkuCount?.toLocaleString() || "0",
            description: "Total food packs",
            icon: CircleCheckBig,
            actionHandler: () => null,
            isDisabled: false,
        },
        {
            title: "TOTAL SKU IN QBOX",
            value: data?.totals?.totalQboxSkuCount?.toLocaleString() || "0",
            description: "Total food packs in QBox",
            icon: AlertTriangle, actionHandler: () => null,
            isDisabled: false,
        },
        {
            title: "TOTAL SKU IN INVENTORY",
            value: data?.totals?.inStockCount?.toLocaleString() || "0",
            description: "Total food packs in Inventory",
            icon: AlertTriangle,
            actionHandler: () => null,
            isDisabled: false,
        },
        {
            title: "TOTAL SKU REJECTED",
            value: data?.totals?.rejectSkuCount?.toLocaleString() || "0",
            description: "Total food packs Rejected",
            icon: AlertTriangle,
            actionHandler: () => null,
            isDisabled: false,
        },
        {
            title: "TOTAL SKU SOLD",
            value: data?.totals?.totalSoldSkuCount?.toLocaleString() || "0",
            description: "Total food packs Sold",
            icon: AlertTriangle,
            actionHandler: () => null,
            isDisabled: false,
        },
    ];

    return (
        <div className="rounded-lg md:py-6">
            <StatGrid items={statItems} />
            <div className='h-4'></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                {/* Compact Header */}
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left side - Quick filters */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search by Order number"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            {/* Active Filter Pills */}
                            <div className="flex items-center gap-2">
                                {selectedLocation && (
                                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-20">{selectedArea}</span>
                                        <button onClick={() => setSelectedArea('')} className="hover:text-blue-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                {selectedRestaurant && (
                                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-20">{selectedRestaurantName}</span>
                                        <button onClick={() => setSelectedRestaurantName('')} className="hover:text-blue-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                {selectedRestaurantSku && (
                                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-20">{selectedRestaurantSkuName}</span>
                                        <button onClick={() => setSelectedRestaurantSkuName('')} className="hover:text-blue-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                {startDate && (
                                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-md">
                                        <Calendar className="w-3 h-3" />
                                        <span>{startDate}</span>
                                        <button onClick={() => setStartDate('')} className="hover:text-green-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                {endDate && (
                                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-md">
                                        <Calendar className="w-3 h-3" />
                                        <span>{endDate}</span>
                                        <button onClick={() => setEndDate('')} className="hover:text-purple-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Right side - Actions */}
                        <div className="flex items-center gap-2">
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={handleResetFilters}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                    title="Clear all filters"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                            ${showFilters ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expandable Filter Section */}
                {showFilters && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex gap-2 justify-between">
                            <div className="flex gap-3">
                                {filterOptions.map(filter => renderFilterOption(filter))}
                            </div>
                            <div className="flex flex-column items-center gap-2 mt-4">
                                {/* <br /> */}
                                <button
                                    className={`w-[150px] px-6 py-2 rounded-lg justify-center gap-2 ${isFilterChanged
                                        ? 'bg-color text-white hover:bg-red-600'
                                        : 'bg-gray-200 text-gray-500'
                                        } transition-colors`}
                                    onClick={handleApplyFilters}
                                    disabled={!isFilterChanged}
                                >
                                    {/* <Filter size={16} /> */}
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {(currentDate || selectedArea || startDate || finalFilteredData.length > 0) && renderFilterSummary()}
            <h1 className="text-lg font-semibold mb-2 text-color">{title}</h1>
            <div className="border-b mb-4">
                <ul className="flex flex-wrap -mb-px">
                    {tabs.map(tab => (
                        <li key={tab.id} className="mr-2">
                            <button
                                className={`inline-block py-4 px-4 font-medium text-sm ${activeTab === tab.id
                                    ? 'text-color border-b-2 border-color'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => onTabChange(tab.id)}
                            >
                                {tab.label}
                                {tab.id !== 'all' && (
                                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                        {tab.id === 'pending' && statusCounts.pending}
                                        {tab.id === 'awaitingDelivery' && statusCounts.awaitingDelivery}
                                        {tab.id === 'orderFulfilled' && statusCounts.orderFulfilled}
                                        {tab.id === 'rejected' && statusCounts.rejected}
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {currentItems.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className=''>
                                <tr className="border-b low-bg-color">
                                    {tableColumns.map((column) => (
                                        <th
                                            key={column.key}
                                            className="py-3 px-3 text-left text-sm font-medium text-color"
                                        >
                                            <div className="flex items-center">
                                                {column.title}
                                                {column.sortable && (
                                                    <ChevronDown className="ml-1 h-4 w-4 text-color" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="py-3">
                                        <div className="flex justify-end">

                                            <div style={{ width: '5px' }}></div>
                                            <button
                                                className="p-2 border rounded-full"
                                                onClick={exportToCSV}
                                                title="Export data to CSV"
                                            >
                                                <Download size={18} className='text-color' />
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody >
                                {
                                    currentItems.map((item) => (
                                        <tr key={item.partnerPurchaseOrderId} className="orders border-b hover:bg-gray-50">
                                            <td className="py-4 text-sm">
                                                <div className="flex items-center">
                                                    {/* <div className="low-bg-color p-2 rounded-lg mr-3">
                                                        <div className="text-color">
                                                            <Clock size={16} />
                                                        </div>
                                                    </div> */}
                                                    <span>{item.partnerPurchaseOrderId}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm">{item.areaName}</td>
                                            <td className="py-4 text-sm">{item.qboxEntityName}</td>
                                            <td className="py-4 text-sm">{item.restaurantName}</td>
                                            <td className="py-4 text-sm">{item.restaurantSkuName}</td>
                                            <td className="py-4 text-sm">
                                                {renderItems(item.items)}
                                            </td>
                                            <td className="py-4 text-sm">{item.inStockCount} Sku</td>
                                            <td className="py-4 text-sm">
                                                {renderStatusBadge(item.orderStatus)}
                                            </td>
                                            <td className="py-4 text-sm">
                                                {item.transactionDate ? item.transactionDate.split('T')[0] : ''}
                                            </td>
                                            <td className="py-4 text-sm">{item.orderedTime}</td>
                                            <td className="py-4 text-sm text-right">
                                                <button
                                                    className="text-color font-medium"
                                                    onClick={() => onViewDetails && onViewDetails(item.partnerPurchaseOrderId, item.purchaseOrderDtlSno)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={handlePageSizeChange}
                                className="text-sm border rounded px-2 py-1 w-[55px]"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <span className="text-sm text-gray-600">entries</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages || 1}
                                ({indexOfFirstItem + 1}-{Math.min(indexOfLastItem, finalFilteredData.length)} of {finalFilteredData.length})
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>) : (<EmptyState />)}
        </div>
    );
};

export default OrderSummary;
