import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  rolePermissionList: any;
  createRolePermissionResult: any; // Added createRolePermissionResult to store the result of create_role_permission
}

const initialState: ApiState = {
  loading: false,
  error: null,
  rolePermissionList: [],
  createRolePermissionResult: null, // Initialize createRolePermissionResult
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllRolePermission: any = createAsyncThunk(
  'rolePermission/getAllRolePermission',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_role_permission', null, params);
      const data = response.data.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_role_permission (POST request)
export const createRolePermission: any = createAsyncThunk(
  'rolePermission/createRolePermission',
  async (params: any, thunkAPI) => {
    console.log(params)
    try {
      const response = await ApiService(PORT, 'post', '/create_role_permission', params, null);
      console.log(response)
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


// createAsyncThunk for update_role_permission (PUT request)
export const updateRolePermission: any = createAsyncThunk(
  'rolePermission/updateRolePermission',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_role_permission`, params);
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

const rolePermissionSlice = createSlice({
  name: "api/rolePermissionSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllRolePermission (GET request)
      .addCase(getAllRolePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRolePermission.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.rolePermissionList = action.payload;
      })
      .addCase(getAllRolePermission.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createRolePermission (POST request)
      .addCase(createRolePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRolePermission.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createRolePermissionResult = action.payload;  // Store the result of create_role_permission
      })
      .addCase(createRolePermission.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateRolePermission (PUT request)
      .addCase(updateRolePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRolePermission.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.rolePermissionList = state.rolePermissionList.map((table: any) =>
          table.rolePermissionId === updatedTable.rolePermissionId ? updatedTable : table
        );
      })
      .addCase(updateRolePermission.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default rolePermissionSlice.reducer;
