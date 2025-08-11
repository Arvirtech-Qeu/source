import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Lock, ArrowRight, ArrowLeft, Search, Save, Unlock, FileCode, ChevronRight, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ApiService } from "@/services/apiServices";
import ModuleSelector from "./ModuleSelector";
import { getAllModules } from "@/redux/features/modulesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "react-toastify";
import Popup from "@/components/ui/popup";


const ModuleMenuMapping = () => {
    // ... keeping all your existing state and functions ...
    const dispatch = useDispatch();
    const [mappedData, setMappedData] = useState([]);
    const [unMappedData, setunMappedData] = useState([]);
    const [selectedUnmappedItems, setSelectedUnmappedItems]: any = useState([]);
    const [selectedMappedItems, setSelectedMappedItems]: any = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [mappedPermissions, setMappedPermissions] = useState([]);
    const [unmappedPermissions, setUnmappedPermissions] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [unmappedSearchTerm, setUnmappedSearchTerm] = useState("");
    const [mappedSearchTerm, setmappedSearchTerm] = useState("");
    const [showButton, setShowButton] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "map" or "unmap"

    // Add these new state variables to store previous state
    const [previousMappedData, setPreviousMappedData]: any = useState([]);
    const [previousUnmappedData, setPreviousUnmappedData]: any = useState([]);


    useEffect(() => {
        dispatch(getAllModules({}));
    }, [dispatch]);

    const { modulesList } = useSelector((state: RootState) => state.moduleSlice);

    const handleModuleClick = async (moduleId: any) => {
        setShowButton(false);
        try {
            const params = { moduleId: moduleId };
            const data = await ApiService('8914', 'get', '/get_map_unmap_module_menu_by_module_id', // API endpoint
                null,
                params
            );
            console.log(data)
            // Update the state with fetched data
            setMappedData(data?.data?.mapped_permissions || []);
            setunMappedData(data?.data?.unmapped_permissions || []);
            setSelectedUnmappedItems([]);
            setSelectedMappedItems([]);
            setUnmappedSearchTerm("")
            setmappedSearchTerm("")
        } catch (error) {
        }
    };

    const handleModuleMenuMapping = async () => {
        try {
            const params = {
                mappedPermissions: mappedPermissions.length > 0 ? mappedPermissions : [],
                unmappedPermissions: mappedPermissions.length === 0 ? unmappedPermissions : [],
            };
            // Call the API
            const data = await ApiService('8914', 'post', '/create_map_unmap_module_menu', params);

            if (data?.data?.status === "success" && data?.data?.insertMessage === "Mapped success") {
                toast.success("Premission Mapped Success");
            } else if (data?.data?.status === "success" && data?.data?.deleteMessage === "Unmapped success") {
                toast.success("Premission UnMapped Success");
            } else {
                toast.error("Someting went wrong");
            }

            // Clear the lists after successful save
            setMappedPermissions([]); // Assuming setMappedPermissions is the state setter
            setUnmappedPermissions([]); // Assuming setUnmappedPermissions is the state setter

        } catch (error) {
        }
        setShowButton(false);
    };



    const handleResponsibilitySelect = (item: string, type: "unmapped" | "mapped") => {
        if (type === "unmapped") {
            setSelectedUnmappedItems((prev: any) =>
                prev.includes(item) ? prev.filter((i: any) => i !== item) : [...prev, item]
            );
        } else {
            setSelectedMappedItems((prev: any) =>
                prev.includes(item) ? prev.filter((i: any) => i !== item) : [...prev, item]
            );
        }
    };

    const moveToMapped = () => {

        // Store current state before making changes
        setPreviousMappedData([...mappedData]);
        setPreviousUnmappedData([...unMappedData]);

        setIsPopupOpen(true);
        setActionType("map")

        const newMappedData: any = [
            ...mappedData,
            ...selectedUnmappedItems.map((item: any) => ({
                ...item,
                isNew: true, // Add a flag to mark new additions
            })),
        ];
        const newUnmappedData = unMappedData.filter(
            (item) => !selectedUnmappedItems.includes(item)
        );

        setMappedData(newMappedData);
        setunMappedData(newUnmappedData);
        setSelectedUnmappedItems([]);
        setMappedPermissions(selectedUnmappedItems)
        setShowButton(true);
    };


    const moveToUnmapped = () => {

        // Store current state before making changes
        setPreviousMappedData([...mappedData]);
        setPreviousUnmappedData([...unMappedData]);

        setIsPopupOpen(true);
        setActionType("unmap")

        const newUnmappedData: any = [
            ...unMappedData,
            ...selectedMappedItems.map((item: any) => ({
                ...item,
                isNew: false, // Remove the "new" flag when transferring back
            })),
        ];
        const newMappedData = mappedData.filter(
            (item) => !selectedMappedItems.includes(item)
        );

        setunMappedData(newUnmappedData);
        setMappedData(newMappedData);
        setSelectedMappedItems([]);
        setUnmappedPermissions(selectedMappedItems)
        setShowButton(true);
    };


    const handleSelectAll = (type: "unmapped" | "mapped", selectAll: boolean) => {
        if (type === "unmapped") {
            setSelectedUnmappedItems(selectAll ? [...unMappedData] : []);
        } else {
            setSelectedMappedItems(selectAll ? [...mappedData] : []);
        }
    };

    const unMappedfilteredData = unMappedData.filter((menu: any) =>
        menu?.menuName.toLowerCase().includes(unmappedSearchTerm.toLowerCase())
    );

    const mappedfilteredData = mappedData.filter((menu: any) =>
        menu?.menuName.toLowerCase().includes(mappedSearchTerm.toLowerCase())

    );

    // Modify handleClosePopup function
    const handleClosePopup = () => {
        // Revert to previous state when user cancels
        setMappedData(previousMappedData);
        setunMappedData(previousUnmappedData);
        setIsPopupOpen(false);
        setSelectedUnmappedItems([]);
        setSelectedMappedItems([]);
        setMappedPermissions([]);
        setUnmappedPermissions([]);
        setShowButton(false);
    };

    const filteredModules = modulesList?.filter((module: any) =>
        module.moduleName.toLowerCase().includes(searchTerm.toLowerCase())

    );

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                </motion.div>
                <Card className="mb-5 mt-6 ">
                    <CardHeader className="flex flex-row  justify-between">
                        <div className="flex items-center space-x-4">
                            <FileCode className="h-8 w-8 text-red-600" />
                            <div>
                                <CardTitle className="text-2xl text-red-600 font-bold">
                                    Module Menu Mapping
                                </CardTitle>
                                <p className="text-sm text-gray-500">
                                    Manage module menu and access rights
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2 top-5  transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search Module..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-4 py-5  bg-gray-100 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 "
                            />
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-3">
                <ModuleSelector
                    modulesList={modulesList}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleModuleClick={handleModuleClick}
                    searchTerm={searchTerm}
                />
            </div>
            {modulesList?.length > 0 && filteredModules.length > 0 && (
                <div className="flex flex-col md:flex-row  gap-6">
                    {/* Left Section: Search Box and Card */}
                    <div className="flex flex-col w-full md:w-1/2 ">
                        {/* First Search Box */}
                        <div>
                            <div className="relative w-full">
                                <Search className="absolute left-2 top-1/3  transform -translate-y-1/3 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search Unmapped Menu..."
                                    value={unmappedSearchTerm}
                                    onChange={(e) => setUnmappedSearchTerm(e.target.value)}
                                    className="pl-8 pr-4 py-5 bg-gray-100 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 "
                                />
                            </div>
                            {/* Unmapped Menu Card */}
                            <div className={`${theme === 'light' ? 'col-span-5 text-gray-600 border border-gray-400 rounded-2xl mt-3' : 'col-span-5 text-gray-600 border border-gray-400 rounded-2xl'}`} >
                                <CardHeader>
                                    <CardTitle className="flex space-x-2">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                        <div className="text-black text-md text-red-600">
                                            <span>Unmapped Menu</span>
                                            <Badge variant="secondary" className={`${theme === 'light' ? ' ml-2 w-8 h-7 text-sm bg-gray-200' : 'text-black ml-2 w-8 h-7 text-sm bg-gray-200'}`}>
                                                {unMappedData?.length}
                                            </Badge>
                                        </div>

                                    </CardTitle>
                                    <div className="flex items-center pt-2">
                                        {activeTab && unMappedData?.length > 0 && (
                                            <div className="text-black text-xl">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUnmappedItems?.length === unMappedData?.length}
                                                    onChange={() =>
                                                        handleSelectAll(
                                                            "unmapped",
                                                            selectedUnmappedItems?.length !== unMappedData?.length
                                                        )
                                                    }
                                                    className="w-4 h-5 border-gray-400 rounded-md focus:ring-2 focus:ring-white "
                                                />
                                                <span className="pl-3">
                                                    {selectedUnmappedItems?.length === unMappedData?.length
                                                        ? "Unselect All"
                                                        : "Select All"}
                                                </span>
                                            </div>

                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="max-h-[500px] ">
                                    <AnimatePresence>
                                        {unMappedfilteredData.length > 0 ? (
                                            unMappedfilteredData.map((item: any, index) => (
                                                <motion.div
                                                    key={index}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="mb-2 ml-5"
                                                >
                                                    <div className={`${theme === 'light' ? ' flex items-center text-white-700 space-x-3 p-1 text-black rounded-lg hover:bg-gray-200' : 'flex items-center text-white-700 space-x-3 p-1 text-black rounded-lg hover:bg-gray-200'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUnmappedItems.includes(item)}
                                                            onChange={() => handleResponsibilitySelect(item, "unmapped")}
                                                            className={`${theme === 'light' ? 'w-4 h-5 border-gray-400 rounded-md border-white	' : 'w-4 h-5 border-gray-400 rounded-md border-white'}`}
                                                        />
                                                        <span>{item.menuName}</span>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-1 h-[40px]">No Unmapped Menu found</div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </div>
                        </div>
                    </div>

                    {/* Center Section: Arrow Buttons */}
                    <div className="flex flex-col justify-center mt-20 gap-4">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                onClick={moveToMapped}
                                disabled={!selectedUnmappedItems.length}
                                className="w-12 h-12 ml-10 mr-10 rounded-full bg-red-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                onClick={moveToUnmapped}
                                disabled={!selectedMappedItems.length}
                                className="w-12 h-12 rounded-full ml-10 mr-10 bg-red-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Section: Search Box and Card */}
                    <div className="flex flex-col w-full md:w-1/2">
                        {/* Second Search Box */}
                        <div className="relative ">
                            <Search className="absolute left-2 top-1/3 transform -translate-y-1/3 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search Mapped Menu..."
                                value={mappedSearchTerm}
                                onChange={(e) => setmappedSearchTerm(e.target.value)}
                                className="pl-8 pr-4 py-5 bg-gray-100 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200"
                            />
                        </div>

                        {/* Mapped Menu Card */}
                        <div className={`${theme === 'light' ? 'mt-3 text-gray-600 border border-gray-400 mt-1 rounded-2xl' : 'mt-3 text-gray-600 border border-gray-400 mt-1 rounded-2xl'}`}>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Unlock className="h-5 w-5 text-red-600" />
                                    <span className="text-red-600 text-md">Mapped Menu</span>
                                    <Badge variant="secondary" className={`${theme === 'light' ? 'ml-2 w-8 h-7 text-sm bg-gray-200' : 'text-black ml-2 w-8 h-7 text-sm bg-gray-200'}`}>
                                        {mappedData?.length}
                                    </Badge>
                                </CardTitle>
                                <div className="flex items-center pt-2">
                                    {activeTab && mappedData.length > 0 && (
                                        <>
                                            <div className="text-foreground text-xl">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMappedItems.length === mappedData.length}
                                                    onChange={() =>
                                                        handleSelectAll(
                                                            "mapped",
                                                            selectedMappedItems.length !== mappedData.length
                                                        )
                                                    }
                                                    className="w-4 h-5 border-gray-400 rounded-md focus:ring-2 focus:ring-white"
                                                />
                                                <span className="pl-3">
                                                    {selectedMappedItems.length === mappedData.length
                                                        ? "Unselect All"
                                                        : "Select All"}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="overflow-y-auto max-h-[500px] ">
                                <AnimatePresence>
                                    {mappedfilteredData.length > 0 ? (
                                        mappedfilteredData.map((item: any, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="mb-2 ml-3"
                                            >
                                                <div className={` ${theme === 'light' ? 'flex items-center space-x-3 p-1 text-black rounded-lg hover:bg-gray-200 ' : 'flex items-center space-x-3 p-1 text-black rounded-lg hover:bg-gray-200'}`} >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMappedItems.includes(item)}
                                                        onChange={() =>
                                                            handleResponsibilitySelect(item, "mapped")
                                                        }
                                                        className={`${theme === 'light' ? 'w-4 h-5 border-gray-400 rounded-md border-white' : 'w-4 h-5 border-gray-400 rounded-md border-white'}`}
                                                    />
                                                    <span>{item.menuName}</span>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500  h-[40px]">No Mapped Menu found</div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </div>
                    </div>
                    <Popup
                        IsPopupOpen={isPopupOpen}
                        icon={<Shield />}
                        confirmSave={() => {
                            handleModuleMenuMapping();
                            setIsPopupOpen(false);
                        }}
                        cancelSave={handleClosePopup}
                        Description={`Are you sure you want to ${actionType === "map" ? "map" : "unmap"} the menu to the module?`}
                        option1="Confirm"
                        option2="Cancel"
                    />
                </div>
            )}
        </div>
    );
};


export default ModuleMenuMapping;
