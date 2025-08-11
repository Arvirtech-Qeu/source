import React, { useEffect, useState } from 'react';
import { Plus, Search, MapPin, Home, Building2, Globe, Compass, Map, MapPinHouse, SearchX, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import Card from '@components/card';
import { useDispatch, useSelector } from 'react-redux';
import { getAllArea } from '@state/areaSlice';
import { getAllCity } from '@state/citySlice';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { createAddress, deleteAddress, editAddress, getAllAddress } from '@state/addressSlice';
import { Toast } from '@components/Toast';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import NoDataFound from '@components/no-data-found';

interface AddressData {
    addressSno: number;
    line1: string;
    line2: string;
    areaSno: string;
    citySno: string;
    geoLocCode: string;
    description: string;
    status: string;

}

interface AddressFormData {
    addressSno: number | null;
    line1: string;
    line2: string;
    areaSno: string;
    citySno: string;
    geoLocCode: string;
    description: string;
    status: string;

}
interface CityData {
    citySno: number;
    stateSno: number;
    name: string;
}
interface AreaData {
    areaSno: number;
    name: string;
}

export default function Address() {

    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedAddress, setSelectedAddress] = React.useState<AddressData | null>(null);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const {
        control,
        handleSubmit,
        reset,
        watch,
        trigger,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<AddressFormData>({
        defaultValues: {
            addressSno: null,
            line1: '',
            line2: '',
            areaSno: '',
            citySno: '',
            geoLocCode: '',
            description: ''

        },
        mode: 'all', // Enable all validation modes
        reValidateMode: 'onChange', // Revalidate on change
    });

    const { areaList } = useSelector((state: RootState) => state.area);
    const { addressList } = useSelector((state: RootState) => state.address);
    const { cityList } = useSelector((state: RootState) => state.city);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllArea({}));
        dispatch(getAllAddress({}));
        dispatch(getAllCity({}));
    }, [dispatch]);

    const handleOpenModal = (editing = false, address: AddressData | null = null) => {
        if (editing && address) {
            reset({
                addressSno: address.addressSno,
                line1: address.line1,
                line2: address.line2,
                areaSno: address.areaSno,
                citySno: address.citySno,
                geoLocCode: address.geoLocCode,
                description: address.description

            });
            setSelectedAddress(address);
            console.log("Selected Address:", selectedAddress);
        } else {
            reset({
                addressSno: null,
                line1: '',
                line2: '',
                areaSno: '',
                citySno: '',
                geoLocCode: '',
                description: '',
                status: ''

            });
            setSelectedAddress(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: AddressFormData) => {
        try {
            console.log('Form data submitted:', data);

            if (isEditing) {
                await dispatch(editAddress({
                    ...data,

                }));
            } else {
                const { addressSno, ...newAddressData } = data;
                await dispatch(createAddress({
                    ...newAddressData,


                }));
            }
            dispatch(getAllAddress({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    // const handleDelete = async (area: AddressData) => {
    //     if (window.confirm('Are you sure you want to delete this area?')) {
    //         await dispatch(deleteAddress({ addressSno: area.addressSno }));
    //         dispatch(getAllAddress({}));
    //     }
    // };

    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof AddressFormData
    ) => (value: any) => {
        field.onChange(value);
        clearErrors(fieldName);
    };

    const handleDeleteModalOpen = (infra: AddressData) => {
        setSelectedAddress(infra);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setSelectedAddress(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (address: AddressData) => {
        if (address) {

            await dispatch(deleteAddress({ addressSno: address.addressSno }));
            dispatch(getAllAddress({}));
            handleDeleteModalClose();
            setToast({
                message: "We cannot delete address!",
                type: "error",
                visible: true,
            });

        }

    };


    const validationRules = {
        line1: {
            required: 'Line1 is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.line1) return 'Address is required';
                    return true;
                }
            }
        },
        citySno: {
            required: 'City is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.citySno) return 'City is required';
                    return true;
                }
            }
        },
        geoLocCode: {
            required: 'Location Code is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.citySno) return 'City is required';
                    return true;
                }
            },
            pattern: {
                value: /^[0-9]{5,6}$/,
                message: 'Location code must be 5-6 digits'
            }

        },

    };
    const filteredAddress = addressList?.filter(address =>
        address.line1.toLowerCase().includes(searchQuery.toLowerCase())
    );



    return (
        <div>
            <CommonHeader
                title='Address'
                description="Manage your Address"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                HeaderIcon={MapPinHouse}
                AddIcon={Plus}
                buttonName='Add Address'
                placeholder='Search Address...'
            />
            {/* Grid La(yout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-32 pr-16">
                {filteredAddress && filteredAddress.length > 0 ? (
                    filteredAddress.map((address) => (
                        <Card
                            key={address.areaSno}
                            data={address}
                            headerName={address.line1}
                            onEdit={() => handleOpenModal(true, address)}
                            onDelete={() => handleDeleteModalOpen(address)}
                            homeIcon={<MapPinHouse className="text-color mr-2 w-6 h-7" />}
                            columns={[
                                { key: "line1", icon: <MapPin className="mr-2 text-blue-500" size={16} /> },
                                { key: "areaName", icon: <Map className="mr-2 text-color" size={16} /> },
                                { key: "cityName", icon: <Globe className="mr-2 text-purple-500" size={16} /> },
                                { key: "geoLocCode", icon: <Compass className="mr-2 text-gray-500" size={16} /> },
                            ]}
                        />
                    ))
                ) : (
                    <NoDataFound
                        icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                        message1="No Data Found"
                        message2="There are No matching Address found."
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
                    <div className="mb-6">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            {/* <MapPin className="text-orange-500" /> */}
                            {isEditing ? 'Edit Address' : 'Add New Address'}
                        </h2>
                    </div>
                }
                type="default"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="addressForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Create'}
                        </button>
                    </div>
                }
            >
                <form id="addressForm" onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Controller
                            name="line1"
                            control={control}
                            // rules={{ required: 'Area Name is required' }}
                            rules={validationRules.line1}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Address Line1"
                                    error={errors.line1?.message}
                                    value={field.value}
                                    // onChange={field.onChange}
                                    onChange={(e) => handleFieldChange(field, 'line1')(e.target.value)}
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="line2"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Address Line2"
                                    value={field.value}
                                    onChange={(e) => handleFieldChange(field, 'line2')(e.target.value)}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
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
                                    onChange={(value) => handleFieldChange(field, 'citySno')(value)}
                                    options={cityList.map((city: CityData) => ({
                                        label: city.name,
                                        value: city.citySno.toString(),
                                    }))}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Controller
                            name="geoLocCode"
                            control={control}
                            rules={validationRules.geoLocCode}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Location Code"
                                    required
                                    error={errors.geoLocCode?.message}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className=" space-y-2">
                        <Controller
                            name="areaSno"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Area Name"
                                    placeholder="Select Area"
                                    onChange={(value) => handleFieldChange(field, 'areaSno')(value)}
                                    options={areaList.map((area: AreaData) => ({
                                        label: area.name,
                                        value: area.areaSno.toString(),
                                    }))}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label="Description"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Status"
                                    {...field}
                                    onChange={(value) => handleFieldChange(field, 'status')(value)}
                                    options={[
                                        { label: 'Active', value: 'Active'.toString() },
                                        { label: 'Inactive', value: 'Inactive'.toString() }
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            onClick={() => handleDelete(selectedAddress!)} // Trigger deletion here
                        >
                            Yes
                        </button>

                    </div>
                }
            >
                <p>Are you sure you want to delete this Address?</p>
            </Modal>
        </div>
    );
}