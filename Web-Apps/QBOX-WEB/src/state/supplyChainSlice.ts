import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_QBOX_PORT;
const MASTERPORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;


export interface ApiState {
    loading: boolean;
    error: string | null;
    hotboxCurrentStatusList: any;
    qboxCurrentStatusList: any;
    salesOrderDtlList: any;
    salesOrderList: any;
    skuInventoryList: any;
    purchaseOrderList: any,
    purchaseOrderDtlList: any,
    skuTraceWfList: any,
    generateOrderFileList: any,
    createsupplyChainResult: any;
    createOrderFile: any;
    checking: boolean,
}

const initialState: ApiState = {
    loading: false,
    error: null,
    hotboxCurrentStatusList: [],
    qboxCurrentStatusList: [],
    salesOrderDtlList: [],
    salesOrderList: [],
    skuInventoryList: [],
    purchaseOrderList: [],
    purchaseOrderDtlList: [],
    skuTraceWfList: [],
    generateOrderFileList: [],
    createsupplyChainResult: null,
    createOrderFile: null,
    checking: false,
};


// Thunk for get_hotbox_current_status_v2 POST API call
export const getHotboxCurrentStatusV2 = createAsyncThunk(
    'supplyChain/getHotboxCurrentStatusV2',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_hotbox_current_status_v2', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for search_qbox_entity POST API call
export const getQboxCurrentStatus = createAsyncThunk(
    'supplyChain/getQboxCurrentStatus',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_qbox_current_status', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for search_sku_trace_wf POST API call
export const searchSkuTraceWf = createAsyncThunk(
    'supplyChain/searchSkuTraceWf',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_sku_trace_wf', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



// Thunk for search_sales_order_dtl POST API call
export const searchSalesOrderDtl = createAsyncThunk(
    'supplyChain/searchSalesOrderDtl',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_sales_order_dtl', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for search_sales_order POST API call
export const searchSalesOrder = createAsyncThunk(
    'supplyChain/searchSalesOrder',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_sales_order', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for search_sku_inventory POST API call
export const searchSkuInventory = createAsyncThunk(
    'supplyChain/searchSkuInventory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_sku_inventory', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// Thunk for search_purchase_order POST API call
export const searchPurchaseOrder = createAsyncThunk(
    'supplyChain/searchPurchaseOrder',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_purchase_order', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for search_purchase_order_dtl POST API call
export const searchPurchaseOrderDtl = createAsyncThunk(
    'supplyChain/searchPurchaseOrderDtl',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_purchase_order_dtl', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for accept_sku POST API call
export const acceptSku = createAsyncThunk(
    'supplyChain/acceptSku',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('accept_sku', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for reject_sku POST API call
export const rejectSku = createAsyncThunk(
    'supplyChain/rejectSku',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('reject_sku', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// // Thunk for generate_order_file POST API call
export const generateOrderFile = createAsyncThunk(
    'supplyChain/generateOrderFile',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('generate_order_file', params, MASTERPORT, PRIFIX_URL);
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
const supplyChainSlice = createSlice({
    name: "api/supplyChainSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // Handle getHotboxCurrentStatusV2 (GET request)
            .addCase(getHotboxCurrentStatusV2.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHotboxCurrentStatusV2.fulfilled, (state: any, action) => {
                state.loading = false;
                state.hotboxCurrentStatusList = action.payload;
            })
            .addCase(getHotboxCurrentStatusV2.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getQboxCurrentStatus (GET request)
            .addCase(getQboxCurrentStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQboxCurrentStatus.fulfilled, (state: any, action) => {
                state.loading = false;
                state.qboxCurrentStatusList = action.payload;
            })
            .addCase(getQboxCurrentStatus.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle searchSalesOrderDtl (GET request)
            .addCase(searchSalesOrderDtl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchSalesOrderDtl.fulfilled, (state: any, action) => {
                state.loading = false;
                state.salesOrderDtlList = action.payload;
            })
            .addCase(searchSalesOrderDtl.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // Handle searchSalesOrder (GET request)
            .addCase(searchSalesOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchSalesOrder.fulfilled, (state: any, action) => {
                state.loading = false;
                state.salesOrderList = action.payload;
            })
            .addCase(searchSalesOrder.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle searchSkuInventory (GET request)
            .addCase(searchSkuInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchSkuInventory.fulfilled, (state: any, action) => {
                state.loading = false;
                state.skuInventoryList = action.payload;
            })
            .addCase(searchSkuInventory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle searchPurchaseOrder (GET request)
            .addCase(searchPurchaseOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchPurchaseOrder.fulfilled, (state: any, action) => {
                state.loading = false;
                state.purchaseOrderList = action.payload;
            })
            .addCase(searchPurchaseOrder.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle searchPurchaseOrderDtl (GET request)
            .addCase(searchPurchaseOrderDtl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchPurchaseOrderDtl.fulfilled, (state: any, action) => {
                state.loading = false;
                state.purchaseOrderDtlList = action.payload;
            })
            .addCase(searchPurchaseOrderDtl.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle searchSkuTraceWf (GET request)
            .addCase(searchSkuTraceWf.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchSkuTraceWf.fulfilled, (state: any, action) => {
                state.loading = false;
                state.skuTraceWfList = action.payload;
            })
            .addCase(searchSkuTraceWf.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle generateOrderFile (GET request)
            .addCase(generateOrderFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateOrderFile.fulfilled, (state: any, action) => {
                state.loading = false;
                state.generateOrderFileList = action.payload;
            })
            .addCase(generateOrderFile.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

// Export actions and reducer
export default supplyChainSlice.reducer;

