import React, { ReactNode, useEffect } from 'react';
import { Plus, Code, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { createCodesHdr, deleteCodesHdr, editCodesHdr, getAllCodesHdr } from '@state/codeHdrSlice';
import { Column, Table } from '@components/Table';
import AnimatedModal from '@components/AnimatedModel';
import Select from '@components/Select';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { Modal } from '@components/Modal';
import NoDataFound from '@components/no-data-found';

interface CodesHdrData {
    sno: ReactNode;
    codesHdrSno: number;
    codeType: string;
    activeFlag?: boolean;
}

interface CodesHdrFormData {
    statusColor: any;
    id: number | null;
    codesHdrSno: number | null;
    codeType: string;
    activeFlag: boolean;
}


interface CodesHdrProps {
    isHovered: any;
}
const CodesHdr: React.FC<CodesHdrProps> = ({ isHovered }) => {
    const { codeHdrList } = useSelector((state: RootState) => state.codesHdr);
    const dispatch = useDispatch<AppDispatch>();
    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedCodesHdr, setSelectedCodesHdr] = React.useState<CodesHdrData | null>(null);
    const [searchCodesHdr, setSearchCodesHdr] = React.useState('');

    const { control, handleSubmit, reset, watch, trigger, clearErrors, formState: { errors, touchedFields } } = useForm<CodesHdrFormData>({
        defaultValues: {
            id: null,
            codeType: '',
            activeFlag: true,
        },
        mode: 'all',
        reValidateMode: 'onChange',
    });

    useEffect(() => {
        dispatch(getAllCodesHdr({}));
    }, []);

    // Define columns with Edit and Delete buttons
    const columns: Column<CodesHdrData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: false,
        },
        {
            key: 'codeType',
            header: 'CD Value',
            sortable: false,
        },
        {
            key: 'codesHdrSno',
            header: 'CodesHdr Sno',
            sortable: false,
        },
        {
            key: 'activeFlag',
            header: 'Status',
            sortable: false,
            render: (value: CodesHdrData) => (
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
            sortable: false,
            render: (value: CodesHdrData) => (
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

    const handleOpenModal = (editing = false, codesHdr: CodesHdrData | null = null) => {
        if (editing && codesHdr) {
            reset({
                codesHdrSno: codesHdr.codesHdrSno,
                codeType: codesHdr.codeType,
                activeFlag: codesHdr.activeFlag,
            });
            setSelectedCodesHdr(codesHdr);
        } else {
            reset({
                codesHdrSno: null,
                codeType: '',
                activeFlag: true,
            });
            setSelectedCodesHdr(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };
    const handleDeleteModalOpen = (codesHdr: CodesHdrData) => {
        setSelectedCodesHdr(codesHdr); // Set the infrastructure item to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleDeleteModalClose = () => {
        setSelectedCodesHdr(null);
        setIsDeleteModalOpen(false);
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);



    const onSubmit = async (data: CodesHdrFormData) => {
        try {
            if (isEditing) {
                await dispatch(editCodesHdr({
                    ...data,
                }));
            } else {
                const { codesHdrSno, ...newCodesHdrData } = data;
                await dispatch(createCodesHdr({
                    ...newCodesHdrData,
                }));
            }
            dispatch(getAllCodesHdr({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async (codesHdr: CodesHdrData) => {
        if (codesHdr) {
            await dispatch(deleteCodesHdr({ codesHdrSno: codesHdr.codesHdrSno }));
            dispatch(getAllCodesHdr({}));
            handleDeleteModalClose();
        }
    };

    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof CodesHdrFormData
    ) => (value: any) => {
        field.onChange(value);
        clearErrors(fieldName);
    };

    const validationRules = {
        codeType: {
            required: 'Cd Value is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.codeType) return 'Cd Value is required';
                    return true;
                }
            }
        },
    };

    const filteredCodesHdr = codeHdrList.filter((codesHdr) =>
        codesHdr.codeType.toLowerCase().includes(searchCodesHdr.toLowerCase())
    );

    return (
        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            <CommonHeader
                title='Code Header'
                description="Manage your Code Header"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchCodesHdr}
                setSearchQuery={setSearchCodesHdr}
                HeaderIcon={Code}
                AddIcon={Plus}
                buttonName='Add CodeHdr'
                placeholder='Search Code Header...'
            />
            <div className="overflow-x-auto mt-8">
                {filteredCodesHdr.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredCodesHdr.map((codeHdr, index) => ({
                            sno: index + 1,
                            codesHdrSno: codeHdr.codesHdrSno,
                            codeType: codeHdr.codeType,
                            activeFlag: codeHdr.activeFlag
                        }))}
                        rowsPerPage={10}
                        initialSortKey="sno"
                        onRowClick={(codeHdr) => console.log('Order clicked:', codeHdr)}
                        globalSearch={false}
                    />
                ) : (
                    <NoDataFound
                        icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                        message1="No Data Found"
                        message2="There are No matching Codes Header found."
                    />
                )}
            </div>
            <div></div>
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
                            {isEditing ? 'Edit CodeHdr' : 'Add CodeHdr'}
                        </h2>
                    </div>
                }
                type="default"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="areaForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                } >
                <form id="areaForm" onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Controller
                            name="codeType"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Cd Value"
                                    error={errors.codeType?.message}
                                    value={field.value}
                                    onChange={field.onChange}
                                    required
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
                            className="px-4 py-2 bg-color text-white rounded-md"
                            onClick={() => handleDelete(selectedCodesHdr!)} // Trigger deletion here
                        >
                            Yes
                        </button>

                    </div>
                }
            >
                <p>Are you sure you want to delete this Codes Header ?</p>
            </Modal>
        </div>
    );
}
export default CodesHdr;