import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Truck, SearchX, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { createDeliiveryPartner, deleteDeliiveryPartner, getAllDeliiveryPartner, updateDeliiveryPartner } from '@state/deliveryPartnerSlice';
import { getPartnerStatusCd } from '@state/codeDtlSlice';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { Pagination } from '@components/pagination';
import { Column, Table } from '@components/Table';
import NoDataFound from '@components/no-data-found';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';
import { getFromLocalStorage } from '@utils/storage';

interface DeliveryPartnerData {
    partnerName: string;
    deliveryPartnerSno: number;
    partnerCode: string;
    partnerStatusCd: string;
    logoUrl: string;
    activeFlag: boolean;
}

interface DeliveryPartnerFormData {
    deliveryPartnerSno: number | null;
    partnerName: string;
    partnerCode: string;
    partnerStatusCd: string
    logoUrl: string;
    activeFlag: boolean;
}


interface partnerStatusData {
    codesDtlSno: number;
    cdValue: string;
}
interface DeliveryPartnerProps {
    isHovered: any;
}


const DeliveryPartner = () => {
    // const DeliveryPartner: React.FC<DeliveryPartnerProps> = ({ isHovered }) => {

    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedDeliverypartner, setSelectedDeliverypartner] = React.useState<DeliveryPartnerData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [roleName, setRoleName]: any = useState(null);
    const [error, setError] = useState<string | null>(null);
    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<DeliveryPartnerFormData>({
        defaultValues: {
            deliveryPartnerSno: null,
            partnerName: '',
            partnerCode: '',
            partnerStatusCd: '',
            logoUrl: '',
            activeFlag: true,

        },
        mode: 'all', // Enable all validation modes
        reValidateMode: 'onChange', // Revalidate on change
    });

    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const { partnerStatusLis } = useSelector((state: RootState) => state.codesDtl);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedData = getFromLocalStorage('user');

                if (!storedData) {
                    throw new Error('No user data found');
                }
                const { loginDetails } = storedData;

                if (!loginDetails) {
                    throw new Error('Login details not found');
                }
                // Set both values at once to ensure synchronization
                setRoleName(loginDetails.roleName || null);

            } catch (err: any) {
                console.error('Error loading user data:', err);
                setError(err.message);
            }
        };

        loadUserData();
    }, []);

    useEffect(() => {
        dispatch(getAllDeliiveryPartner({}));
        dispatch(getPartnerStatusCd({ codeType: 'partner_status_cd' }));
    }, [dispatch]);

    console.log(partnerStatusLis)

    const handleOpenModal = (editing = false, partner: DeliveryPartnerData | null = null) => {
        if (editing && partner) {
            reset({
                deliveryPartnerSno: partner.deliveryPartnerSno,
                partnerName: partner.partnerName,
                partnerCode: partner.partnerCode,
                partnerStatusCd: partner.partnerStatusCd,
                logoUrl: partner.logoUrl,
                activeFlag: partner.activeFlag
            });
            setSelectedDeliverypartner(partner);
        } else {
            reset({
                deliveryPartnerSno: null,
                partnerName: '',
                partnerCode: '',
                partnerStatusCd: '',
                logoUrl: '',
                activeFlag: true
            });
            setSelectedDeliverypartner(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: DeliveryPartnerFormData) => {
        try {
            console.log('Form data submitted:', data); // Add this to debug

            if (isEditing) {
                await dispatch(updateDeliiveryPartner({
                    ...data,
                    partnerStatusCd: parseInt(data.partnerStatusCd),
                }));
            } else {
                const { deliveryPartnerSno, ...newDelivertPartnerData } = data;
                await dispatch(createDeliiveryPartner({
                    ...newDelivertPartnerData,
                    partnerStatusCd: parseInt(newDelivertPartnerData.partnerStatusCd),
                }));
            }
            dispatch(getAllDeliiveryPartner({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    // Common handler for field changes
    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof DeliveryPartnerFormData
    ) => (value: any) => {
        field.onChange(value);
        // Clear error when user starts typing/selecting
        clearErrors(fieldName);
    };
    const handleDeleteModalOpen = (partner: DeliveryPartnerData) => {
        setSelectedDeliverypartner(partner); // Set the infrastructure item to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleDeleteModalClose = () => {
        setSelectedDeliverypartner(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (partner: DeliveryPartnerData) => {
        if (partner) {
            await dispatch(deleteDeliiveryPartner({ deliveryPartnerSno: partner.deliveryPartnerSno }));
            dispatch(getAllDeliiveryPartner({}));
            handleDeleteModalClose();
        }

    };

    const columns: Column<DeliveryPartnerData>[] = [
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
            key: 'logoUrl',
            header: 'Logo',
            sortable: true,
            render: (row) => (
                <img
                    src={row.logoUrl}
                    alt="Logo"
                    className="h-10 w-10 object-cover rounded-full border"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                    }}
                />
            ),
        },
        {
            key: 'partnerCode',
            header: 'Aggregator Code',
            sortable: true,
        },
        {
            key: 'partnerStatusCdName',
            header: 'Aggregator Status',
            sortable: true,
        },
        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: DeliveryPartnerData) => (
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
            render: (value: DeliveryPartnerData) => (
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
        partnerName: {
            required: 'Partner Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.partnerName) return 'Partner Name is required';
                    return true;
                }
            }
        },
        partnerCode: {
            required: 'Partner Code is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.partnerCode) return 'Partner Code is required';
                    return true;
                }
            },
            pattern: {
                value: /^.{1,4}$/,
                message: 'Partner code must not exceed 4 characters'
            }

        },
        partnerStatusCd: {
            required: 'Partner StatusCd is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.partnerStatusCd) return 'Partner StatusCd is required';
                    return true;
                }
            }
        }
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredDeliveryPartner = deliveryPartnerList?.filter(data =>
        data.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        // <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
        <div>
            <CommonHeader
                title='Delivery Aggregators'
                description="Manage your delivery aggregators"
                onAdd={roleName === 'Super Admin' ? () => handleOpenModal(false) : undefined}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                HeaderIcon={Truck}
                AddIcon={roleName === 'Super Admin' ? Plus : undefined}  // Only show for Super Admin
                buttonName={roleName === 'Super Admin' ? 'Add Delivery Aggregator' : undefined}  // Only show for Super Admin
                placeholder='Search delivery aggregator...'
            />

            <div className="overflow-x-auto mt-8">
                {filteredDeliveryPartner.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredDeliveryPartner.map((dp, index) => ({
                            sno: index + 1,
                            deliveryPartnerSno: dp.deliveryPartnerSno,
                            partnerCode: dp.partnerCode,
                            partnerName: dp.partnerName,
                            partnerStatusCd: dp.partnerStatusCd,
                            partnerStatusCdName: dp.partnerStatusCdName,
                            logoUrl: dp.logoUrl,
                            activeFlag: dp.activeFlag
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
                            {isEditing ? 'Edit Delivery Aggregate' : 'Add Delivery Aggregate'}
                        </h2>
                    </div>
                }
                type="default"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="deliveryPartnerForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }>

                <form id="deliveryPartnerForm" onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
                    <div className="pb-2">
                        <Controller
                            name="partnerName"
                            control={control}
                            // rules={{ required: 'Delivery Name is required' }}
                            rules={validationRules.partnerName}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Delivery Aggregate Name"
                                    placeholder='Enter Delivery Aggregate Name'
                                    error={errors.partnerName?.message}
                                    value={field.value}
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'partnerName')(e.target.value)}
                                    required
                                />
                            )}
                        />
                    </div>

                    <div className="pb-2">
                        <Controller
                            name="logoUrl"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Logo URL"
                                    placeholder='Enter Logo URL'
                                    onChange={(e) => handleFieldChange(field, 'logoUrl')(e.target.value)}
                                    required
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2 ">
                        <Controller
                            name="partnerCode"
                            control={control}
                            // rules={{ required: 'Country is required' }}
                            rules={validationRules.partnerCode}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Delivery Aggregate Code"
                                    error={errors.partnerCode?.message}
                                    placeholder='Enter Aggregate Code'
                                    value={field.value}
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'partnerCode')(e.target.value)}
                                    required
                                />
                            )}
                        />
                    </div>

                    <Controller
                        name="partnerStatusCd"
                        control={control}
                        // rules={{ required: 'Status is required' }}
                        rules={validationRules.partnerStatusCd}
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Partner Status"
                                placeholder="Select a Partner state"
                                required
                                error={errors.partnerStatusCd?.message}
                                onChange={(value) => handleFieldChange(field, 'partnerStatusCd')(value)}
                                options={partnerStatusLis.map((cDtl: partnerStatusData) => ({
                                    label: cDtl.cdValue,
                                    value: cDtl.codesDtlSno.toString(),
                                }))}
                            />
                        )}
                    />
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
                                        { label: 'InActive', value: false.toString() }
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
                            onClick={() => handleDelete(selectedDeliverypartner!)} // Trigger deletion here
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
}

export default DeliveryPartner;



