import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { confirmSkuRejectOrAccept, getDashboardStockSummary, getFullPurchaseOrder, getHotboxSummary } from "@state/loaderDashboardSlice";
import { StatGrid } from "@view/Loader/Common widgets/count_grid";
import { Package, ShoppingCart, AlertTriangle, Users, ChevronDown, ChevronRight, ExternalLink, Clock, X, Check, Box, Filter, Search, MapPin, Store, RefreshCw, Calendar, EyeClosedIcon, Eye, PackageSearch, AlertCircle, Truck, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage, removeFromLocalStorage } from "@utils/storage";
import { EmptyState } from "@view/Loader/Common widgets/empty_state";
import { useFilterContext } from "@context/FilterProvider";
import { getAllQboxEntities } from "@state/qboxEntitySlice";
import { getAllRestaurant } from "@state/restaurantSlice";
import FoodTracking from "@view/Loader/Orders/food-tracking";
import DateTime from "@components/DateTime";
import { searchSkuTraceWf } from "@state/supplyChainSlice";
import { getRejectSku } from "@state/superAdminDashboardSlice";
import { toast } from "react-toastify";
import { Modal } from '@components/Modal';

import { getAllState } from "@state/stateSlice";
import { getAllCity } from "@state/citySlice";
import { getAllCountry } from "@state/countrySlice"; // Note: This import is unused in the new code
import { getAllArea } from "@state/areaSlice";
import { getAllDeliiveryPartner } from "@state/deliveryPartnerSlice";
import { se } from "date-fns/locale";
import { set } from "date-fns";

interface ExpandedRows {
  [key: string]: boolean;
}

// Add these interfaces
interface PaginationState {
  mainTable: number;
  detailsTables: { [key: string]: number };
}


interface FilterState {
  skuName: string;
  remoteLocation: string;
  orderNo: string;
  restaurant?: string;
  date: string;
  state?: string;
  city?: string;
  area?: string;
  aggregator?: string;
}

interface DashboardCountFilter {
  inventoryCount: string;
  orderCount: string;
  rejectedCount: string;
  loaderCount: string;
}

interface MediaDetail {
  azureId: string;
  mediaSno: number;
  mediaUrl: string;
  mediaType: string;
  contentType: string;
}

interface Location {
  line1: string;
  line2: string;
  areaName: string;
  cityName: string;
}

interface RejectedSkuDetail {
  menu: string;
  reason: string;
  orderId: string;
  skuCode: string;
  location: Location[];
  uniqueCode: string;
  description: string;
  mediaDetails: MediaDetail[][];
  restaurantName: string;
  skuInventorySno: number;
  transactionDate: string;
  skuTraceWfSno: number;
  mediaSno: number;
  purchaseOrderSno: number;
  purchaseOrderDtlSno: number;
}


const TablePagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
      <div className="flex items-center">
        <span className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          // className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'low-bg-color text-color' : 'bg-color text-white hover:bg-gray-50 border'}`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          // className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'low-bg-color text-color' : 'bg-color text-white hover:bg-gray-50 border'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default function DashboardPage() {

  // Add this function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const dispatch = useDispatch<AppDispatch>();
  const { getDashboardStockList, getPurchaseOrderInfoList } = useSelector((state: RootState) => state.loaderDashboard);
  const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});
  const [pagination, setPagination] = useState<PaginationState>({
    mainTable: 1,
    detailsTables: {}
  });
  const MAIN_TABLE_ITEMS_PER_PAGE = 10;

  const [error, setError] = useState<any>({})
  const [stateSno, setStateSno]: any = useState(null);
  const [citySno, setCitySno]: any = useState(null);
  const [localAreaSno, setLocalAreaSno]: any = useState(null);
  const [roleId, setRoleId]: any = useState(null);
  const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
  const [roleName, setRoleName]: any = useState(null);
  const [authUserId, setAuthUserId]: any = useState(null);
  const [deliveryPartnerName, setDeliveryPartnerName]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setFilters: setGlobalFilters } = useFilterContext();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false);
  const [showAggregatorDropdown, setShowAggregatorDropdown] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    return localStorage.getItem('dashboardSelectedLocation') || '';
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>(() => {
    return localStorage.getItem('dashboardSelectedRestaurant') || '';
  });
  const [selectedAggrgator, setSelectedAggrgator] = useState<string>(() => {
    return localStorage.getItem('dashboardSelectedAggregator') || '';
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    return localStorage.getItem('dashboardSelectedDate') || getCurrentDate();
  });

  const [selectedLocationName, setSelectedLocationName] = useState<string>(() => {
    return localStorage.getItem('dashboardSelectedLocationName') || '';
  });

  const [selectedRestaurantName, setSelectedRestaurantName] = useState<string>(() => {
    return localStorage.getItem('dashboardSelectedRestaurantName') || '';
  });

  const [selectedAggregatorName, setSelectedAggregatorName] = useState<string>(() => {
    return localStorage.getItem('dashboardSelectedAggregatorName') || '';
  });

  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedSkuInventorySno, setSelectedSkuInventorySno] = useState<number | null>(null);
  const [rejectedSkuDetails, setRejectedSkuDetails] = useState<RejectedSkuDetail | null>(null);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
  const { restaurantList } = useSelector((state: any) => state.restaurant);
  const { deliveryPartnerList } = useSelector((state: any) => state.deliveryPartners);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(() => {
    return localStorage.getItem('dashboardSelectedStatus') || '';
  });

  const [isFilterApply, setIsFilterApply] = useState<boolean>(() => {
    const storedValue = localStorage.getItem('dashboardIsFilterApply');
    // Default to false if no value exists, otherwise parse the stored value
    return storedValue ? storedValue === 'true' : false;
  });


  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentListIndex, setCurrentListIndex] = useState(0);


  // const [rejectedSkuDetails, setRejectedSkuDetails] = useState<RejectedSkuDetail | null>(null);
  // const [showRejectedModal, setShowRejectedModal] = useState(false);


  const [selectedState, setSelectedState] = useState<string>(() => {
    const savedState = localStorage.getItem('dashboardSelectedState');
    return savedState && savedState !== 'undefined' ? savedState : '';
  });
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    const savedCity = localStorage.getItem('dashboardSelectedCity');
    return savedCity && savedCity !== 'undefined' ? savedCity : '';
  });
  const [selectedArea, setSelectedArea] = useState<string>(() => {
    const savedArea = localStorage.getItem('dashboardSelectedArea');
    return savedArea && savedArea !== 'undefined' ? savedArea : '';
  });
  const [selectedStateName, setSelectedStateName] = useState<string>(() => {
    const savedStateName = localStorage.getItem('dashboardSelectedStateName');
    return savedStateName && savedStateName !== 'undefined' ? savedStateName : '';
  });
  const [selectedCityName, setSelectedCityName] = useState<string>(() => {
    const savedCityName = localStorage.getItem('dashboardSelectedCityName');
    return savedCityName && savedCityName !== 'undefined' ? savedCityName : '';
  });
  const [selectedAreaName, setSelectedAreaName] = useState<string>(() => {
    const savedAreaName = localStorage.getItem('dashboardSelectedAreaName');
    return savedAreaName && savedAreaName !== 'undefined' ? savedAreaName : '';
  });
  const [selectedCountryName, setSelectedCountryName] = useState<string>(() => {
    return localStorage.getItem('dashboardSelectedCountryName') || '';
  });
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const { stateList } = useSelector((state: RootState) => state.state);
  const { cityList } = useSelector((state: RootState) => state.city);
  const { areaList } = useSelector((state: RootState) => state.area);

  useEffect(() => {
    if (roleName === 'Supervisor' || roleName === 'Aggregator Admin') {
      dispatch(getAllState({}));
    }
  }, [dispatch, roleName]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedArea', selectedArea);
  }, [selectedArea]);
  useEffect(() => {
    localStorage.setItem('dashboardSelectedAreaName', selectedAreaName);
  }, [selectedAreaName]);

  useEffect(() => {
    if (!selectedState) {
      setSelectedCity('');
      setSelectedCityName('');
      setSelectedArea('');
      setSelectedAreaName('');
    }
  }, [selectedState]);
  useEffect(() => {
    if (!selectedCity) {
      setSelectedArea('');
      setSelectedAreaName('');
    }
  }, [selectedCity]);

  // Initialize filters from localStorage or use default values
  const [filters, setFilters] = useState<FilterState>(() => {
    const savedFilters = localStorage.getItem('dashboardFilters');
    if (savedFilters) {
      return JSON.parse(savedFilters);
    }
    return {
      skuName: '',
      remoteLocation: '',
      orderNo: '',
      restaurant: '',
      date: getCurrentDate(),
      aggregator: '',
    };
  });

  const [dashboardFilters, setDashboardFilters] = useState<DashboardCountFilter>(() => {
    const savedCountFilters = localStorage.getItem('dashboardCountFilters');
    if (savedCountFilters) {
      return JSON.parse(savedCountFilters);
    }
    return {
      inventoryCount: getDashboardStockList?.inventoryCount?.toLocaleString() || "0",
      orderCount: getDashboardStockList?.orderCount?.toLocaleString() || "0",
      rejectedCount: getDashboardStockList?.rejectedCount?.toLocaleString() || "0",
      loaderCount: getDashboardStockList?.loaderCount?.toLocaleString() || "0",
    };
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // ensures 2-digit day
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // 3-letter lowercase month
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  // Define order statuses for filtering
  const ORDER_STATUSES = [
    {
      label: 'Awaiting Delivery',
      code: 36,
      icon: Clock,
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Order Fulfilled',
      code: 37,
      icon: Check,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Rejected',
      code: null,
      icon: AlertTriangle,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
    },
  ];

  type UserRole = 'Super Admin' | 'Admin' | 'Aggregator Admin' | 'Supervisor';

  // First, update the loadUserData function
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
          setStateSno(loginDetails.stateSno || null);
          setCitySno(loginDetails.citySno || null);
          setLocalAreaSno(loginDetails.areaSno || null);
          setRoleId(loginDetails.roleId || null);
          setDeliveryPartnerSno(loginDetails.deliveryPartnerSno || null);
          setRoleName(loginDetails.roleName || null);
          setAuthUserId(loginDetails.authUserId || null);
          setDeliveryPartnerName(loginDetails.deliveryPartnerName || null);
        }

      } catch (err: any) {
        setError(err.message);
        console.error('Error loading user data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []); // Empty dependency array since this should only run once

  useEffect(() => {
    const fetchData = async () => {
      // Fetch entity list based on role
      if (roleName === 'Admin') {
        await dispatch(getAllQboxEntities({ localAreaSno }));
      } else {
        await dispatch(getAllQboxEntities({}));
      }

      // Fetch restaurant list
      await dispatch(getAllRestaurant({}));
      await dispatch(getAllDeliiveryPartner({}));
    };

    fetchData();
  }, [dispatch, roleName, localAreaSno]);


  // Define handleDashboardSummary as a function in the component scope
  const handleDashboardSummary = () => {
    if (!roleName) {
      return;
    }

    const date = selectedDate || getCurrentDate();

    switch (roleName) {
      case 'Super Admin':
        dispatch(getDashboardStockSummary({
          transaction_date: date
        }));
        break;

      case 'Admin':
        if (localAreaSno) {
          dispatch(getDashboardStockSummary({
            transaction_date: date,
            location_sno: localAreaSno
          }));
        }
        break;

      case 'Aggregator Admin':
        if (deliveryPartnerSno) {
          dispatch(getDashboardStockSummary({
            transaction_date: date,
            delivery_partner_sno: deliveryPartnerSno,
            state_sno: stateSno,
            city_sno: citySno,
            area_sno: localAreaSno,
          }));
        }
        break;

      case 'Supervisor':
        if (authUserId) {
          dispatch(getDashboardStockSummary({
            transaction_date: date,
            auth_user_id: authUserId
          }));
        }
        break;

      default:
        break;
    }
  };

  // Update the useEffect for getDashboardStockSummary
  useEffect(() => {
    handleDashboardSummary();
  }, [dispatch, roleName, localAreaSno, deliveryPartnerSno, selectedDate]);


  // Save filter state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboardFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('dashboardCountFilters', JSON.stringify(dashboardFilters));
  }, [dashboardFilters]);

  // Save other filter states to localStorage
  useEffect(() => {
    localStorage.setItem('dashboardSelectedLocation', selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedRestaurant', selectedRestaurant);
  }, [selectedRestaurant]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedDate', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedStatus', selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    localStorage.setItem('dashboardIsFilterApply', isFilterApply.toString());
  }, [isFilterApply]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedLocationName', selectedLocationName);
  }, [selectedLocationName]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedRestaurantName', selectedRestaurantName);
  }, [selectedRestaurantName]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedAggregatorName', selectedAggregatorName);
  }, [selectedAggregatorName]);

  useEffect(() => {
    localStorage.setItem('dashboardSelectedAggregator', selectedAggrgator);
  }, [selectedAggrgator]);

  // Update the useEffect
  useEffect(() => {
    const handleRoleBasedDispatch = () => {
      // Don't proceed if role isn't loaded
      if (!roleName) {
        return;
      }

      // Use saved filters if available
      const transactionDate = selectedDate || getCurrentDate();
      const stateSno = selectedState || null;
      const citySno = selectedCity || null;
      const areaSno = selectedArea || localAreaSno || null;
      const restaurantSno = selectedRestaurant || null;

      switch (roleName) {
        case 'Super Admin':
          dispatch(getFullPurchaseOrder({
            transactionDate,
            stateSno,
            citySno,
            areaSno,
            restaurantSno,
            deliveryPartnerSno: selectedAggrgator || null
          }));
          break;

        case 'Admin':
          // Only dispatch if all required params are present
          if (areaSno) {
            dispatch(getFullPurchaseOrder({
              stateSno,
              citySno,
              areaSno,
              transactionDate,
              restaurantSno,
              deliveryPartnerSno: selectedAggrgator || null
            }));
          }
          break;

        case 'Aggregator Admin':
          // Only dispatch if deliveryPartnerSno is present
          if (deliveryPartnerSno) {
            dispatch(getFullPurchaseOrder({
              transactionDate,
              deliveryPartnerSno,
              stateSno,
              citySno,
              areaSno,
              restaurantSno
            }));
          }
          break;

        default:
          break;
      }
    };

    handleRoleBasedDispatch();
  }, [roleName, stateSno, citySno, localAreaSno, deliveryPartnerSno, dispatch, filters, selectedDate, selectedRestaurant, selectedStatus]);

  // Add toggle function for expanding rows
  const toggleRow = (orderId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };


  const navigate = useNavigate();

  const statItems = useMemo(() => {
    const baseItems = [
      {
        title: "INVENTORY",
        value: isFilterApply ? dashboardFilters?.inventoryCount :
          (getDashboardStockList?.inventoryCount?.toLocaleString() || "0"),
        description: "Total Sku's in Hot Box / Qbox",
        icon: Package,
        actionText: "",
        actionHandler: () => navigate("/dashboard/inventory"),
        isDisabled: (getDashboardStockList?.inventoryCount || 0) <= 0,
      },
      {
        title: "ORDERS",
        value: isFilterApply ? dashboardFilters?.orderCount :
          (getDashboardStockList?.orderCount?.toLocaleString() || "0"),
        description: "Active orders today",
        icon: ShoppingCart,
        actionText: "",
        actionHandler: () => navigate("/dashboard/orders"),
        isDisabled: (getDashboardStockList?.orderCount || 0) <= 0,
      },
      {
        title: "REJECT",
        value: isFilterApply ? dashboardFilters?.rejectedCount :
          (getDashboardStockList?.rejectedCount?.toLocaleString() || "0"),
        description: "Issues with SKU",
        icon: AlertTriangle,
        actionHandler: () => navigate("/dashboard/damaged-sku"),
        isDisabled: (getDashboardStockList?.rejectedCount || 0) <= 0,
      }
    ];

    // Only add Loaders stat if not Aggregator Admin
    if (roleName !== 'Aggregator Admin') {
      baseItems.push({
        title: "LOADERS",
        value: isFilterApply ? dashboardFilters?.loaderCount :
          (getDashboardStockList?.loaderCount?.toString() || "0"),
        description: "Active loaders on duty",
        icon: Users,
        actionText: "View Loaders",
        actionHandler: () => navigate("/dashboard/loader"),
        isDisabled: (getDashboardStockList?.loaderCount || 0) <= 0,
      });
    }

    return baseItems;
  }, [getDashboardStockList, roleName, navigate, isFilterApply, dashboardFilters]);


  // Add this helper function
  const getStatusIcon = (wfStageCd: number) => {
    switch (wfStageCd) {
      case 6: return <Clock className="w-4 h-4 mr-2" />;
      case 8: return <X className="w-4 h-4 mr-2" />;
      case 9: return <Check className="w-4 h-4 mr-2" />;
      case 10: return <Box className="w-4 h-4 mr-2" />;
      case 11: return <Box className="w-4 h-4 mr-2" />;
      case 12: return <Box className="w-4 h-4 mr-2" />;
      case 13: return <Box className="w-4 h-4 mr-2" />;
      default: return null;
    }
  };

  const getStatusText = (wfStageCd: number) => {
    switch (wfStageCd) {
      case 6: return 'Awaiting Delivery';
      case 7: return 'Sku Delivery';
      case 8: return 'Rejected';
      case 9: return 'Accepted';
      case 10: return 'In Inventory Box';
      case 11: return 'In QBox';
      case 12: return 'Returned to Hot Box';
      case 13: return 'Customer Delivery';
      default: return '';
    }
  };

  const getStatusClass = (wfStageCd: number) => {
    switch (wfStageCd) {
      case 6: return 'bg-yellow-50 text-yellow-700';
      case 7: return 'bg-yellow-50 text-yellow-700';
      case 8: return 'low-bg-color text-red-700';
      case 9: return 'bg-green-50 text-green-700';
      case 10: return 'bg-orange-50 text-orange-700';
      case 11: return 'bg-purple-50 text-purple-700';
      case 12: return 'bg-indigo-50 text-indigo-700';
      case 13: return 'bg-teal-50 text-teal-700';
      default: return '';
    }
  };

  const getOrderStatusText = (statusCode: number) => {
    switch (statusCode) {
      case 36: return 'Awaiting Delivery';
      case 37: return 'Order Fulfilled';
      // case 38: return 'Pending';
      default: return 'Rejected';
    }
  };
  // Add pagination handlers
  const handleMainTablePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, mainTable: page }));
  };

  // Add this helper function to safely get quantity
  const getOrderQuantity = (order: any) => {
    if (!order?.details?.length) return 0;
    return order.details.reduce((total: number, detail: any) => total + (detail.orderQuantity || 0), 0);
  };

  const getFilteredOrders = (orders: any[]) => {
    if (!orders) return [];

    return orders.filter(order => {

      const matchesLocation = !filters.remoteLocation ||
        String(order.qboxEntitySno ?? '').includes(
          String(filters.remoteLocation ?? '')
        );

      const matchesRestaurant = !filters.restaurant ||
        String(order.restaurantSno ?? '').includes(
          String(filters.restaurant ?? '')
        );


      const matchesOrderNo = !filters.orderNo ||
        String(order.partnerPurchaseOrderId ?? '').toLowerCase().includes(
          String(filters.orderNo ?? '').toLowerCase()
        );

      const matchesSku = !filters.skuName ||
        order.details?.some((detail: any) =>
          String(detail.foodSkuName ?? '').toLowerCase().includes(
            String(filters.skuName ?? '').toLowerCase()
          )
        );

      const matchesDate = !filters.date ||
        order.transactionDate === filters.date;

      // const matchesAggregator = !filters.aggregator ||
      //   String(order.deliveryPartnerSno ?? '').includes(
      //     String(filters.aggregator ?? '')
      //   );

      const matchesStatus = !selectedStatus || (() => {
        switch (selectedStatus) {
          case 'Awaiting Delivery':
            return order.orderStatusCd === 36;
          case 'Order Fulfilled':
            return order.orderStatusCd === 37;
          case 'Rejected':
            return ![36, 37, 38].includes(order.orderStatusCd);
          default:
            return true;
        }
      })();
      return matchesLocation && matchesRestaurant && matchesOrderNo &&
        matchesSku && matchesDate && matchesStatus;
    });
  };


  const handleLocationClick = (qboxEntitySno: any, qboxEntityName: any, areaName: any, transactionDate: any,) => {
    const isSuperOrAdmin = roleName === 'Super Admin' || roleName === 'Admin';

    const baseUrl = isSuperOrAdmin
      ? `/dashboard/qbox-location-dashboard`
      : roleName === 'Loader'
        ? `/loader-dashboard`
        : roleName === 'Supervisor'
          ? `/supervisor-dashboard`
          : `/dashboard/aggregator-admin-dashboard`;

    navigate(`${baseUrl}?qboxEntitySno=${qboxEntitySno}
            &transactionDate=${selectedDate}&qboxEntityName=${qboxEntityName}
            &roleId=${roleId}&areaName=${areaName}&&deliveryPartnerSno=${deliveryPartnerSno}`);
    setGlobalFilters({
      qboxEntitySno: qboxEntitySno || '',
      qboxEntityName: qboxEntityName,
      transactionDate: selectedDate,
      roleId: roleId !== null ? roleId : 0,
      deliveryPartnerSno: deliveryPartnerSno !== null ? deliveryPartnerSno : 0, // Ensure roleId is a number and handle null
      areaName: areaName || '',
    });
  };

  const handleApplyFilters = async () => {
    setFilters(prev => ({
      ...prev,
      remoteLocation: selectedLocation,
      restaurant: selectedRestaurant,
      date: selectedDate,
      state: selectedState,
      city: selectedCity,
      area: selectedArea,
      aggregator: selectedAggrgator
    }));
    setIsFilterApply(true);
    const purchaseOrderPayload = {
      transactionDate: selectedDate,
      qboxEntitySno: selectedLocation || null,
      restaurantSno: selectedRestaurant || null,
      stateSno: selectedState || null,
      citySno: selectedCity || null,
      areaSno: selectedArea || null,
      deliveryPartnerSno: selectedAggrgator || null,
      ...(roleName === 'Admin' && { localAreaSno }),
      ...(roleName === 'Aggregator Admin' && { deliveryPartnerSno }),
      // ...(roleName === 'Aggregator Admin' && { deliveryPartnerSno })
    };
    dispatch(getFullPurchaseOrder(purchaseOrderPayload));
    try {
      const payload = {
        transaction_date: selectedDate,
        qbox_entity_sno: selectedLocation || null,
        restaurant_sno: selectedRestaurant || null,
        delivery_partner_sno: deliveryPartnerSno || selectedAggrgator || null,
        state_sno: selectedState || null,
        city_sno: selectedCity || null,
        location_sno: selectedArea || null,
      };
      const response = await dispatch(getDashboardStockSummary(payload)).unwrap();
      setDashboardFilters({
        inventoryCount: response.inventoryCount?.toLocaleString() || "0",
        orderCount: response.orderCount?.toLocaleString() || "0",
        rejectedCount: response.rejectedCount?.toLocaleString() || "0",
        loaderCount: response.loaderCount?.toLocaleString() || "0",
      });
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      orderNo: '',
      skuName: '',
      remoteLocation: '',
      restaurant: '',
      date: getCurrentDate(),
      state: '',
      city: '',
      area: ''
    });
    setSelectedLocation('');
    setSelectedRestaurant('');
    setSelectedRestaurantName('');
    setSelectedLocationName('');
    setSelectedDate(getCurrentDate());
    setSelectedStatus('');
    setSelectedCountryName('');
    setSelectedState('');
    setSelectedStateName('');
    setSelectedCity('');
    setSelectedCityName('');
    setSelectedArea('');
    setSelectedAreaName('');
    setSelectedAggrgator('');
    setSelectedAggregatorName('');
    sessionStorage.removeItem('dashboardFilters');
    removeFromLocalStorage('dashboardCountFilters');
    removeFromLocalStorage('dashboardSelectedLocationName');
    removeFromLocalStorage('dashboardSelectedRestaurantName');
    removeFromLocalStorage('dashboardSelectedAggregatorName');
    removeFromLocalStorage('dashboardSelectedCountryName');
    removeFromLocalStorage('dashboardSelectedStateName');
    removeFromLocalStorage('dashboardSelectedCityName');
    removeFromLocalStorage('dashboardSelectedArea');
    removeFromLocalStorage('dashboardSelectedAreaName');
    setIsFilterApply(false);
    // ... handleDashboardSummary ...
  };

  useEffect(() => {
    console.log('isFilterApply changed to:', isFilterApply);
  }, [isFilterApply]);

  // Add this component inside your dashboard_header.tsx file
  const SkuTrackingModal = ({ isOpen, onClose, skuInventorySno }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { skuTraceWfList } = useSelector((state: RootState) => state.supplyChain);
    const [processingTime, setProcessingTime] = useState("");

    // Fetch tracking data when modal opens
    useEffect(() => {
      if (isOpen && skuInventorySno) {
        dispatch(searchSkuTraceWf({ skuInventorySno }));
      }
    }, [isOpen, skuInventorySno, dispatch]);

    // Calculate processing time
    useEffect(() => {
      if (skuTraceWfList?.length > 0) {
        const timestamps = skuTraceWfList
          .map(event => new Date(event.actionTime ?? "").getTime())
          .filter(time => !isNaN(time));

        if (timestamps.length > 0) {
          const minTime = Math.min(...timestamps);
          const maxTime = Math.max(...timestamps);
          const processingTimeMs = maxTime - minTime;
          const hours = Math.floor(processingTimeMs / (1000 * 60 * 60));
          const minutes = Math.floor((processingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
          setProcessingTime(`${hours}h ${minutes}m`);
        }
      }
    }, [skuTraceWfList]);

    // Stage icon mapping
    const stageIconMap = {
      6: Package,
      7: Truck,
      8: AlertCircle,
      9: Check,
      10: Box,
      11: Box,
      13: Truck,
    };

    const totalStages = 8;
    const completedStages = skuTraceWfList?.filter((stage) => stage.actionTime).length || 0;

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="p-2 bg-gray-50 rounded-lg flex items-center">
                      <PackageSearch className="w-5 h-5 text-color mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">SKU Tracking Details</h3>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">Order ID:</span>
                      <span className="ml-2 font-semibold text-lg text-color">
                        {skuTraceWfList?.[0]?.purchaseOrderId || "N/A"}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">Unique Code:</span>
                      <span className="ml-2 font-mono text-sm text-color">
                        {skuTraceWfList?.[0]?.uniqueCode || "N/A"}
                      </span>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="low-bg-color rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="text-color" size={20} />
                    <div>
                      <div className="text-lg font-bold text-color">{processingTime || "N/A"}</div>
                      <div className="text-xs text-gray-600">Processing Time</div>
                    </div>
                  </div>
                </div>

                <div className="low-bg-color rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-color" size={20} />
                    <div>
                      <div className="text-lg font-bold text-color">
                        {skuTraceWfList?.[skuTraceWfList.length - 1]?.codesDtl1description || "N/A"}
                      </div>
                      <div className="text-xs text-gray-600">Current Status</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                {skuTraceWfList?.map((stage, index) => {
                  const Icon = stageIconMap[stage.wfStageCd] || AlertCircle;
                  return (
                    <div key={stage.skuTraceWfSno} className="relative">
                      {index !== 0 && (
                        <div className="absolute h-full w-px bg-gray-200 left-6 top-0 -translate-x-1/2" />
                      )}
                      <div className="flex gap-4 items-start relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                        ${stage.actionTime ? 'bg-color text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">
                              {stage.codesDtl1description || "No Description"}
                            </h4>
                            <span className="text-sm text-gray-500">
                              <DateTime
                                date={stage.actionTime}
                                showDateIcon={false}
                                showTimeIcon={false}
                                color='gray'
                              />
                            </span>
                          </div>
                          {stage.reference && (
                            <p className="text-sm text-gray-600 mt-1">
                              Ref: {stage.reference}
                            </p>
                          )}
                          {stage.wfStageCd === 8 && (
                            <button
                              onClick={async () => {
                                try {
                                  const response = await dispatch(getRejectSku({
                                    skuInventorySno: stage.skuInventorySno
                                  })).unwrap();
                                  if (response && response[0]) {
                                    setRejectedSkuDetails(response[0]);
                                    setShowRejectedModal(true);
                                  }
                                } catch (error) {
                                }
                              }}
                              className="mt-3 px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color ml-auto"
                            >
                              <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-white">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const handleSkuAction = async (action: 'accept' | 'reject') => {
    try {
      if (!rejectedSkuDetails?.skuInventorySno) {
        return;
      }

      const payload = {
        status: action,
        skuTraceWfSno: rejectedSkuDetails.skuTraceWfSno,
        mediaSno: rejectedSkuDetails.mediaSno,
        purchaseOrderSno: rejectedSkuDetails.purchaseOrderSno,
        purchaseOrderDtlSno: rejectedSkuDetails.purchaseOrderDtlSno,
        skuInventorySno: rejectedSkuDetails.skuInventorySno
      };

      const response = await dispatch(confirmSkuRejectOrAccept(payload));

      if (response.payload) {
        // Refresh the rejected SKU list
        // await dispatch(getSkuRejectList({}));
        setShowRejectedModal(false);

        // Show success message
        toast.success(`SKU ${action}ed successfully`);
      }
    } catch (error) {
      console.error('Error updating SKU status:', error);
      // toast.error(`Failed to ${action} SKU`);
    }
  };


  const RejectedSkuModal = () => {
    if (!rejectedSkuDetails) return null;

    const allImages = rejectedSkuDetails.mediaDetails?.flat().filter(Boolean) || [];
    const hasMultipleImages = allImages.length > 1;

    // Get the current media list
    const mediaLists = rejectedSkuDetails.mediaDetails || [];
    const currentMediaList = mediaLists[currentListIndex] || [];
    const currentImage = currentMediaList[currentImageIndex];

    // Calculate total counts
    const totalLists = mediaLists.length;
    const totalImagesInCurrentList = currentMediaList.length;

    const handleNext = () => {
      if (currentImageIndex < totalImagesInCurrentList - 1) {
        // Move to next image in current list
        setCurrentImageIndex(currentImageIndex + 1);
      } else if (currentListIndex < totalLists - 1) {
        // Move to first image of next list
        setCurrentListIndex(currentListIndex + 1);
        setCurrentImageIndex(0);
      }
    };

    const handlePrevious = () => {
      if (currentImageIndex > 0) {
        // Move to previous image in current list
        setCurrentImageIndex(currentImageIndex - 1);
      } else if (currentListIndex > 0) {
        // Move to last image of previous list
        const previousList = mediaLists[currentListIndex - 1];
        setCurrentListIndex(currentListIndex - 1);
        setCurrentImageIndex(previousList.length - 1);
      }
    };

    return (
      <Modal
        isOpen={showRejectedModal}
        onClose={() => {
          setShowRejectedModal(false);
          setCurrentListIndex(0);
          setCurrentImageIndex(0);
          setRejectedSkuDetails(null);
        }}
        title="Rejected SKU Details"
      >
        <div className="w-[800px] max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {/* Main Content */}
            <div className="flex gap-4">
              {/* Image Section */}
              <div className="relative rounded-lg overflow-hidden bg-gray-100 h-[200px] w-[250px]">
                {currentImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={currentImage.mediaUrl}
                      alt={`SKU ${currentListIndex + 1}-${currentImageIndex + 1}`}
                      className="object-contain w-full h-full"
                    />
                    {(totalLists > 1 || totalImagesInCurrentList > 1) && (
                      <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-2 py-1.5 bg-black/50">
                        <button
                          onClick={handlePrevious}
                          disabled={currentListIndex === 0 && currentImageIndex === 0}
                          className="p-1 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-xs text-white">
                          {currentImageIndex + 1}/{totalImagesInCurrentList}
                        </span>
                        <button
                          onClick={handleNext}
                          disabled={currentListIndex === totalLists - 1 && currentImageIndex === totalImagesInCurrentList - 1}
                          className="p-1 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400 text-sm">No images available</span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Order ID</h3>
                  <p className="text-sm text-gray-900">{rejectedSkuDetails.orderId}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">SKU Code</h3>
                  <p className="text-sm text-gray-900">{rejectedSkuDetails.skuCode}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Restaurant</h3>
                  <p className="text-sm text-gray-900">{rejectedSkuDetails.restaurantName}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Menu</h3>
                  <p className="text-sm text-gray-900">{rejectedSkuDetails.menu}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-xs font-medium text-gray-500">Location</h3>
                  <p className="text-sm text-gray-900 truncate">
                    {rejectedSkuDetails.location[0]?.line1}, {rejectedSkuDetails.location[0]?.areaName}
                  </p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-xs font-medium text-gray-500">Rejection Reason</h3>
                  <p className="text-sm text-gray-900">{rejectedSkuDetails.reason}</p>
                </div>
              </div>
            </div>
            {(roleName == 'Admin' || roleName == 'Supervisor') && (
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  onClick={() => handleSkuAction('reject')}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => handleSkuAction('accept')}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                >
                  Accept SKU
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

    );
  };

  const OrderDetails = ({ detail }: { detail: any }) => {
    const [showInventory, setShowInventory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const paginatedInventory = detail.skuInventory.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white shadow rounded-lg mt-2 overflow-hidden">
        <div className="px-4 py-3 low-bg-color border-b flex items-center justify-between">
          <div className="grid grid-cols-4 gap-4 flex-1">
            <div>
              <span className="text-xs font-medium text-gray-500">SKU Name</span>
              <p className="text-sm font-medium text-gray-900 text-color">{detail.foodSkuName}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Order Quantity</span>
              <p className="text-sm font-medium text-gray-900">{detail.orderQuantity}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Accepted</span>
              <p className="text-sm font-medium text-gray-900">{detail.acceptedQuantity}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">SKU Code</span>
              <p className="text-sm font-medium text-gray-900">{detail.partnerFoodCode}</p>
            </div>
          </div>
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="text-gray-500 hover:text-gray-700 ml-4"
          >
            {showInventory ?
              <ChevronDown className="h-5 w-5 text-color" /> :
              <ChevronRight className="h-5 w-5 text-color" />
            }
          </button>
        </div>
        {showInventory && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unique Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sku Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedInventory.map(inv => (
                    <tr key={inv.skuInventorySno} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-500">{inv.uniqueCode}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(inv.wfStageCd)}`}>
                          {getStatusIcon(inv.wfStageCd)}
                          {getStatusText(inv.wfStageCd)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => {
                            setSelectedSkuInventorySno(inv.skuInventorySno);
                            setShowTrackingModal(true);
                          }}
                          className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <PackageSearch className="h-4 w-4" />
                          <span>Track SKU</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalItems={detail.skuInventory.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {showTrackingModal && (
          <SkuTrackingModal
            isOpen={showTrackingModal}
            onClose={() => {
              setShowTrackingModal(false);
              setSelectedSkuInventorySno(null);
            }}
            skuInventorySno={selectedSkuInventorySno}
          />
        )}
      </div>
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.orderNo) count++;
    if (selectedLocation) count++;
    if (selectedRestaurant) count++;
    if (selectedDate !== getCurrentDate()) count++;
    if (selectedStatus) count++;
    if (selectedState) count++;
    if (selectedCity) count++;
    if (selectedArea) count++;
    if (selectedAggrgator) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();


  return (
    <div className="p-10">
      <StatGrid items={statItems} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
        {/* Compact Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Quick filters */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Order Number Search */}
              <div className="relative w-64">
                <input
                  type="text"
                  value={filters.orderNo}
                  onChange={(e) => setFilters(prev => ({ ...prev, orderNo: e.target.value }))}
                  placeholder="Search order number..."
                  className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`px-3 py-2 text-sm border rounded-lg flex items-center gap-2 min-w-32 justify-between transition-all
                  ${selectedStatus ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {selectedStatus ? (
                    <>
                      {(() => {
                        const status = ORDER_STATUSES.find(s => s.label === selectedStatus);
                        if (status?.icon) {
                          const Icon = status.icon;
                          return <Icon className="w-4 h-4" />;
                        }
                        return null;
                      })()}
                      <span className="truncate">{selectedStatus}</span>
                    </>
                  ) : (
                    <>
                      <Filter className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Status</span>
                    </>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showStatusDropdown && (
                  <div className="absolute z-50 w-48 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setSelectedStatus('');
                          setShowStatusDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        All Status
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      {ORDER_STATUSES.map((status) => (
                        <button
                          key={status.code}
                          onClick={() => {
                            setSelectedStatus(status.label);
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-md flex items-center gap-2 transition-colors
                          ${selectedStatus === status.label ? `${status.bgColor} ${status.color}` : 'hover:bg-gray-50'}`}
                        >
                          <status.icon className="w-4 h-4" />
                          {status.label}
                          {selectedStatus === status.label && <Check className="w-4 h-4 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filter Pills */}
              <div className="flex items-center gap-2">
                {selectedLocation && (
                  <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-20">{selectedLocationName}</span>
                    <button onClick={() => setSelectedLocation('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedRestaurant && (
                  <div className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-md">
                    <Store className="w-3 h-3" />
                    <span className="truncate max-w-20">{selectedRestaurantName}</span>
                    <button onClick={() => setSelectedRestaurant('')} className="hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedAggrgator && (
                  <div className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-md">
                    <Store className="w-3 h-3" />
                    <span className="truncate max-w-20">{selectedAggregatorName}</span>
                    <button onClick={() => setSelectedAggrgator('')} className="hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedDate !== getCurrentDate() && (
                  <div className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-md">
                    <Calendar className="w-3 h-3" />
                    <span>{selectedDate}</span>
                    <button onClick={() => setSelectedDate(getCurrentDate())} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Clear all filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${showFilters ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filter Section */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Delivery Location
                </label>
                <button
                  type="button"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="w-full px-3 py-2 pl-9 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                >
                  <span className={selectedLocation ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedLocationName || 'Delivery location'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-8" />

                {showLocationDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    <div className="p-1">
                      {qboxEntityList.map((entity) => (
                        <button
                          key={entity.qboxEntitySno}
                          onClick={() => {
                            setSelectedLocation(entity.qboxEntitySno);
                            setSelectedLocationName(entity.qboxEntityName);
                            setShowLocationDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-50 
                          ${selectedLocation === entity.qboxEntityName ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        >
                          {entity.qboxEntityName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Restaurant Filter */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Restaurant
                </label>
                <button
                  type="button"
                  onClick={() => setShowRestaurantDropdown(!showRestaurantDropdown)}
                  className="w-full px-3 py-2 pl-9 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                >
                  <span className={selectedRestaurant ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedRestaurantName || 'Select restaurant'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <Store className="w-4 h-4 text-gray-400 absolute left-3 top-8" />

                {showRestaurantDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    <div className="p-1">
                      {restaurantList.map((restaurant) => (
                        <button
                          key={restaurant.restaurantSno}
                          onClick={() => {
                            setSelectedRestaurant(restaurant.restaurantSno);
                            setSelectedRestaurantName(restaurant.restaurantName)
                            setShowRestaurantDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-50
                          ${selectedRestaurant === restaurant.restaurantName ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        >
                          {restaurant.restaurantName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Aggregator Filter */}
              {/* <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Delivery Aggregator
                </label>
                <button
                  type="button"
                  onClick={() => setShowAggregatorDropdown(!showAggregatorDropdown)}
                  className="w-full px-3 py-2 pl-9 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                >
                  <span className={selectedAggrgator ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedAggregatorName || 'Select delivery aggregator'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <Store className="w-4 h-4 text-gray-400 absolute left-3 top-8" />

                {showAggregatorDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    <div className="p-1">
                      {deliveryPartnerList.map((dp) => (
                        <button
                          key={dp.deliveryPartnerSno}
                          onClick={() => {
                            setSelectedAggrgator(dp.deliveryPartnerSno);
                            setSelectedAggregatorName(dp.partnerName)
                            setShowAggregatorDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-50
                          ${selectedRestaurant === dp.partnerName ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        >
                          {dp.partnerName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Delivery Aggregator
                </label>
                <button
                  type="button"
                  onClick={() => roleName !== 'Aggregator Admin' && setShowAggregatorDropdown(!showAggregatorDropdown)}
                  className={`w-full px-3 py-2 pl-9 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${roleName === 'Aggregator Admin' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                  disabled={roleName === 'Aggregator Admin'}
                >
                  <span className={roleName === 'Aggregator Admin' ? deliveryPartnerName : selectedAggregatorName ? 'text-gray-900' : 'text-gray-400'}>
                    {roleName === 'Aggregator Admin' ? deliveryPartnerName : selectedAggregatorName || 'Select delivery aggregator'}
                  </span>
                  {roleName !== 'Aggregator Admin' && (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <Store className="w-4 h-4 text-gray-400 absolute left-3 top-8" />

                {showAggregatorDropdown && roleName !== 'Aggregator Admin' && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    <div className="p-1">
                      {deliveryPartnerList.map((dp) => (
                        <button
                          key={dp.deliveryPartnerSno}
                          onClick={() => {
                            setSelectedAggrgator(dp.deliveryPartnerSno);
                            // setDeliveryPartnerName(dp.partnerName); // Use consistent naming
                            setSelectedAggregatorName(dp.partnerName); // Use consistent naming
                            setShowAggregatorDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-50 ${selectedAggrgator === dp.deliveryPartnerSno ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                        >
                          {dp.partnerName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Date Filter */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Order Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-sm 
                  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  max={getCurrentDate()}
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-8" />
              </div>
            </div>
            {(roleName === 'Super Admin' || roleName === 'Aggregator Admin') && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {/* State Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">State</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowStateDropdown(!showStateDropdown);
                      if (!showStateDropdown && !stateList.length) {
                        dispatch(getAllState({}));
                      }
                    }}
                    className="w-full px-3 py-2 pl-9 text-left border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white"
                  >
                    <span className={selectedState ? 'text-gray-900' : 'text-gray-400'}>
                      {selectedStateName || 'Select state'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-8" />
                  {showStateDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                      <div className="p-1">
                        {stateList.length > 0 ? (
                          stateList.map((state) => (
                            <button
                              key={state.stateSno}
                              onClick={() => {
                                setSelectedState(state.stateSno.toString());
                                setSelectedStateName(state.name);
                                setSelectedCity('');
                                setSelectedCityName('');
                                setSelectedArea('');
                                setSelectedAreaName('');
                                setShowStateDropdown(false);
                                if (state.stateSno) {
                                  dispatch(getAllCity({ stateSno: state.stateSno }));
                                }
                              }}
                              className={`w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-50 ${selectedState === state.stateSno.toString() ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                            >
                              {state.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">No states available</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* City Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">City</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedState) {
                        setShowCityDropdown(!showCityDropdown);
                        if (!showCityDropdown && !cityList.length) {
                          dispatch(getAllCity({ stateSno: selectedState }));
                        }
                      }
                    }}
                    disabled={!selectedState}
                    className={`w-full px-3 py-2 pl-9 text-left border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white ${!selectedState ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className={selectedCity ? 'text-gray-900' : 'text-gray-400'}>
                      {selectedCityName || 'Select city'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-8" />
                  {showCityDropdown && selectedState && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                      <div className="p-1">
                        {cityList.length > 0 ? (
                          cityList.map((city) => (
                            <button
                              key={city.citySno}
                              onClick={() => {
                                setSelectedCity(city.citySno.toString());
                                setSelectedCityName(city.name);
                                setSelectedArea('');
                                setSelectedAreaName('');
                                setShowCityDropdown(false);
                                if (city.citySno) {
                                  dispatch(getAllArea({ citySno: city.citySno }));
                                }
                              }}
                              className={`w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-50 ${selectedCity === city.citySno.toString() ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                            >
                              {city.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">No cities available</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Area Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Area</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCity) {
                        setShowAreaDropdown(!showAreaDropdown);
                        if (!showAreaDropdown && !areaList.length) {
                          dispatch(getAllArea({ citySno: selectedCity }));
                        }
                      }
                    }}
                    disabled={!selectedCity}
                    className={`w-full px-3 py-2 pl-9 text-left border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between bg-white ${!selectedCity ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className={selectedArea ? 'text-gray-900' : 'text-gray-400'}>
                      {selectedAreaName || 'Select area'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-8" />
                  {showAreaDropdown && selectedCity && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                      <div className="p-1">
                        {areaList.length > 0 ? (
                          areaList.map((area) => (
                            <button
                              key={area.areaSno}
                              onClick={() => {
                                setSelectedArea(area.areaSno.toString());
                                setSelectedAreaName(area.name);
                                setShowAreaDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-50 ${selectedArea === area.areaSno.toString() ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                            >
                              {area.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">No areas available</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Apply Filters Button */}
                <div className="flex items-end justify-end">
                  <button
                    onClick={handleApplyFilters}
                    className="px-6 py-2 text-sm font-medium text-white bg-color rounded-lg hover:low-bg-color transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Add the new table section */}
      <div className="pt-12">
        <h1 className="font-bold text-lg mb-6 text-color">Purchase Order Details</h1>
        <div className="space-y-4">
          {getFilteredOrders(getPurchaseOrderInfoList)?.length > 0 ? (
            getFilteredOrders(getPurchaseOrderInfoList)
              ?.slice((pagination.mainTable - 1) * MAIN_TABLE_ITEMS_PER_PAGE, pagination.mainTable * MAIN_TABLE_ITEMS_PER_PAGE)
              .map((order, index) => (
                <div key={order.purchaseOrderSno} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="grid grid-cols-5 gap-8 flex-1">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Order No</span>
                        <p className="text-sm font-medium text-gray-900 text-color">{order.partnerPurchaseOrderId}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Order Date</span>
                        <p className="text-sm font-medium text-gray-900">{formatDate(order.transactionDate)}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Restaurant</span>
                        <p className="text-sm font-medium text-gray-900">{order.restaurantName}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Quantity</span>
                        <p className="text-sm font-medium text-gray-900">{getOrderQuantity(order)}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Delivery Location</span>
                        <p className="text-sm font-medium text-gray-900">{order.qboxEntityName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleRow(order.purchaseOrderSno.toString())}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedRows[order.purchaseOrderSno] ?
                          <Eye className="h-5 w-5 text-color" /> :
                          <EyeClosedIcon className="h-5 w-5 text-color" />
                        }
                      </button>
                      <button
                        onClick={() => handleLocationClick(order.qboxEntitySno, order.qboxEntityName, order.areaName, order.transactionDate)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="h-5 w-5 text-color" />
                      </button>
                    </div>
                  </div>
                  {expandedRows[order.purchaseOrderSno] && order.details && Array.isArray(order.details) && (
                    <div className="border-t border-gray-200 px-6 py-4 space-y-4">
                      {order.details.map(detail => (
                        <OrderDetails key={detail?.purchaseOrderDtlSno} detail={detail} />
                      ))}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <EmptyState />
          )}
        </div>

        {getPurchaseOrderInfoList && getPurchaseOrderInfoList.length >= 10 && (
          <div className="mt-4">
            <TablePagination
              currentPage={pagination.mainTable}
              totalItems={getFilteredOrders(getPurchaseOrderInfoList)?.length || 0}
              itemsPerPage={MAIN_TABLE_ITEMS_PER_PAGE}
              onPageChange={handleMainTablePageChange}
            />
          </div>
        )}
      </div>
      <RejectedSkuModal />
    </div>
  );
}