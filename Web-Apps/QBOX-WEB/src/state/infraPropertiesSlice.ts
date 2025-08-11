import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_QBOX_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    infraPropertiesList: any;
    createInfraPropertiesResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    infraPropertiesList: [],
    createInfraPropertiesResult: null,
    checking: false,
};


// Thunk for search_area POST API call
export const getAllInfraProperties = createAsyncThunk(
    'infra/getAllInfraProperties',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_infra_property', params, PORT, PRIFIX_URL);
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
export const createInfraProperties: any = createAsyncThunk(
    'infra/createInfraProperties',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_infra_property', params, PORT, PRIFIX_URL);
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
export const editInfraProperties: any = createAsyncThunk(
    'infra/editInfraProperties',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_infra_property', params, PORT, PRIFIX_URL);
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
export const deleteInfraProperties: any = createAsyncThunk(
    'infra/deleteInfraProperties',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_infra_property', params, PORT, PRIFIX_URL);
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
const infraPropertySlice = createSlice({
    name: "api/infraPropertySlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllArea (GET request)
            .addCase(getAllInfraProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllInfraProperties.fulfilled, (state: any, action) => {
                state.loading = false;
                state.infraPropertiesList = action.payload;
            })
            .addCase(getAllInfraProperties.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createArea (POST request)
            .addCase(createInfraProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInfraProperties.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createInfraPropertiesResult = action.payload;
            })
            .addCase(createInfraProperties.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editArea (PUT request)
            .addCase(editInfraProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editInfraProperties.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.infraPropertiesList = state.infraPropertiesList.map((table: any) =>
                    table.infraPropertySno === updatedTable.infraPropertySno ? updatedTable : table
                );
            })
            .addCase(editInfraProperties.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteArea (DELETE request)
            .addCase(deleteInfraProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteInfraProperties.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedInfraProperty = action.payload;
                state.infraPropertiesList = state.infraPropertiesList.filter(
                    (infra: any) => infra.infraPropertySno !== deletedInfraProperty.infraPropertySno
                );
            })
            .addCase(deleteInfraProperties.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default infraPropertySlice.reducer;

