import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MapPin, Globe, Building2, User, Truck, Barcode, CheckCircle, SearchX, Pencil, Trash2, RotateCcw, ListOrdered, ShoppingBag, AlertCircle, Box, Timer, Flame, XCircle, Utensils, CupSoda, Sandwich, SoupIcon, MousePointerClick, MousePointer, ExternalLink } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { createDeliiveryPartner, deleteDeliiveryPartner, getAllDeliiveryPartner, updateDeliiveryPartner } from '@state/deliveryPartnerSlice';
import CommonHeader from '@components/common-header';
import { Column, Table } from '@components/Table';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { getDailyGoodsReturnedReport, getDailyStockReport } from '@state/reportSlice';
import { getQboxEntities } from '@state/loaderDashboardSlice';
import { getAllArea } from '@state/areaSlice';
import { searchSkuInventory } from '@state/supplyChainSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { EmptyState } from '../Common widgets/empty_state';


interface OrderedSkuDtlProps {
    isHovered: any;
}

const REJECTED_STAGE_CODE = 8;

const OrderedSkuDtl: React.FC<OrderedSkuDtlProps> = ({ isHovered }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { skuInventoryList } = useSelector((state: RootState) => state.supplyChain);
    const { getQboxEntity } = useSelector((state: RootState) => state.loaderDashboard);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const [purchaseOrderDtlSno, setPurchaseOrderDtlSno] = useState<number | null>(null);
    // Add this function to get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    useEffect(() => {
        const currentPurchaseOrderDtlSno = location.state?.purchaseOrderDtlSno;

        if (currentPurchaseOrderDtlSno) {
            setPurchaseOrderDtlSno(currentPurchaseOrderDtlSno);
            dispatch(searchSkuInventory({ purchaseOrderDtlSno: currentPurchaseOrderDtlSno }));
        }
    }, [dispatch, location.state?.purchaseOrderDtlSno]);

    const handleSkuTrack = (skuInventorySno: number) => {
        navigate('/orders/order-cards-view/ordered-sku-dtl/food-tracking', {
            state: {
                skuInventorySno,
                purchaseOrderDtlSno // Pass the stored purchaseOrderDtlSno
            }
        });
    };

    const columns: Column<any>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: false,
        },
        {
            key: 'uniqueCode',
            header: 'Unique Code',
            sortable: false,
        },
        {
            key: 'wfStageCd',
            header: 'Stage',
            render: (value) => {
                const stageMap: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
                    6: { label: 'Awaiting Delivery', color: 'bg-yellow-100 text-yellow-600', icon: <Timer size={16} /> },
                    7: { label: 'Delivery', color: 'bg-yellow-100 text-yellow-600', icon: <Truck size={16} /> },
                    8: { label: 'Rejected', color: 'bg-red-100 text-red-600', icon: <XCircle size={16} /> },
                    9: { label: 'Accepted', color: 'bg-green-100 text-green-600', icon: <CheckCircle size={16} /> },
                    10: { label: 'In Hot Box', color: 'bg-orange-100 text-orange-600', icon: <Flame size={16} /> },
                    11: { label: 'In Qeu Box', color: 'bg-blue-100 text-blue-600', icon: <Box size={16} /> },
                    12: { label: 'Returned to Hot Box', color: 'bg-gray-100 text-gray-600', icon: <RotateCcw size={16} /> },
                    13: { label: 'Outward Delivery', color: 'bg-indigo-100 text-indigo-600', icon: <Truck size={16} /> },
                };
                const stage = stageMap[value.wfStageCd] || { label: 'Unknown', color: 'bg-gray-100 text-gray-500', icon: <Search size={16} /> };

                return (
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-medium ${stage.color}`}>
                        {stage.icon}
                        {stage.label}
                    </div>
                );
            }
        },
        {
            key: 'Sku Tracking',
            header: 'Sku Tracking',
            render: (value) => (
                <button
                    className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color"
                    onClick={() => handleSkuTrack(value.skuInventorySno)}
                >
                    <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Track SKU
                    </span>
                </button>
            )
        }


    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalItems = skuInventoryList?.length;

    const processedSkuData = useMemo(() => {
        if (!skuInventoryList?.length) return [];

        // Check if any SKU is rejected
        const hasRejectedSkus = skuInventoryList.some(sku => sku.wfStageCd === REJECTED_STAGE_CODE);

        // If there are rejected SKUs, only show those
        const filteredSkus = hasRejectedSkus
            ? skuInventoryList.filter(sku => sku.wfStageCd === REJECTED_STAGE_CODE)
            : skuInventoryList;

        return filteredSkus.map((sku, index) => ({
            ...sku,
            sno: index + 1,
        }));
    }, [skuInventoryList]);

    return (
        <div className="min-h-screen ">
            <div className="custom-gradient-left h-32" />
            <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14'}`}>
                <div className="max-w-8xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex items-center gap-4  rounded-xl">
                                <div className="low-bg-color p-3 rounded-xl">
                                    <SoupIcon className="w-8 h-8 text-color" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900">Sku Details</h1>
                                    <p className="text-gray-500 mt-2">View your sku details</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='my-8'>
                        {processedSkuData.length > 0 ? (
                            <>
                                <Table
                                    columns={columns}
                                    data={processedSkuData}
                                    rowsPerPage={10}
                                    initialSortKey="Sno"
                                    globalSearch={false}
                                />
                            </>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderedSkuDtl;