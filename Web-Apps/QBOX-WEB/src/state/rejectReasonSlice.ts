import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";

const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PREFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface RejectReasonState {
    loading: boolean;
    error: string | null;
    rejectReasonList: any[];
    createRejectReasonResult: any;
    checking: boolean;
}

const initialState: RejectReasonState = {
    loading: false,
    error: null,
    rejectReasonList: [],
    createRejectReasonResult: null,
    checking: false,
};

// Thunk for get_reject_reason POST API call
export const getAllRejectReason = createAsyncThunk(
    'rejectReason/getAllRejectReason',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_reject_reason', params, PORT, PREFIX_URL);
            console.log(response);
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_reject_reason POST API call
export const createRejectReason: any = createAsyncThunk(
    'rejectReason/createRejectReason',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_reject_reason', params, PORT, PREFIX_URL);
            console.log(response);
            if (response?.isSuccess) {
                toast.success("Saved Successfully");
                return response;
            } else {
                const errorMessage = "Something went wrong";
                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for update_reject_reason PUT API call
export const editRejectReason: any = createAsyncThunk(
    'rejectReason/editRejectReason',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.put<ApiResponse<any>>('update_reject_reason', params, PORT, PREFIX_URL);
            console.log(response);
            if (response?.isSuccess) {
                toast.success("Updated Successfully");
                return response;
            } else {
                const errorMessage = "Something went wrong";
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for delete_reject_reason POST API call
export const deleteRejectReason: any = createAsyncThunk(
    'rejectReason/deleteRejectReason',
    async (params: any, thunkAPI) => {
        console.log(params);
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_reject_reason', params, PORT, PREFIX_URL);
            console.log(response);
            if (response?.isSuccess) {
                toast.success("Successfully deleted");
                return response;
            } else {
                const errorMessage = "Something went wrong";
                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Create slice
const rejectReasonSlice = createSlice({
    name: "api/rejectReasonSlice",
    initialState,
    reducers: {
        // Add any synchronous reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            // Handle getAllRejectReason (GET request)
            .addCase(getAllRejectReason.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllRejectReason.fulfilled, (state: any, action) => {
                state.loading = false;
                state.rejectReasonList = action.payload;
            })
            .addCase(getAllRejectReason.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle createRejectReason (POST request)
            .addCase(createRejectReason.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRejectReason.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createRejectReasonResult = action.payload;
            })
            .addCase(createRejectReason.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle editRejectReason (PUT request)
            .addCase(editRejectReason.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editRejectReason.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedRejectReason = action.payload;
                state.rejectReasonList = state.rejectReasonList.map((reason: any) =>
                    reason.rejectReasonSno === updatedRejectReason.rejectReasonSno 
                        ? updatedRejectReason 
                        : reason
                );
            })
            .addCase(editRejectReason.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Handle deleteRejectReason (DELETE request)
            .addCase(deleteRejectReason.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRejectReason.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedRejectReason = action.payload;
                state.rejectReasonList = state.rejectReasonList.filter(
                    (reason: any) => reason.rejectReasonSno !== deletedRejectReason.rejectReasonSno
                );
            })
            .addCase(deleteRejectReason.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default rejectReasonSlice.reducer;