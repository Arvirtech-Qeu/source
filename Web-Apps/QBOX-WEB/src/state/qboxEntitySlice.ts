import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_QBOX_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    qboxEntityList: any;
    entityInfraPropsList: any;
    qboxEntityStatusList: any;
    createqboxEntityResult: any;
    checking: boolean,
    qboxEntitySno: string | null;

}

const initialState: ApiState = {
    loading: false,
    error: null,
    qboxEntityList: [],
    qboxEntityStatusList: [],
    entityInfraPropsList: [],
    createqboxEntityResult: null,
    checking: false,
    qboxEntitySno: null,

};


// Thunk for search_qbox_entity POST API call
export const getAllQboxEntities: any = createAsyncThunk(
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

// Thunk for edit_qbox_entity PUT API call
export const editQboxEntity: any = createAsyncThunk(
    'qboxEntity/editQboxEntity',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_qbox_entity', params, PORT, PRIFIX_URL);
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

// Thunk for delete_qbox_entity POST API call
export const deleteQboxEntity: any = createAsyncThunk(
    'qboxEntity/deleteQboxEntity',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_qbox_entity', params, PORT, PRIFIX_URL);
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


// Thunk for get_entity_infra_properties POST API call
export const getEntityInfraProperties = createAsyncThunk(
    'qboxEntity/getEntityInfraProperties',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_entity_infra_properties', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for save_entity_infrastructure POST API call
export const saveEntityInfrastructure: any = createAsyncThunk(
    'qboxEntity/createQboxEntity',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('save_entity_infrastructure', params, PORT, PRIFIX_URL);
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

// Thunk for update_entity_infrastructure POST API call
export const updateEntityInfrastructure: any = createAsyncThunk(
    'qboxEntity/updateEntityInfrastructure',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('update_entity_infrastructure', params, PORT, PRIFIX_URL);
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

// Thunk for qbox_entity_status_cd POST API call
export const getQboxEntityStatusCd = createAsyncThunk(
    'qboxEntity/getQboxEntityStatusCd',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_enum', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for delete_entity_infra_by_id POST API call
export const deleteEntityInfraById: any = createAsyncThunk(
    'qboxEntity/deleteEntityInfraById',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_entity_infra_by_id', params, PORT, PRIFIX_URL);
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
const qboxEntitySlice = createSlice({
    name: "api/qboxEntitySlice",
    initialState,
    reducers: {
        setSelectedQboxEntitySno(state, action: PayloadAction<string>) {
            state.qboxEntitySno = action.payload;
        },
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
            .addCase(createQboxEntity.fulfilled, (state, action) => {
                state.loading = false;
                state.createqboxEntityResult = action.payload;
                state.qboxEntitySno = action.payload?.qboxEntitySno;
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
            })

            // Handle getEntityInfraProperties (GET request)
            .addCase(getEntityInfraProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEntityInfraProperties.fulfilled, (state: any, action) => {
                state.loading = false;
                state.entityInfraPropsList = action.payload;
            })
            .addCase(getEntityInfraProperties.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateEntityInfrastructure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEntityInfrastructure.fulfilled, (state, action) => {
                state.loading = false;
                // Update the state with the response data
                state.entityInfraPropsList = action.payload.data;
            })
            .addCase(updateEntityInfrastructure.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update infrastructure";
            })

            // Handle getQboxEntityStatus (GET request)
            .addCase(getQboxEntityStatusCd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQboxEntityStatusCd.fulfilled, (state: any, action) => {
                state.loading = false;
                state.qboxEntityStatusList = action.payload;
            })
            .addCase(getQboxEntityStatusCd.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteEntityInfraById (DELETE request)
            .addCase(deleteEntityInfraById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEntityInfraById.fulfilled, (state: any, action) => {
                state.loading = false;
                const deleteEntityInfraById = action.payload;
                state.entityInfraPropsList = state.entityInfraPropsList.filter(
                    (entityInfra: any) => entityInfra.entityInfraSno !== deleteEntityInfraById.entityInfraSno
                );
            })
            .addCase(deleteEntityInfraById.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});
export const { setSelectedQboxEntitySno } = qboxEntitySlice.actions;



// Export actions and reducer
export default qboxEntitySlice.reducer;


