import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    codeHdrList: any;
    createHdrResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    codeHdrList: [],
    createHdrResult: null,
    checking: false,
};


// Thunk for search_codes_hdr POST API call
export const getAllCodesHdr = createAsyncThunk(
    'codesHdr/getAllCodesHdr',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_codes_hdr', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_codes_hdr POST API call
export const createCodesHdr: any = createAsyncThunk(
    'codesHdr/createCodesHdr',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_codes_hdr', params, PORT, PRIFIX_URL);
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

// Thunk for edit_codes_hdr PUT API call
export const editCodesHdr: any = createAsyncThunk(
    'codesHdr/editCodesHdr',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_codes_hdr', params, PORT, PRIFIX_URL);
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

// Thunk for delete_codes_hdr DELETE API call
export const deleteCodesHdr: any = createAsyncThunk(
    'codesHdr/deleteCodesHdr',
    async (params, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_codes_hdr', params, PORT, PRIFIX_URL);
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

// Thunk for partner_ststus_cd POST API call
export const getPartnerStatusCd = createAsyncThunk(
    'codesHdr/getPartnerStatusCd',
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
const codeHdrSlice = createSlice({
    name: "api/codeHdrSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllCodesHdr (GET request)
            .addCase(getAllCodesHdr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCodesHdr.fulfilled, (state: any, action) => {
                state.loading = false;
                state.codeHdrList = action.payload;
            })
            .addCase(getAllCodesHdr.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createCodesHdr (POST request)
            .addCase(createCodesHdr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCodesHdr.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createHdrResult = action.payload;
            })
            .addCase(createCodesHdr.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editCodesHdr (PUT request)
            .addCase(editCodesHdr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editCodesHdr.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.codeHdrList = state.codeHdrList.map((table: any) =>
                    table.codesHdrSno === updatedTable.codesHdrSno ? updatedTable : table
                );
            })
            .addCase(editCodesHdr.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteCodesHdr (DELETE request)
            .addCase(deleteCodesHdr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCodesHdr.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedCodesHdr = action.payload;
                state.codeHdrList = state.codeHdrList.filter(
                    (codesHdr: any) => codesHdr.codesHdrSno !== deletedCodesHdr.codesHdrSno
                );
            })
            .addCase(deleteCodesHdr.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export actions and reducer
export default codeHdrSlice.reducer;

