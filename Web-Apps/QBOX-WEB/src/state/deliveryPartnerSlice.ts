import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "@services/apiService";
import { ApiResponse } from '../types/apiTypes';
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_QBOX_MASTER_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

export interface ApiState {
  loading: boolean;
  error: string | null;
  deliveryPartnerList: any;
  createDeliveryPartnerTableResult: any;
  checking: boolean,
  purchaseOrderStatusList: any;
}

const initialState: ApiState = {
  loading: false,
  error: null,
  deliveryPartnerList: [],
  createDeliveryPartnerTableResult: null,
  checking: false,
  purchaseOrderStatusList: [],
};

interface DeliveryPartner {
  deliveryPartnerSno: string;
  partnerName: string;
  partnerCode: string;
  partnerStatusCd: string;
}

export const getAllDeliiveryPartner: any = createAsyncThunk(
  'deliveryPartner/getAllDeliiveryPartner',
  async (params: any, thunkAPI) => {
    try {
      console.log(params)
      const response = await apiService.post<ApiResponse<any>>('search_delivery_partner', params, PORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPurchaseOrderStatus: any = createAsyncThunk(
  'deliveryPartner/getPurchaseOrderStatus',
  async (params: any, thunkAPI) => {
    console.log(params)
    try {
      const response = await apiService.post<ApiResponse<any>>('get_enum', params, PORT, PRIFIX_URL);
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createDeliiveryPartner: any = createAsyncThunk(
  'deliveryPartner/createDeliiveryPartner',
  async (params: any, thunkAPI) => {
    console.log(params)
    try {
      const response = await apiService.post<ApiResponse<any>>('create_delivery_partner', params, PORT, PRIFIX_URL);
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

export const updateDeliiveryPartner: any = createAsyncThunk(
  'deliveryPartner/updateDeliiveryPartner',
  async (params: DeliveryPartner, thunkAPI) => {
    try {
      const response = await apiService.put<ApiResponse<any>>('edit_delivery_partner', params, PORT, PRIFIX_URL);
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

export const deleteDeliiveryPartner: any = createAsyncThunk(
  'deliveryPartner/deleteDeliiveryPartner',
  async (params: DeliveryPartner, thunkAPI) => {
    try {
      const response = await apiService.post<ApiResponse<any>>('delete_delivery_partner', params, PORT, PRIFIX_URL);
      if (response?.isSuccess) {
        toast.success("Successfully deleted");
        return response;
      } else {
        const errorMessage = "Something went wrong";
        // toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const deliveryPartnerSlice = createSlice({
  name: "api/deliveryPartnerSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllDeliiveryPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeliiveryPartner.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.deliveryPartnerList = action.payload;
      })
      .addCase(getAllDeliiveryPartner.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createDeliiveryPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeliiveryPartner.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createDeliveryPartnerTableResult = action.payload;
      })
      .addCase(createDeliiveryPartner.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDeliiveryPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateDeliiveryPartner.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedPartner = action.payload;
        if (Array.isArray(state.deliveryPartnerList)) {
          state.deliveryPartnerList = state.deliveryPartnerList.map((partner) =>
            partner.deliveryPartnerSno === updatedPartner.deliveryPartnerSno ? updatedPartner : partner
          );
        } else {
          console.error('Expected deliveryPartnerList to be an array, but it is not:', state.deliveryPartnerList);
        }
      })

      .addCase(updateDeliiveryPartner.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDeliiveryPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeliiveryPartner.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const deletedPartner = action.payload; // Assuming action.payload contains the deleted partner's info

        if (Array.isArray(state.deliveryPartnerList)) {
          // Filter out the deleted partner from the list
          state.deliveryPartnerList = state.deliveryPartnerList.filter(
            (partner) => partner.deliveryPartnerSno !== deletedPartner.deliveryPartnerSno
          );
        } else {
          console.error('Expected deliveryPartnerList to be an array, but it is not:', state.deliveryPartnerList);
        }
      })

      .addCase(deleteDeliiveryPartner.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPurchaseOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrderStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.purchaseOrderStatusList = action.payload;
      })
      .addCase(getPurchaseOrderStatus.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export default deliveryPartnerSlice.reducer;