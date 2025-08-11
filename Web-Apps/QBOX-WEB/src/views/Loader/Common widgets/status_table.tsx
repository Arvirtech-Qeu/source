// "use client"

// import { useState } from "react"
// import { ChevronDown, Filter, MapPin, Search, X } from "lucide-react"
// import { cn } from "../utilts"
// import '../../../App.css';
// import Download from '@assets/images/cloud.png';
// import HotBox from '@assets/images/hotbox.png';
// import { getHotboxSummary } from "@state/loaderDashboardSlice";
// import { AsyncThunkAction, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@state/store";
// import NoData from '@assets/images/nodata.png';

// export interface StatusItem {
//   id: string
//   hotboxName: string
//   capacity: string
//   areaName: string
//   alerts: number
// }

// interface Area {
//   areaSno: string;
//   name: string;
// }

// interface StatusTableProps {
//   title: string
//   subtitle: string
//   items: StatusItem[]
//   locations: Area[]
//   showSearch?: boolean
//   showFilter?: boolean
//   placeholder?: string

//   onFilterChange?: (location: string) => void
// }

// export function StatusTable({
//   title,
//   subtitle,
//   items,
//   locations,
//   showSearch = true,
//   showFilter = true,
//   placeholder,
//   onFilterChange,
// }: StatusTableProps) {
//   // const [selectedLocation, setSelectedLocation] = useState(locations[0] || "")
//   const dispatch = useDispatch<AppDispatch>();
//   const [searchQuery, setSearchQuery] = useState("")
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false)
//   // const [selectedLocation, setSelectedLocation] = useState<Area>(locations[0] || { areaSno: 0, name: "" });
//   const [selectedLocation, setSelectedLocation] = useState<Area | null>(null);



//   // const handleLocationChange = (location: string) => {
//   //   setSelectedLocation(location)
//   //   setShowLocationDropdown(false)
//   //   if (onFilterChange) {
//   //     onFilterChange(location)
//   //   }
//   // }

//   // const handleLocationChange = (location: Area) => {
//   //   setSelectedLocation(location);
//   //   setShowLocationDropdown(false);

//   //   if (onFilterChange) {
//   //     onFilterChange(location.areaSno);
//   //   }

//   //   dispatch(getHotboxSummary({ area_sno: location.areaSno }));
//   // };

//   const handleLocationChange = (location: Area) => {
//     setSelectedLocation(location);
//     setShowLocationDropdown(false);

//     if (onFilterChange) {
//       onFilterChange(location.areaSno);
//     }

//     dispatch(getHotboxSummary({ area_sno: location.areaSno }));
//   };


//   const filteredItems = items.filter((item) => {
//     return item.areaName.toLowerCase().includes(searchQuery.toLowerCase())
//   })

//   console.log(filteredItems)

//   return (
//     <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//       <div className="p-4 md:p-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//           <div className="flex items-center gap-3 mb-3 md:mb-0">
//             <div className="low-bg-color p-2 rounded-full">
//               <img src={HotBox} alt="" className="w-8 h-8" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">{title}</h2>
//               <p className="text-sm text-gray-500">{subtitle}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Location Dropdown */}
//             <div className="relative">
//               {/* <select
//                 className=" border border-gray-300 rounded-full px-3 py-2 text-sm " style={{ width: '250px', minWidth: 'fit-content' }}
//                 value={selectedLocation.areaSno}
//                 onChange={(e) => {

//                   const selected = locations.find(
//                     (location) => location.areaSno.toString() === e.target.value
//                   );
//                   if (selected) handleLocationChange(selected);
//                 }}
//               >
//                 {locations.map((location) => (
//                   <option key={location.areaSno} value={location.areaSno} className="option">
//                     {location.name}
//                   </option>
//                 ))}
//               </select> */}
//               <select
//                 className="border border-gray-300 rounded-full px-3 py-2 text-sm"
//                 style={{ width: '250px', minWidth: 'fit-content' }}
//                 // value={selectedLocation?.areaSno || ''}
//                 value={selectedLocation?.areaSno?.toString() ?? ''}
//                 onChange={(e) => {
//                   const value = e.target.value;

//                   if (value === '') {
//                     // Reset location filter (show all data)
//                     setSelectedLocation(null); // or {}
//                     setShowLocationDropdown(false);
//                     if (onFilterChange) onFilterChange(""); // or 'all'
//                     dispatch(getHotboxSummary({}));
//                   } else {
//                     const selected = locations.find(
//                       (location) => location.areaSno.toString() === value
//                     );
//                     if (selected) handleLocationChange(selected);
//                   }
//                 }}
//               >
//                 <option value="">Select Location</option>
//                 {locations.map((location) => (
//                   <option key={location.areaSno} value={location.areaSno} className="option">
//                     {location.name}
//                   </option>
//                 ))}
//               </select>



//               {/* <button
//                 className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm"
//                 onClick={() => setShowLocationDropdown(!showLocationDropdown)}
//               >
//                 {selectedLocation.name}
//                 <ChevronDown size={16} />
//               </button>
//               {showLocationDropdown && (
//                 <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-lg z-10">
//                   {locations.map((location) => (
//                     <div
//                       key={location.areaSno}
//                       className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                       onClick={() => handleLocationChange(location)}
//                     >
//                       {location.name}
//                     </div>
//                   ))}

//                 </div>
//               )} */}
//             </div>

//             {/* {showFilter && (
//               <button className="border rounded-full p-2">
//                 <Filter size={18} />
//               </button>
//             )}

//             <button className="rounded-full border bg-white p-2">
//               <img src={Download} alt="" />
//             </button> */}
//           </div>
//         </div>

//         {/* Search Box (Optional) */}
//         {showSearch && (
//           <div className="mb-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder={placeholder}
//                 className="pl-10 pr-4 py-2 border rounded-md"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//         )}

//         {/* Status List */}
//         <div className={cn(
//           "space-y-3 custom-scroll", "overflow-y-auto pr-2"
//         )} style={{ maxHeight: '65vh' }}>
//           {filteredItems.length > 0 ? (
//             filteredItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex items-center justify-between py-3 border-b last:border-b-0"
//               >
//                 <div className="flex items-center gap-3">
//                   <MapPin className="text-color" size={20} />
//                   <div>
//                     <p className="font-medium">{item.hotboxName}</p>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">{item.areaName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">{item.capacity}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             // <div className="text-center text-gray-500 py-8">No hotbox found in this location</div>
//             <div className='flex flex-col text-lg text-center items-center justify-center'>
//               <img src={NoData} alt="" className='w-64' />
//               <h1 className='text-gray-300'>No data found</h1>
//               {/* No data available */}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

