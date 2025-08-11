import React, { useEffect, useState } from 'react';
import {
    BarChart2,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    MapPin,
    Zap,
    XCircle,
    AlertCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ComposedChart,
    Area,
    Scatter,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Table } from '@components/Table';
import { columns } from '@mock/recent_order';
import { CarouselShowcase } from '@components/Carousel';
import { RatingDemo } from '@components/Rating';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCounter } from '../hooks/useCounter';

// Enhanced and expanded sample data
const revenueData = [
    { name: 'Jan', revenue: 4000, orders: 2400, profit: 3200, customers: 1500 },
    { name: 'Feb', revenue: 3000, orders: 1398, profit: 2400, customers: 1200 },
    { name: 'Mar', revenue: 5200, orders: 9800, profit: 4300, customers: 2000 },
    { name: 'Apr', revenue: 2780, orders: 3908, profit: 2100, customers: 1800 },
    { name: 'May', revenue: 4890, orders: 4800, profit: 3900, customers: 2200 },
    { name: 'Jun', revenue: 3390, orders: 3800, profit: 2700, customers: 1900 },
];

const menuItemsData = [
    { name: 'Pizza', sales: 4000, color: '#0a8c33', margin: 35 },
    { name: 'Burgers', sales: 3000, color: '#FF6347', margin: 28 },
    { name: 'Salads', sales: 2000, color: '#FFD700', margin: 42 },
    { name: 'Pasta', sales: 2780, color: '#006400', margin: 38 },
    { name: 'Desserts', sales: 1890, color: '#A6A6A6', margin: 45 },
];

const cityOrderData = [
    { city: 'Sholinganallur', orders: 450, revenue: 45000, avgDelivery: 25 },
    { city: 'Numgampakkam', orders: 350, revenue: 35000, avgDelivery: 35 },
    { city: 'Karappakkam', orders: 250, revenue: 25000, avgDelivery: 30 },
    { city: 'Chennai', orders: 200, revenue: 20000, avgDelivery: 28 },
    { city: 'Phoenix', orders: 150, revenue: 15000, avgDelivery: 32 },
];

const recentOrders = [
    {
        id: '#FD001',
        customer: 'John Doe',
        items: ['Pepperoni Pizza', 'Coca Cola'],
        total: 45.99,
        status: 'Delivered',
        statusColor: '#0a8c33',
        time: '12:30 PM'
    },
    {
        id: '#FD002',
        customer: 'Jane Smith',
        items: ['Veggie Burger', 'French Fries'],
        total: 32.50,
        status: 'Pending',
        statusColor: '#FF6347',
        time: '1:15 PM'
    },
    {
        id: '#FD003',
        customer: 'Mike Johnson',
        items: ['Caesar Salad', 'Iced Tea'],
        total: 25.99,
        status: 'In Progress',
        statusColor: '#FFD700',
        time: '2:00 PM'
    },
];

const COLORS = ['#0a8c33', '#FF6347', '#FFD700', '#8884d8', '#82ca9d'];

const CreativeStatCard = ({ icon: Icon, title, value, trend, color, bgColor }) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const animatedValue = useCounter(numericValue);
    const formattedValue = value.includes('$')
        ? `$${animatedValue.toLocaleString()}`
        : animatedValue.toLocaleString();

    return (
        <motion.div
            className={`
                relative overflow-hidden
                rounded-2xl p-6
                bg-white
                border border-gray-100
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                group
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
                y: -3,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
        >
            {/* Luxury gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white to-white" />

            {/* Elegant border accent */}
            <div className="absolute inset-[1px] rounded-2xl">
                <div className={`
                    absolute top-0 left-4 right-4 h-[1px]
                    bg-gradient-to-r from-transparent via-current to-transparent
                    ${color} opacity-20
                `} />
            </div>

            {/* Main content container */}
            <div className="relative flex items-center justify-between">
                {/* Left section */}
                <div className="flex items-center gap-5">
                    {/* Premium icon container */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`
                            relative group/icon
                            flex items-center justify-center
                            w-14 h-14 rounded-xl
                            bg-gradient-to-br from-gray-50 to-white
                            shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                            border border-gray-100
                            overflow-hidden
                        `}
                    >
                        {/* Subtle background effect */}
                        <div className={`
                            absolute inset-0 opacity-0 group-hover/icon:opacity-10 transition-opacity duration-500
                            bg-gradient-to-r ${color}
                        `} />

                        <Icon
                            size={24}
                            className={`
                                ${color} relative z-10 
                                transition-all duration-300 
                                group-hover/icon:scale-110
                                drop-shadow-sm
                            `}
                            strokeWidth={1.5}
                        />
                    </motion.div>

                    {/* Text content with refined typography */}
                    <div className="space-y-1">
                        <motion.h3
                            className="text-2xl font-semibold text-gray-800 tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            {formattedValue}
                        </motion.h3>
                        <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">
                            {title}
                        </p>
                    </div>
                </div>

                {/* Elegant trend indicator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`
                        flex items-center gap-1.5 px-3.5 py-2
                        rounded-full text-sm font-medium
                        bg-gradient-to-br 
                        ${trend.includes('+')
                            ? 'from-emerald-50 to-white text-emerald-600 border-emerald-100'
                            : 'from-rose-50 to-white text-rose-600 border-rose-100'
                        }
                        border
                        shadow-sm
                    `}
                >
                    <span className="text-base">
                        {trend.includes('+') ? '↑' : '↓'}
                    </span>
                    {trend}
                </motion.div>
            </div>

            {/* Subtle decorative accent */}
            <div className={`
                absolute bottom-0 left-4 right-4 h-[1px]
                bg-gradient-to-r from-transparent via-gray-100 to-transparent
            `} />

            {/* Refined hover effect */}
            <div className="
                absolute inset-0 opacity-0 group-hover:opacity-100
                bg-gradient-to-br from-gray-50/50 via-transparent to-transparent
                transition-opacity duration-500
            " />
        </motion.div>
    );
};

// Add new time period data
const salesComparisonData = [
    { category: 'Pizza', today: 2100, week: 14500, month: 58000 },
    { category: 'Burgers', today: 1800, week: 12000, month: 45000 },
    { category: 'Salads', today: 1200, week: 8500, month: 32000 },
    { category: 'Pasta', today: 1500, week: 10000, month: 38000 },
    { category: 'Desserts', today: 900, week: 6000, month: 25000 },
];

// Add this near other data constants
const quickInsightsData = {
    acceptedOrders: 142,
    rejectedOrders: 23,
    avgPrepTime: "24 min",
    topRejectionReason: "Out of Stock",
    busyHours: "7-9 PM",
    popularItems: ["Chicken Biryani", "Butter Naan"],
    pendingOrders: 8,
    staffOnDuty: 12
};

interface FoodDeliveryDashboardProps {
    isHovered: any;
}
const FoodDeliveryDashboard: React.FC<FoodDeliveryDashboardProps> = ({ isHovered }) => {
    const [selectedView, setSelectedView] = useState('QBOX Dashboard');
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPeriod, setSelectedPeriod] = useState('Today');

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
            navigate('/dashboard');
        } else if (view === 'Partner Dashboard') {
            navigate('/delivery-partner-dashboard');
        }
    };

    const getChartData = (period) => {
        switch (period.toLowerCase()) {
            case 'today':
                return salesComparisonData.map(item => ({
                    category: item.category,
                    value: item.today
                }));
            case 'week':
                return salesComparisonData.map(item => ({
                    category: item.category,
                    value: item.week
                }));
            case 'month':
                return salesComparisonData.map(item => ({
                    category: item.category,
                    value: item.month
                }));
            default:
                return [];
        }
    };

    return (
        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            {/* <CarouselShowcase />
            <RatingDemo /> */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">QBox Dashboard Sample</h1>
                        <p className="text-gray-600">Comprehensive Insights Dashboard</p>
                    </div>
                    <div className="bg-white rounded-full shadow-md p-1 flex">

                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <CreativeStatCard
                        icon={DollarSign}
                        title="Total Revenue"
                        value="$87,420"
                        trend="+15.3%"
                        color="text-green-500"
                        bgColor="bg-green-50"
                    />
                    <CreativeStatCard
                        icon={ShoppingCart}
                        title="Total Orders"
                        value="4,256"
                        trend="+12.7%"
                        color="text-blue-500"
                        bgColor="bg-blue-50"
                    />
                    <CreativeStatCard
                        icon={Users}
                        title="New Customers"
                        value="1,452"
                        trend="+20.1%"
                        color="text-purple-500"
                        bgColor="bg-purple-50"
                    />
                    <CreativeStatCard
                        icon={Clock}
                        title="Avg. Delivery"
                        value="28 min"
                        trend="-6.5%"
                        color="text-orange-500"
                        bgColor="bg-orange-50"
                    />
                </div>
                {/* <AccordionShowcase /> */}
                {/* Advanced Charts */}
                <div className="grid grid-cols-3 gap-8">
                    {/* Composite Revenue Chart */}
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl p-8"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Comprehensive Performance</h2>
                                <p className="text-sm text-gray-500">Revenue, Orders, and Customer Growth</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-[#0a8c33] mr-2"></div>
                                    <span className="text-sm text-gray-600">Revenue</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-[#FF6347] mr-2"></div>
                                    <span className="text-sm text-gray-600">Profit</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0a8c33" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0a8c33" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>

                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    width={60}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    labelStyle={{ color: '#333', fontWeight: 'bold' }}
                                />
                                <CartesianGrid
                                    stroke="#f5f5f5"
                                    strokeDasharray="5 5"
                                    vertical={false}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="customers"
                                    fill="url(#colorCustomers)"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={{ fill: '#8884d8', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />

                                <Bar
                                    dataKey="revenue"
                                    barSize={30}
                                    fill="url(#colorRevenue)"
                                    radius={[4, 4, 0, 0]}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#FF6347"
                                    strokeWidth={3}
                                    dot={{ fill: '#FF6347', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />

                                <Scatter
                                    dataKey="orders"
                                    fill="#FFD700"
                                    stroke="#FFA500"
                                    strokeWidth={2}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Menu Item Analysis */}
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl p-6"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Menu Performance</h2>
                                <p className="text-sm text-gray-500">Sales and Profit Margins</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                                    <span className="text-sm text-gray-600">Sales</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                                    <span className="text-sm text-gray-600">Margin</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={menuItemsData}>
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    width={60}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    width={60}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    labelStyle={{ color: '#333', fontWeight: 'bold' }}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#818cf8"
                                    fill="url(#salesGradient)"
                                    strokeWidth={2}
                                    dot={{ fill: '#818cf8', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="margin"
                                    stroke="#10b981"
                                    fill="url(#marginGradient)"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </motion.div>
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl p-8"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sales Performance</h2>
                                <p className="text-sm text-gray-500">Comparative analysis across time periods</p>
                            </div>
                            <div className="flex gap-2">
                                {['Today', 'Week', 'Month'].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setSelectedPeriod(period)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                                            ${selectedPeriod === period
                                                ? 'bg-indigo-600 text-white'
                                                : 'hover:bg-indigo-50 hover:text-indigo-600'}`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={getChartData(selectedPeriod)}>
                                <defs>
                                    <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#E5E7EB"
                                />
                                <XAxis
                                    dataKey="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    width={80}
                                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                    labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '4px' }}
                                />

                                <Bar
                                    dataKey="value"
                                    name={selectedPeriod}
                                    fill="url(#valueGradient)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={24}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>


                    </motion.div>
                </div>

                {/* City Performance and Recent Orders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* City Order Analysis */}
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl p-6"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">City Performance</h2>
                                <p className="text-sm text-gray-500">Order distribution by city</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={cityOrderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="orders"
                                >
                                    {cityOrderData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                                                    <p className="font-semibold">{payload[0].payload.city}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Orders: {payload[0].value}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Revenue: ${payload[0].payload.revenue.toLocaleString()}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {cityOrderData.map((entry, index) => (
                                <div key={entry.city} className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-sm text-gray-600">{entry.city}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Orders */}
                    <motion.div
                        className="bg-white rounded-xl shadow-md p-4"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Recent Orders</h2>
                            <button className="text-primary text-sm hover:underline">
                                View All
                            </button>
                        </div>

                        <Table
                            columns={columns}
                            data={recentOrders}
                            rowsPerPage={5}
                            initialSortKey="id"
                            onRowClick={(order) => console.log('Order clicked:', order)}
                        />
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col justify-between"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Insights</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center">
                                        <ShoppingCart className="text-green-600 mr-3" />
                                        <span className="text-green-800">Accepted Orders</span>
                                    </div>
                                    <span className="font-bold text-green-700">{quickInsightsData.acceptedOrders}</span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center">
                                        <XCircle className="text-color mr-3" />
                                        <span className="text-red-800">Rejected Orders</span>
                                    </div>
                                    <span className="font-bold text-red-700">{quickInsightsData.rejectedOrders}</span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Clock className="text-yellow-600 mr-3" />
                                        <span className="text-yellow-800">Avg Prep Time</span>
                                    </div>
                                    <span className="font-bold text-yellow-700">{quickInsightsData.avgPrepTime}</span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <AlertCircle className="text-blue-600 mr-3" />
                                        <span className="text-blue-800">Top Rejection</span>
                                    </div>
                                    <span className="font-bold text-blue-700">{quickInsightsData.topRejectionReason}</span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Users className="text-purple-600 mr-3" />
                                        <span className="text-purple-800">Staff On Duty</span>
                                    </div>
                                    <span className="font-bold text-purple-700">{quickInsightsData.staffOnDuty}</span>
                                </div>

                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <TrendingUp className="text-gray-600 mr-2" />
                                        <span className="text-gray-800 font-medium">Top Items Today</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {quickInsightsData.popularItems.map((item, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default FoodDeliveryDashboard;