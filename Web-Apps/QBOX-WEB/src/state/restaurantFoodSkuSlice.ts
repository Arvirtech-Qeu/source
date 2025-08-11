import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    RestaurantFoodList: any;
    createstaurantFoodResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    RestaurantFoodList: [],
    createstaurantFoodResult: null,
    checking: false,
};


// Thunk for search_restaurant_food_sku POST API call
export const getAllRestaurantFoodSku = createAsyncThunk(
    'restaurantFood/getAllRestaurantFoodSku',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_restaurant_food_sku', params, PORT, PRIFIX_URL);
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
export const createRestaurantFoodSku: any = createAsyncThunk(
    'restaurantFood/createRestaurantFoodSku',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_restaurant_food_sku', params, PORT, PRIFIX_URL);
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

// Thunk for edit_restaurant_food_sku PUT API call
export const editRestaurantFoodSku: any = createAsyncThunk(
    'restaurantFood/editRestaurantFoodSku',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_restaurant_food_sku', params, PORT, PRIFIX_URL);
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

// Thunk for delete_restaurant_food_sku POST API call
export const deleteRestaurantFoodSku: any = createAsyncThunk(
    'restaurantFood/deleteRestaurantFoodSku',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_restaurant_food_sku', params, PORT, PRIFIX_URL);
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
const restaurantFoodSkuSlice = createSlice({
    name: "api/restaurantFoodSkuSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllRestaurantFoodSku (GET request)
            .addCase(getAllRestaurantFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllRestaurantFoodSku.fulfilled, (state: any, action) => {
                state.loading = false;
                state.RestaurantFoodList = action.payload;
            })
            .addCase(getAllRestaurantFoodSku.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createRestaurantFoodSku (POST request)
            .addCase(createRestaurantFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRestaurantFoodSku.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createstaurantFoodResult = action.payload;
            })
            .addCase(createRestaurantFoodSku.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteRestaurantFoodSku (PUT request)
            .addCase(editRestaurantFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editRestaurantFoodSku.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.RestaurantFoodList = state.RestaurantFoodList.map((table: any) =>
                    table.restaurantFoodSkuSno === updatedTable.restaurantFoodSkuSno ? updatedTable : table
                );
            })
            .addCase(editRestaurantFoodSku.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteArea (DELETE request)
            .addCase(deleteRestaurantFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRestaurantFoodSku.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedRestaurantFoodItem = action.payload;
                state.RestaurantFoodList = state.RestaurantFoodList.filter(
                    (food: any) => food.restaurantFoodSkuSno !== deletedRestaurantFoodItem.restaurantFoodSkuSno
                );
            })
            .addCase(deleteRestaurantFoodSku.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default restaurantFoodSkuSlice.reducer;
