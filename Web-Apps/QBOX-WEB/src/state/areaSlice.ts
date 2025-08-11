import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    areaList: any;
    userList: any;
    createAreaResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    areaList: [],
    userList: [],
    createAreaResult: null,
    checking: false,
};


// Thunk for search_area POST API call
export const getAllArea = createAsyncThunk(
    'area/getAllArea',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_area', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_area POST API call
export const createArea: any = createAsyncThunk(
    'area/createArea',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_area', params, PORT, PRIFIX_URL);
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

// Thunk for edit_area PUT API call
export const editArea: any = createAsyncThunk(
    'area/editArea',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_area', params, PORT, PRIFIX_URL);
            console.log(response)
            if (response?.isSuccess) {
                toast.success("Updated Successfully");
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

// Thunk for delete_area POST API call
export const deleteArea: any = createAsyncThunk(
    'area/deleteArea',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_area', params, PORT, PRIFIX_URL);
            console.log(response)
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

// Thunk for delete_user_by_id POST API call
export const deleteAuthUser: any = createAsyncThunk(
    'area/deleteAuthUser',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_user_by_id', params, PORT, PRIFIX_URL);
            console.log(response)
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
const areaSlice = createSlice({
    name: "api/areaSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllArea (GET request)
            .addCase(getAllArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllArea.fulfilled, (state: any, action) => {
                state.loading = false;
                state.areaList = action.payload;
            })
            .addCase(getAllArea.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createArea (POST request)
            .addCase(createArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createArea.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createAreaResult = action.payload;
            })
            .addCase(createArea.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editArea (PUT request)
            .addCase(editArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editArea.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.areaList = state.areaList.map((table: any) =>
                    table.areaSno === updatedTable.areaSno ? updatedTable : table
                );
            })
            .addCase(editArea.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteArea (DELETE request)
            .addCase(deleteArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArea.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedArea = action.payload;
                state.areaList = state.areaList.filter(
                    (area: any) => area.areaSno !== deletedArea.areaSno
                );
            })
            .addCase(deleteArea.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteAuthUser (DELETE request)
            .addCase(deleteAuthUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(deleteAuthUser.fulfilled, (state: any, action) => {
            //     state.loading = false;
            //     const deletedAreaUser = action.payload;
            //     state.userList = state.userList.filter(
            //         (user: any) => user.authUserId !== deletedAreaUser.authUserId
            //     );
            // })
            .addCase(deleteAuthUser.fulfilled, (state: ApiState, action) => {
                state.loading = false;
                if (action.payload?.success) {
                    const deletedUser = action.payload.data;
                    if (Array.isArray(state.userList)) {
                        state.userList = state.userList.filter(
                            (user: any) => user.authUserId !== deletedUser.authUserId
                        );
                    }
                    toast.success("User deleted successfully");
                }
            })
            .addCase(deleteAuthUser.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

// Export actions and reducer
export default areaSlice.reducer;

