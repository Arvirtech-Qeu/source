import { showToast } from "@/common/Toaster";
import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  menuList: any;
  createMenuResult: any; // Added createMenuResult to store the result of create_menu
  checking: boolean,
}

const initialState: ApiState = {
  loading: false,
  error: null,
  menuList: [],
  createMenuResult: null, // Initialize createMenuResult
  checking: false
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllMenu: any = createAsyncThunk(
  'menu/getAllMenu',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_menus', null, params);
      const data = response?.data?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// New createAsyncThunk for create_menu (POST request)
export const createMenu: any = createAsyncThunk(
  'menu/createMenu',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_menu', params, null);
      if (response?.data?.status === "success") {
        toast.success("Saved Successfully");
        return response;
      } else if (response?.data?.status === "error" && response?.data?.message === "Menu name already exists") {
        toast.error("Menu name already exists");
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


// createAsyncThunk for update_menu (PUT request)
export const updateMenu: any = createAsyncThunk(
  'menu/updateMenu',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_menu`, params);
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


// New createAsyncThunk to check if menu name exists
export const checkMenuNameExists: any = createAsyncThunk(
  'menu/checkMenuNameExists',
  async (menu_name: string, thunkAPI) => {
    try {
      // Append the menu_name as a query parameter
      const response = await ApiService(
        PORT,
        'get',
        `/is_unique_menu_name_exists?menu_name=${encodeURIComponent(menu_name)}` // Properly encode query parameter
      );
      return response?.data?.exists; // Assuming API returns a boolean indicating existence
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const menuSlice = createSlice({
  name: "api/menuSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle getAllMenu (GET request)
      .addCase(getAllMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMenu.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.menuList = action.payload;
      })
      .addCase(getAllMenu.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createMenu (POST request)
      .addCase(createMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createMenuResult = action.payload;  // Store the result of create_menu
      })
      .addCase(createMenu.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateMenus (PUT request)
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.menuList = state.menuList.map((table: any) =>
          table.menuId === updatedTable.menuId ? updatedTable : table
        );
      })
      .addCase(updateMenu.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle checkMenuNameExists (to check if Menu name exists)
      .addCase(checkMenuNameExists.pending, (state) => {
        state.checking = true;
      })
      .addCase(checkMenuNameExists.fulfilled, (state) => {
        state.checking = false;
      })
      .addCase(checkMenuNameExists.rejected, (state) => {
        state.checking = false;
      });
  },
});

export default menuSlice.reducer;
