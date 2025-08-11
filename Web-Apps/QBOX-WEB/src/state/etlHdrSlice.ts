import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    etlHdrList: any;
    createEtlhdrResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    etlHdrList: [],
    createEtlhdrResult: null,
    checking: false,
};


// Thunk for search_area POST API call
export const getAllEtlHdr = createAsyncThunk(
    'etlhdr/getAllEtlHdr',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_order_etl_hdr', params, PORT, PRIFIX_URL);
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
export const createEtlhdr: any = createAsyncThunk(
    'etlhdr/createEtlhdr',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_order_etl_hdr', params, PORT, PRIFIX_URL);
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
export const editEtlhdr: any = createAsyncThunk(
    'etlhdr/editEtlhdr',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_order_etl_hdr', params, PORT, PRIFIX_URL);
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
export const deleteEtlhdr: any = createAsyncThunk(
    'etlhdr/deleteEtlhdr',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_order_etl_hdr', params, PORT, PRIFIX_URL);
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
const etlHdrSlice = createSlice({
    name: "api/etlHdrSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllArea (GET request)
            .addCase(getAllEtlHdr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEtlHdr.fulfilled, (state: any, action) => {
                state.loading = false;
                state.etlHdrList = action.payload;
            })
            .addCase(getAllEtlHdr.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createArea (POST request)
            .addCase(createEtlhdr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEtlhdr.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createEtlhdrResult = action.payload;
            })
            .addCase(createEtlhdr.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editArea (PUT request)
            .addCase(editEtlhdr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editEtlhdr.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.etlHdrList = state.etlHdrList.map((table: any) =>
                    table.etlhdrSno === updatedTable.etlhdrSno ? updatedTable : table
                );
            })
            .addCase(editEtlhdr.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteArea (DELETE request)
            .addCase(deleteEtlhdr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEtlhdr.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteEtlhdr = action.payload;
                state.etlHdrList = state.etlHdrList.filter(
                    (etlhdr: any) => etlhdr.etlhdrSno !== deleteEtlhdr.etlhdrSno
                );
            })
            .addCase(deleteEtlhdr.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default etlHdrSlice.reducer;

