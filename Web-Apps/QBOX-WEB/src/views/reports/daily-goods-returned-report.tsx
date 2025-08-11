import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MapPin, Globe, Building2, User, Truck, Barcode, CheckCircle, SearchX, Pencil, Trash2, RotateCcw, Filter, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getAllDeliiveryPartner } from '@state/deliveryPartnerSlice';
import { Column, Table } from '@components/Table';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { getDailyGoodsReturnedReport } from '@state/reportSlice';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import { getFromLocalStorage } from '@utils/storage';
import { format, getDaysInYear } from 'date-fns';
import { getDashboardQboxEntityByauthUser } from '@state/superAdminDashboardSlice';
import { Modal, Tag, Image, List, Divider, Carousel } from 'antd';
import {
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { DownloadButton } from '@components/download-csv';

interface DailyStockReportProps {
    isHovered: any;
}

interface RejectionImage {
    rejection_image_url: string | null;
    rejection_image_type: string | null;
    rejection_thumbnail_url: string | null;
}

interface RejectedItemDetails {
    unique_code: string;
    rejection_time: string;
    rejection_reason: string | null;
    sku_inventory_sno: number;
    rejection_image_url?: string | null;  // Keep for backward compatibility
    rejection_image_type?: string | null; // Keep for backward compatibility
    rejection_description: string | null;
    rejection_thumbnail_url?: string | null; // Keep for backward compatibility
    rejection_images?: RejectionImage[];    // New property for multiple images
}

const DailyGoodsReturnReport: React.FC<DailyStockReportProps> = ({ isHovered }) => {
    const [error, setError] = useState<any>({})
    const [stateSno, setStateSno]: any = useState(null);
    const [citySno, setCitySno]: any = useState(null);
    const [areaSno, setAreaSno]: any = useState(null);
    const [roleId, setRoleId]: any = useState(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
    const [roleName, setRoleName]: any = useState(null);
    const [authUserId, setAuthUserId]: any = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [itemsPerPage] = useState(10);
    const { goodsReturnReportList } = useSelector((state: RootState) => state.reportSlice);
    const [filters, setFilters] = useState({
        qbox_entity_sno: '',
        delivery_partner_sno: '',
        restaurant_sno: '',
        restaurant_food_sku_sno: '',
        transaction_date: ''
    });
    const [selectedRejections, setSelectedRejections] = useState<RejectedItemDetails[]>([]);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState<string>('');
    const [currentSku, setCurrentSku] = useState<string>('');

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
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);
    const { restaurantList } = useSelector((state: RootState) => state.restaurant);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const [showFilters, setShowFilters] = useState(false);
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
            if (roleName === 'Super Admin' || roleName === 'Aggregator Admin') {
                await dispatch(getDailyGoodsReturnedReport({ "transaction_date": currentDate }));
            } if (roleName === 'Aggregator Admin') {
                dispatch(getDailyGoodsReturnedReport({ "transaction_date": currentDate, "delivery_partner_ids": [deliveryPartnerSno] }));
            } if (roleName === 'Admin') {
                dispatch(getDailyGoodsReturnedReport({ "transaction_date": currentDate, area_ids: [areaSno] }));
            } if (roleName === 'Supervisor') {
                await dispatch(getDailyGoodsReturnedReport({ "transaction_date": currentDate, qbox_entity_ids: qboxEntityIds, }));
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // ensures 2-digit day
        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // 3-letter lowercase month
        const year = date.getFullYear();
        return `${day} - ${month} - ${year}`;
    };

    const columns: Column<any>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: false,
        },
        {
            key: 'transaction_date',
            header: 'Purchase Order Date',
            sortable: false,
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
            header: 'Resturant SKU',
            sortable: false,
        },
        {
            key: 'returned_count',
            header: 'Reject Sku Count',
            sortable: false,
            render: (value) => (
                <span className="px-2 py-1 text-sm font-medium rounded text-color low-bg-color">
                    {value.returned_count ?? 0}
                </span>
            )
        },
        {
            key: 'delivery_partner_name',
            header: 'Delivery Aggregator',
            sortable: false,
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <button
                    onClick={() => {
                        setSelectedRejections(row.rejected_items);
                        setCurrentRestaurant(row.restaurant_name);
                        setCurrentSku(row.food_sku_description);
                        setShowRejectionModal(true);
                    }}
                    className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color"
                >
                    View Details
                </button>
            )
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

    const handleDeleteModalOpen = (item) => {
        console.log(item)
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
        dispatch(getDailyGoodsReturnedReport(payload));
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
            dispatch(getDailyGoodsReturnedReport({ "transaction_date": currentDate }));
        } if (roleName === 'Aggregator Admin') {
            dispatch(getDailyGoodsReturnedReport({ "transaction_date": currentDate, "delivery_partner_ids": [deliveryPartnerSno] }));
        } if (roleName === 'Admin') {
            dispatch(getDailyGoodsReturnedReport({ "transaction_date": currentDate, area_ids: [areaSno] }));
        } else if (roleName === 'Supervisor') {
            dispatch(getDailyGoodsReturnedReport({
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
                                    <h1 className="text-3xl font-semibold text-gray-900">Daily Goods Reject Report</h1>
                                    <p className="text-gray-500 mt-2">View your daily goods Reject reports</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Your existing buttons */}
                            </div>
                            {/* Right side - Filter Toggle Button */}
                            <div className="flex justify-end space-x-3">
                                {(roleName && ['Super Admin', 'Aggregator Admin'].includes(roleName)) && (
                                    <DownloadButton
                                        data={goodsReturnReportList}
                                        fileName="daily_goods_return_report"
                                        buttonText="Export Report"
                                        exportType="excel"
                                        columns={[
                                            { key: 'transaction_date', title: 'Date' },
                                            { key: 'qbox_entity_name', title: 'Delivery Location' },
                                            { key: 'restaurant_name', title: 'Restaurant' },
                                            { key: 'food_sku_description', title: 'Restaurant SKU' },
                                            { key: 'returned_count', title: 'Rejected Count' },
                                            { key: 'delivery_partner_name', title: 'Delivery Aggregator' }
                                        ]}
                                        disabled={!goodsReturnReportList?.length}
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
                            data={goodsReturnReportList?.map((report, index) => ({
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

            {/* Rejection Details Modal */}
            <Modal
                title={`Rejection Details - ${currentRestaurant} (${currentSku})`}
                open={showRejectionModal}
                onCancel={() => setShowRejectionModal(false)}
                footer={null}
                width={800}
                className="rejection-details-modal"
            >
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={selectedRejections}
                    renderItem={(item: any) => (
                        <List.Item
                            key={item.sku_inventory_sno + item.rejection_time}
                            // In your modal's List.Item component:
                            extra={
                                // Check for new format first (array of images), then fall back to old format (single image)
                                (item.rejection_images?.length > 0 || item.rejection_image_url) ? (
                                    <div className="rejection-images-container">
                                        <Image.PreviewGroup
                                            items={
                                                item.rejection_images?.length > 0
                                                    ? item.rejection_images.map((img, idx) => `${img.rejection_image_url}?idx=${idx}`) // Add index to differentiate duplicates
                                                    : [item.rejection_image_url]
                                            }
                                        >
                                            <Carousel
                                                dots
                                                arrows
                                                className="rejection-images-carousel"
                                            >
                                                {item.rejection_images?.length > 0 ? (
                                                    item.rejection_images.map((img, idx) => (
                                                        <div key={`${img.rejection_image_url}-${idx}`} className="carousel-image-wrapper"> {/* Use unique key */}
                                                            <Image
                                                                src={img.rejection_image_url || "https://via.placeholder.com/150?text=No+Image"}
                                                                alt={`Rejection evidence ${idx + 1}`}
                                                                fallback="https://via.placeholder.com/400x300?text=Image+Not+Available"
                                                                className="rejection-image"
                                                                preview={{
                                                                    mask: (
                                                                        <div className="preview-mask">
                                                                            <Search size={16} />
                                                                            <span>View</span>
                                                                        </div>
                                                                    ),
                                                                    visible: !!img.rejection_image_url
                                                                }}
                                                            />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="carousel-image-wrapper">
                                                        <Image
                                                            src={item.rejection_image_url}
                                                            alt="Rejection evidence"
                                                            fallback="https://via.placeholder.com/400x300?text=Image+Not+Available"
                                                            className="rejection-image"
                                                            preview={{
                                                                mask: (
                                                                    <div className="preview-mask">
                                                                        <Search size={16} />
                                                                        <span>View</span>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Carousel>
                                        </Image.PreviewGroup>
                                        <div className="image-counter">
                                            {item.rejection_images?.length > 1 && (
                                                <span>
                                                    {item.rejection_images.length} images available
                                                </span>
                                            )}
                                            {!item.rejection_images && item.rejection_image_url && (
                                                <span>1 image available</span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-52 h-40 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-5 transition-all duration-300 hover:border-slate-400 hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200">
                                        <div className="flex flex-col items-center text-center gap-3">
                                            {/* Icon container */}
                                            <div className="flex items-center justify-center w-12 h-12 bg-slate-200 rounded-full transition-all duration-300 hover:bg-slate-300 hover:scale-105">
                                                <svg
                                                    className="w-6 h-6 text-slate-500 transition-colors duration-300 hover:text-slate-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>

                                            {/* Text content */}
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold text-slate-600 m-0">No Images Available</h4>
                                                <p className="text-xs text-slate-500 m-0 max-w-36 leading-tight">No rejection images were captured for this item</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        >
                            <List.Item.Meta
                                title={
                                    <div className="rejection-header">
                                        <Tag color="red" className="rejection-tag">
                                            Rejected
                                        </Tag>
                                        <span className="sku-code">{item.unique_code}</span>
                                    </div>
                                }
                                description={
                                    <div className="rejection-details">
                                        <div className="detail-row">
                                            <ClockCircleOutlined className="detail-icon" />
                                            <span className="detail-label">Rejected at:</span>
                                            <span className="detail-value">
                                                {new Date(item.rejection_time).toLocaleString()}
                                            </span>
                                        </div>

                                        {item.rejection_reason && (
                                            <div className="detail-row">
                                                <ExclamationCircleOutlined className="detail-icon" />
                                                <span className="detail-label">Reason:</span>
                                                <span className="detail-value reason">
                                                    {item.rejection_reason}
                                                </span>
                                            </div>
                                        )}

                                        {item.rejection_description && (
                                            <div className="detail-row">
                                                <FileTextOutlined className="detail-icon" />
                                                <span className="detail-label">Details:</span>
                                                <span className="detail-value">
                                                    {item.rejection_description}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                            <Divider className="rejection-divider" />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
}

export default DailyGoodsReturnReport;