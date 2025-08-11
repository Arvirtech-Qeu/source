import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { FlexibleTable } from "@/components/FlexibleTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createRolePermission, getAllRolePermission, updateRolePermission } from "@/redux/features/rolePermissionSlice";
import { RootState } from "@/redux/store";
import { getAllRole } from "@/redux/features/roleSlice";
import { getAllPermissions } from "@/redux/features/permissionsSlice";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { IoSaveOutline } from "react-icons/io5";
import { getAllMenu } from "@/redux/features/menuSlice";

export default function MenuPermissions() {

    const dispatch = useDispatch();
    const { rolePermissionList, createRolePermissionResult } = useSelector((state: RootState) => state.rolePermissionSlice)
    const { roleList } = useSelector((state: RootState) => state.roleSlice)
    const { menuList } = useSelector((state: RootState) => state.menuSlice)
    const { permissionList } = useSelector((state: RootState) => state.permissionSlice)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [showWarningToast, setShowWarningToast] = useState(false);

    useEffect(() => {
        dispatch(getAllRolePermission({}))
        dispatch(getAllRole({}))
        dispatch(getAllMenu({}))
        dispatch(getAllPermissions({}))
    }, [dispatch, createRolePermissionResult])

    const rolePermissionData = rolePermissionList && rolePermissionList.length > 0
        ? rolePermissionList?.map((rolePermission: any) => ({
            rolePermissionId: rolePermission.rolePermissionId,
            roleId: rolePermission.roleId,
            menuId: rolePermission.menuId,
            permissionId: rolePermission.permissionId,
            roleName: rolePermission.roleName,
            menuName: rolePermission.menuName,
            permissionName: rolePermission.permissionName,
            auditTrialId: rolePermission.auditTrialId,
            mediaLink: rolePermission.mediaLink,
            isActive: rolePermission.isActive ? "Active" : "InActive"
        })) : [];

    const [formData, setFormData]: any = useState({
        rolePermissionId: null,
        roleId: null,
        menuId: null,
        permissionId: null,
        mediaLink: '',
        auditTrialId: '',
        isActive: true,
    });

    const validationRules = {
        roleId: { required: true, displayName: "RoleID" },
        permissionId: { required: true, displayName: "PermissionID" },
    };

    const resetForm = () => {
        setFormData({
            rolePermissionId: null,
            roleId: '',
            menuId: '',
            permissionId: '',
            isActive: true,
            auditTrialId: '',
            action: ''
        });
        setErrors({});
    };

    const menuColumnConfig = [
        { key: "roleName", header: "Role" },
        { key: "menuName", header: "Menu" },
        { key: "permissionName", header: "Permission" },
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
        // Check if either menuList or modulesList is empty
        if (!menuList?.length || !permissionList?.length || !roleList?.length) {
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
        const newRolePermissionData = {
            roleId: formData.roleId,
            menuId: formData.menuId,
            permissionId: formData.permissionId,
            mediaLink: formData.mediaLink,
            isActive: formData.isActive,
        };
        dispatch(createRolePermission(newRolePermissionData))
        // Close the popup
        closePopup();
    };

    const handleEdit = (row: {
        rolePermissionId: any;
        roleId: any;
        menuId: any,
        permissionId: any;
        mediaLink: any;
        auditTrialId: any;
        isActive: any;
    }) => {
        // Convert `isActive` and `isTechModule` if needed
        const isActive = row.isActive === "Active" ? true : false; // Convert "Active" to true, "Inactive" to false
        setFormData({
            rolePermissionId: row.rolePermissionId,
            roleId: row.roleId,
            menuId: row.menuId,
            permissionId: row.permissionId,
            mediaLink: row.mediaLink,
            auditTrialId: row.auditTrialId,
            isActive: isActive,
            action: "edit", // Mark as edit mode
        });
        setIsEditMode(true);  // Set edit mode flag
        setIsPopupOpen(true); // Open the popup for editing
    };


    const handleUpdate = async () => {
        const updateRolePermissionData = {
            rolePermissionId: formData.rolePermissionId,  // Use the ID of the entry being edited
            roleId: formData.roleId,
            menuId: formData.menuId,
            auditTrialId: formData.auditTrialId,
            isActive: formData.isActive,
            permissionId: formData.permissionId,
            mediaLink: formData.mediaLink,
        };
        await dispatch(updateRolePermission(updateRolePermissionData));
        dispatch(getAllRolePermission({}))
        closePopup();
    };


    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    const getWarningMessage = () => {
        if (!menuList?.length && !permissionList?.length && !roleList?.length) {
            return "The Menu, Role, and Permission lists are empty. Please add Menus, Roles, and Modules first.";
        } else if (!menuList?.length && !permissionList?.length) {
            return "Both the Menu and Permission lists are empty. Please add Menus and Permissions first.";
        } else if (!menuList?.length && !roleList?.length) {
            return "Both the Menu and Role lists are empty. Please add Menus and Roles first.";
        } else if (!permissionList?.length && !roleList?.length) {
            return "Both the Permission and Role lists are empty. Please add Permissions and Roles first.";
        } else if (!menuList?.length) {
            return "The Menu List is empty. Please add Menu items first.";
        } else if (!permissionList?.length) {
            return "The Permission List is empty. Please add Permissions first.";
        } else if (!roleList?.length) {
            return "The Role List is empty. Please add Roles first.";
        }
        return "Please ensure all required data is available.";
    };


    const handleWarningClose = () => {
        setShowWarningToast(false)
    }

    return (
        <div>
            <FlexibleTable
                data={rolePermissionData}
                columns={menuColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Role Permissions"
                createNewFn={handleAdd}
                actionFn={handleEdit}
                dependencies={[menuList, permissionList, roleList]}
                warningMessage={getWarningMessage()}
                openWarningTost={showWarningToast}
                closeWarningTost={handleWarningClose}
            />
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between">
                            {isEditMode ? "Update Role Permission" : "Add Role Permission"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex-1">
                                <label className="text-sm">
                                    Select Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="roleId"
                                    value={formData.roleId ?? ""}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                >
                                    <option value="" disabled hidden>
                                        Select a role
                                    </option>
                                    {roleList?.map((role: any) => (
                                        <option key={role.roleId} value={role.roleId}>
                                            {role.roleName}
                                        </option>
                                    ))}
                                </select>
                                {errors.roleId && (
                                    <p className="pt-2 text-red-500 text-sm">{errors.roleId}</p>
                                )}
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">
                                    Select Menu <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="menuId"
                                    value={formData.menuId ?? ""}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                >
                                    <option value="" disabled hidden>
                                        Select a Menu
                                    </option>
                                    {menuList?.map((menu: any) => (
                                        <option key={menu.menuId} value={menu.menuId}>
                                            {menu.menuName}
                                        </option>
                                    ))}
                                </select>
                                {errors.roleId && (
                                    <p className="pt-2 text-red-500 text-sm">{errors.roleId}</p>
                                )}
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">
                                    Select Role Permission <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="permissionId"
                                    value={formData.permissionId ?? ""}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full">

                                    <option value="" disabled hidden>
                                        Select a Permission
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
                                <label className="text-sm">
                                    Media Link
                                </label>
                                <Input
                                    name="mediaLink"
                                    value={formData.mediaLink ?? ""}
                                    placeholder="Enter Media Link"
                                    onChange={handleInputChange}
                                    className="mt-2   border-solid rounded-md text-sm  border-gray-300 text-gray-700"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm pb-2">
                                    Status
                                </label>
                                <select
                                    name="isActive"
                                    value={formData.isActive ? "Active" : "Inactive"} // Display "Active" or "Inactive" based on boolean
                                    onChange={handleInputChange} // Update the boolean value in formData
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
        </div>
    );
}