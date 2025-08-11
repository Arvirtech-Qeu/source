import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from '../services/apiService';
import { store } from "./store";
import { ApiResponse } from '../types/apiTypes';
const PORT = import.meta.env.VITE_API_QBOX_AUTHN_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_AUTHN_PREFIX_URL;

export interface ApiState {
  loading: boolean;
  error: string | null;
  roleList: any;
  loaderList: any;
  userList: any;
  // roleMenuList: any;
  // menuList: any;
  menuList: any[];
  roleMenuList: any[];
  qboxEntityUserList: any;
  checking: boolean,
}

const initialState: ApiState = {
  loading: false,
  error: null,
  roleList: [],
  loaderList: [],
  menuList: [],
  roleMenuList: [],
  userList: [],
  qboxEntityUserList: [],
  checking: false,
};

export const getAllRole: any = createAsyncThunk(
  'authn/getAllRole',
  async (params: any, thunkAPI) => {
    try {
      // const response = await apiService.get<ApiResponse<any>>('get_all_role', params, PORT, PRIFIX_URL);
      const response = await apiService.get<ApiResponse<any>>('get_all_role', PORT, PRIFIX_URL, { params: {} });
      console.log(response)
      const data = response.data.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllLoader: any = createAsyncThunk(
  'authn/getAllLoader',
  async (params: any, thunkAPI) => {
    try {
      const response = await apiService.get<ApiResponse<any>>('get_all_loader', PORT, PRIFIX_URL, { params: {} });
      console.log(response)
      const data = response.data.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllMenuSubmenu: any = createAsyncThunk(
  'authn/getAllMenuSubmenu',
  async (params: any, thunkAPI) => {
    try {
      const response = await apiService.get<ApiResponse<any>>('get_all_menu_submenu', PORT, PRIFIX_URL, { params: {} });
      console.log(response)
      const data = response.data.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getMenuByRole = createAsyncThunk<any[], { roleId: number }>(
  'authn/getMenuByRole',
  async (params, thunkAPI) => {
    try {
      if (!params.roleId) {
        throw new Error('Role ID is required');
      }

      const response = await apiService.get<ApiResponse<any>>(
        'get_map_unmap_role_permission_by_role_id',
        PORT,
        PRIFIX_URL,
        { params }
      );

      if (!response?.data?.mapped_permissions) {
        throw new Error('No permissions data received');
      }

      return response.data.mapped_permissions;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAuthUser: any = createAsyncThunk(
  'authn/getAuthUser',
  async (params: any, thunkAPI) => {
    try {
      const response = await apiService.get<ApiResponse<any>>('get_auth_user', PORT, PRIFIX_URL, { params });
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserByQboxEntity: any = createAsyncThunk(
  'authn/getUserByQboxEntity',
  async (params: any, thunkAPI) => {
    try {
      const response = await apiService.get<ApiResponse<any>>('get_user_by_qbox_entity', PORT, PRIFIX_URL, { params });
      console.log(response)
      const data = response?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create slice
const authnSlice = createSlice({
  name: "api/authnSlice",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllRole (GET request)
      .addCase(getAllRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRole.fulfilled, (state: any, action) => {
        state.loading = false;
        state.roleList = action.payload;
      })
      .addCase(getAllRole.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAllLoader (GET request)
      .addCase(getAllLoader.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLoader.fulfilled, (state: any, action) => {
        state.loading = false;
        state.loaderList = action.payload;
      })
      .addCase(getAllLoader.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAllMenuSubmenu (GET request)
      .addCase(getAllMenuSubmenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMenuSubmenu.fulfilled, (state: any, action) => {
        state.loading = false;
        state.menuList = action.payload;
      })
      .addCase(getAllMenuSubmenu.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getMenuByRole (GET request)
      .addCase(getMenuByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuByRole.fulfilled, (state: any, action) => {
        state.loading = false;
        state.roleMenuList = action.payload;
      })
      .addCase(getMenuByRole.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAuthUser (GET request)
      .addCase(getAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAuthUser.fulfilled, (state: any, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(getAuthUser.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getUserByQboxEntity (GET request)
      .addCase(getUserByQboxEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByQboxEntity.fulfilled, (state: any, action) => {
        state.loading = false;
        state.qboxEntityUserList = action.payload;
      })
      .addCase(getUserByQboxEntity.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

// Export actions and reducer
export default authnSlice.reducer;
