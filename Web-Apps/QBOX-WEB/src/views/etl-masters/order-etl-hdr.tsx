import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Columns, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { AnimatedModal } from '@components/AnimatedModel';
import Input from '@components/Input';
import { CommonHeader } from '@components/common-header';
import { Pagination } from '@components/pagination';
import { Column, Table } from '@components/Table';
import { createEtlhdr, deleteEtlhdr, editEtlhdr, getAllEtlHdr } from '@state/etlHdrSlice';
import { getAllDeliiveryPartner } from '@state/deliveryPartnerSlice';
import NoDataFound from '@components/no-data-found';

interface EtlHdrData {

    orderEtlHdrSno: number;
    deliveryPartnerSno: number;
    partnerCode: string;
    stagingTableName: string;
    fileNamePrefix: string;
    isActive: any;
}

interface EtlFormHdrData {
    orderEtlHdrSno: number | null;
    deliveryPartnerSno: number | null;
    partnerCode: string;
    stagingTableName: string;
    fileNamePrefix: string;
    isActive: boolean;
}

interface OrderEtlProps {
    isHovered: any;
}
const OrderEtl: React.FC<OrderEtlProps> = ({ isHovered }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedetlHdr, setSelectedetlHdr] = useState<EtlHdrData | null>(null);
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
        formState: { errors, touchedFields, isValid },
    } = useForm<EtlFormHdrData>({
        defaultValues: {
            orderEtlHdrSno: null,
            deliveryPartnerSno: null,
            partnerCode: '',
            stagingTableName: '',
            fileNamePrefix: '',
            isActive: true,
        },
        mode: 'all',
        reValidateMode: 'onChange',

    });

    const { etlHdrList } = useSelector((state: RootState) => state.etlHdrSlice);
    const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllEtlHdr({}));
        dispatch(getAllDeliiveryPartner({}))
    }, [dispatch]);


    const columns: Column<EtlHdrData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'stagingTableName',
            header: 'Staging Table Name',
            sortable: true,
        },
        {
            key: 'partnerCode',
            header: 'Partner Code',
            sortable: true,
        },
        {
            key: 'fileNamePrefix',
            header: 'FileName Prefix',
            sortable: true,
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (value: EtlHdrData) => (
                <span
                    className={`px-2 py-1 text-sm font-medium rounded ${value.isActive ? "text-green-500 bg-green-100" : "text-color low-bg-color"
                        }`}
                >
                    {value.isActive ? "Active" : "InActive"}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (value: EtlHdrData) => (
                <div className="flex space-x-8">
                    <button onClick={() => handleOpenModal(true, value)}>
                        <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={() => handleDeleteModalOpen(value)}>
                        <Trash2 className="w-4 h-4 text-color" />
                    </button>

                </div>
            ),
        }
    ];

    const handleOpenModal = (editing = false, etlHdr: EtlHdrData | null = null) => {
        if (editing && etlHdr) {
            reset({
                orderEtlHdrSno: etlHdr.orderEtlHdrSno,
                deliveryPartnerSno: etlHdr.deliveryPartnerSno,
                partnerCode: etlHdr.partnerCode.toString(),
                stagingTableName: etlHdr.stagingTableName,
                fileNamePrefix: etlHdr.fileNamePrefix,
                isActive: etlHdr.isActive,
            });
            setSelectedetlHdr(etlHdr);
        } else {
            reset({
                orderEtlHdrSno: null,
                deliveryPartnerSno: null,
                partnerCode: '',
                stagingTableName: '',
                fileNamePrefix: '',
                isActive: true,
            });
            setSelectedetlHdr(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };
    const handleFieldChange =
        (
            field: { onChange: (value: any) => void },
            fieldName: keyof EtlHdrData
        ) =>
            (value: any) => {
                field.onChange(value);
                // Clear error when user starts typing/selecting
                clearErrors(fieldName);
            };
    const onSubmit = async (data: EtlFormHdrData) => {
        try {
            if (isEditing) {
                await dispatch(editEtlhdr({
                    ...data,
                }));
            } else {
                const { orderEtlHdrSno, ...newEtlHdrData } = data;
                await dispatch(createEtlhdr({
                    ...newEtlHdrData,

                }));
            }
            dispatch(getAllEtlHdr({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDeleteModalOpen = (etlHdr: EtlHdrData) => {
        setSelectedetlHdr(etlHdr);
        setIsDeleteModalOpen(true);


    };

    const handleDeleteModalClose = () => {
        setSelectedetlHdr(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (etlHdr: EtlHdrData) => {
        if (etlHdr) {
            await dispatch(deleteEtlhdr({ orderEtlHdrSno: etlHdr.orderEtlHdrSno }));
            dispatch(getAllEtlHdr({}));
            handleDeleteModalClose();
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const validationRules = {
        deliveryPartnerSno: {
            required: 'Delivery Aggregate is required',
            validate: {
                checkOnBlur: (value: number | null) => {
                    if (!value && touchedFields.deliveryPartnerSno) return 'Delivery Aggregate is required';
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
            }
        }

    };

    const filteredetlHdr = etlHdrList?.filter((etlHdr) =>
        etlHdr.stagingTableName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedetlHdr = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredetlHdr?.slice(startIndex, endIndex);
    }, [filteredetlHdr, currentPage, itemsPerPage]);


    const totalItems = filteredetlHdr.length;
    return (
        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            <CommonHeader
                title="Order Etl Hdr"
                description="Manage your Order Etl Hdr"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                buttonName="Add Order Etl Hdr"
                placeholder="Search Order Etl Hdr..."
                HeaderIcon={Columns}
                AddIcon={Plus}
            />
            <div className="overflow-x-auto mt-8">
                {filteredetlHdr.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredetlHdr.map((etlHdr, index) => ({
                            sno: index + 1,
                            orderEtlHdrSno: etlHdr.orderEtlHdrSno,
                            deliveryPartnerSno: etlHdr.deliveryPartnerSno,
                            partnerCode: etlHdr.partnerCode,
                            stagingTableName: etlHdr.stagingTableName,
                            fileNamePrefix: etlHdr.fileNamePrefix,
                            isActive: etlHdr.isActive,
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        onRowClick={(etlHdr) => console.log('Order clicked:', etlHdr)}
                        globalSearch={false}
                    />

                ) : (
                    <NoDataFound
                        icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                        message1="No Data Found"
                        message2="No matching Etl Hdr found."
                    />
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
            <AnimatedModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    reset();
                }}
                title={
                    <div>
                        <h2 className="text-gray-800 flex items-center gap-2">
                            {isEditing ? 'Edit Etl Hdr' : 'Add Etl Hdr'}
                        </h2>
                    </div>
                }
                type="default"
                size="2xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="etlHdrForm"
                            disabled={!isValid}
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }
            >
                <form id="etlHdrForm" onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
                    {/* <div className="space-y-2"> */}
                    <div className="space-y-2">
                        <Controller
                            name="deliveryPartnerSno"
                            control={control}
                            rules={validationRules.deliveryPartnerSno}
                            render={({ field }) => (
                                <Select
                                    label="Select Delivery Aggregate"
                                    {...field}
                                    required
                                    error={errors.deliveryPartnerSno?.message}
                                    onChange={(value) => handleFieldChange(field, 'deliveryPartnerSno')(Number(value))}
                                    options={[
                                        { label: "Select a Delivery Aggregate", value: null }, // Placeholder option
                                        ...deliveryPartnerList?.map((delivery) => ({
                                            label: delivery.partnerName,
                                            value: delivery.deliveryPartnerSno, // Use number type directly
                                        })),
                                    ]}
                                />
                            )}
                        />
                    </div>
                    <div className=" space-y-2">
                        <Controller
                            name="partnerCode"
                            control={control}
                            rules={validationRules.partnerCode}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Partner Code"
                                    label="Partner Code"
                                    error={errors.partnerCode?.message}
                                    // onChange={(e) => handleFieldChange(field, 'partnerCode')(e.target.value)}
                                    required
                                    value={field.value}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Controller
                            name="stagingTableName"
                            control={control}
                            // rules={{ required: 'Staging Table Name is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder='Enter Staging Table Name'
                                    label="Staging Table Name"
                                    error={errors.stagingTableName?.message}
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                    </div>


                    <div className="space-y-2">
                        <Controller
                            name="fileNamePrefix"
                            control={control}
                            // rules={{ required: 'fileNamePrefix is required' }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder='Enter File Name prefix'
                                    label="File Name Prefix"
                                    error={errors.fileNamePrefix?.message}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Status"
                                    {...field}
                                    onChange={(value) => handleFieldChange(field, 'isActive')(value)}
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
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-md"
                            onClick={handleDeleteModalClose}
                        >
                            No
                        </button>
                        <button
                            className="px-4 py-2 bg-color text-white rounded-md"
                            onClick={() => handleDelete(selectedetlHdr!)} // Trigger deletion here
                        >
                            Yes
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this Order Etl Hdr ?</p>
            </Modal>
        </div>
    );
}
export default OrderEtl;