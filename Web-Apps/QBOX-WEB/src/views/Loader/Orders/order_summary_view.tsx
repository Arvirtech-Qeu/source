import { useEffect, useState } from "react";
import OrderSummary, { FilterOption, Tab, TableColumn, OrderResponse } from "../Common widgets/order_summary_table";
// import { OrderResponse } from "../Common widgets/order_summary_table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { getInwardOrderDetailsV2 } from "@state/loaderDashboardSlice";
import { getAllArea } from "@state/areaSlice";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "@utils/storage";
import { getAllQboxEntities } from "@state/qboxEntitySlice";

type UserRole = 'Super Admin' | 'Aggregate Admin' | 'Supervisor' | 'Loader';

interface UserData {
  loginDetails: {
    authUserId: number;
    roleName: UserRole;
  };
}
const OrderSummaryExample: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { getInwardOrderDetailsV2List } = useSelector((state: RootState) => state.loaderDashboard);
  const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
  const regions: string[] = useSelector(
    (state: RootState) => state.qboxEntity.qboxEntityList);
  const orderData: OrderResponse =
    useSelector((state: RootState) => state.loaderDashboard.getInwardOrderDetailsV2List)
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [authUserSno, setAuthUserSno]: any = useState(null);
  const [roleName, setRoleName]: any = useState(null);
  const [areaSno, setAreaSno]: any = useState(null);
  const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  type StatusMapping = {
    [key: string]: string;
  };

  const STATUS_MAPPING: StatusMapping = {
    all: '',
    pending: 'Pending',
    awaitingDelivery: 'Awaiting Delivery',
    orderFulfilled: 'Order Fulfilled',
    rejected: 'Rejected'
  };

  console.log(regions)
  // Add this function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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
    const fetchData = async () => {
      if (!roleName) {
        console.log('Waiting for role name to be loaded...');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const basePayload = {
          transactionDate: getCurrentDate(),
          startDate: null,
          endDate: null,
          ...(roleName === 'Admin' && { locationSno: areaSno }),
          ...(roleName === 'Supervisor' && { authUserSno: Number(authUserSno) }),
          ...(roleName === 'Aggregator Admin' && { deliveryPartnerSno }),
          status: activeTab === 'all' ? null : STATUS_MAPPING[activeTab]
        };

        console.log('Fetching orders with payload:', basePayload);
        await dispatch(getInwardOrderDetailsV2(basePayload));

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch order data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, roleName, authUserSno, areaSno, deliveryPartnerSno, activeTab]);

  useEffect(() => {
    const fetchQboxEntities = () => {
      if (!roleName) {
        console.log('Waiting for role to be loaded...');
        return;
      }

      switch (roleName) {
        case 'Super Admin':
          dispatch(getAllQboxEntities({}));
          break;

        case 'Admin':
          if (!areaSno) {
            console.log('Waiting for area data...');
            return;
          }
          dispatch(getAllQboxEntities({ areaSno }));
          break;

        default:
          console.log('Role not authorized for QBox entities:', roleName);
          break;
      }
    };

    fetchQboxEntities();
  }, [dispatch, roleName, areaSno]);

  useEffect(() => {
    console.log('Order Data:', orderData);
  }, [orderData]);

  const tabs = [
    { id: 'all', label: 'Purchase Order' },
    // { id: 'pending', label: 'Pending' },
    { id: 'awaitingDelivery', label: 'Awaiting Delivery' },
    { id: 'orderFulfilled', label: 'Order Fulfilled' },
    { id: 'rejected', label: 'Rejected' }
  ];

  // Sample filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'qboxEntitySno',
      label: 'Location',
      type: 'select',
      // options: ['South Region', 'North Region', 'East Region', 'West Region']
      options: regions
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'daterange'
    },
    {
      id: 'status',
      label: 'Status',
      type: 'status',
      options: ['All', 'Pending', 'Awaiting Delivery', 'Order Fulfilled', 'Rejected']
    }
  ];

  // Sample table columns
  const tableColumns: TableColumn[] = [
    { key: 'name', title: 'Purchase Order Id', sortable: false },
    { key: 'location', title: 'Area', sortable: false },
    { key: 'qboxEntityName', title: 'Delivery Location', sortable: false },
    { key: 'restaurantName', title: 'Restaurant', sortable: false },
    { key: 'restaurantSkuName', title: 'Restaurant Sku', sortable: false },
    { key: 'items', title: 'Items', sortable: false },
    { key: 'inStock', title: 'In Stock', sortable: false },
    { key: 'status', title: 'Status', sortable: false },
    { key: 'date', title: 'Purchase Order Date', sortable: false },
    { key: 'time', title: 'Time', sortable: false },

  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    console.log('Active tab changed to:', tabId);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    // Get base payload based on role
    const basePayload = {
      transactionDate: getCurrentDate(),
      ...(roleName === 'Admin' && { locationSno: areaSno }),
      ...(roleName === 'Supervisor' && { authUserSno: Number(authUserSno) }),
      ...(roleName === 'Aggregator Admin' && { deliveryPartnerSno }),
      status: activeTab === 'all' ? null : STATUS_MAPPING[activeTab],
      // Add search parameters
      searchTerm: term ? term.trim() : null,
      searchFields: [
        'orderId',
        'purchaseOrderId',
        'qboxEntityName',
        'restaurantName',
        'foodSkuName'
      ]
    };

    // Remove null/undefined values
    const cleanPayload = Object.entries(basePayload).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('Search payload:', cleanPayload);
    dispatch(getInwardOrderDetailsV2(cleanPayload));
  };


  const handleFilter = (filters: Record<string, any>) => {
    console.log('Applied filters:', filters);
    // Implement filter logic
  };

  const handleViewDetails = (orderId: string, purchaseOrderDtlSno: string) => {
    if (!orderId || !purchaseOrderDtlSno) {
      console.error('Order ID is undefined or null');
      return;
    }

    console.log('View details for order:', orderId, purchaseOrderDtlSno);
    navigate("/orders/order-details", { state: { orderId, purchaseOrderDtlSno } });
  };



  return (
    <div className="max-w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <OrderSummary
          title="Purchase Order Summary"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          filterOptions={filterOptions}
          tableColumns={tableColumns}
          data={orderData}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export { OrderSummaryExample };