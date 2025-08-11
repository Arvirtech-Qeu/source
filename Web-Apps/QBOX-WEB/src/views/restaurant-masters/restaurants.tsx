import React, { useEffect, useMemo, useState } from 'react';
import { Plus, CookingPot, SearchX, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createRestaurant, deleteRestaurant, editRestaurant, getAllRestaurant, getRestaurantBrandCd, getRestaurantStatusCd } from '@state/restaurantSlice';
import { AppDispatch, RootState } from '@state/store';
import Select from '@components/Select';
import { getAllArea } from '@state/areaSlice';
import { getAllAddress } from '@state/addressSlice';
import AnimatedModal from '@components/AnimatedModel';
import Input from '@components/Input';
import CommonHeader from '@components/common-header';
import { Pagination } from '@components/pagination';
import { getAllCity } from '@state/citySlice';
import { Column, Table } from '@components/Table';
import { getAllCountry } from '@state/countrySlice';
import { getAllState } from '@state/stateSlice';
import NoDataFound from '@components/no-data-found';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';

interface RestaurantData {
    restaurantSno: number;
    restaurantName: string;
    restaurantBrandCd: string;
    addressSno: number;
    areaSno: string;
    restaurantStatusCd: string;
    activeFlag: boolean;
    line1: string;
    line2: string;
    citySno: string;
    geoLocCode: string;
    description: string;
    restaurantCode: string;
    cityCode: string;
    countrySno: string;
    stateSno: string;
}

interface RestaurantFormData {
    restaurantSno: number | null;
    restaurantName: string;
    restaurantBrandCd: string;
    addressSno: number | null;
    areaSno: string;
    restaurantStatusCd: string;
    activeFlag: boolean;
    line1: string;
    line2: string;
    citySno: string
    geoLocCode: string;
    description: string;
    restaurantCode: string;
    cityCode: string;
    countrySno: string;
    stateSno: string;

}
interface AreaData {
    areaSno: number;
    name: string;
}

interface RestaurantProps {
    isHovered: any;
}

// const Restaurant: React.FC<RestaurantProps> = ({ isHovered }) => {
const Restaurant = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const { restaurantList } = useSelector((state: RootState) => state.restaurant);
    const { restaurantStatusCdList } = useSelector((state: RootState) => state.restaurant);
    const dispatch = useDispatch<AppDispatch>();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [showWarningToast, setShowWarningToast] = useState(false);
    const { countryList } = useSelector((state: RootState) => state.country);
    const [filteredStates, setFilteredStates]: any = useState([]);
    const [filteredCities, setFilteredCities]: any = useState([]);
    const [filteredAreas, setFilteredAreas]: any = useState([]);


    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, touchedFields },
    } = useForm<RestaurantFormData>({
        defaultValues: {
            restaurantSno: null,
            restaurantName: '',
            restaurantBrandCd: '',
            addressSno: null,
            areaSno: '',
            restaurantStatusCd: '',
            activeFlag: true,
            line1: '',
            line2: '',
            citySno: '',
            geoLocCode: '',
            description: '',
            restaurantCode: '',
            countrySno: '',
            stateSno: '',
            cityCode: ''


        },
        mode: 'all',
        reValidateMode: 'onChange',
    });

    useEffect(() => {
        dispatch(getAllRestaurant({}));
        dispatch(getAllArea({}));
        dispatch(getAllAddress({}));
        dispatch(getAllCity({}));
        dispatch(getAllCountry({}));
        dispatch(getAllState({}));
        dispatch(getRestaurantStatusCd({ codeType: 'restaurant_status_cd' }));
        dispatch(getRestaurantBrandCd({ codeType: 'restaurant_brand_cd' }));
    }, [dispatch]);

    const handleOpenModal = async (editing = false, restaurant: RestaurantData | null = null) => {

        if (editing && restaurant) {
            // First, fetch states for the selected country
            if (restaurant.countrySno) {
                const statesResponse = await dispatch(getAllState({
                    countrySno: restaurant.countrySno
                }));
                setFilteredStates(statesResponse.payload || []);
            }
            // Then fetch cities for the selected state
            if (restaurant.stateSno) {
                const citiesResponse = await dispatch(getAllCity({
                    stateSno: restaurant.stateSno
                }));
                setFilteredCities(citiesResponse.payload || []);
            }

            // Finally fetch areas for the selected city
            if (restaurant.citySno) {
                const areasResponse = await dispatch(getAllArea({
                    citySno: restaurant.citySno
                }));
                setFilteredAreas(areasResponse.payload || []);
            }
            reset({
                restaurantSno: restaurant.restaurantSno,
                restaurantName: restaurant.restaurantName,
                restaurantBrandCd: restaurant.restaurantBrandCd,
                addressSno: restaurant.addressSno,
                activeFlag: restaurant.activeFlag,
                geoLocCode: restaurant.geoLocCode,
                description: restaurant.description,
                restaurantStatusCd: restaurant.restaurantStatusCd,
                restaurantCode: restaurant.restaurantCode,
                line1: restaurant.line1,
                line2: restaurant.line2,
                countrySno: restaurant.countrySno,
                stateSno: restaurant.stateSno,
                citySno: restaurant.citySno,
                areaSno: restaurant.areaSno,
                cityCode: restaurant.cityCode
            });
            setSelectedRestaurant(restaurant);
        } else {
            reset({
                restaurantSno: null,
                restaurantName: '',
                restaurantBrandCd: '',
                addressSno: null,
                restaurantStatusCd: '',
                activeFlag: true,
                line1: '',
                line2: '',
                citySno: '',
                geoLocCode: '',
                description: '',
                areaSno: '',
                restaurantCode: '',
                countrySno: '',
                stateSno: '',
                cityCode: ''
            });
            setSelectedRestaurant(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const onSubmit = async (data: RestaurantFormData) => {
        try {
            console.log('Form data submitted:', data);

            if (isEditing) {
                await dispatch(editRestaurant({
                    ...data
                }))
            } else {
                const { restaurantSno, addressSno, ...newRestaurantData } = data;
                await dispatch(createRestaurant({
                    ...newRestaurantData,
                    areaSno: parseInt(newRestaurantData.areaSno),
                    citySno: parseInt(newRestaurantData.citySno),
                    countrySno: parseInt(newRestaurantData.countrySno),
                    stateSno: parseInt(newRestaurantData.stateSno),
                    restaurantStatusCd: parseInt(newRestaurantData.restaurantStatusCd),

                }));
            }
            dispatch(getAllRestaurant({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    // const handleFieldChange = (
    //     field: { onChange: (value: any) => void },
    //     fieldName: keyof RestaurantData
    // ) => (value: any) => {
    //     field.onChange(value);
    //     clearErrors(fieldName);
    // };

    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof RestaurantData
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

    const handleDeleteModalOpen = (infra: RestaurantData) => {
        setSelectedRestaurant(infra);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setSelectedRestaurant(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (restaurant: RestaurantData) => {
        if (restaurant) {
            await dispatch(deleteRestaurant({ restaurantSno: restaurant.restaurantSno }));
            dispatch(getAllRestaurant({}));
            handleDeleteModalClose();
        }

    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const columns: Column<RestaurantData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'restaurantName',
            header: 'Restaurant Name',
            sortable: true,
        },
        {
            key: 'restaurantBrandCd',
            header: 'Brand Name',
            sortable: true,
        },
        {
            key: 'restaurantCode',
            header: 'Restaurant Code',
            sortable: true,
        },
        {
            key: 'address',
            header: 'Address',
            sortable: true,
            render: (row: any) => (
                <div className="text-gray-700">
                    <div className="font-medium">{row.line1}</div>
                    <div className="text-sm text-gray-500">{row.areaName}, {row.cityName}, {row.stateName}, {row.countryName}</div>
                </div>
            )
        },
        {
            key: 'activeFlag',
            header: 'Status',
            render: (value: RestaurantData) => (
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
            render: (value: RestaurantData) => (
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

    const validationRules = {
        restaurantName: {
            required: 'Restaurant Name is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.restaurantName) return 'Restaurant Name is required';
                    return true;
                }
            }
        },
        restaurantStatusCd: {
            required: 'Restaurant status is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.restaurantStatusCd) return 'Restaurant status is required';
                    return true;
                }
            }
        },
        restaurantCode: {
            required: 'Restaurant code is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.restaurantCode) return 'Restaurant code is required';
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
        geoLocCode: {
            required: 'Geolocation Code is required',
            validate: {
                checkOnBlur: (value: string) => {
                    if (!value && touchedFields.geoLocCode) return 'Geolocation Code is required';
                    return true;
                }
            },

        },
    };

    const filteredRestaurant = (restaurantList ?? []).filter(restaurant =>
        restaurant?.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getWarningMessage = () => {
        if (!restaurantStatusCdList?.length) {
            return "Restaurant Status CD List is empty. Please add Restaurant Status CD first.";
        }
        return "Please ensure all required data is available";
    };

    const handleWarningClose = () => {
        setShowWarningToast(false)
    }
    console.log(restaurantList)
    return (
        // <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
        <div>
            <CommonHeader
                title='Restaurant'
                description="Manage your Restaurant"
                onAdd={() => handleOpenModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                HeaderIcon={CookingPot}
                AddIcon={Plus}
                buttonName='Add Restaurant'
                placeholder='Search Restaurant...'
                dependencies={[restaurantStatusCdList]}
                warningMessage={getWarningMessage()}
                openWarningTost={showWarningToast}
                closeWarningTost={handleWarningClose}
            />
            <div className="overflow-x-auto mt-8">
                {filteredRestaurant?.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredRestaurant?.map((r, index) => ({
                            sno: index + 1,
                            restaurantSno: r.restaurantSno,
                            restaurantBrandCd: r.restaurantBrandCd,
                            restaurantName: r.restaurantName,
                            restaurantCode: r.restaurantCode,
                            line1: r.line1,
                            line2: r.line2,
                            addressSno: r.addressSno,
                            geoLocCode: r.geoLocCode,
                            restaurantStatusCd: r.restaurantStatusCd,
                            activeFlag: r.activeFlag,
                            areaName: r.areaName,
                            cityName: r.cityName,
                            stateName: r.stateName,
                            countryName: r.countryName,
                            citySno: r.citySno,
                            areaSno: r.areaSno,
                            countrySno: r.countrySno,
                            stateSno: r.stateSno,
                            cityCode: r.cityCode
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        globalSearch={false}
                    />
                ) : (
                    <EmptyState />
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
                            {isEditing ? 'Edit Restaurant' : 'Add Restaurant'}
                        </h2>
                    </div>
                }
                type="default"
                size="custom1"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            form="restaurantForm"
                            className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                }
                className=""
            >
                <form id="restaurantForm" onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6 ">

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2 ">
                            <Controller
                                name="restaurantName"
                                control={control}
                                rules={validationRules.restaurantName}
                                render={({ field }) => (
                                    <Input
                                        label="Restaurant Name"
                                        error={errors.restaurantName?.message}
                                        {...field}
                                        placeholder="Enter Restaurant Name"
                                        value={field.value}
                                        onChange={(e) => handleFieldChange(field, 'restaurantName')(e.target.value)}
                                        required
                                        className='w-full'
                                        style={{ height: '42px' }}
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Controller
                                name="restaurantStatusCd"
                                control={control}
                                rules={validationRules.restaurantStatusCd}
                                render={({ field }) => (
                                    <Select
                                        label="Restaurant Status"
                                        error={errors.restaurantStatusCd?.message}
                                        {...field}
                                        required
                                        onChange={(value) => handleFieldChange(field, 'restaurantStatusCd')(value)}
                                        placeholder="Select Restaurant status"
                                        options={restaurantStatusCdList.map((cDtl) => ({
                                            label: cDtl.cdValue,
                                            value: cDtl.codesDtlSno.toString(),
                                        }))}

                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Controller
                                name="restaurantBrandCd"
                                control={control}
                                // rules={validationRules.restaurantName}
                                render={({ field }) => (
                                    <Input
                                        label="Restaurant Brand"
                                        error={errors.restaurantBrandCd?.message}
                                        {...field}
                                        placeholder="Enter Restaurant Brand"
                                        value={field.value}
                                        // onChange={(e) => handleFieldChange(field, 'restaurantBrandCd')(e.target.value)}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (newValue.length <= 6) { // Restrict input to 5 characters
                                                field.onChange(newValue);
                                            }
                                        }}
                                        // required
                                        className='w-full'
                                        style={{ height: '42px' }}
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Controller
                                name="restaurantCode"
                                control={control}
                                rules={validationRules.restaurantCode}
                                render={({ field }) => (
                                    <Input
                                        label="Restaurant Code"
                                        error={errors.restaurantCode?.message}
                                        {...field}
                                        placeholder="Enter Restaurant Code"
                                        value={field.value}
                                        onChange={(e) => handleFieldChange(field, 'restaurantCode')(e.target.value)}
                                        required
                                        className='w-full'
                                        style={{ height: '42px' }}
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Controller
                                name="cityCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        label="City Code"
                                        error={errors.cityCode?.message}
                                        {...field}
                                        placeholder="Enter City Code"
                                        value={field.value}
                                        // onChange={(e) => handleFieldChange(field, 'cityCode')(e.target.value)}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (newValue.length <= 5) { // Restrict input to 5 characters
                                                field.onChange(newValue);
                                            }
                                        }}
                                        className='w-full'
                                        style={{ height: '42px' }}
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
                    </div>


                    <h1 className='font-bold ml-2 text-xl mt-4'>Add Address</h1>
                    <div className="grid grid-cols-3 gap-4">
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
                                        placeholder='Enter Address Line1'
                                        error={errors.line1?.message}
                                        value={field.value}
                                        // onChange={field.onChange}
                                        onChange={(e) => handleFieldChange(field, 'line1')(e.target.value)}
                                        required
                                        style={{ height: '42px' }}
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
                                        placeholder='Enter Address Line2'
                                        value={field.value}
                                        onChange={(e) => handleFieldChange(field, 'line2')(e.target.value)}
                                        style={{ height: '42px' }}
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
                                        label="Geo Location Code"
                                        placeholder="Enter Location code"
                                        required
                                        error={errors.geoLocCode?.message}
                                        value={field.value}
                                        onChange={field.onChange}
                                        style={{ height: '42px' }}
                                    />
                                )}
                            />
                        </div>
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
                        <div className="space-y-2">
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
                        <div className="space-y-2">
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
                </form>
            </AnimatedModal>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteModalClose}
                title="Delete"
                type="info"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-md"
                            onClick={handleDeleteModalClose}
                        >
                            No
                        </button>
                        <button
                            className="px-4 py-2 bg-color text-white rounded-md"
                            onClick={() => handleDelete(selectedRestaurant!)} // Trigger deletion here
                        >
                            Yes
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this Restaurant ?</p>
            </Modal>
        </div>
    );
}

export default Restaurant;