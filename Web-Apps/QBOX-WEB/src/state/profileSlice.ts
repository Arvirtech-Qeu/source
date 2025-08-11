import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { toast } from "react-toastify";

const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;
const AUTH_PORT = import.meta.env.VITE_API_QBOX_AUTHN_PORT;
const AUTH_PRIFIX_URL = import.meta.env.VITE_API_AUTHN_PREFIX_URL;

export interface ApiState {
    profileDetails: any;
    loading: boolean;
    error: string | null;
    profileList: any;
    createProfileResult: any;
    checking: boolean;
}

const initialState: ApiState = {
    profileDetails: null,
    loading: false,
    error: null,
    profileList: [],
    createProfileResult: null,
    checking: false,
};

export interface ProfileUpdateParams {
    profileName: string;
    contact: string;
    aadharNumber: string;
    roleId: string;
    qboxEntitySno: string;
    profileImage: {
        containerName: string;
        mediaList: Array<{ mediaUrl: string }>;
        deleteMediaList: string[];
    } | null;
    supervisorSno: number | null;
    authUserId: number;
    profileId: number | null;
    deliveryPartnerSno: number | null;
    details: {
        qboxEntitySno: string,
        supervisorSno: string,
        shiftTime: string
    }
}


interface ApiResponse<T> {
    data: T;
    isSuccess: boolean;
    message?: string;
    status: number;
}
// Thunk for fetching all users
export const getAllUsers = createAsyncThunk(
    'profile/getAllUsers',
    async (params: any, thunkAPI) => {
        try {
            // Note the correct parameter order: endpoint, port, prefixUrl, config
            const response = await apiService.get<ApiResponse<any>>(
                'get_auth_user',  // endpoint
                AUTH_PORT,        // port
                AUTH_PRIFIX_URL,  // prefix URL
                params           // config object
            );

            console.log('API Response:', response);
            return response;
        } catch (error: any) {
            console.error('API Error:', error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for updating a profile
export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (params: ProfileUpdateParams, thunkAPI) => {
        try {
            const response = await apiService.put<ApiResponse<any>>(
                'update_profile',
                params,
                PORT,
                PRIFIX_URL
            );
            console.log(response)
            if (response?.data?.status !== 'error') {
                toast.success("Profile updated successfully");
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response?.message || "Update failed");
            }
        } catch (error: any) {
            // Handle network or other errors
            const errorMessage = error.response?.data?.message || error.message || "Update failed";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// Thunk for creating a user
export const createUser = createAsyncThunk(
    'profile/createUser',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_user', params, PORT, PRIFIX_URL);
            if (response?.data?.status === "success") {
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response.data.message || "Failed to create user");
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Create slice
const profileSlice = createSlice({
    name: "api/profileSlice",
    initialState,
    reducers: {
        resetState: (state) => {
            state.profileDetails = null;
            state.loading = false;
            state.error = null;
            state.profileList = [];
            state.createProfileResult = null;
            state.checking = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // Make sure this matches your API response structure
                state.profileList = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch users';
                state.profileList = []; // Clear the list on error
            })

            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // Safely update the profileList
                if (state.profileList?.data?.users) {
                    state.profileList.data.users = state.profileList.data.users.map(user =>
                        user.auth_user_id === action.payload.auth_user_id
                            ? { ...user, ...action.payload }
                            : user
                    );
                }
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Update failed';
            })

            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.profileDetails = action.payload;
                state.profileList = [...state.profileList, action.payload];
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetState } = profileSlice.actions;
export default profileSlice.reducer;