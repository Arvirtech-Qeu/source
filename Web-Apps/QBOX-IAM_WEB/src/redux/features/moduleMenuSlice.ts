import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  moduleMenuList: any;
  createModuleMenuResult: any; // Added createModuleMenuResult to store the result of create_module_menu
}

const initialState: ApiState = {
  loading: false,
  error: null,
  moduleMenuList: [],
  createModuleMenuResult: null, // Initialize createModuleMenuResult
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllModuleMenus: any = createAsyncThunk(
  'moduleMenu/getAllModuleMenus',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_module_menus', null, params);
      const data = response?.data?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_module_menu (POST request)
export const createModuleMenu: any = createAsyncThunk(
  'moduleMenu/createModuleMenu',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_module_menu', params, null);
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


// createAsyncThunk for update_module_menu (PUT request)
export const updateModuleMenu: any = createAsyncThunk(
  'moduleMenu/updateModuleMenu',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_module_menu`, params);
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


const moduleMenuSlice = createSlice({
  name: "api/moduleMenuSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllModuleMenus (GET request)
      .addCase(getAllModuleMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllModuleMenus.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.moduleMenuList = action.payload;
      })
      .addCase(getAllModuleMenus.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createModuleMenu (POST request)
      .addCase(createModuleMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModuleMenu.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createModuleMenuResult = action.payload;  // Store the result of create_module_menu
      })
      .addCase(createModuleMenu.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateModuleMenu (PUT request)
      .addCase(updateModuleMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModuleMenu.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.moduleMenuList = state.moduleMenuList.map((table: any) =>
          table.moduleMenuId === updatedTable.moduleMenuId ? updatedTable : table
        );
      })
      .addCase(updateModuleMenu.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default moduleMenuSlice.reducer;
