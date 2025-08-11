import React, { useEffect, useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Building,
    Calendar,
    IdCard,
    Leaf
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getUserByQboxEntity } from '@state/authnSlice';
import { useLocation } from 'react-router-dom';
import clsx from "clsx";
import Select from '@components/Select';
import { getFromLocalStorage } from '@utils/storage';
import { EmptyState } from "@view/Loader/Common widgets/empty_state"
import { ChevronUp, ChevronDown } from 'lucide-react';


interface InwardOrdersProps {
    qboxEntitySno: any;
}

// const UserGrid = () => {
const UserDetails: React.FC<InwardOrdersProps> = ({ qboxEntitySno }) => {

    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const { qboxEntityUserList } = useSelector((state: RootState) => state.authnSlice);
    // const qboxEntitySno = location.state?.qboxEntitySno || new URLSearchParams(location.search).get("qboxEntitySno");
    const [activeTab, setActiveTab] = useState('loader');
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice)
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [authUserId, setAuthUserId] = useState<number | null>(null);
    const [selectedQboxEntityName, setSelectedQboxEntityName] = useState('');
    const [selectedQboxArea, setSelectedQboxArea] = useState('');
    const [error, setError] = useState<string | null>(null)
    const [userData, setUserData] = useState<{} | null>(null);



    useEffect(() => {
        if (qboxEntitySno) {
            dispatch(getUserByQboxEntity({ qboxEntitySno }));
        }
    }, [qboxEntitySno, dispatch]);

    const loaders = qboxEntityUserList?.loaders || [];
    const supervisors = qboxEntityUserList?.supervisors || [];

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

                if (loginDetails?.authUserId) {
                    setAuthUserId(loginDetails.authUserId);
                } else {
                    throw new Error('authUserId missing in loginDetails');
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

    const handleDelivery = () => {
        if (selectedLocation) {
            dispatch(getUserByQboxEntity({ qboxEntitySno: Number(selectedLocation) }))
                .unwrap()
                .then((data) => {
                    setUserData(data);
                })
                .catch((err) => {
                    console.error("Failed to fetch infra properties:", err);
                    setUserData(null);
                });
        }
        const selectedEntity = dashboardQboxEntityByauthUserList.find(
            (qbe) => String(qbe.qboxEntitySno) === String(selectedLocation)
        );
        console.log(selectedEntity);
        setSelectedQboxEntityName(selectedEntity.qboxEntityName),
            setSelectedQboxArea(selectedEntity.areaName)
    };

    return (
        <div className="min-h-screen pb-8 ">
            {/* Tab Navigation */}
            <div className="custom-gradient-left h-32" />
            <div className={`-mt-24 pl-16 pr-14`}>
                <div className="max-w-8xl mx-auto">
                    <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-4 rounded-xl">
                            <div className="low-bg-color p-3 rounded-xl">
                                <User className="w-8 h-8 text-color" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
                                <p className="text-gray-600">Manage and track your user here...</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <select
                                className="w-64 min-w-[200px] px-4 py-2 pl-8 text-base text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                <option value="">Select Delivery Location</option>
                                {dashboardQboxEntityByauthUserList.map((loc: any) => (
                                    <option
                                        key={loc.qboxEntitySno}
                                        value={loc.qboxEntitySno}
                                    >
                                        {loc.qboxEntityName}
                                    </option>
                                ))}
                            </select>
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    className={`w-[160px] px-4 py-2.5 rounded-lg flex justify-center gap-1.5 text-white text-sm transition-colors ${selectedLocation
                                        ? "bg-color hover:bg-blue-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    onClick={handleDelivery}
                                    disabled={!selectedLocation}
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {!userData ? (
                    <div className="text-center py-12 mt-12">
                        <EmptyState />
                    </div>
                ) : (
                    <>
                        <div className="mt-12">
                            <div className="flex items-start gap-4">
                                <div className="p-3 low-bg-color rounded-xl">
                                    <Leaf className="w-6 h-6 text-color" />
                                </div>
                                <div className="flex flex-col justify-between">
                                    {/* Top: Delivery Location */}
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">
                                            {selectedQboxEntityName}{' '} <span className="text-color">Delivery Location</span>
                                        </h1>
                                        <p className="text-gray-600 text-sm">Monitor and manage your Asset</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-8 mt-14">
                                <div className="border-b border-gray-200">
                                    <nav className="flex -mb-px">
                                        <button
                                            onClick={() => setActiveTab('loader')}
                                            className={clsx(
                                                'py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm',
                                                activeTab === 'loader'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            )}
                                        >
                                            <User className="w-4 h-4" />
                                            Loader
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('supervisor')}
                                            className={clsx(
                                                'py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm',
                                                activeTab === 'supervisor'
                                                    ? 'border-green-500 text-green-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            )}
                                        >
                                            <User className="w-4 h-4" />
                                            Supervisor
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {/* Loader Cards */}
                            {activeTab === "loader" && (
                                loaders.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {loaders.map((user, index) => (
                                            <UserCard
                                                user={user}
                                                role="loader"
                                                key={user.id || index}
                                                isExpanded={expandedCardId === user.id}
                                                onToggle={() => setExpandedCardId(prev => (prev === user.id ? null : user.id))}
                                            />
                                        ))}
                                    </div>
                                ) : <EmptyState />
                            )}

                            {/* Supervisor Cards */}
                            {activeTab === "supervisor" && (
                                supervisors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {supervisors.map((user, index) => (
                                            <UserCard
                                                user={user}
                                                role="supervisor"
                                                key={user.id || index}
                                                isExpanded={expandedCardId === user.id}
                                                onToggle={() => setExpandedCardId(prev => (prev === user.id ? null : user.id))}
                                            />
                                        ))}
                                    </div>
                                ) : <EmptyState />
                            )}
                        </div>
                    </>
                )}

            </div >
        </div>
    );
};

const UserCard = ({
    user,
    role,
    isExpanded,
    onToggle
}: {
    user: any,
    role: 'loader' | 'supervisor',
    isExpanded: boolean,
    onToggle: () => void
}) => {
    const roleColors = {
        loader: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200',
            iconBg: 'bg-blue-100',
            badge: 'bg-blue-100 text-blue-800',
            ring: 'ring-blue-200',
            accent: 'bg-blue-500',
        },
        supervisor: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-200',
            iconBg: 'bg-green-100',
            badge: 'bg-green-100 text-green-800',
            ring: 'ring-green-200',
            accent: 'bg-green-500',
        },
    };


    const colors = roleColors[role] || roleColors.loader;

    // Attendance status indicator
    const todayStatus = user.todayPresentCount > 0 ? 'Present' : 'Absent';
    const todayStatusColor = user.todayPresentCount > 0 ? 'text-green-600' : 'text-red-600';

    return (
        <div className={`relative rounded-xl border ${colors.border} overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${colors.bg}`}>
            {/* Accent bar */}
            <div className={`absolute top-0 left-0 h-2 w-full ${colors.accent}`}></div>

            {/* Main content */}
            <div className="pt-6 pb-5 px-5">
                {/* Profile header */}
                <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                        <div className={`h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ${colors.ring}`}>
                            {user?.media_link?.mediaUrl ? (
                                <img
                                    src={JSON.parse(user.media_link.mediaUrl).mediaUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <User className="h-7 w-7 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center ${colors.iconBg} ${colors.text} shadow-sm`}>
                            {role === 'loader' ? (
                                <Phone className="h-3.5 w-3.5" />
                            ) : (
                                <User className="h-3.5 w-3.5" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{user.profileName}</h3>
                        <div className="flex items-center mt-1">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.badge}`}>
                                {user.roleName}
                            </span>
                            {/* Today's status badge */}
                            <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${todayStatus === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {todayStatus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact info */}
                <div className="mt-5 space-y-3">
                    <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${colors.iconBg}`}>
                            <Mail className={`h-4 w-4 ${colors.text}`} />
                        </div>
                        <p className="text-sm text-gray-600 truncate">{user.email || 'Not provided'}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${colors.iconBg}`}>
                            <Phone className={`h-4 w-4 ${colors.text}`} />
                        </div>
                        <p className="text-sm text-gray-600">{user.contact || 'Not provided'}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg ${colors.iconBg}`}>
                            <IdCard className={`h-4 w-4 ${colors.text}`} />
                        </div>
                        <p className="text-sm text-gray-600">{user.aadharNumber || 'Not provided'}</p>
                    </div>
                </div>

                {/* Attendance summary */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500">Today</p>
                        <p className={`text-sm font-medium ${todayStatusColor}`}>
                            {todayStatus}
                        </p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500">This Week</p>
                        <p className="text-sm font-medium text-gray-700">
                            {user.weeklyPresentCount || 0} days
                        </p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500">This Month</p>
                        <p className="text-sm font-medium text-gray-700">
                            {user.monthlyPresentCount || 0} days
                        </p>
                    </div>
                </div>

                {/* Shift timing (for loaders) */}
                {role === 'loader' && user.shiftTiming && (
                    <div className='mt-4 p-3 rounded-lg border border-blue-200 bg-blue-50'>
                        <div className="flex items-center space-x-3">
                            <Calendar className={`text-blue-600 h-5 w-5`} />
                            <div>
                                <p className="text-sm font-medium text-gray-800">{user.shiftTiming}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Additional details (always visible) */}
            <div className={`border-t ${colors.border} px-5 py-4 bg-white`}>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className={`p-1.5 rounded-lg ${colors.iconBg} mt-0.5`}>
                            <Building className={`h-4 w-4 ${colors.text}`} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Qbox Entity</p>
                            <p className="text-sm text-gray-800">{user.qboxEntityName || 'Not available'}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className={`p-1.5 rounded-lg ${colors.iconBg} mt-0.5`}>
                            <Calendar className={`h-4 w-4 ${colors.text}`} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Created On</p>
                            <p className="text-sm text-gray-800">
                                {user.createdOn ? new Date(user.createdOn).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                }) : 'Not available'}
                            </p>
                        </div>
                    </div>

                    {user.supervisorDetails && (
                        <div className="flex items-start space-x-3">
                            <div className={`p-1.5 rounded-lg ${colors.iconBg} mt-0.5`}>
                                <User className={`h-4 w-4 ${colors.text}`} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Supervisor</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {user.supervisorDetails.supervisorName || 'Not assigned'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;