import React, { useEffect, useRef, useState } from 'react';
import { Check, Package, Truck, Box, Search, Clock, AlertCircle, Utensils, PackageCheck } from 'lucide-react';
import { MasterCard, CardContent, CardHeader, CardTitle } from '@components/MasterCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { searchSkuTraceWf } from '@state/supplyChainSlice';
import DateTime from '@components/DateTime';

interface FoodSkuTrackingProps {
    skuInventorySno: any;
}

const FoodSkuTracking: React.FC<FoodSkuTrackingProps> = ({ skuInventorySno }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [processingTime, setProcessingTime] = useState("");
    const [stage, setStage] = useState("Active");

    const { skuTraceWfList } = useSelector((state: RootState) => state.supplyChain);
    const dispatch = useDispatch<AppDispatch>();

    const lineHeightsRef = useRef<number[]>([]); // store dynamic heights
    const refs = useRef<(HTMLDivElement | null)[]>([]); // refs to measure height

    useEffect(() => {
        if (skuInventorySno) {
            dispatch(searchSkuTraceWf({ skuInventorySno }));
        }
    }, [dispatch, skuInventorySno]);

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
            setProcessingTime("");
            return;
        }

        const timestamps = filteredList
            .map(event => new Date(event.actionTime ?? "").getTime())
            .filter(time => !isNaN(time));

        if (timestamps.length > 0) {
            const minTime = Math.min(...timestamps);
            const maxTime = Math.max(...timestamps);
            const diff = maxTime - minTime;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setProcessingTime(`${hours}h ${minutes}m`);
        } else {
            setProcessingTime("");
        }
    }, [filteredList]);

    // Measure line heights after rendering
    useEffect(() => {
        if (filteredList?.length) {
            const heights = refs.current.map(ref => ref?.offsetHeight || 10);
            lineHeightsRef.current = heights;
        }
    }, [filteredList]);

    return (
        <div className="min-h-screen">
            {filteredList?.length > 0 ? (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl text-color flex items-center gap-1.5">
                                <PackageCheck className='w-8 h-8 text-color' />
                                Food Sku Tracking
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                SKU Inventory #{skuTraceWfList?.[0]?.skuInventorySno || "N/A"} | Handler: {skuTraceWfList?.[0]?.appUser1 || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Metrics Cards */}
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
                                        <div className="text-2xl font-bold text-color">{stage}</div>
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
                    <MasterCard className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-color">Delivery Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {filteredList.map((stage, index) => {
                                    const Icon = stageIconMap[stage.wfStageCd] || AlertCircle;
                                    return (
                                        <div key={stage.skuTraceWfSno} className="relative">
                                            {index !== filteredList.length - 1 && (
                                                <div
                                                    className="absolute left-6 top-12 border-l-2 border-color"
                                                    style={{ height: `${lineHeightsRef.current[index] || 10}px` }}
                                                />
                                            )}

                                            <div
                                                ref={(el) => (refs.current[index] = el)}
                                                className="flex items-start gap-4 group"
                                            >
                                                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full low-bg-color text-color group-hover:bg-color group-hover:text-white transition-colors">
                                                    <Icon size={20} />
                                                </div>
                                                <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100 hovered-border transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-medium text-gray-900">
                                                            {stage.codesDtl1description || "No Description"}
                                                        </h3>
                                                        <span className="text-sm text-gray-500">
                                                            <DateTime
                                                                date={stage.actionTime}
                                                                showDateIcon={false}
                                                                showTimeIcon={false}
                                                                color="blue"
                                                            />
                                                        </span>
                                                    </div>
                                                    {stage.reference && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Ref: {stage.reference}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </MasterCard>
                </>
            ) : (
                <div className="flex justify-center items-center h-64 px-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto mb-2">
                            <AlertCircle className="w-full h-full text-color" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">No Food Tracking Found</h3>
                        <p className="text-gray-600">No matching Food Tracking were found.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodSkuTracking;
