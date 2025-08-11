"use client"

import React, { type ReactNode, useEffect, useState } from "react"
import { Pencil, Trash2, AlertCircle, User2, User, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@state/store"
import { deleteCodesHdr, getAllCodesHdr } from "@state/codeHdrSlice"
import { Modal } from "@components/Modal"
import { useNavigate } from "react-router-dom"
import { getAllUsers } from "@state/profileSlice"
import NoDataFound from "@components/no-data-found"
import OrderSummary, { type FilterOption } from "@view/Loader/Common widgets/order_summary_table"
import RecentActivitiesGrid from "@view/Loader/Common widgets/activitity_grid"
import { Column, Table } from "@components/Table"
import CommonHeader from "@components/common-header"
import CommonHeaderPage from "./common_header_page"
import { EmptyState } from "@view/Loader/Common widgets/empty_state"
import { toast } from "react-toastify"
import { apiService } from "@services/apiService"
import { deleteAuthUser } from "@state/areaSlice"

export interface AdditionalDetail {
    created_on: string;
    shift_time: string | null;
    supervisor_sno: number | null;
    qbox_entity_sno: number;
    delivery_partner_sno: number;
}

interface AddUserDetailsData {
    sno: ReactNode // To store the auto-generated serial number
    contact: string
    role_id: number
    is_active: boolean
    role_name: string
    media_link: string
    auth_user_id: number
    profile_name: string
    auth_user_name: string
    aadhar_number: string
    supervisor_name: string
    qbox_entity_sno: string
    created_on: string
    supervisor_sno: number | null
    profile_id: number | null
    delivery_partner_sno: number,
    additional_details: AdditionalDetail[];
}

interface AddUserDetailsFormData {
    statusColor: any
    id: number | null
    contact: string
    role_id: number | null
    is_active: boolean
    role_name: string
    media_link: string
    auth_user_id: number | null
    profile_name: string
    auth_user_name: string
    aadhar_number: string
    supervisor_name: string
    qbox_entity_sno: any
    created_on: string
    supervisor_sno: number | null
    profile_id: number | null
    delivery_partner_sno: number | null
    additional_details: AdditionalDetail[];
}

interface CodesHdrProps {
    isHovered: any
}

const AddUserDetails: React.FC<CodesHdrProps> = ({ isHovered }) => {
    const { profileList } = useSelector((state: RootState) => state.profileSlice)
    const dispatch = useDispatch<AppDispatch>()
    const [isEditing, setIsEditing] = React.useState(false)
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [userList, setUserList] = useState<AddUserDetailsData[]>([])
    const [selectedUserDetails, setSelectedUserDetails] = React.useState<AddUserDetailsData | null>(null)
    const [searchUser, setSearchUser] = useState("")
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("all")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = useState<string>("")

    const PORT = import.meta.env.VITE_API_QBOX_AUTHN_PORT
    const PRIFIX_URL = import.meta.env.VITE_API_AUTHN_PREFIX_URL

    console.log("Profile List:", userList)
    // Sort users by auth_user_id
    const sortedUsers = profileList?.users ? [...profileList.users] : []
    sortedUsers.sort((a, b) => Number(a.auth_user_id) - Number(b.auth_user_id))

    useEffect(() => {
        if (profileList?.users) {
            setUserList([...profileList.users].sort((a, b) => Number(a.auth_user_id) - Number(b.auth_user_id)))
        }
    }, [profileList])

    useEffect(() => {
        fetchUsers()
    }, [dispatch])

    useEffect(() => {
        // Check for the correct data structure
        if (profileList?.data?.users) {
            setUserList(profileList.data.users)
        }
    }, [profileList])

    const {
        reset,
        formState: { errors, touchedFields },
    } = useForm<AddUserDetailsFormData>({
        defaultValues: {
            id: null,
            contact: "",
            role_id: null,
            is_active: true,
            role_name: "",
            media_link: "",
            auth_user_id: null,
            profile_name: "",
            auth_user_name: "",
            aadhar_number: "",
            supervisor_name: "",
            qbox_entity_sno: "",
            created_on: "",
            supervisor_sno: null,
            delivery_partner_sno: null,
        },
        mode: "all",
        reValidateMode: "onChange",
    })

    const fetchUsers = async () => {
        try {
            console.log("Fetching users...")
            const params = {} // Add any required query parameters here
            const response = await dispatch(getAllUsers(params)).unwrap()
            console.log("Fetched users:", response)
        } catch (error) {
            console.error("Error fetching users:", error)
        }
    }

    const handleEditUser = (user: AddUserDetailsData) => {
        console.log(user)
        navigate("/add-user/addUserPage", {
            state: {
                user: {
                    ...user,
                },
            },
        })
    }

    const handleOpenModal = (editing = false, addUser: AddUserDetailsData | null = null) => {
        if (editing && addUser) {
            reset({
                auth_user_id: addUser.auth_user_id,
                contact: addUser.contact,
                role_id: addUser.role_id,
                is_active: addUser.is_active,
                role_name: addUser.role_name,
                media_link: addUser.media_link,
                profile_name: addUser.profile_name,
                auth_user_name: addUser.auth_user_name,
                aadhar_number: addUser.aadhar_number,
                supervisor_name: addUser.supervisor_name,
                supervisor_sno: addUser.supervisor_sno,
                qbox_entity_sno: addUser.qbox_entity_sno,
                created_on: addUser.created_on,
                profile_id: addUser.profile_id,
                delivery_partner_sno: addUser.delivery_partner_sno,
                additional_details: addUser.additional_details,
            })
            setSelectedUserDetails(addUser)
        } else {
            reset({
                auth_user_id: null,
                contact: "",
                role_id: null,
                is_active: true,
                role_name: "",
                media_link: "",
                profile_name: "",
                auth_user_name: "",
                aadhar_number: "",
                supervisor_name: "",
                qbox_entity_sno: "",
                created_on: "",
                supervisor_sno: null,
                profile_id: null,
                delivery_partner_sno: null,
            })
            setSelectedUserDetails(null)
        }

        setIsEditing(editing)
        setIsModalOpen(true)
        navigate("/add-user/addUserPage")
    }

    const handleDeleteModalOpen = (userDate: AddUserDetailsData) => {
        setSelectedUserDetails(userDate)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteModalClose = () => {
        setSelectedUserDetails(null)
        setIsDeleteModalOpen(false)
    }


    const handleDelete = async (userDate: AddUserDetailsData) => {
        await dispatch(deleteAuthUser({ authUserId: userDate.auth_user_id }));
        dispatch(getAllUsers({}));
        handleDeleteModalClose();

    }

    // Filter users based on search term
    const filteredUsers = profileList?.data?.users?.filter(
        (codesHdr) =>
            (codesHdr.profile_name || "").toLowerCase().includes(searchUser.toLowerCase()) ||
            (codesHdr.contact || "").toLowerCase().includes(searchUser.toLowerCase()) ||
            (codesHdr.role_name || "").toLowerCase().includes(searchUser.toLowerCase()),
    )

    // Filter users based on active tab
    const getFilteredUsersByTab = () => {
        if (!filteredUsers) return []

        if (activeTab === "all") return filteredUsers

        return filteredUsers.filter((user) => {
            const roleName = (user.role_name || "").toLowerCase()
            switch (activeTab) {
                case "super-admin":
                    return roleName.includes("super admin")
                case "aggregator":
                    return roleName.includes("aggregator")
                case "supervisor":
                    return roleName.includes("supervisor")
                case "loader":
                    return roleName.includes("loader")
                default:
                    return true
            }
        })
    }

    const tabs = [
        { id: "all", label: "All Users" },
        { id: "super-admin", label: "Super Admin" },
        { id: "aggregator", label: "Aggregator" },
        { id: "supervisor", label: "Remote Supervisor" },
        { id: "loader", label: "Loader" },
    ]

    const filterOptions: FilterOption[] = [
        {
            id: "region",
            label: "South Region",
            type: "select",
            options: ["South Region", "North Region", "East Region", "West Region"],
        },
        {
            id: "dateRange",
            label: "Date Range",
            type: "daterange",
        },
        {
            id: "status",
            label: "Status",
            type: "status",
            options: ["All", "Active", "Inactive"],
        },
    ]

    // Recent activities data
    const activities = [
        {
            id: "1",
            type: "user activity",
            title: "Rajkumar V (Loader)",
            description: "",
            timestamp: "Completed Delivery",
            meta: {
                by: "Hotbox #102",
            },
            imageUrl: "https://i.pinimg.com/236x/db/1f/9a/db1f9a3eaca4758faae5f83947fa807c.jpg",
        },
        {
            id: "2",
            type: "user activity",
            title: "Raj V (Admin)",
            description: "",
            timestamp: "Completed Delivery",
            meta: {
                by: "Hotbox #102",
            },
            imageUrl: "https://i.pinimg.com/236x/db/1f/9a/db1f9a3eaca4758faae5f83947fa807c.jpg",
        },
    ];

    const columns: Column<AddUserDetailsData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'profile_name',
            header: 'Name',
            sortable: true,
        },
        {
            key: 'contact',
            header: 'Contact Number',
            sortable: true,

        },
        {
            key: 'auth_user_name',
            header: 'Email',
            sortable: true,

        },
        {
            key: 'role_name',
            header: 'Role Name',
            sortable: true,

        },
        {
            key: 'aadhar_number',
            header: 'Adhar Number',
            sortable: true,

        },
        {
            key: 'supervisor_name',
            header: 'SuperVisor',
            sortable: true,

        },
        // {
        //     key: 'role_id',
        //     header: 'Role id',
        //     sortable: true,

        // },
        {
            key: 'actions',
            header: 'Actions',
            render: (value: AddUserDetailsData) => (
                <div className="flex space-x-8">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditUser(value);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <Pencil className="w-4 h-4 text-gray-600" />
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

    const [regionFilter, setRegionFilter] = useState('');
    const [dateRangeFilter, setDateRangeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleApplyFilters = () => {
        console.log('Filters applied:', {
            region: regionFilter,
            dateRange: dateRangeFilter,
            status: statusFilter
        });
    };

    return (
        <div className={`${isHovered ? "pl-32 pr-14 py-12" : "pl-16 pr-14 py-12"}`}>
            <div className="flex justify-between mb-6">
                <h1 className="font-bold text-lg">User Management</h1>
                <button className="bg-color rounded-lg px-4 py-2 text-white" onClick={() => handleOpenModal(false)}>
                    Add New User
                </button>
            </div>

            <CommonHeaderPage
                searchQuery={searchUser}
                setSearchQuery={setSearchUser}
                placeholder="Search by users, contact, role_name..."
                region={regionFilter}
            />
            <div className="overflow-x-auto mt-8">
                {filteredUsers?.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredUsers?.map((user, index) => ({
                            sno: index + 1,
                            auth_user_id: user.auth_user_id,
                            profile_name: user.profile_name || '--',
                            contact: user.contact || '--',
                            auth_user_name: user.auth_user_name || '--',
                            role_name: user.role_name || '--',
                            aadhar_number: user.aadhar_number || '--',
                            role_id: user.role_id,
                            qbox_entity_sno: user.additional_details?.map(detail => detail.qbox_entity_sno).join(',') || '--',
                            supervisor_sno: user.supervisor_sno || null,
                            supervisor_name: user.supervisor_name || '--',
                            media_link: user.media_link || '--',
                            profile_id: user.profile_id || null,
                            delivery_partner_sno: user.additional_details?.[0]?.delivery_partner_sno || '--',
                            created_on: user.additional_details?.[0]?.created_on || '--',
                            additional_details: user.additional_details || [],
                        }))}
                        rowsPerPage={10}
                        initialSortKey="sno"
                        onRowClick={(codeHdr) => console.log('Order clicked:', codeHdr)}
                        globalSearch={false}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteModalClose}
                title="Delete User"
                type="info"
                size="xl"
                footer={
                    <div className="flex justify-end space-x-2">
                        <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={handleDeleteModalClose}>
                            No
                        </button>
                        <button
                            className="px-4 py-2 bg-color text-white rounded-md"
                            onClick={() => handleDelete(selectedUserDetails!)}
                        >
                            Yes
                        </button>
                    </div>
                }
            >
                <p>Are you sure you want to delete this user?</p>
            </Modal>
        </div>
    )
}

export default AddUserDetails
