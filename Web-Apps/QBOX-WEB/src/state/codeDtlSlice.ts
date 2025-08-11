import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    codeDtlList: any;
    partnerStatusLis: any;
    qboxEntityStatusList: any;
    createDtlResult: any;
    checking: boolean;
}

const initialState: ApiState = {
    loading: false,
    error: null,
    codeDtlList: [],
    partnerStatusLis: [],
    qboxEntityStatusList: [],
    createDtlResult: null,
    checking: false,
};


// Thunk for search_codes_dtl POST API call
export const getAllCodesDtl = createAsyncThunk(
    'codesDtl/getAllCodesDtl',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_codes_dtl', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_codes_dtl POST API call
export const createCodesDtl: any = createAsyncThunk(
    'codesDtl/createCodesDtl',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_codes_dtl', params, PORT, PRIFIX_URL);
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

// Thunk for edit_codes_dtl PUT API call
export const editCodesDtl: any = createAsyncThunk(
    'codesDtl/editCodesDtl',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_codes_dtl', params, PORT, PRIFIX_URL);
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

// Thunk for delete_codes_dtl DELETE API call
export const deleteCodesDtl: any = createAsyncThunk(
    'codesDtl/deleteCodesDtl',
    async (params, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_codes_dtl', params, PORT, PRIFIX_URL);
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

// Thunk for partner_status_cd POST API call
export const getPartnerStatusCd = createAsyncThunk(
    'codesDtl/getPartnerStatusCd',
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

// Thunk for partner_ststus_cd POST API call
export const getQboxEntityStatus = createAsyncThunk(
    'codesDtl/getQboxEntityStatus',
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

// Create slice
const codeDtlSlice = createSlice({
    name: "api/codeDtlSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllCodesDtl (GET request)
            .addCase(getAllCodesDtl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCodesDtl.fulfilled, (state: any, action) => {
                state.loading = false;
                state.codeDtlList = action.payload;
            })
            .addCase(getAllCodesDtl.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createCodesDtl (POST request)
            .addCase(createCodesDtl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCodesDtl.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createDtlResult = action.payload;
            })
            .addCase(createCodesDtl.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editCodesDtl (PUT request)
            .addCase(editCodesDtl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editCodesDtl.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.codeDtlList = state.codeDtlList.map((table: any) =>
                    table.codesDtlSno === updatedTable.codesDtlSno ? updatedTable : table
                );
            })
            .addCase(editCodesDtl.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteCodesDtl (DELETE request)
            .addCase(deleteCodesDtl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCodesDtl.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedCodesDtl = action.payload;
                state.codeDtlList = state.codeDtlList.filter(
                    (codesDtl: any) => codesDtl.codesDtlSno !== deletedCodesDtl.codesDtlSno
                );
            })
            .addCase(deleteCodesDtl.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getPartnerStatusCd (GET request)
            .addCase(getPartnerStatusCd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPartnerStatusCd.fulfilled, (state: any, action) => {
                state.loading = false;
                state.partnerStatusLis = action.payload;
            })
            .addCase(getPartnerStatusCd.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getQboxEntityStatus (GET request)
            .addCase(getQboxEntityStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQboxEntityStatus.fulfilled, (state: any, action) => {
                state.loading = false;
                state.qboxEntityStatusList = action.payload;
            })
            .addCase(getQboxEntityStatus.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export actions and reducer
export default codeDtlSlice.reducer;

