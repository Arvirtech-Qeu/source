import React, { ReactNode, useEffect } from 'react';
import { Plus, Search, MapPin, Globe, Building2, Home, MonitorCog, Pencil, Trash2, Eye, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import Card from '@components/card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { createInfrastructure, deleteInfrastructure, editInfrastructure, getAllInfrastructure } from '@state/infrastructureSlice';
import Select from '@components/Select';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import { Column, Table } from '@components/Table';
import CommonHeader from '@components/common-header';
import * as lucide from "lucide-react";
import { useNavigate } from 'react-router-dom';
import NoDataFound from '@components/no-data-found';


interface InfraData {
    infraSno: number | null;
    infraName: string;
    infraIcon: string;
    activeFlag: boolean;
}

interface InfraFormData {
    statusColor: any;
    infraSno: number | null,
    infraName: string;
    infraIcon: string;
    activeFlag: boolean;
}


interface InfrastructuresProps {
    setActiveTab: (tab: string) => void;
    setSelectedInfraSno: (infraSno: number | null) => void;
}

// interface InfrastructuresProps {
//     isHovered: any;
// }
const Infrastructures: React.FC<InfrastructuresProps> = ({ setActiveTab, setSelectedInfraSno }) => {
    // const Infrastructures = () => {

    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedInfrastructure, setSelectedInfrastructure] = React.useState<InfraData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [searchInfrastructure, setSearchInfrastructure] = React.useState('');
    const { infraList } = useSelector((state: RootState) => state.infra);
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<InfraFormData>({
        defaultValues: {
            infraSno: null,
            infraName: '',
            infraIcon: '',
            activeFlag: true
        },
        mode: 'all', // Enable all validation modes
        reValidateMode: 'onChange', // Revalidate on change
    });

    useEffect(() => {
        dispatch(getAllInfrastructure({}));
    }, [dispatch]);

    console.log(infraList)
    const handleOpenModal = (editing = false, infra: InfraData | null = null) => {
        if (editing && infra) {
            reset({
                infraSno: infra.infraSno,
                infraName: infra.infraName,
                infraIcon: infra.infraIcon,
                activeFlag: infra.activeFlag
            });
            setSelectedInfrastructure(infra);
        } else {
            reset({
                infraSno: null,
                infraName: '',
                infraIcon: '',
                activeFlag: true
            });
            setSelectedInfrastructure(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: InfraFormData) => {
        try {
            console.log('Form data submitted:', data); // Add this to debug

            if (isEditing) {
                await dispatch(editInfrastructure({
                    ...data,
                }));
            } else {
                const { infraSno, ...newInfrastructureData } = data;
                await dispatch(createInfrastructure({
                    ...newInfrastructureData,
                }));
            }
            dispatch(getAllInfrastructure({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDeleteModalOpen = (infra: InfraData) => {
        setSelectedInfrastructure(infra); // Set the infrastructure item to be deleted
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleDeleteModalClose = () => {
        setSelectedInfrastructure(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (infra: InfraData) => {
        if (infra) {
            await dispatch(deleteInfrastructure({ infraSno: infra.infraSno }));
            dispatch(getAllInfrastructure({}));
            handleDeleteModalClose();
        }
    };

    const handleView = (infra: InfraData) => {
        if (infra.infraSno) {
            setActiveTab("infra-properties"); // Switch to the Infra Properties tab
            setSelectedInfraSno(infra.infraSno); // Pass infraSno
        }
    };


    // Common handler for field changes
    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof InfraFormData
    ) => (value: any) => {
        field.onChange(value);
        // Clear error when user starts typing/selecting
        clearErrors(fieldName);
    };

    const columns: Column<InfraData>[] = [
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
            key: 'infraIcon',
            header: 'Asset Icon',
            sortable: true,
            render: (value: InfraData) => {
                // const IconComponent = lucide[value.infraIcon]; // Dynamically fetch the icon from lucide-react
                const IconComponent = lucide[value.infraIcon] || lucide.AlertCircle; // Default icon
                return (
                    <div className="flex">
                        {IconComponent ? (
                            <IconComponent className="w-6 h-6 text-color" />
                        ) : (
                            <span className="text-gray-500">No Icon</span>
                        )}
                        <span className='ps-4'> {value.infraIcon}</span>
                    </div>
                );
            },
        },
        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: InfraData) => (
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
            render: (value: InfraData) => (
                <div className="flex space-x-8">
                    <button
                        onClick={() => handleView(value)}
                    >
                        <Eye className='w-4 h-4 text-gray-600' />
                    </button>
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
        infraName: {
            required: 'Infrastructure Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.infraName) return 'Infrastructure Name is required';
                    return true;
                }
            }
        },

    };

    const filteredInfrastructure = infraList.filter((infra: InfraData) =>
        infra.infraName.toLowerCase().includes(searchInfrastructure.toLowerCase())
    );

    return (
        <div>
            <CommonHeader
                title='Asset'
                description="Manage your Assets here."
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchInfrastructure}
                setSearchQuery={setSearchInfrastructure}
                HeaderIcon={MonitorCog}
                AddIcon={Plus}
                buttonName='Add Asset'
                placeholder='Search Asset...'
            />

            <div className="overflow-x-auto mt-8">
                {filteredInfrastructure.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredInfrastructure.map((infra, index) => ({
                            sno: index + 1,
                            infraSno: infra.infraSno,
                            infraName: infra.infraName,
                            infraIcon: infra.infraIcon,
                            activeFlag: infra.activeFlag
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        onRowClick={(infra) => console.log('Order clicked:', infra)}
                        globalSearch={false}
                    />
                ) : (
                    <NoDataFound
                        icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                        message1="No Data Found"
                        message2="No matching infrastructure found."
                    />
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
                            {isEditing ? 'Edit Asset' : 'Add Asset'}
                        </h2>
                    </div>
                }
                type="default"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="infraForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }
            >
                <form id="infraForm" onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Controller
                            name="infraName"
                            control={control}
                            // rules={{ required: 'Area Name is required' }}
                            rules={validationRules.infraName}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Asset Name"
                                    error={errors.infraName?.message}
                                    value={field.value}
                                    placeholder="Asset Name"
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'infraName')(e.target.value)}
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="infraIcon"
                            control={control}
                            // rules={{ required: 'Area Name is required' }}
                            // rules={validationRules.infraName}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Asset Icon"
                                    error={errors.infraIcon?.message}
                                    value={field.value}
                                    placeholder="Asset Icon"
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'infraIcon')(e.target.value)}
                                // required
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
                            onClick={() => handleDelete(selectedInfrastructure!)} // Trigger deletion here
                        >
                            Yes
                        </button>

                    </div>
                }
            >
                <p>Are you sure you want to delete this Infrastructure ?</p>
            </Modal>
        </div>
    );
}
export default Infrastructures;
