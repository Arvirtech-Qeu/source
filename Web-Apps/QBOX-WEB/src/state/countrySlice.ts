import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    countryList: any;
    createCountryResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    countryList: [],
    createCountryResult: null,
    checking: false,
};


// Thunk for search_area POST API call
export const getAllCountry = createAsyncThunk(
    'country/getAllCountry',
    async (params: any, thunkAPI) => {
        try {
            // Use the API service to make the POST request
            const response = await apiService.post<ApiResponse<any>>('search_country', params, PORT, PRIFIX_URL);
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
const countrySlice = createSlice({
    name: "api/countrySlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllDbTable (GET request)
            .addCase(getAllCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCountry.fulfilled, (state: any, action) => {
                state.loading = false;
                state.countryList = action.payload;
            })
            .addCase(getAllCountry.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default countrySlice.reducer;

