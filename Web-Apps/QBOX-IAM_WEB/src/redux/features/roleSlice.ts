import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  dayPlanList: any;
  perDayPlanList: any;
  roleList: any;
  createRoleResult: any;
  checking: boolean
}

const initialState: ApiState = {
  loading: false,
  error: null,
  dayPlanList: [],
  perDayPlanList: [],
  roleList: [],
  createRoleResult: null,
  checking: false
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllRole: any = createAsyncThunk(
  'role/getAllRole',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_role', null, params);
      const data = response.data.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_role (POST request)
export const createRole: any = createAsyncThunk(
  'role/createRole',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_role', params, null);
      if (response?.data?.status === "success") {
        toast.success("Saved Successfully");
        return response;
      } else if (response?.data?.status === "error" && response?.data?.message === "Role name already exists") {
        toast.error("Role Name already exists");
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


// createAsyncThunk for update_role (PUT request)
export const updateRole: any = createAsyncThunk(
  'role/updateRole',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_role`, params);
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

// New createAsyncThunk to check if role_name exists
export const checkRoleNameExists: any = createAsyncThunk(
  'role/checkRoleNameExists',
  async (role_name: string, thunkAPI) => {
    try {
      // Append the role_name as a query parameter
      const response = await ApiService(
        PORT,
        'get',
        `/is_unique_role_name_exists?role_name=${encodeURIComponent(role_name)}` // Properly encode query parameter
      );
      return response?.data?.exists; // Assuming API returns a boolean indicating existence
    } catch (error: any) {
      console.error("Error checking role_name:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const roleSlice = createSlice({
  name: "api/roleSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllRole (GET request)
      .addCase(getAllRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRole.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.roleList = action.payload;
      })
      .addCase(getAllRole.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createRole (POST request)
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createRoleResult = action.payload;  // Store the result of create_role
      })
      .addCase(createRole.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateRole (PUT request)
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.roleList = state.roleList.map((table: any) =>
          table.roleId === updatedTable.roleId ? updatedTable : table
        );
      })
      .addCase(updateRole.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle checkRoleNameExists (to check if role_name exists)
      .addCase(checkRoleNameExists.pending, (state) => {
        state.checking = true;
      })
      .addCase(checkRoleNameExists.fulfilled, (state) => {
        state.checking = false;
      })
      .addCase(checkRoleNameExists.rejected, (state) => {
        state.checking = false;
      });
  },
});

export default roleSlice.reducer;
