
import React, { Key, ReactNode, useEffect, useState } from 'react';
import { ChevronDown, Clock, FileText, MapPin, Package, Plus, Search, Tag, User } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { AppDispatch, RootState } from '@state/store';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getAllDeliiveryPartner } from '@state/deliveryPartnerSlice';
import { apiService } from '@services/apiService';
import type { ApiResponse } from '../../types/apiTypes';
import { CardContent, CardHeader, CardTitle, MasterCard } from '@components/MasterCard';
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


interface QboxOrderItem {
    orderSno: Key | null | undefined;
    foodSkuSno: number,
    orderQuantity: number,
    skuPrice: number,
    partnerFoodCode: string,
}

interface QboxOrderFormData {
    qboxEntitySno: any,
    restaurantSno: any,
    deliveryPartnerSno: any,
    purchaseOrderDtl: any,
    foodSkuSno: any,
    quantity: any,
    partnerFoodCode: any,
}

export function QboxOrder() {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderList, setOrderList] = useState<QboxOrderItem[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('all');

    const [formData, setFormData] = useState<QboxOrderFormData>({
        qboxEntitySno: '',
        partnerFoodCode: '',
        restaurantSno: '',
        deliveryPartnerSno: '',
        purchaseOrderDtl: '',
        foodSkuSno: '',
        quantity: '',
    });

    const { restaurantList } = useSelector((state: RootState) => state.restaurant);
    const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const dispatch = useDispatch<AppDispatch>();
    const { reset } = useForm();

    useEffect(() => {
        dispatch(getAllRestaurant({}));
        dispatch(getAllQboxEntities({}));
        dispatch(getAllDeliiveryPartner({}));
        dispatch(getAllRestaurantFoodSku({}));

        // const savedOrderItems = localStorage.getItem('orderItems');
        // if (savedOrderItems) {
        //     setOrderList(JSON.parse(savedOrderItems));
        // }
    }, [dispatch]);

    // useEffect(() => {
    //     if (orderItems.length > 0) {
    //         localStorage.setItem('orderItems', JSON.stringify(orderItems));
    //     }
    // }, [orderItems]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const addData = () => {
        const newOrder = {
            foodSkuSno: formData.foodSkuSno,
            orderQuantity: formData.quantity,
            skuPrice: 1200,
            partnerFoodCode: formData.partnerFoodCode,
        };

        setOrderList((prevOrderList: any) => [...prevOrderList, newOrder]);

        console.log('Order added:', newOrder);
        console.log('Updated orderList:', [...orderList, newOrder]);

        // Reset form fields after adding data
        // setFormData({
        //     deliveryType: '',
        //     restaurant: '',
        //     itemType: '',
        //     foodItem: '',
        //     quantity: '',
        //     partnerCode: '',
        // });
    };

    const generateRandomOrderId = (prefix: any, length: any) => {
        const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
        const paddedNumber = String(randomNumber).padStart(length, '0');
        return prefix + paddedNumber;
    }

    const handleAddOrder = async () => {
        const params = {
            qboxEntitySno: formData.qboxEntitySno,
            restaurantSno: formData.qboxEntitySno,
            deliveryPartnerSno: formData.deliveryPartnerSno,
            orderStatusCd: 1,
            orderedBy: 1,
            partnerPurchaseOrderId: generateRandomOrderId('SWIGGY_', 5),
            purchaseOrderDtl: orderList,
        };
        console.log(params)
        try {
            console.log(params)
            const response = await apiService.post<ApiResponse<any>>('partner_channel_inward_order', params, '8912', PRIFIX_URL);
            // const response = await apiService.post<ApiResponse<any>>('partner_channel_inward_order', params, '5000', PRIFIX_URL);
            console.log(response)
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
        }
    };

    const handleEdit = (item: QboxOrderItem) => {
        // setFormData({
        //     foodItem: item.foodItem || '',
        //     quantity: item.quantity || '',
        //     partnerCode: item.deliveryPartnerSno.toString(),
        //     price: item.price || '',
        //     itemType: item.itemType || '',
        //     deliveryType: item.deliveryType || '',
        //     restaurant: item.restaurantSno.toString()
        // });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    // Sample data - replace with your actual data
    const orders = [
        {
            id: "ORD-2024-001",
            customerName: "John Doe",
            date: "2024-03-20",
            status: "Delivered",
            amount: 249.99,
            items: 3,
            address: "123 Main St, City",
            trackingId: "TRK789012"
        },
        {
            id: "ORD-2024-002",
            customerName: "Jane Smith",
            date: "2024-03-19",
            status: "Processing",
            amount: 149.50,
            items: 2,
            address: "456 Oak Ave, Town",
            trackingId: "TRK789013"
        }
    ];

    const timeFrames = [
        { label: 'Last 7 days', value: '7days' },
        { label: 'Last 30 days', value: '30days' },
        { label: 'Last 3 months', value: '3months' },
        { label: 'All time', value: 'all' }
    ];

    const statuses = [
        { label: 'All Orders', value: 'all' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' }
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Delivered': 'bg-green-100 text-green-800',
            'Processing': 'bg-blue-100 text-blue-800',
            'Shipped': 'bg-purple-100 text-purple-800',
            'Cancelled': 'low-bg-color text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="pl-32 pr-16 mt-5">
            <div className="">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-color">QBox Orders</h1>
                        <p className="text-gray-600 mt-2">Manage your food delivery orders</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                        <Plus className="mr-2" size={20} />
                        Add Order
                    </button>
                </div>
                <div className="min-h-screen">
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-color">Order History</h1>
                                <p className="text-gray-600 mt-2">View and manage all orders</p>
                            </div>

                            {/* Quick Stats Cards */}
                            <div className="flex gap-4">
                                <MasterCard
                                    className="w-48">
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                                        <p className="text-2xl font-bold text-color">1,234</p>
                                    </CardHeader>
                                </MasterCard>
                                <MasterCard className="w-48">
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                                        <p className="text-2xl font-bold text-color">$45,678</p>
                                    </CardHeader>
                                </MasterCard>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent appearance-none"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {statuses.map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>

                            {/* Time Frame Filter */}
                            <div className="relative">
                                <select
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent appearance-none"
                                    value={selectedTimeFrame}
                                    onChange={(e) => setSelectedTimeFrame(e.target.value)}
                                >
                                    {timeFrames.map((timeFrame) => (
                                        <option key={timeFrame.value} value={timeFrame.value}>
                                            {timeFrame.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>

                            {/* Export Button */}
                            <button className="flex items-center justify-center gap-2 bg-color text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                                <FileText size={20} />
                                Export Orders
                            </button>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <MasterCard key={order.id} className="hover:shadow-lg transition-shadow duration-200">
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {/* Order Info */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-lg">{order.id}</span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Clock size={16} className="mr-2" />
                                                    {order.date}
                                                </div>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-600">
                                                    <User size={16} className="mr-2" />
                                                    {order.customerName}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <MapPin size={16} className="mr-2" />
                                                    {order.address}
                                                </div>
                                            </div>

                                            {/* Order Details */}
                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-600">
                                                    <Package size={16} className="mr-2" />
                                                    {order.items} items
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Tag size={16} className="mr-2" />
                                                    Tracking: {order.trackingId}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-end space-x-2">
                                                <span className="text-xl font-bold text-color">
                                                    ${order.amount}
                                                </span>
                                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </MasterCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                </div>

                {/* Order Form Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        reset();
                    }}
                    title={
                        <div className="flex space-x-2">
                            <img src="//assets/images/delivery-truck.svg" className="pb-2 w-12" alt="delivery truck" />
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                Make Your Order Now!
                            </h2>
                        </div>
                    }
                    type="default"
                    size="xl"
                    footer={
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleAddOrder}
                                className="bg-color text-sm hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                {isEditing ? 'Update Order' : 'Order Now'}
                            </button>
                        </div>
                    }
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleAddOrder(); }} className="p-4 space-y-6">
                        <div className="flex space-x-4">
                            <div className="space-y-4 flex-1">
                                <select
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    value={formData.qboxEntitySno}
                                    onChange={handleInputChange}
                                    name="qboxEntitySno"
                                >
                                    <option value="">Select QBox</option>
                                    {qboxEntityList?.map((qboxEntity: any) => (
                                        <option key={qboxEntity.qboxEntitySno} value={qboxEntity.qboxEntitySno}>
                                            {qboxEntity.qboxEntityName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4 flex-1">
                                <select
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    value={formData.restaurantSno}
                                    onChange={handleInputChange}
                                    name="restaurantSno"
                                >
                                    <option value="">Select Restaurant</option>
                                    {restaurantList?.map((restaurant: any) => (
                                        <option key={restaurant.restaurantSno} value={restaurant.restaurantSno}>
                                            {restaurant.restaurantName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4 flex-1">
                                <select
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    value={formData.deliveryPartnerSno}
                                    onChange={handleInputChange}
                                    name="deliveryPartnerSno"
                                >
                                    <option value="">Select Delivery Partner</option>
                                    {deliveryPartnerList?.map((partner: any) => (
                                        <option key={partner.deliveryPartnerSno} value={partner.deliveryPartnerSno}>
                                            {partner.partnerName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-initial w-96">
                                <select
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    value={formData.foodSkuSno}
                                    onChange={handleInputChange}
                                    name="foodSkuSno"
                                >
                                    <option value="">Select Food Item</option>
                                    {RestaurantFoodList?.map((food: any) => (
                                        <option key={food.foodSkuSno} value={food.foodSkuSno}>
                                            {food.foodName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4 flex-initial w-48">
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter Quantity"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="space-y-4 flex-initial w-44">
                                <input
                                    name="partnerFoodCode"
                                    value={formData.partnerFoodCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter Partner Code"
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-20">
                            <button
                                onClick={addData}
                                className="bg-color text-sm hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                {isEditing ? 'Edit' : 'Add '}
                            </button>
                        </div>


                        <div className="overflow-x-auto mt-10">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Food</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Partner Code</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderList?.map((item) => (
                                        <tr className="border-t" key={item?.orderSno}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item?.foodSkuSno}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item?.orderQuantity}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item?.skuPrice}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item?.partnerFoodCode}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default QboxOrder;