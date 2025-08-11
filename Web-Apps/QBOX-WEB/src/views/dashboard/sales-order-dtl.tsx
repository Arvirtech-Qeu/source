import { MasterCard } from "@components/MasterCard";
import { AlertCircle, Award, Clock, MapPin, XCircle } from "lucide-react";
import { useState } from "react";

interface Location {
  areaName: string;
  cityName: string;
  line1: string;
}

interface RejectSkuItem {
  description: string;
  orderId: string;
  menu: string;
  reason: string;
  restaurantName: string;
  location: Location[];
}

interface Props {
  rejectSkuList: RejectSkuItem[];
}

const RejectSkuDtl: React.FC<Props> = ({ rejectSkuList }) => {
  const [restaurantFilter, setRestaurantFilter] = useState("");
  const [skuFilter, setSkuFilter] = useState("");

  const filteredSkuRejectList = rejectSkuList?.filter(item =>
    item.restaurantName.toLowerCase().includes(restaurantFilter.toLowerCase()) &&
    item.menu.toLowerCase().includes(skuFilter.toLowerCase())
  );

  if (rejectSkuList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="text-center px-6 py-8">
          <AlertCircle className="mx-auto mb-6 text-color" size={64} />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Rejected SKU Found</h3>
          <p className="text-lg text-gray-600">There are currently no Rejected SKU Details Found to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-end items-center mb-8 ">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter by Restaurant Name"
            value={restaurantFilter}
            onChange={(e) => setRestaurantFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mr-2"
          />
          <input
            type="text"
            placeholder="Filter by SKU Name"
            value={skuFilter}
            onChange={(e) => setSkuFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
      </div>
      <MasterCard className="w-full overflow-hidden bg-white">
        <div className="p-4 custom-gradient-right">
          <h2 className="text-xl font-semibold text-white">Rejected SKU Details</h2>
          <p className="text-red-100 text-sm mt-1">Management your Rejected SKU</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-red-100">
                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">
                  Order Details
                </th>
                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">
                  Restaurant
                </th>
                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">
                  Menu Item
                </th>
                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">
                  SKU Code
                </th>
                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">
                  Reject Reason
                </th>
                <th className="bg-red-50 text-red-800 px-6 py-4 text-left font-semibold">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSkuRejectList?.length > 0 ? (
                filteredSkuRejectList.map((item, index) => (
                  <tr
                    key={index}
                    className="group transition-colors hover:bg-red-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full low-bg-color flex items-center justify-center">
                          <Clock className="h-5 w-5 text-color" />
                        </div>
                        <div className="ml-4">
                          <div className="font-semibold text-gray-900">#{item.orderId}</div>
                          <div className="text-xs text-gray-500">Order Reference</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.restaurantName}</div>
                      <div className="text-xs text-gray-500 mt-1">Restaurant Name</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Award className="h-4 w-4 mr-2" />
                        {item.menu}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                      {item.description}
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-lg low-bg-color text-red-700">
                        <span className="w-2 h-2 bg-color rounded-full mr-2"></span>
                        <span className="text-sm font-medium">{item.reason}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.location.map((loc, locIndex) => (
                        <div key={locIndex} className="mb-3 last:mb-0">
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-color mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {loc.areaName}, {loc.cityName}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {loc.line1}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 bg-white">
                      <div className="bg-red-50 p-3 rounded-full mb-4">
                        <AlertCircle className="text-color" size={32} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        No Menu Items Found
                      </h3>
                      <p className="text-gray-500 text-sm">
                        No matching items available at this time
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
  );
};

export default RejectSkuDtl;

