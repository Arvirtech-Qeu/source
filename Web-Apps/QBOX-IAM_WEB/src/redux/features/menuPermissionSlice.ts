import { showToast } from "@/common/Toaster";
import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  menuPermissionList: any;
  createMenuPermissionResult: any; // Added createMenuPermissionResult to store the result of create_menu_permission
}

const initialState: ApiState = {
  loading: false,
  error: null,
  menuPermissionList: [],
  createMenuPermissionResult: null, // Initialize createMenuPermissionResult
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllMenuPermission: any = createAsyncThunk(
  'menuPermission/getAllMenuPermission',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_menu_permission', null, params);
      const data = response?.data?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_menu_permission (POST request)
export const createMenuPermission: any = createAsyncThunk(
  'menuPermission/createMenuPermission',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_menu_permission', params, null);
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

// createAsyncThunk for update_menu_permission (PUT request)
export const updateMenuPermission: any = createAsyncThunk(
  'menuPermission/updateMenuPermission',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_menu_permission`, params);
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


const menuPermissionSlice = createSlice({
  name: "api/menuPermissionSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllMenuPermission (GET request)
      .addCase(getAllMenuPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMenuPermission.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.menuPermissionList = action.payload;
      })
      .addCase(getAllMenuPermission.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createMenuPermission (POST request)
      .addCase(createMenuPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenuPermission.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createMenuPermissionResult = action.payload;  // Store the result of create_menu_permission
      })
      .addCase(createMenuPermission.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateMenuPermission (PUT request)
      .addCase(updateMenuPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuPermission.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.menuPermissionList = state.menuPermissionList.map((table: any) =>
          table.menuPermissionId === updatedTable.menuPermissionId ? updatedTable : table
        );
      })
      .addCase(updateMenuPermission.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export default menuPermissionSlice.reducer;
