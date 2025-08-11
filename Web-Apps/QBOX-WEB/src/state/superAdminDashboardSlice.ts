import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_QBOX_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;
const MASTERPORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  purchaseOrdersDashboardList: any;
  skuDashboardCountList: any;
  getBoxCellInventoryList: any;
  getHotboxCountList: any;
  getDashboardInfraList: any;
  rejectSkuList: any;
  mostSoldCountsList: any;
  inwardOrderDetailList: any;
  unSoldSkuLunchList: any;
  unSoldSkuDinnerList: any;
  consolidatedDashboardList: any;
  dashboardQboxEntityList: any;
  dashboardQboxEntityByauthUserList: any;
  topSkuSalesReportList: any;
  dashboardAnalytics: any;
  checking: boolean,
  refreshing: boolean;
}

const initialState: ApiState = {
  loading: false,
  error: null,
  purchaseOrdersDashboardList: [],
  skuDashboardCountList: [],
  getBoxCellInventoryList: [],
  getHotboxCountList: [],
  getDashboardInfraList: [],
  rejectSkuList: [],
  mostSoldCountsList: [],
  inwardOrderDetailList: [],
  unSoldSkuLunchList: [],
  unSoldSkuDinnerList: [],
  consolidatedDashboardList: [],
  dashboardQboxEntityList: [],
  dashboardQboxEntityByauthUserList: [],
  topSkuSalesReportList: [],
  dashboardAnalytics: null,
  checking: false,
  refreshing: false,
};

const hasDataChanged = (oldData: any, newData: any): boolean => {
  return JSON.stringify(oldData) !== JSON.stringify(newData);
};

// Thunk for getPurchaseOrdersDashboard POST API call
export const getPurchaseOrdersDashboard: any = createAsyncThunk(
  'dashboard/getPurchaseOrdersDashboard',
  async (params: any, thunkAPI) => {
    try {
      const response = await apiService.post<ApiResponse<any>>('get_purchase_orders_dashboard', params, PORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return { data: data || [], isRefresh: params?.isRefresh };
    } catch (error: any) {
      // Handle errors and reject with error message
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Thunk for getSkuDashboardCounts POST API call
export const getSkuDashboardCounts: any = createAsyncThunk(
  'dashboard/getSkuDashboardCounts',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_sku_dashboard_counts', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return { data: data || [], isRefresh: params?.isRefresh };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getBoxCellInventoryv2 POST API call
export const getBoxCellInventoryv2: any = createAsyncThunk(
  'dashboard/getBoxCellInventoryv2',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_box_cell_inventory_v2', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return { data: data || [], isRefresh: params?.isRefresh };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getHotboxCountV2 POST API call
export const getHotboxCountV2: any = createAsyncThunk(
  'dashboard/getHotboxCountV2',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_hotbox_count_v2', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return { data: data || [], isRefresh: params?.isRefresh };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getEntityInfraPropertiesV2 POST API call
export const getEntityInfraPropertiesV2: any = createAsyncThunk(
  'dashboard/getEntityInfraPropertiesV2',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_entity_infra_properties_v2', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getRejectSku POST API call
export const getRejectSku: any = createAsyncThunk(
  'dashboard/getRejectSku',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_rejected_sku', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getMostSoldCounts POST API call
export const getMostSoldCounts: any = createAsyncThunk(
  'dashboard/getMostSoldCounts',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_most_sold_counts', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getInwardOrderDetails POST API call
export const getInwardOrderDetails: any = createAsyncThunk(
  'dashboard/getInwardOrderDetails',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_inward_order_details', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return { data: data || [], isRefresh: params?.isRefresh };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getUnSoldSkuLunchCounts POST API call
export const getUnSoldSkuLunchCounts: any = createAsyncThunk(
  'dashboard/getUnSoldSkuLunchCounts',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_unsold_sku_lunch_counts', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getUnSoldSkuDinnerCounts POST API call
export const getUnSoldSkuDinnerCounts: any = createAsyncThunk(
  'dashboard/getUnSoldSkuDinnerCounts',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_unsold_sku_dinner_counts', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getConsolidatedData POST API call
export const getConsolidatedData: any = createAsyncThunk(
  'dashboard/getConsolidatedData',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_consolidated_data', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getDashboardQboxEntity POST API call
export const getDashboardQboxEntity: any = createAsyncThunk(
  'dashboard/getDashboardQboxEntity',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_dashboard_qbox_entity', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getDashboardQboxEntityByauthUser POST API call
export const getDashboardQboxEntityByauthUser: any = createAsyncThunk(
  'dashboard/getDashboardQboxEntityByauthUser',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_dashboard_qbox_entity_by_auth_user', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for getSkuSalesReport POST API call
export const getSkuSalesReport: any = createAsyncThunk(
  'dashboard/getSkuSalesReport',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('get_sku_sales_report', params, MASTERPORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const getDashboardAnalytics: any = createAsyncThunk(
  'dashboard/getDashboardAnalytics',
  async (params: any, thunkAPI) => {
    try {
      console.log(params);
      const response = await apiService.post<ApiResponse<any>>('get_dashboard_analytics', params, MASTERPORT, PRIFIX_URL);
      console.log(response);
      const data = response?.data;
      console.log(data);
      return { data: data || null, isRefresh: params?.isRefresh };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



// Create slice
const dashboardSlice = createSlice({
  name: "api/dashboardSlice",
  initialState,
  reducers: {
    clearDashBoardData: (state) => {
      state.purchaseOrdersDashboardList = []
    }
  },
  extraReducers: (builder) => {
    builder

      // Handle getPurchaseOrdersDashboard (GET request)
      .addCase(getPurchaseOrdersDashboard.pending, (state, action) => {
        // Only set loading for initial loads, not refreshes
        if (!action.meta.arg?.isRefresh) {
          state.loading = true;
          state.purchaseOrdersDashboardList = []
        } else {
          state.refreshing = true;
        }
        state.error = null;
      })
      .addCase(getPurchaseOrdersDashboard.fulfilled, (state: any, action) => {
        const { data, isRefresh } = action.payload;

        // Only update if data has actually changed
        if (hasDataChanged(state.purchaseOrdersDashboardList, data)) {
          state.purchaseOrdersDashboardList = data;
        }

        if (isRefresh) {
          state.refreshing = false;
        } else {
          state.loading = false;
        }
      })
      .addCase(getPurchaseOrdersDashboard.rejected, (state: any, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })

      // Handle getSkuDashboardCounts (GET request)
      .addCase(getSkuDashboardCounts.pending, (state, action) => {
        if (!action.meta.arg?.isRefresh) {
          state.loading = true;
        } else {
          state.refreshing = true;
        }
        state.error = null;
      })
      .addCase(getSkuDashboardCounts.fulfilled, (state, action: PayloadAction<any>) => {
        const { data, isRefresh } = action.payload;

        if (hasDataChanged(state.skuDashboardCountList, data)) {
          state.skuDashboardCountList = data;
        }

        if (isRefresh) {
          state.refreshing = false;
        } else {
          state.loading = false;
        }
      })
      .addCase(getSkuDashboardCounts.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })

      // Handle getBoxCellInventoryv2 (GET request)
      .addCase(getBoxCellInventoryv2.pending, (state, action) => {
        if (!action.meta.arg?.isRefresh) {
          state.loading = true;
        } else {
          state.refreshing = true;
        }
        state.error = null;
      })
      .addCase(getBoxCellInventoryv2.fulfilled, (state, action: PayloadAction<any>) => {
        const { data, isRefresh } = action.payload;

        if (hasDataChanged(state.getBoxCellInventoryList, data)) {
          state.getBoxCellInventoryList = data;
        }

        if (isRefresh) {
          state.refreshing = false;
        } else {
          state.loading = false;
        }
      })
      .addCase(getBoxCellInventoryv2.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })

      // Handle getHotboxCountV2 (GET request)
      .addCase(getHotboxCountV2.pending, (state, action) => {
        if (!action.meta.arg?.isRefresh) {
          state.loading = true;
        } else {
          state.refreshing = true;
        }
        state.error = null;
      })
      .addCase(getHotboxCountV2.fulfilled, (state, action: PayloadAction<any>) => {
        const { data, isRefresh } = action.payload;

        if (hasDataChanged(state.getHotboxCountList, data)) {
          state.getHotboxCountList = data;
        }

        if (isRefresh) {
          state.refreshing = false;
        } else {
          state.loading = false;
        }
      })
      .addCase(getHotboxCountV2.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })

      // Handle getEntityInfraPropertiesV2 (GET request)
      .addCase(getEntityInfraPropertiesV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEntityInfraPropertiesV2.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.getDashboardInfraList = action.payload;
      })
      .addCase(getEntityInfraPropertiesV2.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getRejectSku (GET request)
      .addCase(getRejectSku.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRejectSku.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.rejectSkuList = action.payload;
      })
      .addCase(getRejectSku.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getMostSoldCounts (GET request)
      .addCase(getMostSoldCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMostSoldCounts.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.mostSoldCountsList = action.payload;
      })
      .addCase(getMostSoldCounts.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getInwardOrderDetails (GET request)
      .addCase(getInwardOrderDetails.pending, (state, action) => {
        if (!action.meta.arg?.isRefresh) {
          state.loading = true;
        } else {
          state.refreshing = true;
        }
        state.error = null;
      })
      .addCase(getInwardOrderDetails.fulfilled, (state, action: PayloadAction<any>) => {
        const { data, isRefresh } = action.payload;

        if (hasDataChanged(state.inwardOrderDetailList, data)) {
          state.inwardOrderDetailList = data;
        }

        if (isRefresh) {
          state.refreshing = false;
        } else {
          state.loading = false;
        }
      })
      .addCase(getInwardOrderDetails.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })

      // Handle getUnSoldSkuLunchCounts (GET request)
      .addCase(getUnSoldSkuLunchCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUnSoldSkuLunchCounts.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.unSoldSkuLunchList = action.payload;
      })
      .addCase(getUnSoldSkuLunchCounts.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getUnSoldSkuDinnerCounts (GET request)
      .addCase(getUnSoldSkuDinnerCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUnSoldSkuDinnerCounts.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.unSoldSkuDinnerList = action.payload;
      })
      .addCase(getUnSoldSkuDinnerCounts.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getConsolidatedData (GET request)
      .addCase(getConsolidatedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConsolidatedData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.consolidatedDashboardList = action.payload;
      })
      .addCase(getConsolidatedData.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getDashboardQboxEntity (GET request)
      .addCase(getDashboardQboxEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardQboxEntity.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.dashboardQboxEntityList = action.payload;
      })
      .addCase(getDashboardQboxEntity.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getDashboardQboxEntityByauthUser (GET request)
      .addCase(getDashboardQboxEntityByauthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardQboxEntityByauthUser.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.dashboardQboxEntityByauthUserList = action.payload;
      })
      .addCase(getDashboardQboxEntityByauthUser.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getSkuSalesReport (GET request)
      .addCase(getSkuSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSkuSalesReport.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.topSkuSalesReportList = action.payload;
      })
      .addCase(getSkuSalesReport.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })


      //Handle getDashboardAnalytics (GET request)
      .addCase(getDashboardAnalytics.pending, (state, action) => {
        if (!action.meta.arg?.isRefresh) {
          state.loading = true;
        } else {
          state.refreshing = true;
        }
        state.error = null;
      })
      .addCase(getDashboardAnalytics.fulfilled, (state, action: PayloadAction<any>) => {
        const { data, isRefresh } = action.payload;

        // Update dashboardAnalytics with the new data
        if (hasDataChanged(state.dashboardAnalytics, data)) {
          state.dashboardAnalytics = data;
        }

        if (isRefresh) {
          state.refreshing = false;
        } else {
          state.loading = false;
        }
      })
      .addCase(getDashboardAnalytics.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })

  },
});

export const { clearDashBoardData } = dashboardSlice.actions;
// Export actions and reducer
export default dashboardSlice.reducer;

