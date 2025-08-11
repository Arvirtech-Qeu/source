import React, { useEffect, useState } from 'react';
import {
    Check, Package, Truck, Box, Search, Clock, AlertCircle,
    Utensils, Footprints, PackageCheck, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { MasterCard, CardContent, CardHeader, CardTitle } from '@components/MasterCard';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { searchSkuTraceWf } from '@state/supplyChainSlice';
import DateTime from '@components/DateTime';
import { EmptyState } from '../Common widgets/empty_state';
import { Modal } from '@components/Modal';
import { getRejectSku } from '@state/superAdminDashboardSlice';
import { confirmSkuRejectOrAccept } from '@state/loaderDashboardSlice';
import { toast } from 'react-toastify';


interface FoodTrackingProps {
    skuInventorySno: any;
}

// Add these interfaces
interface RejectedSkuDetails {
    skuInventorySno: number;
    imageUrl: string;
    reason?: string;
    status: string;
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

const FoodTracking: React.FC<FoodTrackingProps> = ({ skuInventorySno }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [processingTime, setProcessingTime] = useState("");
    const [stage, setStage] = useState("Active");
    const { skuTraceWfList } = useSelector((state: RootState) => state.supplyChain);
    const [showRejectedModal, setShowRejectedModal] = useState(false);
    const [selectedSku, setSelectedSku] = useState<RejectedSkuDetails | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    const [rejectedSkuDetails, setRejectedSkuDetails] = useState<RejectedSkuDetail | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentListIndex, setCurrentListIndex] = useState(0);

    useEffect(() => {
        const skuInventorySno = location.state?.skuInventorySno;
        if (skuInventorySno) {
            dispatch(searchSkuTraceWf({ skuInventorySno }));
        }
    }, [dispatch, skuInventorySno]);

    // Map of stage codes to their respective icons
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
    const completedStages = skuTraceWfList?.filter((stage) => stage.actionTime).length;

    const filteredList = skuTraceWfList?.filter((item) =>
        item.skuInventorySno.toString().includes(searchQuery)
    );

    useEffect(() => {
        if (filteredList.length === 0) {
            console.error("No valid events in filteredList.");
            setProcessingTime(""); // Reset processing time
            return;
        }
        const timestamps: number[] = filteredList
            .map(event => new Date(event.actionTime ?? "").getTime()) // Handle potential undefined values
            .filter(time => !isNaN(time)); // Remove invalid dates

        if (timestamps.length > 0) {
            const minTime = Math.min(...timestamps);
            const maxTime = Math.max(...timestamps);
            const processingTimeMs = maxTime - minTime;

            // Convert milliseconds to hours and minutes
            const hours = Math.floor(processingTimeMs / (1000 * 60 * 60));
            const minutes = Math.floor((processingTimeMs % (1000 * 60 * 60)) / (1000 * 60));

            const formattedTime = `${hours}h ${minutes}m`;

            console.log("Processing Time:", formattedTime);
            setProcessingTime(formattedTime);
        } else {
            console.error("No valid timestamps found after filtering.");
            setProcessingTime(""); // Reset if no valid timestamps
        }
    }, [filteredList]); // Runs only when `filteredList` changes

    // Add this function to handle SKU actions
    const handleSkuAction = async (action: 'accept' | 'reject') => {
        try {
            if (!rejectedSkuDetails?.skuInventorySno) {
                console.error('No SKU details available');
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
                <div className="w-[1000px] max-h-[80vh] overflow-y-auto">
                    <div className="space-y-6">
                        <div className="flex gap-6">
                            {/* Image Carousel - smaller and on the left */}
                            <div className="relative rounded-lg overflow-hidden bg-gray-100 h-[250px] w-[300px]">
                                {currentImage ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={currentImage.mediaUrl}
                                            alt={`SKU Image ${currentListIndex + 1}-${currentImageIndex + 1}`}
                                            className="object-contain w-full h-full"
                                        />
                                        {(totalLists > 1 || totalImagesInCurrentList > 1) && (
                                            <>
                                                {/* Navigation Buttons */}
                                                <button
                                                    onClick={handlePrevious}
                                                    className={`absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                                        ${currentListIndex === 0 && currentImageIndex === 0
                                                            ? 'bg-gray-400/50 cursor-not-allowed'
                                                            : 'bg-black/50 hover:bg-black/70'
                                                        } text-white transition-all`}
                                                    disabled={currentListIndex === 0 && currentImageIndex === 0}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                                        ${currentListIndex === totalLists - 1 &&
                                                            currentImageIndex === totalImagesInCurrentList - 1
                                                            ? 'bg-gray-400/50 cursor-not-allowed'
                                                            : 'bg-black/50 hover:bg-black/70'
                                                        } text-white transition-all`}
                                                    disabled={currentListIndex === totalLists - 1 &&
                                                        currentImageIndex === totalImagesInCurrentList - 1}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-gray-400 text-sm">No images available</span>
                                    </div>
                                )}
                            </div>

                            {/* SKU Details Grid - 3 per row */}
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                                    <p className="mt-1 text-sm text-gray-900">{rejectedSkuDetails.orderId}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">SKU Code</h3>
                                    <p className="mt-1 text-sm text-gray-900">{rejectedSkuDetails.skuCode}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Restaurant</h3>
                                    <p className="mt-1 text-sm text-gray-900">{rejectedSkuDetails.restaurantName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Menu</h3>
                                    <p className="mt-1 text-sm text-gray-900">{rejectedSkuDetails.menu}</p>
                                </div>
                                <div className="col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {rejectedSkuDetails.location[0]?.line1}, {rejectedSkuDetails.location[0]?.areaName}, {rejectedSkuDetails.location[0]?.cityName}
                                    </p>
                                </div>
                                <div className="col-span-3">
                                    <h3 className="text-sm font-medium text-gray-500">Rejection Reason</h3>
                                    <p className="mt-1 text-sm text-gray-900">{rejectedSkuDetails.reason}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                            <button
                                onClick={() => handleSkuAction('reject')}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Confirm Rejection
                            </button>
                            <button
                                onClick={() => handleSkuAction('accept')}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Accept SKU
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

        );
    };

    return (
        <>
            <div className="min-h-screen ">
                <div className="custom-gradient-left h-32" />
                <div className={`-mt-24 pl-16 pr-14`}>
                    <div className="max-w-8xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="flex items-center gap-4  rounded-xl">
                                    <div className="low-bg-color p-3 rounded-xl">
                                        <PackageCheck className="w-8 h-8 text-color" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-semibold text-gray-900">Food Sku Tracking</h1>
                                        <p className="text-gray-500 mt-2">View your food sku tracking</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
                            <MasterCard className="low-bg-color">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-color" size={24} />
                                        <div>
                                            <div className="text-2xl font-bold text-color">{processingTime}</div>
                                            <div className="text-sm text-gray-600">Processing Time</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </MasterCard>
                            <MasterCard className="low-bg-color">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2">
                                        <Check className="text-color" size={24} />
                                        <div>
                                            <div className="text-2xl font-bold text-color">
                                                {completedStages}/{totalStages}
                                            </div>
                                            <div className="text-sm text-gray-600">Stages Completed</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </MasterCard>
                            <MasterCard className="low-bg-color">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="text-color" size={24} />
                                        <div>
                                            <div className="text-2xl font-bold text-color">
                                                {stage}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {filteredList?.wfStageCd === 13
                                                    ? "All stages completed"
                                                    : "Current Status"}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </MasterCard>
                        </div>

                        {/* Timeline */}
                        <MasterCard className="shadow-none">
                            <CardHeader className='border-none'>
                                <CardTitle className="text-color">Delivery Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {filteredList?.map((stage, index) => {
                                        const Icon = stageIconMap[stage.wfStageCd] || AlertCircle;
                                        return (
                                            <div key={stage.skuTraceWfSno} className="relative">
                                                {/* ...existing connector line code... */}
                                                <div className="flex items-start gap-4 group">
                                                    <div className="flex-1 p-4 rounded-lg border border-gray-200 group-hover:border-black transition-colors">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-medium text-gray-900">
                                                                {stage.codesDtl1description || "No Description"}
                                                            </h3>
                                                            <span className="text-sm text-gray-500">
                                                                <DateTime date={stage.actionTime} showDateIcon={false} showTimeIcon={false} color='gray' />
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
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
                                                                            console.error('Error fetching rejected SKU details:', error);
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
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </MasterCard>
                    </div>
                </div>
            </div>
            <RejectedSkuModal />
        </>

    );

};

export default FoodTracking;