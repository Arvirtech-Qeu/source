import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    addressList: any;
    createAddressResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    addressList: [],
    createAddressResult: null,
    checking: false,
};


// Thunk for search_area POST API call
export const getAllAddress = createAsyncThunk(
    'address/getAllAddress',
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

// Thunk for create_area POST API call
export const createAddress: any = createAsyncThunk(
    'address/createAddress',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_address', params, PORT, PRIFIX_URL);
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
export const editAddress: any = createAsyncThunk(
    'address/editAddress',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_address', params, PORT, PRIFIX_URL);
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
    'address/deleteAddress',
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
const addressSlice = createSlice({
    name: "api/addressSlice",
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
                state.addressList = action.payload;
            })
            .addCase(getAllAddress.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createArea (POST request)
            .addCase(createAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAddress.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createAddressResult = action.payload;
            })
            .addCase(createAddress.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editArea (PUT request)
            .addCase(editAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editAddress.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.addressList = state.addressList.map((table: any) =>
                    table.address_sno === updatedTable.address_sno ? updatedTable : table
                );
            })
            .addCase(editAddress.rejected, (state, action: PayloadAction<string>) => {
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
                state.addressList = state.addressList.filter(
                    (address: any) => address.address_sno !== deletedAddress.address_sno
                );
            })
            .addCase(deleteAddress.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default addressSlice.reducer;
