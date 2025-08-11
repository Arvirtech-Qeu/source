import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Cable, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { createInfraProperties, deleteInfraProperties, editInfraProperties, getAllInfraProperties } from '@state/infraPropertiesSlice';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { Pagination } from '@components/pagination';
import { Column, Table } from '@components/Table';
import NoDataFound from '@components/no-data-found';

interface InfraPropertyData {
    infraPropertySno: number;
    infraSno: number;
    propertyName: string;
    dataTypeCd: number;
    infraName?: string;
    activeFlag: boolean;
}

interface InfraPropertyFormData {
    infraPropertySno: number | null;
    infraSno: string;
    propertyName: string;
    dataTypeCd: string;
    activeFlag: boolean;
}
interface InfraData {
    infraSno: number | null;
    infraName: string;
}

interface InfraPropertiesProps {
    infraSno: number | null;
}

const InfraProperties: React.FC<InfraPropertiesProps> = ({ infraSno }) => {

    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedInfraProperty, setSelectedInfraProperty] = React.useState<InfraPropertyData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [itemsPerPage] = useState(8);


    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<InfraPropertyFormData>({
        defaultValues: {
            infraPropertySno: null,
            infraSno: '',
            propertyName: '',
            dataTypeCd: '',
            activeFlag: true
        },
        mode: 'all', // Enable all validation modes
        reValidateMode: 'onChange', // Revalidate on change
    });

    const { infraPropertiesList } = useSelector((state: RootState) => state.infraProperty);
    const { infraList } = useSelector((state: RootState) => state.infra);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllInfraProperties({ infraSno }));
    }, [dispatch]);

    const handleOpenModal = (editing = false, infraProperty: InfraPropertyData | null = null) => {
        if (editing && infraProperty) {
            reset({
                infraPropertySno: infraProperty.infraPropertySno,
                infraSno: infraProperty.infraSno.toString(),
                propertyName: infraProperty.propertyName,
                dataTypeCd: infraProperty.dataTypeCd.toString(),
                activeFlag: infraProperty.activeFlag
            });
            setSelectedInfraProperty(infraProperty);
        } else {
            reset({
                infraPropertySno: null,
                infraSno: '',
                propertyName: '',
                dataTypeCd: '',
                activeFlag: true
            });
            setSelectedInfraProperty(null);

        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: InfraPropertyFormData) => {
        try {
            console.log('Form data submitted:', data); // Add this to debug

            if (isEditing) {
                await dispatch(editInfraProperties({
                    ...data,
                    infraSno: parseInt(data.infraSno),
                    dataTypeCd: parseInt(data.dataTypeCd),
                }));
            } else {
                const { infraPropertySno, ...newPropertyData } = data;
                await dispatch(createInfraProperties({
                    ...newPropertyData,
                    infraSno: parseInt(newPropertyData.infraSno),
                    dataTypeCd: parseInt(newPropertyData.dataTypeCd),
                }));
            }
            dispatch(getAllInfraProperties({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDeleteModalOpen = (infraProperty: InfraPropertyData) => {
        setSelectedInfraProperty(infraProperty); // Set the infrastructure item to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleDeleteModalClose = () => {
        setSelectedInfraProperty(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (infraProperty: InfraPropertyData) => {
        if (infraProperty) {
            await dispatch(deleteInfraProperties({ infraPropertySno: infraProperty.infraPropertySno }));
            dispatch(getAllInfraProperties({}));
            handleDeleteModalClose();
        }

    };

    // Common handler for field changes
    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof InfraPropertyFormData
    ) => (value: any) => {
        field.onChange(value);
        clearErrors(fieldName)
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const columns: Column<InfraPropertyData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'infraName',
            header: 'Asset Name',
            sortable: true,
        },
        {
            key: 'propertyName',
            header: 'Asset Property',
            sortable: true,
        },
        {
            key: 'dataTypeCd',
            header: 'Data TypeCd',
            sortable: true,
        },
        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: InfraPropertyData) => (
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
            render: (value: InfraPropertyData) => (
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
        propertyName: {
            required: 'Infrastructure property is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.propertyName) return 'Infrastructure property is required';
                    return true;
                }
            }
        },
        infraSno: {
            required: 'Infrastructure Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.infraSno) return 'Infrastructure Name is required';
                    return true;
                }
            }
        },
        dataTypeCd: {
            required: 'Data Type Cd is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.dataTypeCd) return 'Data Type Cd is requiredss';
                    return true;
                }
            }
        },

    };
    const filteredInfraProperties = infraPropertiesList?.filter(infra =>
        infra.infraName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        infra.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedInfraProperties = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredInfraProperties?.slice(startIndex, endIndex);
    }, [filteredInfraProperties, currentPage, itemsPerPage]);


    const totalItems = filteredInfraProperties.length;

    return (

        <div>
            <CommonHeader
                title='Asset Properties'
                description="Manage your Asset Properties"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                HeaderIcon={Cable}
                AddIcon={Plus}
                buttonName='Add Asset Properties'
                placeholder='Search Asset Properties...'
            />

            {infraSno ? (
                <div className="overflow-x-auto mt-8">
                    {filteredInfraProperties?.length > 0 ? (
                        <Table
                            columns={columns}
                            data={filteredInfraProperties?.map((ips, index) => ({
                                sno: index + 1,
                                infraPropertySno: ips.infraPropertySno,
                                infraSno: ips.infraSno,
                                propertyName: ips.propertyName,
                                infraName: ips.infraName,
                                dataTypeCd: ips.dataTypeCd,
                                activeFlag: ips.activeFlag
                            }))}
                            rowsPerPage={10}
                            initialSortKey="Sno"
                            globalSearch={false}
                        />
                    ) : (
                        <NoDataFound
                            icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                            message1="No Data Found"
                            message2="No matching Asset properties found."
                        />
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto mt-8">
                    {filteredInfraProperties?.length > 0 ? (
                        <Table
                            columns={columns}
                            data={filteredInfraProperties?.map((ips, index) => ({
                                sno: index + 1,
                                infraPropertySno: ips.infraPropertySno,
                                infraSno: ips.infraSno,
                                propertyName: ips.propertyName,
                                infraName: ips.infraName,
                                dataTypeCd: ips.dataTypeCd,
                                activeFlag: ips.activeFlag
                            }))}
                            rowsPerPage={10}
                            initialSortKey="Sno"
                            globalSearch={false}
                        />
                    ) : (
                        <NoDataFound
                            icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                            message1="No Data Found"
                            message2="No matching Asset properties found."
                        />
                    )}
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
                            {/* <MapPin className="text-orange-500" /> */}
                            {isEditing ? 'Edit Asset Property' : 'Add Asset Property'}
                        </h2>
                    </div>
                }
                type="default"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="propertyForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }
            >
                <form id="propertyForm" onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Controller
                            name="infraSno"
                            control={control}
                            rules={validationRules.infraSno}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Asset Name"
                                    placeholder="Select Asset Name"
                                    required
                                    error={errors.infraSno?.message}
                                    onChange={(value) => handleFieldChange(field, 'infraSno')(value)}
                                    options={infraList.map((infra: InfraData) => ({
                                        label: infra.infraName,
                                        value: infra.infraSno,
                                    }))}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="propertyName"
                            control={control}
                            // rules={{ required: 'Area Name is required' }}
                            rules={validationRules.propertyName}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Asset Property Name"
                                    error={errors.propertyName?.message}
                                    value={field.value}
                                    placeholder="Select Asset Name"
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'propertyName')(e.target.value)}
                                    required
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Controller
                            name="dataTypeCd"
                            control={control}
                            // rules={{ required: 'Area Name is required' }}
                            rules={validationRules.dataTypeCd}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="DataType Cd"
                                    error={errors.dataTypeCd?.message}
                                    value={field.value}
                                    placeholder="Select DataType Cd"
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'dataTypeCd')(e.target.value)}
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
                                    {...field}
                                    label="Status"
                                    placeholder="Select Status"
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
                            onClick={() => handleDelete(selectedInfraProperty!)} // Trigger deletion here
                        >
                            Yes
                        </button>

                    </div>
                }
            >
                <p>Are you sure you want to delete this Infrastructure Property ?</p>
            </Modal>
        </div>
    );
}
export default InfraProperties;