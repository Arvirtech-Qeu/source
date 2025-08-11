import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import {
    acceptSku,
    rejectSku,
    searchPurchaseOrder,
    searchPurchaseOrderDtl,
    searchSkuInventory
} from "@state/supplyChainSlice";
import {
    Search, ChevronDown, ChevronUp,
    Package, CheckCircle,
    XCircle,
    Box,
    Timer,
    AlertCircle,
    Truck,
    ExternalLink,
    SearchX,
    ArrowDownCircle,
    ShoppingBag,
    RotateCcw,
    Flame,
    Award,
    Calendar,
    Utensils,
    ArrowUpCircle
} from "lucide-react";
import {
    MasterCard,
} from "@components/MasterCard";
import './custom.css';
import { useLocation, useNavigate } from 'react-router-dom';
import FoodSkuTracking from './food-sku-traking';
import OutwardOrders from './outward-orders';
import DateTime from '@components/DateTime';
// import OutwardOrders from './outward-orders';

interface InwardOrdersProps {
    qboxEntitySno: any;
    partnerPurchaseOrderId: any
    transactionDate: any
    inwardOrderDetailList: any,
    deliveryPartnerSno: any
}

const InwardOrders: React.FC<InwardOrdersProps> = ({ partnerPurchaseOrderId, qboxEntitySno, transactionDate, inwardOrderDetailList, deliveryPartnerSno }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { purchaseOrderList, purchaseOrderDtlList, skuInventoryList } = useSelector((state: RootState) => state.supplyChain);
    const [selectedCardId, setSelectedCardId]: any = useState(null);
    const [searchQuery, setsearchQuery] = React.useState('');
    const [orderStats, setOrderStats] = useState({
        awaitingDelivery: 0,
        accepted: 0,
        inHotBox: 0,
        inQueueBox: 0,
        returnedToHotBox: 0,
        outwardDelivery: 0,
        rejected: 0
    });
    const [showStats, setShowStats] = useState(false);
    const navigate = useNavigate();
    const locations = useLocation();
    const [skuInventorySno, setSkuInventorySno] = useState('');
    // const transactionDate = locations.state?.transactionDate || new URLSearchParams(locations.search).get("transactionDate");

    const getStatusIcon = (wfStageCd) => {
        const iconProps = { size: 16, className: "mr-2" };
        switch (wfStageCd) {
            case 6: return <ShoppingBag {...iconProps} className="text-yellow-600 mr-1" />;
            case 7: return <Timer {...iconProps} className="text-blue-600 mr-1" />;
            case 8: return <XCircle {...iconProps} className="text-color mr-1" />;
            case 9: return <CheckCircle {...iconProps} className="text-green-600 mr-1" />;
            case 10: return <Flame {...iconProps} className="text-orange-600 mr-1" />;
            case 11: return <Box {...iconProps} className="text-purple-600 mr-1" />;
            case 12: return <RotateCcw {...iconProps} className="text-indigo-600 mr-1" />;
            case 13: return <Truck {...iconProps} className="text-teal-600 mr-1" />;
            default: return null;
        }
    };

    const dispatch = useDispatch<AppDispatch>();

    const getFilteredData = () => {
        if (selectedStatus === 'all') {
            return skuInventoryList;
        }

        return skuInventoryList.filter((sku) => {
            switch (selectedStatus) {
                case 'awaitingDelivery':
                    return sku.wfStageCd === 6;
                case 'rejected':
                    return sku.wfStageCd === 8;
                case 'accepted':
                    return sku.wfStageCd === 9;
                case 'inHotBox':
                    return sku.wfStageCd === 10;
                case 'inQueueBox':
                    return sku.wfStageCd === 11;
                case 'returnedToHotBox':
                    return sku.wfStageCd === 12;
                case 'outwardDelivery':
                    return sku.wfStageCd === 13;
                default:
                    return true;
            }
        });
    };

    // Update these variables to use filtered data
    const filteredList = getFilteredData();
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredList.slice(startIndex, endIndex);

    useEffect(() => {
        dispatch(searchPurchaseOrder({
            qboxEntitySno: qboxEntitySno,
            partnerPurchaseOrderId: partnerPurchaseOrderId,
            transactionDate: transactionDate, deliveryPartnerSno: deliveryPartnerSno
        }));
    }, [dispatch, qboxEntitySno]);

    // Add this new useEffect after your other useEffects
    useEffect(() => {
        // Clear purchase order details when purchaseOrderList changes
        dispatch({ type: 'supplyChain/setPurchaseOrderDtlList', payload: [] });
        setSelectedCardId(null);
        setOpenDropdown(null);
    }, [purchaseOrderList]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };

    const handleCardClick = (id: number, purchaseOrderSno: string, qboxEntitySno) => {
        setSelectedCardId(id);
        dispatch(searchPurchaseOrderDtl({ qboxEntitySno, purchaseOrderSno }));
    };

    const handleSku = (purchaseOrderDtlSno) => {
        setOpenDropdown(prevState => prevState === purchaseOrderDtlSno ? null : purchaseOrderDtlSno);
        dispatch(searchSkuInventory({ purchaseOrderDtlSno }));
        setSelectedStatus('all')

    };

    const handleAcceptSKU = async (skuInventorySno: any, purchaseOrderDtlSno: any) => {
        try {
            // Dispatch acceptSku action
            await dispatch(acceptSku({ skuInventorySno }));

            // Once acceptSku is successful, dispatch searchSkuInventory
            await dispatch(searchSkuInventory({ purchaseOrderDtlSno }));
        } catch (error) {
            console.error("Error occurred while processing SKU:", error);
        }
    };


    const handleRejectSKU = async (skuInventorySno: any, purchaseOrderDtlSno: any) => {
        try {
            // Dispatch rejectSku action
            await dispatch(rejectSku({ skuInventorySno }));

            // Once rejectSku is successful, dispatch searchSkuInventory
            await dispatch(searchSkuInventory({ purchaseOrderDtlSno }));
        } catch (error) {
            console.error("Error occurred while processing SKU:", error);
        }
    }

    const handleSkuTracking = (skuInventorySno: any) => {
        setSkuInventorySno(skuInventorySno)
        if (!skuInventorySno) {
            console.error("SKU Inventory ID is missing");
            return;
        }
        // Update the active tab state before navigating
        setActiveTab("foodTracking");
    };


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const qboxEntitySnoParam = queryParams.get('qboxEntitySno');
    const partnerPurchaseOrderIdParam = queryParams.get('partnerPurchaseOrderId');

    // Update the useEffect for initial data fetch:
    useEffect(() => {
        const fetchData = async () => {
        };

        fetchData();
    }, [dispatch, qboxEntitySnoParam, qboxEntitySno, partnerPurchaseOrderIdParam, partnerPurchaseOrderId]);

    // Add a function to filter purchase orders:
    const filteredPurchaseOrders = useMemo(() => {
        if (!purchaseOrderList) return [];

        if (partnerPurchaseOrderIdParam) {
            return purchaseOrderList.filter(order =>
                order.partnerPurchaseOrderId === partnerPurchaseOrderIdParam
            );
        }

        return purchaseOrderList;
    }, [purchaseOrderList, partnerPurchaseOrderIdParam]);

    const [activeTab, setActiveTab] = useState('inwardOrder');

    const filteredPurchaseOrder = purchaseOrderList?.filter(sales =>
        sales.partnerPurchaseOrderId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <>
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => {
                                dispatch(searchPurchaseOrder({
                                    qboxEntitySno: qboxEntitySno,
                                    transactionDate: transactionDate,
                                    deliveryPartnerSno: deliveryPartnerSno
                                }));
                                setActiveTab('inwardOrder')
                            }}
                            className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'inwardOrder'
                                ? 'border-color text-color'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <ArrowDownCircle className="w-4 h-4" />
                            Inward Order
                        </button>
                        <button
                            onClick={() => setActiveTab('inwardOrderDetails')}
                            className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'inwardOrderDetails'
                                ? 'border-color text-color'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Inward Order Details
                        </button>
                        <button
                            onClick={() => setActiveTab('outwardOrder')}
                            className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'outwardOrder'
                                ? 'border-color text-color'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <ArrowUpCircle className="w-4 h-4" />
                            OutwardOrder
                        </button>
                        <button
                            onClick={() => {
                                // dispatch(searchPurchaseOrder(qboxEntitySno != '0' ? {
                                //     qboxEntitySno: qboxEntitySno,
                                //     transactionDate: transactionDate, deliveryPartnerSno: deliveryPartnerSno
                                // } : {}));
                                setActiveTab('foodTracking')
                            }}
                            className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'foodTracking'
                                ? 'border-color text-color'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Utensils className="w-4 h-4" />
                            Food Tracking
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === "inwardOrder" && (
                <div className="bg-gray-50 min-h-screen">
                    {/* <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}> */}
                    {filteredPurchaseOrder?.length === 0 && !selectedCardId ? (

                        <div className="flex-1 flex justify-center items-center h-64 px-4 flex justify-center items-center  bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex flex-col justify-center items-center w-full max-w-md">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 mx-auto mb-2">
                                        <AlertCircle className="w-full h-full text-color" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">No Inward Orders Found</h3>
                                    <p className="text-gray-600">No matching Inward Orders were found.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Header Section */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className='flex'>
                                        <h1 className="text-2xl text-color flex items-center gap-1.5">
                                            <ArrowDownCircle className='w-8 h-8 text-color' />
                                            Inward Orders</h1>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">Manage and track your incoming orders</p>
                                </div>
                            </div>

                            {/* Statistics Cards */}
                            {showStats && (
                                <div className="grid grid-cols-6 gap-6 mb-8">
                                    {[
                                        { label: 'Awaiting Delivery', icon: Timer, color: 'yellow' },
                                        { label: 'In Hot Box', icon: Flame, color: 'orange' },
                                        { label: 'In QBox', icon: Box, color: 'purple' },
                                        { label: 'Return To Hot Box', icon: RotateCcw, color: 'brown' },
                                        { label: 'Outward Delivered', icon: Truck, color: 'green' },
                                        { label: 'Rejected', icon: XCircle, color: 'red' }

                                    ].map(({ label, icon: Icon, color }) => (
                                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-500 text-sm">{label}</p>
                                                    <p className="text-2xl font-bold mt-1">{orderStats[label.toLowerCase()] || 0}</p>
                                                </div>
                                                <Icon className={`text-${color}-500`} size={24} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Search and Filter Section */}
                            <div className="flex gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search orders by ID..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        value={searchQuery}
                                        onChange={(e) => setsearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {['all', 'awaitingDelivery', 'inHotBox', 'inQueueBox', 'returnedToHotBox', 'outwardDelivery', 'rejected'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusFilter(status)}
                                            className={`px-4 py-2 rounded-lg capitalize ${selectedStatus === status
                                                ? 'bg-color text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex gap-6">
                                {/* Orders List */}
                                <div className="w-80 space-y-4">
                                    {filteredPurchaseOrder?.length === 0 && !selectedCardId ? (
                                        <div>
                                            <div className="flex flex-col items-center">
                                                <SearchX size={64} className="text-color mb-4" />
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Inward Orders Found</h3>
                                                <p className="text-gray-500 text-center">No matching Inward Orders were found.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <h2 className="text-lg font-semibold mb-4">Order List</h2>
                                            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-2">
                                                {filteredPurchaseOrder?.map((order, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleCardClick(index, order.purchaseOrderSno, qboxEntitySno)}
                                                        className={`p-4 rounded-lg cursor-pointer transition-all ${selectedCardId === index
                                                            ? 'low-bg-color border-color'
                                                            : 'bg-gray-50 hover:bg-gray-100'
                                                            } border`}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <p className="font-medium text-gray-800">{order.partnerPurchaseOrderId}</p>
                                                                <p className="text-sm text-gray-500 mt-1">{order.restaurant1name}</p>
                                                                <div className='text-sm mt-2'>
                                                                    <DateTime date={order.orderedTime} showTimeIcon={false} showDateIcon={false} />
                                                                </div>
                                                            </div>
                                                            <Box size={16} className="text-gray-400" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Order Details */}
                                <div className="flex-1 space-y-6">
                                    {filteredPurchaseOrder?.length > 0 && selectedCardId === null ? (
                                        <h1 className='text-center p-44'>No Purchase Order Details Found</h1>
                                    ) : (
                                        filteredPurchaseOrder?.length > 0 && filteredPurchaseOrders.length > 0 && purchaseOrderDtlList?.map((orderDtl) => (
                                            <div
                                                key={orderDtl.purchaseOrderDtlSno}
                                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-6">
                                                            <div className="relative group">
                                                                <img
                                                                    src="https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.jpg"
                                                                    className="w-16 h-16 rounded-lg object-cover"
                                                                    alt="Food"
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all" />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <h3 className="text-lg font-semibold low-bg-color text-color p-2 rounded">
                                                                    {orderDtl.restaurantSkuName}
                                                                </h3>
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-sm text-gray-500 font-semibold ">
                                                                        SKU CODE:  <span className="text-sm text-color font-semibold ">{orderDtl.partnerFoodCode}</span>
                                                                    </span>
                                                                    <div className="h-4 w-px bg-gray-200" />
                                                                    <div className="flex items-center">
                                                                        <Package size={16} className="text-green-400 mr-1" />
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            Qty: {orderDtl.orderQuantity}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                                                onClick={() => handleSku(orderDtl.purchaseOrderDtlSno)}
                                                            >
                                                                {openDropdown === orderDtl.purchaseOrderDtlSno ? (
                                                                    <ChevronUp className="text-gray-500" />
                                                                ) : (
                                                                    <ChevronDown className="text-gray-500" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {openDropdown === orderDtl.purchaseOrderDtlSno && (
                                                        <div className="mt-6">
                                                            {currentData?.length > 0 ? (
                                                                <>
                                                                    <div className="overflow-hidden rounded-xl border border-gray-100">
                                                                        <table className="w-full">
                                                                            <thead>
                                                                                <tr className="bg-gray-50">
                                                                                    <th className="w-8 p-4">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="rounded border-gray-300"
                                                                                        />
                                                                                    </th>
                                                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                                                        QBOX SKU Code
                                                                                    </th>
                                                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                                                        Status
                                                                                    </th>
                                                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                                                        Actions
                                                                                    </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-gray-100">
                                                                                {currentData?.map((sku) => (
                                                                                    <tr key={sku.id} className="group hover:bg-gray-50 transition-colors">
                                                                                        <td className="p-4">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={selectedItems.has(sku.id)}
                                                                                                className="rounded border-gray-300"
                                                                                            />
                                                                                        </td>
                                                                                        <td className="px-4 py-3">
                                                                                            <span className="font-mono text-sm text-gray-700">
                                                                                                {sku.uniqueCode}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="px-4 py-3">
                                                                                            <div className="flex items-center">
                                                                                                {/* {getStatusIcon(sku.wfStageCd)} */}
                                                                                                {sku.wfStageCd === 7 ? (
                                                                                                    <div className="flex gap-2">
                                                                                                        <button
                                                                                                            onClick={() =>
                                                                                                                handleAcceptSKU(sku.skuInventorySno, sku.purchaseOrderDtlSno)
                                                                                                            }
                                                                                                            className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-flex items-center"
                                                                                                        >
                                                                                                            <Box size={14} className="mr-1" />
                                                                                                            Accept & Move
                                                                                                        </button>
                                                                                                        <button
                                                                                                            onClick={() =>
                                                                                                                handleRejectSKU(sku.skuInventorySno, sku.purchaseOrderDtlSno)
                                                                                                            }
                                                                                                            className="px-3 py-1.5 text-sm font-medium text-color hover:low-bg-color rounded-lg transition-colors inline-flex items-center"
                                                                                                        >
                                                                                                            <AlertCircle size={14} className="mr-1" />
                                                                                                            Reject
                                                                                                        </button>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <span
                                                                                                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium
                                                                                                            ${sku.wfStageCd === 6 ? 'bg-yellow-50 text-yellow-700' : ''}
                                                                                                            ${sku.wfStageCd === 8 ? 'low-bg-color text-red-700' : ''}
                                                                                                            ${sku.wfStageCd === 9 ? 'bg-green-50 text-green-700' : ''}
                                                                                                            ${sku.wfStageCd === 10 ? 'bg-orange-50 text-orange-700' : ''}
                                                                                                            ${sku.wfStageCd === 11 ? 'bg-purple-50 text-purple-700' : ''}
                                                                                                            ${sku.wfStageCd === 12 ? 'bg-indigo-50 text-indigo-700' : ''}
                                                                                                            ${sku.wfStageCd === 13 ? 'bg-teal-50 text-teal-700' : ''}
                                                                                                        `}>
                                                                                                        {getStatusIcon(sku.wfStageCd)}
                                                                                                        {sku.wfStageCd === 6 && 'Awaiting Delivery'}
                                                                                                        {sku.wfStageCd === 8 && 'Rejected'}
                                                                                                        {sku.wfStageCd === 9 && 'Accepted'}
                                                                                                        {sku.wfStageCd === 10 && 'In Hot Box'}
                                                                                                        {sku.wfStageCd === 11 && 'In Queue Box'}
                                                                                                        {sku.wfStageCd === 12 && 'Returned to Hot Box'}
                                                                                                        {sku.wfStageCd === 13 && 'Outward Delivery'}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-4 py-3">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <button
                                                                                                    onClick={() => handleSkuTracking(sku.skuInventorySno)}
                                                                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                                                >
                                                                                                    <ExternalLink size={14} className="mr-1" />
                                                                                                    Track SKU
                                                                                                </button>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>

                                                                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                                                                            <div className="flex items-center justify-between">
                                                                                <p className="text-sm text-gray-500">
                                                                                    Showing {startIndex + 1} to {Math.min(endIndex, skuInventoryList.length)} of {skuInventoryList.length} entries
                                                                                </p>
                                                                                <div className="flex items-center gap-2">
                                                                                    <button
                                                                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                                                        disabled={currentPage === 1}
                                                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    >
                                                                                        Previous
                                                                                    </button>
                                                                                    {Array.from({ length: totalPages }, (_, i) => (
                                                                                        <button
                                                                                            key={i + 1}
                                                                                            onClick={() => setCurrentPage(i + 1)}
                                                                                            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                                                                                        ${currentPage === i + 1
                                                                                                    ? 'bg-color text-white'
                                                                                                    : 'text-gray-600 hover:bg-gray-100'
                                                                                                }`}
                                                                                        >
                                                                                            {i + 1}
                                                                                        </button>
                                                                                    ))}
                                                                                    <button
                                                                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                                                        disabled={currentPage === totalPages}
                                                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    >
                                                                                        Next
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center text-center py-10">
                                                                    <img
                                                                        src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" // A better "empty box" icon
                                                                        alt="No SKU Found"
                                                                        className="w-24 h-24 opacity-50"
                                                                    />
                                                                    <p className="text-lg font-semibold text-gray-600 mt-4">No SKU Found</p>
                                                                    <p className="text-sm text-gray-500">There are no SKUs available for the selected criteria.</p>
                                                                </div>

                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'inwardOrderDetails' && (
                <>
                    {inwardOrderDetailList?.length !== 0 ? (
                        <div className="animate-fadeIn">
                            <div className="flex justify-end items-center mb-8 ">
                            </div>
                            <MasterCard className="w-full overflow-hidden bg-white">
                                <div className="p-4 bg-color">
                                    <h2 className="text-xl font-semibold text-white">Inward Order Details</h2>
                                    <p className="text-red-100 text-sm mt-1">Management your Inward Order</p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-red-100">
                                                <th className="low-bg-color text-color px-6 py-4 text-left font-semibold">
                                                    Purchase Order Id
                                                </th>
                                                <th className="low-bg-color text-color px-6 py-4 text-left font-semibold">
                                                    Restaurant Name
                                                </th>
                                                <th className="low-bg-color text-color px-6 py-4 text-left font-semibold">
                                                    Sku Name
                                                </th>
                                                <th className="low-bg-color text-color px-6 py-4 text-left font-semibold">
                                                    Quantity
                                                </th>
                                                <th className="low-bg-color text-color px-6 py-4 text-left font-semibold">
                                                    Purchase Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {inwardOrderDetailList?.length > 0 ? (
                                                inwardOrderDetailList?.map((restaurant, index) =>
                                                    restaurant.orders?.map((order, orderIndex) => (
                                                        <tr key={`${index}-${orderIndex}`} className="group transition-colors hover:low-bg-color/50">
                                                            <td className="px-6 py-4 font-semibold text-gray-900">#{order.partnerPurchaseOrderId}</td>
                                                            {/* Restaurant Name */}
                                                            <td className="px-6 py-4 font-semibold text-gray-900">{restaurant.restaurantName}</td>

                                                            {/* SKU Name */}
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                                    <Award className="h-4 w-4 mr-2" />
                                                                    {order.restaurantFoodSku}
                                                                </span>
                                                            </td>

                                                            {/* Ordered Quantity */}
                                                            <td className="px-6 py-4 font-semibold text-gray-900">{order.orderedQuantity}</td>

                                                            {/* Ordered Time */}
                                                            <td className="px-6 py-4 text-sm text-gray-600 flex items-center">
                                                                <Calendar className="h-4 w-4 text-color mr-2" />
                                                                <span className="font-medium text-color">
                                                                    {new Date(order.orderedTime)
                                                                        .toLocaleString("en-GB", {
                                                                            day: "2-digit",
                                                                            month: "2-digit",
                                                                            year: "numeric",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            hour12: true
                                                                        })
                                                                        .replace("am", "AM")
                                                                        .replace("pm", "PM")}
                                                                </span>
                                                            </td>

                                                        </tr>
                                                    ))
                                                )
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}>
                                                        <div className="flex flex-col items-center justify-center py-16 bg-white">
                                                            <div className="low-bg-color p-3 rounded-full mb-4">
                                                                <AlertCircle className="text-color" size={32} />
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                No Inward Orders Found
                                                            </h3>
                                                            <p className="text-gray-500 text-sm">
                                                                No matching orders available at this time
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>
                            </MasterCard>
                        </div>

                    ) : (
                        <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-center px-6 py-8">
                                <AlertCircle className="mx-auto mb-6 text-color" size={64} />
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Inward Orders Found</h3>
                                <p className="text-lg text-gray-600">There are currently no Inward Orders Found to display.</p>
                            </div>
                        </div>
                    )}

                </>
            )}

            {activeTab === 'foodTracking' && (
                <FoodSkuTracking
                    skuInventorySno={skuInventorySno}
                />
            )}
            {activeTab === 'outwardOrder' && (
                <OutwardOrders qboxEntitySno={qboxEntitySno}
                    // setSkuInventorySno={setSkuInventorySno}
                    setActiveTab={setActiveTab}
                    orderedTime={transactionDate} />
            )}

        </>
    );
};
export default InwardOrders;
