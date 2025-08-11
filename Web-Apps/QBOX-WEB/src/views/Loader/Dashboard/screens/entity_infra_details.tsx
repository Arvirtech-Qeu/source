import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { Column, Table } from '@components/Table';
import { getFromLocalStorage } from '@utils/storage';
import { getEntityInfraDetails, getEntityLoader } from '@state/loaderDashboardSlice';
import { Badge, Battery, BatteryChargingIcon, Box, BoxIcon, Camera, CameraIcon, CircuitBoardIcon, ClockIcon, HardHat, IdCardIcon, MailIcon, MapPinIcon, PhoneIcon, Settings, Thermometer, Lock, ExternalLink, EyeIcon, ExternalLinkIcon, ClipboardCopy, ScanIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { Modal } from '@components/Modal';
import { Avatar } from '@mui/material';


interface OrderProps {
    isHovered: any;
}

interface InfraProperty {
    value: string;
    description: string | null;
    propertySno: number;
    propertyName: string;
}

interface InfrastructureItem {
    infraSno: number;
    infraName: string;
    qboxEntitySno: number;
    qboxEntityName: string;
    infraProperties: InfraProperty[];
}

interface InfraCounts {
    hotBox: number;
    qBox: number;
    tv: number;
    fridge: number;
    camera: number;
    powerBank: number; // Add this
    scanner: number;   // Add this
}

const EntityInfraDtls: React.FC<OrderProps> = ({ isHovered }) => {

    const [selectedInfra, setSelectedInfra] = useState<InfrastructureItem | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleId, setRoleId] = useState<number | null>(null);
    const [areaSno, setAreaSno] = useState<number | null>(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno] = useState<number | null>(null);
    const [deliveryPartnerName, setDeliveryPartnerName] = useState<number | null>(null);
    const [deliveryPartnerLogo, setDeliveryPartnerLogo] = useState<string | null>(null);
    const [roleName, setRoleName]: any = useState(null);
    const [authUserSno, setAuthUserSno] = useState<number | null>(null);
    const { getEntityInfraDtlList } = useSelector((state: RootState) => state.loaderDashboard);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

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
                setAreaSno(loginDetails?.areaSno);

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    // Add this function to get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Group data by location
    const groupedData = useMemo(() => {
        if (!getEntityInfraDtlList) return {};
        return getEntityInfraDtlList.reduce((acc: any, item: InfrastructureItem) => {
            if (!acc[item.qboxEntityName]) {
                acc[item.qboxEntityName] = {
                    items: [],
                    qboxEntitySno: item.qboxEntitySno
                };
            }
            acc[item.qboxEntityName].items.push(item);
            return acc;
        }, {});
    }, [getEntityInfraDtlList]);

    const getInfraCounts = (infraItems: InfrastructureItem[]): InfraCounts => {
        return infraItems.reduce((acc, item) => ({
            hotBox: acc.hotBox + (item.infraName === 'Hot Box' ? 1 : 0),
            qBox: acc.qBox + (item.infraName === 'Q-Box' ? 1 : 0),
            tv: acc.tv + (item.infraName === 'Tv' ? 1 : 0),
            fridge: acc.fridge + (item.infraName === 'Fridge' ? 1 : 0),
            camera: acc.camera + (item.infraName === 'Camera' ? 1 : 0),
            powerBank: acc.powerBank + (item.infraName === 'Power Bank' ? 1 : 0),
            scanner: acc.scanner + (item.infraName === 'Scanner' ? 1 : 0),
        }), { hotBox: 0, qBox: 0, tv: 0, fridge: 0, camera: 0, powerBank: 0, scanner: 0 });
    };

    useEffect(() => {
        const fetchLoaderData = async () => {
            try {
                const payload = (() => {
                    switch (roleName) {
                        case 'Super Admin':
                            return {};
                        case 'Admin':
                            return { areaSno };
                        case 'Supervisor':
                            return { authUserId: authUserSno };
                        default:
                            return {};
                    }
                })();

                await dispatch(getEntityInfraDetails(payload));
            } catch (error) {
                console.error('Error fetching loader data:', error);
            }
        };

        if (roleName) {
            fetchLoaderData();
        }
    }, [dispatch, roleName, areaSno, authUserSno]);


    const getInfraIcon = (infraName: string) => {
        switch (infraName.toLowerCase()) {
            case 'fridge':
                return <Thermometer className="w-6 h-6" />;
            case 'power back':
                return <Battery className="w-6 h-6" />;
            case 'camera':
                return <Camera className="w-6 h-6" />;
            case 'q-box':
                return <Box className="w-6 h-6" />;
            case 'power bank':
                return <BatteryChargingIcon className="w-6 h-6" />;
            case 'scanner':
                return <ScanIcon className="w-6 h-6" />;
            default:
                return <Settings className="w-6 h-6" />;
        }
    };

    // Helper function to get infrastructure color
    const getInfraColor = (infraName: string) => {
        switch (infraName.toLowerCase()) {
            case 'fridge':
                return 'bg-blue-100 text-blue-600';
            case 'power back':
                return 'bg-yellow-100 text-yellow-600';
            case 'camera':
                return 'bg-purple-100 text-purple-600';
            case 'q-box':
                return 'bg-green-100 text-green-600';
            case 'power bank':
                return 'bg-orange-100 text-orange-600';
            case 'scanner':
                return 'bg-indigo-100 text-indigo-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

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

    const columns: Column<any>[] = [
        {
            key: 'infraName',
            header: 'Infrastructure',
            sortable: false,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getInfraColor(row.infraName)}`}>
                        {getInfraIcon(row.infraName)}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.infraName}</p>
                        <p className="text-sm text-gray-500">{row.qboxEntityName}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'properties',
            header: 'Properties',
            render: (row) => (
                <div className="space-y-1">
                    {row.infraProperties.map((prop: InfraProperty, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">
                                {prop.propertyName}:
                            </span>
                            <span className="text-sm text-gray-900">
                                {prop.propertyName.toLowerCase() === 'password'
                                    ? '••••••••'
                                    : prop.value}
                            </span>
                        </div>
                    ))}
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <button
                    onClick={() => {
                        setSelectedInfra(row);
                        setShowModal(true);
                    }}
                    className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color"
                >
                    View Details
                </button>
            )
        }
    ];

    const CountBadge = ({ count, type }: { count: number; type: string }) => {
        const getColor = () => {
            switch (type) {
                case 'hot-box': return 'bg-red-100 text-red-700';
                case 'q-box': return 'bg-blue-100 text-blue-700';
                case 'tv': return 'bg-purple-100 text-purple-700';
                case 'fridge': return 'bg-green-100 text-green-700';
                case 'camera': return 'bg-yellow-100 text-yellow-700';
                case 'power-bank': return 'bg-orange-100 text-orange-700';
                case 'scanner': return 'bg-indigo-100 text-indigo-700';
                default: return 'bg-gray-100 text-gray-700';
            }
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColor()}`}>
                {count}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="custom-gradient-left h-32" />
            <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14'}`}>
                <div className="max-w-8xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="flex items-center gap-6">
                            <div className="low-bg-color p-4 rounded-2xl">
                                <CircuitBoardIcon className="w-10 h-10 text-color" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900">Asset Details</h1>
                                <p className="text-gray-500 mt-2">Delivery Location Wise Asset details</p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hot Box
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Q-Box
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        TV
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fridge
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Camera
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Power Bank
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Scanner
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {(Object.entries(groupedData) as [string, { items: InfrastructureItem[]; qboxEntitySno: number }][])
                                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                                    .map(([location, { items, qboxEntitySno }]) => {
                                        const counts = getInfraCounts(items);
                                        return (
                                            <tr key={location} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <MapPinIcon className="w-5 h-5 text-color mr-2" />
                                                        <span className="text-lg font-medium text-gray-900">{location}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-lg">
                                                    <CountBadge count={counts.hotBox} type="hot-box" />
                                                </td>
                                                <td className="px-6 py-4 text-center text-lg">
                                                    <CountBadge count={counts.qBox} type="q-box" />
                                                </td>
                                                <td className="px-6 py-4 text-center text-lg">
                                                    <CountBadge count={counts.tv} type="tv" />
                                                </td>
                                                <td className="px-6 py-4 text-center text-lg">
                                                    <CountBadge count={counts.fridge} type="fridge" />
                                                </td>
                                                <td className="px-6 py-4 text-center text-lg">
                                                    <CountBadge count={counts.camera} type="camera" />
                                                </td>
                                                <td className="px-6 py-4 text-center text-lg">
                                                    <CountBadge count={counts.powerBank} type="power-bank" />
                                                </td>
                                                <td className="px-6 py-4 text-center text-lg">
                                                    <CountBadge count={counts.scanner} type="scanner" />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedLocation(location);
                                                            setShowModal(true);
                                                        }}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-color rounded-md hover:low-bg-color transition-colors"
                                                    >
                                                        <EyeIcon className="w-4 h-4 mr-1.5" />
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {Object.keys(groupedData).length > ITEMS_PER_PAGE && (
                    <TablePagination
                        currentPage={currentPage}
                        totalItems={Object.keys(groupedData).length}
                        // itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage} itemsPerPage={0} />
                )}
            </div>

            {/* Details Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedLocation(null);
                }}
                className="max-w-7xl w-full" // wider modal
                title={
                    <div className="flex items-center gap-3">
                        <MapPinIcon className="w-8 h-6 text-color" />
                        <span>{selectedLocation || 'Location Details'}</span>
                    </div>
                }
            >
                <div className="p-6 max-h-[80vh] overflow-y-auto">

                    {/* Summary Stats */}
                    {selectedLocation && (
                        <div className="grid grid-cols-6 gap-4 mb-8">
                            {Object.entries(getInfraCounts(groupedData[selectedLocation]?.items || [])).map(([type, count]) => (
                                <div key={type} className="bg-gray-50 rounded-xl p-4 text-center">
                                    <div className={`inline-flex p-2 rounded-lg ${getInfraColor(type)}`}>
                                        {getInfraIcon(type)}
                                    </div>
                                    <p className="mt-2 text-2xl font-semibold text-gray-900">{count}</p>
                                    <p className="text-sm text-gray-500 capitalize">{type.replace('-', ' ')}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Infrastructure Details - Updated to 3 items per row */}
                    {selectedLocation && (
                        <div className="grid grid-cols-4 gap-6">
                            {groupedData[selectedLocation]?.items.map((item) => (
                                <div
                                    key={`${item.infraSno}-${item.infraName}`}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-color hover:shadow-lg transition-all duration-200"
                                >
                                    {/* Header */}
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${getInfraColor(item.infraName)}`}>
                                                    {getInfraIcon(item.infraName)}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">{item.infraName}</h3>
                                                    <p className="text-xs text-gray-500">ID: {item.infraSno}</p>
                                                </div>
                                            </div>
                                            <Badge className={`${getInfraColor(item.infraName)} px-2 py-0.5 text-xs`}>
                                                Active
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Properties */}
                                    <div className="p-4">
                                        <div className="space-y-3">
                                            {item.infraProperties.map((prop) => (
                                                <div
                                                    key={prop.propertySno}
                                                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {prop.propertyName.toLowerCase() === 'password' ? (
                                                                <Lock className="w-3.5 h-3.5 text-gray-400" />
                                                            ) : prop.propertyName.toLowerCase() === 'url' ? (
                                                                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                                                            ) : (
                                                                <Settings className="w-3.5 h-3.5 text-gray-400" />
                                                            )}
                                                            <span className="text-xs font-medium text-gray-600">
                                                                {prop.propertyName}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {prop.propertyName.toLowerCase() === 'password' ? (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-xs">••••••••</span>
                                                                    <button
                                                                        className="text-color hover:text-color/80"
                                                                        title="Copy password"
                                                                    >
                                                                        <ClipboardCopy className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            ) : prop.propertyName.toLowerCase() === 'url' ? (
                                                                <a
                                                                    href={prop.value}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-color hover:text-color/80 flex items-center gap-1 text-xs"
                                                                >
                                                                    View <ExternalLink className="w-3.5 h-3.5" />
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs">{prop.value}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default EntityInfraDtls;
