import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Package, Truck, XCircle, Building, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Add this type near the top of the file
type Delivery = {
    id: number;
    orderNumber: string;
    customerName: string;
    status: string;
    deliveryAddress: string;
    orderTime: string;
    items: string[];
    total: string;
    rejectionReason?: string;
    rejectionTime?: string;
    customerNotified?: boolean;
    specialInstructions?: string;
    [key: string]: any; // for any other properties
};

// Add this type near the existing types
type OrderStatus = 'pending' | 'completed' | 'rejected';

// Updated data structure to include delivery details
const deliveryPartnersData = [
    {
        id: 1,
        name: "Karappakkam 10mins Delivery",
        ordersReceived: 150,
        deliveriesCompleted: 130,
        ordersRejected: 20,
        performance: "92%",
        deliveries: [
            {
                id: 1,
                orderNumber: "ORD001",
                customerName: "John Doe",
                status: "rejected",
                deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
                orderTime: "2024-03-20 10:30 AM",
                items: ["Pepperoni Pizza", "2x Coca-Cola", "Garlic Knots"],
                total: "$25.99",
                rejectionReason: "Driver unavailable",
                rejectionTime: "2024-03-20 10:35 AM",
                rejectedBy: "Driver ID: DRV123",
                customerNotified: true,
                estimatedDeliveryTime: "30-45 minutes",
                paymentMethod: "Credit Card"
            },
            {
                id: 2,
                orderNumber: "ORD002",
                customerName: "Jane Smith",
                status: "completed",
                deliveryAddress: "456 Park Ave, Suite 789, New York, NY 10022",
                orderTime: "2024-03-20 11:15 AM",
                items: ["Sushi Combo", "Miso Soup", "Green Tea"],
                total: "$42.50",
                deliveryTime: "2024-03-20 11:45 AM",
                deliveredBy: "Driver ID: DRV456",
                customerRating: 5,
                feedback: "Excellent service!",
                paymentMethod: "PayPal"
            },
            {
                id: 3,
                orderNumber: "ORD003",
                customerName: "Bob Wilson",
                status: "rejected",
                deliveryAddress: "789 Broadway, New York, NY 10003",
                orderTime: "2024-03-20 12:00 PM",
                items: ["Burger Combo", "Milkshake", "Extra Fries"],
                total: "$28.75",
                rejectionReason: "Restaurant too busy",
                rejectionTime: "2024-03-20 12:10 PM",
                rejectedBy: "Restaurant ID: REST789",
                customerNotified: true,
                specialInstructions: "No onions please"
            }
        ]
    },
    {
        id: 2,
        name: "Sholinganallur 10mins Delivery",
        ordersReceived: 200,
        deliveriesCompleted: 185,
        ordersRejected: 15,
        performance: "95%",
        deliveries: [
            {
                id: 4,
                orderNumber: "SE001",
                customerName: "Alice Johnson",
                status: "completed",
                deliveryAddress: "321 5th Ave, New York, NY 10016",
                orderTime: "2024-03-20 13:00 PM",
                items: ["Pad Thai", "Spring Rolls", "Thai Iced Tea"],
                total: "$35.25",
                deliveryTime: "2024-03-20 13:30 PM",
                deliveredBy: "Driver ID: SE789",
                customerRating: 4,
                feedback: "Food was hot on arrival",
                paymentMethod: "Apple Pay"
            },
            {
                id: 5,
                orderNumber: "SE002",
                customerName: "Charlie Brown",
                status: "rejected",
                deliveryAddress: "159 W 25th St, New York, NY 10001",
                orderTime: "2024-03-20 14:15 PM",
                items: ["Family Pizza Pack", "Wings", "2L Soda"],
                total: "$55.99",
                rejectionReason: "Outside delivery zone",
                rejectionTime: "2024-03-20 14:20 PM",
                rejectedBy: "System",
                customerNotified: true,
                specialInstructions: "Contact upon arrival"
            }
        ]
    },
    {
        id: 3,
        name: "Navallur 15mins Delivery",
        ordersReceived: 175,
        deliveriesCompleted: 160,
        ordersRejected: 15,
        performance: "93%",
        deliveries: [
            {
                id: 6,
                orderNumber: "QS001",
                customerName: "David Miller",
                status: "completed",
                deliveryAddress: "753 3rd Ave, New York, NY 10017",
                orderTime: "2024-03-20 15:00 PM",
                items: ["Salad Bowl", "Smoothie", "Protein Bar"],
                total: "$22.50",
                deliveryTime: "2024-03-20 15:25 PM",
                deliveredBy: "Driver ID: QS321",
                customerRating: 5,
                feedback: "Perfect delivery",
                paymentMethod: "Google Pay"
            }
        ]
    }
];

// Add new StatCard component with enhanced features
const StatCard = ({ icon: Icon, title, value, trend, color, bgColor }) => (
    <motion.div
        className={`relative overflow-hidden rounded-3xl p-6 ${bgColor} shadow-lg border border-gray-100`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                {trend && (
                    <div className="flex items-center mt-2">
                        {parseFloat(trend) > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-color mr-1" />
                        )}
                        <p className={`text-sm font-medium ${parseFloat(trend) > 0 ? 'text-green-600' : 'text-color'
                            }`}>
                            {trend}% from last month
                        </p>
                    </div>
                )}
            </div>
            <motion.div
                className={`rounded-2xl p-3 ${color} bg-opacity-15`}
                whileHover={{ rotate: 15 }}
            >
                <Icon size={28} />
            </motion.div>
        </div>
    </motion.div>
);

// Update the DeliveryFilter component with more filter options
const DeliveryFilter = ({ onSearch, onFilterChange, onEntityChange, onDateChange }) => (
    <div className="space-y-4">
        <div className="flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search deliveries..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
                className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => onEntityChange(e.target.value)}
            >
                <option value="">All Entities</option>
                <option value="restaurant">Restaurant</option>
                <option value="driver">Driver</option>
                <option value="customer">Customer</option>
            </select>

            <input
                type="date"
                className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => onDateChange(e.target.value)}
            />

            <select
                className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => onFilterChange(e.target.value)}
            >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
    </div>
);

// Add this component after the DeliveryFilter component
const DeliveryDetailCard = ({ delivery, onAccept, onReject }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{delivery.orderNumber}</h3>
                <p className="text-gray-600">{delivery.customerName}</p>
            </div>
            <div className="flex items-center gap-2">
                {delivery.status === 'pending' && (
                    <>
                        <button
                            onClick={() => onAccept(delivery)}
                            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => onReject(delivery)}
                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:low-bg-color transition-colors"
                        >
                            Reject
                        </button>
                    </>
                )}
                {delivery.status === 'completed' && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg">Completed</span>
                )}
                {delivery.status === 'rejected' && (
                    <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg">Rejected</span>
                )}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-sm text-gray-500">Delivery Address</p>
                <p className="text-sm font-medium">{delivery.deliveryAddress}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Order Time</p>
                <p className="text-sm font-medium">{delivery.orderTime}</p>
            </div>
        </div>

        <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Items</p>
            <div className="space-y-1">
                {delivery.items.map((item, index) => (
                    <p key={index} className="text-sm font-medium">{item}</p>
                ))}
            </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
                Payment Method: <span className="font-medium">{delivery.paymentMethod}</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">{delivery.total}</div>
        </div>
    </motion.div>
);

// Add this new component after DeliveryDetailCard
const RejectedOrdersSection = ({ deliveries }) => {
    const rejectedDeliveries = deliveries.filter(d => d.status === 'rejected');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
            <h3 className="text-xl font-semibold text-color mb-4">
                Rejected Orders ({rejectedDeliveries.length})
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {rejectedDeliveries.map((delivery) => (
                    <div
                        key={delivery.id}
                        className="p-4 border border-red-100 bg-red-50 rounded-lg"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-medium">Order #{delivery.orderNumber}</h4>
                                <p className="text-sm text-gray-600">{delivery.customerName}</p>
                            </div>
                            <span className="text-sm text-color">
                                {delivery.rejectionTime}
                            </span>
                        </div>

                        <div className="mt-3 space-y-2">
                            <div>
                                <p className="text-sm text-gray-500">Rejection Reason:</p>
                                <p className="text-sm font-medium text-red-700">{delivery.rejectionReason}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Delivery Address:</p>
                                <p className="text-sm font-medium">{delivery.deliveryAddress}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Items:</p>
                                <div className="text-sm font-medium">
                                    {delivery.items.join(', ')}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-red-100">
                                <span className="text-sm text-gray-500">
                                    Rejected by: <span className="font-medium">{delivery.rejectedBy}</span>
                                </span>
                                <span className="font-medium">{delivery.total}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// Add these custom colors for the chart
const chartColors = {
    ordersReceived: '#6366f1',    // Indigo
    completed: '#10b981',         // Emerald
    rejected: '#f43f5e'          // Rose
};

const DeliveryPartnerDashboard = () => {
    const [selectedPartnerId, setSelectedPartnerId] = useState('');
    const [timeFilter, setTimeFilter] = useState('monthly');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [entityFilter, setEntityFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedView, setSelectedView] = useState('overview');

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (location.pathname === '/dashboard') {
            setSelectedView('QBOX Dashboard');
        } else if (location.pathname === '/delivery-partner-dashboard') {
            setSelectedView('Partner Dashboard');
        }
    }, [location]);

    const handleNavigation = (view) => {
        setSelectedView(view);
        if (view === 'QBOX Dashboard') {
            navigate('/dashboard'); // Adjust this route as per your application
        } else if (view === 'Partner Dashboard') {
            navigate('/delivery-partner-dashboard'); // Adjust this route as per your application
        }
    };

    const selectedPartner = deliveryPartnersData.find(partner => partner.id === parseInt(selectedPartnerId));

    // Transform data for the chart
    const chartData = deliveryPartnersData.map(partner => ({
        name: partner.name,
        'Orders Received': partner.ordersReceived,
        'Deliveries Completed': partner.deliveriesCompleted,
        'Orders Rejected': partner.ordersRejected
    }));

    // Update the filtered deliveries logic
    const getFilteredDeliveries = () => {
        if (!selectedPartner) return [];

        return selectedPartner.deliveries.filter(delivery => {
            const matchesSearch = delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
            const matchesEntity = !entityFilter ||
                (entityFilter === 'restaurant' && delivery.rejectedBy?.includes('REST')) ||
                (entityFilter === 'driver' && delivery.rejectedBy?.includes('DRV')) ||
                (entityFilter === 'customer' && delivery.customerName);
            const matchesDate = !dateFilter || delivery.orderTime.includes(dateFilter);

            return matchesSearch && matchesStatus && matchesEntity && matchesDate;
        });
    };

    // Update the renderPartnerDetails to include new filter handlers
    const renderPartnerDetails = () => {
        if (!selectedPartner) return null;

        return (
            <motion.div
                className="mb-10 bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">{selectedPartner.name}</h2>
                            <div className="px-4 py-2 bg-green-50 rounded-xl">
                                <span className="text-green-700 font-medium">
                                    Rating: {calculatePartnerRating(selectedPartner)}/5
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Recent Orders</h3>
                            <DeliveryFilter
                                onSearch={setSearchTerm}
                                onFilterChange={setStatusFilter}
                                onEntityChange={setEntityFilter}
                                onDateChange={setDateFilter}
                            />
                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {getFilteredDeliveries().map((delivery) => (
                                    <DeliveryDetailCard
                                        key={delivery.id}
                                        delivery={delivery}
                                        onAccept={(delivery) => {
                                            console.log('Accepted:', delivery);
                                        }}
                                        onReject={(delivery) => {
                                            console.log('Rejected:', delivery);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <RejectedOrdersSection deliveries={selectedPartner.deliveries} />
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/30 p-8 pl-32 pr-14">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Delivery Partners Overview
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Monitor real-time performance metrics and analytics
                        </p>
                    </div>
                    <div className="bg-white rounded-full shadow-md p-1 flex">
                        {['QBOX Dashboard', 'Partner Dashboard'].map((view) => (
                            <button
                                key={view}
                                onClick={() => handleNavigation(view)}
                                className={`px-6 py-2 rounded-full text-sm transition-all ${selectedView === view
                                    ? 'bg-black text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {view}
                            </button>
                        ))}

                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    <StatCard
                        icon={Package}
                        title="Total Orders"
                        value="1,234"
                        trend="+12.5%"
                        color="text-blue-500"
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        icon={Truck}
                        title="Completed Deliveries"
                        value="1,100"
                        trend="+15.2%"
                        color="text-green-500"
                        bgColor="bg-green-50"
                    />
                    <StatCard
                        icon={XCircle}
                        title="Rejected Orders"
                        value="134"
                        trend="-5.3%"
                        color="text-color"
                        bgColor="bg-red-50"
                    />
                    <StatCard
                        icon={Building}
                        title="Active Partners"
                        value={deliveryPartnersData.length}
                        trend="+10%"
                        color="text-purple-500"
                        bgColor="bg-purple-50"
                    />
                </div>

                {/* <motion.div
                    className="mt-10 bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {deliveryPartnersData.map((partner) => (
                            <div
                                key={partner.id}
                                onClick={() => setSelectedPartnerId(partner.id.toString())}
                                className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 cursor-pointer transition-all"
                            >
                                <h3 className="text-xl font-bold mb-4">{partner.name}</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-600">
                                        Accepted: {partner.deliveriesCompleted}
                                    </span>
                                    <span className="text-color">
                                        Rejected: {partner.ordersRejected}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div> */}
                <div className="mb-10 flex justify-end">
                    <select
                        className="w-full md:w-64 p-3 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        onChange={(e: any) => setSelectedPartnerId(e.target.value)}
                    >
                        <option value="">All Partners</option>
                        {deliveryPartnersData.map(partner => (
                            <option key={partner.id} value={partner.id}>
                                {partner.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedPartner && renderPartnerDetails()}

                <motion.div
                    className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Performance Overview</h2>
                        <div className="flex gap-4">
                            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                                Weekly
                            </button>
                            <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg">
                                Monthly
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                                Yearly
                            </button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                            <YAxis tick={{ fill: '#6B7280' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="Orders Received" fill="#818cf8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Deliveries Completed" fill="#34d399" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Orders Rejected" fill="#fb7185" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    className="mt-10 bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Partner Statistics</h2>
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                            Download Report
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Partner Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Orders Received
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Deliveries Completed
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Orders Rejected
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                        Performance
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {deliveryPartnersData.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {partner.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {partner.ordersReceived}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {partner.deliveriesCompleted}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {partner.ordersRejected}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                            {partner.performance}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

// Helper function to calculate partner rating
const calculatePartnerRating = (partner) => {
    const completedDeliveries = partner.deliveries.filter(d => d.status === 'completed');
    const totalRating = completedDeliveries.reduce((sum, d) => sum + (d.customerRating || 0), 0);
    return ((totalRating / completedDeliveries.length) || 0).toFixed(1);
};

export default DeliveryPartnerDashboard; 