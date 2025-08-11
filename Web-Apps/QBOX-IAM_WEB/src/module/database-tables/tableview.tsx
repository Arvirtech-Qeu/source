import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkDBTableNameExists, createDbTable, getAllDbTable, updateDbTable } from "@/redux/features/dbTableSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { JSXElementConstructor, ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaRegCheckCircle } from "react-icons/fa";


export default function TableView() {

    const dispatch = useDispatch();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { dbTableList, createDbTableResult } = useSelector((state: RootState) => state.tableSlice)
    const [errors, setErrors] = useState<any>({});
    const [nameExistsError, setNameExistsError] = useState<any>({});

    useEffect(() => {
        dispatch(getAllDbTable({}))
    }, [dispatch, createDbTableResult])

    // Adjust debounce time (in ms) as needed
    useEffect(() => {
        return () => {
            debouncedCheckDBTableName.cancel();
        };
    }, []);


    const databaseTableData = dbTableList && dbTableList.length > 0
        ? dbTableList.map((dbTable: any) => ({
            dbTableId: dbTable.dbTableId,
            dbTableName: dbTable.dbTableName,
            auditTrailId: dbTable.auditTrailId,
            isActive: dbTable.isActive ? "Active" : "InActive"
        })) : [];

    const [formData, setFormData]: any = useState({
        dbTableId: null,
        dbTableName: '',
        auditTrailId: '',
        isActive: true,
    });

    const validationRules = {
        dbTableName: { required: true, displayName: "DB Table Name" },
    };

    const resetForm = () => {
        setFormData({
            dbTableId: null,
            dbTableName: '',
            auditTrailId: '',
            isActive: true,
            action: ''
        });
        setErrors({});
        setNameExistsError({});
    };

    const databaseTableConfig = [
        { key: "dbTableName", header: "Table Name", sortable: true, filterable: true },
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
        setIsEditMode(false);
        setIsPopupOpen(true);
        resetForm();
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        resetForm();
    };

    const debouncedCheckDBTableName = useCallback(
        debounce(async (value: string, dispatch, setNameExistsError) => {
            try {
                const exists = await dispatch(checkDBTableNameExists(value)).unwrap();

                // Set error message based on availability
                setNameExistsError((prevErrors: any) => ({
                    ...prevErrors,
                    dbTableName: exists
                        ? "DB Table Name already taken!" // Red error
                        : "Db Table Name Available", // Green message
                }));
            } catch (error) {
                console.error("Error checking dbTableName:", error);
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

        // Debounced check for dbTableName
        // Trigger debounced check for dbTableName only if it's the relevant field
        if (name === "dbTableName" && value.trim().length > 2) {
            debouncedCheckDBTableName(value, dispatch, setNameExistsError);
        }

    };

    const handleSave = () => {
        const newTableData = {
            dbTableName: formData.dbTableName,
            isActive: formData.isActive ? true : false
        };
        dispatch(createDbTable(newTableData))
        closePopup();
    };

    const handleEdit = (row: {
        dbTableId: any;
        dbTableName: any;
        auditTrailId: any;
        isActive: any;
    }) => {
        // Convert `isActive` and `isTechModule` if needed
        const isActive = row.isActive === "Active" ? true : false;
        setFormData({
            dbTableId: row.dbTableId,
            dbTableName: row.dbTableName,
            auditTrailId: row.auditTrailId,
            isActive: isActive,
            action: "edit",
        });
        setIsEditMode(true);
        setIsPopupOpen(true);
    };

    const handleUpdate = async () => {
        const updatedData = {
            dbTableId: formData.dbTableId,  // Use the ID of the entry being edited
            dbTableName: formData.dbTableName,
            auditTrailId: formData.auditTrailId,
            isActive: formData.isActive
        };
        await dispatch(updateDbTable(updatedData));
        dispatch(getAllDbTable({}));
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    return (
        <>
            <FlexibleTable
                data={databaseTableData}
                columns={databaseTableConfig}
                defaultItemsPerPage={10}
                tableName="Add Database Table"
                createNewFn={handleAdd}
                actionFn={handleEdit}
            />

            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between ">
                            {isEditMode ? "Update DB Table" : "Add DB Table"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Table Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        name="dbTableName"
                                        value={formData.dbTableName}
                                        placeholder="Enter Table Name"
                                        onChange={handleInputChange ?? ""}
                                        onBlur={handleBlur}
                                        className="mt-2 text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm"
                                    />
                                    {/* Show icon and message only if dbTableName is not empty */}
                                    {formData.dbTableName.trim() !== "" && nameExistsError.dbTableName && (
                                        <>
                                            {nameExistsError.dbTableName === "DB Table Name already taken!" ? (
                                                <AiOutlineCloseCircle
                                                    className="absolute fill-current text-red-500 right-[1px] top-1/3 transform -translate-y-1/2 bg-red-50 rounded-full mx-1"
                                                />
                                            ) : (<FaRegCheckCircle className="absolute fill-current text-green-500 right-[1px] top-1/3 transform -translate-y-1/2 bg-red-50 rounded-full mx-1"
                                            />
                                            )}
                                            <p className={`pt-2 text-sm ${nameExistsError.dbTableName === "DB Table Name already taken!"
                                                ? "text-red-500"
                                                : "text-green-500"
                                                }`} >
                                                {nameExistsError.dbTableName}
                                            </p>
                                        </>
                                    )}
                                    {/* Display validation error if any */}
                                    {errors.dbTableName && (
                                        <p className="pt-2 text-red-500 text-sm">{errors.dbTableName}</p>
                                    )}
                                </div>
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
                            <Button
                                onClick={isEditMode ? handleUpdate : handleSave}
                                className="w-full bg-blue-500 text-white px-6 py-2 shadow-lg hover:shadow-xl  flex items-center justify-center space-x-2" disabled={isSaveDisabled(formData, validationRules)}>
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
