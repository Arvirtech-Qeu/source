import WarningToast from "@/common/WarningToast";
import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllMenu } from "@/redux/features/menuSlice";
import { createModuleMenu, getAllModuleMenus, updateModuleMenu } from "@/redux/features/moduleMenuSlice";
import { getAllModules } from "@/redux/features/modulesSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState, useEffect } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";


export default function ModuleMenu() {

    const dispatch = useDispatch();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const { moduleMenuList, createModuleMenuResult } = useSelector((state: RootState) => state.moduleMenuSlice);
    const { menuList } = useSelector((state: RootState) => state.menuSlice);
    const { modulesList } = useSelector((state: RootState) => state.moduleSlice);
    const [showWarningToast, setShowWarningToast] = useState(false);

    useEffect(() => {
        dispatch(getAllModuleMenus({}))
        dispatch(getAllModules({}))
        dispatch(getAllMenu({}))
    }, [dispatch, createModuleMenuResult])

    const moduleMenuData = moduleMenuList && moduleMenuList.length > 0
        ? moduleMenuList.map((moduleMenu: any) => ({
            moduleMenuId: moduleMenu.moduleMenuId,
            menuId: moduleMenu.menuId,
            moduleId: moduleMenu.moduleId,
            mediaLink: moduleMenu.mediaLink,
            moduleName: moduleMenu.moduleName,
            menuName: moduleMenu.menuName,
            auditTrialId: moduleMenu.auditTrialId,
            isActive: moduleMenu.isActive ? "Active" : "InActive"

        })) : [];

    const [formData, setFormData] = useState({
        moduleMenuId: null,
        menuId: null,
        moduleId: null,
        mediaLink: '',
        auditTrialId: '',
        isActive: true,
        action: ''

    });

    const validationRules = {
        menuId: { required: true, displayName: "MenuID" },
        moduleId: { required: true, displayName: "ModuleID" },
    };

    const resetForm = () => {
        setFormData({
            moduleMenuId: null,
            menuId: null,
            moduleId: null,
            mediaLink: '',
            auditTrialId: '',
            isActive: true,
            action: ''
        });
        setErrors({});
    };

    const moduleColumnConfig = [
        { key: "menuName", header: "Menu Name", sortable: true, filterable: true },
        { key: "moduleName", header: "Module Name", sortable: true, filterable: true },
        { key: "mediaLink", header: "Media Link", sortable: true, filterable: false },
        {
            key: "isActive",
            header: "Status",
            sortable: true,
            filterable: true,
            render: (value: string) => (
                <span className={`px-2 py-1 text-sm font-medium rounded ${value === "Active" ? "text-green-500" : "text-gray-500"}`}>
                    {value}
                </span>
            ),
        },
    ]

    const handleAdd = () => {
        // Check if either menuList or modulesList is empty
        if (!menuList?.length || !modulesList?.length) {
            setShowWarningToast(true);
            return; // Don't open the popup if lists are empty
        }
        setIsEditMode(false);
        setIsPopupOpen(true);
        resetForm();
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Mapping to convert select options to boolean values
        const booleanFields: Record<string, string> = {
            isActive: "Active",
        };

        setFormData({
            ...formData,
            [name]: booleanFields[name] ? value === booleanFields[name] : value,
        });

        // Clear the error for the current field as the user starts typing
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: "", // Reset error when the user starts typing
        }));
    };

    const handleSave = () => {
        const newModuleMenuData = {
            menuId: formData.menuId,
            moduleId: formData.moduleId,
            mediaLink: formData.mediaLink,
            isActive: formData.isActive ? true : false
        };
        dispatch(createModuleMenu(newModuleMenuData))
        resetForm();
        closePopup();
    };

    const handleEdit = (row: {
        moduleMenuId: any,
        menuId: any,
        moduleId: any,
        menuName: any,
        moduleName: any,
        mediaLink: any,
        auditTrialId: any,
        isActive: any,
        action: any
    }) => {
        const isActive = row.isActive === "Active" ? true : false;
        setFormData({
            moduleMenuId: row.moduleMenuId,
            menuId: row.menuId,
            moduleId: row.moduleId,
            mediaLink: row.mediaLink,
            auditTrialId: row.auditTrialId,
            isActive: isActive,
            action: "edit",
        });
        setIsEditMode(true);
        setIsPopupOpen(true);
    };

    const handleUpdate = async () => {
        const updatedModuleMenuData = {
            moduleMenuId: formData.moduleMenuId,
            menuId: formData.menuId,
            moduleId: formData.moduleId,
            mediaLink: formData.mediaLink,
            auditTrialId: formData.auditTrialId,
            isActive: formData.isActive,
        };
        await dispatch(updateModuleMenu(updatedModuleMenuData));
        dispatch(getAllModuleMenus({}));
        closePopup();
    };


    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    const getWarningMessage = () => {
        if (!menuList?.length && !modulesList?.length) {
            return "Both Menu List and Module List are empty. Please add menu items and modules first.";
        } else if (!menuList?.length) {
            return "Menu List is empty. Please add menu items first.";
        } else if (!modulesList?.length) {
            return "Module List is empty. Please add modules first.";
        }
        return "Please ensure all required data is available";
    };

    const handleWarningClose = () => {
        setShowWarningToast(false)
    }

    return (
        <>
            <div>
                {/* Display warning toast if menuList or modulesList is empty */}
                <FlexibleTable
                    data={moduleMenuData}
                    columns={moduleColumnConfig}
                    defaultItemsPerPage={10}
                    tableName="Add Module Menu Permissions"
                    createNewFn={handleAdd}
                    actionFn={handleEdit}
                    dependencies={[menuList, modulesList]}
                    // warningMessage="Please ensure both Menu List and Module List are available before creating a new Module Menu Permission"
                    warningMessage={getWarningMessage()}
                    openWarningTost={showWarningToast}
                    closeWarningTost={handleWarningClose} // Pass the close function
                />

                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between">
                                {isEditMode ? "Update Module Menu" : "Add Module Menu"}
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </h2>
                            <div className="space-y-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Menu ID <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="menuId"
                                        value={formData.menuId ?? ""}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full">

                                        <option value="" disabled hidden>
                                            Select Menu ID
                                        </option>
                                        {menuList?.map((menu: any) => (
                                            <option key={menu.menuId} value={menu.menuId}>
                                                {menu.menuName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.menuId && (
                                        <p className="pt-2 text-red-500 text-sm">{errors.menuId}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Module ID <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="moduleId"
                                        value={formData.moduleId ?? ""}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full">
                                        <option value="" disabled hidden>
                                            Select Module ID
                                        </option>
                                        {modulesList?.map((module: any) => (
                                            <option key={module.moduleId} value={module.moduleId}>
                                                {module.moduleName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.moduleId && (
                                        <p className="pt-2 text-red-500 text-sm">{errors.moduleId}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm">
                                        Media Link
                                    </label>
                                    <Input
                                        name="mediaLink"
                                        value={formData.mediaLink ?? ""}
                                        placeholder="Enter Media Link"
                                        onChange={handleInputChange}
                                        className="  mt-2   border-solid rounded-md text-sm  border-gray-300 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm">
                                        Status
                                    </label>
                                    <select
                                        name="isActive"
                                        value={formData.isActive ? "Active" : "Inactive"}
                                        onChange={handleInputChange}
                                        className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-10 flex justify-center space-x-4">
                                {/* <Button onClick={closePopup} className="w-28 py-2 text-white bg-gray-500 hover:bg-gray-600">Cancel</Button> */}
                                <Button onClick={isEditMode ? handleUpdate : handleSave} className="w-full bg-blue-500 text-white px-6 py-2 shadow-lg   text-white" disabled={isSaveDisabled(formData, validationRules)}>
                                    <IoSaveOutline className="text-lg mr-2" />
                                    {isEditMode ? "Update" : "Save"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div >

        </>
    );
}