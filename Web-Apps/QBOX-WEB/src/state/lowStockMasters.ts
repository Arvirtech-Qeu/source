import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "@services/apiService";
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    lowStockTriggerList: any;
    createLowStockTriggerResult: any;
    checking: boolean,
    purchaseOrderStatusList: any;
}

const initialState: ApiState = {
    loading: false,
    error: null,
    lowStockTriggerList: [],
    createLowStockTriggerResult: null,
    checking: false,
    purchaseOrderStatusList: [],
};


export const searchLowStockTrigger: any = createAsyncThunk(
    'lowStockTrigger/searchLowStockTrigger',
    async (params: any, thunkAPI) => {
        try {
            console.log(params)
            const response = await apiService.post<ApiResponse<any>>('search_low_stock_trigger', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const createLowStockTrigger: any = createAsyncThunk(
    'lowStockTrigger/createLowStockTrigger',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('create_low_stock_trigger', params, PORT, PRIFIX_URL);
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

export const updateLowStockTrigger: any = createAsyncThunk(
    'lowStockTrigger/updateLowStockTrigger',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.put<ApiResponse<any>>('edit_low_stock_trigger', params, PORT, PRIFIX_URL);
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

export const deleteLowStockTrigger: any = createAsyncThunk(
    'lowStockTrigger/deleteLowStockTrigger',
    async (params: any, thunkAPI) => {
        console.log(params)
        try {
            const response = await apiService.post<ApiResponse<any>>('delete_low_stock_trigger', params, PORT, PRIFIX_URL);
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


const lowStockTriggerSlice = createSlice({
    name: "api/lowStockTriggerSlice",
    initialState,
    reducers: {
        // Any other reducers if needed
    },
    extraReducers: (builder) => {
        builder

            .addCase(searchLowStockTrigger.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchLowStockTrigger.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.lowStockTriggerList = action.payload;
            })
            .addCase(searchLowStockTrigger.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createLowStockTrigger.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLowStockTrigger.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.createLowStockTriggerResult = action.payload;
            })
            .addCase(createLowStockTrigger.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateLowStockTrigger.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLowStockTrigger.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const updatedTable = action.payload;
                state.lowStockTriggerList = state.lowStockTriggerList.map((table: any) =>
                    table.low_stock_trigger_sno === updatedTable.low_stock_trigger_sno ? updatedTable : table
                );
            })
            .addCase(updateLowStockTrigger.rejected, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(deleteLowStockTrigger.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLowStockTrigger.fulfilled, (state: any, action) => {
                state.loading = false;
                const deletedRestaurant = action.payload;
                state.restaurantList = state.restaurantList.filter(
                    (restaurant: any) => restaurant.low_stock_trigger_sno !== deletedRestaurant.low_stock_trigger_sno
                );
            })
            .addCase(deleteLowStockTrigger.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export default lowStockTriggerSlice.reducer;