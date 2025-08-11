import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import {
    searchSalesOrder,
    searchSalesOrderDtl,
    searchSkuInventory
} from "@state/supplyChainSlice";
import {
    Search, ChevronDown, ChevronUp,
    Clock, Package, AlertTriangle, CheckCircle2,
    Box, AlertCircle, ArrowLeftRight, ArrowRight,
    ClipboardCheck, Timer, Truck, ShoppingCart
} from "lucide-react";
import {
    MasterCard,
    CardContent,
    CardHeader,
    CardTitle,
} from "@components/MasterCard";
import './custom.css';
import { useNavigate } from 'react-router-dom';
import DateTime from '@components/DateTime';

interface OutwardOrdersProps {
    qboxEntitySno: any;
    setActiveTab: any;
    orderedTime: any;
}

const OutwardOrders: React.FC<OutwardOrdersProps> = ({ qboxEntitySno, setActiveTab, orderedTime }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderStats, setOrderStats] = useState({
        pending: 0,
        processing: 0,
        completed: 0,
        rejected: 0
    });
    const [showStats, setShowStats] = useState(false);
    const [activeTab, setActiveTabLocal] = useState<'delivered' | 'notDelivered'>('delivered');
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {
        salesOrderList,
        skuInventoryList,
        salesOrderDtlList,
    } = useSelector((state: RootState) => state.supplyChain);

    useEffect(() => {
        console.log('qboxEntitySno:', qboxEntitySno);
        dispatch(searchSalesOrderDtl({ qboxEntitySno }));
        dispatch(searchSalesOrder({ qboxEntitySno, orderedTime }));
    }, [dispatch, qboxEntitySno, orderedTime]);

    useEffect(() => {
        dispatch({ type: 'supplyChain/setSalesOrderDtlList', payload: [] });
        dispatch({ type: 'supplyChain/setSkuInventoryList', payload: [] });
        setSelectedCardId(null);
        setOpenDropdown(null);
    }, [salesOrderList, dispatch]);

    // Filter orders based on active tab and salesOrderStatusCd
    const getFilteredOrders = () => {
        if (!salesOrderList) return [];

        const filtered = salesOrderList.filter(sales =>
            sales.partnerSalesOrderId.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (activeTab === 'delivered') {
            return filtered.filter(order =>
                order.salesOrderStatusCd === 15 ||
                order.salesOrderStatusCd === 16
            );
        } else {
            return filtered.filter(order =>
                order.salesOrderStatusCd === 14
            );
        }
    };

    const tabOrders = getFilteredOrders();

    const getStatusIcon = (wfStageCd) => {
        const iconProps = { size: 16, className: "mr-2" };
        switch (wfStageCd) {
            case 6: return <Timer {...iconProps} className="text-yellow-600" />;
            case 7: return <ClipboardCheck {...iconProps} className="text-blue-600" />;
            case 8: return <AlertCircle {...iconProps} className="text-color" />;
            case 9: return <Box {...iconProps} className="text-green-600" />;
            case 10: return <ArrowLeftRight {...iconProps} className="text-orange-600" />;
            case 11: return <Package {...iconProps} className="text-purple-600" />;
            case 12: return <ArrowRight {...iconProps} className="text-indigo-600" />;
            case 13: return <Truck {...iconProps} className="text-teal-600" />;
            default: return null;
        }
    };

    useEffect(() => {
        if (salesOrderDtlList?.length) {
            const stats = salesOrderDtlList.reduce((acc, order) => {
                const status = order.status?.toLowerCase() || 'pending';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});
            setOrderStats(stats);
        }
    }, [salesOrderDtlList]);

    const handleCardClick = (id: number, salesOrderSno: string) => {
        setSelectedCardId(id);
        dispatch(searchSalesOrderDtl({ salesOrderSno }));
    };

    const handleSku = (salesOrderDtlSno) => {
        setOpenDropdown(prevState => prevState === salesOrderDtlSno ? null : salesOrderDtlSno);
        dispatch(searchSkuInventory({ salesOrderDtlSno }));
    };

    return (
        <div className="min-h-screen">
            {/* Header section */}
            <div>
                <div className="flex">
                    <h1 className="text-2xl text-color flex items-center gap-1.5">
                        <ShoppingCart className="w-8 h-8 text-color" />
                        {activeTab === 'delivered' ? 'Delivered' : 'Not Delivered'}
                    </h1>
                </div>
                <p className="text-gray-500 text-sm mt-1">Manage and track your customer delivery</p>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mt-4">
                    <button
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'delivered' ? 'text-color border-b-2 border-color' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTabLocal('delivered')}
                    >
                        Delivered
                    </button>
                    <button
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'notDelivered' ? 'text-color border-b-2 border-color' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTabLocal('notDelivered')}
                    >
                        Not Delivered
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {showStats && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {Object.entries(orderStats).map(([status, count]) => (
                        <MasterCard key={status}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm text-gray-500 capitalize">{status}</p>
                                    <p className="text-2xl font-bold">{count}</p>
                                </div>
                                <div className="p-3 rounded-full">
                                    {status === 'pending' && <Clock size={20} />}
                                    {status === 'processing' && <Package size={20} />}
                                    {status === 'completed' && <CheckCircle2 size={20} />}
                                    {status === 'rejected' && <AlertTriangle size={20} />}
                                </div>
                            </CardContent>
                        </MasterCard>
                    ))}
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="flex gap-4 mb-6 mt-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'delivered' ? 'delivered' : 'not delivered'} orders by ID...`}
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Content */}
            {tabOrders?.length === 0 ? (
                <div className="flex-1 flex justify-center items-center h-64 px-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col justify-center items-center w-full max-w-md">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto mb-2">
                                <AlertCircle className="w-full h-full text-color" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {activeTab === 'delivered'
                                    ? 'No Delivered Orders Found'
                                    : 'No Not Delivered Orders Found'}
                            </h3>
                            <p className="text-gray-600">
                                {activeTab === 'delivered'
                                    ? 'No orders with status 15 or 16 were found.'
                                    : 'No orders with status 14 were found.'}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex gap-6">
                    {/* Order Details */}
                    <div className="w-80 space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">Order List</h2>
                            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar pr-2">
                                {tabOrders?.length > 0 ? (
                                    tabOrders.map((salesOrder, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleCardClick(index, salesOrder.salesOrderSno)}
                                            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedCardId === index
                                                ? 'low-bg-color border-color'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                                } border`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-800">{salesOrder.partnerSalesOrderId}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{salesOrder.qboxEntity1name}</p>
                                                    <div className="text-sm mt-2">
                                                        <DateTime date={salesOrder.orderedTime} showTimeIcon={false} showDateIcon={false} />
                                                    </div>
                                                    <div className="text-xs mt-1 text-gray-400">
                                                        Status: {salesOrder.salesOrderStatusCd}
                                                    </div>
                                                </div>
                                                <Box size={16} className="text-gray-400" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 Kauf-medium text-gray-500">
                                        No orders match your search
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details Panel */}
                    <div className="flex-1 space-y-6">
                        {tabOrders?.length > 0 && selectedCardId === null ? (
                            <h1 className="text-center p-44">Select an order to view details</h1>
                        ) : (
                            salesOrderDtlList?.map((orderDtl) => (
                                <div key={orderDtl.salesOrderDtlSno} className="space-y-4">
                                    <MasterCard className="mb-4">
                                        <CardHeader className="cursor-pointer p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                                            <div className="flex items-center justify-between space-x-4">
                                                <div className="flex items-center gap-6 p-2">
                                                    <div className="relative group">
                                                        <img
                                                            src="https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.jpg"
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                            alt="Food"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg font-semibold bg-teal-50 text-teal-700 p-2 rounded">{orderDtl.foodSku1name}</CardTitle>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm text-gray-500 font-semibold">
                                                                SKU CODE: <span className="text-sm text-color font-semibold">{orderDtl.foodSkuSno}</span>
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
                                                <div className="flex items-center gap-4" onClick={() => handleSku(orderDtl.salesOrderDtlSno)}>
                                                    {openDropdown === orderDtl.salesOrderDtlSno ? (
                                                        <ChevronUp className="text-gray-500" />
                                                    ) : (
                                                        <ChevronDown className="text-gray-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {openDropdown === orderDtl.salesOrderDtlSno && (
                                            <CardContent>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">QBOX SKU Code</th>
                                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer Order Id</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {skuInventoryList?.length > 0 ? (
                                                                skuInventoryList.map((sku) => (
                                                                    <tr key={sku.id} className="border-b hover:bg-gray-50">
                                                                        <td className="p-2">{sku.uniqueCode}</td>
                                                                        <td>
                                                                            <div className="flex items-center">
                                                                                {getStatusIcon(sku.wfStageCd)}
                                                                                {sku.wfStageCd === 6 ? (
                                                                                    <span className="flex bg-yellow-50 text-yellow-700 p-2 rounded">
                                                                                        Awaiting Delivery
                                                                                    </span>
                                                                                ) : (
                                                                                    <>
                                                                                        {sku.wfStageCd === 13 && (
                                                                                            <span className="bg-yellow-50 text-yellow-700 p-1 rounded">
                                                                                                Customer Delivery Picked up
                                                                                            </span>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <svg
                                                                                    className="w-4 h-4 text-blue-500"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth={2}
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                                <span className="text-sm text-gray-800 font-medium">{sku.partnerSalesOrderId}</span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={3} className="text-center py-4"> {/* Changed from colSpan={2} to 3 */}
                                                                        <div className="flex flex-col items-center justify-center">
                                                                            <img
                                                                                src="https://cdn-icons-png.flaticon.com/512/992/992700.png"
                                                                                alt="Food Not Delivered"
                                                                                className="w-16 h-16 mb-2"
                                                                            />
                                                                            <p className="text-gray-600 font-medium">Your food has not been delivered yet.</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CardContent>
                                        )}
                                    </MasterCard>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutwardOrders;