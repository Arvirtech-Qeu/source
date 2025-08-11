import React, { useEffect, useMemo, useState } from 'react';
import { Plus, MapPin, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createArea, deleteArea, editArea, getAllArea } from '@state/areaSlice';
import { getAllCountry } from '@state/countrySlice';
import { getAllState } from '@state/stateSlice';
import { getAllCity } from '@state/citySlice';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { AnimatedModal } from '@components/AnimatedModel';
import Input from '@components/Input';
import { CommonHeader } from '@components/common-header';
import { Pagination } from '@components/pagination';
import { Column, Table } from '@components/Table';
import NoDataFound from '@components/no-data-found';

interface AreaData {
    areaSno: number;
    countrySno: number;
    stateSno: number;
    citySno: number;
    name: string;
    pincode: string;
    city1name?: string;
    activeFlag: boolean;
}

interface AreaFormData {
    areaSno: number | null;
    countrySno: number | null;
    stateSno: number | null;
    citySno: number | null;
    name: string;
    pincode: string;
    country1name?: string;
    activeFlag: boolean;
}

interface CountryData {
    countrySno: number;
    name: string;
}

interface StateData {
    stateSno: number;
    countrySno: number;
    name: string;
}

interface CityData {
    citySno: number;
    stateSno: number;
    name: string;
}

interface AreaProps {
    isHovered: any;
}

const Area: React.FC<AreaProps> = ({ isHovered }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<AreaFormData>({
        defaultValues: {
            areaSno: null,
            countrySno: null,
            stateSno: null,
            citySno: null,
            name: '',
            pincode: '',
            activeFlag: true,
        },
        mode: 'all',
        reValidateMode: 'onChange',
    });

    const { areaList } = useSelector((state: RootState) => state.area);
    const { countryList } = useSelector((state: RootState) => state.country);
    const { stateList } = useSelector((state: RootState) => state.state);
    const { cityList } = useSelector((state: RootState) => state.city);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllArea({}));
        dispatch(getAllCountry({}));
        dispatch(getAllState({}));
        dispatch(getAllCity({}));
    }, [dispatch]);

    const handleOpenModal = (editing = false, area: AreaData | null = null) => {
        if (editing && area) {
            reset({
                areaSno: area.areaSno,
                name: area.name,
                countrySno: area.countrySno,
                stateSno: area.stateSno,
                citySno: area.citySno,
                pincode: area.pincode,
                activeFlag: area.activeFlag
            });
            setSelectedArea(area);
        } else {
            reset({
                areaSno: null,
                countrySno: null,
                stateSno: null,
                citySno: null,
                name: '',
                pincode: '',
                activeFlag: true
            });
            setSelectedArea(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof AreaFormData
    ) => (value: any) => {
        field.onChange(value);
        clearErrors(fieldName);
    };

    const onSubmit = async (data: AreaFormData) => {
        try {
            if (isEditing) {
                await dispatch(editArea({
                    ...data,
                }));
            } else {
                const { areaSno, ...newAreaData } = data;
                await dispatch(createArea({
                    ...newAreaData,
                }));
            }
            dispatch(getAllArea({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDeleteModalOpen = (area: AreaData) => {
        setSelectedArea(area);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setSelectedArea(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async () => {
        if (selectedArea) {
            await dispatch(deleteArea({ areaSno: selectedArea.areaSno }));
            dispatch(getAllArea({}));
            handleDeleteModalClose();
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const validationRules = {
        name: {
            required: 'Area Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.name) return 'Area Name is required';
                    return true;
                }
            }
        },
        countrySno: {
            required: 'Country is required',
            validate: {
                checkOnBlur: (value: number | null) => {
                    if (!value && touchedFields.countrySno) return 'Country is required';
                    return true;
                }
            }
        },
        stateSno: {
            required: 'State is required',
            validate: {
                checkOnBlur: (value: number | null) => {
                    if (!value && touchedFields.stateSno) return 'State is required';
                    return true;
                }
            }
        },
        citySno: {
            required: 'City is required',
            validate: {
                checkOnBlur: (value: number | null) => {
                    if (!value && touchedFields.citySno) return 'City is required';
                    return true;
                }
            }
        },
        pincode: {
            required: 'Pincode is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.pincode) return 'Pincode is required';
                    return true;
                },
            }
        },
    };

    const columns: Column<AreaData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'name',
            header: 'Area',
            sortable: true,
        },
        {
            key: 'country1name',
            header: 'Country',
            sortable: true,
        },
        {
            key: 'state1name',
            header: 'State',
            sortable: true,
        },
        {
            key: 'city1name',
            header: 'City',
            sortable: true,
        },
        {
            key: 'pincode',
            header: 'Pincode',
            sortable: true,
        },
        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: AreaData) => (
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
            render: (value: AreaData) => (
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

    const filteredArea = areaList?.filter((area) =>
        area.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            <CommonHeader
                title="Area"
                description="Manage your Area"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                buttonName="Add Area"
                placeholder="Search Area..."
                HeaderIcon={MapPin}
                AddIcon={Plus}
            />
            <div className="overflow-x-auto mt-8">
                {filteredArea.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredArea.map((area, index) => ({
                            sno: index + 1,
                            areaSno: area.areaSno,
                            name: area.name,
                            country1name: area.country1name,
                            state1name: area.state1name,
                            stateSno: area.stateSno,
                            citySno: area.citySno,
                            countrySno: area.countrySno,
                            city1name: area.city1name,
                            pincode: area.pincode,
                            activeFlag: area.activeFlag
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        onRowClick={(area) => console.log('Area clicked:', area)}
                        globalSearch={false}
                    />
                ) : (
                    <NoDataFound
                        icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                        message1="No Data Found"
                        message2="There are No matching Area found."
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
                            {isEditing ? 'Edit Area' : 'Add Area'}
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
                }
            >
                <form id="areaForm" onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-2">
                    <div className=" pb-2">
                        <Controller
                            name="name"
                            control={control}
                            rules={validationRules.name}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Area Name"
                                    placeholder='Enter Area'
                                    error={errors.name?.message}
                                    required
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Controller
                            name="countrySno"
                            control={control}
                            rules={validationRules.countrySno}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Country"
                                    placeholder="Select a country"
                                    required
                                    error={errors.countrySno?.message}
                                    value={field.value || ""}
                                    onChange={(value) => {
                                        field.onChange(value || "");
                                        handleFieldChange(field, 'countrySno')(value)
                                    }}
                                    options={countryList.map((country: CountryData) => ({
                                        label: country.name,
                                        value: country.countrySno.toString(),
                                    }))}
                                />
                            )}
                        />
                        <div className="space-y-2 pb-2">
                            <Controller
                                name="stateSno"
                                control={control}
                                rules={validationRules.stateSno}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="State"
                                        placeholder="Select a state"
                                        required
                                        error={errors.stateSno?.message}
                                        value={field.value || ""}
                                        onChange={(value) => {
                                            field.onChange(value || "");
                                            handleFieldChange(field, 'stateSno')(value)
                                        }}
                                        options={stateList.map((state: StateData) => ({
                                            label: state.name,
                                            value: state.stateSno.toString(),
                                        }))}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pb-2">
                        <Controller
                            name="citySno"
                            control={control}
                            rules={validationRules.citySno}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="City"
                                    placeholder="Select a city"
                                    required
                                    error={errors.citySno?.message}
                                    value={field.value || ""}
                                    onChange={(value) => {
                                        field.onChange(value || "");
                                        handleFieldChange(field, 'citySno')(value)
                                    }}
                                    options={cityList.map((city: CityData) => ({
                                        label: city.name,
                                        value: city.citySno.toString(),
                                    }))}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2 pb-2">
                        <Controller
                            name="pincode"
                            control={control}
                            rules={validationRules.pincode}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Pincode"
                                    label="Pincode"
                                    error={errors.pincode?.message}
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
                                    label="activeFlag"
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
                            onClick={handleDeleteModalClose} >
                            No
                        </button>
                        <button
                            className="px-4 py-2 bg-color text-white rounded-md"
                            onClick={handleDelete} >
                            Yes
                        </button>
                    </div>
                } >
                <p>Are you sure you want to delete this Area ?</p>
            </Modal>
        </div>
    );
}

export default Area;