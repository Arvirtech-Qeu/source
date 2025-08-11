import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, TrendingUp, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getAllDeliiveryPartner } from '@state/deliveryPartnerSlice';
import { Column, Table } from '@components/Table';
import { getDailyStockReport } from '@state/reportSlice';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { format, getDaysInYear } from 'date-fns';
import { getFromLocalStorage } from '@utils/storage';
import { getDashboardQboxEntityByauthUser } from '@state/superAdminDashboardSlice';
import { DownloadButton } from '@components/download-csv';
import { ar } from 'date-fns/locale';
// import moment from 'moment';


interface DailyStockReportProps {
    isHovered: any;
}

const DailyStockReport: React.FC<DailyStockReportProps> = ({ isHovered }) => {
    const [error, setError] = useState<any>({})
    const [stateSno, setStateSno]: any = useState(null);
    const [citySno, setCitySno]: any = useState(null);
    const [areaSno, setAreaSno]: any = useState(null);
    const [roleId, setRoleId]: any = useState(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
    const [roleName, setRoleName]: any = useState(null);
    const [authUserId, setAuthUserId]: any = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const { dailyStockReportList } = useSelector((state: RootState) => state.reportSlice);
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);

    const [filters, setFilters] = useState({
        qbox_entity_sno: '',
        delivery_partner_sno: '',
        restaurant_sno: '',
        restaurant_food_sku_sno: '',
        transaction_date: ''
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // ensures 2-digit day
        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // 3-letter lowercase month
        const year = date.getFullYear();
        return `${day} - ${month} - ${year}`;
    };
    // Temporary filters for preview before applying
    const [tempFilters, setTempFilters] = useState({
        qbox_entity_sno: '',
        delivery_partner_sno: '',
        restaurant_sno: '',
        restaurant_food_sku_sno: '',
        transaction_date: ''
    });

    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
    const { restaurantList } = useSelector((state: RootState) => state.restaurant);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const dispatch = useDispatch<AppDispatch>();

    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    const qboxEntityIds = userData?.loginDetails?.qboxEntityDetails?.map(
        (entity: { qboxEntitySno: number }) => entity.qboxEntitySno
    ) || [];

    const [filteredSkus, setFilteredSkus] = useState(RestaurantFoodList);

    // Effect to filter SKUs based on selected restaurant
    useEffect(() => {
        if (!tempFilters.restaurant_sno || tempFilters.restaurant_sno === '') {
            setFilteredSkus(RestaurantFoodList);
        } else {
            setFilteredSkus(
                RestaurantFoodList.filter(item =>
                    item.restaurantSno &&
                    item.restaurantSno.toString() === tempFilters.restaurant_sno.toString()
                )
            );
        }
        // Reset SKU selection when restaurant changes
        setTempFilters(prev => ({ ...prev, restaurant_food_sku_sno: '' }));
    }, [tempFilters.restaurant_sno, RestaurantFoodList]);


    // First, update the loadUserData function
    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const storedData = getFromLocalStorage('user');

                if (!storedData) {
                    throw new Error('No user data found');
                }
                const { roleId, loginDetails } = storedData;
                if (!roleId) {
                    throw new Error('Role ID is missing');
                }
                // Set the state values and trigger API call immediately
                if (loginDetails) {
                    setStateSno(loginDetails.stateSno || null);
                    setCitySno(loginDetails.citySno || null);
                    setAreaSno(loginDetails.areaSno || null);
                    setRoleId(loginDetails.roleId || null);
                    setDeliveryPartnerSno(loginDetails.deliveryPartnerSno || null);
                    setRoleName(loginDetails.roleName || null);
                    setAuthUserId(loginDetails.authUserId || null);
                }
                console.log(areaSno)

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch entity list based on role
            if (roleName === 'Super Admin') {
                await dispatch(getDailyStockReport({ "transaction_date": currentDate }));
            } if (roleName === 'Aggregator Admin') {
                await dispatch(getDailyStockReport({ "transaction_date": currentDate, "delivery_partner_ids": [deliveryPartnerSno] }));
            } if (roleName === 'Admin') {
                await dispatch(getDailyStockReport({ "area_ids": [areaSno], "transaction_date": currentDate }));
            } if (roleName === 'Supervisor') {
                await dispatch(getDailyStockReport({ "transaction_date": currentDate, qbox_entity_ids: qboxEntityIds, }));
                await dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserId }));
            }

            // Fetch restaurant list
            await dispatch(getAllRestaurant({}));
        };

        fetchData();
    }, [dispatch, roleName, areaSno]);

    useEffect(() => {
        dispatch(getAllQboxEntities({}));
        dispatch(getAllDeliiveryPartner({}))
        dispatch(getAllRestaurant({}));
        dispatch(getAllRestaurantFoodSku({}));
    }, [dispatch]);

    const columns: Column<any>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: false,
        },
        {
            key: 'partner_purchase_order_id',
            header: 'Purchase Order Id',
            sortable: false,
        },
        {
            key: 'transaction_date',
            header: 'Purchase Order Date',
            sortable: false,
            // render: (row: any) => moment(row.transaction_date).format('DD-MMMM-YYYY').toLowerCase()
            render: (value) => formatDate(value.transaction_date),
        },
        {
            key: 'qbox_entity_name',
            header: 'Delivery Location',
            sortable: false,
        },
        {
            key: 'restaurant_name',
            header: 'Restaurant',
            sortable: false,
        },
        {
            key: 'food_sku_description',
            header: 'Restaurant SKU',
            sortable: true,
        },
        {
            key: 'total_ordered_count',
            header: 'Total',
            render: (value) => (
                <span
                    className="px-2 py-1 text-sm font-medium rounded text-blue-500 bg-blue-100">
                    {value.total_ordered_count}
                </span>
            )
        },
        {
            key: 'sold_inventory_count',
            header: 'Sold',
            render: (value) => (
                <span
                    className="px-2 py-1 text-sm font-medium rounded text-green-500 bg-green-100">
                    {value.sold_inventory_count}
                </span>
            ),
        },
        {
            key: 'unsold_inventory_count',
            header: 'UnSold',
            render: (value) => (
                <span className="px-2 py-1 text-sm font-medium rounded text-orange-500 bg-orange-100">
                    {value.unsold_inventory_count}
                </span>
            )
        },
        {
            key: 'rejected_count',
            header: 'Reject',
            render: (value) => (
                <span
                    className="px-2 py-1 text-sm font-medium rounded text-color low-bg-color"
                >
                    {value.rejected_count}
                </span>
            ),
        },
        {
            key: 'delivery_partner_name',
            header: 'Delivery Aggregate',
            sortable: false,
        },
    ];

    const handleTempFilterChange = (event) => {
        const { name, value } = event.target;
        setTempFilters((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'qbox_entity_sno' && {
                delivery_partner_sno: '',
                restaurant_sno: '',
                restaurant_food_sku_sno: '',
            }),
        }));
    };

    const buildPayload = (filterData) => {
        const payload = {
            transaction_date: filterData.transaction_date || currentDate,
            delivery_partner_ids: filterData.delivery_partner_sno &&
                filterData.delivery_partner_sno !== 'all' ?
                [parseInt(filterData.delivery_partner_sno)] : null,
            qbox_entity_ids: filterData.qbox_entity_sno &&
                filterData.qbox_entity_sno !== 'all' ?
                [parseInt(filterData.qbox_entity_sno)] : null,
            restaurant_ids: filterData.restaurant_sno &&
                filterData.restaurant_sno !== 'all' ?
                [parseInt(filterData.restaurant_sno)] : null,
            restaurant_food_sku_ids: filterData.restaurant_food_sku_sno &&
                filterData.restaurant_food_sku_sno !== 'all' ?
                [parseInt(filterData.restaurant_food_sku_sno)] : null,
            area_ids: roleName === 'Admin' && areaSno ?
                [parseInt(areaSno)] :
                null
        };

        // Add role-specific logic
        if (roleName === 'Supervisor' && !payload.qbox_entity_ids) {
            payload.qbox_entity_ids = qboxEntityIds;
        }

        return payload;
    };

    const applyFilters = () => {
        setFilters(tempFilters);
        const payload = buildPayload(tempFilters);
        console.log('Applying filters with payload:', payload);
        dispatch(getDailyStockReport(payload));
    };

    const resetFilters = () => {
        const resetValues = {
            qbox_entity_sno: '',
            delivery_partner_sno: '',
            restaurant_sno: '',
            restaurant_food_sku_sno: '',
            transaction_date: '',
        };

        setFilters(resetValues);
        setTempFilters(resetValues);

        if (roleName === 'Super Admin') {
            dispatch(getDailyStockReport({ "transaction_date": currentDate }));
        } if (roleName === 'Aggregator Admin') {
            dispatch(getDailyStockReport({ "transaction_date": currentDate, "delivery_partner_ids": [deliveryPartnerSno] }));
        } if (roleName === 'Admin') {
            dispatch(getDailyStockReport({ "transaction_date": currentDate, area_ids: [areaSno] }));
        } else if (roleName === 'Supervisor') {
            dispatch(getDailyStockReport({
                "transaction_date": currentDate,
                qbox_entity_ids: qboxEntityIds
            }));
        }
    };

    // Sync tempFilters with filters when filters change
    useEffect(() => {
        setTempFilters(filters);
    }, [filters]);

    return (
        <div className="min-h-screen ">
            <div className="custom-gradient-left h-32" />
            <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14'}`}>
                <div className="max-w-8xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            {/* Left side - Header */}
                            <div className="flex items-center gap-4 rounded-xl">
                                <div className="low-bg-color p-3 rounded-xl">
                                    <TrendingUp className="w-8 h-8 text-color" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900">Daily Stock Report</h1>
                                    <p className="text-gray-500 mt-2">View your daily stock reports</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                {(roleName && ['Super Admin', 'Aggregator Admin'].includes(roleName)) && (
                                    <DownloadButton
                                        data={dailyStockReportList}
                                        fileName="daily_stock_report"
                                        buttonText="Export Report"
                                        exportType="excel"
                                        columns={[
                                            {
                                                key: 'transaction_date',
                                                title: 'Date',
                                                format: (value) => value ? formatDate(value) : 'N/A'
                                            },
                                            {
                                                key: 'partner_purchase_order_id',
                                                title: 'Purchase Order ID',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'restaurant_name',
                                                title: 'Restaurant',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'qbox_entity_name',
                                                title: 'Delivery Location',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'food_sku_description',
                                                title: 'Food SKU',
                                                format: (value) => value || 'N/A'
                                            },
                                            {
                                                key: 'total_ordered_count',
                                                title: 'Total Ordered',
                                                format: (value) => Number(value) || 0
                                            },
                                            {
                                                key: 'sold_inventory_count',
                                                title: 'Sold',
                                                format: (value) => Number(value) || 0
                                            },
                                            {
                                                key: 'unsold_inventory_count',
                                                title: 'UnSold',
                                                format: (value) => Number(value) || 0
                                            },
                                            {
                                                key: 'rejected_count',
                                                title: 'Rejected',
                                                format: (value) => Number(value) || 0
                                            },
                                            {
                                                key: 'delivery_partner_name',
                                                title: 'Delivery Aggregator',
                                                format: (value) => value || 'N/A'
                                            }
                                        ]}
                                        disabled={!dailyStockReportList?.length || isLoading}
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

                            {/* Right side - Filter Toggle Button */}

                        </div>

                        {/* Collapsible Filter Section */}
                        {showFilters && (
                            <div className="mt-6 bg-gray-50/50 backdrop-blur-sm rounded-lg border border-gray-200 p-6 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {/* Delivery Location Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Delivery Location</label>
                                        <select
                                            name="qbox_entity_sno"
                                            value={tempFilters.qbox_entity_sno}
                                            onChange={handleTempFilterChange}
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        >
                                            <option value="">All Delivery Location</option>
                                            {
                                                roleName === 'Supervisor'
                                                    ? dashboardQboxEntityByauthUserList?.map((qbe) => (
                                                        <option key={qbe.qboxEntitySno} value={qbe.qboxEntitySno}>
                                                            {qbe.qboxEntityName}
                                                        </option>
                                                    ))
                                                    : roleName === 'Admin'
                                                        ? qboxEntityList
                                                            ?.filter(qbe => qbe.areaSno === areaSno)  // Filter by areaSno for Admin
                                                            .map((qbe) => (
                                                                <option key={qbe.qboxEntitySno} value={qbe.qboxEntitySno}>
                                                                    {qbe.qboxEntityName}
                                                                </option>
                                                            ))
                                                        : qboxEntityList?.map((qbe) => (  // Default case for other roles
                                                            <option key={qbe.qboxEntitySno} value={qbe.qboxEntitySno}>
                                                                {qbe.qboxEntityName}
                                                            </option>
                                                        ))
                                            }
                                        </select>
                                    </div>

                                    {/* Restaurant Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Restaurant</label>
                                        <select
                                            name="restaurant_sno"
                                            value={tempFilters.restaurant_sno}
                                            onChange={handleTempFilterChange}
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        >
                                            <option value="">All Restaurant</option>
                                            {restaurantList?.map((qbe) => (
                                                <option key={qbe.restaurantSno} value={qbe.restaurantSno}>
                                                    {qbe.restaurantName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* SKU Select - Updated */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Restaurant SKU</label>
                                        <select
                                            name="restaurant_food_sku_sno"
                                            value={tempFilters.restaurant_food_sku_sno}
                                            onChange={handleTempFilterChange}
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        >
                                            <option value="">All Restaurant SKU</option>
                                            {filteredSkus?.map((qbe) => (
                                                <option key={qbe.restaurantFoodSkuSno} value={qbe.restaurantFoodSkuSno}>
                                                    {qbe.restaurantFoodSku}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Transaction Date</label>
                                        <input
                                            type="date"
                                            name="transaction_date"
                                            value={tempFilters.transaction_date}
                                            onChange={handleTempFilterChange}
                                            className="w-full px-3 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    {/* Delivery Aggregator Select */}
                                    {roleName !== 'Aggregator Admin' && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Delivery Aggregator</label>
                                            <select
                                                name="delivery_partner_sno"
                                                value={tempFilters.delivery_partner_sno}
                                                onChange={handleTempFilterChange}
                                                className="w-full px-3 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                            >
                                                <option value="">All Delivery Aggregator</option>
                                                {deliveryPartnerList?.map((dp) => (
                                                    <option key={dp.deliveryPartnerSno} value={dp.deliveryPartnerSno}>
                                                        {dp.partnerName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors"
                                    >
                                        <RotateCcw size={16} className="mr-2" />
                                        Reset
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-color border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                                    >
                                        <Filter size={16} className="mr-2" />
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='my-8'>
                        <Table
                            columns={columns}
                            data={dailyStockReportList?.map((report, index) => ({
                                ...report,
                                sno: index + 1,
                            }))}
                            rowsPerPage={10}
                            initialSortKey="Sno"
                            globalSearch={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DailyStockReport;