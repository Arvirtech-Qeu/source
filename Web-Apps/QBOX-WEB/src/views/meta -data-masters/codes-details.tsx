import React, { useEffect } from 'react';
import { Plus, List, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { getAllCodesHdr } from '@state/codeHdrSlice';
import { createCodesDtl, deleteCodesDtl, editCodesDtl, getAllCodesDtl } from '@state/codeDtlSlice';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import { Column, Table } from '@components/Table';
import CommonHeader from '@components/common-header';
import { Modal } from '@components/Modal';
import NoDataFound from '@components/no-data-found';

interface CodesDtlData {
    id: number;
    codesDtlSno: number;
    codesHdrSno: string;
    description: string;
    seqno: string;
    filter1: string;
    filter2: string;
    activeFlag?: boolean;
}

interface CodesDtlFormData {
    statusColor: any;
    id: number | null;
    codesDtlSno: number | null;
    codesHdrSno: string;
    cdValue: string;
    seqno: string;
    filter1: string;
    filter2: string;
    activeFlag: boolean;
}


interface CodesDtlProps {
    isHovered: any;
}

const CodesDtl: React.FC<CodesDtlProps> = ({ isHovered }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedCodesDtl, setSelectedCodesDtl] = React.useState<CodesDtlData | null>(null);
    const [searchCodesDtl, setSearchCodesDtl] = React.useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<CodesDtlFormData>({
        defaultValues: {
            id: null,
            codesDtlSno: null,
            codesHdrSno: '',
            cdValue: '',
            seqno: '',
            filter1: '',
            filter2: '',
            activeFlag: true
        },
        mode: 'all',
        reValidateMode: 'onChange',
    });

    const { codeHdrList } = useSelector((state: RootState) => state.codesHdr);
    const { codeDtlList } = useSelector((state: RootState) => state.codesDtl);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllCodesHdr({}));
        dispatch(getAllCodesDtl({}));
    }, [dispatch]);

    const columns: Column<CodesDtlData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: false,
        },
        {
            key: 'description',
            header: 'Cd Value',
            sortable: false,
        },
        {
            key: 'codesDtlSno',
            header: 'CodesDtl Sno',
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
            render: (value: CodesDtlData) => (
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
            render: (value: CodesDtlData) => (
                <div className="flex space-x-8">
                    <button
                        onClick={() => handleOpenModal(true, value)}
                    >
                        <Pencil className='w-4 h-4 text-gray-600' />
                    </button>
                    <button
                        onClick={() => handleDeleteModalOpen(value)}
                        className=''
                    >
                        <Trash2 className='w-4 h-4 text-color' />
                    </button>
                </div>
            ),
        }
    ];


    const handleOpenModal = (editing = false, codesDtl: CodesDtlData | null = null) => {
        if (editing && codesDtl) {
            reset({
                codesDtlSno: codesDtl.codesDtlSno,
                codesHdrSno: codesDtl.codesHdrSno,
                cdValue: codesDtl.description,
                seqno: codesDtl.seqno,
                filter1: codesDtl.filter1,
                filter2: codesDtl.filter2,
                activeFlag: codesDtl.activeFlag,
            });
            setSelectedCodesDtl(codesDtl);
        } else {
            reset({
                id: null,
                codesDtlSno: null,
                codesHdrSno: '',
                cdValue: '',
                seqno: '',
                filter1: '',
                filter2: '',
                activeFlag: true
            });
            setSelectedCodesDtl(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };
    const handleDeleteModalOpen = (codesDtl: CodesDtlData) => {
        setSelectedCodesDtl(codesDtl); // Set the infrastructure item to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleDeleteModalClose = () => {
        setSelectedCodesDtl(null);
        setIsDeleteModalOpen(false);
    };


    const onSubmit = async (data: CodesDtlFormData) => {
        try {
            if (isEditing) {
                await dispatch(editCodesDtl({
                    ...data,
                }));
            } else {
                const { codesDtlSno, ...newCodesDtlData } = data;
                await dispatch(createCodesDtl({
                    ...newCodesDtlData,
                }));
            }
            dispatch(getAllCodesDtl({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async (codesDtl: CodesDtlData) => {
        if (codesDtl) {
            await dispatch(deleteCodesDtl({ codesDtlSno: codesDtl.codesDtlSno }));
            dispatch(getAllCodesDtl({}));
            handleDeleteModalClose();
        }
    };

    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof CodesDtlFormData
    ) => (value: any) => {
        field.onChange(value);
        clearErrors(fieldName);
    };

    const validationRules = {
        codesHdrSno: {
            required: 'CodesHdrSno is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.codesHdrSno) return 'CodesHdrSno is required';
                    return true;
                }
            }
        },
        cdValue: {
            required: 'Cd Value is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.cdValue) return 'Cd Value is required';
                    return true;
                }
            }
        },
        seqno: {
            required: 'Seqno is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.seqno) return 'Seqno is required';
                    return true;
                }
            }
        },
    };

    const filteredCodesDtl = codeDtlList.filter((codesDtl: CodesDtlData) =>
        codesDtl.description.toLowerCase().includes(searchCodesDtl.toLowerCase())
    );

    return (
        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            <CommonHeader
                title='Code Details'
                description="Manage your Code Details"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchCodesDtl}
                setSearchQuery={setSearchCodesDtl}
                HeaderIcon={List}
                AddIcon={Plus}
                buttonName='Add CodeDtl'
                placeholder='Search Code Details...'
            />
            <div className="overflow-x-auto mt-8">
                {filteredCodesDtl.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredCodesDtl.map((codeDtl, index) => ({
                            sno: index + 1,
                            codesDtlSno: codeDtl.codesDtlSno,
                            codesHdrSno: codeDtl.codesHdrSno,
                            description: codeDtl.description,
                            seqno: codeDtl.seqno,
                            filter1: codeDtl.filter1,
                            filter2: codeDtl.filter2,
                            activeFlag: codeDtl.activeFlag
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        onRowClick={(codeDtl) => console.log('Order clicked:', codeDtl)}
                        globalSearch={false}
                    />
                ) : (
                    <NoDataFound
                        icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                        message1="No Data Found"
                        message2="There are No matching Codes Detail found."
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
                    <div className="">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            {isEditing ? 'Edit CodesDtl' : 'Add CodesDtl'}
                        </h2>
                    </div>
                }
                type="default"
                size="2xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="codesDtlForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }
            >
                <form id="codesDtlForm" onSubmit={handleSubmit(onSubmit)} className="p-4">
                    <div className="space-y-4">
                        <div>
                            <Controller
                                name="codesHdrSno"
                                control={control}
                                rules={validationRules.codesHdrSno}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="CodesHdr Sno"
                                        placeholder="Select a codesHdrSno"
                                        required
                                        error={errors.codesHdrSno?.message}
                                        onChange={(value) => handleFieldChange(field, 'codesHdrSno')(value)}
                                        options={codeHdrList.map((cHdr) => ({
                                            label: cHdr.codeType,
                                            value: cHdr.codesHdrSno.toString(),
                                        }))}
                                    />
                                )}
                            />
                        </div>
                        <div className='flex'>
                            <div className="space-y-2">
                                <Controller
                                    name="cdValue"
                                    control={control}
                                    rules={validationRules.cdValue}
                                    render={({ field }) => (
                                        <Input
                                            label="cd Value"
                                            error={errors.cdValue?.message}
                                            required
                                            className='w-full'
                                            placeholder='Enter cd Value'
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2 ml-3">
                                <Controller
                                    name="seqno"
                                    control={control}
                                    rules={validationRules.seqno}
                                    render={({ field }) => (
                                        <Input
                                            label="Sequence No"
                                            error={errors.seqno?.message}
                                            placeholder='Enter Sequence No'
                                            required
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className='flex w-full space-x-4'>
                                <div className="flex-1">
                                    <Controller
                                        name="filter1"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                label="Filter 1"
                                                placeholder='Enter Filter 1'
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <Controller
                                name="filter2"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        label="Filter 2"
                                        placeholder='Enter Filter 2'
                                        {...field}
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
                                        placeholder="Select a Status"
                                        onChange={(value) => handleFieldChange(field, 'activeFlag')(value)}
                                        options={[
                                            { label: 'Active', value: 'true' },
                                            { label: 'Inactive', value: 'false' },
                                        ]}
                                        value={field.value?.toString()}
                                    />
                                )}
                            />
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
                            onClick={() => handleDelete(selectedCodesDtl!)} // Trigger deletion here
                        >
                            Yes
                        </button>

                    </div>
                }
            >
                <p>Are you sure you want to delete this Codes Detail ?</p>
            </Modal>
        </div>
    );
}
export default CodesDtl;