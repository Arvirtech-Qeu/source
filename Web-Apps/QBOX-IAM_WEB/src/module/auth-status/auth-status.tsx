import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAuthStatus, getAllAuthStatuses, updateAuthStatus } from "@/redux/features/authStatusSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { useState, useEffect } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";


export default function AuthStatus() {

    const dispatch = useDispatch();
    const { authStatusList, createAuthStatusResult } = useSelector((state: RootState) => state.authStatusSlice)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        dispatch(getAllAuthStatuses({}))
    }, [dispatch, createAuthStatusResult])

    const authStatusData = authStatusList && authStatusList.length > 0
        ? authStatusList.map((permission: any) => ({
            authStatusId: permission.authStatusId,
            authStatusName: permission.authStatusName,
            mediaLink: permission.mediaLink,
            auditTrailId: permission.auditTrailId,
            isActive: permission.isActive ? "Active" : "InActive"

        })) : [];

    const [formData, setFormData] = useState({
        authStatusId: null,
        authStatusName: '',
        mediaLink: '',
        isActive: true,
        auditTrailId: '',
        action: ''
    });

    const validationRules = {
        authStatusName: { required: true, displayName: "Auth Status" },
    };

    const resetForm = () => {
        setFormData({
            authStatusId: null,
            authStatusName: '',
            mediaLink: '',
            isActive: true,
            auditTrailId: '',
            action: ''
        });
        setErrors({});
    };

    const authColumnConfig = [
        { key: "authStatusName", header: "AuthStatusName", sortable: true, filterable: true },
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
        const newAuthStatusData = {
            authStatusName: formData.authStatusName,
            mediaLink: formData.mediaLink,
            isActive: formData.isActive ? true : false
        };
        dispatch(createAuthStatus(newAuthStatusData))
        // Close the popup
        closePopup();
        resetForm();
        closePopup();
    };

    const handleEdit = (row: {
        authStatusId: any;
        authStatusName: any;
        isActive: any; // This should be a boolean, but might be a string in your case ("Active" or "Inactive")
        mediaLink: any;
        auditTrailId: any;
    }) => {
        // Convert `isActive` and `isTechModule` if needed
        const isActive = row.isActive === "Active" ? true : false; // Convert "Active" to true, "Inactive" to false

        setFormData({
            authStatusId: row.authStatusId,
            authStatusName: row.authStatusName,
            isActive: isActive, // Set as boolean
            mediaLink: row.mediaLink,
            auditTrailId: row.auditTrailId,
            action: "edit", // Mark as edit mode
        });
        setIsEditMode(true);  // Set edit mode flag
        setIsPopupOpen(true); // Open the popup for editing
    };

    const handleUpdate = async () => {
        const updateAuthStatusData = {
            authStatusId: formData.authStatusId,  // Use the ID of the entry being edited
            authStatusName: formData.authStatusName,
            auditTrailId: formData.auditTrailId,
            isActive: formData.isActive,
            mediaLink: formData.mediaLink
        };
        await dispatch(updateAuthStatus(updateAuthStatusData));
        dispatch(getAllAuthStatuses({}));
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    return (
        <div>
            <FlexibleTable
                data={authStatusData}
                columns={authColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Authentication Status"
                createNewFn={handleAdd}
                actionFn={handleEdit}
            />
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800  flex justify-between ">
                            {isEditMode ? "Update Authentication status" : "Add Authentication status"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex-1">
                                <label className="text-sm">
                                    Auth Status Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="authStatusName"
                                    value={formData.authStatusName ?? ""}
                                    placeholder="Enter Auth Status Name"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className=" mt-2  border-solid rounded-md text-sm  border-gray-300 text-gray-700"
                                />
                                {errors.authStatusName && (
                                    <p className="pt-2 text-red-500 text-sm">{errors.authStatusName}</p>
                                )}
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">
                                    Media Link <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="mediaLink"
                                    value={formData.mediaLink ?? ""}
                                    placeholder="Enter Media Link"
                                    onChange={handleInputChange}
                                    className=" mt-2   border-solid rounded-md text-sm  border-gray-300 text-gray-700"

                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">
                                    Status <span className="text-red-500">*</span>
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