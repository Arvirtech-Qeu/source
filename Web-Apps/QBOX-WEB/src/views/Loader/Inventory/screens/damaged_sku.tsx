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
import { getAllArea } from '@state/areaSlice';
import { getRejectSku } from '@state/superAdminDashboardSlice';
import { getQboxEntities } from '@state/loaderDashboardSlice';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import ImagePopup from '@components/imagePopup';


interface OrderProps {
    isHovered: any;
}


const DamagedSku: React.FC<OrderProps> = ({ isHovered }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { rejectSkuList } = useSelector((state: RootState) => state.dashboardSlice);
    const [filters, setFilters] = useState({
        qboxEntitySno: '',
        area_sno: '',
    });
    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const { getQboxEntity } = useSelector((state: RootState) => state.loaderDashboard);
    const { areaList } = useSelector((state: RootState) => state.area);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const [images, setImages]: any = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    // Add this function to get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    useEffect(() => {
        // Update to use current date
        dispatch(getRejectSku({ transactionDate: getCurrentDate() }));
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
            key: 'orderId',
            header: 'Purchase Order Id',
            sortable: false,
        },
        {
            key: 'transactionDate',
            header: 'Purchase Date',
            sortable: false,
        },
        {
            key: 'restaurantName',
            header: 'Restaurant',
            sortable: false,
        },
        {
            key: 'menu',
            header: 'SKU Name',
            sortable: false,
        },
        {
            key: 'skuCode',
            header: 'SKU Code',
            sortable: false,
        },
        {
            key: 'qboxEntityName',
            header: 'Delivery Location',
            sortable: false,
        },
        {
            key: 'reason',
            header: 'Reject Reason',
            sortable: false,
        },
        {
            key: 'mediaDetails',
            header: 'View Picture',
            sortable: false,
            render: (row: any) => (
                row.mediaDetails ? (
                    <button
                        className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color"
                        onClick={() => handleViewClick(row.mediaDetails)}
                    >
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-white">
                            <Eye className="h-4 w-4 mr-2" />
                            View Picture
                        </span>
                    </button>
                ) : (
                    <span>{row.Restock}</span>
                )
            )
        }
    ];

    const handleViewClick = (mediaDetails: any) => {
        if (!mediaDetails || !Array.isArray(mediaDetails)) {
            return;
        }

        // Flatten the nested array and extract media URLs
        const imageUrls = mediaDetails.flat().map((item: any) => item.mediaUrl);

        if (imageUrls.length === 0) {
            return;
        }

        console.log(imageUrls);
        setImages(imageUrls);
        setShowPopup(true);
    };


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
        dispatch(getRejectSku(processedFilters));
    };

    // Update reset button handler
    const handleReset = () => {
        setFilters({
            qboxEntitySno: "",
            area_sno: "",
        });
        dispatch(getRejectSku({ transactionDate: getCurrentDate() }));
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
                                    <h1 className="text-3xl font-semibold text-gray-900">Damaged Sku Details</h1>
                                    <p className="text-gray-500 mt-2">View your Damaged Sku</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div>
                        {showPopup && <ImagePopup images={images} onClose={() => setShowPopup(false)} />}
                    </div>

                    <div className='mt-8'>
                        {rejectSkuList?.length > 0 ? (
                            <Table
                                columns={columns}
                                data={rejectSkuList?.map((report, index) => ({
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

export default DamagedSku;