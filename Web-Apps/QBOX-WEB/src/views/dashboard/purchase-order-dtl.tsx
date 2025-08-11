// import React, { useEffect, useMemo, useState } from "react";
// import DateTime from "@components/DateTime";
// import { CardContent, CardHeader, CardTitle, MasterCard } from "@components/MasterCard";
// import { MapPin, Building, User, Calendar, AlertCircle } from "lucide-react";
// import { Pagination } from "@components/pagination";

// interface PurchaseOrder {
//   qboxEntitySno: number;
//   qboxEntityName: string;
//   partnerPurchaseOrderId: string;
//   entityCode: string;
//   deliveryPartnerName: string;
//   transactionDate: string;
//   orderStatusDesc: string;
//   statusColor: string;
//   purchaseOrderSno: string;
//   restaurantName: string;
// }

// interface Props {
//   purchaseOrdersDashboardList: PurchaseOrder[];
//   handleView: (orderSno: string, qboxEntitySno: number, purchaseOrderSno: string, transactionDate: string) => void;
// }

// const getStatusStyles = (status: string) => {
//   const styles = {
//     Green: {
//       background: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200",
//       icon: "text-emerald-600",
//       text: "text-emerald-700",
//       badge: "bg-emerald-100 text-emerald-700",
//       highlight: "bg-emerald-500",
//     },
//     Amber: {
//       background: "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200",
//       icon: "text-orange-600",
//       text: "text-orange-700",
//       badge: "bg-orange-100 text-orange-700",
//       highlight: "bg-orange-500",
//     },
//     Red: {
//       background: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200",
//       icon: "text-red-600",
//       text: "text-red-700",
//       badge: "bg-red-100 text-red-700",
//       highlight: "bg-red-500",
//     },
//     Grey: {
//       background: "bg-gradient-to-br from-gray-100 to-gray-300 border-gray-400",
//       icon: "text-gray-600",
//       text: "text-gray-700",
//       badge: "bg-gray-200 text-gray-800",
//       highlight: "bg-gray-500 text-gray-50",
//     },
//   };
//   return styles[status] || styles.Green;
// };

// const PurchaseOrderCard = ({ order, handleView }: { order: PurchaseOrder; handleView: Props["handleView"] }) => {
//   const styles = getStatusStyles(order.statusColor);

//   return (
//     <MasterCard
//       className={`cursor-pointer ${styles.background} border-2 relative overflow-hidden group hover:shadow-lg transition-shadow duration-200`}
//       onClick={() => handleView(
//         order.partnerPurchaseOrderId,
//         order.qboxEntitySno,
//         order.purchaseOrderSno,
//         order.transactionDate
//       )}
//     >
//       <div className={`absolute top-0 left-0 w-1 h-full ${styles.highlight}`} />
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-start">
//           <div className="flex items-center gap-2">
//             <div className={`p-2 bg-white bg-opacity-50 rounded-lg ${styles.icon}`}>
//               <MapPin className="w-4 h-4" />
//             </div>
//             <CardTitle className="text-lg font-semibold">{order.qboxEntityName}</CardTitle>
//           </div>
//           {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
//             {order.orderStatusDesc}
//           </span> */}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-2 font-semibold">
//               <span>{order.partnerPurchaseOrderId}</span>
//             </div>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-2 text-gray-600">
//               <Building className="w-4 h-4" />
//               <span>Entity Code</span>
//             </div>
//             <span className="font-medium">{order.entityCode}</span>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-2 text-gray-600">
//               <User className="w-4 h-4" />
//               <span>Restaurant</span>
//             </div>
//             <span className="font-medium">{order.restaurantName}</span>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-2 text-gray-600">
//               <Calendar className="w-4 h-4" />
//               <span>Transaction Date</span>
//             </div>
//             <DateTime
//               date={order.transactionDate}
//               showTime={false}
//               showDateIcon={true}
//               showTimeIcon={false}
//             />
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-2 text-gray-600">
//               <Calendar className="w-4 h-4" />
//               <span>Expercted Delivery Time</span>
//             </div>
//             <DateTime
//               date={order.transactionDate}
//               showTime={false}
//               showDateIcon={true}
//               showTimeIcon={false}
//             />
//           </div>
//           <div className="pt-3 mt-3 border-t border-gray-200 border-opacity-50"></div>
//         </div>
//       </CardContent>
//     </MasterCard>
//   );
// };

// const PurchaseOrderDtl: React.FC<Props> = ({ purchaseOrdersDashboardList, handleView }) => {
//   const itemsPerPage = 8;
//   const [currentPage, setCurrentPage] = useState(1);

//   // Calculate pagination directly from props
//   const totalItems = purchaseOrdersDashboardList.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   const paginatedOrders = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return purchaseOrdersDashboardList.slice(startIndex, endIndex);
//   }, [purchaseOrdersDashboardList, currentPage]);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   if (!purchaseOrdersDashboardList || purchaseOrdersDashboardList.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <div className="text-center px-6 py-8">
//           <AlertCircle className="mx-auto mb-6 text-color" size={64} />
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Purchase Orders Found</h3>
//           <p className="text-lg text-gray-600">There are currently no Purchase Orders Found to display.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {paginatedOrders.map((order) => (
//           <PurchaseOrderCard
//             key={`${order.partnerPurchaseOrderId}-${order.statusColor}-${order.transactionDate}`}
//             order={order}
//             handleView={handleView}
//           />
//         ))}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-center">
//           <Pagination
//             totalItems={totalItems}
//             itemsPerPage={itemsPerPage}
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseOrderDtl;

import React, { useEffect, useMemo, useState } from "react";
import DateTime from "@components/DateTime";
import { CardContent, CardHeader, CardTitle, MasterCard } from "@components/MasterCard";
import { MapPin, Building, User, Calendar, AlertCircle, Clock } from "lucide-react";
import { Pagination } from "@components/pagination";

interface PurchaseOrder {
  qboxEntitySno: number;
  qboxEntityName: string;
  partnerPurchaseOrderId: string;
  entityCode: string;
  deliveryPartnerName: string;
  transactionDate: string;
  orderStatusDesc: string;
  statusColor: string;
  purchaseOrderSno: string;
  restaurantName: string;
  orderStatusCd?: number; // Add this to your interface if it exists
  orderTime: string;
}

interface Props {
  purchaseOrdersDashboardList: PurchaseOrder[];
  handleView: (orderSno: string, qboxEntitySno: number, purchaseOrderSno: string, transactionDate: string) => void;
}

const getStatusStyles = (status: string) => {
  const styles = {
    Green: {
      background: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200",
      icon: "text-emerald-600",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-700",
      highlight: "bg-emerald-500",
    },
    Amber: {
      background: "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200",
      icon: "text-orange-600",
      text: "text-orange-700",
      badge: "bg-orange-100 text-orange-700",
      highlight: "bg-orange-500",
    },
    Red: {
      background: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200",
      icon: "text-red-600",
      text: "text-red-700",
      badge: "bg-red-100 text-red-700",
      highlight: "bg-red-500",
    },
    Grey: {
      background: "bg-gradient-to-br from-gray-100 to-gray-300 border-gray-400",
      icon: "text-gray-600",
      text: "text-gray-700",
      badge: "bg-gray-200 text-gray-800",
      highlight: "bg-gray-500 text-gray-50",
    },
  };
  return styles[status] || styles.Green;
};

const PurchaseOrderCard = ({ order, handleView }: { order: PurchaseOrder; handleView: Props["handleView"] }) => {
  const styles = getStatusStyles(order.statusColor);

  const expectedDeliveryTime = useMemo(() => {
    if (order.orderStatusCd === 36) { // Check if status is "Awaiting Delivery"
      try {
        // Parse the orderTime which includes the full timestamp
        const orderTime = new Date(order.orderTime);

        // Validate the date
        if (isNaN(orderTime.getTime())) {
          console.error('Invalid order time:', order.orderTime);
          return null;
        }

        // Create a new date object to avoid modifying the original
        const deliveryTime = new Date(orderTime);

        // Add 30 minutes
        deliveryTime.setMinutes(deliveryTime.getMinutes() + 30);

        // Format as HH:MM AM/PM
        return deliveryTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.error('Error calculating delivery time:', error);
        return null;
      }
    }
    return null;
  }, [order.orderTime, order.orderStatusCd]);

  return (
    <MasterCard
      className={`cursor-pointer ${styles.background} border-2 relative overflow-hidden group hover:shadow-lg transition-shadow duration-200`}
      onClick={() => handleView(
        order.partnerPurchaseOrderId,
        order.qboxEntitySno,
        order.purchaseOrderSno,
        order.transactionDate
      )}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${styles.highlight}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`p-2 bg-white bg-opacity-50 rounded-lg ${styles.icon}`}>
              <MapPin className="w-4 h-4" />
            </div>
            <CardTitle className="text-lg font-semibold">{order.qboxEntityName}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <span>{order.partnerPurchaseOrderId}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4" />
              <span>Entity Code</span>
            </div>
            <span className="font-medium">{order.entityCode}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>Restaurant</span>
            </div>
            <span className="font-medium">{order.restaurantName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Transaction Date</span>
            </div>
            <DateTime
              date={order.transactionDate}
              showTime={false}
              showDateIcon={true}
              showTimeIcon={false}
            />
          </div>

          {/* Conditionally render Expected Delivery Time only for status 36 */}
          {order.orderStatusCd === 36 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Expected Delivery Time</span>
              </div>
              <span className="font-medium">
                {expectedDeliveryTime || 'Calculating...'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </MasterCard>
  );
};

const PurchaseOrderDtl: React.FC<Props> = ({ purchaseOrdersDashboardList, handleView }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination directly from props
  const totalItems = purchaseOrdersDashboardList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return purchaseOrdersDashboardList.slice(startIndex, endIndex);
  }, [purchaseOrdersDashboardList, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!purchaseOrdersDashboardList || purchaseOrdersDashboardList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="text-center px-6 py-8">
          <AlertCircle className="mx-auto mb-6 text-color" size={64} />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Purchase Orders Found</h3>
          <p className="text-lg text-gray-600">There are currently no Purchase Orders Found to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedOrders.map((order) => (
          <PurchaseOrderCard
            key={`${order.partnerPurchaseOrderId}-${order.statusColor}-${order.transactionDate}`}
            order={order}
            handleView={handleView}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderDtl;