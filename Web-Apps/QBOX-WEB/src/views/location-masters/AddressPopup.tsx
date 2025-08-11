import AnimatedModal from "@components/AnimatedModel";
import Input from "@components/Input";
import Select from "@components/Select";
import { createAddress, editAddress, getAllAddress } from "@state/addressSlice";
import { getAllArea } from "@state/areaSlice";
import { getAllCity } from "@state/citySlice";
import { getAllCountry } from "@state/countrySlice";
import { getAllState } from "@state/stateSlice";
import { AppDispatch, RootState } from "@state/store";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface AddressData {
    addressSno: number;
    line1: string;
    line2: string;
    areaSno: string;
    citySno: string;
    countrySno: string;
    stateSno: string;
    geoLocCode: string;
    description: string;
    activeFlag: boolean;

}

interface AddressFormData {
    addressSno: number | null;
    line1: string;
    line2: string;
    areaSno: string;
    citySno: string;
    countrySno: string;
    stateSno: string;
    geoLocCode: string;
    description: string;
    activeFlag: boolean;

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
interface CountryData {
    countrySno: number;
    name: string;
}
interface StateData {
    stateSno: number;
    name: string;
}

interface AnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddressSubmit: (addressDetails: AddressFormData) => void;
    addressToEdit: AddressData | null;
}


const AddressPopUp: React.FC<AnimatedModalProps> = ({ isOpen, onClose, onAddressSubmit, addressToEdit }: any) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { areaList } = useSelector((state: RootState) => state.area);
    const { cityList } = useSelector((state: RootState) => state.city);
    const { countryList } = useSelector((state: RootState) => state.country);
    const { stateList } = useSelector((state: RootState) => state.state);

    const [filteredStates, setFilteredStates] = useState<StateData[]>([]);
    const [filteredCities, setFilteredCities] = useState<CityData[]>([]);
    const [filteredAreas, setFilteredAreas] = useState<AreaData[]>([]);


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
            countrySno: '',
            stateSno: '',
            geoLocCode: '',
            description: '',
            activeFlag: true

        },
        mode: 'all', // Enable all validation modes
        reValidateMode: 'onChange', // Revalidate on change
    });
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllArea({}));
        dispatch(getAllAddress({}));
        dispatch(getAllCity({}));
        dispatch(getAllCountry({}));
        dispatch(getAllState({}));
    }, [dispatch]);

    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof AddressFormData
    ) => async (value: any) => {
        field.onChange(value);
        clearErrors(fieldName);

        if (fieldName === "countrySno") {
            // Fetch states based on selected country
            const response = await dispatch(getAllState({ countrySno: value }));
            // Assuming the response contains a `payload` with the state list
            const states = response.payload || [];
            // Update the state with the new list of states
            setFilteredStates(states);
            setFilteredCities([]); // Reset cities
            setFilteredAreas([]); // Reset areas
        }
        if (fieldName === "stateSno") {
            // Fetch states based on selected country
            const response = await dispatch(getAllCity({ stateSno: value }));
            // Assuming the response contains a `payload` with the state list
            const cities = response.payload || [];
            // Update the state with the new list of states
            setFilteredCities(cities);
            setFilteredAreas([]); // Reset areas
        }
        if (fieldName === "citySno") {
            // Fetch states based on selected country
            const response = await dispatch(getAllArea({ citySno: value }));
            // Assuming the response contains a `payload` with the state list
            const areas = response.payload || [];
            // Update the state with the new list of states
            setFilteredAreas(areas);
        }
    };

    // Modified useEffect to handle editing and data fetching
    useEffect(() => {
        const initializeEditData = async () => {
            if (addressToEdit) {
                setIsEditing(true);

                // First, fetch states for the selected country
                if (addressToEdit.countrySno) {
                    const statesResponse = await dispatch(getAllState({
                        countrySno: addressToEdit.countrySno
                    }));
                    setFilteredStates(statesResponse.payload || []);
                }

                // Then fetch cities for the selected state
                if (addressToEdit.stateSno) {
                    const citiesResponse = await dispatch(getAllCity({
                        stateSno: addressToEdit.stateSno
                    }));
                    setFilteredCities(citiesResponse.payload || []);
                }

                // Finally fetch areas for the selected city
                if (addressToEdit.citySno) {
                    const areasResponse = await dispatch(getAllArea({
                        citySno: addressToEdit.citySno
                    }));
                    setFilteredAreas(areasResponse.payload || []);
                }

                // Reset form with address values after fetching dependent data
                reset({
                    addressSno: addressToEdit.addressSno,
                    line1: addressToEdit.line1,
                    line2: addressToEdit.line2,
                    areaSno: addressToEdit.areaSno,
                    citySno: addressToEdit.citySno,
                    countrySno: addressToEdit.countrySno,
                    stateSno: addressToEdit.stateSno,
                    geoLocCode: addressToEdit.geoLocCode,
                    description: addressToEdit.description,
                    activeFlag: addressToEdit.activeFlag,
                });
            } else {
                setIsEditing(false);
                reset();
                // Clear filtered data when adding new address
                setFilteredStates([]);
                setFilteredCities([]);
                setFilteredAreas([]);
            }
        };

        initializeEditData();
    }, [addressToEdit, dispatch, reset]);


    const onSubmit = async (data: AddressFormData) => {
        // Call the parent component's function to submit address details
        onAddressSubmit(data);
        reset();
        onClose();
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
        countrySno: {
            required: 'Country is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.countrySno) return 'Country is required';
                    return true;
                }
            }
        },
        stateSno: {
            required: 'State is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.stateSno) return 'State is required';
                    return true;
                }
            }
        },
        areaSno: {
            required: 'Area is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.areaSno) return 'Area is required';
                    return true;
                }
            }
        },
        geoLocCode: {
            required: 'Location Code is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.geoLocCode) return 'City is required';
                    return true;
                }
            },

        },

    };


    return (
        <>
            <AnimatedModal
                isOpen={isOpen}
                // onClose={onClose}
                onClose={() => {
                    onClose();
                    reset();
                }}
                title={
                    <div>
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            {/* <MapPin className="text-orange-500" /> */}
                            {isEditing ? 'Edit Address' : 'Add Address'}
                        </h2>
                    </div>
                }
                type="default"
                size="2xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleSubmit(onSubmit)}
                            type="submit"
                            form="addressForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Edit' : 'Add'}
                        </button>
                    </div>
                }
            >
                <form id="addressForm" className="p-4 space-y-6">
                    <div className="flex">
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
                                        onChange={(e) => handleFieldChange(field, 'line1')(e.target.value)}
                                        required
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2 ml-2">
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
                    </div>
                    <div className="flex">
                        <div className="space-y-2 flex-1">
                            <Controller
                                name="countrySno"
                                control={control}
                                rules={validationRules.countrySno}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Country"
                                        placeholder="Select a Country"
                                        required
                                        error={errors.countrySno?.message}
                                        onChange={(value) => handleFieldChange(field, "countrySno")(value)}
                                        options={countryList?.map((country) => ({
                                            label: country.name,
                                            value: country.countrySno.toString(),
                                        }))}
                                    />
                                )}
                            />

                        </div>
                        <div className=" space-y-2 flex-1 ml-2">
                            <Controller
                                name="stateSno"
                                control={control}
                                rules={validationRules.stateSno}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="State"
                                        placeholder="Select a State"
                                        required
                                        error={errors.stateSno?.message}
                                        onChange={(value) => handleFieldChange(field, "stateSno")(value)}
                                        options={filteredStates?.map((state) => ({
                                            label: state.name,
                                            value: state.stateSno.toString(),
                                        }))}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="space-y-2 flex-1">
                            <Controller
                                name="citySno"
                                control={control}
                                rules={validationRules.citySno}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="City"
                                        placeholder="Select a City"
                                        required
                                        error={errors.citySno?.message}
                                        onChange={(value) => handleFieldChange(field, "citySno")(value)}
                                        options={filteredCities?.map((city) => ({
                                            label: city.name,
                                            value: city.citySno.toString(),
                                        }))}
                                    />
                                )}
                            />
                        </div>
                        <div className=" space-y-2 flex-1 ml-2">
                            <Controller
                                name="areaSno"
                                control={control}
                                rules={validationRules.areaSno}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Area"
                                        placeholder="Select an Area"
                                        required
                                        error={errors.areaSno?.message}
                                        onChange={(value) => handleFieldChange(field, "areaSno")(value)}
                                        options={filteredAreas?.map((area) => ({
                                            label: area.name,
                                            value: area.areaSno.toString(),
                                        }))}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="space-y-2 flex-1">
                            <Controller
                                name="geoLocCode"
                                control={control}
                                rules={validationRules.geoLocCode}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label=" Geo Location Code"
                                        required
                                        error={errors.geoLocCode?.message}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2 flex-1 ml-2">
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
                                        { label: 'Active', value: 'Active'.toString() },
                                        { label: 'Inactive', value: 'Inactive'.toString() }
                                    ]}
                                />
                            )}
                        />
                    </div>

                </form>
            </AnimatedModal>

        </>
    );
}

export default AddressPopUp;