
import React, { useState, useEffect } from 'react';
import { MasterCard, CardContent, CardHeader, CardTitle } from "@components/MasterCard";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Package, ShoppingBag, Store, Truck, Users, Coffee, Calendar, Filter, Download, ArrowUpCircle, ArrowDownCircle, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getConsolidatedData } from '@state/superAdminDashboardSlice';
import { useSelector } from 'react-redux';
import { Card } from '@mui/material';

interface ConsolidatedDashboardProps {
  isHovered: any;
}


const ConsolidatedDashboard: React.FC<ConsolidatedDashboardProps> = ({ isHovered }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFrame, setTimeFrame] = useState('last7days');
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const { consolidatedDashboardList } = useSelector((state: RootState) => state.dashboardSlice);

  console.log(consolidatedDashboardList)

  useEffect(() => {
    dispatch(getConsolidatedData({}));
  }, []);

  // Sample data - would come from props in real implementation
  const data = consolidatedDashboardList || {
    // default values if consolidatedDashboardList is null or undefined
    total_sku_in: 0,
    total_sku_out: 0,
    total_food_menu: 0,
    total_locations: 0,
    last7days_sku_in: 0,
    prev7days_sku_in: 0,
    total_aggregator: 0,
    total_restaurant: 0,
    last30days_sku_in: 0,
    last7days_sku_out: 0,
    prev30days_sku_in: 0,
    prev7days_sku_out: 0,
    trend7days_sku_in: 0,
    last30days_sku_out: 0,
    prev30days_sku_out: 0,
    trend30days_sku_in: 0,
    trend7days_sku_out: 0,
    total_inward_orders: 0,
    trend30days_sku_out: 0,
    total_outward_orders: 0,
    last7days_inward_orders: 0,
    prev7days_inward_orders: 0,
    last30days_inward_orders: 0,
    last7days_outward_orders: 0,
    prev30days_inward_orders: 0,
    prev7days_outward_orders: 0,
    trend7days_inward_orders: 0,
    trend30days_inward_orders: 0,
    trend7days_outward_orders: 0
  };

  // Sample chart data
  const orderTrendData = [
    { name: 'Last 7 Days', inward: data.trend7days_inward_orders, outward: data.trend7days_outward_orders },
    { name: 'Last 30 Days', inward: data.trend30days_inward_orders, outward: data.trend30days_sku_out }
  ];

  const skuTrendData = [

    { name: 'Last 7 Days', skuIn: data.last7days_sku_in, skuOut: data.last7days_sku_out },
    { name: 'Last 30 Days', skuIn: data.last30days_sku_in, skuOut: data.last30days_sku_out }
  ];

  // Sample data for time frame filter

  // Function to handle time frame change
  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  const handleClick = (route) => {
    console.log(route)
    if (route) {
      navigate(route); // Navigate to the specified route
    }
  };

  const StatCard = ({ title, value, trend, icon: Icon, className = '', route }) => (
    <MasterCard className={`hover:shadow-lg transition-all duration-300 mt-5 rounded-2xl border border-gray-200 ${className}`}
      onClick={() => handleClick(route)}
    >
      <CardContent className="p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 ">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-2xl font-bold">{value}</h3>
            </div>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-green-600' : 'text-color'}`}>
              {trend >= 0 ? (
                <ArrowUpRight className="h-5 w-5" />
              ) : (
                <ArrowDownRight className="h-5 w-5" />
              )}
              <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </MasterCard>
  );

  const OrderTrendsCards = ({ data }) => {
    return (
      <div className="space-y-4  mt-4 h-full shadow-2xl border border-gray-300">
        <CardHeader>
          <CardTitle>Order Trends</CardTitle>
        </CardHeader>
        {/* <h2 className="text-xl font-semibold border-b border-gray-300 ">Order Trends</h2> */}
        {data.map((item, index) => (
          <Card key={index} className="m-6 shadow-xl">
            <CardHeader className="">
              <CardTitle className="text-lg text-gray-600">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowUpCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Inward Orders</p>
                    <p className="text-xl font-bold text-green-600">
                      {item.inward != null ? (Number.isInteger(item.inward) ? item.inward : item.inward.toFixed(2)) : 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowDownCircle className="w-6 h-6 text-color" />
                  <div>
                    <p className="text-sm text-gray-500">Outward Orders</p>
                    <p className="text-xl font-bold text-color">
                      {item.outward != null ? (Number.isInteger(item.outward) ? item.outward : item.outward.toFixed(2)) : 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      </div>
    );
  };


  // skuAnalysis

  const SkuAnalysis = ({ data }) => {
    return (

      <div className="space-y-4 mt-4 h-full shadow-2xl border border-gray-300">
        <CardHeader>
          <CardTitle>SKU Analysis</CardTitle>
        </CardHeader>

        {data.map((item, index) => (
          <Card key={index} className="m-4">
            <CardHeader>
              <CardTitle className="text-lg text-gray-600">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <ArrowUpCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Sku In</p>
                    <p className="text-xl font-bold text-green-600">
                      {item.skuIn != null
                        ? Number.isInteger(item.skuIn)
                          ? item.skuIn
                          : item.skuIn.toFixed(2)
                        : 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ArrowDownCircle className="w-6 h-6 text-color" />
                  <div>
                    <p className="text-sm text-gray-500">Sku Out</p>
                    <p className="text-xl font-bold text-color">
                      {item.skuOut != null
                        ? Number.isInteger(item.skuOut)
                          ? item.skuOut
                          : item.skuOut.toFixed(2)
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    );
  };

  return (
    <div className=" mb-10">
      <div className="custom-gradient-left h-32" />
      <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14 ' : 'pl-16 pr-14 '}`}>
        <div className="max-w-8xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg">

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">

                <div className="flex items-center gap-4  rounded-xl">
                  <div className="p-4 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-600 rounded-full">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-500 mt-2">Monitor your business metrics in real-time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
            <StatCard
              title="Total Delivery Locations"
              value={data.total_locations}
              icon={Package}
              trend={undefined}
              route="/qbox-admin/entity-dashboard"
            />
            <StatCard
              title="Total Aggregators"
              value={data.total_aggregator}
              icon={Users}
              trend={undefined}
              route="/restaurant-masters/deliver-aggregate-hub?tab=delivery-partners" // Navigate to the Delivery Partners page with tab parameter
            />
            <StatCard
              title="Total Restaurants"
              value={data.total_restaurant}
              icon={Store}
              trend={undefined}
              route="/restaurant-masters/deliver-aggregate-hub?tab=restaurants" // Navigate to the Restaurants page with tab parameter
            />
            <StatCard
              title="Total Food Menus"
              value={data.total_food_menu}
              icon={Coffee}
              trend={undefined}
              route="/restaurant-masters/deliver-aggregate-hub?tab=restaurans-food-items" // Navigate to the Menu Items page
            />
          </div>


          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderTrendsCards data={orderTrendData} />
            <SkuAnalysis data={skuTrendData} />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 ">
            <MasterCard className='border border-gray-300'>
              <CardHeader>
                <CardTitle>Inward Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 ">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last 7 Days</span>
                  <span className="text-lg font-bold">{data.last7days_inward_orders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last 30 Days</span>
                  <span className="text-lg font-bold">{data.last30days_inward_orders}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${(data.last7days_inward_orders / data.last30days_inward_orders) * 100}%` }}
                  />
                </div>
              </CardContent>
            </MasterCard>

            <MasterCard className='border border-gray-300'>
              <CardHeader>
                <CardTitle>Outward Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last 7 Days</span>
                  <span className="text-lg font-bold">{data.last7days_outward_orders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last 30 Days</span>
                  <span className="text-lg font-bold">{data.last30days_sku_out}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    style={{ width: `${(data.last7days_outward_orders / data.last30days_sku_out) * 100}%` }}
                  />
                </div>
              </CardContent>
            </MasterCard>

            <MasterCard className='border border-gray-300'>
              <CardHeader>
                <CardTitle>SKU Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">SKUs In</span>
                  <span className="text-lg font-bold">{data.total_sku_in}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">SKUs Out</span>
                  <span className="text-lg font-bold">{data.total_sku_out}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    style={{ width: `${(data.total_sku_out / data.total_sku_in) * 100}%` }}
                  />
                </div>
              </CardContent>
            </MasterCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedDashboard;