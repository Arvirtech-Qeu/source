import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRecordAction, getAllRecordAction, updateRecordAction } from "@/redux/features/recordActionSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { JSXElementConstructor, ReactElement, ReactNode, useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export default function RecordActionsTable() {

    const dispatch = useDispatch();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { recordActionList, createDbTableResult } = useSelector((state: RootState) => state.recordActionSlice)
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        dispatch(getAllRecordAction({}))
    }, [dispatch, createDbTableResult])

    const recordActionsData = recordActionList && recordActionList.length > 0
        ? recordActionList.map((record: { recordActionId: any; recordActionName: any; auditTrialId: any; isActive: any; }) => ({
            recordActionId: record.recordActionId,
            recordActionName: record.recordActionName,
            auditTrialId: record.auditTrialId,
            isActive: record.isActive ? "Active" : "InActive"
        })) : [];

    const [formData, setFormData]: any = useState({
        recordActionId: null,
        recordActionName: '',
        auditTrialId: '',
        isActive: true,
        action: '',
    });

    const validationRules = {
        recordActionName: { required: true, displayName: "Record Action Name" },
    };

    const resetForm = () => {
        setFormData({
            recordActionId: null,
            recordActionName: '',
            auditTrialId: '',
            isActive: true,
            action: ''
        });
        setErrors({});
    };

    const recordColumnConfig = [
        { key: "recordActionName", header: "Record Action Name", sortable: true, filterable: true },
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
        const newRecordActioneData = {
            recordActionName: formData.recordActionName,
            isActive: formData.isActive ? true : false
        };
        dispatch(createRecordAction(newRecordActioneData))
        closePopup();
        dispatch(getAllRecordAction({}))
    };

    const handleEdit = (row: {
        recordActionId: any;
        recordActionName: any;
        isActive: any;
        auditTrialId: any
    }) => {

        const isActive = row.isActive === "Active" ? true : false
        setFormData({
            recordActionId: row.recordActionId,
            recordActionName: row.recordActionName,
            isActive: isActive,
            auditTrialId: row.auditTrialId,
            action: 'edit'
        });
        setIsEditMode(true);
        setIsPopupOpen(true);
    };

    const handleUpdate = async () => {
        const updateRecordActionData = {
            recordActionId: formData.recordActionId,
            recordActionName: formData.recordActionName,
            auditTrialId: formData.auditTrialId,
            isActive: formData.isActive
        };
        await dispatch(updateRecordAction(updateRecordActionData));
        dispatch(getAllRecordAction({}));
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    return (
        <>
            <FlexibleTable
                data={recordActionsData}
                columns={recordColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Records with Actions"
                createNewFn={handleAdd}
                actionFn={handleEdit}
            />

            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between ">
                            {isEditMode ? "Update Record Action " : "Add Record Action"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex-1">
                                <label className="text-sm">
                                    Record Action Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="recordActionName"
                                    value={formData.recordActionName ?? ""}
                                    placeholder="Enter Table Name"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className="mt-2 text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm"
                                />
                                {errors.recordActionName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.recordActionName}</p>
                                )}
                            </div>

                            <div className="flex-1">
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