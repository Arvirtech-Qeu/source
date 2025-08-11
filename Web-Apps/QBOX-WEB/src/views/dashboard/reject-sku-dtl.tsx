import ImagePopup from "@components/imagePopup";
import { MasterCard } from "@components/MasterCard";
import { AlertCircle, Award, Clock, Eye, MapPin, Search, XCircle } from "lucide-react";
import { useState } from "react";

interface Location {
  areaName: string;
  cityName: string;
  line1: string;
}

interface RejectSkuItem {
  mediaDetails: any;
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
  const [showPopup, setShowPopup] = useState(false);
  const [images, setImages]: any = useState([]);

  const filteredSkuRejectList = rejectSkuList?.filter(item =>
    item.restaurantName.toLowerCase().includes(restaurantFilter.toLowerCase()) &&
    item.menu.toLowerCase().includes(skuFilter.toLowerCase())
  );

  if (rejectSkuList?.length === 0) {
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

  // const handleViewClick = (mediaDetails: any) => {
  //   console.log(mediaDetails)
  //   const sampleImages = [
  //     "https://qeuboxblob.blob.core.windows.net/quebox/file_6a8e2258-9290-4822-9372-01fabcca8082.JPEG",
  //     "https://qeuboxblob.blob.core.windows.net/quebox/file_84ebf485-2b13-4d71-88f2-a96219c40d64.JPEG",
  //     "https://qeuboxblob.blob.core.windows.net/quebox/file_84ebf485-2b13-4d71-88f2-a96219c40d64.JPEG",
  //     "https://download.samplelib.com/png/sample-bumblebee-400x300.png",
  //     "https://download.samplelib.com/png/sample-bumblebee-400x300.png",
  //     "https://download.samplelib.com/png/sample-bumblebee-400x300.png",
  //     "https://download.samplelib.com/png/sample-bumblebee-400x300.png",
  //     "https://download.samplelib.com/png/sample-bumblebee-400x300.png",
  //     "https://download.samplelib.com/png/sample-bumblebee-400x300.png",
  //     "https://download.samplelib.com/png/sample-bumblebee-400x300.png",
  //     "https://download.samplelib.com/png/sample-bumblebee-400x300.png"
  //   ]; // Replace with actual image URLs
  //   setImages(sampleImages);
  //   setShowPopup(true);
  // };

  const handleViewClick = (mediaDetails: any) => {
    if (!mediaDetails || !Array.isArray(mediaDetails)) {
      return;
    }

    // Flatten the nested array and extract media URLs
    const imageUrls = mediaDetails.flat().map((item: any) => item.mediaUrl);

    if (imageUrls.length === 0) {
      return;
    }

    console.log(imageUrls);
    setImages(imageUrls);
    setShowPopup(true);
  };


  return (
    <div className="animate-fadeIn">
      <div className="flex justify-end items-center mb-6 p-4">
        {/* Search Filters */}
        <div className="flex items-center space-x-4">
          {/* Restaurant Name Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Restaurant Name"
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm w-64"
            />
          </div>

          {/* SKU Name Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="SKU Name"
              value={skuFilter}
              onChange={(e) => setSkuFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm w-64"
            />
          </div>
          {/* Reset Button */}
          <button
            onClick={() => {
              setRestaurantFilter("");
              setSkuFilter("");
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-color rounded-lg hover:bg-color focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Reset
          </button>
        </div>
      </div>
      <MasterCard className="w-full overflow-hidden bg-white">
        <div className="p-4 bg-color">
          <h2 className="text-xl font-semibold text-white">Rejected SKU Details</h2>
          <p className="text-red-100 text-sm mt-1">Management your Rejected SKU</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-grey-300">
                <th className="low-bg-color text-color px-6 py-4 text-left font-semibold">
                  Purchase Order Id
                </th>
                <th className="low-bg-color  text-color px-6 py-4 text-left font-semibold">
                  Restaurant
                </th>
                <th className="low-bg-color  text-color px-6 py-4 text-left font-semibold">
                  Menu Item
                </th>
                <th className="low-bg-color  text-color px-6 py-4 text-left font-semibold">
                  SKU Code
                </th>
                <th className="low-bg-color  text-color px-6 py-4 text-left font-semibold">
                  Reject Reason
                </th>
                <th className="low-bg-color  text-color px-6 py-4 text-left font-semibold">
                  Delivery Location
                </th>
                <th className="low-bg-color  text-color px-6 py-4 text-left font-semibold">
                  View Picture
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSkuRejectList?.length > 0 ? (
                filteredSkuRejectList.map((item, index) => (
                  <tr
                    key={index}
                    className="group transition-colors menu-item"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
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
                      <div className="inline-flex items-center px-3 py-1 rounded-lg bg-red-200 text-red-700">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
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
                    <td className="px-6 py-4">
                      {/* <div className="px-6 py-4"> */}
                      <button
                        className="bg-color text-white px-4 py-2 rounded hover:bg-color transition"
                        onClick={() => handleViewClick(item.mediaDetails)}
                      >
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-white-800">
                          <Eye className="h-4 w-4 mr-2" />
                          View Picture
                        </span>
                      </button>

                      {showPopup && <ImagePopup images={images} onClose={() => setShowPopup(false)} />}
                      {/* </div> */}
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

