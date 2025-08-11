import { StatGrid } from "@view/Loader/Common widgets/count_grid"
import { Package, ShoppingCart, AlertTriangle, Users } from "lucide-react"
import InventoryListExample from "./inventory_table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { useEffect, useState } from "react";
import { getDashboardStockSummary, getHotboxCountv3 } from "@state/loaderDashboardSlice";
import { getFromLocalStorage } from "@utils/storage";

export default function InventoryPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { getDashboardStockList, getHotboxCountLists } = useSelector((state: RootState) => state.loaderDashboard);
  const [error, setError] = useState<any>({})
  const [roleId, setRoleId]: any = useState(null);
  const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
  const [roleName, setRoleName]: any = useState(null);
  const [authUserId, setAuthUserId]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stateSno, setStateSno]: any = useState(null);
  const [citySno, setCitySno]: any = useState(null);
  const [areaSno, setAreaSno]: any = useState(null);

  // Add this function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const storedData = getFromLocalStorage('user');

        if (!storedData) {
          throw new Error('No user data found');
        }

        const { roleId, loginDetails } = storedData;

        if (!roleId) {
          throw new Error('Role ID is missing');
        }

        // Set the state values and trigger API call immediately
        if (loginDetails) {
          setRoleId(loginDetails.roleId || null);
          setDeliveryPartnerSno(loginDetails.deliveryPartnerSno || null);
          setRoleName(loginDetails.roleName || null);
          setAuthUserId(loginDetails.authUserId || null);
          setStateSno(loginDetails.stateSno || null);
          setCitySno(loginDetails.citySno || null);
          setAreaSno(loginDetails.areaSno || null);
        }

      } catch (err: any) {
        setError(err.message);
        console.error('Error loading user data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    // dispatch(getDashboardStockSummary({ transaction_date: getCurrentDate() }));
    dispatch(getHotboxCountv3({ transactionDate: getCurrentDate() }));
  }, [dispatch]);

  // Update the useEffect for getDashboardStockSummary
  useEffect(() => {
    const handleDashboardSummary = () => {
      if (!roleName) {
        console.log('Waiting for role to be loaded...');
        return;
      }

      switch (roleName) {
        case 'Super Admin':
          dispatch(getDashboardStockSummary({
            transaction_date: getCurrentDate()
          }));
          dispatch(getHotboxCountv3({ transactionDate: getCurrentDate() }));
          break;

        case 'Aggregator Admin':
          if (deliveryPartnerSno) {
            dispatch(getDashboardStockSummary({
              transaction_date: getCurrentDate(),
              delivery_partner_sno: deliveryPartnerSno
            }));
          }
          break;

        case 'Admin':
          if (stateSno && citySno && areaSno) {
            dispatch(getHotboxCountv3({ transactionDate: getCurrentDate(), areaSno: areaSno }));
          }
          break;

        case 'Supervisor':
          if (authUserId) {
            dispatch(getDashboardStockSummary({
              transaction_date: getCurrentDate(),
              auth_user_id: authUserId
            }));
            dispatch(getHotboxCountv3({ transactionDate: getCurrentDate(), authUserSno: authUserId }));
          }
          break;

        default:
          console.log('Unknown role for dashboard summary:', roleName);
          break;
      }
    };

    handleDashboardSummary();
  }, [dispatch, roleName, deliveryPartnerSno]);

  // Replace the statItems array with this conditional version
  const statItems = [
    {
      title: "TOTAL SKU IN HOTBOX",
      value: getDashboardStockList?.inventoryCount?.toLocaleString() || "0",
      description: "Total food packs in HotBox",
      icon: Package,
      // actionText: "View All",
      actionHandler: () => navigate("/inventory/active-orders"),
      isDisabled: (getDashboardStockList?.inventoryCount || 0) <= 0,
    },
    {
      title: "TOTAL SKU IN QBOX",
      value: getDashboardStockList?.skuInQboxCount?.toLocaleString() || "0",
      description: "Total food packs in QBox",
      icon: AlertTriangle,
      // actionText: "View All",
      actionHandler: () => navigate("/inventory/sku-loaded-in-qeubox"),
      isDisabled: (getDashboardStockList?.skuInQboxCount || 0) <= 0,
    },
    {
      title: "LOW STOCK",
      value: getHotboxCountLists?.lowStockCount?.toLocaleString() || "0",
      description: "Low stock alert",
      icon: ShoppingCart,
      actionText: "Restock",
      actionHandler: () => navigate("/inventory/low-stock"),
      isDisabled: (getHotboxCountLists?.lowStockCount || 0) <= 0,
    },
    // Only show Infrastructure for non-Aggregator Admin roles
    ...(roleName !== 'Aggregator Admin' ? [{
      title: "INFRASTRUCTURE",
      value: getDashboardStockList?.infraCount?.toString() || "0",
      description: "View Entity Infrastructure",
      icon: Users,
      actionText: "View Infrastructure",
      actionHandler: () => navigate("/inventory/entity-infra-details"),
      isDisabled: (getDashboardStockList?.infraCount || 0) <= 0,
    }] : [])
  ];


  return (
    <div className="p-10">
      {/* <StatGrid items={statItems} /> */}
      {/* <div className="pt-8 flex justify-between">
       
      </div> */}
      <div className="">
        {/* <h1 className="font-bold text-lg text-color">Inventory Items</h1> */}
        <InventoryListExample />
      </div>
    </div>
  )
}


