import { showToast } from "@/common/Toaster";
import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  recordActionList: any;
  createDbTableResult: any; // Added createDbTableResult to store the result of create_record_action
}

const initialState: ApiState = {
  loading: false,
  error: null,
  recordActionList: [],
  createDbTableResult: null, // Initialize createDbTableResult
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllRecordAction: any = createAsyncThunk(
  'recordAction/getAllRecordAction',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_record_action', null, params);
      const data = response.data.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_record_action (POST request)
export const createRecordAction: any = createAsyncThunk(
  'recordAction/createRecordAction',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_record_action', params, null);
      if (response?.data?.status === "success") {
        const responseData = response?.data?.data;
        toast.success("Saved Successfully");
        return responseData;
      } else {
        toast.error("Something went wrong");
        return thunkAPI.rejectWithValue("Error: Invalid response status");
      }
    } catch (error: any) {
      toast.error("An error occurred while saving");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// createAsyncThunk for update_record_action (PUT request)
export const updateRecordAction: any = createAsyncThunk(
  'recordAction/updateRecordAction',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_record_action`, params);
      if (response?.data?.status === "success") {
        toast.success("Updated Successfully");
        return response?.data?.data;
      } else {
        const errorMessage = "Something went wrong";
        toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      toast.error("An error occurred while updating");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const recordActionSlice = createSlice({
  name: "api/recordActionSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllRecordAction (GET request)
      .addCase(getAllRecordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRecordAction.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.recordActionList = action.payload;
      })
      .addCase(getAllRecordAction.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createRecordAction (POST request)
      .addCase(createRecordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecordAction.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createDbTableResult = action.payload;  // Store the result of create_record_action
      })
      .addCase(createRecordAction.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateRecordAction (PUT request)
      .addCase(updateRecordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecordAction.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.recordActionList = state.recordActionList.map((table: any) =>
          table.recordActionId === updatedTable.recordActionId ? updatedTable : table
        );
      })
      .addCase(updateRecordAction.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default recordActionSlice.reducer;
