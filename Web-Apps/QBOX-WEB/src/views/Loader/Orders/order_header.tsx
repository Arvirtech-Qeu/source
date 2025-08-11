import { StatGrid } from "@view/Loader/Common widgets/count_grid"
import { OrderResponse } from "../Common widgets/order_summary_table";
import { ShoppingCart, AlertTriangle, CircleCheckBig } from "lucide-react"
import { OrderSummaryExample } from "./order_summary_view";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { useEffect, useState } from "react";
import { getFromLocalStorage } from "@utils/storage";

export default function OrderPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { getDashboardStockList } = useSelector((state: RootState) => state.loaderDashboard);

  const orderData = useSelector((state: RootState) => state.loaderDashboard.getInwardOrderDetailsV2List);  // Calculate counts from the data
  const pendingCount = orderData?.details?.filter(item => item.orderStatus === 'Pending')?.length || 0;
  const inTransitCount = orderData?.details?.filter(item => item.orderStatus === 'Awaiting Delivery')?.length || 0;
  const completedCount = orderData?.details?.filter(item => item.orderStatus === 'Order Fulfilled')?.length || 0;
  const issueReportedCount = orderData?.details?.filter(item => item.orderStatus === 'Rejected')?.length || 0;

  const [isFilterApply, setIsFilterApply] = useState<boolean>(() => {
    const storedValue = localStorage.getItem('dashboardIsFilterApply');
    // Default to false if no value exists, otherwise parse the stored value
    return storedValue ? storedValue === 'true' : false;
  });

  // Add this function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="px-10 py-2 mt-4">
      {/* <StatGrid items={statItems} /> */}
      <OrderSummaryExample />
    </div>
  )
}
