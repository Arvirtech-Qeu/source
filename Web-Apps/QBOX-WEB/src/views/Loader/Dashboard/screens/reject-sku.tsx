import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MapPin, Globe, Building2, User, Truck, Barcode, CheckCircle, SearchX, Pencil, Trash2, RotateCcw, ListOrdered, ShoppingBag, AlertCircle, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { createDeliiveryPartner, deleteDeliiveryPartner, getAllDeliiveryPartner, updateDeliiveryPartner } from '@state/deliveryPartnerSlice';
import CommonHeader from '@components/common-header';
import { Column, Table } from '@components/Table';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { getDailyGoodsReturnedReport, getDailyStockReport } from '@state/reportSlice';
import { getDailyStockReportV2, getQboxEntities } from '@state/loaderDashboardSlice';
import { getAllArea } from '@state/areaSlice';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import ImagePopup from '@components/imagePopup';


interface OrderProps {
    isHovered: any;
}


const DashboardRejectSku: React.FC<OrderProps> = ({ isHovered }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { getDailyStockReportV2List } = useSelector((state: RootState) => state.loaderDashboard);
    const [filters, setFilters] = useState({
        qbox_entity_sno: '',
        area_sno: '',
    });
    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const { getQboxEntity } = useSelector((state: RootState) => state.loaderDashboard);
    const { areaList } = useSelector((state: RootState) => state.area);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);


    const dispatch = useDispatch<AppDispatch>();

    // Add this function to get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    useEffect(() => {
        // Update to use current date
        dispatch(getDailyStockReportV2({ "transaction_date": getCurrentDate() }));
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
            key: 'partner_purchase_order_id',
            header: 'Purchase Order Id',
            sortable: false,
        },
        {
            key: 'qbox_entity_name',
            header: 'Delivery Location',
            sortable: false,
        },
        {
            key: 'area_name',
            header: 'Location',
            sortable: false,
        },
        {
            key: 'food_sku_description',
            header: 'SKU Name',
            sortable: false,
        },
        {
            key: 'rejected_count',
            header: 'Units',
            sortable: false,
        },
        {
            key: 'transaction_date',
            header: 'Purchase Date',
            sortable: false,
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalItems = getDailyStockReportV2List?.rejectSkuList?.length;

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        // Update filters state
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'qbox_entity_sno' && {
                area_sno: '',
            }),
        }));

        // Dynamically build processed filters
        const processedFilters: any = {
            ...filters,
            [name]: value === 'all' ? null : value,
            transaction_date: getCurrentDate() // Add current date to filters
        };

        // Ensure dependent filters are reset for 'qboxEntitySno'
        if (name === 'qbox_entity_sno') {
            processedFilters.area_sno = null;
        }

        // Normalize 'all' and empty string values across filters
        Object.keys(processedFilters).forEach((key) => {
            if (processedFilters[key] === 'all' || processedFilters[key] === '') {
                processedFilters[key] = null;
            }
        });
        dispatch(getDailyStockReportV2(processedFilters));
    };

    // Update reset button handler
    const handleReset = () => {
        setFilters({
            qbox_entity_sno: "",
            area_sno: "",
        });
        dispatch(getDailyStockReportV2({ transaction_date: getCurrentDate() }));
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
                                    <AlertCircle className="w-8 h-8 text-color" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900">Rejected Sku</h1>
                                    <p className="text-gray-500 mt-2">View your Rejected Sku</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div className="w-full mt-6">
                            <div className="flex items-center justify-end space-x-4 min-w-max">
                                {/* Delivery Location Select */}
                                <select
                                    name="qbox_entity_sno"
                                    value={filters.qbox_entity_sno}
                                    onChange={handleFilterChange}
                                    className="w-52 px-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-red-500/20"
                                >
                                    {/* <option value="">Select Delivery Location</option> */}
                                    <option value="all">All Delivery Location</option>
                                    {getQboxEntity?.map((qbe) => (
                                        <option key={qbe.qboxEntitySno} value={qbe.qboxEntitySno}>
                                            {qbe.qboxEntityName}
                                        </option>
                                    ))}
                                </select>

                                {/* Delivery Aggregator Select */}
                                <select
                                    name="area_sno"
                                    value={filters.area_sno}
                                    onChange={handleFilterChange}
                                    className="w-56 px-4 py-2.5 bg-white/70 rounded-full border border-gray-200 focus:ring-2 focus:ring-red-500/20"
                                >
                                    {/* <option value="">Select Delivery Aggregator</option> */}
                                    <option value="all">All Location</option>
                                    {areaList?.map((dp) => (
                                        <option key={dp.areaSno} value={dp.areaSno}>
                                            {dp.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Reset Button */}
                                <button
                                    onClick={handleReset}
                                    className="whitespace-nowrap px-4 py-2.5 text-sm font-medium text-white bg-color rounded-lg hover:bg-color focus:outline-none focus:ring-2 focus:ring-red-300 inline-flex items-center"
                                >
                                    <RotateCcw size={15} className="mr-2" />
                                    Reset
                                </button>


                            </div>
                        </div>

                    </div>

                    <div className='mt-8'>
                        {getDailyStockReportV2List?.rejectSkuList?.length > 0 ? (
                            <Table
                                columns={columns}
                                data={getDailyStockReportV2List?.rejectSkuList?.map((report, index) => ({
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

export default DashboardRejectSku;