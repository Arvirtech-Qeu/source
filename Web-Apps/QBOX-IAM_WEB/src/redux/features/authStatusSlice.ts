import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  authStatusList: any;
  createAuthStatusResult: any; // Added createAuthStatusResult to store the result of create_auth_status
}

const initialState: ApiState = {
  loading: false,
  error: null,
  authStatusList: [],
  createAuthStatusResult: null, // Initialize createAuthStatusResult
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllAuthStatuses: any = createAsyncThunk(
  'authStatus/getAllAuthStatuses',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_auth_statuses', null, params);
      const data = response?.data?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_auth_status (POST request)
export const createAuthStatus: any = createAsyncThunk(
  'authStatus/createAuthStatus',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_auth_status', params, null);
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


// createAsyncThunk for update_auth_status (PUT request)
export const updateAuthStatus: any = createAsyncThunk(
  'authStatus/updateAuthStatus',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_auth_status`, params);
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

const authStatusSlice = createSlice({
  name: "api/authStatusSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllAuthStatuses (GET request)
      .addCase(getAllAuthStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAuthStatuses.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.authStatusList = action.payload;
      })
      .addCase(getAllAuthStatuses.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createAuthStatus (POST request)
      .addCase(createAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuthStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createAuthStatusResult = action.payload;  // Store the result of create_auth_status
      })
      .addCase(createAuthStatus.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateAuthStatus (PUT request)
      .addCase(updateAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.authStatusList = state.authStatusList.map((table: any) =>
          table.authStatusId === updatedTable.authStatusId ? updatedTable : table
        );
      })
      .addCase(updateAuthStatus.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
  },

});

export default authStatusSlice.reducer;
