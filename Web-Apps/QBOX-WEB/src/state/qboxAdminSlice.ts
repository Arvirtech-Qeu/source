import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
const PORT = import.meta.env.VITE_API_QBOX_QBOX_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    qboxEntityList: any;
    createqboxEntityResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    qboxEntityList: [],
    createqboxEntityResult: null,
    checking: false,
};


// Thunk for search_qbox_entity POST API call
export const getAllQboxEntities = createAsyncThunk(
    'qboxEntity/getAllQboxEntities',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_qbox_entity', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_qbox_entity POST API call
export const createQboxEntity: any = createAsyncThunk(
    'qboxEntity/createQboxEntity',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('create_qbox_entity', params, PORT, PRIFIX_URL);
            console.log(response)
            if (response?.isSuccess) {
                // toast.success("Updated Successfully");
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

// Thunk for edit_qbox_entity PUT API call
export const editQboxEntity: any = createAsyncThunk(
    'qboxEntity/editQboxEntity',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_qbox_entity', params, PORT, PRIFIX_URL);
            console.log(response)
            if (response?.isSuccess) {
                // toast.success("Updated Successfully");
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

// Thunk for delete_qbox_entity POST API call
export const deleteQboxEntity: any = createAsyncThunk(
    'qboxEntity/deleteQboxEntity',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_qbox_entity', params, PORT, PRIFIX_URL);
            console.log(response)
            if (response?.isSuccess) {
                // toast.success("Updated Successfully");
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
const qboxEntitySlice = createSlice({
    name: "api/qboxEntitySlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllQboxEntities (GET request)
            .addCase(getAllQboxEntities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllQboxEntities.fulfilled, (state: any, action) => {
                state.loading = false;
                state.qboxEntityList = action.payload;
            })
            .addCase(getAllQboxEntities.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createQboxEntity (POST request)
            .addCase(createQboxEntity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQboxEntity.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createqboxEntityResult = action.payload;
            })
            .addCase(createQboxEntity.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editQboxEntity (PUT request)
            .addCase(editQboxEntity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editQboxEntity.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.qboxEntityList = state.qboxEntityList.map((table: any) =>
                    table.qboxEntitySno === updatedTable.qboxEntitySno ? updatedTable : table
                );
            })
            .addCase(editQboxEntity.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteQboxEntity (DELETE request)
            .addCase(deleteQboxEntity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteQboxEntity.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedQboxEntity = action.payload;
                state.qboxEntityList = state.qboxEntityList.filter(
                    (qboxEntity: any) => qboxEntity.qboxEntitySno !== deletedQboxEntity.qboxEntitySno
                );
            })
            .addCase(deleteQboxEntity.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default qboxEntitySlice.reducer;


