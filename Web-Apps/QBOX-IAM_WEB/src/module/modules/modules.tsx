import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkModuleNameExists, createModule, getAllModules, updateModule } from "@/redux/features/modulesSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { useState, useEffect, useCallback } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaRegCheckCircle } from "react-icons/fa";

export default function Modules() {

    const dispatch = useDispatch();
    const { modulesList, createModuleResult } = useSelector((state: RootState) => state.moduleSlice)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [nameExistsError, setNameExistsError] = useState<any>({});

    useEffect(() => {
        dispatch(getAllModules({}))
    }, [dispatch, createModuleResult])

    // Adjust debounce time (in ms) as needed
    useEffect(() => {
        return () => {
            debouncedCheckModuleName.cancel();
        };
    }, []);

    const moduleDatas = modulesList && modulesList.length > 0
        ? modulesList.map((module: any) => ({
            moduleId: module.moduleId,
            moduleName: module.moduleName,
            mediaLink: module.mediaLink,
            auditTrialId: module.auditTrialId,
            isTechModule: module.isTechModule ? "Yes" : "No",
            isActive: module.isActive ? "Active" : "InActive"

        })) : [];

    const [formData, setFormData] = useState({
        moduleId: null,
        moduleName: '',
        mediaLink: '',
        isTechModule: false,
        isActive: true,
        auditTrialId: '',
        action: ''

    });

    const validationRules = {
        moduleName: { required: true, displayName: "Module Name" },
    };

    const resetForm = () => {
        setFormData({
            moduleId: null,
            moduleName: "",
            mediaLink: "",
            isTechModule: false,
            isActive: true,
            auditTrialId: "",
            action: "",
        });
        setErrors({});
    };

    const moduleColumnConfig = [
        { key: "moduleName", header: "Module Name", sortable: true, filterable: true },
        { key: "mediaLink", header: "Media Link" },
        {
            key: "isTechModule",
            header: "Is Tech Module",
            sortable: true,
            filterable: true,
            render: (value: string) => (
                <span className={`px-2 py-1 text-sm font-medium rounded ${value === 'Yes' ? "text-blue-500" : "text-gray-500"}`}>
                    {value}
                </span>
            ),
        },
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
        setIsPopupOpen(true);
        setIsEditMode(false);
        resetForm();
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        resetForm();
    };

    const debouncedCheckModuleName = useCallback(
        debounce(async (value: string, dispatch, setNameExistsError) => {
            try {
                const exists = await dispatch(checkModuleNameExists(value)).unwrap();

                // Set error message based on availability
                setNameExistsError((prevErrors: any) => ({
                    ...prevErrors,
                    moduleName: exists
                        ? "Module Name already taken!" // Red error
                        : "Module Name Available", // Green message
                }));
            } catch (error) {
                console.error("Error checking moduleName:", error);
            }
        }, 500),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Mapping to convert select options to boolean values
        const booleanFields: Record<string, string> = {
            isTechModule: "Yes",
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

        // Debounced check for moduleName
        // Trigger debounced check for moduleName only if it's the relevant field
        if (name === "moduleName" && value.trim().length > 2) {
            debouncedCheckModuleName(value, dispatch, setNameExistsError);
        }

    };

    const handleSave = () => {
        const newModuleData = {
            moduleName: formData.moduleName,
            mediaLink: formData.mediaLink,
            isTechModule: formData.isTechModule ? true : false,
            isActive: formData.isActive ? true : false
        };
        dispatch(createModule(newModuleData))
        resetForm();
        closePopup();
    }

    const handleEdit = (row: {
        moduleId: any;
        moduleName: any;
        isActive: any;
        mediaLink: any;
        auditTrialId: any;
        isTechModule?: any;
    }) => {
        // Convert `isActive` and `isTechModule` if needed
        const isActive = row.isActive === "Active" ? true : false;
        const isTechModule = row.isTechModule === "Yes" ? true : false;

        setFormData({
            moduleId: row.moduleId,
            moduleName: row.moduleName,
            mediaLink: row.mediaLink,
            auditTrialId: row.auditTrialId,
            isTechModule: isTechModule,
            isActive: isActive,
            action: "edit",
        });
        setIsEditMode(true);
        setIsPopupOpen(true);
    };

    const handleUpdate = async () => {
        const updateModules = {
            moduleId: formData.moduleId,
            moduleName: formData.moduleName,
            auditTrialId: formData.auditTrialId,
            isActive: formData.isActive,
            isTechModule: formData.isTechModule,
            mediaLink: formData.mediaLink
        };
        await dispatch(updateModule(updateModules));
        dispatch(getAllModules({}));
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    return (
        <>
            <FlexibleTable
                data={moduleDatas}
                columns={moduleColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Module"
                createNewFn={handleAdd}
                actionFn={handleEdit}
            // deleteFn={handleDelete}  // Make sure your table supports delete action
            />

            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between ">
                            {isEditMode ? 'Edit Module' : 'Add Module'}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex-1">
                                <label className="text-sm">
                                    Module Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        name="moduleName"
                                        value={formData.moduleName}
                                        placeholder="Enter Module Name"
                                        onChange={handleInputChange ?? ""}
                                        onBlur={handleBlur}
                                        className="mt-2 text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm"
                                    />
                                    {/* Show icon and message only if moduleName is not empty */}
                                    {formData.moduleName.trim() !== "" && nameExistsError.moduleName && (
                                        <>
                                            {nameExistsError.moduleName === "Module Name already taken!" ? (
                                                <AiOutlineCloseCircle
                                                    className="absolute fill-current text-red-500 right-[1px] top-1/3 transform -translate-y-1/2 bg-red-50 rounded-full mx-1"
                                                />
                                            ) : (<FaRegCheckCircle className="absolute fill-current text-green-500 right-[1px] top-1/3 transform -translate-y-1/2 bg-red-50 rounded-full mx-1"
                                            />
                                            )}
                                            <p className={`pt-2 text-sm ${nameExistsError.moduleName === "Module Name already taken!"
                                                ? "text-red-500"
                                                : "text-green-500"
                                                }`} >
                                                {nameExistsError.moduleName}
                                            </p>
                                        </>
                                    )}
                                    {/* Display validation error if any */}
                                    {errors.moduleName && (
                                        <p className="pt-2 text-red-500 text-sm">{errors.moduleName}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm">
                                    Media Link
                                </label>
                                <Input
                                    name="mediaLink"
                                    value={formData.mediaLink || ""}
                                    placeholder="Enter Media Link"
                                    onChange={handleInputChange}
                                    className="mt-2 text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm pb-2">
                                    Is TechModule
                                </label>
                                <select
                                    name="isTechModule"
                                    value={formData.isTechModule ? "Yes" : "No"}
                                    onChange={handleInputChange} // Add this line
                                    className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
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
                            <Button onClick={isEditMode ? handleUpdate : handleSave} className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700" disabled={isSaveDisabled(formData, validationRules)}>
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
