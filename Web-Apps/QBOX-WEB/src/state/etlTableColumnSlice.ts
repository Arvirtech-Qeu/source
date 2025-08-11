import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    etltablecolumnList: any;
    createEtlResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    etltablecolumnList: [],
    createEtlResult: null,
    checking: false,
};


// Thunk for search_area POST API call
export const getAllEtltablecolumn = createAsyncThunk(
    'etltable/getAllEtltablecolumn',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_etl_table_column', params, PORT, PRIFIX_URL);
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
export const createEtltablecolumn: any = createAsyncThunk(
    'etltable/createEtltablecolumn',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_etl_table_column', params, PORT, PRIFIX_URL);
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
export const editEtltablecolumn: any = createAsyncThunk(
    'etltable/editEtltablecolumn',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_etl_table_column', params, PORT, PRIFIX_URL);
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
export const deleteEtltablecolumn: any = createAsyncThunk(
    'etltable/deleteEtltablecolumn',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_etl_table_column', params, PORT, PRIFIX_URL);
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
const etlTableColumnSlice = createSlice({
    name: "api/etltableSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllArea (GET request)
            .addCase(getAllEtltablecolumn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEtltablecolumn.fulfilled, (state: any, action) => {
                state.loading = false;
                state.etltablecolumnList = action.payload;
            })
            .addCase(getAllEtltablecolumn.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createArea (POST request)
            .addCase(createEtltablecolumn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEtltablecolumn.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createEtlResult = action.payload;
            })
            .addCase(createEtltablecolumn.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editArea (PUT request)
            .addCase(editEtltablecolumn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editEtltablecolumn.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.etltablecolumnList = state.etltablecolumnList.map((table: any) =>
                    table.etlTableColumnSno === updatedTable.etlTableColumnSno ? updatedTable : table
                );
            })
            .addCase(editEtltablecolumn.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteArea (DELETE request)
            .addCase(deleteEtltablecolumn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEtltablecolumn.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteEtltablecolumn = action.payload;
                state.etltablecolumnList = state.etltablecolumnList.filter(
                    (etltable: any) => etltable.etlSno !== deleteEtltablecolumn.etlSno
                );
            })
            .addCase(deleteEtltablecolumn.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default etlTableColumnSlice.reducer;

