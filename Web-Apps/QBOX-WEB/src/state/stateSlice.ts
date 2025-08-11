import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { store } from "./store";
import { ApiResponse } from '../types/apiTypes';
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    stateList: any;
    stateDbTableResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    stateList: [],
    stateDbTableResult: null,
    checking: false,
};


// Thunk for search_area POST API call
export const getAllState = createAsyncThunk(
    'area/getAllState',
    async (params: any, thunkAPI) => {
        try {
            // Use the API service to make the POST request
            const response = await apiService.post<ApiResponse<any>>('search_state', params, PORT, PRIFIX_URL);
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
const stateSlice = createSlice({
    name: "api/stateSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllDbTable (GET request)
            .addCase(getAllState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllState.fulfilled, (state: any, action) => {
                state.loading = false;
                state.stateList = action.payload;
            })
            .addCase(getAllState.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default stateSlice.reducer;
