import { getNativeSelectUtilityClasses } from '@mui/material';
import { getHotboxCountv3 } from '@state/loaderDashboardSlice';
import { AppDispatch, RootState } from '@state/store';
import { getFromLocalStorage } from '@utils/storage';
import { StatGrid } from '@view/Loader/Common widgets/count_grid';
import DataTable, { HeaderAction, TableColumn } from '@view/Loader/Common widgets/data_table';
import { Coffee, Pizza, Utensils, Sandwich, ChevronDown, Filter, Upload, Soup, Package, AlertTriangle, ShoppingCart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type TableData = {
  skuCode: string;
  description: string;
  hotBoxCount: number;
  stockStatus: string;
};


const InventoryListExample: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { getHotboxCountLists } = useSelector((state: RootState) => state.loaderDashboard);
  const [data, setData] = useState<TableData[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false);
  const [roleName, setRoleName]: any = useState(null);
  const navigate = useNavigate();

  // Add this function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    dispatch(getHotboxCountv3({ "transactionDate": getCurrentDate() }));
  }, [dispatch]);

  useEffect(() => {
    if (getHotboxCountLists && Array.isArray(getHotboxCountLists.hotboxCounts)) {
      const transformed = getHotboxCountLists.hotboxCounts.map((item) => ({
        ...item,
      }));
      setData(transformed);
      setFilteredData(transformed);
    }
  }, [getHotboxCountLists]);

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
          setRoleName(loginDetails.roleName || null);
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

  const handleSearch = (term: string) => {
    if (!term) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item =>
      item.description.toLowerCase().includes(term.toLowerCase()) ||
      item.skuCode.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns: TableColumn[] = [
    { key: 'icon', title: '', render: () => <Soup className="text-orange-500 w-5 h-5" /> },
    { key: 'description', title: 'Name', sortable: true },
    { key: 'areaName', title: 'Location', sortable: true },
    { key: 'qboxEntityName', title: 'Delivery Location', sortable: true },
    { key: 'skuCode', title: 'SKU ID', sortable: true },
    {
      key: 'hotBoxCount',
      title: 'Units',
      sortable: true,
      render: (value) => <span className="text-color">{value}</span>
    },
    { key: 'stockStatus', title: 'Stock', sortable: true }
  ];

  const headerActions: HeaderAction[] = [
  ];

  const statItems = [
    {
      title: "TOTAL SKU IN HOTBOX",
      value: getHotboxCountLists?.totalHotboxCount?.toLocaleString() || "0",
      description: "Total food packs in HotBox",
      icon: Package,
      actionHandler: () => null,
      isDisabled: false,
    },
    {
      title: "TOTAL SKU IN QBOX",
      value: getHotboxCountLists?.totalQboxCount?.toLocaleString() || "0",
      description: "Total food packs in QBox",
      icon: AlertTriangle,
      actionHandler: () => null,
      isDisabled: false,
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
    // Only show Infrastructure for non - Aggregator Admin roles
    ...(roleName !== 'Aggregator Admin' ? [{
      title: "ASSETS",
      value: getHotboxCountLists?.assertCount?.toString() || "0",
      description: "View Delivery Location Asset",
      icon: Users,
      actionText: "View Asset",
      actionHandler: () => navigate("/inventory/entity-infra-details"),
      isDisabled: (getHotboxCountLists?.assertCount || 0) <= 0,
    }] : [])
  ];

  return (
    <>
      <StatGrid items={statItems} />
      <div className="pt-8 flex justify-between pb-4">
        <h1 className="font-bold text-lg text-color">Inventory Items</h1>
      </div>
      <DataTable
        title="Hotboxes #103"
        subtitle="Inventory Items List as per Hotbox"
        headerIcon={<Utensils className="h-6 w-6 text-color" />}
        headerIconBgColor="low-bg-color"
        columns={columns}
        data={filteredData}
        headerActions={headerActions}
        onSearch={handleSearch}
        rowIconKey="icon"
        defaultRowIconBg="low-bg-color"
        defaultRowIconColor="text-color"
      />
    </>
  );
};

export default InventoryListExample;