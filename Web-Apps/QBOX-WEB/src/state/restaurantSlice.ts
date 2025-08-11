import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    restaurantList: any;
    createRestaurantResult: any;
    restaurantStatusCdList: any;
    restaurantBrandCdList: any
    checking: boolean;
    partnerOrderDashboardDetails: any;
}

const initialState: ApiState = {
    loading: false,
    error: null,
    restaurantList: [],
    restaurantStatusCdList: [],
    restaurantBrandCdList: [],
    createRestaurantResult: null,
    checking: false,
    partnerOrderDashboardDetails: null,
};


// Thunk for search_area POST API call
export const getAllRestaurant = createAsyncThunk(
    'restaurant/getAllRestaurant',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_restaurant', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getPartnerOrderDashboardDetails: any = createAsyncThunk(
    'restaurant/getPartnerOrderDashboardDetails',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('get_partner_order_dashboard_details', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_area POST API call
export const createRestaurant: any = createAsyncThunk(
    'restaurant/createRestaurant',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_restaurant', params, PORT, PRIFIX_URL);
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
export const editRestaurant: any = createAsyncThunk(
    'restaurant/editRestaurant',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_restaurant', params, PORT, PRIFIX_URL);
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
export const deleteRestaurant: any = createAsyncThunk(
    'restaurant/deleteRestaurant',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_restaurant', params, PORT, PRIFIX_URL);
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

// Thunk for restaurant_status_cd POST API call
export const getRestaurantStatusCd = createAsyncThunk(
    'restaurant/getRestaurantStatusCd',
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

// Thunk for restaurant_brand_cd POST API call
export const getRestaurantBrandCd = createAsyncThunk(
    'restaurant/getRestaurantBrandCd',
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
const restaurantSlice = createSlice({
    name: "api/restaurantSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllArea (GET request)
            .addCase(getAllRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllRestaurant.fulfilled, (state: any, action) => {
                state.loading = false;
                state.restaurantList = action.payload;
            })
            .addCase(getAllRestaurant.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createArea (POST request)
            .addCase(createRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRestaurant.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createRestaurantResult = action.payload;
            })
            .addCase(createRestaurant.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editArea (PUT request)
            .addCase(editRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editRestaurant.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.restaurantList = state.restaurantList.map((table: any) =>
                    table.restaurant_sno === updatedTable.restaurant_sno ? updatedTable : table
                );
            })
            .addCase(editRestaurant.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteArea (DELETE request)
            .addCase(deleteRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRestaurant.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedRestaurant = action.payload;
                state.restaurantList = state.restaurantList.filter(
                    (restaurant: any) => restaurant.restaurant_sno !== deletedRestaurant.restaurant_sno
                );
            })
            .addCase(deleteRestaurant.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getPartnerStatusCd (GET request)
            .addCase(getRestaurantStatusCd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRestaurantStatusCd.fulfilled, (state: any, action) => {
                state.loading = false;
                state.restaurantStatusCdList = action.payload;
            })
            .addCase(getRestaurantStatusCd.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getRestaurantBrandCd (GET request)
            .addCase(getRestaurantBrandCd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRestaurantBrandCd.fulfilled, (state: any, action) => {
                state.loading = false;
                state.restaurantBrandCdList = action.payload;
            })
            .addCase(getRestaurantBrandCd.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getPartnerOrderDashboardDetails (GET request)
            .addCase(getPartnerOrderDashboardDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPartnerOrderDashboardDetails.fulfilled, (state: any, action) => {
                state.loading = false;
                state.partnerOrderDashboardDetails = action.payload;
            })
            .addCase(getPartnerOrderDashboardDetails.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export actions and reducer
export default restaurantSlice.reducer;

