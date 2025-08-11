import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  permissionServiceApiList: any;
  createPermissionServiceApiResult: any;
}

const initialState: ApiState = {
  loading: false,
  error: null,
  permissionServiceApiList: [],
  createPermissionServiceApiResult: null,
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllPermissionServiceApi: any = createAsyncThunk(
  'modules/getAllPermissionServiceApi',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_permission_service_apis', null, params);
      const data = response?.data?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_permission_service_api (POST request)
export const createPermissionServiceApi: any = createAsyncThunk(
  'modules/createPermissionServiceApi',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_permission_service_api', params, null);
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


// createAsyncThunk for update_permission_service_api (PUT request)
export const updatePermissionServiceApi: any = createAsyncThunk(
  'modules/updatePermissionServiceApi',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_permission_service_api`, params);
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


const permissionServiceApiSlice = createSlice({
  name: "api/permissionServiceApiSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllPermissionServiceApi (GET request)
      .addCase(getAllPermissionServiceApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPermissionServiceApi.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.permissionServiceApiList = action.payload;
      })
      .addCase(getAllPermissionServiceApi.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createPermissionServiceApi (POST request)
      .addCase(createPermissionServiceApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermissionServiceApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createPermissionServiceApiResult = action.payload;  // Store the result of create_permission_service_api
      })
      .addCase(createPermissionServiceApi.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updatePermissionServiceApi (PUT request)
      .addCase(updatePermissionServiceApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermissionServiceApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.permissionServiceApiList = state.permissionServiceApiList.map((table: any) =>
          table.permissionServiceApiId === updatedTable.permissionServiceApiId ? updatedTable : table
        );
      })
      .addCase(updatePermissionServiceApi.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default permissionServiceApiSlice.reducer;
