import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPermissionServiceApi, getAllPermissionServiceApi, updatePermissionServiceApi } from "@/redux/features/permissionServiceApiSlice";
import { getAllPermissions } from "@/redux/features/permissionsSlice";
import { getAllServiceApi } from "@/redux/features/serviceApiSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export default function PermissionService() {

    const dispatch = useDispatch();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const { permissionServiceApiList, createPermissionServiceApiResult } = useSelector((state: RootState) => state.permissionServiceApiSlice)
    const { permissionList } = useSelector((state: RootState) => state.permissionSlice)
    const { serviceApiList } = useSelector((state: RootState) => state.serviceApiSlice)
    const [showWarningToast, setShowWarningToast] = useState(false);

    useEffect(() => {
        dispatch(getAllPermissionServiceApi({}))
        dispatch(getAllPermissions({}))
        dispatch(getAllServiceApi({}))
    }, [dispatch, createPermissionServiceApiResult])

    const permissionServiceApiData = permissionServiceApiList && permissionServiceApiList.length > 0
        ? permissionServiceApiList.map((permissionApi: any) => ({
            permissionServiceApiId: permissionApi.permissionServiceApiId,
            permissionId: permissionApi.permissionId,
            serviceApiId: permissionApi.serviceApiId,
            permissionName: permissionApi.permissionName,
            serviceApiUrl: permissionApi.serviceApiUrl,
            auditTrailId: permissionApi.auditTrailId,
            isActive: permissionApi.isActive ? "Active" : "InActive"

        })) : [];

    const [formData, setFormData] = useState({
        permissionServiceApiId: null,
        permissionId: null,
        serviceApiId: null,
        isActive: true,
        auditTrailId: '',
        action: ''

    });

    const validationRules = {
        permissionId: { required: true, displayName: "Permission ID" },
        serviceApiId: { required: true, displayName: "ServiceApi ID" },
    };

    const resetForm = () => {
        setFormData({
            permissionServiceApiId: null,
            permissionId: null,
            serviceApiId: null,
            isActive: true,
            auditTrailId: "",
            action: "",
        });
        setErrors({});
    };

    const permissionColumnConfig = [
        { key: "permissionName", header: "Permission Name", sortable: true, filterable: true },
        { key: "serviceApiUrl", header: "Service Api URL", sortable: true, filterable: true },
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
        // Check if either menuList or modulesList is empty
        if (!serviceApiList?.length || !permissionList?.length) {
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
        const newPermissionServiceApiData = {
            permissionId: formData.permissionId,
            serviceApiId: formData.serviceApiId,
            isActive: formData.isActive ? true : false
        };
        dispatch(createPermissionServiceApi(newPermissionServiceApiData))
        resetForm();
        closePopup();
    }

    const handleEdit = (row: {
        permissionServiceApiId: any,
        permissionId: any,
        serviceApiId: any,
        auditTrailId: any,
        isActive: any,
    }) => {
        // Convert `isActive` and `isTechModule` if needed
        const isActive = row.isActive === "Active" ? true : false;
        setFormData({
            permissionServiceApiId: row.permissionServiceApiId,
            permissionId: row.permissionId,
            serviceApiId: row.serviceApiId,
            auditTrailId: row.auditTrailId,
            isActive: isActive,
            action: "edit",
        });
        setIsEditMode(true);
        setIsPopupOpen(true);
    };

    const handleUpdate = async () => {
        const updatePermissionServiceApiDate = {
            permissionServiceApiId: formData.permissionServiceApiId,
            permissionId: formData.permissionId,
            serviceApiId: formData.serviceApiId,
            auditTrailId: formData.auditTrailId,
            isActive: formData.isActive,
        };
        await dispatch(updatePermissionServiceApi(updatePermissionServiceApiDate));
        dispatch(getAllPermissionServiceApi({}))
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    const getWarningMessage = () => {
        if (!serviceApiList?.length && !permissionList?.length) {
            return "Both ServiceApi List and Permission List are empty. Please add ServiceApi items and modules first.";
        } else if (!serviceApiList?.length) {
            return "ServiceApi List is empty. Please add ServiceApi items first.";
        } else if (!permissionList?.length) {
            return "Permission List is empty. Please add Permissions first.";
        }
        return "Please ensure all required data is available";
    };

    const handleWarningClose = () => {
        setShowWarningToast(false)
    }

    return (
        <div>
            <FlexibleTable
                data={permissionServiceApiData}
                columns={permissionColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Permission Service"
                createNewFn={handleAdd}
                actionFn={handleEdit}
                dependencies={[serviceApiList, permissionList]}
                // warningMessage="Please ensure both Menu List and Module List are available before creating a new Module Menu Permission"
                warningMessage={getWarningMessage()}
                openWarningTost={showWarningToast}
                closeWarningTost={handleWarningClose}
            />
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between">
                            {isEditMode ? "Update Permission Service " : "Add Permission Service"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm">
                                    Permission ID <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="permissionId"
                                    value={formData.permissionId ?? ""}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                >
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
                            <div>
                                <label className="text-sm">
                                    ServiceApi ID<span className="text-red-500 p-1">*</span>
                                </label>
                                <select
                                    name="serviceApiId"
                                    value={formData.serviceApiId ?? ""}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                >
                                    <option value="" disabled hidden>
                                        Select a ServiceApi ID
                                    </option>
                                    {serviceApiList?.map((serviceApi: any) => (
                                        <option key={serviceApi.serviceApiId} value={serviceApi.serviceApiId}>
                                            {serviceApi.serviceApiUrl}
                                        </option>
                                    ))}
                                </select>
                                {errors.serviceApiId && (
                                    <p className="pt-2 text-red-500 text-sm">{errors.serviceApiId}</p>
                                )}
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
                            <Button onClick={isEditMode ? handleUpdate : handleSave} className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700" disabled={isSaveDisabled(formData, validationRules)}>
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


