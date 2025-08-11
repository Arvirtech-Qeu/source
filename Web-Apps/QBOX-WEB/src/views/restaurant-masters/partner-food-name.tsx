import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, MapPin, Globe, Building2, Home, Handshake, SearchX, SoupIcon, Truck, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import Card from '@components/card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { getAllDeliiveryPartner } from '@state/deliveryPartnerSlice';
import { createPartnerFoodSku, deletePartnerFoodSku, editPartnerFoodSku, getAllPartnerFoodSku } from '@state/partnerFoodSkuSlice';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { Column, Table } from '@components/Table';
import NoDataFound from '@components/no-data-found';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import { getFromLocalStorage } from '@utils/storage';
import { ro } from 'date-fns/locale';


interface PartnerFoodData {
    partnerFoodSkuSno: number
    deliveryPartnerSno: string;
    restaurantFoodSkuSno: string;
    partnerFoodCode: string;
    description: string;
    purchaseSkuPrice: number;
    salesSkuPrice: number;
    activeFlag?: boolean;
}

interface PartnerFoodFormData {
    partnerFoodSkuSno: number | null;
    deliveryPartnerSno: string;
    restaurantFoodSkuSno: string;
    partnerFoodCode: string;
    description: string;
    purchaseSkuPrice: number | null;
    salesSkuPrice: number | null;
    activeFlag?: boolean;
}

interface PartnerFoodSkuProps {
    isHovered: any;
}

// const PartnerFoodSku: React.FC<PartnerFoodSkuProps> = ({ isHovered }) => {
const PartnerFoodSku = () => {

    const [error, setError] = useState<any>({})
    const [roleName, setRoleName]: any = useState(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPartnerFoodSku, setSelectedPartnerFoodSku] = useState<PartnerFoodData | null>(null);
    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const { partnerFoodSkuList } = useSelector((state: RootState) => state.partnetFoodSku);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const {
        control,
        handleSubmit,
        reset,
        watch,
        trigger,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<PartnerFoodFormData>({
        defaultValues: {
            partnerFoodSkuSno: null,
            deliveryPartnerSno: '',
            restaurantFoodSkuSno: '',
            partnerFoodCode: '',
            purchaseSkuPrice: null,
            salesSkuPrice: null,
            description: '',
            activeFlag: true,
        },
        mode: 'all', // Enable all validation modes
        reValidateMode: 'onChange', // Revalidate on change
    });

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load user data
                const storedData = getFromLocalStorage('user');
                if (!storedData) {
                    throw new Error('No user data found');
                }

                const { roleId, loginDetails } = storedData;
                if (!roleId) {
                    throw new Error('Role ID is missing');
                }

                let currentRoleName = null;
                let currentDeliveryPartnerSno = null;

                if (loginDetails) {
                    currentRoleName = loginDetails.roleName || null;
                    currentDeliveryPartnerSno = loginDetails.deliveryPartnerSno || null;
                    setRoleName(currentRoleName);
                    setDeliveryPartnerSno(currentDeliveryPartnerSno);
                }

                // Dispatch API calls
                if (currentRoleName === 'Aggregator Admin' && currentDeliveryPartnerSno !== null) {
                    dispatch(getAllPartnerFoodSku({ deliveryPartnerSno: currentDeliveryPartnerSno }));
                    dispatch(getAllDeliiveryPartner({ deliveryPartnerSno: currentDeliveryPartnerSno }));
                } else {
                    dispatch(getAllPartnerFoodSku({}));
                    dispatch(getAllDeliiveryPartner({}));
                }
                dispatch(getAllRestaurantFoodSku({}));

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [dispatch]);

    console.log(partnerFoodSkuList)

    const handleOpenModal = (editing = false, partnerFood: PartnerFoodData | null = null) => {
        if (editing && partnerFood) {
            reset({
                partnerFoodSkuSno: partnerFood.partnerFoodSkuSno,
                deliveryPartnerSno: partnerFood.deliveryPartnerSno,
                restaurantFoodSkuSno: partnerFood.restaurantFoodSkuSno,
                partnerFoodCode: partnerFood.partnerFoodCode,
                purchaseSkuPrice: partnerFood.purchaseSkuPrice,
                salesSkuPrice: partnerFood.salesSkuPrice,
                description: partnerFood.description,
                activeFlag: partnerFood.activeFlag,

            });
            setSelectedPartnerFoodSku(partnerFood);
        } else {
            reset({
                partnerFoodSkuSno: null,
                deliveryPartnerSno: '',
                restaurantFoodSkuSno: '',
                partnerFoodCode: '',
                purchaseSkuPrice: null,
                salesSkuPrice: null,
                description: '',
                activeFlag: true,
            });
            setSelectedPartnerFoodSku(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: PartnerFoodFormData) => {
        console.log(data)
        try {
            console.log('Form data submitted:', data);

            if (isEditing) {
                await dispatch(editPartnerFoodSku({
                    ...data,
                }));
            } else {
                const { partnerFoodSkuSno, ...newPartnerFoodData } = data;
                await dispatch(createPartnerFoodSku({
                    ...newPartnerFoodData,

                }));
            }
            dispatch(getAllPartnerFoodSku({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Common handler for field changes
    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof PartnerFoodData
    ) => (value: any) => {
        field.onChange(value);
        // Clear error when user starts typing/selecting
        clearErrors(fieldName);
    };
    const handleDeleteModalOpen = (infra: PartnerFoodData) => {
        setSelectedPartnerFoodSku(infra); // Set the infrastructure item to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleDeleteModalClose = () => {
        setSelectedPartnerFoodSku(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (PartnerFood: PartnerFoodData) => {
        if (PartnerFood) {
            await dispatch(deletePartnerFoodSku({ partnerFoodSkuSno: PartnerFood.partnerFoodSkuSno }));
            dispatch(getAllPartnerFoodSku({}));
            handleDeleteModalClose();
        }

    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const columns: Column<PartnerFoodData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'partnerName',
            header: 'Aggregator Name',
            sortable: true,
        },
        {
            key: 'partnerFoodCode',
            header: 'Aggregator Sku Code',
            sortable: true,
        },
        {
            key: 'restaurantSkuCode',
            header: 'Restaurant Sku Code',
            sortable: true,
        },
        {
            key: 'description',
            header: 'Description',
            sortable: true,
        },
        {
            key: 'purchaseSkuPrice',
            header: 'Purchase Price',
            sortable: true,
        },
        {
            key: 'salesSkuPrice',
            header: 'Sales Price',
            sortable: true,
        },
        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: PartnerFoodData) => (
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
            render: (value: PartnerFoodData) => (
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
        deliveryPartnerSno: {
            required: 'Delivery Partner is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.deliveryPartnerSno) return 'Area Name is required';
                    return true;
                }
            }
        },
        restaurantFoodSkuSno: {
            required: 'Restaurant FoodSku is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.restaurantFoodSkuSno) return 'Restaurant FoodSku is required';
                    return true;
                }
            }
        },
        partnerFoodCode: {
            required: 'Partner Food Code is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.partnerFoodCode) return 'Partner Food Code is required';
                    return true;
                }
            }
        }
    };

    const filteredpartnerFoodSku = partnerFoodSkuList?.filter(PartnerFood =>
        PartnerFood.partnerFoodCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        // <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
        <div>
            <CommonHeader
                title='Partner FoodSku'
                description="Manage your Partner FoodSku"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                HeaderIcon={Handshake}
                AddIcon={Plus}
                buttonName='Add Partner FoodSku'
                placeholder='Search Partner FoodSku...'
            />
            <div className="overflow-x-auto mt-8">
                {filteredpartnerFoodSku?.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredpartnerFoodSku?.map((pfs, index) => ({
                            sno: index + 1,
                            partnerFoodSkuSno: pfs.partnerFoodSkuSno,
                            description: pfs.description,
                            restaurantSkuCode: pfs.restaurantSkuCode,
                            partnerFoodCode: pfs.partnerFoodCode,
                            partnerName: pfs.partnerName,
                            deliveryPartnerSno: pfs.deliveryPartnerSno,
                            restaurantFoodSkuSno: pfs.restaurantFoodSkuSno,
                            purchaseSkuPrice: pfs.purchaseSkuPrice,
                            salesSkuPrice: pfs.salesSkuPrice,
                            activeFlag: pfs.activeFlag
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
                        <h2 className=" font-bold text-gray-800 flex items-center gap-2">
                            {/* <MapPin className="text-orange-500" /> */}
                            {isEditing ? 'Edit Partner Food Name' : 'Add Partner Food Name'}
                        </h2>
                    </div>
                }
                type="default"
                size="custom2"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="partnerFoodForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }>

                <form id="partnerFoodForm" onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
                    <div className="w-96 h-96">
                        <div className="space-y-4">
                            <div className="space-y-2 ">
                                <Controller
                                    name="deliveryPartnerSno"
                                    control={control}
                                    rules={validationRules.deliveryPartnerSno}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Delivery Aggregator"
                                            placeholder="Select Delivery Partner"
                                            required
                                            error={errors.deliveryPartnerSno?.message}
                                            onChange={(value) => handleFieldChange(field, 'deliveryPartnerSno')(value)}
                                            options={deliveryPartnerList?.map((state) => ({
                                                label: state.partnerName,
                                                value: state.deliveryPartnerSno.toString(),
                                            }))}
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Controller
                                    name="restaurantFoodSkuSno"
                                    control={control}
                                    rules={validationRules.restaurantFoodSkuSno}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Restaurant FoodSku Code"
                                            placeholder="Select a Restaurant FoodSku Code"
                                            required
                                            error={errors.restaurantFoodSkuSno?.message}
                                            onChange={(value) => handleFieldChange(field, 'restaurantFoodSkuSno')(value)}
                                            options={RestaurantFoodList?.map((state) => ({
                                                label: state.restaurantSkuCode,
                                                value: state.restaurantFoodSkuSno.toString(),
                                            }))}
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2 ">
                                <div className='flex w-full space-x-4'>
                                    <div className="flex-1">
                                        <Controller
                                            name="partnerFoodCode"
                                            control={control}
                                            rules={validationRules.partnerFoodCode}
                                            render={({ field }) => (
                                                <Input
                                                    required
                                                    label="Partner Food Code"
                                                    error={errors.partnerFoodCode?.message}
                                                    placeholder='Enter Partner Food Code'
                                                    {...field}
                                                    onChange={(e) => handleFieldChange(field, 'partnerFoodCode')(e.target.value)}


                                                />
                                            )}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="flex-1 ">
                                <Controller
                                    name="description"
                                    control={control}
                                    // rules={{ required: 'Description is Required' }}
                                    render={({ field }) => (
                                        <Input
                                            label="Description"
                                            error={errors.description?.message}
                                            placeholder='Enter Description'
                                            {...field}
                                            onChange={(e) => handleFieldChange(field, 'description')(e.target.value)}
                                        />
                                    )}
                                />
                            </div>
                            <Controller
                                name="purchaseSkuPrice"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        label="Purchase Price"
                                        placeholder="Enter Purchase Price"
                                        {...field}
                                        value={field.value ?? ''} // Convert null to empty string
                                        onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                    />
                                )}
                            />
                            <div className="flex-1 ">
                                <Controller
                                    name="salesSkuPrice"
                                    control={control}
                                    render={({ field }) => (
                                        // <Input
                                        //     label="Sales Price"
                                        //     error={errors.description?.message}
                                        //     placeholder='Enter Sales Price'
                                        //     {...field}
                                        //     onChange={(e) => handleFieldChange(field, 'description')(e.target.value)}
                                        // />
                                        <Input
                                            label="Sales Price"
                                            placeholder="Enter Sales Price"
                                            {...field}
                                            value={field.value ?? ''} // Convert null to empty string
                                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
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
                        </div>
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
                            onClick={() => handleDelete(selectedPartnerFoodSku!)} // Trigger deletion here
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
export default PartnerFoodSku;























