import { showToast } from "@/common/Toaster";
import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  dayPlanList: any;
  perDayPlanList: any;
  permissionList: any;
  createPermissionsResult: any;
  checking: boolean
}

const initialState: ApiState = {
  loading: false,
  error: null,
  dayPlanList: [],
  perDayPlanList: [],
  permissionList: [],
  createPermissionsResult: null,
  checking: false
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllPermissions: any = createAsyncThunk(
  'permission/getAllPermissions',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_permissions', null, params);
      const data = response.data.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_permission (POST request)
export const createPermissions: any = createAsyncThunk(
  'permission/createPermissions',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_permission', params, null);
      if (response?.data?.status === "success") {
        toast.success("Saved Successfully");
        return response;
      } else if (response?.data?.status === "error" && response?.data?.message === "permissionName  already exists") {
        toast.error("Permission Name already exists");
        return response;
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


// createAsyncThunk for update_permission (PUT request)
export const updatePermission: any = createAsyncThunk(
  'permission/updatePermission',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_permission`, params);
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

// New createAsyncThunk to check if permission_name exists
export const checkPermissionNameExists: any = createAsyncThunk(
  'permission/checkPermissionNameExists',
  async (permission_name: string, thunkAPI) => {
    try {
      // Append the permission_name as a query parameter
      const response = await ApiService(
        PORT,
        'get',
        `/is_unique_permission_name_exists?permission_name=${encodeURIComponent(permission_name)}` // Properly encode query parameter
      );
      return response?.data?.exists; // Assuming API returns a boolean indicating existence
    } catch (error: any) {
      console.error("Error checking permission_name:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const permissionSlice = createSlice({
  name: "api/permissionSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllPermissions (GET request)
      .addCase(getAllPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPermissions.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.permissionList = action.payload;
      })
      .addCase(getAllPermissions.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createPermissions (POST request)
      .addCase(createPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermissions.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createPermissionsResult = action.payload;  // Store the result of create_permission
      })
      .addCase(createPermissions.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updatePermissions (PUT request)
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermission.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.permissionList = state.permissionList.map((table: any) =>
          table.permissionId === updatedTable.permissionId ? updatedTable : table
        );
      })
      .addCase(updatePermission.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle checkPermissionNameExists (to check if permission_name exists)
      .addCase(checkPermissionNameExists.pending, (state) => {
        state.checking = true;
      })
      .addCase(checkPermissionNameExists.fulfilled, (state) => {
        state.checking = false;
      })
      .addCase(checkPermissionNameExists.rejected, (state) => {
        state.checking = false;
      });
  },
});

export default permissionSlice.reducer;
