import React, { useEffect, useState } from 'react';
import { Plus, AlertTriangle, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
// import { createRejectReason, deleteRejectReason, editRejectReason, getAllRejectReason } from '@state/rejectReasonSlice';
import { AppDispatch, RootState } from '@state/store';
import { AnimatedModal } from '@components/AnimatedModel';
import Input from '@components/Input';
import { CommonHeader } from '@components/common-header';
import { Pagination } from '@components/pagination';
import { Column, Table } from '@components/Table';
import NoDataFound from '@components/no-data-found';
import Select from '@components/Select';
import { createRejectReason, deleteRejectReason, editRejectReason, getAllRejectReason } from '@state/rejectReasonSlice';

interface RejectReasonData {
    rejectReasonSno: number;
    rejectReason: string;
    description: string;
    activeFlag: boolean;
}

interface RejectReasonFormData {
    rejectReasonSno: number | null;
    rejectReason: string;
    description: string;
    activeFlag: boolean;
}

interface RejectReasonProps {
    isHovered: any;
}

const RejectReason: React.FC<RejectReasonProps> = ({ isHovered }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRejectReason, setSelectedRejectReason] = useState<RejectReasonData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<RejectReasonFormData>({
        defaultValues: {
            rejectReasonSno: null,
            rejectReason: '',
            description: '',
            activeFlag: true,
        },
        mode: 'all',
        reValidateMode: 'onChange',
    });

    const { rejectReasonList } = useSelector((state: RootState) => state.rejectReason);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllRejectReason({}));
    }, [dispatch]);

    const handleOpenModal = (editing = false, rejectReason: RejectReasonData | null = null) => {
        if (editing && rejectReason) {
            reset({
                rejectReasonSno: rejectReason.rejectReasonSno,
                rejectReason: rejectReason.rejectReason,
                description: rejectReason.description,
                activeFlag: rejectReason.activeFlag
            });
            setSelectedRejectReason(rejectReason);
        } else {
            reset({
                rejectReasonSno: null,
                rejectReason: '',
                description: '',
                activeFlag: true
            });
            setSelectedRejectReason(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof RejectReasonFormData
    ) => (value: any) => {
        field.onChange(value);
        clearErrors(fieldName);
    };

    const onSubmit = async (data: RejectReasonFormData) => {
        try {
            if (isEditing) {
                await dispatch(editRejectReason({
                    ...data,
                }));
            } else {
                const { rejectReasonSno, ...newRejectReasonData } = data;
                await dispatch(createRejectReason({
                    ...newRejectReasonData,
                }));
            }
            dispatch(getAllRejectReason({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDeleteModalOpen = (rejectReason: RejectReasonData) => {
        setSelectedRejectReason(rejectReason);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setSelectedRejectReason(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        if (selectedRejectReason) {
            await dispatch(deleteRejectReason({ rejectReasonSno: selectedRejectReason.rejectReasonSno }));
            dispatch(getAllRejectReason({}));
            handleDeleteModalClose();
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const validationRules = {
        rejectReason: {
            required: 'Reject Reason is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.rejectReason) return 'Reject Reason is required';
                    return true;
                }
            }
        }
    };

    const columns: Column<RejectReasonData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'rejectReason',
            header: 'Reject Reason',
            sortable: true,
        },
        {
            key: 'description',
            header: 'Description',
            sortable: true,
        },
        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: RejectReasonData) => (
                <span
                    className={`px-2 py-1 text-sm font-medium rounded ${value.activeFlag ? "text-green-500 bg-green-100" : "text-color bg-red-100"
                        }`}
                >
                    {value.activeFlag ? "Active" : "InActive"}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (value: RejectReasonData) => (
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

    const filteredRejectReason = rejectReasonList?.filter((reason) =>
        reason.rejectReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reason.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            <CommonHeader
                title="Reject Reason"
                description="Manage your Reject Reasons"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                buttonName="Add Reject Reason"
                placeholder="Search Reject Reason..."
                HeaderIcon={AlertTriangle}
                AddIcon={Plus}
            />

            <div className="overflow-x-auto mt-8">
                {filteredRejectReason.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredRejectReason.map((reason, index) => ({
                            sno: index + 1,
                            rejectReasonSno: reason.rejectReasonSno,
                            rejectReason: reason.rejectReason,
                            description: reason.description,
                            activeFlag: reason.activeFlag
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        onRowClick={(reason) => console.log('Reject Reason clicked:', reason)}
                        globalSearch={false}
                    />
                ) : (
                    <NoDataFound
                        icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                        message1="No Data Found"
                        message2="There are No matching Reject Reasons found."
                    />
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
                            {isEditing ? 'Edit Reject Reason' : 'Add Reject Reason'}
                        </h2>
                    </div>
                }
                type="default"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="rejectReasonForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }
            >
                <form id="rejectReasonForm" onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-2">
                    <div className="pb-2">
                        <Controller
                            name="rejectReason"
                            control={control}
                            rules={validationRules.rejectReason}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Reject Reason"
                                    placeholder='Enter Reject Reason'
                                    error={errors.rejectReason?.message}
                                    required
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2 pb-2">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Description"
                                    label="Description"
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

            {/* Delete Confirmation Modal */}
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
                            onClick={handleDelete}
                        >
                            Yes
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this Reject Reason?</p>
            </Modal>
        </div>
    );
};

export default RejectReason;