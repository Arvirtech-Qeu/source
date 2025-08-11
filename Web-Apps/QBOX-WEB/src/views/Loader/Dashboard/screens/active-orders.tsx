import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MapPin, Globe, Building2, User, Truck, Barcode, CheckCircle, SearchX, Pencil, Trash2, RotateCcw, ListOrdered, ShoppingBag, Box, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { createDeliiveryPartner, deleteDeliiveryPartner, getAllDeliiveryPartner, updateDeliiveryPartner } from '@state/deliveryPartnerSlice';
import CommonHeader from '@components/common-header';
import { Column, Table } from '@components/Table';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { getDailyGoodsReturnedReport, getDailyStockReport } from '@state/reportSlice';
import { getDailyStockReportV2, getHotboxCountv3, getQboxEntities } from '@state/loaderDashboardSlice';
import { getAllArea } from '@state/areaSlice';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import { useNavigate } from 'react-router-dom';
import { useFilterContext } from '@context/FilterProvider';
import { getFromLocalStorage } from '@utils/storage';


interface OrderProps {
    isHovered: any;
}

const DashboardActiveOrders: React.FC<OrderProps> = ({ isHovered }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { getHotboxCountLists } = useSelector((state: RootState) => state.loaderDashboard);
    const [filters, setFilters] = useState({
        qboxEntitySno: '',
        area_sno: '',
    });
    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const { getQboxEntity } = useSelector((state: RootState) => state.loaderDashboard);
    const { areaList } = useSelector((state: RootState) => state.area);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { setFilters: setGlobalFilters } = useFilterContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleId, setRoleId] = useState<number | null>(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno] = useState<number | null>(null);
    const [deliveryPartnerName, setDeliveryPartnerName] = useState<number | null>(null);
    const [deliveryPartnerLogo, setDeliveryPartnerLogo] = useState<string | null>(null);
    const [roleName, setRoleName]: any = useState(null);
    const [authUserSno, setAuthUserSno] = useState<number | null>(null);
    const [areaSno, setAreaSno]: any = useState(null);

    // Add this function to get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

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

                setRoleId(roleId);
                setRoleName(loginDetails?.roleName);
                setDeliveryPartnerSno(loginDetails?.deliveryPartnerSno);
                setDeliveryPartnerName(loginDetails?.deliveryPartnerName);
                setDeliveryPartnerLogo(loginDetails?.logoUrl);
                setAuthUserSno(loginDetails?.signinConfigSno?.data?.authUserId);
                setAreaSno(loginDetails.areaSno || null);

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    const handleLocationClick = (qboxEntitySno: any, qboxEntityName: any, areaName: any) => {
        const isSuperOrAdmin = roleName === 'Super Admin' || roleName === 'Admin';

        const baseUrl = isSuperOrAdmin
            ? `/inventory/active-orders/qbox-location-dashboard`
            : roleName === 'Loader'
                ? `/loader-dashboard`
                : roleName === 'Supervisor'
                    ? `/inventory/active-orders/supervisor-dashboard`
                    : `/aggregator-admin-dashboard`;

        // First fetch the data
        dispatch(getHotboxCountv3({
            qboxEntitySno,
            transactionDate: getCurrentDate()
        })).then(() => {
            // Then navigate after data is fetched
            navigate(`${baseUrl}?qboxEntitySno=${qboxEntitySno}
            &transactionDate=${getCurrentDate()}&qboxEntityName=${qboxEntityName}
            &roleId=${roleId}&areaName=${areaName}&&deliveryPartnerSno=${deliveryPartnerSno}`, {
                state: {
                    activeTab: 'inventoryBox',
                    qboxEntitySno,
                    qboxEntityName
                }
            });

            setGlobalFilters({
                qboxEntitySno: qboxEntitySno || '',
                qboxEntityName: qboxEntityName,
                transactionDate: getCurrentDate(),
                roleId: roleId !== null ? roleId : 0,
                deliveryPartnerSno: deliveryPartnerSno !== null ? deliveryPartnerSno : 0,
                areaName: areaName || '',
            });
        });
    };

    useEffect(() => {
        const getPayloadByRole = () => {
            const basePayload = {
                transactionDate: getCurrentDate()
            };

            switch (roleName) {
                case 'Admin':
                    return {
                        ...basePayload,
                        areaSno: areaSno || null
                    };
                case 'Supervisor':
                    return {
                        ...basePayload,
                        authUserSno: authUserSno || null
                    };
                case 'Super Admin':
                case 'Aggregator Admin':
                    return basePayload;
                default:
                    return basePayload;
            }
        };

        dispatch(getHotboxCountv3(getPayloadByRole()));
        dispatch(getQboxEntities({}));
        dispatch(getAllArea({}));
    }, [dispatch, roleName, authUserSno, filters.area_sno]);


    const columns: Column<any>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: false,
        },
        {
            key: 'description',
            header: 'Sku Name',
            sortable: false,
        },
        {
            key: 'skuCode',
            header: 'Sku Code',
            sortable: false,
        },
        {
            key: 'qboxEntityName',
            header: 'Delivery Location',
            sortable: false,
        },
        {
            key: 'areaName',
            header: 'Location',
            sortable: false,
        },
        {
            key: 'hotBoxCount',
            header: 'Units',
            sortable: false,
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <div className="relative">
                    <button
                        className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color"
                        onClick={() => handleLocationClick(row.qboxEntitySno, row.qboxEntityName, row.areaName)}
                    >
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-white">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                        </span>
                    </button>
                </div>
            )
        }

    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalItems = getHotboxCountLists?.hotboxCounts?.length;

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        // Update filters state
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'qboxEntitySno' && {
                area_sno: '',
            }),
        }));

        // Dynamically build processed filters
        const processedFilters: any = {
            ...filters,
            [name]: value === 'all' ? null : value,
            transactionDate: getCurrentDate() // Add current date to filters
        };

        // Ensure dependent filters are reset for 'qboxEntitySno'
        if (name === 'qboxEntitySno') {
            processedFilters.area_sno = null;
        }

        // Normalize 'all' and empty string values across filters
        Object.keys(processedFilters).forEach((key) => {
            if (processedFilters[key] === 'all' || processedFilters[key] === '') {
                processedFilters[key] = null;
            }
        });
        dispatch(getHotboxCountv3(processedFilters));
    };

    // Update reset button handler
    const handleReset = () => {
        setFilters({
            qboxEntitySno: "",
            area_sno: "",
        });
        dispatch(getHotboxCountv3({ transactionDate: getCurrentDate() }));
    };

    return (
        <div className="min-h-screen ">
            <div className="custom-gradient-left h-32" />
            <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14'}`}>
                <div className="max-w-8xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex items-center gap-4  rounded-xl">
                                <div className="low-bg-color p-3 rounded-xl">
                                    <Box className="w-8 h-8 text-color" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900">Items in HotBox</h1>
                                    <p className="text-gray-500 mt-2">View your items in hotbox</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div className="w-full mt-6">
                            <div className="flex items-center justify-end space-x-4 min-w-max">
                                {/* Delivery Location Select */}
                                <select
                                    name="qboxEntitySno"
                                    value={filters.qboxEntitySno}
                                    onChange={handleFilterChange}
                                    className="w-52 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500/20"
                                >
                                    {/* <option value="">Select Delivery Location</option> */}
                                    <option value="all">All Delivery Location</option>
                                    {getQboxEntity?.map((qbe) => (
                                        <option key={qbe.qboxEntitySno} value={qbe.qboxEntitySno}>
                                            {qbe.qboxEntityName}
                                        </option>
                                    ))}
                                </select>

                                {/* Reset Button */}
                                <button
                                    onClick={handleReset}
                                    className="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-white bg-color rounded-lg hover:bg-color focus:outline-none focus:ring-2 focus:ring-color inline-flex items-center"
                                >
                                    <RotateCcw size={15} className="mr-2" />
                                    Reset
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className='mt-8'>
                        {getHotboxCountLists?.hotboxCounts?.length > 0 ? (
                            <Table
                                columns={columns}
                                data={getHotboxCountLists?.hotboxCounts?.map((report, index) => ({
                                    ...report,
                                    sno: index + 1,
                                }))}
                                rowsPerPage={10}
                                initialSortKey="Sno"
                                globalSearch={false}
                            />
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardActiveOrders;