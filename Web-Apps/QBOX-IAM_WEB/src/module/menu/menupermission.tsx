import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { FlexibleTable } from "@/components/FlexibleTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createMenuPermission, getAllMenuPermission, updateMenuPermission } from "@/redux/features/menuPermissionSlice";
import { IoSaveOutline } from "react-icons/io5";
import { getAllMenu } from "@/redux/features/menuSlice";
import { getAllPermissions } from "@/redux/features/permissionsSlice";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";

export default function MenuPermissions() {

    const dispatch = useDispatch();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { menuPermissionList, createMenuPermissionResult } = useSelector((state: RootState) => state.menuPermissionSlice)
    const { menuList } = useSelector((state: RootState) => state.menuSlice)
    const { permissionList } = useSelector((state: RootState) => state.permissionSlice)
    const [errors, setErrors] = useState<any>({});
    const [showWarningToast, setShowWarningToast] = useState(false);

    useEffect(() => {
        dispatch(getAllMenuPermission({}))
        dispatch(getAllMenu({}))
        dispatch(getAllPermissions({}))
    }, [dispatch, createMenuPermissionResult])

    const menuPermissionsData = menuPermissionList && menuPermissionList.length > 0
        ? menuPermissionList.map((menuPermission: any) => ({
            menuPermissionId: menuPermission.menuPermissionId,
            menuId: menuPermission.menuId,
            permissionId: menuPermission.permissionId,
            menuName: menuPermission.menuName,
            permissionName: menuPermission.permissionName,
            mediaLink: menuPermission.mediaLink,
            auditTrialId: menuPermission.auditTrialId,
            isActive: menuPermission.isActive ? "Active" : "InActive"
        })) : [];

    const [formData, setFormData]: any = useState({
        menuPermissionId: null,
        menuId: '',
        permissionId: '',
        mediaLink: '',
        auditTrialId: '',
        isActive: true,
    });

    const validationRules = {
        menuId: { required: true, displayName: "Menu ID" },
        permissionId: { required: true, displayName: "Permission ID" },
    };

    const resetForm = () => {
        setFormData({
            menuPermissionId: null,
            menuId: '',
            permissionId: '',
            mediaLink: '',
            auditTrialId: '',
            isActive: true,
        });
        setErrors({});
    };

    const menuColumnConfig = [
        { key: "menuName", header: "Menu Name", sortable: true, filterable: true },
        { key: "permissionName", header: "Permission Name", sortable: true, filterable: true },
        { key: "mediaLink", header: "Media Link" },
        {
            key: "isActive",
            header: "Status",
            sortable: true,
            filterable: true,
            render: (value: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => (
                <span
                    className={`px-2 py-1 text-sm font-medium rounded ${value === "Active" ? "text-green-500" : "text-gray-500"
                        }`}
                >
                    {value}
                </span>
            ),
        },
    ];

    const handleAdd = () => {
        // Check if either menuList or PermissionList is empty
        if (!menuList?.length || !permissionList?.length) {
            setShowWarningToast(true);
            return; // Don't open the popup if lists are empty
        }
        setIsEditMode(false);
        setIsPopupOpen(true);
        resetForm();
    };


    const closePopup = () => {
        setIsPopupOpen(false);
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
        const newMenuPermissionData = {
            menuId: formData.menuId,
            permissionId: formData.permissionId,
            mediaLink: formData.mediaLink,
            isActive: formData.isActive ? true : false
        };
        dispatch(createMenuPermission(newMenuPermissionData))
        closePopup();
    };

    const handleEdit = (row: {
        menuPermissionId: any;
        menuId: any;
        permissionId: any,
        mediaLink: any,
        auditTrialId: any;
        isActive: any;
    }) => {
        // Convert `isActive` and `isTechModule` if needed
        const isActive = row.isActive === "Active" ? true : false;
        setFormData({
            menuPermissionId: row.menuPermissionId,
            menuId: row.menuId,
            permissionId: row.permissionId,
            mediaLink: row.mediaLink,
            auditTrialId: row.auditTrialId,
            isActive: isActive,
            action: "edit",
        });
        setIsEditMode(true);
        setIsPopupOpen(true);
    };

    const handleUpdate = async () => {
        const updatedMenuPermissionData = {
            menuPermissionId: formData.menuPermissionId,
            menuId: formData.menuId,
            permissionId: formData.permissionId,
            mediaLink: formData.mediaLink,
            auditTrialId: formData.auditTrialId,
            isActive: formData.isActive
        };
        await dispatch(updateMenuPermission(updatedMenuPermissionData));
        dispatch(getAllMenuPermission({}))
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    const getWarningMessage = () => {
        if (!menuList?.length && !permissionList?.length) {
            return "Both Menu List and Permission List are empty. Please add menu items and Permission first.";
        } else if (!menuList?.length) {
            return "Menu List is empty. Please add menu items first.";
        } else if (!permissionList?.length) {
            return "Permission List is empty. Please add Permission first.";
        }
        return "Please ensure all required data is available";
    };

    const handleWarningClose = () => {
        setShowWarningToast(false)
    }

    return (
        <div>
            <FlexibleTable
                data={menuPermissionsData}
                columns={menuColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Menu Permissions"
                createNewFn={handleAdd}
                actionFn={handleEdit}
                dependencies={[menuList, permissionList]}
                warningMessage={getWarningMessage()}
                openWarningTost={showWarningToast}
                closeWarningTost={handleWarningClose}
            />
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between ">
                            {isEditMode ? "Update Menu Permission" : "Add Menu Permission"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-700 font-medium">
                                    Menu ID <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="menuId"
                                    value={formData.menuId ?? ""}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                >
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
                                <label className="text-sm text-gray-700 font-medium ">
                                    Permission ID  <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="permissionId"
                                    value={formData.permissionId ?? ""}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                >
                                    <option value="" disabled hidden>
                                        Select Permission ID
                                    </option>
                                    {permissionList?.map((permission: any) => (
                                        <option key={permission.permissionId} value={permission.permissionId}>
                                            {permission.permissionName}
                                        </option>
                                    ))}
                                </select>
                                {errors.permissionId && (
                                    <p className="pt-2 text-red-500 text-sm">{errors.permissionId}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Media Link
                                </label>
                                <Input
                                    name="mediaLink"
                                    value={formData.mediaLink ?? ""}
                                    onChange={handleInputChange}
                                    placeholder="Enter Media Link"
                                    className="mt-2 text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700">
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
                        <div className="mt-8 flex justify-center space-x-4">
                            <Button
                                onClick={isEditMode ? handleUpdate : handleSave} disabled={isSaveDisabled(formData, validationRules)}
                                className="w-full bg-blue-500 text-white px-6 py-2 shadow-lg hover:shadow-xl  flex items-center justify-center space-x-2"
                            >
                                <IoSaveOutline className="text-lg mr-2" />
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
