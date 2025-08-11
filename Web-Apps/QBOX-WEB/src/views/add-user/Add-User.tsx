import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import {
  ArrowLeft,
  Circle,
  User,
  Settings,
  Users,
  Wrench,
  Check,
  EyeOff,
  Eye,
  Camera,
  BadgeIcon as IdCard,
} from "lucide-react"
import Illustration from "@assets/images/illustration.png"
import { useLocation, useNavigate } from "react-router-dom"
import Logo from "@assets/images/q-logo.png"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch, RootState } from "@state/store"
import FileUploadService from "@services/FileService/FileUploadService"
import { toast } from "react-toastify"
import { getAllUsers, type ProfileUpdateParams, updateProfile } from "@state/profileSlice"
import { apiService } from "@services/apiService"
import type { ApiResponse } from "../../types/apiTypes"
import { getAllQboxEntities } from "@state/qboxEntitySlice"
import { getAllDeliiveryPartner } from "@state/deliveryPartnerSlice"
import { getAllRole } from "@state/authnSlice"
import TimePicker from "@components/time-picker"
import { getAllCity } from "@state/citySlice"
import { getAllState } from "@state/stateSlice"
import { getAllArea } from "@state/areaSlice"
import { getFromLocalStorage } from "@utils/storage"

const PORT = import.meta.env.VITE_API_QBOX_AUTHN_PORT
const MASTERPORT = import.meta.env.VITE_API_QBOX_MASTER_PORT
const PRIFIX_URL = import.meta.env.VITE_API_AUTHN_PREFIX_URL
const MASTER_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL

interface FormData {
  profile_name: string
  auth_user_name: string
  passwordHash: string
  contact: string
  aadhar_number: string
  role_id: string
  media_link: string | null
  supervisor_sno: string
  deliveryPartnerSno: string
  qbox_entity_sno: string
  auth_user_id: string
  supervisor_name: string
  profile_id: number | null
  // shiftTime: {
  //   fromTime: string;
  //   toTime: string;
  // };
  details: any[]
}

interface Option {
  qboxEntitySno: number
  qboxEntityName: string
}

interface AddUserPageProps {
  userData?: any
}

const AddUserPage: React.FC<AddUserPageProps> = ({ userData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const { roleList } = useSelector((state: RootState) => state.authnSlice)
  const [showMultiSelect, setShowMultiSelect] = useState(false)
  const [showPartner, setShowPartner] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [supervisors, setSupervisors] = useState<any[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity)
  const { profileList } = useSelector((state: RootState) => state.profileSlice)
  const { deliveryPartnerList } = useSelector((state: RootState) => state.deliveryPartners)
  const [uploadStatus, setUploadStatus] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)
  const { cityList } = useSelector((state: RootState) => state.city);
  const { stateList } = useSelector((state: RootState) => state.state);
  const { areaList } = useSelector((state: RootState) => state.area);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [profilePic, setProfilePic] = useState<any>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [loaderDetails, setLoaderDetails] = useState<any[]>([]);
  // const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentDetail, setCurrentDetail] = useState({
    qboxEntitySno: '',
    supervisorSno: '',
    shiftTime: '',
    // ...other fields
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fileUploadService = new FileUploadService()
  const [formData, setFormData]: any = useState<FormData>({
    profile_name: "",
    auth_user_name: "",
    passwordHash: "",
    contact: "",
    aadhar_number: "",
    role_id: "",
    media_link: null,
    supervisor_sno: "",
    deliveryPartnerSno: "",
    qbox_entity_sno: "",
    auth_user_id: "",
    supervisor_name: "",
    profile_id: null,
    details: []
  })

  useEffect(() => {
    let validationErrors = {};

    if (currentStep === 1) {
      // Common validations for both modes
      if (!formData.profile_name?.trim()) validationErrors['profile_name'] = "Name is required";
      if (!formData.contact?.trim()) validationErrors['contact'] = "Mobile number is required";
      else if (!/^\d{10}$/.test(formData.contact.trim())) validationErrors['contact'] = "Invalid mobile number";
      if (!formData.aadhar_number?.trim()) validationErrors['aadhar_number'] = "Aadhar number is required";
      else if (!/^\d{12}$/.test(formData.aadhar_number.trim())) validationErrors['aadhar_number'] = "Invalid Aadhar number";

      // Only validate these fields in non-edit mode
      if (!isEditMode) {
        if (!formData.auth_user_name?.trim()) validationErrors['auth_user_name'] = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.auth_user_name.trim())) validationErrors['auth_user_name'] = "Invalid email address";
        if (!formData.passwordHash?.trim()) validationErrors['passwordHash'] = "Password is required";
      }
    } else if (currentStep === 2 && formData.role_id) {
      // Role-specific validations for step 2
      const selectedRole = roleList.find(role => role.roleId === Number(formData.role_id));
      if (selectedRole) {
        if (selectedRole.roleName === 'Aggregator Admin' && !formData.deliveryPartnerSno) {
          validationErrors['deliveryPartnerSno'] = "Delivery Aggregator is required";
        }
        if (selectedRole.roleName === 'Loader' && !formData.qbox_entity_sno) {
          validationErrors['qbox_entity_sno'] = "Delivery Location required";
        }
        if (selectedRole.roleName === 'Supervisor' && !formData.supervisor_sno) {
          validationErrors['supervisor_sno'] = "Supervisor is required";
        }
      }
    }

    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [formData, currentStep, isEditMode, roleList]);

  const initializeFormData = useCallback(() => {
    if (location.state?.user) {
      const user = location.state.user;
      console.log(user)
      setIsEditMode(true);
      console.log(user)

      // Transform additional_details into the details format we need
      const details = user.additional_details?.map(detail => ({
        qboxEntitySno: String(detail.qbox_entity_sno),
        supervisorSno: String(detail.supervisor_sno || ''),
        shiftTime: String(detail.shift_time || '')
      })) || [];

      console.log("Details:", details)
      const initialData = {
        profile_name: user.profile_name || '',
        auth_user_name: user.auth_user_name || '',
        passwordHash: '',
        contact: user.contact || '',
        aadhar_number: user.aadhar_number || '',
        role_id: String(user.role_id) || '',
        media_link: user.media_link || null,
        deliveryPartnerSno: user.delivery_partner_sno || '',
        qbox_entity_sno: user.qbox_entity_sno || '',
        auth_user_id: String(user.auth_user_id) || '',
        supervisor_sno: String(user.supervisor_sno) || '',
        supervisor_name: user.supervisor_name || '',
        profile_id: user.profile_id || null,
        // shiftTime: {
        //   fromTime: user.shiftTime?.split(' - ')[0] || '',
        //   toTime: user.shiftTime?.split(' - ')[1] || ''
        // },
        details: details
      };

      setFormData(initialData);
      setLoaderDetails(details); // Set loader details for the LoaderContent component

      // Handle profile image
      if (user.media_link) {
        try {
          let mediaUrl = user.media_link.mediaUrl;
          if (typeof mediaUrl === 'string' && mediaUrl.startsWith('{')) {
            mediaUrl = JSON.parse(mediaUrl).mediaUrl;
          }
          setImageSrc(mediaUrl);
          setProfilePic(user.media_link);
        } catch (error) {
          console.error("Error setting profile image:", error);
          setImageSrc("/default-user-icon.png");
        }
      } else {
        setImageSrc("/default-user-icon.png");
      }
    }
  }, [location.state]);

  useEffect(() => {
    initializeFormData()
    dispatch(getAllRole({}))
    dispatch(getAllQboxEntities({}))
    dispatch(getAllDeliiveryPartner({}))
    dispatch(getAllUsers({}))
    dispatch(getAllCity({}));
    dispatch(getAllState({}));
    dispatch(getAllArea({}));
  }, [dispatch, initializeFormData])

  // Filter supervisors
  useEffect(() => {
    // if (profileList?.data?.users) {
    //   const supervisorsFiltered = profileList.data.users.filter((user) => user.role_id === 5)
    //   setSupervisors(supervisorsFiltered)
    // }
  }, [profileList])

  const validateForm = useCallback((data: FormData) => {
    const newErrors: any = {}

    // Common validations
    if (!data.profile_name?.trim()) newErrors.profile_name = "Name is required"
    if (!data.contact?.trim()) newErrors.contact = "Mobile number is required"
    else if (!/^\d{10}$/.test(data.contact.trim())) newErrors.contact = "Invalid mobile number"
    if (!data.aadhar_number?.trim()) newErrors.aadhar_number = "Aadhar number is required"
    else if (!/^\d{12}$/.test(data.aadhar_number.trim())) newErrors.aadhar_number = "Invalid Aadhar number"

    // New user specific validations - Only check these in non-edit mode
    if (!isEditMode) {
      if (!data.auth_user_name?.trim()) newErrors.auth_user_name = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(data.auth_user_name.trim())) newErrors.auth_user_name = "Invalid email address"
      if (!data.passwordHash?.trim()) newErrors.passwordHash = "Password is required"
    }

    // Only validate role-specific fields when in step 2
    if (currentStep === 2 && data.role_id) {
      const selectedRole = roleList.find(role => role.roleId === Number(data.role_id))
      if (selectedRole) {
        if (selectedRole.roleName === 'Aggregator Admin' && !data.deliveryPartnerSno) {
          newErrors.deliveryPartnerSno = "Delivery Partner is required"
        }
        if (selectedRole.roleName === 'Loader' && !data.qbox_entity_sno) {
          newErrors.qbox_entity_sno = "QBox Entity is required"
        }
        if (selectedRole.roleName === 'Supervisor' && !data.supervisor_sno) {
          newErrors.supervisor_sno = "Supervisor is required"
        }
      }
    }

    return newErrors
  }, [isEditMode, roleList, currentStep])

  // Update form validation on changes
  useEffect(() => {
    const validationErrors = validateForm(formData)
    setErrors(validationErrors)
    setIsFormValid(Object.keys(validationErrors).length === 0)
  }, [formData, validateForm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value.trim() }))

    if (name === "role_id" && !isEditMode) {
      const selectedRole = roleList.find((role) => role.roleId === Number(value))
      setShowMultiSelect(selectedRole?.roleName?.toLowerCase() === "loader")
      setShowPartner(selectedRole?.roleName?.toLowerCase() === "aggregator admin")
    }
  }

  const handleDeliveryPartnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, deliveryPartnerSno: value }))
    setErrors(prev => ({ ...prev, deliveryPartnerSno: "" }))
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      const fileService = new FileUploadService()
      const uploadList = await new Promise<any[]>((resolve, reject) => {
        fileService.send(files, (result, error) => {
          if (error) reject(error)
          else resolve(result)
        })
      })

      if (uploadList?.length > 0) {
        setProfilePic(uploadList[0])
        const reader = new FileReader()
        reader.onloadend = () => {
          setImageSrc(reader.result as string)
        }
        reader.readAsDataURL(files[0])
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Error uploading file. Please try again.")
    }
  }

  const getSelectedRoleName = () => {
    if (!formData.role_id) return null
    return roleList.find(role => role.roleId === Number(formData.role_id))?.roleName
  }

  const handleRoleSelect = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      role_id: roleId,
    }));

    if (errors.role_id) {
      setErrors((prev) => ({
        ...prev,
        role_id: undefined,
      }));
    }

    // Reset locations and supervisors when role changes
    setSelectedLocations([]);
    setSupervisors([]);
    setShowMultiSelect(roleId === '3'); // Assuming '3' is the role_id for Loader
  };


  const handleContinue = () => {
    // Validate only step 1 fields
    const step1ValidationErrors = {};

    // Common validations for both modes
    if (!formData.profile_name?.trim()) step1ValidationErrors['profile_name'] = "Name is required";
    if (!formData.contact?.trim()) step1ValidationErrors['contact'] = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.contact.trim())) step1ValidationErrors['contact'] = "Invalid mobile number";
    if (!formData.aadhar_number?.trim()) step1ValidationErrors['aadhar_number'] = "Aadhar number is required";
    else if (!/^\d{12}$/.test(formData.aadhar_number.trim())) step1ValidationErrors['aadhar_number'] = "Invalid Aadhar number";

    // Only validate these fields in non-edit mode
    if (!isEditMode) {
      if (!formData.auth_user_name?.trim()) step1ValidationErrors['auth_user_name'] = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.auth_user_name.trim())) step1ValidationErrors['auth_user_name'] = "Invalid email address";
      if (!formData.passwordHash?.trim()) step1ValidationErrors['passwordHash'] = "Password is required";
    }

    if (Object.keys(step1ValidationErrors).length > 0) {
      setErrors(step1ValidationErrors);
      toast.error("Please fill all required fields correctly");
      return;
    }

    setCurrentStep(2);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditMode) {
        const updateParams: ProfileUpdateParams = {
          profileName: formData.profile_name,
          contact: formData.contact,
          aadharNumber: formData.aadhar_number,
          profileImage: profilePic ? {
            containerName: "Profile",
            mediaList: [{ mediaUrl: profilePic }],
            deleteMediaList: []
          } : null,
          roleId: formData.role_id,
          supervisorSno: formData.supervisor_sno ? Number(formData.supervisor_sno) : null,
          qboxEntitySno: formData.qbox_entity_sno || "",
          authUserId: Number(formData.auth_user_id),
          profileId: formData.profile_id || null,
          deliveryPartnerSno: formData.deliveryPartnerSno ? Number(formData.deliveryPartnerSno) : null,
          details: formData.details.map(detail => ({
            qboxEntitySno: detail.qboxEntitySno,
            supervisorSno: detail.supervisorSno,
            shiftTime: detail.shiftTime
          }))
        };

        const result = await dispatch(updateProfile(updateParams));
        if (updateProfile.fulfilled.match(result)) {
          // toast.success("Profile updated successfully");
          navigate("/add-user/addUser");
        }
      } else {
        const params = {
          authUserId: formData.auth_user_id,
          authUserName: formData.auth_user_name,
          profileName: formData.profile_name,
          contact: formData.contact,
          aadharNumber: formData.aadhar_number,
          passwordHash: formData.passwordHash,
          roleId: formData.role_id,
          profileImage: profilePic ? {
            containerName: "Profile",
            mediaList: [{ mediaUrl: profilePic }],
            deleteMediaList: []
          } : null,
          qboxEntitySno: formData.qbox_entity_sno,
          deliveryPartnerSno: formData.deliveryPartnerSno,
          supervisorSno: formData.supervisor_sno,
          supervisorName: formData.supervisor_name,
          profileId: formData.profile_id || null,
          // shiftTime: formattedShiftTime,
          details: formData.details,
        }

        const response = await apiService.post<ApiResponse<any>>('create_user', params, PORT, PRIFIX_URL)
        if (response?.data?.status === "success") {
          toast.success("User created successfully")
          navigate("/add-user/addUser")
        } else {
          toast.error(response?.data?.message || "Failed to create user")
        }
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)

  // Get icon for role
  const getRoleIcon = (roleName: string) => {
    const roleIcons = {
      "Super Admin": Settings,
      "Aggregator Admin": Users,
      Supervisor: User,
      Loader: Wrench,
      Admin: Settings,
      "System Admin": Settings,
    };

    const IconComponent = roleIcons[roleName] || Settings;
    return <IconComponent size={24} />;
  };

  // Role-specific content components - Updated to disable fields in edit mode
  const AggregatorAdminContent = () => (
    <div className="mt-6 border border-color rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Aggregator Admin Details</h3>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Delivery Aggregator</label>
        <select
          name="partners"
          required
          value={formData.deliveryPartnerSno}
          onChange={handleDeliveryPartnerChange}
          // disabled={isEditMode}
          className={`w-full px-4 py-3 bg-background/100 backdrop-blur-sm border ${errors.deliveryPartnerSno ? "border-color" : "border-gray-500"} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
        >
          <option value="" disabled hidden>
            Select Delivery Aggregator
          </option>
          {deliveryPartnerList.map((role: any) => (
            <option key={role.deliveryPartnerSno} value={role.deliveryPartnerSno}>
              {role.partnerName}
            </option>
          ))}
        </select>
        {errors.deliveryPartnerSno && (
          <p className="pt-1 text-red-500 text-md">{errors.deliveryPartnerSno}</p>
        )}
      </div>
    </div>
  );

  const LoaderContent = () => {

    const [selectedEntities, setSelectedEntities] = useState<string[]>(
      formData.qbox_entity_sno ? formData.qbox_entity_sno.split(',') : []
    );
    const toggleDropdown = () => !isEditMode && setIsDropdownOpen(!isDropdownOpen);
    const [isFetchingSupervisors, setIsFetchingSupervisors] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Modify handleEditDetail function
    const handleEditDetail = async (detail: any, index: number) => {
      try {
        console.log("Editing detail:", detail);
        setIsEditing(true); // Set editing mode to true
        setEditingIndex(index);

        // Set selected entity
        setSelectedEntities([detail.qboxEntitySno]);

        // Fetch supervisors first
        await fetchSupervisors(Number(detail.qboxEntitySno));

        // Set current detail after supervisors are fetched
        setCurrentDetail({
          qboxEntitySno: detail.qboxEntitySno,
          supervisorSno: detail.supervisorSno || '',
          shiftTime: detail.shiftTime || ''
        });

      } catch (error) {
        console.error("Error in handleEditDetail:", error);
        toast.error("Error loading detail for editing");
      }
    };


    // Initialize loader details if in edit mode
    useEffect(() => {
      if (isEditMode && location.state?.user?.details) {
        setLoaderDetails(location.state.user.details.map((detail: any) => ({
          ...detail,
        })));
      }
    }, [isEditMode, location.state]);



    // Also update your fetchSupervisors function to handle the response better
    const fetchSupervisors = async (locationId: number) => {
      try {
        setIsFetchingSupervisors(true);

        const response = await apiService.post<ApiResponse<any>>(
          "get_supervisors_by_entities",
          { qboxEntitySno: locationId },
          MASTERPORT,
          MASTER_URL
        );

        console.log("Supervisors API Response:", response);

        if (response?.data?.supervisorData) {
          // Update supervisors state
          setSupervisors(response.data.supervisorData);

          // Log success
          console.log("Supervisors loaded:", response.data.supervisorData.length);
        } else {
          setSupervisors([]);
          console.log("No supervisors found for location:", locationId);
        }
      } catch (error) {
        console.error("Error fetching supervisors:", error);
        setSupervisors([]);
      } finally {
        setIsFetchingSupervisors(false);
      }
    };


    useEffect(() => {
      console.log("Updated supervisors:", supervisors);
    }, [supervisors]);


    const clearAllEntities = () => {
      if (isEditMode) return;
      setSelectedEntities([]);
      setSupervisors([]);
      setCurrentDetail(prev => ({
        ...prev,
        qboxEntitySno: "",
        supervisorSno: "",
        shiftTime: ""
      }));
    };

    const getSelectedEntityNames = () => {
      if (!selectedEntities.length) return "Select QBox Entities";
      return selectedEntities
        .map(id => {
          const entity = qboxEntityList.find((e: any) => e.qboxEntitySno.toString() === id);
          return entity ? entity.qboxEntityName : '';
        })
        .filter(Boolean)
        .join(', ');
    };

    const handleTimeChange = (timeRange: { fromTime: string; toTime: string }) => {
      console.log("Time range selected:", timeRange);
      const formattedTime = `${timeRange.fromTime} - ${timeRange.toTime}`;
      setCurrentDetail(prev => ({
        ...prev,
        shiftTime: formattedTime
      }));
    };

    const handleAddDetail = () => {
      if (!currentDetail.qboxEntitySno || !currentDetail.supervisorSno || !currentDetail.shiftTime) {
        toast.error("Please fill all required fields");
        return;
      }

      const newDetail = {
        qboxEntitySno: currentDetail.qboxEntitySno,
        supervisorSno: currentDetail.supervisorSno,
        shiftTime: currentDetail.shiftTime
      };

      setLoaderDetails(prev => {
        let updatedDetails;
        if (isEditing) {
          // Update existing detail
          updatedDetails = prev.map((detail, idx) =>
            idx === editingIndex ? newDetail : detail
          );
        } else {
          // Add new detail
          updatedDetails = [...prev, newDetail];
        }

        // Update formData
        setFormData(prevFormData => ({
          ...prevFormData,
          details: updatedDetails,
          qbox_entity_sno: updatedDetails.map(d => d.qboxEntitySno).join(',')
        }));

        return updatedDetails;
      });

      // Reset form state
      resetForm();
    };


    // Add reset form function
    const resetForm = () => {
      setCurrentDetail({
        qboxEntitySno: "",
        supervisorSno: "",
        shiftTime: ""
      });
      setSelectedEntities([]);
      setSupervisors([]);
      setEditingIndex(null);
      setIsEditing(false);
      setIsDropdownOpen(false);
    };

    // const removeDetail = (index: number) => {
    //   setLoaderDetails(prev => prev.filter((_, i) => i !== index));
    // };

    const removeDetail = (index: number) => {
      setLoaderDetails(prev => prev.filter((_, i) => i !== index));
      if (editingIndex === index) {
        setCurrentDetail({
          qboxEntitySno: "",
          supervisorSno: "",
          shiftTime: ""
        });
        setSelectedEntities([]);
        setSupervisors([]);
        setEditingIndex(null);
      }
    };

    return (
      <div className="mt-6 border border-color rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Loader Details</h3>

        {/* List of added details */}
        {loaderDetails.length > 0 && (
          <div className="mb-4 space-y-2">
            {loaderDetails.map((detail, index) => {
              const entity = qboxEntityList.find((e: any) =>
                e.qboxEntitySno.toString() === detail.qboxEntitySno
              );
              const supervisor = supervisors.find(s =>
                s.authUserId?.toString() === detail.supervisorSno
              );

              return (
                <div key={index} className="border rounded p-3 relative">
                  <button
                    onClick={() => removeDetail(index)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                  <button
                    onClick={() => handleEditDetail(detail, index)}
                    className="absolute top-1 right-8 text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m2-2l6-6m2-2l-6 6" />
                    </svg>
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium">{entity?.qboxEntityName || detail.qboxEntitySno}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Supervisor</p>
                      <p className="text-sm font-medium">{supervisor?.profileName || detail.supervisorSno}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Shift Time</p>
                      <p className="text-sm font-medium">
                        {detail.shiftTime}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              Delivery Locations <span className="text-color">*</span>
            </label>
            <select
              name="qbox_entity_sno"
              className={`w-full px-4 py-2 border rounded-md`}
              value={currentDetail.qboxEntitySno || ''} // Set default empty string if no value
              onChange={async (e) => {
                try {
                  const selectedValue = e.target.value;

                  // Update current detail first
                  setCurrentDetail(prev => ({
                    ...prev,
                    qboxEntitySno: selectedValue
                  }));

                  // Update form data
                  setFormData(prevData => ({
                    ...prevData,
                    qbox_entity_sno: selectedValue
                  }));

                  // Set selected entity to state
                  setSelectedEntities([selectedValue]);

                  // Fetch supervisors if a valid entity is selected
                  if (selectedValue) {
                    await fetchSupervisors(Number(selectedValue));
                  }
                } catch (error) {
                  console.error("Error in entity selection:", error);
                }
              }}
              required
            >
              <option value="">Select Delivery Location</option>
              {qboxEntityList.map((entity: any) => (
                <option
                  key={entity.qboxEntitySno}
                  value={entity.qboxEntitySno}
                >
                  {entity.qboxEntityName}
                </option>
              ))}
            </select>
          </div>

          <label className="block text-sm mb-1">
            Select Supervisor <span className="text-color">*</span>
          </label>
          <select
            name="supervisor_sno"
            className={`w-full px-4 py-2 border rounded-md`}
            value={currentDetail.supervisorSno}
            onChange={(e) => setCurrentDetail(prev => ({
              ...prev,
              supervisorSno: e.target.value
            }))}
            required
          >
            <option value="">
              {isFetchingSupervisors
                ? "Loading supervisors..."
                : "Select Supervisor"}
            </option>
            {supervisors && supervisors.length > 0 ? (
              supervisors.map((supervisor: any) => (
                <option
                  key={supervisor.authUserId}
                  value={supervisor.authUserId}
                >
                  {supervisor.profileName} ({supervisor.qboxEntityName})
                </option>
              ))
            ) : (
              <option value="" disabled>
                {formData.qbox_entity_sno
                  ? "No supervisors available for this location"
                  : "Please select a location first"}
              </option>
            )}
          </select>

          <TimePicker
            value={{
              fromTime: currentDetail.shiftTime.split(' - ')[0] || '',
              toTime: currentDetail.shiftTime.split(' - ')[1] || '',
            }}
            onChange={handleTimeChange}
          />
          <button
            type="button"
            onClick={handleAddDetail}
            className="w-full py-2 bg-color text-white rounded-md hover:bg-opacity-90"
          >
            {isEditing ? 'Update Detail' : 'Add Detail'}
          </button>
          {/* Add cancel button when editing */}
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-2 mt-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  };

  const SupervisorContent = () => {
    const [selectedEntities, setSelectedEntities] = useState<string[]>(
      formData.qbox_entity_sno ? formData.qbox_entity_sno.split(',') : []
    );

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Add click outside handler
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement)?.closest('#supervisor-dropdown')) {
          setIsDropdownOpen(false);
        }
      };
      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);


    // Update details in formData whenever selectedEntities changes
    useEffect(() => {
      const newDetails = selectedEntities.map(qboxEntitySno => ({ qboxEntitySno }));
      // Only update if details actually changed
      const detailsChanged =
        formData.details.length !== newDetails.length ||
        formData.details.some((d, i) => d.qboxEntitySno !== newDetails[i]?.qboxEntitySno);

      if (detailsChanged) {
        setFormData(prev => ({
          ...prev,
          details: newDetails
        }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEntities]);


    const clearAllEntities = () => {
      if (isEditMode) return;
      setSelectedEntities([]);
      setSupervisors([]);
      setFormData(prevData => ({
        ...prevData,
        qbox_entity_sno: '',
        details: []
      }));
    };

    const handleEntitySelect = (entitySno: string, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }

      setSelectedEntities(prev => {
        const isSelected = prev.includes(entitySno);
        const newSelection = isSelected
          ? prev.filter(item => item !== entitySno)
          : [...prev, entitySno];

        setFormData(prevData => ({
          ...prevData,
          qbox_entity_sno: newSelection.join(',')
        }));

        if (newSelection.length > 0 && errors.qbox_entity_sno) {
          setErrors(prevErrors => ({
            ...prevErrors,
            qbox_entity_sno: undefined
          }));
        }
        return newSelection;
      });
    };

    return (
      <div className="mt-6 border border-color rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Supervisor Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              Delivery Locations <span className="text-color">*</span>
            </label>
            <div className="relative" id="supervisor-dropdown">
              <div
                className={`w-full px-4 py-2 border ${errors.qbox_entity_sno ? 'border-color' : 'border-gray-300'} rounded-md flex items-center cursor-pointer`}
                onClick={toggleDropdown}
              >
                <div className="flex-1 min-h-[24px]">
                  {selectedEntities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedEntities.map(entityId => {
                        const entity = qboxEntityList.find(
                          (e: any) => e.qboxEntitySno.toString() === entityId
                        );
                        return entity ? (
                          <div
                            key={entityId}
                            className="bg-gray-100 px-2 py-1 rounded-md flex items-center text-sm"
                          >
                            <span>{entity.qboxEntityName}</span>
                            <button
                              type="button"
                              className="ml-2 text-gray-500 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEntitySelect(entityId);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-500">Select Delivery Locations</span>
                  )}
                </div>
                <span className={`ml-2 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                    <span className="text-sm font-medium">Available Locations</span>
                    {selectedEntities.length > 0 && (
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearAllEntities();
                        }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="py-1">
                    {qboxEntityList.map((entity: any) => (
                      <div
                        key={entity.qboxEntitySno}
                        className={`px-4 py-2 flex items-center hover:bg-gray-50 cursor-pointer ${selectedEntities.includes(entity.qboxEntitySno.toString()) ? 'bg-gray-50' : ''
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEntities.includes(entity.qboxEntitySno.toString())}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleEntitySelect(entity.qboxEntitySno.toString());
                          }}
                          className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <span
                          className="text-sm flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEntitySelect(entity.qboxEntitySno.toString());
                          }}
                        >
                          {entity.qboxEntityName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {errors.qbox_entity_sno && (
              <p className="text-xs text-color mt-1">{errors.qbox_entity_sno}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Inside AdminContent component
  const AdminContent = () => {
    // Add these states at the top of the component
    const [selectedState, setSelectedState] = useState(formData.details?.[0]?.stateSno || '');
    const [selectedCity, setSelectedCity] = useState(formData.details?.[0]?.citySno || '');
    const [selectedArea, setSelectedArea] = useState(formData.details?.[0]?.areaSno || '');

    // Filter cities based on selected state
    const filteredCities = useMemo(() => {
      return cityList.filter((city: any) => city.stateSno?.toString() === selectedState?.toString());
    }, [cityList, selectedState]);

    // Filter areas based on selected city
    const filteredAreas = useMemo(() => {
      return areaList.filter((area: any) => area.citySno?.toString() === selectedCity?.toString());
    }, [areaList, selectedCity]);

    // Handle state selection
    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const stateSno = e.target.value;
      setSelectedState(stateSno);
      setSelectedCity(''); // Reset city when state changes
      setSelectedArea(''); // Reset area when state changes

      // Update formData
      setFormData(prev => ({
        ...prev,
        details: [{
          ...(prev.details[0] || {}),
          stateSno: stateSno,
          citySno: '',
          areaSno: ''
        }]
      }));
    };

    // Handle city selection
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const citySno = e.target.value;
      setSelectedCity(citySno);
      setSelectedArea(''); // Reset area when city changes

      // Update formData
      setFormData(prev => ({
        ...prev,
        details: [{
          ...(prev.details[0] || {}),
          citySno: citySno,
          areaSno: ''
        }]
      }));
    };

    // Handle area selection
    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const areaSno = e.target.value;
      setSelectedArea(areaSno);

      // Update formData
      setFormData(prev => ({
        ...prev,
        details: [{
          ...(prev.details[0] || {}),
          areaSno: areaSno
        }]
      }));
    };

    // Log state changes for debugging
    useEffect(() => {
      console.log('Selected State:', selectedState);
      console.log('Filtered Cities:', filteredCities);
    }, [selectedState, filteredCities]);

    return (
      <div className="mt-6 border border-color rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Admin Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              Select State <span className="text-color">*</span>
            </label>
            <select
              name="stateSno"
              required
              value={selectedState}
              onChange={handleStateChange}
              className={`w-full px-4 py-3 bg-background/100 backdrop-blur-sm border ${errors.stateSno ? "border-color" : "border-gray-500"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
            >
              <option value="">Select State</option>
              {stateList?.map((state: any) => (
                <option key={state.stateSno} value={state.stateSno}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.stateSno && (
              <p className="pt-1 text-red-500 text-sm">{errors.stateSno}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Select City <span className="text-color">*</span>
            </label>
            <select
              name="citySno"
              required
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedState}
              className={`w-full px-4 py-3 bg-background/100 backdrop-blur-sm border ${errors.citySno ? "border-color" : "border-gray-500"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
            >
              <option value="">
                {selectedState ? "Select City" : "Please select a state first"}
              </option>
              {filteredCities?.map((city: any) => (
                <option key={city.citySno} value={city.citySno}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.citySno && (
              <p className="pt-1 text-red-500 text-sm">{errors.citySno}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Select Area <span className="text-color">*</span>
            </label>
            <select
              name="areaSno"
              required
              value={selectedArea}
              onChange={handleAreaChange}
              disabled={!selectedCity}
              className={`w-full px-4 py-3 bg-background/100 backdrop-blur-sm border ${errors.areaSno ? "border-color" : "border-gray-500"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
            >
              <option value="" disabled>
                {selectedCity ? "Select Area" : "Please select a city first"}
              </option>
              {filteredAreas.map((area: any) => (
                <option key={area.areaSno} value={area.areaSno}>
                  {area.name}
                </option>
              ))}
            </select>
            {errors.areaSno && (
              <p className="pt-1 text-red-500 text-sm">{errors.areaSno}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <div className="flex items-center mb-6">
          <button className="text-gray-500 flex items-center" onClick={goBack}>
            <ArrowLeft size={20} />
            <span className="ml-2">Back</span>
          </button>
          <h1 className="text-xl font-semibold mx-auto pr-16">{isEditMode ? "Edit User" : "New User Registration"}</h1>
        </div>

        <div className="flex flex-row gap-8">
          <div className="w-1/3">
            <div className="relative">
              <div className="flex items-start mb-8">
                <div className="mr-3 relative">
                  <div
                    className={`w-6 h-6 rounded-full ${currentStep > 1 ? "bg-green-500" : "bg-color"} flex items-center justify-center`}
                  >
                    {currentStep > 1 ? <Check size={14} className="text-white" /> : <Circle fill="white" size={10} />}
                  </div>
                  <div className="absolute top-6 left-3 h-10 border-l-2 border-dashed border-gray-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">STEP 1</p>
                  <p className={`text-sm font-medium ${currentStep > 1 ? "text-green-500" : "text-color"}`}>
                    Submit User Personal Details
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start">
                <div className="mr-3">
                  <div
                    className={`w-6 h-6 rounded-full ${currentStep === 2 ? "bg-color flex items-center justify-center" : "border-2 border-gray-300 flex items-center justify-center"}`}
                  >
                    {currentStep === 2 && <Circle fill="white" size={10} />}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">STEP 2</p>
                  <p className={`text-sm font-medium ${currentStep === 2 ? "text-color" : "text-gray-500"}`}>
                    Select Role Access for the Individual
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <img src={Illustration || "/placeholder.svg"} alt="illustration" className="mt-4" />
              </div>
            </div>
          </div>

          <div className="w-2/3">
            {currentStep === 1 ? (
              <div className="border border-color rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 flex items-center justify-center mr-3">
                    <img src={Logo || "/placeholder.svg"} alt="" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">User Details</h2>
                    <p className="text-sm text-gray-500">Enter user personal information</p>
                  </div>
                </div>

                <form className="mt-6 space-y-4">
                  <div className="relative group flex justify-center">
                    <div className="relative w-20 h-20 group bg-white shadow-xl p-1 rounded-full">
                      <div className="w-full h-full rounded-full overflow-hidden border border-color bg-white flex items-center justify-center">
                        {imageSrc ? (
                          <img
                            src={imageSrc || "/placeholder.svg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img src="src/assets/images/profile.png" alt="Default Profile" />
                        )}
                      </div>

                      <label htmlFor="file-upload" className="absolute bottom-1 right-1 z-20 cursor-pointer">
                        <div className="w-8 h-8 bg-color rounded-full shadow-lg flex items-center justify-center transition-colors duration-200">
                          <Camera size={24} className="text-white" />
                        </div>
                      </label>

                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {uploadStatus && <p className="text-xs text-center mt-2">{uploadStatus}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Enter Full name <span className="text-color">*</span>
                    </label>
                    <input
                      type="text"
                      name="profile_name"
                      className={`w-full px-4 py-2 border ${errors.profile_name ? "border-color" : "border-gray-300"} rounded-md`}
                      value={formData.profile_name}
                      onChange={handleChange}
                      required
                    />
                    {errors.profile_name && <p className="text-xs text-color mt-1">{errors.profile_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Email address <span className="text-color">*</span>
                    </label>
                    <input
                      type="email"
                      name="auth_user_name"
                      className={`w-full px-4 py-2 border ${errors.auth_user_name ? "border-color" : "border-gray-300"} rounded-md`}
                      value={formData.auth_user_name}
                      onChange={handleChange}
                      required
                      disabled={isEditMode}
                    />
                    {errors.auth_user_name ? (
                      <p className="text-xs text-color mt-1">{errors.auth_user_name}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">User will receive a verification mail on this ID</p>
                    )}
                  </div>
                  {!isEditMode && <div className="flex-1 space-y-2">
                    <label className="block text-sm mb-1">
                      Password <span className="text-color">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="passwordHash"
                        required
                        value={formData.passwordHash}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-background/50 backdrop-blur-sm border ${errors.passwordHash ? "border-color" : "border-gray-500"} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
                        placeholder="Enter password"
                        disabled={isEditMode}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.passwordHash && <p className="text-xs text-color mt-1">{errors.passwordHash}</p>}
                  </div>}

                  <div>
                    <label className="block text-sm mb-1">
                      Mobile number <span className="text-color">*</span>
                    </label>
                    <input
                      type="text"
                      name="contact"
                      className={`w-full px-4 py-2 border ${errors.contact ? "border-color" : "border-gray-300"} rounded-md`}
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      maxLength={10}
                    />
                    {errors.contact && <p className="text-xs text-color mt-1">{errors.contact}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Aadhar Number <span className="text-color">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="aadhar_number"
                        required
                        value={formData.aadhar_number}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-background/50 backdrop-blur-sm border ${errors.aadhar_number ? "border-color" : "border-gray-500"} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-gray-800 hover-border-2`}
                        placeholder="Enter Aadhar number"
                        maxLength={12}
                      />
                      <IdCard className="absolute top-1/2 -translate-y-1/2 right-4 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.aadhar_number && <p className="text-xs text-color mt-1">{errors.aadhar_number}</p>}
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="border border-color rounded-lg p-6">
                  <div className="flex items-start mb-6">
                    <div className="w-8 h-8 flex items-center justify-center mr-3">
                      <img src={Logo || "/placeholder.svg"} alt="" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium">User Role</h2>
                      <p className="text-sm text-gray-500">Select a user role</p>
                    </div>
                  </div>
                  {roleList && roleList.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {roleList.map((role) => (
                        <div
                          key={role.roleId}
                          className={`p-6 rounded-md cursor-pointer transition-all flex flex-col items-center justify-center ${formData.role_id === String(role.roleId)
                            ? "low-bg-color border-2 border-color"
                            : "border border-gray-200"
                            } ${isEditMode ? "cursor-not-allowed" : ""}`}
                          onClick={() => !isEditMode && handleRoleSelect(String(role.roleId))}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.role_id === String(role.roleId) ? "low-bg-color" : "bg-gray-100"
                              }`}
                          >
                            <span
                              className={`${formData.role_id === String(role.roleId) ? "text-color" : "text-gray-300"}`}
                            >
                              {getRoleIcon(role.roleName)}
                            </span>
                          </div>
                          <p
                            className={`mt-2 text-center ${formData.role_id === String(role.roleId) ? "text-color font-medium" : "text-gray-400"
                              }`}
                          >
                            {role.roleName}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Loading roles or no roles available...</p>
                    </div>
                  )}
                </div>

                {/* Role-specific content */}
                {formData.role_id && (
                  <div className="mt-6">
                    {getSelectedRoleName() === 'Aggregator Admin' && <AggregatorAdminContent />}
                    {getSelectedRoleName() === 'Loader' && <LoaderContent />}
                    {getSelectedRoleName() === 'Supervisor' && <SupervisorContent />}
                    {getSelectedRoleName() === 'Admin' && <AdminContent />}
                  </div>
                )}
              </>
            )}

            {currentStep === 1 ? (
              <button
                className={`w-full py-4 rounded-md mt-6 font-medium ${isFormValid ? "bg-color text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                onClick={handleContinue}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Processing..." : "Continue"}
              </button>
            ) : (
              <button
                className={`w-full py-4 rounded-md mt-6 font-medium ${formData.role_id
                  ? "bg-color text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : isEditMode ? "Update User" : "Add New User"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
