import React, { useState } from 'react';
import { MasterCard, CardContent, CardHeader, CardTitle } from "@components/MasterCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Input from '@components/Input';

const RestaurantDashboard = () => {
    const [locationFilter, setLocationFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('2025-01-02');

    const salesData = [
        { hour: '9AM', sales: 1200 },
        { hour: '10AM', sales: 1800 },
        { hour: '11AM', sales: 2400 },
        { hour: '12PM', sales: 3600 },
        { hour: '1PM', sales: 3200 },
        { hour: '2PM', sales: 2800 },
        { hour: '3PM', sales: 2000 },
        { hour: '4PM', sales: 1600 },
    ];

    const inventoryData = [
        { item: 'Fresh Tomatoes', stock: 23, minimum: 15, status: 'Good' },
        { item: 'Chicken Breast', stock: 23, minimum: 20, status: 'Good' },
        { item: 'Rice', stock: 43, minimum: 30, status: 'Good' },
        { item: 'Cooking Oil', stock: 17, minimum: 10, status: 'Good' },
    ];

    const bestSellers = [
        { item: 'Chicken Biryani', quantity: 45, revenue: 675.00, profit: 303.75 },
        { item: 'Butter Chicken', quantity: 38, revenue: 646.00, profit: 290.70 },
        { item: 'Veg Spring Rolls', quantity: 52, revenue: 416.00, profit: 208.00 },
        { item: 'Pad Thai', quantity: 28, revenue: 392.00, profit: 176.40 },
        { item: 'Mango Lassi', quantity: 56, revenue: 280.00, profit: 168.00 },
    ];

    return (
        <div className="p-4 space-y-4 bg-white min-h-screen pl-32 pr-16">
            <div className="flex justify-between items-center mb-6 bg-color p-4 rounded-lg text-white">
                <h1 className="text-2xl font-bold">Restaurant Management Dashboard</h1>
                <div className="flex gap-4">
                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-40 bg-white text-color"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MasterCard className="border-red-200 shadow-lg">
                    <CardHeader className="bg-red-50">
                        <CardTitle className="text-color">Daily Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-color">$8,425.50</div>
                        <div className="text-sm text-gray-500">246 Orders</div>
                    </CardContent>
                </MasterCard>
                <MasterCard className="border-red-200 shadow-lg">
                    <CardHeader className="bg-red-50">
                        <CardTitle className="text-color">Average Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-color">$34.25</div>
                        <div className="text-sm text-gray-500">↑ 12% vs last week</div>
                    </CardContent>
                </MasterCard>
                <MasterCard className="border-red-200 shadow-lg">
                    <CardHeader className="bg-red-50">
                        <CardTitle className="text-color">Items Returned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-color">10</div>
                        <div className="text-sm text-gray-500">$265.50 total value</div>
                    </CardContent>
                </MasterCard>
            </div>

            <Tabs defaultValue="sales" className="w-full" value={undefined} onValueChange={undefined}>
                <TabsList className="low-bg-color" selectedTab={undefined} setSelectedTab={undefined}>
                    <TabsTrigger value="sales" className="data-[state=active]:bg-color data-[state=active]:text-white" onClick={() => { }}>Sales Chart</TabsTrigger>
                    <TabsTrigger value="inventory" className="data-[state=active]:bg-color data-[state=active]:text-white" onClick={() => { }}>Inventory</TabsTrigger>
                    <TabsTrigger value="bestsellers" className="data-[state=active]:bg-color data-[state=active]:text-white" onClick={() => { }}>Best Sellers</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="mt-4">
                    <MasterCard className="border-red-200">
                        <CardHeader className="bg-red-50">
                            <CardTitle className="text-color">Hourly Sales Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sales" stroke="#dc2626" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </MasterCard>
                </TabsContent>

                <TabsContent value="inventory" className={undefined}>
                    <MasterCard className="border-red-200">
                        <CardHeader className="bg-red-50">
                            <CardTitle className="text-color">Current Inventory Levels</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-red-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider border-b border-red-200">Item</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider border-b border-red-200">Current Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider border-b border-red-200">Minimum Required</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider border-b border-red-200">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-100">
                                        {inventoryData.map((item) => (
                                            <tr key={item.item} className="hover:bg-red-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.item}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.minimum}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-sm ${item.status === 'Good' ? 'low-bg-color text-red-800' : 'low-bg-color text-red-800'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </MasterCard>
                </TabsContent>

                <TabsContent value="bestsellers" className={undefined}>
                    <MasterCard className="border-red-200">
                        <CardHeader className="bg-red-50">
                            <CardTitle className="text-color">Top Selling Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-red-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider border-b border-red-200">Item</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider border-b border-red-200">Quantity Sold</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider border-b border-red-200">Revenue</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider border-b border-red-200">Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-100">
                                        {bestSellers.map((item) => (
                                            <tr key={item.item} className="hover:bg-red-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.item}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.revenue.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.profit.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </MasterCard>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RestaurantDashboard;
