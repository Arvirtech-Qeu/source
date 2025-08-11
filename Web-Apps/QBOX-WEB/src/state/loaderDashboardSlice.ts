import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const MASTERPORT = import.meta.env.VITE_API_QBOX_QBOX_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
    loading: boolean;
    error: string | null;
    getDashboardStockList: any;
    getAllHotBoxList: any;
    getInwardOrderDetailsV2List: any;
    getHotboxCountLists: any;
    getDailyStockReportV2List: any;
    getQboxEntity: any;
    getEntityLoaderList: any;
    getDetailedInwardList: any;
    getPurchaseOrderInfoList: any;
    getSkuInQboxInventoryList: any;
    getEntityInfraDtlList: any;
    getSkuRejectList: any;
    checking: boolean;
    orderTransactionDate: string | null;
    orderStartDate: string | null;
    orderEndDate: string | null;
    qboxEntitySno: string | null;
    restaurantSno: string | null;
    restaurantSkuSno: string | null;

}

const initialState: ApiState = {
    loading: false,
    error: null,
    getDashboardStockList: [],
    getAllHotBoxList: [],
    getInwardOrderDetailsV2List: [],
    getHotboxCountLists: [],
    getDailyStockReportV2List: [],
    getQboxEntity: [],
    getEntityLoaderList: [],
    getDetailedInwardList: [],
    getPurchaseOrderInfoList: [],
    getSkuInQboxInventoryList: [],
    getEntityInfraDtlList: [],
    getSkuRejectList: [],
    checking: false,
    orderTransactionDate: null,
    orderStartDate: null,
    orderEndDate: null,
    qboxEntitySno: null,
    restaurantSkuSno: null,
    restaurantSno: null
};


// Thunk for getDashboardStockSummary POST API call
export const getDashboardStockSummary = createAsyncThunk(
    'qboxEntity/getDashboardStockSummary',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_dashboard_stock_summary', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getHotboxSummary POST API call
export const getHotboxSummary = createAsyncThunk(
    'qboxEntity/getHotboxSummary',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_hotbox_summary', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getInwardOrderDetailsV2 POST API call
export const getInwardOrderDetailsV2 = createAsyncThunk(
    'qboxEntity/getInwardOrderDetailsV2',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_inward_order_details_v2', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getHotboxCountv3 POST API call
export const getHotboxCountv3 = createAsyncThunk(
    'qboxEntity/getHotboxCountv3',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_hotbox_count_v3', params, PORT, PRIFIX_URL);
            console.log(response.data)
            // const data = response?.data?.hotboxCounts;
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getDailyStockReportV2 POST API call
export const getDailyStockReportV2 = createAsyncThunk(
    'qboxEntity/getDailyStockReportV2',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_daily_stock_report_v2', params, PORT, PRIFIX_URL);
            console.log(response?.data?.orderList)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getQboxEntities POST API call
export const getQboxEntities = createAsyncThunk(
    'qboxEntity/getQboxEntities',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_qbox_entity', params, MASTERPORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getEntityLoader = createAsyncThunk(
    'qboxEntity/getEntityLoader',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_entity_loader', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data?.loaders;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getDetailedInwardOrders = createAsyncThunk(
    'qboxEntity/getDetailedInwardOrders',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_detailed_inward_orders', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getFullPurchaseOrder = createAsyncThunk(
    'qboxEntity/getFullPurchaseOrder',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('search_full_purchase_order', params, PORT, PRIFIX_URL);
            console.log(response)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getHotboxCountv3 POST API call
export const getSkuInQboxInventory = createAsyncThunk(
    'qboxEntity/getSkuInQboxInventory',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_sku_in_qbox_inventory', params, PORT, PRIFIX_URL);
            console.log(response.data)
            // const data = response?.data?.hotboxCounts;
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for getEntityInfraDetails POST API call
export const getEntityInfraDetails = createAsyncThunk(
    'qboxEntity/getEntityInfraDetails',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('get_entity_infra_details', params, PORT, PRIFIX_URL);
            console.log(response.data)
            // const data = response?.data?.hotboxCounts;
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Thunk for confirmSkuRejectOrAccept POST API call
export const confirmSkuRejectOrAccept = createAsyncThunk(
    'qboxEntity/getEntityInfraDetails',
    async (params: any, thunkAPI) => {
        try {
            const response = await apiService.post<ApiResponse<any>>('confirm_sku_reject', params, PORT, PRIFIX_URL);
            console.log(response.data)
            const data = response?.data;
            return data || [];
        } catch (error: any) {
            // Handle errors and reject with error message
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Create slice
const loaderDashboardSlice = createSlice({
    name: "api/loaderDashboardSlice",
    initialState,
    reducers: {
        setOrderTransactionDate: (state, action: PayloadAction<string | null>) => {
            state.orderTransactionDate = action.payload;
        },
        setOrderStartDate: (state, action: PayloadAction<string | null>) => {
            state.orderStartDate = action.payload;
        },
        setOrderEndDate: (state, action: PayloadAction<string | null>) => {
            state.orderEndDate = action.payload;
        },
        setOrderQboxEntitySno: (state, action: PayloadAction<string | null>) => {
            state.qboxEntitySno = action.payload;
        },
        setOrderRestaurantSno: (state, action: PayloadAction<string | null>) => {
            state.restaurantSno = action.payload;
        },
        setOrderRestaurantSkuSno: (state, action: PayloadAction<string | null>) => {
            state.restaurantSkuSno = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder

            // Handle getDashboardStockSummary (GET request)
            .addCase(getDashboardStockSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDashboardStockSummary.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getDashboardStockList = action.payload;
            })
            .addCase(getDashboardStockSummary.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getHotboxSummary (GET request)
            .addCase(getHotboxSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHotboxSummary.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getAllHotBoxList = action.payload;
            })
            .addCase(getHotboxSummary.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getInwardOrderDetailsV2 (GET request)
            .addCase(getInwardOrderDetailsV2.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInwardOrderDetailsV2.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getInwardOrderDetailsV2List = action.payload;
            })
            .addCase(getInwardOrderDetailsV2.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getHotboxCountv3 (GET request)
            .addCase(getHotboxCountv3.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHotboxCountv3.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getHotboxCountLists = action.payload;
            })
            .addCase(getHotboxCountv3.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getDailyStockReportV2 (GET request)
            .addCase(getDailyStockReportV2.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDailyStockReportV2.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getDailyStockReportV2List = action.payload;
            })
            .addCase(getDailyStockReportV2.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getQboxEntities (GET request)
            .addCase(getQboxEntities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQboxEntities.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getQboxEntity = action.payload;
            })
            .addCase(getQboxEntities.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getEntityLoader (GET request)
            .addCase(getEntityLoader.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEntityLoader.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getEntityLoaderList = action.payload;
            })
            .addCase(getEntityLoader.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getDetailedInwardOrders (GET request)
            .addCase(getDetailedInwardOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDetailedInwardOrders.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getDetailedInwardList = action.payload;
            })
            .addCase(getDetailedInwardOrders.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getFullPurchaseOrder (GET request)
            .addCase(getFullPurchaseOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFullPurchaseOrder.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getPurchaseOrderInfoList = action.payload;
            })
            .addCase(getFullPurchaseOrder.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getSkuInQboxInventory (GET request)
            .addCase(getSkuInQboxInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSkuInQboxInventory.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getSkuInQboxInventoryList = action.payload;
            })
            .addCase(getSkuInQboxInventory.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle getEntityInfraDetails (GET request)
            .addCase(getEntityInfraDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEntityInfraDetails.fulfilled, (state: any, action) => {
                state.loading = false;
                state.getEntityInfraDtlList = action.payload;
            })
            .addCase(getEntityInfraDetails.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // Handle confirmSkuRejectOrAccept (GET request)
        // .addCase(confirmSkuRejectOrAccept.pending, (state) => {
        //     state.loading = true;
        //     state.error = null;
        // })
        // .addCase(confirmSkuRejectOrAccept.fulfilled, (state: any, action) => {
        //     state.loading = false;
        //     state.getSkuRejectList = action.payload;
        // })
        // .addCase(confirmSkuRejectOrAccept.rejected, (state: any, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // })
    },
});

// Export actions and reducer
export const { setOrderTransactionDate, setOrderStartDate, setOrderEndDate,
    setOrderQboxEntitySno, setOrderRestaurantSno, setOrderRestaurantSkuSno } = loaderDashboardSlice.actions;
export default loaderDashboardSlice.reducer;