import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    partnerFoodSkuList: any;
    createPartnerFoodSkuResult: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    partnerFoodSkuList: [],
    createPartnerFoodSkuResult: null,
    checking: false,
};


// Thunk for search_partner_food_sku POST API call
export const getAllPartnerFoodSku = createAsyncThunk(
    'foodSku/getAllPartnerFoodSku',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_partner_food_sku', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for create_partner_food_sku POST API call
export const createPartnerFoodSku: any = createAsyncThunk(
    'foodSku/createPartnerFoodSku',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('create_partner_food_sku', params, PORT, PRIFIX_URL);
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

// Thunk for edit_partner_food_sku PUT API call
export const editPartnerFoodSku: any = createAsyncThunk(
    'foodSku/editPartnerFoodSku',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_partner_food_sku', params, PORT, PRIFIX_URL);
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

// Thunk for delete_partner_food_sku POST API call
export const deletePartnerFoodSku: any = createAsyncThunk(
    'foodSku/deletePartnerFoodSku',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_partner_food_sku', params, PORT, PRIFIX_URL);
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
const partnetFoodSkuSlice = createSlice({
    name: "api/partnetFoodSkuSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getAllPartnerFoodSku 
            .addCase(getAllPartnerFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPartnerFoodSku.fulfilled, (state: any, action) => {
                state.loading = false;
                state.partnerFoodSkuList = action.payload;
            })
            .addCase(getAllPartnerFoodSku.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle createPartnerFoodSku 
            .addCase(createPartnerFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPartnerFoodSku.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createPartnerFoodSkuResult = action.payload;
            })
            .addCase(createPartnerFoodSku.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle editPartnerFoodSku 
            .addCase(editPartnerFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editPartnerFoodSku.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedPartnerFoodSku = action.payload;
                state.partnerFoodSkuList = state.partnerFoodSkuList.map((sku: any) =>
                    sku.partnerFoodSkuSno === updatedPartnerFoodSku.partnerFoodSkuSno ? updatedPartnerFoodSku : sku
                );
            })
            .addCase(editPartnerFoodSku.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle deletePartnerFoodSku 
            .addCase(deletePartnerFoodSku.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePartnerFoodSku.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletePartnerFoodSku = action.payload;
                state.partnerFoodSkuList = state.partnerFoodSkuList.filter(
                    (sku: any) => sku.partnerFoodSkuSno !== deletePartnerFoodSku.partnerFoodSkuSno
                );
            })
            .addCase(deletePartnerFoodSku.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default partnetFoodSkuSlice.reducer;

