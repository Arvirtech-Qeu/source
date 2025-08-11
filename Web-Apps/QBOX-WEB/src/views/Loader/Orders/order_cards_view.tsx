import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CardContent, CardHeader, CardTitle } from "@components/MasterCard";
import { Badge, Chip } from "@mui/material";
import { Card } from "@components/card2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { getDetailedInwardOrders, setOrderQboxEntitySno } from "@state/loaderDashboardSlice";
import { AlertCircle, CircleCheckBig, PackageCheck, Salad } from "lucide-react";
import { EmptyState } from "../Common widgets/empty_state";
import { getFromLocalStorage } from "@utils/storage";
import { setOrderTransactionDate } from "@state/loaderDashboardSlice";



interface OrderItem {
  areaName: string;
  totalCount: number;
  orderedTime: string;
  QboxEntityName: string;
  purchaseOrderSno: number;
  purchaseOrderDtlSno: number;
  partnerPurchaseOrderId: string;
  restaurantSkuName: string;
  skuCode: string;
}

interface OrderList {
  pendingList: OrderItem[];
  completedList: OrderItem[];
  inTransitList: OrderItem[];
  issueReportedList: OrderItem[];
}


interface OrderProps {
  isHovered: any;
}

const OrderCardsView: React.FC<OrderProps> = ({ isHovered }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [selectedList, setSelectedList] = useState<OrderItem[]>([]);
  const [listType, setListType] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const { getDetailedInwardList } = useSelector((state: RootState) => state.loaderDashboard);
  const [orderData, setOrderData] = useState<OrderList>({
    pendingList: [],
    completedList: [],
    inTransitList: [],
    issueReportedList: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authUserSno, setAuthUserSno]: any = useState(null);
  const [roleName, setRoleName]: any = useState(null);
  const [areaSno, setAreaSno]: any = useState(null);
  const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const transactionDate = useSelector((state: RootState) => state.loaderDashboard.orderTransactionDate);
  const qboxEntitySno = useSelector((state: RootState) => state.loaderDashboard.qboxEntitySno);

  console.log("Transaction Date:", transactionDate);
  console.log("qboxEntitySno:", qboxEntitySno);

  // Add this function to get current date in YYYY-MM-DD format
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = getFromLocalStorage('user');

        if (!storedData) {
          throw new Error('No user data found');
        }

        const { loginDetails } = storedData;

        if (!loginDetails) {
          throw new Error('Login details not found');
        }

        // Set both values at once to ensure synchronization
        setAuthUserSno(loginDetails.authUserId ? Number(loginDetails.authUserId) : null);
        setRoleName(loginDetails.roleName || null);
        setAreaSno(loginDetails.areaSno || null);
        setDeliveryPartnerSno(loginDetails.deliveryPartnerSno || null);

        console.log('User data loaded:', {
          authUserId: loginDetails.authUserId,
          roleName: loginDetails.roleName,
          areaSno: loginDetails.areaSno,
          deliveryPartnerSno: loginDetails.deliveryPartnerSno
        });

      } catch (err: any) {
        console.error('Error loading user data:', err);
        setError(err.message);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = localStorage.getItem('orderViewState');
        if (savedState) {
          const {
            listType: savedListType,
            transactionDate: savedDate,
            qboxEntitySno: savedQboxEntitySno,
            type: savedType,
            roleName: savedRole,
            authUserSno: savedAuthUserSno,
            areaSno: savedAreaSno,
            deliveryPartnerSno: savedDeliveryPartnerSno
          } = JSON.parse(savedState);

          // Restore all necessary state
          setListType(location.state?.type || savedListType);
          if (savedDate) {
            dispatch(setOrderTransactionDate(savedDate));
            dispatch(setOrderQboxEntitySno(savedQboxEntitySno));
          }

          // Set role-specific data
          setRoleName(savedRole);
          setAuthUserSno(savedAuthUserSno);
          setAreaSno(savedAreaSno);
          setDeliveryPartnerSno(savedDeliveryPartnerSno);
          setOrderQboxEntitySno(savedQboxEntitySno);

          // Trigger data fetch with restored state
          const payload = {
            transactionDate: savedDate || getCurrentDate(),
            qboxEntitySno: savedQboxEntitySno,
            ...(savedRole === 'Admin' && { locationSno: savedAreaSno }),
            ...(savedRole === 'Aggregator Admin' && { deliveryPartnerSno: savedDeliveryPartnerSno }),
            ...(savedRole === 'Supervisor' && { authUserSno: savedAuthUserSno })
          };

          await dispatch(getDetailedInwardOrders(payload));

          // Clear the saved state after successful restoration
          localStorage.removeItem('orderViewState');
        }
      } catch (error) {
        console.error('Error restoring state:', error);
      }
    };

    // Call restoreState when component mounts or location changes
    restoreState();
  }, [dispatch, location.state]);


  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!roleName) {
      console.log('Waiting for role to be loaded...');
      return;
    }

    const payload = (() => {
      switch (roleName) {
        case 'Super Admin':
          return {
            transactionDate: transactionDate || getCurrentDate(),
            qboxEntitySno: qboxEntitySno || null
          };

        case 'Admin':
          if (!areaSno) {
            console.log('Waiting for area data...');
            return null;
          }
          return {
            transactionDate: transactionDate || getCurrentDate(),
            locationSno: areaSno,
            qboxEntitySno: qboxEntitySno || null
          };

        case 'Aggregator Admin':
          if (!deliveryPartnerSno) {
            console.log('Waiting for delivery partner data...');
            return null;
          }
          return {
            transactionDate: transactionDate || getCurrentDate(),
            deliveryPartnerSno: deliveryPartnerSno,
            qboxEntitySno: qboxEntitySno || null
          };

        case 'Supervisor':
          return {
            transactionDate: transactionDate || getCurrentDate(),
            authUserSno: authUserSno,
            qboxEntitySno: qboxEntitySno || null

          };

        default:
          console.log('Unknown role:', roleName);
          return null;
      }
    })();

    if (payload) {
      console.log('Dispatching with payload:', payload);
      dispatch(getDetailedInwardOrders(payload));
    }

  }, [dispatch, roleName, transactionDate, authUserSno, areaSno, deliveryPartnerSno, listType]);

  useEffect(() => {
    if (getDetailedInwardList) {
      // Directly set the data since it already matches our OrderList interface
      setOrderData(getDetailedInwardList);
    }
  }, [getDetailedInwardList]);

  useEffect(() => {
    const type = location.state?.type || listType;
    if (type && orderData) {
      setListType(type);
      switch (type) {
        case "pending":
          setSelectedList(orderData.pendingList || []);
          break;
        case "completed":
          setSelectedList(orderData.completedList || []);
          break;
        case "inTransit":
          setSelectedList(orderData.inTransitList || []);
          break;
        case "issues":
          setSelectedList(orderData.issueReportedList || []);
          break;
        default:
          setSelectedList([]);
      }
    }
  }, [location.state, orderData, listType]);

  const getStatusBadge = (type: string) => {
    switch (type) {
      case "pending":
        return <Badge>Pending</Badge>;
      case "completed":
        return <Badge>Completed</Badge>;
      case "inTransit":
        return <Badge>Awaiting Delivery</Badge>;
      case "issues":
        return <Badge>Issues</Badge>;
      default:
        return null;
    }
  };

  const handleCardClick = (order: OrderItem) => {
    // Save more complete state before navigation
    localStorage.setItem('orderViewState', JSON.stringify({
      listType,
      transactionDate: transactionDate || getCurrentDate(),
      previousPath: location.pathname,
      type: location.state?.type || listType,
      roleName,
      authUserSno,
      areaSno,
      deliveryPartnerSno
    }));

    setSelectedOrder(order);
    navigate("/orders/order-cards-view/ordered-sku-dtl", {
      state: {
        purchaseOrderDtlSno: order?.purchaseOrderDtlSno,
        returnPath: location.pathname,
        type: location.state?.type || listType
      }
    });
  };

  return (
    <div className="min-h-screen ">
      <div className="custom-gradient-left h-32" />
      <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14'}`}>
        <div className="max-w-8xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex items-center gap-4  rounded-xl">
                <div className="low-bg-color p-3 rounded-xl">
                  <CircleCheckBig className="w-8 h-8 text-color" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">{listType.charAt(0).toUpperCase() + listType.slice(1)} Orders</h1>
                  <p className="text-gray-500 mt-2">View your Order Fulfilled</p>
                </div>
              </div>

            </div>
          </div>
          {selectedList.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {selectedList.map((order, index) => (
                <Card
                  key={index}
                  className={`low-bg-color space-y-2 cursor-pointer hover:shadow-lg transition-shadow rounded-lg ${selectedOrder?.purchaseOrderSno === order.purchaseOrderSno ? "ring-2 ring-blue-500" : ""
                    }`}
                  onClick={() => handleCardClick(order)}
                >
                  <CardHeader className="bg-color rounded-t-lg">
                    <CardTitle className="flex justify-between items-center text-white">
                      <div className="flex items-center gap-2">
                        <Salad size={18} /> {/* SKU Icon */}
                        <span>{order.restaurantSkuName}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Location:</span>
                      <span className="text-black-500">{order.QboxEntityName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Area:</span>
                      <span className="text-black-500">{order.areaName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Order Time:</span>
                      <span className="text-black-500">{format(new Date(order.orderedTime), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="text-black-500">{order.partnerPurchaseOrderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ordered Count:</span>
                      <span className="text-black-500">{order.totalCount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCardsView; 