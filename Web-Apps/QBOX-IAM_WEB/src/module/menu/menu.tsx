import { FlexibleTable } from "@/components/FlexibleTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkMenuNameExists, createMenu, getAllMenu, updateMenu } from "@/redux/features/menuSlice";
import { RootState } from "@/redux/store";
import { isSaveDisabled, validateFieldOnBlur } from "@/utils/validation";
import { useCallback, useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaRegCheckCircle } from "react-icons/fa";


export default function Menu() {

    const dispatch = useDispatch();
    const { menuList, createMenuResult } = useSelector((state: RootState) => state.menuSlice)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [nameExistsError, setNameExistsError] = useState<any>({});


    useEffect(() => {
        dispatch(getAllMenu({}))
    }, [dispatch, createMenuResult])

    // Adjust debounce time (in ms) as needed
    useEffect(() => {
        return () => {
            debouncedCheckMenuName.cancel();
        };
    }, []);

    const menuData = menuList && menuList.length > 0
        ? menuList.map((menu: any) => ({
            menuId: menu.menuId,
            menuName: menu.menuName,
            parentId: menu.parentId,
            menuLevel: menu.menuLevel,
            menuRoute: menu.menuRoute,
            menuLink: menu.menuLink,
            menuIcon: menu.menuIcon,
            menuSortOrder: menu.menuSortOrder,
            mediaLink: menu.mediaLink,
            auditTrialId: menu.auditTrialId,
            isActive: menu.isActive ? "Active" : "InActive"
        })) : [];

    const [formData, setFormData]: any = useState({
        menuId: null,
        menuName: '',
        parentId: null,
        menuLevel: null,
        menuRoute: '',
        menuLink: '',
        menuIcon: '',
        menuSortOrder: null,
        mediaLink: '',
        auditTrialId: '',
        isActive: true,
    });

    const validationRules = {
        menuName: { required: true, displayName: "Menu Name" },
        menuRoute: { required: true, displayName: "Menu Route" },
        menuLink: { required: true, displayName: "Menu Link" },
    };

    const resetForm = () => {
        setFormData({
            menuId: null,
            menuName: '',
            parentId: null,
            menuLevel: null,
            menuRoute: '',
            menuLink: '',
            menuIcon: '',
            menuSortOrder: null,
            mediaLink: '',
            auditTrialId: '',
            isActive: true,
        });
        setErrors({});
    };

    const menuColumnConfig = [
        { key: "menuName", header: "Menu Name", sortable: true, filterable: true },
        { key: "menuRoute", header: "Menu Route", sortable: true, filterable: false },
        { key: "menuLink", header: "Menu Name", sortable: true, filterable: false },
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

    const debouncedCheckMenuName = useCallback(
        debounce(async (value: string, dispatch, setNameExistsError) => {
            try {
                const exists = await dispatch(checkMenuNameExists(value)).unwrap();

                // Set error message based on availability
                setNameExistsError((prevErrors: any) => ({
                    ...prevErrors,
                    menuName: exists
                        ? "Menu Name already taken!" // Red error
                        : "Menu Name Available", // Green message
                }));
            } catch (error) {
                console.error("Error checking menuName:", error);
            }
        }, 500),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const booleanFields: Record<string, string> = {
            isActive: "Active",
        };
        setFormData({
            ...formData,
            [name]: booleanFields[name] ? value === booleanFields[name] : value,
        });
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: "",
        }));

        // Debounced check for MenuName
        // Trigger debounced check for MenuName only if it's the relevant field
        if (name === "menuName" && value.trim().length > 2) {
            debouncedCheckMenuName(value, dispatch, setNameExistsError);
        }
    };


    const handleSave = () => {
        const newMenuData = {
            menuName: formData.menuName,
            parentId: formData.parentId,
            menuLevel: formData.menuLevel,
            menuRoute: formData.menuRoute,
            menuLink: formData.menuLink,
            menuIcon: formData.menuIcon,
            menuSortOrder: formData.menuSortOrder,
            mediaLink: formData.mediaLink,
            auditTrialId: formData.auditTrialId,
            isActive: formData.isActive,
        };
        dispatch(createMenu(newMenuData))
        closePopup();
    };

    const handleEdit = (row: {
        menuId: any;
        menuName: any,
        parentId: any,
        menuLevel: any,
        menuRoute: any,
        menuLink: any,
        menuIcon: any,
        menuSortOrder: any,
        mediaLink: any,
        auditTrialId: any,
        isActive: any
    }) => {
        // Convert `isActive` and `isTechMenu` if needed
        const isActive = row.isActive === "Active" ? true : false;

        setFormData({
            menuId: row.menuId,
            menuName: row.menuName,
            parentId: row.parentId,
            menuLevel: row.menuLevel,
            menuRoute: row.menuRoute,
            menuLink: row.menuLink,
            menuIcon: row.menuIcon,
            menuSortOrder: row.menuSortOrder,
            mediaLink: row.mediaLink,
            auditTrialId: row.auditTrialId,
            isActive: isActive,
            action: "edit",
        });
        setIsEditMode(true);  // Set edit mode flag
        setIsPopupOpen(true); // Open the popup for editing
    };

    const handleUpdate = async () => {
        const updateMenuData = {
            menuId: formData.menuId,
            menuName: formData.menuName,
            parentId: formData.parentId,
            menuLevel: formData.menuLevel,
            menuRoute: formData.menuRoute,
            menuLink: formData.menuLink,
            menuIcon: formData.menuIcon,
            menuSortOrder: formData.menuSortOrder,
            mediaLink: formData.mediaLink,
            auditTrialId: formData.auditTrialId,
            isActive: formData.isActive,
        };
        await dispatch(updateMenu(updateMenuData));
        dispatch(getAllMenu({}));
        closePopup();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };

    return (
        <>
            <FlexibleTable
                data={menuData}
                columns={menuColumnConfig}
                defaultItemsPerPage={10}
                tableName="Add Menu"
                createNewFn={handleAdd}
                actionFn={handleEdit}
            />

            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center flex justify-end z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 shadow-lg w-2/4 h-full  max-h-full overflow-y-auto ">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex justify-between ">
                            {isEditMode ? "Update Menu" : "Add Menu"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" onClick={closePopup} className="bi bi-x cursor-pointer" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </h2>

                        <div className="space-y-4 ">
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Menu Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            name="menuName"
                                            value={formData.menuName ?? ""}
                                            placeholder="Enter Menu Name"
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className="mt-2 text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm"
                                        />
                                        {/* Show icon and message only if menuName is not empty */}
                                        {formData.menuName.trim() !== "" && nameExistsError.menuName && (
                                            <>
                                                {nameExistsError.menuName === "Menu Name already taken!" ? (
                                                    <AiOutlineCloseCircle
                                                        className="absolute fill-current text-red-500 right-[1px] top-1/3 transform -translate-y-1/2 bg-red-50 rounded-full mx-1"
                                                    />
                                                ) : (<FaRegCheckCircle className="absolute fill-current text-green-500 right-[1px] top-1/3 transform -translate-y-1/2 bg-red-50 rounded-full mx-1"
                                                />
                                                )}
                                                <p className={`pt-2 text-sm ${nameExistsError.menuName === "Menu Name already taken!"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                                    }`} >
                                                    {nameExistsError.menuName}
                                                </p>
                                            </>
                                        )}
                                        {/* Display validation error if any */}
                                        {errors.menuName && (
                                            <p className="pt-2 text-red-500 text-sm">{errors.menuName}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Menu Route <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="menuRoute"
                                        value={formData.menuRoute ?? ""}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter Menu Route"
                                        className=" mt-3 w-full text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm "
                                    />
                                    {errors.menuRoute && (
                                        <p className="pt-2 text-red-500 text-sm">{errors.menuRoute}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Menu Link <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="menuLink"
                                        value={formData.menuLink ?? ""}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter Menu Link"
                                        className=" mt-3 w-full text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm "
                                    />
                                    {errors.menuLink && (
                                        <p className="pt-2 text-red-500 text-sm">{errors.menuLink}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Menu Sort Order
                                    </label>
                                    <Input
                                        name="menuSortOrder"
                                        value={formData.menuSortOrder ?? ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter Menu Sort Order"
                                        className="mt-3 w-full text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm "
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Menu Level
                                    </label>
                                    <Input
                                        name="menuLevel"
                                        value={formData.menuLevel ?? ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter Menu Level"
                                        className=" mt-3 w-full text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm "
                                    />
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Menu Icon
                                    </label>
                                    <Input
                                        name="menuIcon"
                                        value={formData.menuIcon ?? ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter Menu Icon"
                                        className="mt-3 w-full text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm "
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Parent ID
                                    </label>
                                    <select
                                        name="parentId"
                                        value={formData.parentId ?? ""}
                                        onChange={handleInputChange}
                                        className="mt-2 bg-zinc-100 border border-gray-300 focus:border-blue-700 text-gray-700 text-black text-sm p-2 rounded w-full"
                                    >
                                        <option value="" disabled hidden>
                                            Select Parent ID
                                        </option>
                                        {(menuList)?.map((menu: any) => (
                                            <option key={menu.menuId} value={menu.menuId}>
                                                {menu.menuName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
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

                            <div className="flex-1">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Media Link
                                </label>
                                <Input
                                    name="mediaLink"
                                    value={formData.mediaLink ?? ""}
                                    onChange={handleInputChange}
                                    placeholder="Enter Media Link"
                                    className="mt-3 w-1/2 text-gray-700 rounded-md border-solid border-gray-300 px-3 py-2 text-sm "
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center space-x-4">
                            <Button
                                onClick={isEditMode ? handleUpdate : handleSave}
                                className="w-96 bg-blue-500 text-white px-6 py-2 shadow-lg hover:shadow-xl  flex items-center justify-center space-x-2" disabled={isSaveDisabled(formData, validationRules)}>
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
