import { useState, useEffect } from 'react';
import DatePicker from '@components/DatePicker';
import { ChartNoAxesColumnIncreasing, ChevronDown, ChevronUp, FileText, Filter, RotateCcw, Search } from 'lucide-react';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { AppDispatch, RootState } from '@state/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllDeliiveryPartner, getPurchaseOrderStatus } from '@state/deliveryPartnerSlice';
import { toast } from 'react-toastify';
import Select from '@components/Select';
import ReportCard from '@components/purchase-report-card';
import { getSalesReport } from '@state/reportSlice';
import { SalesReportTable } from '@components/sales-report-table';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import { DownloadButton } from '@components/download-csv';
import { getDashboardQboxEntityByauthUser } from '@state/superAdminDashboardSlice';
import { getFromLocalStorage } from '@utils/storage';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
interface QBoxLocation {
    qboxEntitySno: number;
    qboxEntityName: string;
    entityCode: string;
}

interface FilterState {
    aggregator: any;
    location: any;
    restaurant: any;
    sku: any;
    date: string;
    status: any;
}

interface OrderData {
    total_cost: number;
    food_sku_code: string;
    food_sku_name: string;
    purchase_date: string;
    restaurant_id: number;
    qbox_entity_id: number;
    delivery_partner_id: number;
    latest_workflow_stage: number;
    total_ordered_quantity: number;
    total_accepted_quantity: number;
    latest_workflow_stage_description: string;
    restaurant_name: string;
    delivery_partner_name: string;
}

interface SalesReportProps {
    isHovered: any;
}

const SalesReport: React.FC<SalesReportProps> = ({ isHovered }) => {

    const [locations, setLocations] = useState<QBoxLocation[]>([]);
    const [error, setError] = useState<any>({})
    const [stateSno, setStateSno]: any = useState(null);
    const [citySno, setCitySno]: any = useState(null);
    const [areaSno, setAreaSno]: any = useState(null);
    const [roleId, setRoleId]: any = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filterKey, setFilterKey] = useState(0);
    const [roleName, setRoleName]: any = useState(null);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);
    const [authUserId, setAuthUserId]: any = useState(null);
    const dispatch = useDispatch<AppDispatch>();
    const { qboxEntityList, qboxEntitySno } = useSelector(
        (state: RootState) => state.qboxEntity
    );
    const { restaurantList, partnerOrderDashboardDetails } = useSelector(
        (state: RootState) => state.restaurant
    );
    const { deliveryPartnerList, purchaseOrderStatusList } = useSelector(
        (state: RootState) => state.deliveryPartners
    );
    const { salesReportList } = useSelector(
        (state: RootState) => state.reportSlice
    );

    console.log(salesReportList)

    const [filters, setFilters] = useState<FilterState>({
        aggregator: null,
        location: null,
        restaurant: null,
        // date: new Date().toISOString().split('T')[0],
        sku: null,
        date: '',
        status: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const [filteredSkus, setFilteredSkus] = useState(RestaurantFoodList);

    // Effect to filter SKUs based on selected restaurant
    useEffect(() => {
        if (!filters.restaurant || filters.restaurant === '') {
            setFilteredSkus(RestaurantFoodList);
        } else {
            setFilteredSkus(
                RestaurantFoodList.filter(item =>
                    item.restaurantSno &&
                    item.restaurantSno.toString() === filters.restaurant.toString()
                )
            );
        }
        // Reset SKU selection when restaurant changes
        setFilters(prev => ({ ...prev, sku: '' }));
    }, [filters.restaurant, RestaurantFoodList]);


    // useEffect(() => {
    //     const loadUserData = async () => {
    //         try {
    //             setIsLoading(true);
    //             setError(null);
    //             const storedData = getFromLocalStorage('user');

    //             if (!storedData) {
    //                 throw new Error('No user data found');
    //             }
    //             const { roleId, loginDetails } = storedData;
    //             if (!roleId) {
    //                 throw new Error('Role ID is missing');
    //             }
    //             // Set the state values and trigger API call immediately
    //             if (loginDetails) {
    //                 setStateSno(loginDetails.stateSno || null);
    //                 setCitySno(loginDetails.citySno || null);
    //                 setAreaSno(loginDetails.areaSno || null);
    //                 setRoleId(loginDetails.roleId || null);
    //                 setDeliveryPartnerSno(loginDetails.deliveryPartnerSno || null);
    //                 setRoleName(loginDetails.roleName || null);
    //                 setAuthUserId(loginDetails.authUserId || null);
    //             }
    //             console.log(areaSno)

    //         } catch (err: any) {
    //             setError(err.message);
    //             console.error('Error loading user data:', err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     loadUserData();
    // }, []);


    useEffect(() => {
        const fetchInitialReport = () => {
            try {
                // Get user data from localStorage
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const loginDetails = userData?.loginDetails || {};

                // Get current role from localStorage (more reliable than state on reload)
                const currentRole = loginDetails.roleName;

                // Extract and validate qbox entity IDs
                const qboxEntityIds = loginDetails.qboxEntityDetails?.map(
                    (entity: { qboxEntitySno: number }) => entity.qboxEntitySno
                );

                // Prepare filter payload
                const payload: any = {
                    // delivery_partner_ids: null,
                    qbox_entity_ids: qboxEntityIds?.length ? qboxEntityIds : null,
                    restaurant_ids: null,
                    restaurant_sku_ids: null,
                    purchase_date: null
                };

                // Add area filter only for Admin role
                if (currentRole === 'Admin') {
                    const areaSno = loginDetails.areaSno;
                    if (areaSno) {
                        payload.area_ids = [areaSno];
                        console.log("Adding area filter for Admin:", areaSno);
                    }
                }

                if (currentRole === 'Aggregator Admin') {
                    const deliveryPartnerSno = loginDetails.deliveryPartnerSno;
                    if (deliveryPartnerSno) {
                        payload.delivery_partner_ids = [deliveryPartnerSno];
                        console.log("Adding area filter for Aggregator Admin:", deliveryPartnerSno);
                    }
                }

                console.log("Final payload being dispatched:", payload);
                dispatch(getSalesReport(payload));

            } catch (error) {
                console.error('Error fetching initial purchase report:', error);
                toast.error('Failed to fetch initial purchase report');
            }
        };

        const fetchLocations = async () => {
            try {
                if (roleName === 'Super Admin') {
                    dispatch(getAllQboxEntities(qboxEntitySno != '0' ? { qboxEntitySno: qboxEntitySno } : {}));
                }
                if (roleName === 'Supervisor') {
                    await dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserId }));
                }
                if (roleName === 'Admin') {
                    dispatch(getAllQboxEntities({ areaSno: areaSno }));
                }
                dispatch(getAllRestaurant({}));
                dispatch(getAllDeliiveryPartner({}));
                dispatch(getAllRestaurantFoodSku({}));
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
        fetchInitialReport();
    }, [dispatch, roleName, authUserId, areaSno, qboxEntitySno]); // Added dispatch to dependencies

    const handleSearch = async () => {
        setIsLoading(true);

        try {
            console.log(filters);
            // Build the payload with proper null handling
            const payload: any = {
                order_date: filters.date || null,  // Changed from purchase_date to order_date for sales report

                // Handle qbox_entity_ids - null if empty string (All Locations)
                qbox_entity_ids: filters.location && filters.location !== '' ?
                    [parseInt(filters.location)] :
                    (roleName === 'Supervisor' ?
                        dashboardQboxEntityByauthUserList.map(entity => entity.qboxEntitySno) :
                        null),

                // Handle delivery_partner_ids - null if empty string (All Aggregators)
                delivery_partner_ids: filters.aggregator && filters.aggregator !== '' ?
                    [parseInt(filters.aggregator)] :
                    null,

                // Handle restaurant_ids - null if empty string (All Restaurants)
                restaurant_ids: filters.restaurant && filters.restaurant !== '' ?
                    [parseInt(filters.restaurant)] :
                    null,

                // Handle restaurant_sku_ids - null if empty string (All SKUs)
                restaurant_sku_ids: filters.sku && filters.sku !== '' ?
                    [parseInt(filters.sku)] :
                    null,

                // Automatically include areaSno for Admin users
                area_ids: roleName === 'Admin' && areaSno ?
                    [parseInt(areaSno)] :
                    null
            };

            // Remove any properties with [null] arrays
            Object.keys(payload).forEach(key => {
                if (Array.isArray(payload[key]) && payload[key].length === 1 && payload[key][0] === null) {
                    payload[key] = null;
                }
            });

            console.log('Sales Report Search payload:', payload);
            await dispatch(getSalesReport(payload));

        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to fetch sales data');
        } finally {
            setIsLoading(false);
        }
    };

    const resetFilters = async () => {
        console.log('Reset filters called');
        const currentDate = new Date().toISOString().split('T')[0];

        // Reset UI filter state
        const resetFiltersState = {
            aggregator: '',
            location: '',
            restaurant: '',
            sku: '',
            date: '',
            status: '',
            areaId: '',
        };

        console.log('Setting filters to:', resetFiltersState);
        setFilters(resetFiltersState);
        setFilterKey(prev => prev + 1);

        // Prepare base payload
        const payload: any = {
            purchase_date: null,
            delivery_partner_ids: null,
            restaurant_ids: null,
            restaurant_sku_ids: null,
            area_ids: null
        };

        // Handle role-specific resets
        if (roleName === 'Supervisor') {
            payload.qbox_entity_ids = dashboardQboxEntityByauthUserList.map(entity => entity.qboxEntitySno);
        }
        else if (roleName === 'Admin') {
            // Get areaSno from localStorage for Admin
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const areaSno = userData?.loginDetails?.areaSno;

            if (areaSno) {
                payload.area_ids = [areaSno];
                console.log('Applying area filter for Admin:', areaSno);
            }
        } else if (roleName === 'Aggregator Admin') {
            // Get areaSno from localStorage for Aggregator Admin
            if (deliveryPartnerSno) {
                payload.delivery_partner_ids = [deliveryPartnerSno];
                console.log('Applying area filter for Admin:', deliveryPartnerSno);
            }
        } else {
            payload.qbox_entity_ids = null;
        }

        // Execute the reset
        setIsLoading(true);
        try {
            console.log('Reset payload:', payload);
            await dispatch(getSalesReport(payload));
        } catch (error) {
            console.error('Reset search error:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="custom-gradient-left h-32" />

            <div className={`-mt-24  ${isHovered ? 'pl-32 pr-14 ' : 'pl-16 pr-14 '}`}>
                {/* Header Section */}
                <div className="max-w-8xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex items-center gap-4  rounded-xl">
                                <div className="low-bg-color p-3 rounded-xl">
                                    <ChartNoAxesColumnIncreasing className="w-8 h-8 text-color" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">Sales Report</h1>
                                    <p className="text-gray-600">Manage and track your Sales Reports</p>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                {(roleName && ['Super Admin', 'Aggregator Admin'].includes(roleName)) && (
                                    <DownloadButton
                                        data={salesReportList}
                                        fileName={`sales_report_${new Date().toISOString().split('T')[0]}`}
                                        buttonText="Export Report"
                                        exportType="excel"
                                        columns={[
                                            {
                                                key: 'order_date', // Use exact property name from your data
                                                title: 'Sales Order Date',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'qbox_entity_name', // Check if this exact key exists in your data
                                                title: 'Delivery Location',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'restaurant_name', // Check if this exact key exists in your data
                                                title: 'Restaurant',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'food_sku_name', // Check if this exact key exists in your data
                                                title: 'Restaurant Sku',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'total_quantity', // Check if this exact key exists in your data
                                                title: 'Sold Count',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'total_revenue', // Check if this exact key exists in your data
                                                title: 'Total Revenue',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'delivery_partner_name', // Check if this exact key exists in your data
                                                title: 'Delivery Aggregator',
                                                format: (value) => value || 'N/A'
                                            },
                                        ]}
                                        disabled={!salesReportList?.length || isLoading}
                                        isLoading={isLoading}
                                    />
                                )}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-colors"
                                >
                                    <Filter size={16} className="mr-2" />
                                    Filters
                                    {showFilters ? (
                                        <ChevronUp size={16} className="ml-2" />
                                    ) : (
                                        <ChevronDown size={16} className="ml-2" />
                                    )}
                                </button>
                            </div>

                        </div>
                        {/* Collapsible Filter Section */}
                        {showFilters && (
                            <div className="mt-6 bg-gray-50/50 backdrop-blur-sm rounded-lg border border-gray-200 p-6 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" key={filterKey}>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Delivery Location</label>
                                        <Select
                                            value={filters.location}
                                            onChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                                            options={[
                                                { label: 'All Locations', value: '' },
                                                ...(roleName === 'Supervisor'
                                                    ? dashboardQboxEntityByauthUserList.map(loc => ({
                                                        label: loc.qboxEntityName,
                                                        value: loc.qboxEntitySno
                                                    }))
                                                    : qboxEntityList.map(loc => ({
                                                        label: loc.qboxEntityName,
                                                        value: loc.qboxEntitySno
                                                    }))
                                                )
                                            ]}
                                            className="w-full transition-all duration-200"
                                        />
                                    </div>

                                    {/* Restaurant Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">All Restaurants</label>
                                        <Select
                                            value={filters.restaurant}
                                            onChange={(value) => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    restaurant: value,
                                                    sku: '' // Reset SKU when restaurant changes
                                                }));
                                            }}
                                            options={[
                                                { label: 'All Restaurants', value: '' },
                                                ...restaurantList.map(loc => ({
                                                    label: loc.restaurantName,
                                                    value: loc.restaurantSno.toString()
                                                }))
                                            ]}
                                            className="w-full transition-all duration-200"
                                        />
                                    </div>

                                    {/* SKU Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Restaurant SKU</label>
                                        <Select
                                            value={filters.sku}
                                            onChange={(value) => setFilters(prev => ({ ...prev, sku: value }))}
                                            options={[
                                                { label: 'All SKUs', value: '' },
                                                ...(filteredSkus || []).map(item => ({
                                                    label: item.restaurantFoodSku || 'N/A',
                                                    value: item.restaurantFoodSkuSno?.toString() || ''
                                                }))
                                            ]}
                                            className="w-full transition-all duration-200"
                                        />
                                    </div>

                                    {/* Date Input */}
                                    <div className="space-y-2 w-auto">
                                        <label className="text-sm font-medium text-gray-700">Sales Order Date</label>
                                        <DatePicker
                                            value={filters.date}
                                            onChange={(value) => setFilters(prev => ({ ...prev, date: value }))}
                                            className="w-full transition-all duration-200 "
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4">
                                    {roleName !== 'Aggregator Admin' && (
                                        <div className="w-1/4">
                                            <label className="text-sm font-medium text-gray-700">Delivery Aggregator</label>
                                            <Select
                                                value={filters.aggregator}
                                                onChange={(value) => setFilters(prev => ({ ...prev, aggregator: value }))}
                                                options={[
                                                    { label: 'All Aggregators', value: null },
                                                    ...deliveryPartnerList.map(deliveryPartner => ({
                                                        label: deliveryPartner.partnerName,
                                                        value: deliveryPartner.deliveryPartnerSno
                                                    }))
                                                ]}
                                                className="w-full transition-all duration-200 "
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <div className='mr-3'>
                                            <button
                                                onClick={resetFilters}
                                                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors"
                                            >
                                                <RotateCcw size={16} className="mr-2" />
                                                Reset
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                onClick={handleSearch}
                                                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-color border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                                            >
                                                <Filter size={16} className="mr-2" />
                                                Apply Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Action Buttons */}

                            </div>
                        )}
                    </div>
                    <div className="space-y-6 mt-8">
                        {isLoading ? (
                            <div className='flex flex-col items-center justify-center h-64 shadow-lg rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100'>
                                <div className="animate-spin h-12 w-12 border-4 border-color border-t-transparent rounded-full mb-4" />
                                <h3 className='text-xl font-semibold text-gray-700 mb-2'>Loading Orders...</h3>
                                <p className='text-gray-500 text-center max-w-md'>
                                    Please wait while we fetch your orders
                                </p>
                            </div>
                        ) : salesReportList?.length > 0 ? (
                            <SalesReportTable
                                data={salesReportList}
                                loading={isLoading}
                                onResetFilters={() => {
                                    setFilters({
                                        aggregator: null,
                                        location: null,
                                        restaurant: null,
                                        sku: null,
                                        date: '',
                                        status: null,
                                    });
                                    setFilterKey(prev => prev + 1);
                                }}
                            />
                            // ))
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesReport;