import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { store } from "./store";
import { ApiResponse } from '../types/apiTypes';
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    cityList: any;
    stateDbTableResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    cityList: [],
    stateDbTableResult: null,
    checking: false,
};


// Thunk for search_state POST API call
export const getAllCity = createAsyncThunk(
    'city/getAllCity',
    async (params: any, thunkAPI) => {
        try {
            // Use the API service to make the POST request
            const response = await apiService.post<ApiResponse<any>>('search_city', params, PORT, PRIFIX_URL);
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
const citySlice = createSlice({
    name: "api/citySlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllDbTable (GET request)
            .addCase(getAllCity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCity.fulfilled, (state: any, action) => {
                state.loading = false;
                state.cityList = action.payload;
            })
            .addCase(getAllCity.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default citySlice.reducer;
