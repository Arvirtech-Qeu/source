import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    attendanceList: any;
    todayAttendanceList: any;
    allAttendanceList: any;
    createAttendanceRecordResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    attendanceList: [],
    todayAttendanceList: [],
    allAttendanceList: [],
    createAttendanceRecordResult: null,
    checking: false,
};



// Thunk for search_area POST API call
export const getAllAddress = createAsyncThunk(
    'attendance/getAllAddress',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_address', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for get_today_attendance POST API call
export const getTodayAttendance = createAsyncThunk(
    'attendance/getTodayAttendance',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_today_attendance', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for get_attendance_summary POST API call
export const getAttendanceSummary = createAsyncThunk(
    'attendance/getAttendanceSummary',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_attendance_summary', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_attendance_record POST API call
export const createAttendanceRecord: any = createAsyncThunk(
    'attendance/createAttendanceRecord',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_attendance_record', params, PORT, PRIFIX_URL);
            console.log(response)
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

// Thunk for update_attendance_record PUT API call
export const updateAttendanceRecord: any = createAsyncThunk(
    'attendance/updateAttendanceRecord',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('update_attendance_record', params, PORT, PRIFIX_URL);
            console.log(response)
            if (response?.isSuccess) {
                toast.success("Updated Successfully");
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

// Thunk for delete_area POST API call
export const deleteAddress: any = createAsyncThunk(
    'attendance/deleteAddress',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_address', params, PORT, PRIFIX_URL);
            console.log(response)
            if (response?.isSuccess) {
                toast.success("Successfully deleted");
                return response;
            } else {
                const errorMessage = "Something went wrong";
                // toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// Create slice
const attendanceSlice = createSlice({
    name: "api/attendanceSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllArea (GET request)
            .addCase(getAllAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAddress.fulfilled, (state: any, action) => {
                state.loading = false;
                state.attendanceList = action.payload;
            })
            .addCase(getAllAddress.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getTodayAttendance (GET request)
            .addCase(getTodayAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTodayAttendance.fulfilled, (state: any, action) => {
                state.loading = false;
                state.todayAttendanceList = action.payload;
            })
            .addCase(getTodayAttendance.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getAttendanceSummary (GET request)
            .addCase(getAttendanceSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAttendanceSummary.fulfilled, (state: any, action) => {
                state.loading = false;
                state.allAttendanceList = action.payload;
            })
            .addCase(getAttendanceSummary.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createArea (POST request)
            .addCase(createAttendanceRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAttendanceRecord.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createAttendanceRecordResult = action.payload;
            })
            .addCase(createAttendanceRecord.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle updateAttendanceRecord (PUT request)
            .addCase(updateAttendanceRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAttendanceRecord.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.attendanceList = state.attendanceList.map((table: any) =>
                    table.auth_user_id === updatedTable.auth_user_id ? updatedTable : table
                );
            })
            .addCase(updateAttendanceRecord.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteArea (DELETE request)
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedAddress = action.payload;
                state.attendanceList = state.attendanceList.filter(
                    (address: any) => address.auth_user_id !== deletedAddress.auth_user_id
                );
            })
            .addCase(deleteAddress.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default attendanceSlice.reducer;
