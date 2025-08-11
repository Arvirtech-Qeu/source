import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkServiceApiNameExists, createServiceApi, getAllServiceApi, updateServiceApi } from "@/redux/features/serviceApiSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { useCallback, useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaRegCheckCircle } from "react-icons/fa";

export default function ServiceApi() {

    const dispatch = useDispatch();
    const { serviceApiList, createServiceApiResult } = useSelector((state: RootState) => state.serviceApiSlice)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [nameExistsError, setNameExistsError] = useState<any>({});

    useEffect(() => {
        dispatch(getAllServiceApi({}))
    }, [dispatch, createServiceApiResult])

    // Adjust debounce time (in ms) as needed
    useEffect(() => {
        return () => {
            debouncedCheckServiceApiName.cancel();
        };
    }, []);

    const serviceApiData = serviceApiList && serviceApiList.length > 0
        ? serviceApiList.map((api: any) => ({
            serviceApiId: api.serviceApiId,
            serviceApiUrl: api.serviceApiUrl,
            serviceMethod: api.serviceMethod,
            auditTrailId: api.auditTrailId,
            isActive: api.isActive ? "Active" : "InActive"

        })) : [];

    const [formData, setFormData] = useState({
        serviceApiId: null,
        serviceApiUrl: '',
        serviceMethod: '',
        isActive: true,
        auditTrailId: '',
        action: ''
    });

    const validationRules = {
        serviceApiUrl: { required: true, displayName: "ServiveApi URL" },
        serviceMethod: { required: true, displayName: "Service Method" },
    };

    const resetForm = () => {
        setFormData({
            serviceApiId: null,
            serviceApiUrl: '',
            serviceMethod: '',
            isActive: true,
            auditTrailId: '',
            action: ''
        });
        setErrors({});
    };

    const serviceColumnConfig = [
        { key: "serviceApiUrl", header: "Service api url", sortable: true, filterable: true },
        { key: "serviceMethod", header: " Service method", sortable: true, filterable: true },
        {
            key: "isActive",
            header: "Status",
            sortable: true,
            // filterable: true,
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
    };

    const debouncedCheckServiceApiName = useCallback(
        debounce(async (value: string, dispatch, setNameExistsError) => {
            try {
                const exists = await dispatch(checkServiceApiNameExists(value)).unwrap();

                // Set error message based on availability
                setNameExistsError((prevErrors: any) => ({
                    ...prevErrors,
                    serviceApiUrl: exists
                        ? "ServiveApi URL already taken!" // Red error
                        : "ServiveApi URL Available", // Green message
                }));
            } catch (error) {
                console.error("Error checking serviceApiUrl:", error);
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

        // Debounced check for serviceApiUrl
        // Trigger debounced check for serviceApiUrl only if it's the relevant field
        if (name === "serviceApiUrl" && value.trim().length > 2) {
            debouncedCheckServiceApiName(value, dispatch, setNameExistsError);
        }

    };

    const handleSave = () => {
        const newServiceApiData = {
            serviceApiUrl: formData.serviceApiUrl,
            serviceMethod: formData.serviceMethod,
            isActive: formData.isActive ? true : false
        };
        dispatch(createServiceApi(newServiceApiData))
        closePopup();
        resetForm();
        closePopup();
    };

    const handleEdit = (row: {
        serviceApiId: any;
        serviceApiUrl: any;
        isActive: any; // This should be a boolean, but might be a string in your case ("Active" or "Inactive")
        serviceMethod: any;
        auditTrailId: any;
    }) => {
        // Convert `isActive` and `isTechserviceApiUrl` if needed
        const isActive = row.isActive === "Active" ? true : false; // Convert "Active" to true, "Inactive" to false

        setFormData({
            serviceApiId: row.serviceApiId,
            serviceApiUrl: row.serviceApiUrl,
            isActive: isActive, // Set as boolean
            serviceMethod: row.serviceMethod,
            auditTrailId: row.auditTrailId,
            action: "edit", // Mark as edit mode
        });
        setIsEditMode(true);  // Set edit mode flag
        setIsPopupOpen(true); // Open the popup for editing
    };


    const handleUpdate = async () => {
        const updateServiceApiData = {
            serviceApiId: formData.serviceApiId,  // Use the ID of the entry being edited
            serviceApiUrl: formData.serviceApiUrl,
            auditTrailId: formData.auditTrailId,
            isActive: formData.isActive,
            serviceMethod: formData.serviceMethod
        };
        await dispatch(updateServiceApi(updateServiceApiData));
        dispatch(getAllServiceApi({}));
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    return (
        <>
            <FlexibleTable
                data={serviceApiData}
                columns={serviceColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Service API"
                createNewFn={handleAdd}
                actionFn={handleEdit}
            />
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between">
                            {isEditMode ? "Update Service Api" : "Add Service Api"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex-1">
                                <label className="text-sm">
                                    Service Api Url<span className="text-red-500 p-1">*</span>
                                </label>
                                {/* <Input
                                    name="serviceApiUrl"
                                    value={formData.serviceApiUrl ?? ""}
                                    placeholder="Enter Service Api URL"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className=" mt-2   border-solid rounded-md text-sm  border-gray-300 text-gray-700"
                                />
                                {errors.serviceApiUrl && (
                                    <p
                                        className={`pt-2 text-sm ${errors.serviceApiUrl === "ServiveApi URL is required" ||
                                            errors.serviceApiUrl === "ServiveApi URL already taken!"
                                            ? "text-red-500" // Red color for errors
                                            : "text-green-500" // Green color for success
                                            }`}
                                    >
                                        {errors.serviceApiUrl}
                                    </p>
                                )} */}
                                <div className="relative">
                                    <Input
                                        name="serviceApiUrl"
                                        value={formData.serviceApiUrl}
                                        placeholder="Enter Service Api URL"
                                        onChange={handleInputChange ?? ""}
                                        onBlur={handleBlur}
                                        className="mt-2 text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm"
                                    />
                                    {/* Show icon and message only if serviceApiUrl is not empty */}
                                    {formData.serviceApiUrl.trim() !== "" && nameExistsError.serviceApiUrl && (
                                        <>
                                            {nameExistsError.serviceApiUrl === "ServiveApi URL already taken!" ? (
                                                <AiOutlineCloseCircle
                                                    className="absolute fill-current text-red-500 right-[1px] top-1/3 transform -translate-y-1/2 bg-red-50 rounded-full mx-1"
                                                />
                                            ) : (<FaRegCheckCircle className="absolute fill-current text-green-500 right-[1px] top-1/3 transform -translate-y-1/2 bg-red-50 rounded-full mx-1"
                                            />
                                            )}
                                            <p className={`pt-2 text-sm ${nameExistsError.serviceApiUrl === "ServiveApi URL already taken!"
                                                ? "text-red-500"
                                                : "text-green-500"
                                                }`} >
                                                {nameExistsError.serviceApiUrl}
                                            </p>
                                        </>
                                    )}
                                    {/* Display validation error if any */}
                                    {errors.serviceApiUrl && (
                                        <p className="pt-2 text-red-500 text-sm">{errors.serviceApiUrl}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm">
                                    Service Method<span className="text-red-500 p-1">*</span>
                                </label>
                                <Input
                                    name="serviceMethod"
                                    value={formData.serviceMethod ?? ""}
                                    placeholder="Enter Service Method"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className=" mt-2   border-solid rounded-md text-sm  border-gray-300 text-gray-700"
                                />
                                {errors.serviceMethod && (
                                    <p className="pt-2 text-red-500 text-sm">{errors.serviceMethod}</p>
                                )}
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




