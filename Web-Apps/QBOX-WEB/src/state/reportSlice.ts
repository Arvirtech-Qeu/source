import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    purchaseReportList: any;
    salesReportList: any;
    checking: boolean;
    partnerOrderDashboardDetails: any;
    goodsReturnReportList: any;
    dailyStockReportList: any;
}

const initialState: ApiState = {
    loading: false,
    error: null,
    purchaseReportList: [],
    salesReportList: [],
    dailyStockReportList: [],
    goodsReturnReportList: [],
    checking: false,
    partnerOrderDashboardDetails: null,
};


// Thunk for getPurchaseReport POST API call
export const getPurchaseReport = createAsyncThunk(
    'report/getPurchaseReport',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_purchase_report', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getSalesReport POST API call
export const getSalesReport = createAsyncThunk(
    'report/getSalesReport',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_sales_report', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getDailyStockReport POST API call
export const getDailyStockReport = createAsyncThunk(
    'report/getDailyStockReport',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_daily_stock_report', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const getDailyGoodsReturnedReport = createAsyncThunk(
    'report/getDailyGoodsReturnedReport',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_daily_goods_returned_report', params, PORT, PRIFIX_URL);
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
const reportSlice = createSlice({
    name: "api/reportSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getPurchaseReport (GET request)
            .addCase(getPurchaseReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseReport.fulfilled, (state: any, action) => {
                state.loading = false;
                state.purchaseReportList = action.payload;
            })
            .addCase(getPurchaseReport.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getSalesReport (GET request)
            .addCase(getSalesReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSalesReport.fulfilled, (state: any, action) => {
                state.loading = false;
                state.salesReportList = action.payload;
            })
            .addCase(getSalesReport.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getDailyStockReport (GET request)
            .addCase(getDailyStockReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDailyStockReport.fulfilled, (state: any, action) => {
                state.loading = false;
                state.dailyStockReportList = action.payload;
            })
            .addCase(getDailyStockReport.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getDailyGoodsReturnedReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDailyGoodsReturnedReport.fulfilled, (state: any, action) => {
                state.loading = false;
                state.goodsReturnReportList = action.payload;
            })
            .addCase(getDailyGoodsReturnedReport.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

// Export actions and reducer
export default reportSlice.reducer;


