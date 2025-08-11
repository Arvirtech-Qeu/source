import { MasterCard } from "@components/MasterCard";
import { AlertCircle, Award, Ban, ShoppingCart, Truck } from "lucide-react";
import React, { useState, useEffect } from "react";

const SalersDetails = ({
    mostSoldCountsList,
    unSoldSkuLunchList,
    unSoldSkuDinnerList
}: { mostSoldCountsList: any; unSoldSkuLunchList: any; unSoldSkuDinnerList: any }) => {

    const [mostSoldData, setMostSoldData] = useState<Record<string, any>>({});
    const [lunchSkuData, setLunchSkuData] = useState<Record<string, any>>({});
    const [dinnerSkuData, setDinnerSkuData] = useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = useState('soldCount');

    const processData = (dataList: any) => {
        const tempData: Record<string, any> = {};
        // Process today's orders
        dataList?.todayOrders?.forEach((item: any) => {
            const key = `${item.restaurantSkuName} - ${item.restaurantSno}`;
            tempData[key] = {
                todayDate: item.orderDate,
                today: item.totalOrders,
                prev: "-",
                restaurant: item.restaurantName,
                skuName: item.restaurantSkuName,
                deliveryPartnerName: item.deliveryPartnerName
            };
        });

        // Process previous orders
        dataList?.previousOrders?.forEach((item: any) => {
            const key = `${item.restaurantSkuName} - ${item.restaurantSno}`;
            if (tempData[key]) {
                tempData[key].prev = item.totalOrders;
            } else {
                tempData[key] = {
                    today: "-",
                    prev: item.totalOrders,
                    prevDate: item.orderDate,
                    restaurant: item.restaurantName,
                    skuName: item.restaurantSkuName,
                    deliveryPartnerName: item.deliveryPartnerName
                };
            }
        });

        return tempData;
    };

    useEffect(() => {
        setMostSoldData(processData(mostSoldCountsList));
    }, [mostSoldCountsList]);

    useEffect(() => {
        setLunchSkuData(processData(unSoldSkuLunchList));
    }, [unSoldSkuLunchList]);

    useEffect(() => {
        setDinnerSkuData(processData(unSoldSkuDinnerList));
    }, [unSoldSkuDinnerList]);

    const renderErrorMessage = () => (
        <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center px-6 py-8">
                <AlertCircle className="mx-auto mb-6 text-color" size={64} />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Data Found</h3>
                <p className="text-lg text-gray-600">
                    There are currently no details found to display for this tab.
                </p>
            </div>
        </div>
    );

    return (
        <>
            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('soldCount')}
                            className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'soldCount'
                                ? 'border-color text-color'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Sku Sold Count
                        </button>
                        <button
                            onClick={() => setActiveTab('unSoldLunchCount')}
                            className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'unSoldLunchCount'
                                ? 'border-color text-color'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Ban className="w-4 h-4" />
                            UnSold Lunch Count
                        </button>
                        <button
                            onClick={() => setActiveTab('unSoldDinnerCount')}
                            className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'unSoldDinnerCount'
                                ? 'border-color text-color'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Ban className="w-4 h-4" />
                            UnSold Dinner Count
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === "soldCount" && (
                <>
                    {Object.keys(mostSoldData).length === 0 ? renderErrorMessage() : (
                        <div className="overflow-x-auto">
                            <MasterCard className="w-full overflow-hidden bg-white">
                                <div className="p-4 bg-gradient-to-r from-red-600 to-red-700">
                                    <h2 className="text-xl font-semibold text-white">Most Sold SKU Details</h2>
                                    <p className="text-red-100 text-sm mt-1">Management your Most Sold SKU Details</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-red-100">
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Aggregator Name</th>
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Restaurant Sku</th>
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Today (Sold Count)</th>
                                                {/* <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Prev Day</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {Object.entries(mostSoldData).map(([skuName, details], index) => (
                                                <tr key={index} className="group transition-colors hover:bg-red-50/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="inline-flex items-center text-sm font-medium">
                                                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 flex">
                                                                    <Truck className="h-4 w-4 mr-2" />
                                                                    {details.deliveryPartnerName}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="inline-flex items-center text-sm font-medium">
                                                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 flex">
                                                                    <Award className="h-4 w-4 mr-2" />
                                                                    {details.skuName}
                                                                </span>
                                                            </span>
                                                            <span className="text-gray-500 text-sm mt-1 ml-3">{details.restaurant}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-green-700 text-xl pl-10">{details.today}</td>
                                                    {/* <td className="px-6 py-4 text-red-700 text-xl pl-10">{details.prev}</td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </MasterCard>
                        </div>
                    )}
                </>
            )}
            {activeTab === "unSoldLunchCount" && (
                <>
                    {Object.keys(lunchSkuData).length === 0 ? renderErrorMessage() : (
                        <div className="overflow-x-auto">
                            <MasterCard className="w-full overflow-hidden bg-white">
                                <div className="p-4 bg-gradient-to-r from-red-600 to-red-700">
                                    <h2 className="text-xl font-semibold text-white"> UnSold SKU Lunch Details</h2>
                                    <p className="text-red-100 text-sm mt-1">Management your UnSold SKU Lunch Details </p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-red-100">
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Aggregator Name</th>
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Restaurant Sku</th>
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Today (UnSold Count)</th>
                                                {/* <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Prev Day</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {Object.entries(lunchSkuData).map(([skuName, details], index) => (
                                                <tr key={index} className="group transition-colors hover:bg-red-50/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="inline-flex items-center text-sm font-medium">
                                                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 flex">
                                                                    <Truck className="h-4 w-4 mr-2" />
                                                                    {details.deliveryPartnerName}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="inline-flex items-center text-sm font-medium">
                                                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 flex">
                                                                    <Award className="h-4 w-4 mr-2" />
                                                                    {details.skuName}
                                                                </span>
                                                            </span>
                                                            <span className="text-gray-500 text-sm mt-1 ml-3">{details.restaurant}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-green-700 text-xl pl-10">{details.today}</td>
                                                    {/* <td className="px-6 py-4 text-red-700 text-xl pl-10">{details.prev}</td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </MasterCard>
                        </div>
                    )}
                </>
            )}
            {activeTab === "unSoldDinnerCount" && (
                <>
                    {Object.keys(dinnerSkuData).length === 0 ? renderErrorMessage() : (
                        <div className="overflow-x-auto">
                            <MasterCard className="w-full overflow-hidden bg-white">
                                <div className="p-4 bg-gradient-to-r from-red-600 to-red-700">
                                    <h2 className="text-xl font-semibold text-white"> UnSold SKU Dinner Details</h2>
                                    <p className="text-red-100 text-sm mt-1">Management your UnSold SKU Dinner Details </p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-red-100">
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Aggregator Name</th>
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Restaurant Sku</th>
                                                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Today (UnSold Count)</th>
                                                {/* <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">Prev Day</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {Object.entries(dinnerSkuData).map(([skuName, details], index) => (
                                                <tr key={index} className="group transition-colors hover:bg-red-50/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="inline-flex items-center text-sm font-medium">
                                                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 flex">
                                                                    <Truck className="h-4 w-4 mr-2" />
                                                                    {details.deliveryPartnerName}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="inline-flex items-center text-sm font-medium">
                                                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 flex">
                                                                    <Award className="h-4 w-4 mr-2" />
                                                                    {details.skuName}
                                                                </span>
                                                            </span>
                                                            <span className="text-gray-500 text-sm mt-1 ml-3">{details.restaurant}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-green-700 text-xl pl-10">{details.today}</td>
                                                    {/* <td className="px-6 py-4 text-red-700 text-xl pl-10">{details.prev}</td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </MasterCard>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default SalersDetails;

