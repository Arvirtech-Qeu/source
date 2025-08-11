import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkPermissionNameExists, createPermissions, getAllPermissions, updatePermission } from "@/redux/features/permissionsSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { useCallback, useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

export default function Permissions() {

    const dispatch = useDispatch();
    const { permissionList, createPermissionsResult } = useSelector((state: RootState) => state.permissionSlice)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        dispatch(getAllPermissions({}))
    }, [dispatch, createPermissionsResult])

    // Adjust debounce time (in ms) as needed
    useEffect(() => {
        return () => {
            debouncedCheckPermissioName.cancel();
        };
    }, []);


    const permissionsData = permissionList && permissionList.length > 0
        ? permissionList.map((permission: any) => ({
            permissionId: permission.permissionId,
            permissionName: permission.permissionName,
            mediaLink: permission.mediaLink,
            auditTrailId: permission.auditTrailId,
            isActive: permission.isActive ? "Active" : "InActive"

        })) : [];

    const [formData, setFormData] = useState({
        permissionId: null,
        permissionName: '',
        mediaLink: '',
        isActive: true,
        auditTrailId: '',
        action: ''
    });

    const validationRules = {
        permissionName: { required: true, displayName: "Permission Name" },
    };

    const resetForm = () => {
        setFormData({
            permissionId: null,
            permissionName: '',
            mediaLink: '',
            isActive: true,
            auditTrailId: '',
            action: ''
        });
        setErrors({});
    };

    const permissionsColumnConfig = [
        { key: "permissionName", header: "Permission Name", sortable: true, filterable: true },
        { key: "mediaLink", header: "Media Link" },
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
    ];

    const handleAdd = () => {
        setIsEditMode(false);
        setIsPopupOpen(true);
        resetForm();
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        resetForm();
    };

    const debouncedCheckPermissioName = useCallback(
        debounce(async (value: string, dispatch, setErrors) => {
            try {
                const exists = await dispatch(checkPermissionNameExists(value)).unwrap();

                // Set error message based on availability
                setErrors((prevErrors: any) => ({
                    ...prevErrors,
                    permissionName: exists
                        ? "Permission Name already taken!" // Red error
                        : "Permission Name Available", // Green message
                }));
            } catch (error) {
                console.error("Error checking permissionName:", error);
            }
        }, 500),
        []
    );

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

        // Debounced check for permissionName
        // Trigger debounced check for permissionName only if it's the relevant field
        if (name === "permissionName" && value.trim().length > 2) {
            debouncedCheckPermissioName(value, dispatch, setErrors);
        }

    };

    const handleSave = () => {
        const newPermissionData = {
            permissionName: formData.permissionName,
            mediaLink: formData.mediaLink,
            isActive: formData.isActive ? true : false
        };
        dispatch(createPermissions(newPermissionData))
        closePopup();

        // Reset form fields
        setFormData({
            permissionId: null,
            permissionName: '',
            mediaLink: '',
            isActive: true,
            auditTrailId: '',
            action: 'create'
        });
        closePopup();
    };

    const handleEdit = (row: {
        permissionId: any;
        permissionName: any;
        isActive: any; // This should be a boolean, but might be a string in your case ("Active" or "Inactive")
        mediaLink: any;
        auditTrailId: any;
        isTechPermission?: any; // This might be a string like "Yes" or "No"
    }) => {
        const isActive = row.isActive === "Active" ? true : false; // Convert "Active" to true, "Inactive" to false

        setFormData({
            permissionId: row.permissionId,
            permissionName: row.permissionName,
            isActive: isActive, // Set as boolean
            mediaLink: row.mediaLink,
            auditTrailId: row.auditTrailId,
            action: "edit", // Mark as edit mode
        });
        setIsEditMode(true);  // Set edit mode flag
        setIsPopupOpen(true); // Open the popup for editing
    };


    const handleUpdate = async () => {
        const updatePermissionData = {
            permissionId: formData.permissionId,  // Use the ID of the entry being edited
            permissionName: formData.permissionName,
            auditTrailId: formData.auditTrailId,
            isActive: formData.isActive,
            mediaLink: formData.mediaLink
        };
        await dispatch(updatePermission(updatePermissionData));
        dispatch(getAllPermissions({}));
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    return (
        <>
            <FlexibleTable
                data={permissionsData}
                columns={permissionsColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Permissions"
                createNewFn={handleAdd}
                actionFn={handleEdit}
            />
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between">
                            {isEditMode ? "Update Permission" : "Add Permission"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex-1">
                                <label className="text-sm">
                                    Permission Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="permissionName"
                                    value={formData.permissionName ?? ""}
                                    placeholder="Enter Permission Name"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="  mt-2   border-solid rounded-md text-sm  border-gray-300 text-gray-700"
                                />
                                {errors.permissionName && (
                                    <p
                                        className={`pt-2 text-sm ${errors.permissionName === "Permission Name is required" ||
                                            errors.permissionName === "Permission Name already taken!"
                                            ? "text-red-500" // Red color for errors
                                            : "text-green-500" // Green color for success
                                            }`}
                                    >
                                        {errors.permissionName}
                                    </p>
                                )}
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">
                                    Media Link
                                </label>
                                <Input
                                    name="mediaLink"
                                    value={formData.mediaLink ?? ""}
                                    placeholder="Enter Permission Name"
                                    onChange={handleInputChange}
                                    className="  mt-2   border-solid rounded-md text-sm  border-gray-300 text-gray-700"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">
                                    Status
                                </label>
                                <select
                                    name="isActive"
                                    value={formData.isActive ? "Active" : "Inactive"}
                                    onChange={handleInputChange} // Add this line
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                        </div>
                        <div className="mt-10 flex justify-center space-x-4">
                            <Button onClick={isEditMode ? handleUpdate : handleSave} className="w-full bg-blue-500 text-white px-6 py-2 shadow-lg   text-white" disabled={isSaveDisabled(formData, validationRules)}>
                                <IoSaveOutline className="text-lg mr-2" />
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}