import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Salad, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { getAllRestaurant } from '@state/restaurantSlice';
import { createRestaurantFoodSku, deleteRestaurantFoodSku, editRestaurantFoodSku, getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { Pagination } from '@components/pagination';
import { Column, Table } from '@components/Table';
import NoDataFound from '@components/no-data-found';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';

interface FoodItemsData {
    restaurantFoodSkuSno: number | null;
    restaurantSno: string;
    description: string;
    restaurantSkuCode: string;
    restaurantFoodSku: string;
    activeFlag: boolean;
}

interface FootItemFormData {
    restaurantFoodSkuSno: number | null;
    restaurantSno: string;
    description: string;
    restaurantSkuCode: string;
    restaurantFoodSku: string;
    activeFlag: boolean;

}
interface RestaurantData {
    restaurantSno: number | null;
    restaurantName: string

}
interface FoodSkuData {
    foodSkuSno: number | null;
    foodName: string;
}

interface RestaurantFoodSkuProps {
    isHovered: any;
}

// const RestaurantFoodSku: React.FC<RestaurantFoodSkuProps> = ({ isHovered }) => {

const RestaurantFoodSku = () => {

    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedFoodItems, setSelectedFoodItems] = React.useState<FoodItemsData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<FoodItemsData>({
        defaultValues: {
            restaurantFoodSkuSno: null,
            restaurantSno: '',
            description: '',
            restaurantSkuCode: '',
            restaurantFoodSku: '',
            activeFlag: true

        },
        mode: 'all', // Enable all validation modes
        reValidateMode: 'onChange', // Revalidate on change
    });

    const { restaurantList } = useSelector((state: RootState) => state.restaurant);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    // const { foodSkuList } = useSelector((state: RootState) => state.foodSku);
    const [searchQuery, setSearchQuery] = useState('');


    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllRestaurantFoodSku({}));
        dispatch(getAllRestaurant({}));
        // dispatch(getAllFoodSku({}));
    }, [dispatch]);

    const handleOpenModal = (editing = false, food: FoodItemsData | null = null) => {
        if (editing && food) {
            reset({
                restaurantFoodSkuSno: food.restaurantFoodSkuSno,
                restaurantSno: food.restaurantSno,
                description: food.description,
                restaurantSkuCode: food.restaurantSkuCode,
                restaurantFoodSku: food.restaurantFoodSku,
                activeFlag: food.activeFlag
            });
            setSelectedFoodItems(food);
        } else {
            reset({
                restaurantFoodSkuSno: null,
                restaurantSno: '',
                description: '',
                restaurantSkuCode: '',
                restaurantFoodSku: '',
                activeFlag: true
            });
            setSelectedFoodItems(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: FootItemFormData) => {
        try {
            console.log('Form data submitted:', data); // Add this to debug

            if (isEditing) {
                await dispatch(editRestaurantFoodSku({
                    ...data,

                }));
            } else {
                const { restaurantFoodSkuSno, ...newFoodData } = data;
                await dispatch(createRestaurantFoodSku({
                    ...newFoodData,



                }));
            }
            dispatch(getAllRestaurantFoodSku({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };



    // Common handler for field changes
    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof FootItemFormData
    ) => (value: any) => {
        field.onChange(value);
        // Clear error when user starts typing/selecting
        clearErrors(fieldName);
    };

    const handleDeleteModalOpen = (infra: FoodItemsData) => {
        setSelectedFoodItems(infra); // Set the infrastructure item to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleDeleteModalClose = () => {
        setSelectedFoodItems(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (infra: FoodItemsData) => {
        if (infra) {
            await dispatch(deleteRestaurantFoodSku({ restaurantFoodSkuSno: infra.restaurantFoodSkuSno }));
            dispatch(getAllRestaurantFoodSku({}));
            handleDeleteModalClose();
        }

    };

    const columns: Column<FoodItemsData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'restaurantName',
            header: 'Restaurant',
            sortable: true,
        },
        {
            key: 'restaurantFoodSku',
            header: 'Restaurant Sku',
            sortable: true,
        },
        {
            key: 'restaurantSkuCode',
            header: 'Restaurant Sku Code',
            sortable: true,
        },

        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: FoodItemsData) => (
                <span
                    className={`px-2 py-1 text-sm font-medium rounded ${value.activeFlag ? "text-green-500 bg-green-100" : "text-color low-bg-color"
                        }`}
                >
                    {value.activeFlag ? "Active" : "InActive"}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (value: FoodItemsData) => (
                <div className="flex space-x-8">
                    <button
                        onClick={() => handleOpenModal(true, value)}
                    >
                        <Pencil className='w-4 h-4 text-gray-600' />
                    </button>
                    <button
                        onClick={() => handleDeleteModalOpen(value)}
                    >
                        <Trash2 className='w-4 h-4 text-color' />
                    </button>
                </div>
            ),
        }
    ];

    // Common validation rules with validation on blur
    const validationRules = {
        restaurantSno: {
            required: 'Restaurant Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.restaurantSno) return 'Restaurant Name is required';
                    return true;
                }
            }
        },
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredrestaurantfood = RestaurantFoodList?.filter((food) => {
        const foodName = food?.restaurantFoodSku || "";
        return foodName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        // <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
        <div>
            <CommonHeader
                title='Restaurant Food Sku'
                description="Manage your Restaurant Food Sku"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                HeaderIcon={Salad}
                AddIcon={Plus}
                buttonName='Add Restaurant Food Sku'
                placeholder='Search Restaurant Food Sku...'
            />
            <div className="overflow-x-auto mt-8">
                {filteredrestaurantfood.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredrestaurantfood.map((rfs, index) => ({
                            sno: index + 1,
                            restaurantFoodSkuSno: rfs.restaurantFoodSkuSno,
                            restaurantSno: rfs.restaurantSno,
                            description: rfs.description,
                            restaurantName: rfs.restaurantName,
                            restaurantSkuCode: rfs.restaurantSkuCode,
                            restaurantFoodSku: rfs.restaurantFoodSku,
                            activeFlag: rfs.activeFlag
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        globalSearch={false}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>
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
                            {/* <MapPin className="text-orange-500" /> */}
                            {isEditing ? 'Edit Restaurant Food Sku Item' : 'Add Restaurant Food Sku'}
                        </h2>
                    </div>
                }
                type="default"
                size="2xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="restaurantFoodForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }
            >
                <form id="restaurantFoodForm" onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Controller
                            name="restaurantSno"
                            control={control}
                            rules={validationRules.restaurantSno}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Restaurant Name"
                                    placeholder="Select Restaurant"
                                    required
                                    error={errors.restaurantSno?.message}
                                    onChange={(value) => handleFieldChange(field, 'restaurantSno')(value)}
                                    options={restaurantList.map((restaurant: RestaurantData) => ({
                                        label: restaurant.restaurantName,
                                        value: restaurant.restaurantSno,
                                    }))}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="restaurantSkuCode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Restaurant Food Sku Code"
                                    placeholder='Enter Restaurant Food Sku Code'
                                    value={field.value}
                                    onChange={(e) => handleFieldChange(field, 'restaurantSkuCode')(e.target.value)}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Description"
                                    value={field.value}
                                    placeholder='Enter Description'
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'description')(e.target.value)}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="restaurantFoodSku"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Restaurant FoodSku"
                                    value={field.value}
                                    placeholder='Enter Restaurant Food Sku'
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'restaurantFoodSku')(e.target.value)}
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
                                    {...field}
                                    label="Status"
                                    onChange={(value) => handleFieldChange(field, 'activeFlag')(value)}
                                    options={[
                                        { label: 'Active', value: true.toString() }, // Boolean to readable text
                                        { label: 'Inactive', value: false.toString() }, // Unique identifier for the value
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
                            className="px-4 py-2 bg-color text-white rounded-md"
                            onClick={() => handleDelete(selectedFoodItems!)} // Trigger deletion here
                        >
                            Yes
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this Restaurant Food Sku ?</p>
            </Modal>
        </div>
    );
}
export default RestaurantFoodSku;