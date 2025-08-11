import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { Column, Table } from '@components/Table';
import { getFromLocalStorage } from '@utils/storage';
import { getEntityLoader } from '@state/loaderDashboardSlice';
import { Badge, ClockIcon, HardHat, IdCardIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Modal } from '@components/Modal';
import { Avatar } from '@mui/material';


interface OrderProps {
    isHovered: any;
}

interface LoaderEntity {
    createdOn: string;
    shiftTiming: string;
    qboxEntitySno: number;
    supervisorSno: number;
    qboxEntityName: string;
    supervisorName: string;
    todayPresentCount: number;
    weeklyPresentCount: number;
    monthlyPresentCount: number;
}

interface LoaderDetails {
    email: string;
    contact: string;
    roleName: string;
    authUserId: number;
    media_link: string | null;
    profileName: string;
    aadharNumber: string;
    profileImage: string | null;
    qboxEntities: LoaderEntity[];
}



const Loaders: React.FC<OrderProps> = ({ isHovered }) => {

    const [selectedLoader, setSelectedLoader] = useState<LoaderDetails | null>(null);
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
    const { getEntityLoaderList } = useSelector((state: RootState) => state.loaderDashboard);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                const storedData = getFromLocalStorage('user');

                if (!storedData) {
                    throw new Error('No user data found');
                }

                const { roleId, loginDetails } = storedData;

                if (!roleId) {
                    throw new Error('Role ID is missing');
                }

                // Set all values in one go to ensure they're available
                setRoleId(roleId);
                setRoleName(loginDetails?.roleName || null);
                setAuthUserSno(loginDetails?.signinConfigSno?.data?.authUserId || null);

                // Explicitly set areaSno from loginDetails
                const areaNumber = loginDetails?.areaSno || null;
                setAreaSno(areaNumber);

                // Log for debugging
                console.log('Area Sno set to:', areaNumber);
                console.log('Full login details:', loginDetails);

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

    // useEffect(() => {
    //     // Update to use current date
    //     dispatch(getEntityLoader({}));
    // }, [dispatch]);
    useEffect(() => {
        const fetchLoaderData = async () => {
            try {
                if (!roleName) {
                    console.log('Waiting for role name...');
                    return;
                }

                // For Admin role, ensure areaSno is available
                if (roleName === 'Admin' && areaSno === null) {
                    console.log('Admin role but areaSno is null, waiting...');
                    return;
                }

                const payload = (() => {
                    switch (roleName) {
                        case 'Super Admin':
                            return {};
                        case 'Admin':
                            if (!areaSno) {
                                console.warn('areaSno is null for Admin role');
                                return null;
                            }
                            return { areaSno };
                        case 'Supervisor':
                            if (!authUserSno) {
                                console.warn('authUserSno is null for Supervisor role');
                                return null;
                            }
                            return { supervisorSno: authUserSno };
                        default:
                            return {};
                    }
                })();

                // Only dispatch if we have a valid payload
                if (payload !== null) {
                    await dispatch(getEntityLoader(payload));
                }

            } catch (error) {
                console.error('Error fetching loader data:', error);
            }
        };

        fetchLoaderData();
    }, [dispatch, roleName, areaSno, authUserSno]);


    const columns: Column<any>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: false,
        },
        {
            key: 'profileName',
            header: 'Loader Name',
            sortable: false,
        },
        {
            key: 'contact',
            header: 'Contact',
            sortable: false,
        },
        {
            key: 'aadharNumber',
            header: 'Aadhar Number',
            sortable: false,
        },
        {
            key: 'email',
            header: 'Email',
            sortable: false,
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <button
                    onClick={() => {
                        setSelectedLoader(row);
                        setShowModal(true);
                    }}
                    className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color"
                >
                    View Details
                </button>
            )
        }
    ];

    const LoaderDetailsModal = () => {
        if (!selectedLoader) return null;

        return (
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedLoader(null);
                }}
                title="Loader Details"
            >
                <div className="p-6">
                    {/* Header Section with Profile */}
                    <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                        <div className="relative">
                            <Avatar
                                src={selectedLoader.profileImage ?? selectedLoader.media_link ?? undefined}
                                alt={selectedLoader.profileName}
                                className="w-24 h-24 rounded-full ring-4 ring-color/10"
                                sx={{ width: 96, height: 96 }}
                            >
                                {(!selectedLoader.profileImage && !selectedLoader.media_link) && selectedLoader.profileName.charAt(0)}
                            </Avatar>
                            <Badge className="absolute bottom-0 right-0 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                                Active
                            </Badge>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">{selectedLoader.profileName}</h3>
                        <span className="text-sm text-gray-500 mt-1">{selectedLoader.roleName}</span>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-6 py-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-50">
                                <PhoneIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Contact</p>
                                <p className="font-medium">{selectedLoader.contact}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-purple-50">
                                <MailIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{selectedLoader.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 col-span-2">
                            <div className="p-2 rounded-full bg-amber-50">
                                <IdCardIcon className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Aadhar Number</p>
                                <p className="font-medium">{selectedLoader.aadharNumber.trim()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Locations */}
                    <div className="pt-6">
                        <h4 className="text-base font-semibold text-gray-900 mb-4">Assigned Locations</h4>
                        <div className="space-y-4">
                            {selectedLoader.qboxEntities.map((entity, index) => (
                                <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <MapPinIcon className="w-4 h-4 text-color" />
                                                <h5 className="font-medium text-gray-900">{entity.qboxEntityName}</h5>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <ClockIcon className="w-4 h-4" />
                                                <span>{entity.shiftTiming || 'No shift assigned'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                Supervisor: {entity.supervisorName}
                                            </p>
                                            <div className="mt-3 flex items-center gap-4">
                                                <div className="flex flex-col items-center bg-white px-3 py-1 rounded-lg">
                                                    <span className="text-xs text-gray-500">Today</span>
                                                    <span className="text-base font-semibold text-blue-600">
                                                        {entity.todayPresentCount}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-center bg-white px-3 py-1 rounded-lg">
                                                    <span className="text-xs text-gray-500">Weekly</span>
                                                    <span className="text-base font-semibold text-green-600">
                                                        {entity.weeklyPresentCount}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-center bg-white px-3 py-1 rounded-lg">
                                                    <span className="text-xs text-gray-500">Monthly</span>
                                                    <span className="text-base font-semibold text-purple-600">
                                                        {entity.monthlyPresentCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };

    return (
        <div className="min-h-screen ">
            <div className="custom-gradient-left h-32" />
            <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14'}`}>
                <div className="max-w-8xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex items-center gap-4  rounded-xl">
                                <div className="low-bg-color p-3 rounded-xl">
                                    <HardHat className="w-8 h-8 text-color" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900">Loaders</h1>
                                    <p className="text-gray-500 mt-2">View all Loaders</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='mt-8'>
                        <Table
                            columns={columns}
                            data={getEntityLoaderList?.map((report, index) => ({
                                ...report,
                                sno: index + 1,
                            }))}
                            rowsPerPage={10}
                            initialSortKey="Sno"
                            globalSearch={false}
                        />
                    </div>
                    <LoaderDetailsModal />
                </div>
            </div>
        </div>
    );
}

export default Loaders;