import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    foodSkuList: any;
    createFoodSkuResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    foodSkuList: [],
    createFoodSkuResult: null,
    checking: false,
};


// Thunk for search_food_sku POST API call
export const getAllFoodSku = createAsyncThunk(
    'foodSku/getAllFoodSku',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_food_sku', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_food_sku POST API call
export const createFoodSku: any = createAsyncThunk(
    'foodSku/createFoodSku',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_food_sku', params, PORT, PRIFIX_URL);
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

// Thunk for edit_food_sku PUT API call
export const editFoodSku: any = createAsyncThunk(
    'foodSku/editFoodSku',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_food_sku', params, PORT, PRIFIX_URL);
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

// Thunk for delete_food_sku POST API call
export const deleteFoodSku: any = createAsyncThunk(
    'foodSku/deleteFoodSku',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_food_sku', params, PORT, PRIFIX_URL);
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
const foodSkuSlice = createSlice({
    name: "api/foodSkuSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllFoodSku 
            .addCase(getAllFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFoodSku.fulfilled, (state: any, action) => {
                state.loading = false;
                state.foodSkuList = action.payload;
            })
            .addCase(getAllFoodSku.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createFoodSku 
            .addCase(createFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFoodSku.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createFoodSkuResult = action.payload;
            })
            .addCase(createFoodSku.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editFoodSku 
            .addCase(editFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editFoodSku.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedFoodSku = action.payload;
                state.foodSkuList = state.foodSkuList.map((sku: any) =>
                    sku.foodSkuSno === updatedFoodSku.foodSkuSno ? updatedFoodSku : sku
                );
            })
            .addCase(editFoodSku.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deleteFoodSku 
            .addCase(deleteFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFoodSku.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedFoodSku = action.payload;
                state.foodSkuList = state.foodSkuList.filter(
                    (sku: any) => sku.foodSkuSno !== deletedFoodSku.foodSkuSno
                );
            })
            .addCase(deleteFoodSku.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default foodSkuSlice.reducer;

