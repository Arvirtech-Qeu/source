import React, { useEffect, useMemo, useState } from 'react';
import { Plus, PackageSearch, Pencil, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { Column, Table } from '@components/Table';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import { createLowStockTrigger, deleteLowStockTrigger, searchLowStockTrigger, updateLowStockTrigger } from '@state/lowStockMasters';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { getAllRestaurant } from '@state/restaurantSlice';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getFromLocalStorage } from '@utils/storage';
import { getDashboardQboxEntityByauthUser } from '@state/superAdminDashboardSlice';

// Add these actions to your Redux slice


interface LowStockData {
    lowStockTriggerSno: number;
    restaurantSno: string;
    restaurantFoodSkuSno: string;
    qboxEntitySno: string;
    thresholdQuantity: string;
    orderTriggered: boolean;
    activeFlag: boolean;
    restaurantName?: string;
    restaurantFoodSkuName?: string;
    qboxEntityName?: string;
}

interface LowStockFormData {
    lowStockTriggerSno: number | null;
    restaurantSno: string;
    restaurantFoodSkuSno: string;
    qboxEntitySno: string;
    thresholdQuantity: string;
    orderTriggered: boolean;
    activeFlag: boolean;
}

interface QboxEntityData {
    qboxEntitySno: number | null;
    qboxEntityName: string

}

interface RestaurantData {
    restaurantSno: number | null;
    restaurantName: string

}

interface LowStockProps {
    isHovered: any;
}

interface RestaurantFoodSku {
    restaurantFoodSkuSno: number;
    restaurantSkuCode: string;
    restaurantFoodSkuName: string;
    restaurantSno: number;
}
// const LowStockMaster = () => {
const LowStockMaster: React.FC<LowStockProps> = ({ isHovered }) => {

    const [error, setError] = useState<any>({})
    const [stateSno, setStateSno]: any = useState(null);
    const [citySno, setCitySno]: any = useState(null);
    const [areaSno, setAreaSno]: any = useState(null);
    const [roleId, setRoleId]: any = useState(null);
    const [deliveryPartnerSno, setDeliveryPartnerSno]: any = useState(null);
    const [roleName, setRoleName]: any = useState(null);
    const [authUserId, setAuthUserId]: any = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<LowStockData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const { restaurantList } = useSelector((state: RootState) => state.restaurant);
    const { RestaurantFoodList } = useSelector((state: RootState) => state.restaurantFoodSku);
    const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
    const [filteredSkus, setFilteredSkus] = useState<RestaurantFoodSku[]>([]);
    const [selectedFoodItems, setSelectedFoodItems] = React.useState<LowStockData | null>(null);
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<LowStockFormData>({
        defaultValues: {
            lowStockTriggerSno: null,
            restaurantSno: '',
            restaurantFoodSkuSno: '',
            qboxEntitySno: '',
            thresholdQuantity: '',
            orderTriggered: false,
            activeFlag: true,
        },
        mode: 'all',
    });

    const { lowStockTriggerList } = useSelector((state: RootState) => state.lowStockSlice);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const storedData = getFromLocalStorage('user');

                if (!storedData) {
                    throw new Error('No user data found');
                }
                const { roleId, loginDetails } = storedData;
                if (!roleId) {
                    throw new Error('Role ID is missing');
                }
                // Set the state values and trigger API call immediately
                if (loginDetails) {
                    setStateSno(loginDetails.stateSno || null);
                    setCitySno(loginDetails.citySno || null);
                    setAreaSno(loginDetails.areaSno || null);
                    setRoleId(loginDetails.roleId || null);
                    setDeliveryPartnerSno(loginDetails.deliveryPartnerSno || null);
                    setRoleName(loginDetails.roleName || null);
                    setAuthUserId(loginDetails.authUserId || null);
                }
                console.log(areaSno)

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    useEffect(() => {
        // dispatch(searchLowStockTrigger({ areaSno: areaSno }));
        dispatch(getAllRestaurantFoodSku({}));
        dispatch(getAllRestaurant({}));
        // dispatch(getAllQboxEntities({}))
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch entity list based on role
            if (roleName === 'Super Admin') {
                await dispatch(getAllQboxEntities({}))
            } if (roleName === 'Admin') {
                await dispatch(getAllQboxEntities({ areaSno: areaSno }));
                await dispatch(searchLowStockTrigger({ areaSno: areaSno }));
            } if (roleName === 'Supervisor' || roleName === 'Loader') {
                await dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserId }));
                await dispatch(searchLowStockTrigger({ authUserSno: authUserId }));
            }

            // Fetch restaurant list
            await dispatch(getAllRestaurant({}));
        };

        fetchData();
    }, [dispatch, roleName, areaSno]);

    // Add this useEffect to handle restaurant changes
    useEffect(() => {
        const currentRestaurantSno = control._formValues.restaurantSno;
        if (currentRestaurantSno) {
            const filteredSkuList = RestaurantFoodList?.filter(
                (sku) => String(sku.restaurantSno) === String(currentRestaurantSno)
            );
            setFilteredSkus(filteredSkuList || []);
        }
    }, [control._formValues.restaurantSno, RestaurantFoodList]);

    const handleOpenModal = (editing = false, stock: LowStockData | null = null) => {
        if (editing && stock) {
            // First filter SKUs for the selected restaurant
            const filteredSkuList = RestaurantFoodList?.filter(
                (sku) => String(sku.restaurantSno) === String(stock.restaurantSno)
            );
            setFilteredSkus(filteredSkuList || []);

            // Then reset form with all values
            reset({
                lowStockTriggerSno: stock.lowStockTriggerSno,
                restaurantSno: stock.restaurantSno,
                restaurantFoodSkuSno: stock.restaurantFoodSkuSno,
                qboxEntitySno: stock.qboxEntitySno,
                thresholdQuantity: stock.thresholdQuantity,
                orderTriggered: stock.orderTriggered,
                activeFlag: stock.activeFlag
            });
            setSelectedStock(stock);
        } else {
            reset({
                lowStockTriggerSno: null,
                restaurantSno: '',
                restaurantFoodSkuSno: '',
                qboxEntitySno: '',
                thresholdQuantity: '',
                orderTriggered: false,
                activeFlag: true
            });
            setSelectedStock(null);
            setFilteredSkus([]);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };


    const onSubmit = async (data: LowStockFormData) => {
        try {
            if (isEditing) {
                await dispatch(updateLowStockTrigger(data));
            } else {
                const { lowStockTriggerSno, ...newStockData } = data;
                await dispatch(createLowStockTrigger(newStockData));
            }
            dispatch(searchLowStockTrigger({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof LowStockFormData
    ) => (value: any) => {
        field.onChange(value);
        // Clear error when user starts typing/selecting
        clearErrors(fieldName);
    };


    const handleDeleteModalOpen = (stock: LowStockData) => {
        setSelectedStock(stock);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async (stock: LowStockData) => {
        try {
            if (!stock?.lowStockTriggerSno) {
                console.error('No stock selected for deletion');
                return;
            }

            await dispatch(deleteLowStockTrigger({
                lowStockTriggerSno: stock.lowStockTriggerSno
            }));

            // Refresh the list
            await dispatch(searchLowStockTrigger({}));

            // Always close modal and reset selection
            setIsDeleteModalOpen(false);
            setSelectedStock(null);

        } catch (error) {
            console.error('Error deleting stock:', error);
            // Still close modal on error
            setIsDeleteModalOpen(false);
            setSelectedStock(null);
        }
    };


    const handleDeleteModalClose = () => {
        setSelectedStock(null);
        setIsDeleteModalOpen(false);
    };

    const columns: Column<LowStockData>[] = [
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
            key: 'restaurantFoodSkuName',
            header: 'SKU Name',
            sortable: true,
        },
        {
            key: 'qboxEntityName',
            header: 'Location',
            sortable: true,
        },
        {
            key: 'thresholdQuantity',
            header: 'Threshold Qty',
            sortable: true,
        },

        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: LowStockData) => (
                <span className={`px-2 py-1 text-sm font-medium rounded ${value.activeFlag ? "text-green-500 bg-green-100" : "text-color low-bg-color"
                    }`}>
                    {value.activeFlag ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (value: LowStockData) => (
                <div className="flex space-x-8">
                    <button onClick={() => handleOpenModal(true, value)}>
                        <Pencil className='w-4 h-4 text-gray-600' />
                    </button>
                    <button onClick={() => handleDeleteModalOpen(value)}>
                        <Trash2 className='w-4 h-4 text-color' />
                    </button>
                </div>
            ),
        }
    ];

    const validationRules = {
        qboxEntitySno: {
            required: 'Location Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.qboxEntitySno) return 'Location Name is required';
                    return true;
                }
            }
        },
        restaurantSno: {
            required: 'Restaurant Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.restaurantSno) return 'Restaurant Name is required';
                    return true;
                }
            }
        },
        restaurantFoodSkuSno: {
            required: 'Restaurant Sku Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.restaurantFoodSkuSno) return 'Restaurant Sku Name is required';
                    return true;
                }
            }
        },
        thresholdQuantity: {
            required: 'Quantity is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.thresholdQuantity) return 'Quantity is required';
                    return true;
                }
            }
        }
    };

    const handleRestaurantChange = (value, field) => {
        // Update restaurant field
        handleFieldChange(field, 'restaurantSno')(value);

        // Reset SKU selection using setValue
        reset((formValues) => ({
            ...formValues,
            restaurantFoodSkuSno: '',
        }), {
            keepErrors: true,
            keepDirty: true,
            keepTouched: true,
            keepIsValid: true,
            keepSubmitCount: true,
        });

        // Filter SKUs based on selected restaurant
        const filteredSkuList = RestaurantFoodList?.filter(
            (sku) => String(sku.restaurantSno) === String(value)
        );
        setFilteredSkus(filteredSkuList || []);
    };


    console.log(lowStockTriggerList)
    const filteredStocks = lowStockTriggerList?.filter(data =>
        data.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.restaurantFoodSkuName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedStocks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredStocks?.slice(startIndex, endIndex);
    }, [filteredStocks, currentPage, itemsPerPage]);


    return (
        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            <CommonHeader
                title='Reorder Rule Master'
                description="Manage low stock triggers"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                HeaderIcon={PackageSearch}
                AddIcon={Plus}
                buttonName='Add'
                placeholder='Search by restaurant or SKU...'
            />

            <div className="overflow-x-auto mt-8">
                {paginatedStocks.length > 0 ? (
                    <Table
                        columns={columns}
                        data={paginatedStocks.map((lsm, index) => ({
                            sno: index + 1,
                            lowStockTriggerSno: lsm.lowStockTriggerSno,
                            restaurantSno: lsm.restaurantSno,
                            restaurantFoodSkuSno: lsm.restaurantFoodSkuSno,
                            qboxEntitySno: lsm.qboxEntitySno,
                            thresholdQuantity: lsm.thresholdQuantity,
                            orderTriggered: lsm.orderTriggered,
                            activeFlag: lsm.activeFlag,
                            restaurantName: lsm.restaurantName,
                            restaurantFoodSkuName: lsm.restaurantFoodSkuName,
                            qboxEntityName: lsm.qboxEntityName,
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        globalSearch={false}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>

            <AnimatedModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    reset();
                }}
                title={
                    <div>
                        <h2 className="text-gray-800 flex items-center gap-2">
                            {isEditing ? 'Edit Stock Trigger' : 'Add Stock Trigger'}
                        </h2>
                    </div>
                }
                type="default"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="LowStockFormData"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }>

                <form id="LowStockFormData" onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
                    <div className="space-y-2">
                        <Controller
                            name="qboxEntitySno"
                            control={control}
                            rules={validationRules.qboxEntitySno}
                            render={({ field }) => {
                                // Determine which list to use based on role
                                const locationsList = ['Loader', 'Supervisor'].includes(roleName || '')
                                    ? dashboardQboxEntityByauthUserList
                                    : qboxEntityList;

                                return (
                                    <Select
                                        {...field}
                                        label="Delivery Location"
                                        placeholder="Select Delivery Location"
                                        required
                                        error={errors.qboxEntitySno?.message}
                                        onChange={(value) => handleFieldChange(field, 'qboxEntitySno')(value)}
                                        options={locationsList?.map((qboxEntity: QboxEntityData) => ({
                                            label: qboxEntity.qboxEntityName,
                                            value: qboxEntity.qboxEntitySno,
                                        })) || []}
                                    />
                                );
                            }}
                        />
                    </div>

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
                                onChange={(value) => handleRestaurantChange(value, field)}
                                options={restaurantList.map((restaurant: RestaurantData) => ({
                                    label: restaurant.restaurantName,
                                    value: restaurant.restaurantSno,
                                }))}
                            />
                        )}
                    />
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
                                options={filteredSkus.map((sku) => ({
                                    label: `${sku.restaurantSkuCode}`,
                                    value: sku.restaurantFoodSkuSno.toString(),
                                }))}
                                value={field.value} // Explicitly set value
                            />
                        )}
                    />
                    {/* <div className="space-y-2 "> */}
                    <Controller
                        name="thresholdQuantity"
                        control={control}
                        rules={validationRules.thresholdQuantity}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label="Threshold Quantity"
                                error={errors.thresholdQuantity?.message}
                                placeholder='Enter Threshold Quantity'
                                value={field.value}
                                onChange={(e) => handleFieldChange(field, 'thresholdQuantity')(e.target.value)}
                                required
                            />
                        )}
                    />
                    {/* </div> */}
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
                            onClick={() => handleDelete(selectedStock!)} // Trigger deletion here
                        >
                            Yes
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this Delivery Partner ?</p>
            </Modal>
        </div>
    );
};


export default LowStockMaster;