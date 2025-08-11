import React, { useEffect, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getHotboxCountv3 } from '@state/loaderDashboardSlice';
import NoData from '@assets/images/nodata.png';
import { getFromLocalStorage } from '@utils/storage';
import { getDashboardQboxEntityByauthUser } from '@state/superAdminDashboardSlice';

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
}

export interface TableData {
  [key: string]: any;
}

export interface HeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface DataTableIconProps {
  icon: React.ReactNode;
  iconColor?: string;
}

export interface DataTableProps {
  title: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  headerIconBgColor?: string;
  columns: TableColumn[];
  data: TableData[];
  headerActions?: HeaderAction[];
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  rowIconKey?: string;
  defaultRowIconBg?: string;
  defaultRowIconColor?: string;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

type UserRole = 'Super Admin' | 'Admin' | 'Aggregator Admin' | 'Supervisor';

export const DataTableIcon: React.FC<DataTableIconProps> = ({
  icon,
  iconColor = 'text-red-500'
}) => (
  <div className={`p-2 rounded-full flex items-center justify-center`}>
    {React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement, {
        className: `h-4 w-4 ${iconColor} ${(icon as React.ReactElement).props.className || ''}`
      })
      : icon}
  </div>
);

const DataTable: React.FC<DataTableProps> = ({
  title,
  subtitle,
  headerIcon,
  headerIconBgColor = 'bg-red-100',
  columns,
  data,
  headerActions = [],
  onSearch,
  searchPlaceholder = 'Search by name, ID or category',
  rowIconKey,
  defaultRowIconBg = 'bg-red-100',
  defaultRowIconColor = 'text-red-500',
  onPageSizeChange
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
  const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const [error, setError] = useState<string | null>(null);
  const paginatedData = data.slice(startIndex, endIndex);
  const [authUserSno, setAuthUserSno]: any = useState(null);
  const [roleName, setRoleName]: any = useState(null);
  const [areaSno, setAreaSno]: any = useState(null);
  const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
  console.log(data.length)

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log(value)
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    if (onSearch) {
      onSearch(value);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // useEffect(() => {
  //   dispatch(getAllQboxEntities({}));
  // }, [dispatch]);

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
        setRoleName(loginDetails.roleName || null);
        setAreaSno(loginDetails.areaSno || null);
        setDeliveryPartnerSno(loginDetails.deliveryPartnerSno || null);
        setAuthUserSno(loginDetails.authUserId || null);

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

  // Then update the useEffect
  useEffect(() => {
    const handleQboxEntitiesFetch = () => {
      if (!roleName) {
        console.log('Waiting for role to be loaded...');
        return;
      }

      switch (roleName) {
        case 'Super Admin':
          dispatch(getAllQboxEntities({}));
          dispatch(getHotboxCountv3({ "transactionDate": getCurrentDate() }));
          break;

        case 'Admin':
          if (!areaSno) {
            console.log('Waiting for area data...');
            return;
          }
          dispatch(getAllQboxEntities({ areaSno }));
          dispatch(getHotboxCountv3({ "transactionDate": getCurrentDate(), "areaSno": areaSno }));
          break;

        case 'Aggregator Admin':
          if (!deliveryPartnerSno) {
            console.log('Waiting for area data...');
            return;
          }
          dispatch(getAllQboxEntities({}));
          dispatch(getHotboxCountv3({ "transactionDate": getCurrentDate(), "deliveryPartnerSno": deliveryPartnerSno }));
          break;

        case 'Supervisor':
          if (!authUserSno) {
            console.log('Waiting for area data...');
            return;
          }
          dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserSno }));
          dispatch(getHotboxCountv3({ "transactionDate": getCurrentDate(), "authUserSno": authUserSno }));
          break;

        default:
          console.log('Role not authorized for QBox entities:', roleName);
          break;
      }
    };

    handleQboxEntitiesFetch();
  }, [dispatch, roleName, areaSno]);

  // Add this function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedOption(selectedId);

    try {
      let response;

      if (selectedId === '') {
        // Handle empty selection based on role
        switch (roleName) {
          case 'Super Admin':
            response = await dispatch(getHotboxCountv3({
              transactionDate: getCurrentDate()
            }));
            break;

          case 'Admin':
            response = await dispatch(getHotboxCountv3({
              transactionDate: getCurrentDate(),
              areaSno: areaSno
            }));
            break;

          case 'Aggregator Admin':
            response = await dispatch(getHotboxCountv3({
              transactionDate: getCurrentDate(),
              deliveryPartnerSno: deliveryPartnerSno
            }));
            break;

          case 'Supervisor':
            response = await dispatch(getHotboxCountv3({
              transactionDate: getCurrentDate(),
              authUserSno: authUserSno
            }));
            break;

          default:
            console.warn('Unknown role:', roleName);
            break;
        }
      } else {
        // When a specific entity is selected
        response = await dispatch(getHotboxCountv3({
          qboxEntitySno: selectedId,
          transactionDate: getCurrentDate()
        }));
      }

      console.log('Hotbox count response:', response);
    } catch (error) {
      console.error('Error fetching hotbox count:', error);
    }
  };

  const renderCell = (column: TableColumn, record: TableData) => {
    const value = record[column.key];
    if (column.render) return column.render(value, record);

    if (rowIconKey && column.key === rowIconKey) {
      const iconInfo = value || {};
      return (
        <DataTableIcon
          icon={iconInfo.icon || record.defaultIcon}
          iconColor={iconInfo.iconColor || record.iconColor || defaultRowIconColor}
        />
      );
    }

    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          {headerIcon && (
            <div className={`${headerIconBgColor} p-3 rounded-full mr-4`}>
              {headerIcon}
            </div>
          )}
          <div>
            <select
              onChange={handleChange}
              value={selectedOption}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md w-60"
            >
              <option value="">Select Delivery Location</option>
              {Array.isArray(roleName === 'Supervisor' ? dashboardQboxEntityByauthUserList : qboxEntityList) &&
                (roleName === 'Supervisor' ? dashboardQboxEntityByauthUserList : qboxEntityList).map((option, idx) => (
                  <option key={idx} value={option.qboxEntitySno}>
                    {option.qboxEntityName}
                  </option>
                ))}
            </select>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:border-none focus:ring-1 focus:ring-red-500"
              placeholder="Search by name, ID or category"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {headerActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center px-4 py-2 border rounded-full text-sm"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      </div>
      {/* Table */}
      {paginatedData.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b low-bg-color">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="py-3 text-left text-sm font-medium text-color"
                    >
                      <div className="flex items-center">
                        {column.title}
                        {column.sortable && <ChevronDown className="ml-1 h-4 w-4 text-color" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>

                {paginatedData.map((record, index) => (
                  <tr key={index} className="border-b">
                    {columns.map((column) => (
                      <td key={column.key} className="py-4 text-sm">
                        {renderCell(column, record)}
                      </td>
                    ))}
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="text-sm border rounded px-2 py-1 w-[55px] "
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
                ({startIndex + 1}-{endIndex} of {data.length})
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) :
        <div className='flex flex-col text-lg text-center items-center justify-center'>
          <img src={NoData} alt="" className='w-64' />
          <h1 className='text-gray-300'>No data found</h1>
          {/* No data available */}
        </div>}
    </div>
  );
};

export default DataTable;
