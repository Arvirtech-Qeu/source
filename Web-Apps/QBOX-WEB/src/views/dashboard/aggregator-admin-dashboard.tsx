import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf, Box as GridIcon,
    Tv as TvIcon,
    User as FridgeIcon,
    Grid as QBoxIcon,
    AlertCircle,
    Truck,
    MenuIcon,
    ArrowDownCircle,
    ClipboardList,
    ShoppingCart,
    CheckCircle,
    Clock,
    RefreshCw,
    TrendingUp,
    Filter,
    ShoppingBag,
    Timer,
    XCircle,
    Flame,
    Box,
    RotateCcw,
    Package,
    Check,
    PackageSearch,
    X,
    ArrowUpCircle,
} from 'lucide-react';
import {
    MasterCard,
    CardContent,
} from "@components/MasterCard";
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getAllDeliiveryPartner } from '@state/deliveryPartnerSlice';
import {
    getBoxCellInventoryv2, getHotboxCountV2, getEntityInfraPropertiesV2,
    getPurchaseOrdersDashboard, getSkuDashboardCounts,
    getRejectSku,
    getMostSoldCounts,
    getInwardOrderDetails,
    getUnSoldSkuLunchCounts,
    getUnSoldSkuDinnerCounts
} from '@state/superAdminDashboardSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserByQboxEntity } from '@state/authnSlice';
import PurchaseOrderDtl from './purchase-order-dtl';
import QBoxMenuDtl from './qbox-menu-dtl';
import QBoxInventoryDtl from './qBox-inventory-dtl';
import InventoryBoxDtl from './inventory-box';
import InwardOrders from '@view/supply-chain/inward-orders';
import RejectSkuDtl from './reject-sku-dtl';
import SalersDetails from './todayprevday-skuCount-dtl';
import { getFromLocalStorage } from '@utils/storage';
import { acceptSku, rejectSku, searchPurchaseOrderDtl, searchSkuInventory, searchSkuTraceWf } from '@state/supplyChainSlice';
import DateTime from '@components/DateTime';
import { Dialog, DialogContent } from '@components/Dialog';
import OutwardOrders from '@view/supply-chain/outward-orders';
import clsx from 'clsx';


const iconMap = {
    'Box': GridIcon,
    'Monitor': TvIcon,
    'Refrigerator': FridgeIcon,
    'Grid': QBoxIcon
};

const RefreshIndicator = memo(({ isRefreshing }: { isRefreshing: boolean }) => {
    if (!isRefreshing) return null;
    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-color animate-spin" />
                <span className="text-sm text-gray-600">Refreshing...</span>
            </div>
        </div>
    );
});

const AggregatorAdminDashboard = ({ isHovered }) => {

    const navigate = useNavigate()
    const [isDetailView, setIsDetailView] = useState(false);
    const [filters, setFilters] = useState({
        qboxEntitySno: '',
        deliveryPartnerSno: '',
        transactionDate: '',
    });
    const [activeTab, setActiveTab] = useState('allInwardOrders');
    const location = useLocation();

    const dispatch = useDispatch<AppDispatch>();
    const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
    const { purchaseOrdersDashboardList, dashboardQboxEntityList } = useSelector((state: RootState) => state.dashboardSlice);
    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const { rejectSkuList, mostSoldCountsList, inwardOrderDetailList, unSoldSkuLunchList, unSoldSkuDinnerList } = useSelector((state: RootState) => state.dashboardSlice)
    const { skuDashboardCountList, getBoxCellInventoryList, getHotboxCountList, getDashboardInfraList, refreshing } = useSelector((state: RootState) => state.dashboardSlice);
    const qboxEntitySno = location.state?.qboxEntitySno || new URLSearchParams(location.search).get("qboxEntitySno");
    const qboxEntityName = location.state?.qboxEntityName || new URLSearchParams(location.search).get("qboxEntityName");
    const transactionDate = location.state?.transactionDate || new URLSearchParams(location.search).get("transactionDate");
    const deliveryPartnerSno = location.state?.deliveryPartnerSno || new URLSearchParams(location.search).get("deliveryPartnerSno");
    const areaName = location.state?.areaName || new URLSearchParams(location.search).get("areaName");
    const [selectedQboxEntityName, setSelectedQboxEntityName] = useState('');
    const [selectedTransactionDate, setSelectedTransactionDate] = useState(transactionDate);
    const [selectedAreaName, setSelectedAreaName] = useState(areaName);
    const [filteredPurchaseOrders, setFilteredPurchaseOrders]: any = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleId, setRoleId] = useState<number | null>(null);
    const [deliveryPartnerName, setDeliveryPartnerName] = useState<number | null>(null);
    const [deliveryPartnerLogo, setDeliveryPartnerLogo] = useState<string | null>(null);
    const [roleName, setRoleName]: any = useState(null);
    console.log(filteredPurchaseOrders)
    const [isApply, setIsApply] = useState(true)
    const [refreshInterval, setRefreshInterval] = useState(20000); // 20 seconds default
    const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
    const [selectedOrderSno, setSelectedOrderSno] = useState<[string, string] | null>(null);
    const [selectedEntitySno, setSelectedEntitySno] = useState<[string, string] | null>(qboxEntitySno);
    const [selectedTransactionDates, setSelectedTransactionDates] = useState<[string, string] | null>(null);
    const date = new Date(selectedTransactionDate);
    const formattedDate = date.toISOString().split("T")[0].split("-").reverse().join("-");
    const [day, month, year] = formattedDate.split('-');
    const dateObj = new Date(`${year}-${month}-${day}`); // Use ISO format YYYY-MM-DD
    const shortMonth = dateObj.toLocaleString('default', { month: 'short' });
    const numericDay = dateObj.getDate();
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const [showInwardModal, setShowInwardModal] = useState(false);
    const [modalOrderSno, setModalOrderSno] = useState<any>(null);
    const [modalEntitySno, setModalEntitySno] = useState<any>(null);
    const [activeCard, setActiveCard] = useState<string | null>(null);


    type SkuInventoryItem = {
        skuInventorySno: string;
        uniqueCode: string;
        wfStageCd: string;
        // add other properties as needed
    };
    const [skuInventoryList, setSkuInventoryList] = useState<SkuInventoryItem[]>([]);
    const [skuStatusFilter, setSkuStatusFilter] = useState('all');

    type PurchaseOrderDtl = {
        restaurantSkuName: string;
        purchaseOrderSno: string;
        partnerFoodCode: string;
        orderQuantity: number;
        acceptedQuantity: number;
        purchaseOrderDtlSno: string;
        partnerPurchaseOrderId: string;
        undeliveredSalesCount: number;
    };
    const [purchaseOrderDtlList, setPurchaseOrderDtlList] = useState<PurchaseOrderDtl[]>([]);
    const [selectedSkuInventorySno, setSelectedSkuInventorySno] = useState<number | null>(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);


    const [skuPage, setSkuPage] = useState(1);
    const skuPageSize = 5; // Show 5 per page

    const paginatedSkuInventory = getFilteredData().slice(
        (skuPage - 1) * skuPageSize,
        skuPage * skuPageSize
    );

    const totalSkuPages = Math.ceil(getFilteredData().length / skuPageSize);

    const handleSkuPageChange = (newPage) => {
        setSkuPage(newPage);
    };

    const stageMap = {
        6: { label: 'Awaiting Delivery', color: 'text-yellow-600', icon: <Clock className="w-4 h-4" /> },
        8: { label: 'Rejected', color: 'text-red-600', icon: <AlertCircle className="w-4 h-4" /> },
        9: { label: 'Accepted', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> },
        10: { label: 'In Hot Box', color: 'text-orange-600', icon: <Box className="w-4 h-4" /> },
        11: { label: 'In QBox', color: 'text-blue-600', icon: <GridIcon className="w-4 h-4" /> },
        12: { label: 'Returned to Hot Box', color: 'text-purple-600', icon: <RefreshCw className="w-4 h-4" /> },
        13: { label: 'Outward Delivery', color: 'text-indigo-600', icon: <Truck className="w-4 h-4" /> },
    };

    const getStageInfo = (wfStageCd) => stageMap[Number(wfStageCd)] || { label: 'Unknown', color: 'text-gray-400', icon: <AlertCircle className="w-4 h-4" /> };




    useEffect(() => {
        dispatch(getAllQboxEntities({}));
        // dispatch(getAllDeliiveryPartner({}));
    }, []); // This runs only on mount

    useEffect(() => {
        if (qboxEntitySno && transactionDate) {
            dispatch(getPurchaseOrdersDashboard({ qboxEntitySno, transactionDate, deliveryPartnerSno }));
            dispatch(getSkuDashboardCounts({ qboxEntitySno, transactionDate, deliveryPartnerSno }));
            dispatch(getInwardOrderDetails({ qboxEntitySno, transactionDate }));
            dispatch(getUnSoldSkuLunchCounts({ qboxEntitySno, transactionDate, deliveryPartnerSno }));
            dispatch(getUnSoldSkuDinnerCounts({ qboxEntitySno, transactionDate, deliveryPartnerSno }));
            dispatch(getMostSoldCounts({ qboxEntitySno, transactionDate, deliveryPartnerSno }));
            dispatch(getBoxCellInventoryv2({ qboxEntitySno }));
            dispatch(getHotboxCountV2({ qboxEntitySno, transactionDate }));
            dispatch(getRejectSku({ qboxEntitySno, transactionDate, deliveryPartnerSno }))
            dispatch(getUserByQboxEntity({ qboxEntitySno }))

            // const selectedEntity = dashboardQboxEntityList.find(qbe => String(qbe.qboxEntitySno) === String(qboxEntitySno));
            // setSelectedQboxEntityName(selectedEntity ? selectedEntity.qboxEntityName : '');
            setSelectedQboxEntityName(qboxEntityName);

        }
    }, []);



    useEffect(() => {
        if (deliveryPartnerList.length > 0) {
            console.log(deliveryPartnerList); // Now it will log the updated list

            const deliveryPartner = deliveryPartnerList.find(dp =>
                String(dp.deliveryPartnerSno) === String(deliveryPartnerSno)
            );

            // Only set deliveryPartnerName if it's not already set
            if (!deliveryPartnerName && deliveryPartner) {
                setDeliveryPartnerName(deliveryPartner.partnerName);
            }
        }
    }, [deliveryPartnerList, deliveryPartnerSno]);

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
                console.log('loginDetail', loginDetails?.roleName)

                if (!roleId) {
                    throw new Error('Role ID is missing');
                }

                setRoleId(roleId);
                setRoleName(loginDetails?.roleName);
                setDeliveryPartnerName(loginDetails?.deliveryPartnerName)
                setDeliveryPartnerLogo(loginDetails?.logoUrl)
                console.log('deliveryPartnerName', loginDetails?.logoUrl)

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    const fetchData = useCallback(() => {
        if (filters.qboxEntitySno && filters.transactionDate) {
            // setFilters((prev) => ({ ...prev, transactionDate }));
            // setFilters((prev) => ({ ...prev, qboxEntitySno }));
            // setFilters((prev) => ({ ...prev, deliveryPartnerSno }));
            // Dispatch with entitySnoInwardOrders
            dispatch(getPurchaseOrdersDashboard({
                qboxEntitySno: filters.qboxEntitySno,
                transactionDate: filters.transactionDate,
                deliveryPartnerSno: deliveryPartnerSno,
                isRefresh: true // Add this flag to differentiate refresh calls
            }));
            dispatch(getSkuDashboardCounts({
                qboxEntitySno: filters.qboxEntitySno,
                transactionDate: filters.transactionDate,
                deliveryPartnerSno: deliveryPartnerSno,
                isRefresh: true // Add this flag to differentiate refresh calls
            }));
            dispatch(getUnSoldSkuLunchCounts({
                qboxEntitySno: filters.qboxEntitySno,
                transactionDate: filters.transactionDate,
                deliveryPartnerSno: deliveryPartnerSno
            }));
            dispatch(getUnSoldSkuDinnerCounts({
                qboxEntitySno: filters.qboxEntitySno,
                transactionDate: filters.transactionDate,
                deliveryPartnerSno: deliveryPartnerSno,
                isRefresh: true // Add this flag to differentiate refresh calls
            }));
            dispatch(getMostSoldCounts({
                qboxEntitySno: filters.qboxEntitySno,
                transactionDate: filters.transactionDate,
                deliveryPartnerSno: deliveryPartnerSno,
                isRefresh: true // Add this flag to differentiate refresh calls
            }));
            dispatch(getRejectSku({
                qboxEntitySno: filters.qboxEntitySno,
                transactionDate: filters.transactionDate,
                deliveryPartnerSno: deliveryPartnerSno,
                isRefresh: true // Add this flag to differentiate refresh calls
            }));
            // dispatch(searchPurchaseOrder({
            //     qboxEntitySno: filters.qboxEntitySno,
            //     transactionDate: filters.transactionDate,
            // }));
            dispatch(getInwardOrderDetails({
                qboxEntitySno: filters.qboxEntitySno,
                transactionDate: filters.transactionDate,
                deliveryPartnerSno: deliveryPartnerSno,
                isRefresh: true // Add this flag to differentiate refresh calls
            }));
            dispatch(getHotboxCountV2({
                qboxEntitySno: filters.qboxEntitySno,
                transactionDate: filters.transactionDate,
                deliveryPartnerSno: deliveryPartnerSno,
                isRefresh: true // Add this flag to differentiate refresh calls
            }));
            dispatch(getBoxCellInventoryv2({
                qboxEntitySno: filters.qboxEntitySno,
                isRefresh: true // Add this flag to differentiate refresh calls
            }));
        }
        // const selectedEntity = dashboardQboxEntityList.find(qbe => String(qbe.qboxEntitySno) === String(qboxEntitySno));
        // setSelectedQboxEntityName(selectedEntity ? selectedEntity.qboxEntityName : '');
    }, [filters, dispatch]);

    // Set up auto-refresh
    useEffect(() => {
        if (!isAutoRefreshEnabled) return;

        const intervalId = setInterval(() => {
            fetchData();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [fetchData, refreshInterval, isAutoRefreshEnabled]);

    // Modify your existing useEffect to use fetchData
    useEffect(() => {
        dispatch(getAllQboxEntities({}));
        if (qboxEntitySno && transactionDate) {
            setFilters((prev) => ({
                ...prev,
                transactionDate,
                qboxEntitySno
            }));
            fetchData();
        }
        dispatch(getAllDeliiveryPartner({}));
    }, []);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((prev) => {
            const updatedFilters = {
                ...prev,
                [name]: value,
                ...(name === 'qboxEntitySno' && {
                    qboxEntitySno: value,
                    deliveryPartnerSno: '',
                    transactionDate: '',
                }),
            };

            return updatedFilters;
        });
    };

    const applyFilters = () => {
        setIsApply(true);

        // Extract deliveryPartnerSno from location.state
        const deliveryPartnerSnoFromLocation =
            location.state?.deliveryPartnerSno ||
            new URLSearchParams(location.search).get("deliveryPartnerSno") ||
            "";

        setFilters((prev) => {
            const { qboxEntitySno, transactionDate } = prev;

            // Only proceed if at least transactionDate is provided
            if (!transactionDate) {
                console.warn("Transaction date is required to apply filters.");
                return prev; // Return previous state without modifying
            }

            // Update selectedQboxEntityName only if a valid qboxEntitySno is selected
            if (qboxEntitySno && qboxEntityList?.length > 0) {
                const selectedEntity = qboxEntityList.find(
                    (qbe) => String(qbe.qboxEntitySno) === String(qboxEntitySno)
                );
                if (selectedEntity) {
                    setSelectedQboxEntityName(selectedEntity.qboxEntityName);
                    setSelectedEntitySno(selectedEntity.qboxEntitySno);
                    setSelectedAreaName(selectedEntity.areaName);

                } else {
                    // Fallback to existing selectedQboxEntityName or qboxEntityName
                    setSelectedQboxEntityName(selectedQboxEntityName || qboxEntityName || 'Unknown Location');
                }
            } else {
                // Preserve existing selectedQboxEntityName if no qboxEntitySno is selected
                setSelectedQboxEntityName(selectedQboxEntityName || qboxEntityName || 'Unknown Location');
            }

            if (transactionDate) {
                setSelectedTransactionDate(transactionDate);
            }

            // Process filters
            const processedFilters = {
                ...prev,
                deliveryPartnerSno: deliveryPartnerSnoFromLocation,
            };

            // Remove empty values
            Object.keys(processedFilters).forEach(
                (key) => processedFilters[key] === "" && delete processedFilters[key]
            );

            console.log("Applying Filters:", processedFilters);

            // Dispatch actions with the final filters
            dispatch(getPurchaseOrdersDashboard(processedFilters));
            dispatch(getSkuDashboardCounts(processedFilters));
            dispatch(getBoxCellInventoryv2(processedFilters));
            dispatch(getHotboxCountV2(processedFilters));
            dispatch(getEntityInfraPropertiesV2(processedFilters));
            dispatch(getRejectSku(processedFilters));
            dispatch(getMostSoldCounts(processedFilters));
            dispatch(getUnSoldSkuLunchCounts(processedFilters));
            dispatch(getUnSoldSkuDinnerCounts(processedFilters));
            dispatch(getInwardOrderDetails(processedFilters));

            return prev; // Return the state unchanged
        });
    };

    const qBoxConfigurations = getBoxCellInventoryList?.qboxInventory?.qBoxNumber;
    // Group qboxes by their EntityInfraSno
    const groupedQBoxes = getBoxCellInventoryList?.qboxInventory?.qboxes?.reduce((acc, qbox) => {
        if (!acc[qbox.EntityInfraSno]) {
            acc[qbox.EntityInfraSno] = [];
        }
        acc[qbox.EntityInfraSno].push(qbox);
        return acc;
    }, {});

    const renderInfraIcon = (icon) => {
        const IconComponent = iconMap[icon] || QBoxIcon;
        return <IconComponent className="text-color w-6 h-6" />;
    };

    const handleView = async (orderSno, qboxEntitySno, purchaseOrderSno) => {
        setModalOrderSno(orderSno);
        setModalEntitySno(qboxEntitySno);
        setShowInwardModal(true);

        // 1. Fetch Purchase Order Details
        try {
            const poDtlResponse = await dispatch(
                searchPurchaseOrderDtl({ qboxEntitySno, purchaseOrderSno })
            ).unwrap();
            const poDtlList = poDtlResponse || [];
            setPurchaseOrderDtlList(poDtlList);

            // 2. Get purchaseOrderDtlSno from the result and fetch SKU inventory
            if (poDtlList.length > 0) {
                const purchaseOrderDtlSno = poDtlList[0].purchaseOrderDtlSno;
                try {
                    const skuResponse = await dispatch(searchSkuInventory({ purchaseOrderDtlSno })).unwrap();
                    setSkuInventoryList(skuResponse || []);
                } catch (e) {
                    setSkuInventoryList([]);
                }
            } else {
                setSkuInventoryList([]);
            }
        } catch (e) {
            setPurchaseOrderDtlList([]);
            setSkuInventoryList([]);
        }

        setSkuStatusFilter('all');
    };


    // const handleCardClick = (filteredList: any) => {
    //     try {
    //         if (filteredList) {
    //             setIsApply(false)
    //             setFilteredPurchaseOrders(filteredList);
    //         }
    //     } catch (error) {
    //         console.error("Error in handleView:", error);
    //     }
    // };

    const handleCardClick = (type: string, filteredList: any) => {
        try {
            setActiveCard(type);
            setIsApply(false);
            setFilteredPurchaseOrders(filteredList);
        } catch (error) {
            console.error("Error in handleCardClick:", error);
        }
    };

    const restaurantNames = [...new Set(skuDashboardCountList.map(item => item.restaurantName))];
    const columnsPerRestaurant = 4;

    function getFilteredData() {
        if (skuStatusFilter === 'all') {
            return skuInventoryList;
        }
        // Map status filter values to wfStageCd values
        const statusMap: Record<string, number[]> = {
            awaitingDelivery: [6],
            delivered: [7],
            rejected: [8],
            accepted: [9],
            inHotBox: [10],
            inQbox: [11],
            returnedToHotBox: [12],
            outwardDelivery: [13],
        };
        const wfStageCds = statusMap[skuStatusFilter] || [];
        return skuInventoryList.filter(item => wfStageCds.includes(Number(item.wfStageCd)));
    }

    const handleAcceptSKU = async (skuInventorySno: any, purchaseOrderDtlSno: any) => {
        try {
            // Dispatch acceptSku action
            await dispatch(acceptSku({ skuInventorySno })).unwrap();

            // Once acceptSku is successful, dispatch searchSkuInventory
            const response = await dispatch(searchSkuInventory({ purchaseOrderDtlSno })).unwrap();
            setSkuInventoryList(response || []);
        } catch (error) {
            console.error("Error occurred while processing SKU:", error);
        }
    };

    const handleRejectSKU = async (skuInventorySno: any, purchaseOrderDtlSno: any, purchaseOrderSno: any) => {
        try {
            // Dispatch rejectSku action
            await dispatch(rejectSku({ skuInventorySno, purchaseOrderSno }));

            // Once rejectSku is successful, dispatch searchSkuInventory
            const response = await dispatch(searchSkuInventory({ purchaseOrderDtlSno })).unwrap();
            setSkuInventoryList(response || []);
        } catch (error) {
            console.error("Error occurred while processing SKU:", error);
        }
    }

    const getStatusIcon = (wfStageCd) => {
        const iconProps = { size: 16, className: "mr-2" };
        switch (wfStageCd) {
            case 6: return <ShoppingBag {...iconProps} className="text-yellow-600 mr-1" />;
            case 7: return <Timer {...iconProps} className="text-blue-600 mr-1" />;
            case 8: return <XCircle {...iconProps} className="text-color mr-1" />;
            case 9: return <CheckCircle {...iconProps} className="text-green-600 mr-1" />;
            case 10: return <Flame {...iconProps} className="text-orange-600 mr-1" />;
            case 11: return <Box {...iconProps} className="text-purple-600 mr-1" />;
            case 12: return <RotateCcw {...iconProps} className="text-indigo-600 mr-1" />;
            case 13: return <Truck {...iconProps} className="text-teal-600 mr-1" />;
            default: return null;
        }
    };

    const statusMap = {
        6: "awaitingDelivery",
        7: "delivered",
        8: "rejected",
        // 9: "Accepted",
        10: "inHotBox",
        11: "inQbox",
        12: "returnedToHotBox",
        13: "outwardDelivery",
        20: "outwardDelivery"
    };

    // Initialize counts
    const statusCounts = {
        "all": 0,
        "awaitingDelivery": 0,
        "delivered": 0,
        "rejected": 0,
        // "Accepted": 0,
        "inQbox": 0,
        "inHotBox": 0,
        "returnedToHotBox": 0,
        "outwardDelivery": 0
    };

    // Loop through the inventory list and count by status
    skuInventoryList.forEach(item => {
        const status = statusMap[item.wfStageCd];
        if (status) {
            statusCounts[status]++;
            statusCounts.all++;
        }
    });

    const statusDisplayNames = {
        awaitingDelivery: "Awaiting Delivery",
        delivered: "Delivered",
        rejected: "Rejected",
        inHotBox: "In Inventory Box",
        inQbox: "In QBox",
        returnedToHotBox: "Returned to Inventory Box",
        outwardDelivery: "Customer Delivery",
        all: "Total Sku's" // Optional if you include "all"
    };


    const SkuTrackingModal = ({ isOpen, onClose, skuInventorySno }) => {
        const dispatch = useDispatch<AppDispatch>();
        const { skuTraceWfList } = useSelector((state: RootState) => state.supplyChain);
        const [processingTime, setProcessingTime] = useState("");

        // Fetch tracking data when modal opens
        // useEffect(() => {
        //     if (isOpen && skuInventorySno) {
        //         dispatch(searchSkuTraceWf({ skuInventorySno }));
        //     }
        // }, [isOpen, skuInventorySno, dispatch]);

        // Calculate processing time
        useEffect(() => {
            if (skuTraceWfList?.length > 0) {
                const timestamps = skuTraceWfList
                    .map(event => new Date(event.actionTime ?? "").getTime())
                    .filter(time => !isNaN(time));

                if (timestamps.length > 0) {
                    const minTime = Math.min(...timestamps);
                    const maxTime = Math.max(...timestamps);
                    const processingTimeMs = maxTime - minTime;
                    const hours = Math.floor(processingTimeMs / (1000 * 60 * 60));
                    const minutes = Math.floor((processingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
                    setProcessingTime(`${hours}h ${minutes}m`);
                }
            }
        }, [skuTraceWfList]);

        // Stage icon mapping
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
        const completedStages = skuTraceWfList?.filter((stage) => stage.actionTime).length || 0;

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                        {/* Header */}
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex justify-between items-start mb-6 flex-wrap">
                                <div className="flex items-start gap-3 flex-1">
                                    <div>
                                        {/* Header with icon */}
                                        <div className="p-2 rounded-lg flex items-center mb-2">
                                            <PackageSearch className="w-5 h-5 text-color mr-2" />
                                            <h3 className="text-lg font-semibold text-gray-900">SKU Tracking Details</h3>
                                        </div>

                                        {/* Two columns: Left and Right */}
                                        <div className="flex flex-wrap gap-12">
                                            {/* Left Section */}
                                            <div className="space-y-1">
                                                <div>
                                                    <span className="text-xs text-gray-500">Order ID:</span>
                                                    <span className="ml-2 font-semibold text-lg text-color">
                                                        {skuTraceWfList?.[0]?.purchaseOrderId || "N/A"}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="text-xs text-gray-500">Unique Code:</span>
                                                    <span className="ml-2 font-mono text-sm text-color">
                                                        {skuTraceWfList?.[0]?.uniqueCode || "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right Section */}
                                            {skuTraceWfList?.some(item => item.wfStageCd === 13) && (
                                                <div className="flex justify-end">
                                                    <div className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200 text-right w-fit">
                                                        <div>
                                                            <span className="text-xs text-gray-500">Customer Order ID:</span>
                                                            <span className="ml-2 font-semibold text-lg text-color">
                                                                {
                                                                    skuTraceWfList.find(item => item.wfStageCd === 13)?.customerOrderID || "N/A"
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="low-bg-color rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-color" size={20} />
                                        <div>
                                            <div className="text-lg font-bold text-color">{processingTime || "N/A"}</div>
                                            <div className="text-xs text-gray-600">Processing Time</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="low-bg-color rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="text-color" size={20} />
                                        <div>
                                            <div className="text-lg font-bold text-color">
                                                {skuTraceWfList?.[skuTraceWfList.length - 1]?.codesDtl1description || "N/A"}
                                            </div>
                                            <div className="text-xs text-gray-600">Current Status</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                                {skuTraceWfList?.map((stage, index) => {
                                    const Icon = stageIconMap[stage.wfStageCd] || AlertCircle;
                                    return (
                                        <div key={stage.skuTraceWfSno} className="relative">
                                            {index !== 0 && (
                                                <div className="absolute h-full w-px bg-gray-200 left-6 top-0 -translate-x-1/2" />
                                            )}
                                            <div className="flex gap-4 items-start relative z-10">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                        ${stage.actionTime ? 'bg-color text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-medium text-gray-900">
                                                            {stage.codesDtl1description || "No Description"}
                                                        </h4>
                                                        <span className="text-sm text-gray-500">
                                                            <DateTime
                                                                date={stage.actionTime}
                                                                showDateIcon={false}
                                                                showTimeIcon={false}
                                                                color='gray'
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
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`${isHovered ? 'pl-32' : 'pl-16'} pr-14 p-12 bg-gradient-to-br from-gray-50 to-white min-h-screen`}>
            <RefreshIndicator isRefreshing={refreshing} />
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 low-bg-color rounded-xl">
                            <Leaf className="w-6 h-6 text-color" />
                        </div>
                        <div className="flex flex-col justify-between">
                            {/* Top: Delivery Location */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {selectedQboxEntityName} <span className="text-color">Delivery Location</span><span className='pl-1'>({selectedAreaName})</span>
                                </h1>
                                <p className="text-gray-600 text-sm">Monitor and manage your delivery hubs</p>
                            </div>
                        </div>
                    </div>
                    {/* Right Section: Large Date Display */}
                    <div className="flex gap-6 items-center">
                        {/* Delivery Partner Card */}
                        <div className="p-2 custom-gradient-right rounded-2xl border border-white/20 shadow-lg flex items-center w-full max-w-md">
                            <div className="w-16 h-16 mr-6 rounded-full bg-white/20 flex items-center justify-center">
                                <img
                                    src={deliveryPartnerLogo ?? "/assets/images/logo.png"}
                                    alt="Logo"
                                    className="h-14 w-14 object-cover rounded-full border-4 border-white"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/assets/images/logo.png";
                                    }}
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-white uppercase tracking-wide truncate w-32 sm:w-40 md:w-48">{deliveryPartnerName}</h4>
                            </div>
                        </div>

                        {/* Date Card */}
                        <div className="max-w-sm w-full">
                            {/* <h2 className="text-2xl sm:text-3xl  font-extrabold text-color tracking-wide truncate">{formattedDate}</h2> */}
                            <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-fit">
                                <div className="bg-color text-white px-4 py-3 flex flex-col items-center justify-center">
                                    <div className="text-sm uppercase tracking-wide">{shortMonth}</div>
                                    <div className="text-2xl font-bold leading-none">{numericDay}</div>
                                </div>

                                <div className="px-5 py-3 flex flex-col justify-center">
                                    <span className="text-xs text-gray-400 uppercase">Date</span>
                                    <span className="text-lg font-medium text-gray-800">{formattedDate}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={toggleFilter}
                            className={`p-2 rounded-lg transition-all duration-200 ${isFilterVisible
                                ? 'bg-color text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>

                    </div>

                </div>

                {/* Search and Filter Bar */}
                {/* {activeTab === 'allInwardOrders' && (
                    
                )} */}

                <AnimatePresence>
                    {isFilterVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-8"
                        >
                            <>
                                <div className="flex flex-wrap gap-4 mb-8 float-end">
                                    <select
                                        name="qboxEntitySno"
                                        value={filters.qboxEntitySno}
                                        onChange={handleFilterChange}
                                        className="w-64 px-4 py-2.5 bg-white/70 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500/20"
                                    >
                                        <option value="">Select Delivery Location</option>
                                        <option value="all">All Delivery Location</option>
                                        {qboxEntityList?.map((qbe) => (
                                            <option key={qbe.qboxEntitySno} value={qbe.qboxEntitySno}>
                                                {qbe.qboxEntityName}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        name="transactionDate"
                                        value={filters.transactionDate}
                                        onChange={handleFilterChange}
                                        className="w-48 px-4 py-2.5 bg-white/70 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500/20"
                                    />

                                    <button
                                        onClick={applyFilters}
                                        className={`px-6 py-2.5 rounded-lg transition-colors ${filters.qboxEntitySno && filters.transactionDate ? 'bg-color text-white hover:bg-color' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                                        disabled={!filters.qboxEntitySno || !filters.transactionDate}
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                                <div className='h-20'></div>
                                {/* Stats Overview */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* All Orders Card */}
                                    <MasterCard
                                        onClick={() => handleCardClick("all", purchaseOrdersDashboardList)}
                                        className={clsx(
                                            "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer",
                                            activeCard === "all" && "ring-2 ring-blue-500 bg-white"
                                        )}
                                    >
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start">
                                                {/* Left: Title + Count */}
                                                <div>
                                                    <p className="text-sm text-blue-600">Total Purchase Orders</p>
                                                    <p className="text-2xl font-bold text-gray-800 mt-1 flex items-baseline gap-1">
                                                        <span className="text-3xl font-extrabold text-gray-900">
                                                            {purchaseOrdersDashboardList.length}
                                                        </span>
                                                        <span className="text-base font-medium text-gray-500">
                                                            Orders
                                                        </span>
                                                    </p>
                                                </div>
                                                {/* Right: SKU Count Box */}
                                                <div className="flex flex-col items-center justify-center bg-blue-100 text-black-600 px-3 py-2 rounded-md shadow-sm">
                                                    <p className="text-xs font-medium">SKUs</p>
                                                    <p className="text-lg font-bold">
                                                        {purchaseOrdersDashboardList[0]?.totalSkuCount || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </MasterCard>

                                    {/* Fulfilled */}
                                    <MasterCard
                                        onClick={() =>
                                            handleCardClick("green", purchaseOrdersDashboardList?.filter(l => l.statusColor === "Green"))
                                        }
                                        className={clsx(
                                            "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer",
                                            activeCard === "green" && "ring-2 ring-emerald-500 bg-white"
                                        )}
                                    >
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start">
                                                {/* Left: Title + Count */}
                                                <div>
                                                    <p className="text-sm text-green-600">Order Fulfilled</p>
                                                    <p className="text-2xl font-bold text-gray-800 mt-1 flex items-baseline gap-1">
                                                        <span className="text-3xl font-extrabold text-gray-900">
                                                            {purchaseOrdersDashboardList?.filter(l => l.statusColor === "Green").length}
                                                        </span>
                                                        <span className="text-base font-medium text-gray-500">
                                                            Orders
                                                        </span>
                                                    </p>
                                                </div>
                                                {/* Right: SKU Count Box */}
                                                <div className="flex flex-col items-center justify-center bg-green-100 text-black-600 px-3 py-2 rounded-md shadow-sm">
                                                    <p className="text-xs font-medium">SKUs</p>
                                                    <p className="text-lg font-bold">
                                                        {purchaseOrdersDashboardList[0]?.totalFulfilledCount || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </MasterCard>

                                    {/* Not Processed */}
                                    <MasterCard
                                        onClick={() =>
                                            handleCardClick("grey", purchaseOrdersDashboardList?.filter(l => l.statusColor === "Grey"))
                                        }
                                        className={clsx(
                                            "bg-gradient-to-br from-gray-100 to-gray-300 border border-gray-400 hover:shadow-md transition-all duration-300 cursor-pointer",
                                            activeCard === "grey" && "ring-2 ring-gray-600 bg-white"
                                        )}
                                    >
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-center">
                                                {/* Left: Title + Count */}
                                                <div>
                                                    <p className="text-sm text-grey-600">Awaiting Delivery</p>
                                                    <p className="text-2xl font-bold text-gray-800 mt-1 flex items-baseline gap-1">
                                                        <span className="text-3xl font-extrabold text-gray-900">
                                                            {purchaseOrdersDashboardList?.filter(l => l.statusColor === "Grey").length}
                                                        </span>
                                                        <span className="text-base font-medium text-gray-500">
                                                            Orders
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* Right: SKU Count Box */}
                                                <div className="flex flex-col items-center justify-center bg-black-100 text-grey-600 px-3 py-2 rounded-md shadow-sm">
                                                    <p className="text-xs font-medium">SKUs</p>
                                                    <p className="text-lg font-bold">
                                                        {purchaseOrdersDashboardList[0]?.totalAwaitingDeliveryCount || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </MasterCard>

                                    {/* Rejected */}
                                    <MasterCard
                                        className={clsx(
                                            "bg-gradient-to-br from-red-50 to-rose-50 border-red-300 border border-red-400 hover:shadow-md transition-all duration-300 cursor-pointer",
                                            activeCard === "red" && "ring-2 ring-red-400 bg-white"
                                        )}
                                        onClick={() =>
                                            handleCardClick("red", purchaseOrdersDashboardList?.filter(l => l.statusColor === "Red"))
                                        }
                                    >
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-center">
                                                {/* Left: Title + Count */}
                                                <div>
                                                    <p className="text-sm text-red-600">Rejected Skus's</p>
                                                    <p className="text-2xl font-bold text-gray-800 mt-1 flex items-baseline gap-1">
                                                        <span className="text-3xl font-extrabold text-gray-900">
                                                            {purchaseOrdersDashboardList?.filter(l => l.statusColor === "Red").length}
                                                        </span>
                                                        <span className="text-base font-medium text-gray-500">
                                                            Orders
                                                        </span>
                                                    </p>
                                                </div>

                                                {/* Right: SKU Count Box */}
                                                <div className="flex flex-col items-center justify-center bg-black-100 text-red-600 px-3 py-2 rounded-md shadow-sm">
                                                    <p className="text-xs font-medium">SKUs</p>
                                                    <p className="text-lg font-bold">
                                                        {purchaseOrdersDashboardList[0]?.totalRejectedSkuCount || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </MasterCard>
                                </div>
                            </>

                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('allInwardOrders')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'allInwardOrders'
                                    ? 'border-color text-color'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 Inward Ordershover:border-gray-300'
                                    }`}
                            >
                                <Truck className="w-4 h-4" />
                                Purchase Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('qboxInventory')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'qboxInventory'
                                    ? 'border-color text-color'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <ClipboardList className="w-4 h-4" />
                                QBox
                            </button>
                            <button
                                onClick={() => setActiveTab('inventoryBox')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'inventoryBox'
                                    ? 'border-color text-color'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <GridIcon className="w-4 h-4" />
                                Inventory Box
                            </button>
                            <button
                                onClick={() => setActiveTab('menuDetails')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'menuDetails'
                                    ? 'border-color text-color'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <MenuIcon className="w-4 h-4" />
                                Restaurant Orders
                            </button>

                            <button
                                onClick={() => setActiveTab('rejectSkuList')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'rejectSkuList'
                                    ? 'border-color text-color'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <AlertCircle className="w-4 h-4" />
                                Reject Sku Details
                            </button>
                            <button
                                onClick={() => setActiveTab('mostSoldSkuCounts')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'mostSoldSkuCounts'
                                    ? 'border-color text-color'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Sales Details
                            </button>
                            <button
                                onClick={() => setActiveTab('outwardOrder')}
                                className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm ${activeTab === 'outwardOrder'
                                    ? 'border-color text-color'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Delivered
                            </button>

                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "allInwardOrders" && !isDetailView && (
                    <PurchaseOrderDtl
                        purchaseOrdersDashboardList={!isApply ? filteredPurchaseOrders : purchaseOrdersDashboardList}
                        handleView={handleView}
                    />
                )}

                {activeTab === "menuDetails" && (
                    <QBoxMenuDtl
                        restaurantNames={restaurantNames as string[]}
                        skuDashboardCountList={skuDashboardCountList}
                    />
                )}

                {activeTab === "qboxInventory" && (
                    <QBoxInventoryDtl qBoxConfigurations={qBoxConfigurations} groupedQBoxes={groupedQBoxes} />
                )}

                {activeTab === "inventoryBox" && (
                    <InventoryBoxDtl
                        purchaseOrdersDashboardList={purchaseOrdersDashboardList}
                        getHotboxCountList={getHotboxCountList}
                    />
                )}

                {activeTab === "mostSoldSkuCounts" && (
                    <SalersDetails
                        mostSoldCountsList={mostSoldCountsList}
                        unSoldSkuLunchList={unSoldSkuLunchList}
                        unSoldSkuDinnerList={unSoldSkuDinnerList} />
                )}

                {activeTab === 'purchaseOrderDtl' && (
                    <>
                        <InwardOrders
                            partnerPurchaseOrderId={selectedOrderSno}
                            qboxEntitySno={selectedEntitySno}
                            transactionDate={selectedTransactionDate}
                            inwardOrderDetailList={inwardOrderDetailList}
                            deliveryPartnerSno={deliveryPartnerSno}
                        />
                    </>
                )}

                {activeTab === "rejectSkuList" &&
                    <RejectSkuDtl rejectSkuList={rejectSkuList} />}

                {activeTab === 'outwardOrder' && (
                    <OutwardOrders qboxEntitySno={selectedEntitySno}
                        // setSkuInventorySno={setSkuInventorySno}
                        setActiveTab={setActiveTab}
                        orderedTime={selectedTransactionDate} />
                )}
            </div>

            {showInwardModal && (
                <Dialog open={showInwardModal} onOpenChange={setShowInwardModal}>
                    <DialogContent className="w-full min-w-[1000px] max-h-[90vh] overflow-y-auto p-0">
                        <div className="flex flex-col">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center px-6 pt-6 pb-3 border-b ">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Box className="w-7 h-7 text-color" />
                                    <div className='text-color'>Purchase Order Details</div>
                                </h2>
                                <button
                                    onClick={() => setShowInwardModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto flex justify-center">
                                <div className="w-full max-w-4xl">
                                    {/* 1. Basic Order Details */}
                                    {purchaseOrderDtlList?.length > 0 ? (
                                        <div className="flex flex-col lg:flex-row justify-between gap-6 p-6 border rounded-xl shadow-md bg-white mb-6">
                                            {/* Left Side: Food Details + Status */}
                                            <div>
                                                {/* Top Section: Image + Info */}
                                                <div className="flex gap-4 items-start justify-between pb-3">
                                                    {/* Food Image */}
                                                    <div className='flex items-center space-x-3'>
                                                        <img
                                                            src="https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.jpg"
                                                            alt="Food"
                                                            className="w-28 h-28 rounded-xl object-cover border shadow-sm"
                                                        />

                                                        {/* Details */}
                                                        <div className="flex flex-col gap-2 flex-1">
                                                            <h3 className="text-lg font-bold text-color">
                                                                {purchaseOrderDtlList[0].restaurantSkuName}
                                                            </h3>
                                                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-700">
                                                                <div>
                                                                    <span className="font-semibold">Order ID:</span> {purchaseOrderDtlList[0].partnerPurchaseOrderId}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">SKU Code:</span> {purchaseOrderDtlList[0].partnerFoodCode}
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Quantity:</span> {purchaseOrderDtlList[0].orderQuantity}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Awaiting Delivery Card - Right Side */}
                                                    {purchaseOrderDtlList[0].undeliveredSalesCount > 0 && (
                                                        <div className="flex flex-col items-center justify-center p-4 low-bg-color rounded-lg border border-color shadow-sm min-w-[100px]">
                                                            <div className="text-sm font-medium text-color mb-1">Awaiting Customer Delivery</div>
                                                            <div className="text-3xl font-bold text-color">
                                                                {purchaseOrderDtlList[0].undeliveredSalesCount || 0}
                                                            </div>
                                                            {/* <div className="text-xs text-blue-500 mt-1">Undelivered Orders</div> */}
                                                            {purchaseOrderDtlList[0].undeliveredSalesCount > 0 && (
                                                                <div className="mt-2 text-xs text-color text-center">
                                                                    {purchaseOrderDtlList[0].undeliveredSalesCount} orders waiting
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Status Counts Under Image Section */}
                                                <div className="grid grid-cols-8 gap-2 text-center text-sm text-gray-700 w-full">
                                                    {Object.entries(statusCounts).map(([label, count], index) => {
                                                        const isActive = skuStatusFilter === label || (label === 'all' && skuStatusFilter === 'all');

                                                        return (
                                                            <div
                                                                key={index}
                                                                onClick={() => { setSkuStatusFilter(label); setSkuPage(1); }}
                                                                className={`cursor-pointer rounded-md px-2 py-1 shadow-sm border transition-all
                                                                               ${isActive ? 'bg-color text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                                            >
                                                                <div className="text-lg font-bold">{count}</div>
                                                                <div className="text-xs font-medium">
                                                                    {statusDisplayNames[label] || label}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 mb-6">Order details not found.</div>
                                    )}
                                    {/* 3. SKU Inventory Table */}
                                    <div className="overflow-x-auto rounded-lg shadow border">
                                        <table className="min-w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    {/* <th className="px-3 py-2 border-b">SKU SNo</th> */}
                                                    <th className="px-3 py-2 border-b">Unique Code</th>
                                                    <th className="px-3 py-2 border-b">Stage</th>
                                                    <th className="px-3 py-2 border-b">Track SKU</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedSkuInventory.length > 0 ? paginatedSkuInventory.map(item => {
                                                    const stage = getStageInfo(item.wfStageCd);

                                                    return (
                                                        <tr key={item.skuInventorySno} className="hover:bg-blue-50 transition">
                                                            {/* <td className="px-3 py-2 border-b">{item.skuInventorySno}</td> */}
                                                            <td className="px-3 py-2 border-b">{item.uniqueCode}</td>
                                                            <td className="px-3 py-2 border-b">
                                                                <div className="flex items-center">
                                                                    {/* {getStatusIcon(item.wfStageCd)} */}
                                                                    {Number(item.wfStageCd) === 7 ? (
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleAcceptSKU(item.skuInventorySno, purchaseOrderDtlList[0].purchaseOrderDtlSno)
                                                                                }
                                                                                className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-flex items-center"
                                                                            >
                                                                                <Box size={14} className="mr-1" />
                                                                                Accept & Move
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleRejectSKU(item.skuInventorySno, purchaseOrderDtlList[0].purchaseOrderDtlSno, purchaseOrderDtlList[0].purchaseOrderSno)
                                                                                }
                                                                                className="px-3 py-1.5 text-sm font-medium text-color hover:low-bg-color rounded-lg transition-colors inline-flex items-center"
                                                                            >
                                                                                <AlertCircle size={14} className="mr-1" />
                                                                                Reject
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <span
                                                                            className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium
                                                                                               ${Number(item.wfStageCd) === 6 ? 'bg-yellow-200 text-yellow-700' : ''}
                                                                                               ${Number(item.wfStageCd) === 8 ? 'bg-red-200 text-red-700' : ''}
                                                                                               ${Number(item.wfStageCd) === 9 ? 'bg-green-200 text-green-700' : ''}
                                                                                               ${Number(item.wfStageCd) === 10 ? 'bg-orange-200 text-orange-700' : ''}
                                                                                               ${Number(item.wfStageCd) === 11 ? 'bg-purple-200 text-purple-700' : ''}
                                                                                               ${Number(item.wfStageCd) === 12 ? 'bg-indigo-200 text-indigo-700' : ''}
                                                                                               ${Number(item.wfStageCd) === 13 ? 'bg-teal-200 text-teal-700' : ''}
                                                                                           `}>
                                                                            {getStatusIcon(item.wfStageCd)}
                                                                            {Number(item.wfStageCd) === 6 && 'Awaiting Delivery'}
                                                                            {Number(item.wfStageCd) === 8 && 'Rejected'}
                                                                            {Number(item.wfStageCd) === 9 && 'Accepted'}
                                                                            {Number(item.wfStageCd) === 10 && 'In Inventory Box'}
                                                                            {Number(item.wfStageCd) === 11 && 'In QBox'}
                                                                            {Number(item.wfStageCd) === 12 && 'Returned to Inventory Box'}
                                                                            {Number(item.wfStageCd) === 13 && 'Customer Delivery'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <button
                                                                    onClick={async () => {
                                                                        setSelectedSkuInventorySno(Number(item.skuInventorySno));
                                                                        // Call searchSkuTraceWf before opening modal
                                                                        await dispatch(searchSkuTraceWf({ skuInventorySno: item.skuInventorySno }));
                                                                        setShowTrackingModal(true);
                                                                    }}
                                                                    className="px-3 py-1.5 text-sm text-white bg-color rounded-md hover:low-bg-color transition-colors duration-200 flex items-center justify-center gap-2"
                                                                >
                                                                    <PackageSearch className="h-4 w-4" />
                                                                    <span>Track SKU</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }) : (
                                                    <tr>
                                                        <td colSpan={4} className="text-center text-gray-400 py-4">
                                                            <div className="flex flex-col items-center justify-center text-center py-10">
                                                                <img
                                                                    src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" // A better "empty box" icon
                                                                    alt="No SKU Found"
                                                                    className="w-24 h-24 opacity-50"
                                                                />
                                                                <p className="text-lg font-semibold text-gray-600 mt-4">No SKU Found</p>
                                                                <p className="text-sm text-gray-500">There are no SKUs available for the selected criteria.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 4. Pagination */}
                                    {totalSkuPages > 1 && (
                                        <div className="flex justify-end items-center gap-2 mt-4">
                                            <button
                                                onClick={() => handleSkuPageChange(skuPage - 1)}
                                                disabled={skuPage === 1}
                                                className="px-2 py-1 rounded border bg-white text-gray-700 disabled:opacity-50 text-xs"
                                            >
                                                Prev
                                            </button>
                                            <span className="text-gray-700 font-medium text-xs">
                                                Page {skuPage} of {totalSkuPages}
                                            </span>
                                            <button
                                                onClick={() => handleSkuPageChange(skuPage + 1)}
                                                disabled={skuPage === totalSkuPages}
                                                className="px-2 py-1 rounded border bg-white text-gray-700 disabled:opacity-50 text-xs"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {showTrackingModal && (
                <SkuTrackingModal
                    isOpen={showTrackingModal}
                    onClose={() => {
                        setShowTrackingModal(false);
                        setSelectedSkuInventorySno(null);
                    }}
                    skuInventorySno={selectedSkuInventorySno}
                />
            )}

        </div >
    );
};

export default AggregatorAdminDashboard;





















