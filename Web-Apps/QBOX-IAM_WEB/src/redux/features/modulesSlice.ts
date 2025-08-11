import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  modulesList: any;
  createModuleResult: any;
  checking: boolean,
}

const initialState: ApiState = {
  loading: false,
  error: null,
  modulesList: [],
  createModuleResult: null,
  checking: false,
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllModules: any = createAsyncThunk(
  'modules/getAllModules',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_modules', null, params);
      const data = response?.data?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_module (POST request)
export const createModule: any = createAsyncThunk(
  'modules/createModule',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_module', params, null);
      if (response?.data?.status === "success") {
        toast.success("Saved Successfully");
        return response;
      } else if (response?.data?.status === "error" && response?.data?.message === "Module name already exists") {
        toast.error("Module name already exists");
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


// createAsyncThunk for update_module (PUT request)
export const updateModule: any = createAsyncThunk(
  'modules/updateModule',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_module`, params);
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

// New createAsyncThunk to check if module name exists
export const checkModuleNameExists: any = createAsyncThunk(
  'modules/checkDBTableNameExists',
  async (module_name: string, thunkAPI) => {
    try {
      // Append the module_name as a query parameter
      const response = await ApiService(
        PORT,
        'get',
        `/is_unique_module_name_exists?module_name=${encodeURIComponent(module_name)}` // Properly encode query parameter
      );
      return response?.data?.exists; // Assuming API returns a boolean indicating existence
    } catch (error: any) {
      console.error("Error checking Module Name:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const modulesSlice = createSlice({
  name: "api/modulesSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllModules (GET request)
      .addCase(getAllModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllModules.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.modulesList = action.payload;
      })
      .addCase(getAllModules.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createModule (POST request)
      .addCase(createModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createModule.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createModuleResult = action.payload;  // Store the result of create_module
      })
      .addCase(createModule.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateModule (PUT request)
      .addCase(updateModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateModule.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.modulesList = state.modulesList.map((table: any) =>
          table.moduleId === updatedTable.moduleId ? updatedTable : table
        );
      })
      .addCase(updateModule.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle checkModuleNameExists (to check if module name exists)
      .addCase(checkModuleNameExists.pending, (state) => {
        state.checking = true;
      })
      .addCase(checkModuleNameExists.fulfilled, (state) => {
        state.checking = false;
      })
      .addCase(checkModuleNameExists.rejected, (state) => {
        state.checking = false;
      });

  },
});

export default modulesSlice.reducer;
