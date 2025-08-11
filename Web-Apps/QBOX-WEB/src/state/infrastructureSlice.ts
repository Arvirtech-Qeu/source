import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_QBOX_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    infraList: any;
    boxCellList: any;
    createInfraResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    infraList: [],
    boxCellList: [],
    createInfraResult: null,
    checking: false,
};


// Thunk for search_area POST API call
export const getAllInfrastructure = createAsyncThunk(
    'infra/getAllInfrastructure',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_infra', params, PORT, PRIFIX_URL);
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
export const createInfrastructure: any = createAsyncThunk(
    'infra/createInfrastructure',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_infra', params, PORT, PRIFIX_URL);
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
export const editInfrastructure: any = createAsyncThunk(
    'infra/editInfrastructure',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_infra', params, PORT, PRIFIX_URL);
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
export const deleteInfrastructure: any = createAsyncThunk(
    'infra/deleteInfrastructure',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_infra', params, PORT, PRIFIX_URL);
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

export const getAllBoxCellInventory = createAsyncThunk(
    'infra/getAllBoxCellInventory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_box_cell', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const editBoxCellInventory: any = createAsyncThunk(
    'infra/editBoxCellInventory',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_box_cell', params, PORT, PRIFIX_URL);
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


// Create slice
const infrastructureSlice = createSlice({
    name: "api/infrastructureSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllArea (GET request)
            .addCase(getAllInfrastructure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllInfrastructure.fulfilled, (state: any, action) => {
                state.loading = false;
                state.infraList = action.payload;
            })
            .addCase(getAllInfrastructure.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createArea (POST request)
            .addCase(createInfrastructure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInfrastructure.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createInfraResult = action.payload;
            })
            .addCase(createInfrastructure.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editArea (PUT request)
            .addCase(editInfrastructure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editInfrastructure.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.infraList = state.infraList.map((table: any) =>
                    table.infraSno === updatedTable.infraSno ? updatedTable : table
                );
            })
            .addCase(editInfrastructure.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteArea (DELETE request)
            .addCase(deleteInfrastructure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteInfrastructure.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedinfrastructure = action.payload;
                state.infraList = state.infraList.filter(
                    (infra: any) => infra.infraSno !== deletedinfrastructure.infraSno
                );
            })
            .addCase(deleteInfrastructure.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getAllBoxCellInventory (GET request)
            .addCase(getAllBoxCellInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBoxCellInventory.fulfilled, (state: any, action) => {
                state.loading = false;
                state.boxCellList = action.payload;
            })
            .addCase(getAllBoxCellInventory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle editBoxCellInventory (EDIT request)
            .addCase(editBoxCellInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editBoxCellInventory.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.boxCellList = state.boxCellList.map((table: any) =>
                    table.infraSno === updatedTable.infraSno ? updatedTable : table
                );
            })
            .addCase(editBoxCellInventory.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export actions and reducer
export default infrastructureSlice.reducer;

