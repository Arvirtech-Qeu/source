import React, { useEffect, useState } from 'react';
import { MasterCard, CardContent, CardHeader, CardTitle } from "@components/MasterCard";
import { Download, FileText, MapPin, AlertTriangle, CheckCircle, RefreshCw, Calendar, Leaf, AlertCircle, User, Building, ChevronDown, Truck, ChevronUp, Box, Package, Clock, RotateCcw, UserCog } from 'lucide-react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { useDispatch } from 'react-redux';
import { getAllCity } from '@state/citySlice';
import { getAllState } from '@state/stateSlice';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format, getDaysInYear } from 'date-fns';
import { getAllArea } from '@state/areaSlice';
import { getFromLocalStorage } from '@utils/storage';
import { amber } from '@mui/material/colors';
import ConsilidatedDashboard from './consolidated-data-dashboard';
import shadows from '@mui/material/styles/shadows';
import DateTime from '@components/DateTime';
import { Table } from '@components/Table';
import { Pagination } from '@components/pagination';
import { getDashboardQboxEntity, getDashboardQboxEntityByauthUser } from '@state/superAdminDashboardSlice';
import PurchaseOrderModal from './purchaseorder-modal';
import DashboardPanel from './dashboard-panel';
import { useFilterContext } from '@context/FilterProvider';



interface SuperAdminDashboardProps {
    isHovered: any;
}


interface GradientBoxProps {
    from?: string;
    via?: string;
    to?: string;
    className?: string;
    children?: React.ReactNode;
}


const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ isHovered }) => {

    const { cityList } = useSelector((state: RootState) => state.city);
    const { stateList } = useSelector((state: RootState) => state.state);
    const { areaList } = useSelector((state: RootState) => state.area);
    // const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
    const { dashboardQboxEntityList, dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleId, setRoleId] = useState<number | null>(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno] = useState<number | null>(null);
    const [deliveryPartnerName, setDeliveryPartnerName] = useState<number | null>(null);
    const [deliveryPartnerLogo, setDeliveryPartnerLogo] = useState<string | null>(null);
    const [roleName, setRoleName]: any = useState(null);
    const [authUserSno, setAuthUserSno] = useState<number | null>(null);
    const navigate = useNavigate()
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});
    const [filters, setFilters] = useState({
        citySno: '',
        stateSno: '',
        areaSno: '',
        deliveryPartnerSno: deliveryPartnerSno
    });
    const dispatch = useDispatch<AppDispatch>();
    const [expandedCard, setExpandedCard]: any = useState(null);
    const [selectedPartner, setSelectedPartner]: any = useState(null);
    const [selectedPartnerDate, setSelectedPartnerDate]: any = useState(null);
    const [selectedLocation, setSelectedLocation]: any = useState(null);
    const [activeTab, setActiveTab] = useState('allInwardOrders');
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Or any number you want per page
    const [filteredStates, setFilteredStates] = useState([]);
    const [filteredCities, setFilteredCities]: any = useState([]);
    const [filteredAreas, setFilteredAreas]: any = useState([]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = dashboardQboxEntityList.slice(indexOfFirstItem, indexOfLastItem);
    const sourceList = dashboardQboxEntityList.length > 0 ? dashboardQboxEntityList : dashboardQboxEntityByauthUserList;
    const currentItems = sourceList.slice(indexOfFirstItem, indexOfLastItem);
    const { setFilters: setGlobalFilters } = useFilterContext();

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

                setRoleId(roleId);
                setRoleName(loginDetails?.roleName);
                setDeliveryPartnerSno(loginDetails?.deliveryPartnerSno);
                setDeliveryPartnerName(loginDetails?.deliveryPartnerName);
                setDeliveryPartnerLogo(loginDetails?.logoUrl);
                setAuthUserSno(loginDetails?.signinConfigSno?.data?.authUserId);

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
        if (deliveryPartnerSno !== null) {
            setFilters((prev) => ({
                ...prev,
                deliveryPartnerSno: deliveryPartnerSno
            }));
        }
    }, [deliveryPartnerSno]);

    useEffect(() => {
        const fetchData = () => {
            dispatch(getAllCity({}));
            dispatch(getAllState({}));
            dispatch(getAllArea({}));

            if (isFilterApplied) {
                const processedFilters = {
                    citySno: filters.citySno || null,
                    stateSno: filters.stateSno || null,
                    areaSno: filters.areaSno || null,
                    deliveryPartnerSno: filters.deliveryPartnerSno || null
                };

                Object.keys(processedFilters).forEach(key => {
                    if (!processedFilters[key]) {
                        delete processedFilters[key];
                    }
                });

                // dispatch(getAllQboxEntities(processedFilters));
                dispatch(getDashboardQboxEntity(processedFilters));
            }
        };
        fetchData();
    }, []);

    const getStatusStyles = (status) => {
        const styles = {
            Green: {
                background: 'bg-gradient-to-br from-emerald-50 to-green-200',
                icon: 'text-emerald-600',
                text: 'text-emerald-700',
                badge: 'bg-emerald-100 text-emerald-700',
                highlight: 'bg-emerald-500',
                header: 'bg-green-500',
                shadow: 'shadow-xl',
                CardTitle: 'text-white',
                border: 'border border-emerald-300'
            },
            Amber: {
                background: 'bg-gradient-to-br from-orange-200 to-yellow-100',
                icon: 'text-orange-600',
                text: 'text-orange-700',
                badge: 'bg-orange-100 text-orange-700',
                highlight: 'bg-orange-500',
                header: 'bg-orange-400',
                shadow: 'shadow-xl',
                CardTitle: 'text-white',
                border: 'border border-orange-300'
            },
            Red: {
                background: 'bg-gradient-to-br from-red-100 to-red-200',
                icon: 'text-color',
                text: 'text-red-700',
                badge: 'low-bg-color text-red-700',
                highlight: 'bg-color',
                header: 'bg-red-400',
                shadow: 'shadow-xl',
                CardTitle: 'text-white',
                border: 'border border-red-300'
            },
            Grey: {
                background: 'bg-gradient-to-br from-gray-100 to-gray-300',
                icon: 'text-gray-600',
                text: 'text-gray-700',
                badge: 'bg-gray-200 text-gray-800',
                highlight: 'bg-gray-500 text-gray-50',
                header: 'bg-gray-400',
                shadow: 'shadow-xl',
                CardTitle: 'text-white',
                border: 'border border-gray-300'
            },
            White: {
                background: 'bg-gradient-to-tr from-white to-dark-100',
                icon: 'text-gray-900',
                text: 'text-white',
                badge: 'bg-gray-200 text-gray-900 font-semibold',
                highlight: ' text-white font-bold',
                header: 'bg-dark',
                shadow: 'shadow-xl',
                CardTitle: 'text-white',
                border: 'border border-gray-300'
            }
        };
        return styles[status] || styles.White;
    };

    const handleFilterChange = async (event) => {

        const { name, value } = event.target;
        const fieldName = name
        console.log(fieldName)

        if (fieldName === "stateSno") {
            console.log(value)
            // Fetch states based on selected country
            const response = await dispatch(getAllCity({ stateSno: value }));
            // Assuming the response contains a `payload` with the state list
            const cities = response.payload || [];
            // Update the state with the new list of states
            setFilteredCities(cities);
            setFilteredAreas([]); // Reset areas
            console.log('UPDATED DATEA', cities)
        }
        if (fieldName === "citySno") {
            // Fetch states based on selected country
            const response = await dispatch(getAllArea({ citySno: value }));
            // Assuming the response contains a `payload` with the state list
            const areas = response.payload || [];
            // Update the state with the new list of states
            setFilteredAreas(areas);
        }

        // Update filters state
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'qboxEntitySno' && {
                citySno: '',
                stateSno: '',
                deliveryPartnerSno: prev.deliveryPartnerSno
            }),
        }));

        const processedFilters: any = {
            ...filters,
            [name]: value === 'all' ? null : value,
        };

        if (name === 'qboxEntitySno') {
            processedFilters.citySno = null;
            processedFilters.stateSno = null;
        }

        Object.keys(processedFilters).forEach((key) => {
            if (processedFilters[key] === 'all' || processedFilters[key] === '') {
                processedFilters[key] = null;
            }
        });
        dispatch(getDashboardQboxEntity(processedFilters));
        setIsFilterApplied(true);

        // Store the filter state in localStorage
        localStorage.setItem('dashboardFilters', JSON.stringify(processedFilters));

    };


    const handleLocationClick = (qboxEntitySno: any, qboxEntityName: any, areaName: any) => {
        const isSuperOrAdmin = roleName === 'Super Admin' || roleName === 'Admin';

        const baseUrl = isSuperOrAdmin
            ? `/qbox-location-dashboard`
            : roleName === 'Loader'
                ? `/super-admin-dashboard/loader-dashboard`
                : roleName === 'Supervisor'
                    ? `/super-admin-dashboard/supervisor-dashboard`
                    : `/aggregator-admin-dashboard`;

        navigate(`${baseUrl}?qboxEntitySno=${qboxEntitySno}
            &transactionDate=${currentDate}&qboxEntityName=${qboxEntityName}
            &roleId=${roleId}&areaName=${areaName}&&deliveryPartnerSno=${deliveryPartnerSno}`);
        setGlobalFilters({
            qboxEntitySno: qboxEntitySno || '',
            qboxEntityName: qboxEntityName,
            transactionDate: currentDate,
            roleId: roleId !== null ? roleId : 0,
            deliveryPartnerSno: deliveryPartnerSno !== null ? deliveryPartnerSno : 0, // Ensure roleId is a number and handle null
            areaName: areaName || '',
        });
    };



    // First effect - Check local storage only
    useEffect(() => {
        const storedFilters = localStorage.getItem('dashboardFilters');

        if (storedFilters) {
            try {
                const parsedFilters = JSON.parse(storedFilters);
                setFilters(parsedFilters);
                dispatch(getDashboardQboxEntity(parsedFilters));
                setIsFilterApplied(true);

                if (parsedFilters.stateSno) {
                    dispatch(getAllCity({ stateSno: parsedFilters.stateSno }));
                }
                if (parsedFilters.citySno) {
                    dispatch(getAllArea({ citySno: parsedFilters.citySno }));
                }
            } catch (error) {
                console.error('Error parsing stored filters:', error);
            }
        } else {
        }
    }, []);

    // Second effect - Wait until authUserSno is available
    useEffect(() => {
        if ((roleName === 'Loader' || roleName === 'Supervisor' || roleName === 'Admin') && authUserSno) {
            dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserSno }));
        }
    }, [authUserSno, roleName]);

    const handleButtonClick = (partner, location) => {
        setSelectedPartner(partner);
        setSelectedLocation(location);
    };

    const closePopup = () => {
        setSelectedPartner(null);
        setSelectedLocation(location);

    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="bg-white mb-10">
                <div className="custom-gradient-left h-32" />
                <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14 ' : 'pl-16 pr-14 '}`}>
                    <div className="max-w-8xl mx-auto">
                        <div className="flex justify-between bg-white rounded-2xl shadow-lg p-6 mb-8">
                            <div className="flex items-center gap-4  rounded-xl">
                                <div className="p-4 custom-gradient-right rounded-full">
                                    <Leaf className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900">{deliveryPartnerName} Dashboard</h1>
                                    <p className="text-gray-500 mt-2">Monitor and manage your delivery hubs.</p>
                                </div>
                            </div>

                            {roleName !== 'Loader' && roleName !== 'Supervisor' && roleName !== 'Admin' && roleName !== 'System Admin' && (
                                <div className="justify-end space-x-4 select-primary">
                                    <select
                                        name="stateSno"
                                        value={filters.stateSno}
                                        onChange={handleFilterChange}
                                        className="w-64 px-4 py-2.5 bg-white/70 rounded-lg border border-gray-200 focus:ring-0"
                                    >
                                        <option value="">Select State</option>
                                        {stateList?.map((state) => (
                                            <option key={state.stateSno} value={state.stateSno}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        name="citySno"
                                        value={filters.citySno}
                                        onChange={handleFilterChange}
                                        className="w-64 px-4 py-2.5 bg-white/70 rounded-lg border border-gray-200 focus:ring-0"
                                    >
                                        <option value="">Select City</option>
                                        {filteredCities?.map((city) => (
                                            <option key={city.citySno} value={city.citySno}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        name="areaSno"
                                        value={filters.areaSno}
                                        onChange={handleFilterChange}
                                        className="w-64 px-4 py-2.5 bg-white/70 rounded-lg border border-gray-200 focus:ring-0"
                                    >
                                        <option value="">Select Area</option>
                                        {filteredAreas?.map((area) => (
                                            <option key={area.areaSno} value={area.areaSno}>
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Reset Button */}
                                    <button
                                        onClick={() => {
                                            setFilters({
                                                citySno: '',
                                                stateSno: '',
                                                areaSno: '',
                                                deliveryPartnerSno,
                                            });
                                            setIsFilterApplied(false);
                                            localStorage.removeItem('dashboardFilters');
                                            if (roleName === 'Loader' || roleName === 'Supervisor' || roleName === 'Admin') {
                                                dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserSno }));
                                            } else {
                                                dispatch(getDashboardQboxEntity({}));
                                            }
                                        }}
                                        className="px-4 py-3 text-sm font-medium text-white bg-color rounded-lg hover:bg-color 
        focus:outline-none focus:ring-2 focus:ring-red-300 inline-flex items-center mt-4 gap-2"
                                    >
                                        <RotateCcw size={15} />
                                        <span>Reset</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className='h-20'>
                            {roleName === 'Loader' || roleName === 'Supervisor' || roleName === 'Admin' || isFilterApplied ? (
                                currentItems?.length > 0 ? (
                                    <>
                                        {/* Cards Section */}
                                        <div className="grid grid-cols-3 gap-6">
                                            {currentItems.map((location, index) => {
                                                const styles = getStatusStyles(location.statusColour);

                                                const toggleOrders = (partnerName, orderDate) => {
                                                    setSelectedPartner(selectedPartner === partnerName ? null : partnerName);
                                                    setSelectedPartnerDate(selectedPartnerDate === orderDate ? null : orderDate);
                                                };

                                                return (
                                                    <motion.div
                                                        key={location.qboxEntitySno}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        whileHover={{ y: -4 }}
                                                    >
                                                        <MasterCard
                                                            key={location.id}
                                                            className={`${styles.shadow} ${styles.background} ${styles.border} transition-all duration-300 w-full h-full`}
                                                        >
                                                            <CardHeader className={`${styles.header} rounded-t-md`}>
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`p-2 bg-white/80 rounded-lg ${styles.icon}`}>
                                                                            <MapPin className="w-4 h-4" />
                                                                        </div>
                                                                        <div>
                                                                            <CardTitle className={`${styles.cardtitle} text-lg text-black font-semibold`}>
                                                                                {location.qboxEntityName}
                                                                            </CardTitle>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardHeader>

                                                            <CardContent>
                                                                <div
                                                                    className="space-y-4"
                                                                    onClick={() =>
                                                                        handleLocationClick(location.qboxEntitySno, location.qboxEntityName, location.areaName)
                                                                    }
                                                                >
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        {/* Location */}
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                <Building className="w-4 h-4" />
                                                                                <span>Location</span>
                                                                            </div>
                                                                            <p className="font-medium">
                                                                                {location.cityName}, {location.state1name}, {location.country1name}
                                                                            </p>
                                                                        </div>

                                                                        {/* Area */}
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                <MapPin className="w-4 h-4" />
                                                                                <span>Area</span>
                                                                            </div>
                                                                            <p className="font-medium">{location.areaName}</p>
                                                                        </div>

                                                                        {/* Entity Code */}
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                <Building className="w-4 h-4" />
                                                                                <span>Entity Code</span>
                                                                            </div>
                                                                            <p className="font-medium">{location.entityCode}</p>
                                                                        </div>

                                                                        {/* Partner Logos */}
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {location?.deliveryPartnerDetails
                                                                                ?.filter(partner =>
                                                                                    deliveryPartnerSno
                                                                                        ? partner.deliveryPartnerSno === deliveryPartnerSno
                                                                                        : true
                                                                                )
                                                                                .map((partner, idx) => (
                                                                                    <button
                                                                                        key={idx}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleButtonClick(partner, location);
                                                                                        }}
                                                                                        className="text-white text-sm rounded-full flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105"
                                                                                    >
                                                                                        <img
                                                                                            src={partner.logoUrl ?? "/assets/images/logo.png"}
                                                                                            alt="Logo"
                                                                                            className="h-10 w-10 object-cover rounded-full border"
                                                                                            onError={(e) => {
                                                                                                (e.target as HTMLImageElement).src =
                                                                                                    "/assets/images/logo.png";
                                                                                            }}
                                                                                        />
                                                                                    </button>
                                                                                ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </MasterCard>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Modal */}
                                        {selectedPartner && selectedLocation && (
                                            <PurchaseOrderModal
                                                partner={selectedPartner}
                                                onClose={closePopup}
                                                location={selectedLocation}
                                            />
                                        )}

                                        {/* Pagination */}
                                        {dashboardQboxEntityList?.length > itemsPerPage && (
                                            <div className="flex justify-end mr-2">
                                                <Pagination
                                                    totalItems={dashboardQboxEntityList?.length}
                                                    itemsPerPage={itemsPerPage}
                                                    currentPage={currentPage}
                                                    onPageChange={handlePageChange}
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // No results found block
                                    <div className="flex justify-center items-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <div className="text-center px-6 py-8">
                                            <AlertCircle className="mx-auto mb-6 text-color" size={64} />
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Delivery Location Found</h3>
                                            <p className="text-lg text-gray-600">
                                                There are currently no Delivery Locations to display.
                                            </p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                // Only show DashboardPanel when roleName !== 'Loader' && !isFilterApplied
                                <div>
                                    <DashboardPanel
                                        roleName={roleName || "Default Role"}
                                        deliveryPartnerLogo={deliveryPartnerLogo}
                                        deliveryPartnerName={deliveryPartnerName}
                                        stateList={stateList}
                                        cityList={cityList}
                                        areaList={areaList}
                                    />
                                </div>
                            )}

                        </div>


                    </div>
                </div>
            </div>
        </>
    );
};

export default SuperAdminDashboard;

