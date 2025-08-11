import type React from "react"
import { useEffect, useState } from "react"
import {
    Eye,
    EyeOff,
    AlertCircle,
    X,
    Building,
    ChevronRight,
    Activity,
    Grid as GridIcon,
    Tv as TvIcon,
    Framer as FridgeIcon,
    Box as QBoxIcon,
    Lock,
    Unlock,
    Camera as CameraIcon,
    User,
    CalendarDays,
    Leaf,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@state/store"
import { getDashboardQboxEntityByauthUser, getEntityInfraPropertiesV2 } from "@state/superAdminDashboardSlice"
import { getFromLocalStorage } from "@utils/storage"
import { EmptyState } from "@view/Loader/Common widgets/empty_state"

interface InfraProperty {
    propertyName: string
    value: string
}

interface InfraDetail {
    infraSno: number
    infraIcon: string
    infraName: string
    properties: InfraProperty[]
    nextServiceDate: string | null;
}

interface InfraCount {
    infraSno: number
    infraName: string
    count: number
}

interface AssertProps {
    isHovered: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Box: GridIcon,
    Monitor: TvIcon,
    Refrigerator: FridgeIcon,
    Grid: QBoxIcon,
    Camera: CameraIcon,
}

const AssertDetails: React.FC<AssertProps> = ({ isHovered }) => {
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedCamera, setSelectedCamera] = useState<InfraDetail | null>(null)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [showStream, setShowStream] = useState(false)
    const [showUserGrid, setShowUserGrid] = useState(false)
    const navigate = useNavigate()
    const [selectedInfra, setSelectedInfra] = useState<InfraDetail[] | null>(null)
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const [infraData, setInfraData] = useState<{
        infraCounts: InfraCount[]
        infraDetails: InfraDetail[]
    } | null>(null);
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice)
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [authUserId, setAuthUserId] = useState<number | null>(null);
    const [selectedQboxEntityName, setSelectedQboxEntityName] = useState('');
    const [selectedQboxArea, setSelectedQboxArea] = useState('');


    const dispatch = useDispatch<AppDispatch>();

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


    useEffect(() => {
        if (location.state) {
            setInfraData(location.state.infraData);
            setSelectedCardId(location.state.selectedCardId);
            setSelectedLocation(location.state.selectedLocation);
            setSelectedQboxEntityName(location.state.selectedQboxEntityName);
            setSelectedQboxArea(location.state.selectedQboxArea);
        }
    }, [location.state]);

    useEffect(() => {
        if (authUserId !== null) {
            dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserId }));
        }
    }, [authUserId, dispatch]);

    const handleCameraClick = (camera: InfraDetail) => {
        setSelectedCamera(camera)
        setShowPasswordModal(true)
        setError("")
        setPassword("")
    }

    const handleShowDetails = (infraSno: number) => {
        const details = infraData?.infraDetails?.filter((detail) => detail.infraSno === infraSno) || []
        setSelectedInfra(details)
    }

    const handleCardClick = (infraSno: number) => {
        setSelectedCardId(infraSno)
        handleShowDetails(infraSno)
    }

    const renderInfraIcon = (icon: string) => {
        const IconComponent = iconMap[icon] || QBoxIcon
        return <IconComponent className="w-full h-full" />
    }

    const getCardColor = (index: number) => {
        const colors = [
            {
                bg: "bg-gradient-to-br from-blue-50 to-blue-100",
                border: "border-blue-200",
                icon: "text-blue-500 bg-blue-100",
                badge: "bg-blue-500",
            },
            {
                bg: "bg-gradient-to-br from-purple-50 to-purple-100",
                border: "border-purple-200",
                icon: "text-purple-500 bg-purple-100",
                badge: "bg-purple-500",
            },
            {
                bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
                border: "border-emerald-200",
                icon: "text-emerald-500 bg-emerald-100",
                badge: "bg-emerald-500",
            },
            {
                bg: "bg-gradient-to-br from-amber-50 to-amber-100",
                border: "border-amber-200",
                icon: "text-amber-500 bg-amber-100",
                badge: "bg-amber-500",
            },
            {
                bg: "bg-gradient-to-br from-rose-50 to-rose-100",
                border: "border-rose-200",
                icon: "text-rose-500 bg-rose-100",
                badge: "bg-rose-500",
            },
        ]
        return colors[index % colors.length]
    }

    // const handlePasswordSubmit = () => {

    const handlePasswordSubmit = () => {
        if (!selectedCamera) return;

        const storedPassword = selectedCamera.properties.find((p) => p.propertyName === "password")?.value;

        if (password === storedPassword) {
            const url = selectedCamera.properties.find((p) => p.propertyName === "URL")?.value;
            setShowPasswordModal(false);
            setShowStream(true);

            const params = new URLSearchParams({
                url: url || '',
                from: 'location'
            });

            navigate(`/assert-detail/cctv-viewer-assert?${params.toString()}`, {
                state: {
                    infraData,
                    selectedCardId,
                    selectedLocation,
                    selectedQboxEntityName,
                    selectedQboxArea
                }
            });
            setIsPasswordValid(true);
        } else {
            setError("Invalid password");
            setIsPasswordValid(false);
        }
    }

    const handleDelivery = () => {
        if (selectedLocation) {
            dispatch(getEntityInfraPropertiesV2({ qboxEntitySno: Number(selectedLocation) }))
                .unwrap()
                .then((data) => {
                    setInfraData(data);
                })
                .catch((err) => {
                    console.error("Failed to fetch infra properties:", err);
                    setInfraData(null);
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
        <div className="min-h-screen pb-8">
            <div className="custom-gradient-left h-32" />

            <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14 '}`}>
                {/* Header Section */}
                <div className="max-w-8xl mx-auto">
                    <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-4 rounded-xl">
                            <div className="low-bg-color p-3 rounded-xl">
                                <Building className="w-8 h-8 text-color" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Assets Details</h1>
                                <p className="text-gray-600">Manage and track your Assets</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            {/* <select
                                className="border p-2 rounded"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                <option value="">Select Delivery Location</option>
                                {dashboardQboxEntityByauthUserList.map((loc: any) => (
                                    <option key={loc.qboxEntitySno} value={String(loc.qboxEntitySno)}>
                                        {loc.qboxEntityName}
                                    </option>
                                ))}
                            </select> */}

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

                            {/* <button
                                onClick={handleDelivery}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Show Location Info
                            </button> */}

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

                {/* const [selectedQboxEntityName, setSelectedQboxEntityName] = useState('');
                const [selectedQboxArea, setSelectedQboxArea] = useState(''); */}

                {/* Infrastructure Cards Grid */}
                {!infraData ? (
                    <div className="text-center py-12 mt-12">
                        <EmptyState />
                    </div>
                ) : (
                    <>
                        <div className="mt-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 low-bg-color rounded-xl">
                                    <Leaf className="w-6 h-6 text-color" />
                                </div>
                                <div className="flex flex-col justify-between">
                                    {/* Top: Delivery Location */}
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">
                                            {selectedQboxEntityName}{' '} <span className="text-color">Delivery Location</span>
                                            {/* SAMPLE <span className="text-color">Delivery Location</span> */}
                                        </h1>
                                        <p className="text-gray-600 text-sm">Monitor and manage your Assets</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-6 my-6">
                                {infraData.infraCounts.map((infra, index) => {
                                    const colorScheme = getCardColor(index);
                                    const infraDetail = infraData.infraDetails.find((d) => d.infraSno === infra.infraSno);

                                    return (
                                        <div
                                            key={infra.infraSno}
                                            onClick={() => handleCardClick(infra.infraSno)}
                                            className={`relative group overflow-hidden rounded-xl border ${colorScheme.border} ${colorScheme.bg} transition-all duration-300 hover:shadow-lg cursor-pointer hover:-translate-y-1 ${selectedCardId === infra.infraSno ? "ring-2 ring-offset-2 ring-blue-500 shadow-md" : ""}`}
                                        >
                                            {/* Gradient overlay for depth */}
                                            <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                            {/* Count badge with subtle shadow */}
                                            <div className="absolute top-4 right-4">
                                                <div
                                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${colorScheme.badge} text-white font-bold text-lg shadow-md`}
                                                >
                                                    {infra.count}
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <div className="flex items-center space-x-4 mb-6">
                                                    <div className={`p-3 rounded-xl ${colorScheme.icon} shadow-inner`}>
                                                        <div className="w-6 h-6">
                                                            {renderInfraIcon(infraDetail?.infraIcon || "")}
                                                        </div>
                                                    </div>
                                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{infra.infraName}</h3>
                                                </div>

                                                {/* Animated view details button */}
                                                <div className="pt-4 border-t border-gray-200/70 mt-2">
                                                    <button
                                                        className="flex items-center justify-between w-full text-blue-600 hover:text-blue-800 transition-colors group/viewMore"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCardClick(infra.infraSno);
                                                        }}
                                                    >
                                                        <span className="text-sm font-medium group-hover/viewMore:underline">View Details</span>
                                                        <ChevronRight className="w-5 h-5 transition-transform group-hover/viewMore:translate-x-1" />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Details Section */}
                        {selectedCardId && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 transition-all duration-300 animate-fadeIn">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Device Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {infraData.infraDetails
                                        .filter((detail) => detail.infraSno === selectedCardId)
                                        .map((device, index) => {
                                            const colorScheme = getCardColor(index)
                                            return (
                                                <div
                                                    key={index}
                                                    className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className={`${colorScheme.bg} p-4 border-b ${colorScheme.border}`}>
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`p-2 rounded-full bg-white shadow-sm`}>
                                                                <div className="w-6 h-6 text-gray-700">{renderInfraIcon(device.infraIcon)}</div>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-gray-800">
                                                                {device.infraName} {index + 1}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-white">
                                                        {device.nextServiceDate && (
                                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-3">
                                                                <div className="text-blue-600">
                                                                    <CalendarDays className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm text-blue-700 font-medium">Next Service Date</span>
                                                                    <span className="text-sm font-semibold text-blue-900">
                                                                        {new Date(device.nextServiceDate).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="space-y-4">
                                                            {device.properties.map((prop, propIndex) => (
                                                                <div
                                                                    key={propIndex}
                                                                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                                                                >
                                                                    <span className="text-sm font-medium text-gray-700">{prop.propertyName}</span>
                                                                    {prop.propertyName === "URL" ? (
                                                                        <button
                                                                            onClick={() => handleCameraClick(device)}
                                                                            className="px-3 py-1.5 bg-color text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                            <span>View Stream</span>
                                                                        </button>
                                                                    ) : prop.propertyName === "password" ? (
                                                                        <span className="text-sm text-gray-800">••••••••</span>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-800 font-medium">{prop.value}</span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                            <div className="bg-color px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white bg-opacity-20 rounded-full">
                                        <Lock className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Authentication Required</h3>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-600 mb-6">
                                    Please enter the password to access the camera stream for{" "}
                                    <span className="font-medium text-gray-800">{selectedCamera?.infraName}</span>.
                                </p>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter device password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full pl-10 pr-10 py-3 border ${!isPasswordValid ? "border-red-300" : "border-gray-300"
                                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-red-700">{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePasswordSubmit}
                                    disabled={password.length === 0}
                                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center space-x-2 ${password.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-color hover:bg-blue-700"
                                        } transition-colors`}
                                >
                                    <Unlock className="w-4 h-4" />
                                    <span>Connect</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AssertDetails;