import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Save, Trash2, RotateCcw, XCircle, Pencil, MonitorCogIcon, AlertCircle, Camera, BatteryCharging, Scan } from 'lucide-react';
import { MasterCard, CardContent, CardHeader, CardTitle } from '@components/MasterCard';
import { Alert, AlertDescription } from '@components/Alert';
import { Label } from "@components/label";
import Input from '@components/Input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getAllInfraProperties } from '@state/infraPropertiesSlice';
import { getAllInfrastructure } from '@state/infrastructureSlice';
import { deleteEntityInfraById, getEntityInfraProperties, saveEntityInfrastructure, updateEntityInfrastructure } from '@state/qboxEntitySlice';
import { useLocation, useSearchParams } from 'react-router-dom';
import * as lucide from "lucide-react";
import InfraMastersHub from './infra-master-hub';
import { Modal } from '@components/Modal';

interface InfraConfigProps {
    isHovered: any;
}

const InfraConfig: React.FC<InfraConfigProps> = ({ isHovered }) => {
    const [mode, setMode] = useState('view');
    const [message, setMessage]: any = useState(null);
    const [selectedTab, setSelectedTab] = useState('view');
    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };
    const { infraList } = useSelector((state: RootState) => state.infra);
    const { infraPropertiesList } = useSelector((state: RootState) => state.infraProperty);
    const { entityInfraPropsList } = useSelector((state: RootState) => state.qboxEntity);
    const [infrastructures, setInfrastructures]: any = useState([]);
    const [editinfrastructures, setEditInfrastructures]: any = useState([]);
    const [selectedItem, setSelectedItem]: any = useState(null);
    const [selectedEditItem, setSelectedEditItem]: any = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const qboxEntitySno = searchParams.get("qboxEntitySno");
    const qboxEntityName = searchParams.get("qboxEntityName");
    const location = useLocation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedInfraSno, setSelectedInfraSno] = useState<ShareData | null>(null);
    const isSaveEnabled = useMemo(() => {
        if (!selectedItem) return false; // No item selected
        const infraProps = getPropertiesForInfra(selectedItem.infraSno);
        return infraProps.every(prop => {
            const propName = prop.propertyName.toLowerCase();
            const value = selectedItem.props[propName];

            return value !== undefined && value !== null && value.toString().trim() !== "";
        });
    }, [selectedItem, infrastructures]);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        loadInitialData(qboxEntitySno);
        console.log(qboxEntitySno)
    }, []);

    const loadInitialData = async (qboxEntitySno) => {
        try {
            if (!qboxEntitySno) {
                console.warn("qboxEntitySno is required to load data.");
                return;
            }
            setIsLoading(true);
            const [infraProps, infra, entityProps] = await Promise.all([
                dispatch(getAllInfraProperties({})),
                dispatch(getAllInfrastructure({})),
                dispatch(getEntityInfraProperties({ qboxEntitySno })),
            ]);

            if (entityProps.payload?.length === 0) {
                console.log("No infrastructure components configured for this Delivery Location.");
                setSelectedTab("add");
            }
        } catch (error) {
            console.error("Error loading initial data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initializeComponent = async () => {
            const urlParams = new URLSearchParams(location.search);
            const tabFromUrl = urlParams.get('tab');
            await loadInitialData(qboxEntitySno);
            if (tabFromUrl) {
                setSelectedTab(tabFromUrl);
            } else if (location.state?.selectedTab) {
                setSelectedTab(location.state.selectedTab);
            }
        };

        if (qboxEntitySno) {
            initializeComponent();
        }
    }, [qboxEntitySno, location]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const checkOverflow = () => {
                setIsScrollable(canvas.scrollHeight > canvas.clientHeight);
            };
            checkOverflow();

            // Optional: Add a resize observer to detect dynamic changes
            const resizeObserver = new ResizeObserver(checkOverflow);
            resizeObserver.observe(canvas);

            return () => resizeObserver.disconnect();
        }
    }, [infrastructures]);
    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', selectedTab);
        window.history.replaceState({}, '', url.toString());
    }, [selectedTab]);

    const addInfraProperties = async () => {
        try {
            // Create the array of infrastructure data
            const infraData = infrastructures.map((infra) => {
                // Get the properties for this infrastructure type
                const infraProperties = infraPropertiesList.filter(
                    (prop) => prop.infraSno === infra.infraSno
                );
                // Create the properties array for this infrastructure
                const properties = infraProperties.map((prop) => {
                    const propertyName = prop.propertyName.toLowerCase();
                    return {
                        infraPropertySno: prop.infraPropertySno,
                        value: infra.props[propertyName]?.toString() || "1",
                    };
                });
                // Return the structure for each infrastructure
                return {
                    infraSno: infra.infraSno,
                    properties: properties,
                };
            });

            // Create the final transformed data structure with entitySno
            const transformedData = {
                qboxEntitySno: qboxEntitySno,
                data: infraData,
            };

            handleReset();
            console.log("Transformed Data:", transformedData);
            // Dispatch the save action
            const saveResponse = await dispatch(saveEntityInfrastructure(transformedData));
            // Check the saveResponse structure for success
            if (saveResponse?.payload?.isSuccess && saveResponse?.payload?.status === 201) {
                console.log("Save Successful:", saveResponse.payload.data);
                // Fetch the updated properties
                await dispatch(getEntityInfraProperties({ qboxEntitySno: qboxEntitySno }));
                // Switch to the view tab upon successful save
                setSelectedTab('view');
            } else {
                console.error('Save operation failed:', saveResponse);
            }
        } catch (error) {
            console.error('Error saving infrastructure:', error);
        }
    };

    const updateInfraProperties = async () => {
        try {
            // Transform the data into the required format
            const infraData = editinfrastructures.map(infra => {
                return {
                    infraSno: infra.infraSno,
                    properties: infra.props
                        ? Object.entries(infra.props).map(([key, value]) => {
                            const property = entityInfraPropsList
                                .find(item => item.infraSno === infra.infraSno)?.properties
                                .find(prop => prop.propertyName.toLowerCase() === key.toLowerCase());

                            return {
                                infraPropertySno: property?.infraPropertySno,
                                value: value
                            };
                        })
                        : [],
                };
            });

            const transformedData = {
                qboxEntitySno: qboxEntitySno,
                entityInfraSno: editinfrastructures[0]?.entityInfraSno,
                data: infraData,
            };

            console.log('Transformed data:', transformedData);

            // Dispatch update and refetch properties
            await dispatch(updateEntityInfrastructure(transformedData));
            await dispatch(getEntityInfraProperties({ qboxEntitySno }));

            // ✅ Reset form state after update
            setEditInfrastructures([]);
            setSelectedEditItem(null);
        } catch (error) {
            console.error('Error updating infrastructure:', error);
        }
    };


    const handleOnEdit = async (entityInfraSno) => {
        try {
            setIsLoading(true);
            setEditInfrastructures([]);
            const infra = entityInfraPropsList.find(item =>
                item.properties[0]?.entityInfraSno === entityInfraSno
            );
            console.log(infra)
            if (infra) {
                // Map properties to the props object
                console.log(infra)
                const props = {};
                infra.properties.map(prop => {
                    const infraProperty = infraPropertiesList.find(
                        p => p.infraPropertySno === prop.infraPropertySno
                    );
                    if (infraProperty) {
                        props[infraProperty.propertyName.toLowerCase()] = prop.value;
                    }
                });
                console.log(props)
                const canvasItem = {
                    id: `infra-${infra.infraSno}`,
                    instanceId: `existing-${infra.infraSno}-${Date.now()}`,
                    icon: infra.infraIcon || 'Box',
                    label: infra.infraName,
                    type: infra.infraName === 'Q-Box' ? 'table' :
                        infra.infraName === 'Tv' ? 'tv' :
                            infra.infraName === 'Fridge' ? 'fridge' :
                                infra.infraName === 'Camera' ? 'camera' :
                                    infra.infraName === 'Power Back' ? 'Power Back' :
                                        infra.infraName === 'Scanner' ? 'scanner' : 'box',
                    infraSno: infra.infraSno,
                    entityInfraSno,
                    props,
                    position: { x: 100, y: 100 }
                };
                // Update the infrastructures list
                setEditInfrastructures(prev => {
                    const updated = prev.map(item =>
                        item.infraSno === canvasItem.infraSno ? canvasItem : item
                    );
                    return updated.length ? updated : [...prev, canvasItem];
                });

                setSelectedEditItem(canvasItem); // Update the selected item
            }
        } catch (error) {
            console.error('Error editing infrastructure:', error);
            setMessage({ text: 'Failed to load infrastructure details', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const infraItems = infraList.map(infra => ({
        id: `infra-${infra.infraSno}`,
        icon: infra.infraIcon,
        label: infra.infraName,
        type: infra.infraName === 'Q-Box' ? 'table' :
            infra.infraName === 'Tv' ? 'tv' :
                infra.infraName === 'Fridge' ? 'fridge' :
                    infra.infraName === 'Camera' ? 'camera' :
                        infra.infraName === 'Power Back' ? 'Power Back' :
                            infra.infraName === 'Scanner' ? 'scanner' : 'box',
        infraSno: infra.infraSno,
        defaultProps: getDefaultProps(infra.infraSno)
    }));

    function getDefaultProps(infraSno) {
        const props = infraPropertiesList.filter(prop => prop.infraSno === infraSno);
        const defaultValues = {};
        props.forEach(prop => {
            defaultValues[prop.propertyName.toLowerCase()] = null;
        });
        return defaultValues;
    }

    function getPropertiesForInfra(infraSno) {
        return infraPropertiesList.filter(prop => prop.infraSno === infraSno);
    }

    function getPropertiesForEditInfra(infraSno) {
        return infraPropertiesList.filter(prop => prop.infraSno === infraSno);
    }

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(item));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (!canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const dropX = e.clientX - canvasRect.left;
        const dropY = e.clientY - canvasRect.top;

        if (dropX >= 0 && dropX <= canvasRect.width && dropY >= 0 && dropY <= canvasRect.height) {
            const itemData = JSON.parse(e.dataTransfer.getData('text/plain'));
            const item = infraItems.find((infraItem) => infraItem.id === itemData.id);
            const itemName = item ? item.label : 'Unnamed';

            // Define preset positions based on infrastructure type
            const presetPositions = {
                'Hot Box': { x: 20, y: 50 },
                'Q-Box': { x: 220, y: 50 },
                'Tv': { x: 220, y: 200 },
                'Fridge': { x: 20, y: 400 },
                'Camera': { x: 220, y: 450 },
                'Power Back': { x: 20, y: 250 },
                'Scanner': { x: 220, y: 700 }
            };

            // Get the preset position based on the item's label, or use default position
            const position = presetPositions[itemName] || { x: 100, y: 100 };

            const newInfra = {
                ...itemData,
                instanceId: `${itemData.id}-${Date.now()}`,
                position: position,
                props: { ...itemData.defaultProps },
                name: itemName,
            };

            setInfrastructures(prev => [...prev, newInfra]);
            setSelectedItem(null);
        }
    };

    const handleMouseDown = (e, infra) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;

        const handleMouseMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const updatedInfra = {
                ...infra,
                position: {
                    x: infra.position.x + dx,
                    y: infra.position.y + dy
                }
            };

            setInfrastructures((prev) =>
                prev.map((i) => (i.instanceId === infra.instanceId ? updatedInfra : i))
            );
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const renderQBox = ({ props }) => {
        const rows = props?.row || 2;
        const columns = props?.column || 2;
        const boxSize = 40;
        const gap = 2;
        const boxWithGap = boxSize + gap;
        const maxVisibleBoxes = 10;
        const shouldScroll = rows > 10 || columns > 10;
        const containerSize = shouldScroll ? maxVisibleBoxes * boxWithGap : boxWithGap * Math.max(rows, columns);

        return (
            <div
                className="relative rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl transform transition-transform hover:scale-[1.02]"
                style={{
                    width: `${containerSize + 8}px`,
                    height: `${containerSize + 8}px`,
                    boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div className="absolute inset-0 bg-white backdrop-blur-sm" />
                <div
                    className={`absolute ${shouldScroll ? 'overflow-auto new-scrollbar ' : 'overflow-visible'}`}
                    style={{
                        top: '4px',
                        left: '4px',
                        right: '4px',
                        bottom: '4px',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columns}, ${boxSize}px)`,
                            gap: `${gap}px`,
                            width: 'fit-content',
                        }}
                    >
                        {Array.from({ length: rows * columns }).map((_, index) => (
                            <div
                                key={index}
                                className="relative bg-gradient-to-br from-red-400 to-rose-500 rounded-lg flex items-center justify-center transform transition-all duration-200 hover:scale-105 hover:rotate-1 hover:shadow-lg"
                                style={{
                                    width: `${boxSize}px`,
                                    height: `${boxSize}px`,
                                    boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 rounded-lg" />
                                <div className="relative text-white font-medium">Q{index + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderHotBox = ({ props }) => {
        return (
            <div className="transform transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-5 shadow-2xl relative overflow-hidden">
                    {/* Overlay Effects */}
                    <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Capacity Display */}
                    <div className="relative flex flex-col items-center space-y-2">
                        <div className="p-4 bg-white/10 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">🔥 HotBox</span>
                        </div>
                        <p className="text-white text-lg font-semibold">Capacity: {props.capacity}</p>
                    </div>
                </div>
            </div>
        );
    };


    const renderTV = ({ props }) => {
        const getSize = (inch) => {
            const sizes = {
                '24': 'h-28 w-40',
            };
            return sizes[props.inch] || sizes['24'];
        };

        return (
            <div className="transform transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 shadow-2xl relative">
                    <div className="absolute inset-0 bg-white/5 rounded-xl backdrop-blur-sm" />
                    <div className={`${getSize(props.inch)} bg-black rounded-lg relative overflow-hidden shadow-inner`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-black/80" />
                        <div className="h-full w-full flex flex-col items-center justify-center relative">
                            <div className="text-white text-sm mb-2 font-medium">{props.brand || 'TV'}</div>
                            <div className="text-gray-400 text-xs">{props.inch} inch</div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-b from-gray-600 to-gray-800 h-5 w-10 mx-auto mt-3 rounded-b-xl shadow-lg" />
                </div>
            </div>
        );
    };

    const renderFridge = ({ props }) => (
        <div className="transform transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 shadow-2xl relative">
                <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm" />
                <div className="relative bg-gradient-to-br from-blue-400 to-cyan-500 h-48 w-32 rounded-lg flex flex-col overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="h-2/3 border-b border-blue-300/30 flex items-center justify-center relative">
                        <div className="text-white font-bold text-lg">{props.capacity}L</div>
                    </div>
                    <div className="h-1/3 flex items-center justify-center relative">
                        <div className="w-3 h-8 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-inner" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCamera = ({ camera }) => (
        <div className="flex items-center justify-center">
            <div className="relative bg-gray-900 rounded-lg shadow-lg p-4 w-52 h-40 flex flex-col items-center justify-center">

                {/* Camera Body Shape */}
                <div className="absolute top-3 w-24 h-8 bg-gray-800 rounded-t-xl" /> {/* Top Section */}
                <div className="absolute -top-2 left-10 w-6 h-6 bg-gray-700 rounded-full" /> Flash/Light

                {/* Camera Lens */}
                <div className="relative flex items-center justify-center w-24 h-24 bg-gray-700 rounded-full shadow-inner border-4 border-gray-600">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                        <div className="w-10 h-10 bg-gray-900 rounded-full border-2 border-gray-500 animate-pulse" />
                    </div>
                </div>

                {/* Camera Icon Overlay */}
                <div className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full shadow-md">
                    <Camera className="w-6 h-6 text-gray-300" />
                </div>

                {/* Camera Details */}
                <p className="text-white text-sm font-semibold mt-4">Camera #{camera?.id}</p>
                {/* <p className="text-gray-400 text-xs">Capacity: <span className="font-bold text-white">{camera?.capacity}</span></p> */}
            </div>
        </div>
    );


    const renderScanner = ({ scanner }) => (
        <div className="flex items-center justify-center">
            <div className="relative bg-gray-900 rounded-lg shadow-lg p-4 w-52 h-32 flex flex-col items-center justify-center">

                {/* Scanner Body */}
                <div className="absolute top-0 w-40 h-6 bg-gray-800 rounded-t-xl" /> {/* Scanner Top */}
                <div className="absolute top-1 w-36 h-3 bg-gray-700 rounded-full" /> {/* Scanner Glass */}

                {/* Scanner Icon */}
                <div className="absolute top-4 right-2 p-2 bg-gray-700 rounded-full shadow-md">
                    <Scan className="w-5 h-5 text-gray-300" />
                </div>

                {/* Scanner Light */}
                <div className="relative w-28 h-8 bg-gray-600 rounded-lg flex items-center justify-center shadow-inner">
                    <div className="w-24 h-4 bg-green-500/50 rounded-md animate-pulse" />
                </div>

                {/* Scanner Details */}
                <p className="text-white text-sm font-semibold mt-4">Scanner #{scanner?.id}</p>
                <p className="text-gray-400 text-xs">Resolution: <span className="font-bold text-white">{scanner?.resolution} DPI</span></p>
            </div>
        </div>
    );

    const renderPowerBank = ({ powerbank }) => (
        <div className="flex items-center justify-center">
            <div className="relative bg-gray-900 rounded-2xl shadow-lg p-6 w-44 h-24 flex flex-col items-center justify-center">

                {/* LED Indicators */}
                <div className="absolute top-2 right-4 flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                </div>

                {/* Power Bank Icon */}
                <div className="absolute top-2 left-4 p-2 bg-gray-700 rounded-full shadow-md">
                    <BatteryCharging className="w-5 h-5 text-gray-300" />
                </div>

                {/* USB Ports */}
                <div className="absolute bottom-2 flex space-x-2">
                    <div className="w-6 h-2 bg-gray-700 rounded-md" />
                    <div className="w-6 h-2 bg-gray-700 rounded-md" />
                </div>

                {/* Power Bank Details */}
                <p className="text-white text-sm font-semibold mt-4">Power Bank #{powerbank?.id}</p>
                <p className="text-gray-400 text-xs">Capacity: <span className="font-bold text-white">{powerbank?.capacity} mAh</span></p>
            </div>
        </div>
    );

    const renderHeader = () => (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <div className='flex'>
                        {selectedTab == 'view' && (
                            <>
                                <div>
                                    {/* Premium Delivery Location Card */}
                                    <div className="flex items-center mb-5 ">
                                        <h1 className="text-2xl font-bold text-gray-800">
                                            {qboxEntityName} <span className="text-color">Delivery Location</span>
                                        </h1>
                                    </div>
                                    <div className="flex items-center mb-6">
                                        <div className="bg-blue-600 bg-opacity-10 p-2 rounded-lg mr-3">
                                            <lucide.MonitorCog className="text-blue-600 h-6 w-6" />
                                        </div>
                                        <h1 className="text-2xl text-color">Current Asset</h1>
                                    </div>
                                </div>
                                {/* <MonitorCogIcon className='text-color mt-1' />
                                <h1 className="text-2xl text-color flex items-center gap-3 ml-1">Current Infrastructure</h1> */}
                            </>
                        )}
                        {selectedTab == 'add' && (
                            <>
                                <div>
                                    {/* Premium Delivery Location Card */}
                                    <div className="flex items-center mb-5 ">
                                        <h1 className="text-2xl font-bold text-gray-800">
                                            {qboxEntityName} <span className="text-color">Delivery Location</span>
                                        </h1>
                                    </div>
                                    <div className="flex items-center mb-6">
                                        <div className="bg-blue-600 bg-opacity-10 p-2 rounded-lg mr-3">
                                            <lucide.MonitorCog className="text-blue-600 h-6 w-6" />
                                        </div>
                                        <h1 className="text-2xl text-color">Add New Assets</h1>
                                    </div>
                                </div>
                            </>
                        )}
                        {selectedTab == 'addInfraMasters' && (
                            <>
                                <MonitorCogIcon className='text-color mt-1' />
                                <h1 className="text-2xl text-color flex items-center gap-3 ml-1">Asset Masters</h1>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <>
                        <div className="flex justify-between bg-gray-200 rounded-md shadow-lg">
                            <button
                                onClick={() => {
                                    setSelectedTab('view');
                                    handleTabChange;
                                    handleEditReset()
                                    dispatch(getAllInfraProperties({})),
                                        dispatch(getAllInfrastructure({}))
                                    // dispatch(getEntityInfraProperties({ qboxEntitySno }))
                                }}
                                className={`px-4 py-2 rounded-l-lg flex items-center transition-all duration-200 transform ${selectedTab === 'view' ? 'bg-color text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'}`}
                            >
                                View Assets
                            </button>
                            <button
                                onClick={() => {
                                    handleTabChange('add'),
                                        dispatch(getAllInfraProperties({})),
                                        dispatch(getAllInfrastructure({}))
                                    handleReset()
                                }}
                                className={`px-4 py-2 flex items-center transition-all duration-200 transform ${selectedTab === 'add' ? 'bg-color text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'}`}
                            >
                                Add New Assets
                            </button>
                            <button
                                onClick={() => handleTabChange('addInfraMasters')}
                                className={`px-4 py-2 rounded-r-lg flex items-center transition-all duration-200 transform ${selectedTab === 'addInfraMasters' ? 'bg-color text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'}`}
                            >
                                Add Asset Master
                            </button>
                        </div>

                        {/* )} */}
                    </>

                </div>
            </div>
        </>
    );

    const renderMessage = () => message && (
        <Alert className={`mb-4 ${message.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
            <AlertDescription className={message.type === 'error' ? 'text-color' : 'text-green-600'}>
                {message.text}
            </AlertDescription>
        </Alert>
    );

    useEffect(() => {
        console.log(selectedTab)
    }, [selectedTab])

    const handleTabChange = (newTab) => {
        setSelectedTab(newTab);
        console.log('Selected tab:', newTab);
    };

    const handleReset = () => {
        setInfrastructures([]);
        setSelectedItem(null);
    };

    const handleEditReset = () => {
        setEditInfrastructures([]);
        setSelectedEditItem(null);
    };

    const handleRemoveComponent = (instanceId) => {
        setInfrastructures(prev => prev.filter(infra => infra.instanceId !== instanceId));
        if (selectedItem?.instanceId === instanceId) {
            setSelectedItem(null);
        }
    };

    const handleDeleteModalOpen = (entityInfraSno) => {
        setSelectedInfraSno(entityInfraSno);
        setIsDeleteModalOpen(true);
    };


    const handleDeleteModalClose = () => {
        setSelectedInfraSno(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        console.log(selectedInfraSno)
        if (selectedInfraSno) {
            await dispatch(deleteEntityInfraById({ entityInfraSno: selectedInfraSno }))
            await dispatch(getEntityInfraProperties({ qboxEntitySno: qboxEntitySno }))
            handleDeleteModalClose();
        }
    };

    return (
        // <div className="p-6 pl-24 pr-10 p-10">
        <div className="bg-gray-50 min-h-screen">
            <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
                {renderMessage()}
                {renderHeader()}
                <>
                    {selectedTab == 'view' && (
                        <div>
                            <div>
                                <CardContent>
                                    <div className="flex space-x-2">
                                        {/* Left Side - Card List (Small Size) */}
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-8">
                                            <h2 className="text-lg font-semibold mb-4">Asset Details</h2>
                                            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
                                                <div className="w-72 p-2 pt-4">
                                                    {entityInfraPropsList && entityInfraPropsList.length > 0 ? (
                                                        entityInfraPropsList.map(({ infraName, infraIcon, properties }) => {
                                                            const IconComponent = lucide[infraIcon] || lucide.AlertCircle;
                                                            const entityInfraSno = properties[0]?.entityInfraSno;

                                                            return (
                                                                <div
                                                                    className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-all relative mb-4"
                                                                    key={infraName}
                                                                >
                                                                    {/* Edit & Delete Buttons */}
                                                                    <div className="absolute top-2 right-2 flex space-x-4 mr-4 mt-3">
                                                                        <button
                                                                            className="text-blue-500 hover:text-blue-700"
                                                                            onClick={() => handleOnEdit(entityInfraSno)}
                                                                        >
                                                                            <Pencil className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            className="text-red-color hover:text-red-700"
                                                                            onClick={() => handleDeleteModalOpen(entityInfraSno)}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>

                                                                    {/* Icon and Infra Name */}
                                                                    <div className="flex items-center">
                                                                        {IconComponent ? (
                                                                            <IconComponent size={20} />
                                                                        ) : (
                                                                            <div className="text-rose-500">No Icon</div>
                                                                        )}
                                                                        <p className="text-gray-700 text-lg font-bold ml-3">{infraName}</p>
                                                                    </div>

                                                                    <div className="border border-gray-100 mt-2"></div>

                                                                    {/* Properties */}
                                                                    <div className="text-gray-500 text-sm space-y-1 mt-5 max-h-48 overflow-y-auto new-scrollbar">
                                                                        {properties?.map(({ propertyName, value }) => (
                                                                            <div key={propertyName} className="break-words">
                                                                                <span className="font-semibold">{propertyName}:</span>{' '}
                                                                                <span className="break-words whitespace-normal text-gray-600 block">
                                                                                    {value}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                                                            <h1>No Assets configured for the Delivery Location.</h1>
                                                            <img
                                                                src="/assets/images/no-infra-con.png"
                                                                alt="QBox"
                                                                className="text-red-100 bg-color mt-8"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>

                                        {/* Right Side - Canvas (Larger Size) */}
                                        <div className="flex-1 h-[calc(100vh-6rem)] border-color">
                                            <CardContent className="h-full">
                                                <div className="flex justify-between mb-4">
                                                    <div className="text-sm text-gray-500">
                                                    </div>
                                                </div>

                                                <div
                                                    ref={canvasRef}
                                                    className="h-full relative bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center"
                                                >
                                                    {!entityInfraPropsList || entityInfraPropsList.length === 0 ? (
                                                        <div className="text-center flex flex-col items-center justify-center">
                                                            <AlertCircle className="w-12 h-12 text-rose-600 mb-4" />
                                                            <h3 className="text-xl">
                                                                No Assets configured for the Delivery Location.
                                                            </h3>
                                                        </div>
                                                    ) : (
                                                        editinfrastructures.map((infra) => (
                                                            <div
                                                                key={infra.instanceId}
                                                                className={`absolute cursor-move transition-all ${selectedEditItem?.instanceId === infra.instanceId
                                                                    ? 'ring-2 ring-rose-500'
                                                                    : ''
                                                                    }`}
                                                                style={{
                                                                    left: `${infra.position.x}px`,
                                                                    top: `${infra.position.y}px`,
                                                                }}
                                                                onClick={() => setSelectedEditItem(infra)}
                                                                onMouseDown={(e) => handleMouseDown(e, infra)}
                                                            >
                                                                <div className="text-center font-bold mb-2 text-rose-900">
                                                                    {infra.label}
                                                                </div>
                                                                {infra.type === 'table' && renderQBox(infra)}
                                                                {infra.type === 'box' && renderHotBox(infra)}
                                                                {infra.type === 'tv' && renderTV(infra)}
                                                                {infra.type === 'fridge' && renderFridge(infra)}
                                                                {infra.type === 'camera' && renderCamera(infra)}
                                                                {infra.type === 'Power Back' && renderPowerBank(infra)}
                                                                {infra.type === 'scanner' && renderScanner(infra)}

                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                            </CardContent>
                                        </div>
                                        {/* Properties Panel */}
                                        {selectedEditItem && (
                                            <div className="w-64 mt-8">
                                                <MasterCard className="border-rose-200">
                                                    <CardHeader>
                                                        <CardTitle className="">Properties</CardTitle>
                                                    </CardHeader>
                                                    {selectedEditItem && (
                                                        <CardContent className="space-y-4">
                                                            {getPropertiesForEditInfra(selectedEditItem.infraSno).map(prop => (
                                                                <div key={prop.infraPropertySno} className="space-y-2">
                                                                    <Label htmlFor={prop.propertyName}>{prop.propertyName}</Label>
                                                                    <Input
                                                                        id={prop.propertyName}
                                                                        type="text"
                                                                        value={selectedEditItem.props[prop.propertyName.toLowerCase()] ?? ''}
                                                                        className="border-rose-200 focus:border-rose-400"
                                                                        onChange={(e) => {
                                                                            const inputValue = e.target.value;
                                                                            const propName = prop.propertyName.toLowerCase();

                                                                            setEditInfrastructures(prev =>
                                                                                prev.map(i => {
                                                                                    if (i.instanceId === selectedEditItem.instanceId) {
                                                                                        return {
                                                                                            ...i,
                                                                                            props: {
                                                                                                ...i.props,
                                                                                                [propName]: inputValue,
                                                                                            },
                                                                                        };
                                                                                    }
                                                                                    return i;
                                                                                })
                                                                            );

                                                                            setSelectedEditItem(prev => ({
                                                                                ...prev,
                                                                                props: {
                                                                                    ...prev.props,
                                                                                    [propName]: inputValue,
                                                                                },
                                                                            }));
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </CardContent>
                                                    )}

                                                    <div className='ml-4 pb-4'>
                                                        {selectedEditItem && (
                                                            <button
                                                                onClick={updateInfraProperties}
                                                                disabled={isLoading}
                                                                className="bg-color hover:bg-color text-white px-12 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                                            >
                                                                <Save className="h-4 w-4 mr-2" />
                                                                Update Infra
                                                            </button>
                                                        )}
                                                    </div>
                                                </MasterCard>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    )}
                    {selectedTab == 'add' && (
                        <div className='mt-4' >
                            <div>
                                <CardContent>
                                    <div className="flex-1">
                                        <div className="flex">
                                            <div className="mt-16">
                                                {infraItems?.length > 0 ? (
                                                    <MasterCard className="border-color">
                                                        <CardHeader className="flex flex-row items-center justify-between">
                                                            <CardTitle>Components</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="grid grid-cols-2 gap-3 overflow-y-auto hide-scrollbar">
                                                                {infraItems.map((item) => {
                                                                    // Dynamically get the icon component
                                                                    const IconComponent = lucide[item.icon] || lucide.AlertCircle;
                                                                    return (
                                                                        <div
                                                                            key={item.id}
                                                                            draggable
                                                                            onDragStart={(e) => handleDragStart(e, item)}
                                                                            className="flex flex-col items-center p-3 bg-white rounded-xl border border-gray-300 hover:border-color hover:shadow-md transition-all cursor-move"
                                                                        >
                                                                            {/* Render the icon */}
                                                                            {IconComponent ? (
                                                                                <IconComponent className="h-8 w-8 mb-2 text-gray-500 hover:text-color" />
                                                                            ) : (
                                                                                <div className="h-8 w-8 mb-2 text-color">No Icon</div> // Fallback if no icon exists
                                                                            )}
                                                                            <span className="text-sm font-medium text-gray-500">{item.label}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </CardContent>
                                                    </MasterCard>
                                                ) : (
                                                    <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                                                        <h1>No infrastructure components Found</h1>
                                                        <img
                                                            src="/assets/images/no-infra-con.png"
                                                            alt="QBox"
                                                            className="text-red-100 bg-color mt-8"
                                                        />
                                                    </div>
                                                )}


                                                {selectedItem && (
                                                    <MasterCard className="border-rose-200 mt-4">
                                                        <CardHeader>
                                                            <CardTitle>Properties</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                            {getPropertiesForInfra(selectedItem.infraSno).map(prop => (
                                                                <div key={prop.infraPropertySno} className="space-y-2">
                                                                    <Label htmlFor={prop.propertyName}>
                                                                        {prop.propertyName}
                                                                    </Label>
                                                                    <Input
                                                                        id={prop.propertyName}
                                                                        type="text"
                                                                        value={selectedItem.props[prop.propertyName.toLowerCase()] || ''}
                                                                        className="border-rose-200 focus:border-rose-400"
                                                                        onChange={(e) => {
                                                                            const inputValue = e.target.value;

                                                                            // Update the infrastructure state with both numbers and strings
                                                                            const propName = prop.propertyName.toLowerCase();
                                                                            setInfrastructures(prev => prev.map(i =>
                                                                                i.instanceId === selectedItem.instanceId
                                                                                    ? { ...i, props: { ...i.props, [propName]: inputValue } }
                                                                                    : i
                                                                            ));

                                                                            setSelectedItem({
                                                                                ...selectedItem,
                                                                                props: { ...selectedItem.props, [propName]: inputValue }
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </CardContent>
                                                    </MasterCard>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="h-[calc(80vh-2rem)] border-rose-200">
                                                    <CardContent className="h-full">
                                                        <div className="flex justify-between mb-4">
                                                            <div className="text-sm text-gray-500">
                                                                {/* {selectedItem ? 'Editing infrastructure...' : 'Select an infrastructure to add'} */}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={handleReset}
                                                                    className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                                                >
                                                                    <RotateCcw className="h-4 w-4 mr-2" />
                                                                    Reset Canvas
                                                                </button>
                                                                <button
                                                                    onClick={addInfraProperties}
                                                                    disabled={isLoading || !isSaveEnabled}
                                                                    className={`bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg ${isLoading || !isSaveEnabled ? 'opacity-50 cursor-not-allowed' : ''
                                                                        }`}
                                                                >
                                                                    <Save className="h-4 w-4 mr-2" />
                                                                    Save Changes
                                                                </button>

                                                            </div>
                                                        </div>
                                                        <div
                                                            ref={canvasRef}
                                                            className={`h-full relative bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all flex items-center justify-center ${isScrollable ? 'overflow-y-auto' : ''}`}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onDrop={handleDrop}
                                                        >

                                                            {infrastructures.map((infra) => (
                                                                <div
                                                                    key={infra.instanceId}
                                                                    className={`absolute cursor-move transition-all ${selectedItem?.instanceId === infra.instanceId
                                                                        ? 'ring-2 ring-blue-500 p-2'
                                                                        : ''
                                                                        }`}
                                                                    style={{
                                                                        left: `${infra.position.x}px`,
                                                                        top: `${infra.position.y}px`,
                                                                    }}
                                                                    onClick={() => setSelectedItem(infra)}
                                                                    onMouseDown={(e) => handleMouseDown(e, infra)}
                                                                >
                                                                    <button
                                                                        className="absolute -top-2 -right-2 bg-color text-white rounded-full p-1 hover:bg-color z-10"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveComponent(infra.instanceId);
                                                                        }}
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                    </button>
                                                                    <div className="text-center font-bold mb-2 text-rose-900">
                                                                        {infra.label}
                                                                    </div>
                                                                    {infra.type === 'table' && renderQBox(infra)}
                                                                    {infra.type === 'box' && renderHotBox(infra)}
                                                                    {infra.type === 'tv' && renderTV(infra)}
                                                                    {infra.type === 'fridge' && renderFridge(infra)}
                                                                    {infra.type === 'camera' && renderCamera(infra)}
                                                                    {infra.type === 'Power Back' && renderPowerBank(infra)}
                                                                    {infra.type === 'scanner' && renderScanner(infra)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    )}
                    {selectedTab == 'addInfraMasters' && (
                        <div className='mt-4'>
                            <InfraMastersHub isHovered={undefined} />
                        </div>
                    )}
                </>
            </div >

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteModalClose}
                title="Delete"
                type="info"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-md"
                            onClick={handleDeleteModalClose}
                        >
                            No
                        </button>
                        <button
                            className="px-4 py-2 bg-color text-white rounded-md"
                            onClick={handleDelete}
                        >
                            Yes
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this infra?</p>
            </Modal>
        </div>
        // </div >

    );
};

export default InfraConfig;