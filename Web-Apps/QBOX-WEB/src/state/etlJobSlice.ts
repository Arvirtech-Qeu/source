import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { store } from "./store";
import { toast } from "react-toastify";
import { ApiResponse } from '../types/apiTypes';
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    etlJobList: any;
    etlDbTableResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    etlJobList: [],
    etlDbTableResult: null,
    checking: false,
};


// Thunk for search_etl_job POST API call
export const getAllEtljob = createAsyncThunk(
    'etl/getAllEtljob',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_etl_job', params, PORT, PRIFIX_URL);
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
const etlSlice = createSlice({
    name: "api/etlSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllDbTable (GET request)
            .addCase(getAllEtljob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEtljob.fulfilled, (state: any, action) => {
                state.loading = false;
                state.etlJobList = action.payload;
            })
            .addCase(getAllEtljob.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default etlSlice.reducer;
