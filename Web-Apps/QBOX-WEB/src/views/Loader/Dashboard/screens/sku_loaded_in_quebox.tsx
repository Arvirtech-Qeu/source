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
import { getDailyStockReportV2, getHotboxCountv3, getQboxEntities, getSkuInQboxInventory } from '@state/loaderDashboardSlice';
import { getAllArea } from '@state/areaSlice';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import { useNavigate } from 'react-router-dom';
import { useFilterContext } from '@context/FilterProvider';
import { getFromLocalStorage } from '@utils/storage';


interface OrderProps {
    isHovered: any;
}

const SkuLoadedInQueBox: React.FC<OrderProps> = ({ isHovered }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { getHotboxCountLists } = useSelector((state: RootState) => state.loaderDashboard);
    const { getSkuInQboxInventoryList } = useSelector((state: RootState) => state.loaderDashboard);

    const [filters, setFilters] = useState({
        qboxEntitySno: '',
        area_sno: '',
    });
    const { getQboxEntity } = useSelector((state: RootState) => state.loaderDashboard);
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
            ? `/inventory/sku-loaded-in-qeubox/qbox-location-dashboard`
            : roleName === 'Loader'
                ? `/loader-dashboard`
                : roleName === 'Supervisor'
                    ? `/inventory/sku-loaded-in-qeubox/supervisor-dashboard`
                    : `/aggregator-admin-dashboard`;

        navigate(`${baseUrl}?qboxEntitySno=${qboxEntitySno}
        &transactionDate=${getCurrentDate()}&qboxEntityName=${qboxEntityName}
        &roleId=${roleId}&areaName=${areaName}&&deliveryPartnerSno=${deliveryPartnerSno}`, {
            state: {
                activeTab: 'qboxInventory'
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
    };


    useEffect(() => {
        // Update to use current date
        dispatch(getSkuInQboxInventory({ "transactionDate": getCurrentDate() }));
        dispatch(getQboxEntities({}));
        dispatch(getAllArea({}))
    }, [dispatch]);

    const columns: Column<any>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: false,
        },
        {
            key: 'menu',
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
            key: 'uniqueCode',
            header: 'Unique Code',
            sortable: false,
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <div className="relative">
                    {/* <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => handleLocationClick(row.qboxEntitySno, row.qboxEntityName, row.areaName)}
                        title="View Details"
                    >
                        <Eye className="h-5 w-5 text-color hover:text-blue-600 transition-colors" />
                    </button> */}
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

    const totalItems = getSkuInQboxInventoryList?.length;

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
                                    <h1 className="text-3xl font-semibold text-gray-900">Items in QeuBox</h1>
                                    <p className="text-gray-500 mt-2">View your items in qeubox</p>
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
                        {getSkuInQboxInventoryList?.length > 0 ? (
                            <Table
                                columns={columns}
                                data={getSkuInQboxInventoryList?.map((report, index) => ({
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

export default SkuLoadedInQueBox;