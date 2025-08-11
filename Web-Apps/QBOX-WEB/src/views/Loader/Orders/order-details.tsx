import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MapPin, Globe, Building2, User, Truck, Barcode, CheckCircle, SearchX, Pencil, Trash2, RotateCcw, TrendingUp, MoreVertical, Eye, Timer, XCircle, Flame, Box } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import Card from '@components/card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { getPartnerStatusCd } from '@state/codeDtlSlice';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { Pagination } from '@components/pagination';
import { Column, Table } from '@components/Table';
import { useLocation } from 'react-router-dom';
import { getDailyStockReportV2 } from '@state/loaderDashboardSlice';
import { searchSkuInventory } from '@state/supplyChainSlice';

interface OrderDetailsProps {
    isHovered: any;
}

interface SkuInventoryItem {
    skuInventorySno: number;
    purchaseOrderDtlSno: number;
    uniqueCode: string;
    salesOrderDtlSno: number | null;
    wfStageCd: number;
}

// Add TablePagination component at the top of the file
const TablePagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center">
                <span className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ isHovered }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { skuInventoryList } = useSelector((state: RootState) => state.supplyChain);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { getDailyStockReportV2List } = useSelector((state: RootState) => state.loaderDashboard);
    const dispatch = useDispatch<AppDispatch>();
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSkuData, setSelectedSkuData] = useState<any[] | null>(null);
    const [skuPage, setSkuPage] = useState(1);
    const skuItemsPerPage = 5;

    const location = useLocation();
    const { orderId, purchaseOrderDtlSno } = location.state || {}; // get orderId

    console.log(location.state);
    console.log(purchaseOrderDtlSno);

    useEffect(() => {
        dispatch(getDailyStockReportV2({ "partner_purchase_order_id": orderId }));
    }, [dispatch]);

    // Add this function to handle SKU inventory search
    const handleViewDetails = async (purchaseOrderDtlSno: number) => {
        try {
            const response = await dispatch(searchSkuInventory({ purchaseOrderDtlSno }));
            if (response.payload) {
                setSelectedSkuData(response.payload);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching SKU inventory:', error);
        }
    };


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
            key: 'restaurant_name',
            header: 'Restaurant Name',
            sortable: false,
        },
        {
            key: 'qbox_entity_name',
            header: 'Delivery Location',
            sortable: false,
        },
        {
            key: 'food_sku_description',
            header: 'Food SKU Description',
            sortable: true,
        },
        {
            key: 'total_ordered_count',
            header: 'Total',
            render: (value) => (
                <span
                    className="px-2 py-1 text-sm font-medium rounded text-blue-500 bg-blue-100">
                    {value.orderStatus !== 36 ? value.total_ordered_count : 0}
                </span>
            )
        },
        {
            key: 'sold_inventory_count',
            header: 'Sold',
            render: (value) => (
                <span
                    className="px-2 py-1 text-sm font-medium rounded text-green-500 bg-green-100">
                    {/* {value.sold_inventory_count} */}
                    {value.orderStatus !== 36 ? value.sold_inventory_count : 0}
                </span>
            ),
        },
        {
            key: 'unsold_inventory_count',
            header: 'UnSold',
            render: (value) => (
                <span className="px-2 py-1 text-sm font-medium rounded text-orange-500 bg-orange-100">
                    {/* {value.unsold_inventory_count} */}
                    {value.orderStatus !== 36 ? value.unsold_inventory_count : 0}
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
                    {/* {value.rejected_count} */}
                    {value.orderStatus !== 36 ? value.rejected_count : 0}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <div className="relative">
                    <button
                        className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color"
                        onClick={() => handleViewDetails(purchaseOrderDtlSno)}
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

    // Add the Modal component for SKU details
    const SkuDetailsModal = () => {
        const skuData = skuInventoryList?.slice(
            (skuPage - 1) * skuItemsPerPage,
            skuPage * skuItemsPerPage
        );

        const stageMap: Record<number, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
            6: {
                label: 'Awaiting Delivery',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100',
                icon: <Timer size={16} />
            },
            7: {
                label: 'Delivery',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                icon: <Truck size={16} />
            },
            8: {
                label: 'Rejected',
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                icon: <XCircle size={16} />
            },
            9: {
                label: 'Accepted',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                icon: <CheckCircle size={16} />
            },
            10: {
                label: 'In Inventory Box',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                icon: <Flame size={16} />
            },
            11: {
                label: 'In QBox',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                icon: <Box size={16} />
            },
            12: {
                label: 'Returned to Hot Box',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                icon: <RotateCcw size={16} />
            },
            13: {
                label: 'Customer Delivery',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                icon: <Truck size={16} />
            }
        };

        return (
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="SKU Inventory Details"
            >
                <div className="mt-4 max-h-[70vh] overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unique Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {skuData?.map((sku: any, index: number) => {
                                const stage = stageMap[sku.wfStageCd] || {
                                    label: 'Unknown',
                                    color: 'text-gray-500',
                                    bgColor: 'bg-gray-100',
                                    icon: <Search size={16} />
                                };

                                return (
                                    <tr key={sku.skuInventorySno}
                                        className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {sku.uniqueCode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full ${stage.bgColor} ${stage.color}`}>
                                                {stage.icon}
                                                <span className="text-sm font-medium">
                                                    {stage.label}
                                                </span>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {skuInventoryList && skuInventoryList.length > 0 && (
                        <TablePagination
                            currentPage={skuPage}
                            totalItems={skuInventoryList.length}
                            itemsPerPage={skuItemsPerPage}
                            onPageChange={setSkuPage}
                        />
                    )}
                </div>
            </Modal>
        );
    };

    return (
        <div className="min-h-screen ">
            <div className="custom-gradient-left h-32" />
            <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14'}`}>
                <div className="max-w-8xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            {/* Left side - Header */}
                            <div className="flex items-center gap-4  rounded-xl">
                                <div className="low-bg-color p-3 rounded-xl">
                                    <TrendingUp className="w-8 h-8 text-color" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900">Order Details</h1>
                                    <p className="text-gray-500 mt-2">View your order details</p>
                                </div>
                            </div>
                            {/* Right side - Filters */}
                        </div>
                    </div>
                    <div className='my-8'>
                        {getDailyStockReportV2List?.orderList ? (
                            <Table
                                columns={columns}
                                data={getDailyStockReportV2List.orderList.map((report, index) => ({
                                    ...report,
                                    sno: index + 1,
                                }))}
                                rowsPerPage={10}
                                initialSortKey="Sno"
                                globalSearch={false}
                            />
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <SkuDetailsModal />
        </div>
    );
}

export default OrderDetails;


