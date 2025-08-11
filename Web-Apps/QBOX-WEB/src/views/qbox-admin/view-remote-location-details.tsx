import React, { useEffect, useState } from "react";
import {
    X,
    Settings,
    Check,
    ChevronRight,
    Monitor,
    Box,
    ListChecks,
    ChevronDown,
    MapPin,
    Clock,
    Phone,
    Globe,
    Star,
    Share2,
    Heart,
    Camera,
    MessageSquare,
    MapPinHouse,
    ChevronsLeftRightEllipsis,
    Activity,
    AudioLines,
    MapPinned,
    Flag,
    Warehouse,
    HousePlus,
    LandPlot,
    MonitorIcon,
    MonitorCog,
} from "lucide-react";
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from "@components/Button";
import { MasterCard } from "@components/MasterCard";
import { Badge } from "@components/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/Tabs";
import Infrastructures from "@view/Q-box-master/infrastructure";
import { Alert, AlertDescription } from "@components/Alert";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { getAllArea } from "@state/areaSlice";
import { getAllAddress } from "@state/addressSlice";
import { getAllQboxEntities } from "@state/qboxEntitySlice";
import { useNavigate } from "react-router-dom";

// Default restaurant data
const defaultRestaurant = {
    qboxEntitySno: 1,
    qboxEntityName: "Mutton Biryani",
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    area: "Sholinganallur",
    addressName: "2/32-Near Simson Hospital",
    entityCode: 1,
    rating: 2.5,
    cuisine: "Italian",
    openingHours: "9AM-10PM",
    qboxEntityStatusCd: 4,
    status: "Active",
    infraDetails: [
        {
            type: "TV",
            icon: <Monitor className="w-5 h-5" />,
            quantity: 5,
        },
    ],
};

interface ViewRemoteLocationDetailProps {
    qboxEntitySno: string;
    onClose: () => void;
    onConfigureInfra: () => void;
}

const ViewRemoteLocationDetail: React.FC<ViewRemoteLocationDetailProps> = ({

    qboxEntitySno,
    onClose,
    // onConfigureInfra,
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    const [showInfraMenu, setShowInfraMenu] = useState<number | false>(false);
    const { qboxEntityList } = useSelector(
        (state: RootState) => state.qboxEntity
    );
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getAllArea({}));
        dispatch(getAllAddress({}));
        // dispatch(getAllQboxEntities({}));
    }, [dispatch]);

    // Use default restaurant data
    const restaurant =
        qboxEntityList.find(
            (entity) => entity.qboxEntitySno === Number(qboxEntitySno)
        ) || defaultRestaurant;

    const formatDateTime = (dateString) => {
        const date = new Date();
        return date.toLocaleString();
    };

    const hasInfra = restaurant.infraDetails && restaurant.infraDetails.length > 0;
    console.log(qboxEntitySno);
    console.log(qboxEntityList);

    const onConfigureInfra = () => {
        // navigate("/entity-dashboard/infra-config", {
        //     state: { qboxEntitySno: qboxEntitySno, qboxEntityName: restaurant.qboxEntityName },
        // });
        navigate(`/master-settings/entity-dashboard/infra-config?qboxEntitySno=${qboxEntitySno}&qboxEntityName=${restaurant.qboxEntityName}`)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 ">
            <MasterCard className="w-full max-w-3xl bg-white shadow-2xl">
                {/* Header Section with Hero Image */}
                <div className="relative h-16 custom-gradient-right rounded-t-lg">
                    <div className="absolute bg-black/20"></div>
                    <div className="absolute top-4 right-4 flex space-x-2 ">
                        <button
                            onClick={onClose}
                            className="p-2 mt-1 hover:bg-white/20 bg-white/60 rounded-full transition-colors"
                        >
                            <X className="w-3 h-3 " />
                        </button>
                    </div>

                    <div className="absolute bottom-1 left-6 ">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {restaurant.qboxEntityName}
                        </h2>
                    </div>
                </div>
                <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
                    <TabsContent value="details" className={undefined}>
                        <div className="m-4">
                            <h1 className="text-2xl"></h1>
                            <div className="grid gap-4 pl-2  ">
                                <div className="p-3 bg-white rounded-lg ">
                                    <div className="mb-5 flex items-center gap-2  ">
                                        <Globe className="w-5 h-5 text-gray-500" />
                                        <h2 className="text-lg font-semibold text-gray-900 ">
                                            Delivery Location Details
                                        </h2>
                                    </div>

                                    <div className="space-y-4 ">
                                        {/* Flex Layout for Full Address and Entity Code */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex items-start gap-3">
                                                <MapPinHouse className="w-5 h-5 mt-1 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">
                                                        Delivery Location Name
                                                    </div>
                                                    <div className="text-gray-900">
                                                        {restaurant.qboxEntityName}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <ChevronsLeftRightEllipsis className="w-5 h-5 mt-1 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">
                                                        Delivery Location Code
                                                    </div>
                                                    <div className="text-gray-900">
                                                        {restaurant.entityCode}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">

                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <AudioLines className="w-5 h-5 text-gray-400 flex-shrink-0" />

                                                <div>
                                                    {/* Status Label */}
                                                    <span className="text-sm text-gray-500">Status</span>

                                                    {/* Conditional Rendering for Active/Inactive */}
                                                    {restaurant.activeFlag !== undefined && (
                                                        <div className="flex flex-col items-start mt-1">
                                                            {restaurant.activeFlag ? (
                                                                <span className="inline-flex items-center rounded-full text-sm font-medium text-green-600">
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium text-red-700">
                                                                    InActive
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPinned className="w-5 h-5 mt-1 text-gray-400 flex-shrink-0" />
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">
                                                    Full Address
                                                </div>
                                                <div className="text-gray-900">
                                                    {restaurant.line1},{restaurant.areaName},{restaurant.cityName},{restaurant.state1name},{restaurant.country1name}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flex Layout for Country, State, City, Area */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex items-start gap-3">
                                                <Flag className="w-5 h-5 mt-1 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">
                                                        Country
                                                    </div>
                                                    <div className="text-gray-900">
                                                        {restaurant.country1name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Warehouse className="w-5 h-5 mt-1 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">State</div>
                                                    <div className="text-gray-900">{restaurant.state1name}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <HousePlus className="w-5 h-5 mt-1 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">City</div>
                                                    <div className="text-gray-900">{restaurant.cityName}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <LandPlot className="w-5 h-5 mt-1 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">Area</div>
                                                    <div className="text-gray-900">
                                                        {restaurant.areaName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <div className="border-t p-3 ml-8 mr-8">
                        <div className="flex justify-between">
                            <h3 className="text-lg font-semibold mb-2">
                                Asset Configuration
                            </h3>
                            {!hasInfra ? (
                                <h1></h1>
                            ) :
                                (
                                    <div className="flex justify-end">
                                        <button className="flex rounded-lg bg-color text-white p-2 mb-4" onClick={onConfigureInfra}>
                                            <MonitorCog className="mr-2 cursor-pointer" />
                                            View
                                        </button>
                                    </div>

                                )}
                        </div>
                        {!hasInfra ? (
                            <div className="space-y-2">
                                <Alert className="bg-red-50 border-red-200 ">
                                    <AlertDescription>
                                        No Asset configured for this Delivery Location.
                                    </AlertDescription>
                                </Alert>
                                <Button
                                    onClick={onConfigureInfra}
                                    className="w-full bg-color hover:bg-color text-white flex justify-center py-3"
                                >
                                    <Settings className="w-4 h-4 mr-2 mt-1" />
                                    Configure Asset
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {restaurant.infraDetails.map((infra, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium">{infra.infraName}</span>
                                            {/* <span className="font-medium">{infra.type}</span> */}
                                            <span className="text-gray-500">
                                                Quantity: {infra.count}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transform transition-transform ${showInfraMenu === index ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div >
            </MasterCard>
        </div>
    );
};
export default ViewRemoteLocationDetail;


