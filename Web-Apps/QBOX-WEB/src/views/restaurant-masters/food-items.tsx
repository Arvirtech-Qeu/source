
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MapPin, Globe, Building2, Home, Utensils, Pizza, Barcode, ChefHat, QrCode, SearchX } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import Card from '@components/card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { createFoodSku, deleteFoodSku, editFoodSku, getAllFoodSku } from '@state/foodSkuSlice';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { Pagination } from '@components/pagination';
import { getRestaurantBrandCd } from '@state/restaurantSlice';

interface FoodSkuData {
    foodSkuSno: number;
    restaurantBrandCd: string;
    foodName: string;
    skuCode: string;
    activeFlag: boolean;
}

interface FoodSkuFormData {
    foodSkuSno: number | null;
    restaurantBrandCd: string;
    foodName: string;
    skuCode: string;
    activeFlag: boolean;
}
interface CodeDtlData {
    codesDtlSno: number;
    description: string;

}


export default function FoodSku() {

    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedFoodSku, setSelectedFoodSku] = React.useState<FoodSkuData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const { foodSkuList } = useSelector((state: RootState) => state.foodSku);
    const { restaurantBrandCdList } = useSelector((state: RootState) => state.restaurant);
    const dispatch = useDispatch<AppDispatch>();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const {
        control,
        handleSubmit,
        reset,
        watch,
        trigger,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<FoodSkuFormData>({
        defaultValues: {
            foodSkuSno: null,
            restaurantBrandCd: '',
            foodName: '',
            skuCode: '',
            activeFlag: true
        },
        mode: 'all', // Enable all validation modes
        reValidateMode: 'onChange', // Revalidate on change
    });

    useEffect(() => {
        dispatch(getAllFoodSku({}));
        dispatch(getRestaurantBrandCd({ codeType: 'restaurant_brand_cd' }));
    }, [dispatch]);

    const handleOpenModal = (editing = false, foodSku: FoodSkuData | null = null) => {
        if (editing && foodSku) {
            reset({
                foodSkuSno: foodSku.foodSkuSno,
                restaurantBrandCd: foodSku.restaurantBrandCd,
                foodName: foodSku.foodName,
                skuCode: foodSku.skuCode,
                activeFlag: foodSku.activeFlag
            });
            setSelectedFoodSku(foodSku);
        } else {
            reset({
                foodSkuSno: null,
                restaurantBrandCd: '',
                foodName: '',
                skuCode: '',
                activeFlag: true
            });
            setSelectedFoodSku(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: FoodSkuFormData) => {
        try {
            console.log('Form data submitted:', data); // Add this to debug

            if (isEditing) {
                await dispatch(editFoodSku({
                    ...data,
                    // countrySno: parseInt(data.countrySno),
                    // stateSno: parseInt(data.stateSno),
                    // citySno: parseInt(data.citySno),
                }));
            } else {
                const { foodSkuSno, ...newFoodSkuData } = data;
                await dispatch(createFoodSku({
                    ...newFoodSkuData,
                    // countrySno: parseInt(newFoodSkuData.countrySno),
                    // stateSno: parseInt(newFoodSkuData.stateSno),
                    // citySno: parseInt(newFoodSkuData.citySno),
                }));
            }
            dispatch(getAllFoodSku({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // const handleDelete = async (foodSku: FoodSkuData) => {
    //     if (window.confirm('Are you sure you want to delete this area?')) {
    //         await dispatch(deleteFoodSku({ foodSkuSno: foodSku.foodSkuSno }));
    //         dispatch(getAllFoodSku({}));
    //     }
    // };

    // Common handler for field changes
    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof FoodSkuFormData
    ) => (value: any) => {
        field.onChange(value);
        // Clear error when user starts typing/selecting
        clearErrors(fieldName);
    };
    const handleDeleteModalOpen = (foodSku: FoodSkuData) => {
        setSelectedFoodSku(foodSku); // Set the infrastructure item to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleDeleteModalClose = () => {
        setSelectedFoodSku(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (foodSku: FoodSkuData) => {
        if (foodSku) {
            await dispatch(deleteFoodSku({ foodSkuSno: foodSku.foodSkuSno }));
            dispatch(getAllFoodSku({}));
            handleDeleteModalClose();
        }

    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    // Common validation rules with validation on blur
    const validationRules = {
        foodName: {
            required: 'Food Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.foodName) return 'Food Name is required';
                    return true;
                }
            }
        },
        skuCode: {
            required: 'Sku Code is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.foodName) return 'Sku Code is required';
                    return true;
                }
            }
        },

    };
    const filteredfoodSku = foodSkuList?.filter(foodSku =>
        foodSku.foodName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedfoodSku = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredfoodSku?.slice(startIndex, endIndex);
    }, [filteredfoodSku, currentPage, itemsPerPage]);
    const totalItems = filteredfoodSku.length;


    return (
        <div>
            <CommonHeader
                title='Food Sku'
                description="Manage your Food Sku"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                HeaderIcon={Utensils}
                AddIcon={Plus}
                buttonName='Add Food Sku'
                placeholder='Search Food Sku...'
            />
            <div className="w-full">
                {paginatedfoodSku && paginatedfoodSku.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pl-32 pr-16">
                        {paginatedfoodSku.map((foodSku) => (
                            <Card
                                key={foodSku.foodSkuSno}
                                data={foodSku}
                                headerName={foodSku.foodName}
                                onEdit={() => handleOpenModal(true, foodSku)}
                                onDelete={() => handleDeleteModalOpen(foodSku)}
                                homeIcon={<Utensils className="text-color mr-2 w-6 h-7" />}
                                columns={[
                                    { key: "restaurantBrandCd", icon: <ChefHat className="mr-2 text-blue-500" size={16} /> },
                                    { key: "foodName", icon: <Utensils className="mr-2 text-color" size={16} /> },
                                    { key: "skuCode", icon: <QrCode className="mr-2 text-green-500" size={16} /> },
                                ]}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[400px] w-full flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <SearchX size={64} className="text-color mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Found</h3>
                            <p className="text-gray-500 text-center">No matching FoodSku were found.</p>
                        </div>
                    </div>
                )}
            </div>

            {totalItems > 8 && (
                <div className="pr-16 m-10">
                    <Pagination
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
            {/* Form Modal */}
            <AnimatedModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    reset();
                }}
                title={
                    <div>
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            {/* <Utensils className="text-orange-500" /> */}
                            {isEditing ? 'Edit Food Sku' : 'Add Food Sku'}
                        </h2>
                    </div>
                }
                type="default"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="foodForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }
            >
                <form id="foodForm" onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">


                    <div className="space-y-2">
                        <Controller
                            name="foodName"
                            control={control}
                            rules={validationRules.foodName}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Food Item Name"
                                    error={errors.foodName?.message}
                                    placeholder='Select Food Item'
                                    value={field.value}
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'foodName')(e.target.value)}
                                    required
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Controller
                            name="skuCode"
                            control={control}
                            rules={validationRules.skuCode}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Sku Code"
                                    error={errors.skuCode?.message}
                                    placeholder='Enter Food Code'
                                    value={field.value}
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'skuCode')(e.target.value)}
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        {/* <Controller
                            name="restaurantBrandCd"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Restaurant Brand Code"
                                    {...field}
                                    placeholder="Select a Restaurant Brand Code"
                                    onChange={(value) => handleFieldChange(field, 'restaurantBrandCd')(value)}
                                    options={restaurantBrandCdList.map((cDtl) => ({
                                        label: cDtl.cdValue,
                                        value: cDtl.codesDtlSno.toString(),
                                    }))}
                                />
                            )}
                        /> */}
                        <Controller
                            name="restaurantBrandCd"
                            control={control}
                            // rules={validationRules.restaurantName}
                            render={({ field }) => (
                                <Input
                                    label="Restaurant Brand Code"
                                    error={errors.restaurantBrandCd?.message}
                                    {...field}
                                    placeholder="Enter Restaurant Brand Code"
                                    value={field.value}
                                    onChange={(e) => handleFieldChange(field, 'restaurantBrandCd')(e.target.value)}
                                    // required
                                    className='w-full'
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="activeFlag"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Status"
                                    {...field}
                                    onChange={(value) => handleFieldChange(field, 'activeFlag')(value)}
                                    options={[
                                        { label: 'Active', value: true.toString() },
                                        { label: 'Inactive', value: false.toString() }
                                    ]}
                                />
                            )}
                        />
                    </div>
                </form>
            </AnimatedModal>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteModalClose}
                title="Delete"
                type="info"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-md"
                            onClick={handleDeleteModalClose}
                        >
                            No
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            onClick={() => handleDelete(selectedFoodSku!)} // Trigger deletion here
                        >
                            Yes
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this Food Item?</p>
            </Modal>
        </div>
    );
}