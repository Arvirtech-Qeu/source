import React, { useEffect, useState } from "react";
import { UtensilsCrossed, Building2, Check, PlusIcon, MapPin, MapPinHouse, Map, Globe, Compass } from "lucide-react";
import { Alert, AlertDescription } from "@components/Alert";
import { CardContent, CardHeader, CardTitle, MasterCard } from "@components/MasterCard";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import { getAllCodesDtl, getQboxEntityStatus } from "@state/codeDtlSlice";
import Select from "@components/Select";
import { createQboxEntity, editQboxEntity, getAllQboxEntities } from "@state/qboxEntitySlice";
import { getAllAddress } from "@state/addressSlice";
import { getAllArea } from "@state/areaSlice";
import { useLocation, useNavigate } from "react-router-dom";
import AddressPopUp from "@view/location-masters/AddressPopup";
import Card from "@components/card";
import { Modal } from "@components/Modal";
import { getAllState } from "@state/stateSlice";
import GoogleMapComponent from "./GoogleMapComponent";
import { set } from "date-fns";


interface QboxEntityData {
  qboxEntitySno: number | null;
  qboxEntityName: string;
  entityCode: string;
  qboxEntityStatusCd: number | null;
  addressSno: string;
  // stateSno: string;
  activeFlag: boolean;
  createdOn: string;

}

type FormData = {
  qboxEntitySno: number | null;
  qboxEntityName: string;
  entityCode: string;
  qboxEntityStatusCd: number | null;
  addressSno: string;
  // stateSno: string;
  activeFlag: boolean;
  createdOn: string;
};

const defaultFormData: QboxEntityData = {
  qboxEntitySno: null,
  qboxEntityName: "",
  entityCode: "",
  qboxEntityStatusCd: null,
  addressSno: "",
  // stateSno: "",
  activeFlag: true,
  createdOn: ''
}

interface AddressData {
  addressSno: number;
  line1: string;
  line2: string;
  areaSno: string;
  citySno: string;
  countrySno: string,
  stateSno: string;
  geoLocCode: string;
  description: string;
  activeFlag: boolean

}

const labelMapping: { [key: string]: string } = {
  qboxEntityName: "Delivery Location Name",
  entityCode: "Delivery Location Code",
  qboxEntityStatusCd: "Delivery Location Status",
  stateSno: "State",
  addressSno: "Address",
  activeFlag: 'Status'
};

const RemoteLocationOnboarding = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const { qboxEntityStatusList } = useSelector((state: RootState) => state.codesDtl);
  const { addressList } = useSelector((state: RootState) => state.address);
  const { areaList } = useSelector((state: RootState) => state.area);
  const { stateList } = useSelector((state: RootState) => state.state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [addressDetails, setAddressDetails]: any = useState<AddressData | null>(null);
  const [qboxEntitySno, setQboxEntitySno] = useState<string | null>(null);
  const { createqboxEntityResult } = useSelector((state: RootState) => state.qboxEntity);
  const [addressToEdit, setAddressToEdit] = useState<AddressData | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { entityData } = location.state || {};
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<QboxEntityData>({
    defaultValues: defaultFormData,
    mode: 'onChange'
  });

  useEffect(() => {
    console.log("Form Errors:", errors);
    console.log("Is Form Valid:", isValid);
    console.log("Is Form entityData:", entityData)
  }, [errors, isValid]);


  const handleAddressSubmit = (newAddressDetails) => {
    setAddressDetails(newAddressDetails);
    setSelectedAddress(newAddressDetails);
  };


  useEffect(() => {
    dispatch(getQboxEntityStatus({ codeType: 'qbox_entity_status_cd' }));
    dispatch(getAllAddress({}));
    dispatch(getAllArea({}));
    dispatch(getAllState({}));
    if (entityData) {
      setIsEditing(true);
      reset(entityData);
    }
    if (entityData?.addressList?.length) {
      // Set the first address from the addressList as the default
      const defaultAddress = entityData.addressList[0];
      setSelectedAddress(defaultAddress);
      setAddressDetails(defaultAddress); // Assuming addressDetails match the structure of an address in addressList
    }
  }, [dispatch, reset, entityData, createqboxEntityResult]);

  const handleConfigResponse = (confirmed) => {
    setIsConfigModalOpen(false);

    if (confirmed) {
      navigate(`/master-settings/entity-dashboard/infra-config?qboxEntitySno=${qboxEntitySno}`);
    } else {
      navigate("/master-settings/entity-dashboard");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    reset(); // Reset form values
    try {
      // Prepare the new entity data and add the addressList to it
      const entityDataWithAddress = {
        ...data,
        addressDetails, // Add the addressList here
      };

      if (isEditing && entityData) {
        await dispatch(editQboxEntity(entityDataWithAddress));
        setShowSuccess(true);
        navigate("/master-settings/entity-dashboard");
      } else {
        const { qboxEntitySno, ...newEntityData } = data;
        console.log(newEntityData);

        // Dispatch the create action and await the response
        const createResponse = await dispatch(
          createQboxEntity({
            ...newEntityData,
            addressDetails, // Send the addressList in the payload
          })
        );

        // Check if the response indicates success
        const result = createResponse?.payload;
        console.log(result);

        if (result?.isSuccess === true && result?.status === 201) {
          const qboxEntitySno = result?.data?.data?.qboxEntitySno;
          setIsConfigModalOpen(true);

          // Navigate to the infra-config page with the qboxEntitySno
          if (qboxEntitySno) {
            setQboxEntitySno(qboxEntitySno)
          }
        }
        setShowSuccess(true);
        reset(defaultFormData);
        setAddressDetails(null);
      }

      dispatch(getAllQboxEntities({}));
      setTimeout(() => {
        setShowSuccess(false); // Hide success message after a few seconds
      }, 3000);
    } catch (err) {
      setError("An error occurred while processing the entity");
    } finally {
      setIsLoading(false);
    }
  };

  const validationRules = {
    qboxEntityName: {
      required: 'Restaurant Name is required',
      validate: (value: string) => {
        if (typeof value !== 'string') return 'Restaurant Name must be text';
        return value.trim() !== "" || "Restaurant Name is required";
      }
    },
    entityCode: {
      required: 'Entity Code is required',
      validate: {
        length: (value: string) => {
          if (!value) return null;
          if (value.trim().length > 6) {
            return "Entity Code must not exceed 6 characters";
          }
          return true;
        }
      }
    },
    qboxEntityStatusCd: {
      required: 'Status Cd is required',
      validate: (value: string) => {
        // if (typeof value !== 'string') return 'Status Code must be text';
        // return value.trim() !== "" || "Status Cd is required";
      }
    },
    // areaSno: {
    //   required: 'Area is required',
    //   validate: (value: string | number) => {
    //     if (!value) return "Area is required";
    //     return true;
    //   }
    // }
  };


  useEffect(() => {
    console.log('Modal state is now:', isModalOpen);
  }, [isModalOpen]);


  const handleAddressChange = (value: string) => {
    const address = addressList.find(address => address.addressSno.toString() === value);
    setSelectedAddress(address || null); // Update selected area state
  };


  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any potential form submission when closing
    setAddressDetails(null);  // Reset address details
  };

  const handleConfigModalClose = () => {
    setIsConfigModalOpen(false);
    navigate("/master-settings/entity-dashboard");
  };

  // Reordering fields - putting addressSno at the end
  const formFields = ["qboxEntityName", "entityCode", "qboxEntityStatusCd", "activeFlag", "addressSno"];

  const handleAddressSelect = (place) => {
    // Check if we need to open the modal
    if (place.modalShouldBeOpen) {
      setIsModalOpen(true);
    }

    const {
      addressSno = 0,
      line1 = '',
      line2 = '',
      areaSno = '',
      citySno = '',
      countrySno = '',
      stateSno = '',
      geoLocCode = '',
      description = '',
      activeFlag = true
    } = place.addressDetails || {};

    const newAddressDetails: AddressData = {
      addressSno,
      line1,
      line2,
      areaSno,
      citySno,
      countrySno,
      stateSno,
      geoLocCode,
      description,
      activeFlag
    };

    setAddressDetails(newAddressDetails);

    console.log('Selected place:', place.addressDetails);
    console.log('Updated AddressDetails:', newAddressDetails);
  };



  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="w-24 h-24 mx-auto custom-gradient-right rounded-full flex items-center justify-center shadow-lg">
            <UtensilsCrossed className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold">
            Delivery Location Onboarding
          </h1>
          <p className="text-gray-600">Create your Delivery Location hera...</p>
        </div>

        {/* Form */}
        <MasterCard className="w-full bg-white shadow-xl p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-color">
              <Building2 className="w-6 h-6" onClick={() => navigate("/master-settings/entity-dashboard")} />
              Delivery Location Onboarding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Render all fields except addressSno first */}
                {formFields.filter(field => field !== "addressSno").map((fieldName) => (
                  <div key={fieldName} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {labelMapping[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').trim()}
                      {validationRules[fieldName]?.required && (
                        <span className="text-color">*</span>
                      )}
                    </label>

                    <Controller
                      name={fieldName as keyof FormData}
                      control={control}
                      rules={validationRules[fieldName]}
                      render={({ field }) => {
                        const errorMessage = errors[fieldName]?.message;
                        if (fieldName === "qboxEntityStatusCd") {
                          return (
                            <Select
                              {...field}
                              options={[
                                { label: "Select Entity Status Cd", value: "", isDisabled: true },
                                ...qboxEntityStatusList.map((entityStatus) => ({
                                  label: entityStatus.cdValue,
                                  value: entityStatus.codesDtlSno.toString(),
                                })),
                              ]}
                              value={field.value || ""}
                            />
                          );
                        }
                        else if (fieldName === "activeFlag") {
                          return (
                            <Select
                              {...field}
                              placeholder="Select Status"
                              options={[
                                { label: "Active", value: "true" },
                                { label: "Inactive", value: "false" },
                              ]}
                            />
                          );
                        } else {
                          return (
                            <input
                              {...field}
                              placeholder={`Enter ${fieldName.replace(/([A-Z])/g, ' $1').trim()}`}
                              value={typeof field.value === 'boolean' ? field.value.toString() : field.value ?? ''}
                              className={`w-full px-3 border py-1 rounded-md ${errors[fieldName] ? 'border-color' : 'border-gray-300'}`}
                            />
                          );
                        }
                      }}
                    />
                    {errors[fieldName] && (
                      <span className="text-sm text-color">{errors[fieldName]?.message}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Address field as the last item in a full-width container */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {labelMapping["addressSno"] || "addressSno".replace(/([A-Z])/g, ' $1').trim()}
                  {validationRules["addressSno"]?.required && (
                    <span className="text-color">*</span>
                  )}
                </label>

                <Controller
                  name="addressSno"
                  control={control}
                  rules={validationRules["addressSno"]}
                  render={({ field }) => (
                    <>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMapOpen(true);
                            console.log('Opening Map');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-color text-white rounded-lg hover:bg-blue-600"
                        >
                          <Map className="w-5 h-5" />
                          Pin Address
                        </button>
                        {isMapOpen && (
                          <div className="map-slide-panel top-0 right-0 w-full md:w-1/2 lg:w-1/2 bg-white shadow-lg p-4 fixed z-50 h-full overflow-y-auto">
                            <div className="flex justify-end mb-2">
                              <button
                                type="button"
                                onClick={() => setIsMapOpen(false)}
                                className="text-gray-600 hover:text-red-500 text-xl font-bold"
                              >
                                ✕
                              </button>
                            </div>
                            <GoogleMapComponent
                              onAddressSelect={handleAddressSelect}
                              setIsModelOpen={setIsModalOpen}
                              setIsMapOpen={setIsMapOpen}
                            />
                          </div>
                        )}
                      </div>
                    </>

                  )}
                />

                {selectedAddress && addressDetails && (
                  <MasterCard className="bg-white shadow-xl rounded-lg p-4 max-w-[350px]">
                    <CardHeader className="pb-4 border-b border-gray-200">
                      <CardTitle className="flex items-center gap-3 text-color font-bold text-lg">
                        <MapPinHouse className="w-6 h-6" />
                        Address Details
                        <button type="button" onClick={handleClose} className="text-gray-600 hover:text-color ms-auto">
                          X
                        </button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm text-gray-700">
                      <p className="font-medium text-gray-900">Line 1: <span className="font-normal">{addressDetails.line1}</span></p>
                      <p className="font-medium text-gray-900">Line 2: <span className="font-normal">{addressDetails.line2}</span></p>
                      <p className="font-medium text-gray-900">Location Code: <span className="font-normal">{addressDetails.geoLocCode}</span></p>
                      <p className="font-medium text-gray-900">Description: <span className="font-normal">{addressDetails.description}</span></p>
                    </CardContent>
                  </MasterCard>
                )}
              </div>
              <div className="flex justify-between pt-6">
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="flex items-center gap-2 px-6 py-2 text-white bg-color rounded-lg 
                  hover:bg-color transition-colors disabled:opacity-50 ml-auto"
                >
                  {isLoading ? "Processing..." : <>{isEditing ? "Update" : "Create"}</>}
                </button>
              </div>
            </form>
          </CardContent>
        </MasterCard>
        <AddressPopUp
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onAddressSubmit={handleAddressSubmit}
          addressToEdit={addressDetails}
        />

        {/* Infra Configration Modal */}
        {isConfigModalOpen && (
          <Modal
            isOpen={isConfigModalOpen}
            onClose={() => handleConfigResponse(false)}
            title="Asset configure"
            type="info"
            size="xl"
            footer={
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="btn-secondary"
                  onClick={() => handleConfigResponse(false)}
                >
                  No
                </button>
                <button
                  className="px-4 py-2 bg-color text-white rounded-md hover:bg-color"
                  onClick={() => handleConfigResponse(true)}
                >
                  Yes
                </button>
              </div>
            }
          >
            <p>Do you want to configure your Asset?</p>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default RemoteLocationOnboarding;