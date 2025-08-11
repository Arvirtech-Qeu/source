import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  dbTableList: any;
  createDbTableResult: any;
  checking: boolean,
}

const initialState: ApiState = {
  loading: false,
  error: null,
  dbTableList: [],
  createDbTableResult: null,
  checking: false,
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllDbTable: any = createAsyncThunk(
  'tableView/getAllDbTable',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_db_table', null, params);
      const data = response?.data?.data;
      return data || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_db_table (POST request)
export const createDbTable: any = createAsyncThunk(
  'tableView/createDbTable',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_db_table', params, null);
      console.log(response)
      if (response?.data?.status === "success") {
        toast.success("Saved Successfully");
        return response;
      } else if (response?.data?.status === "error" && response?.data?.message === "Table name already exists") {
        toast.error("Table name already exists");
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

// createAsyncThunk for update_db_table (PUT request)
export const updateDbTable: any = createAsyncThunk(
  'tableView/updateDbTable',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_db_table`, params);
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

// New createAsyncThunk to check if dbTable name exists
export const checkDBTableNameExists: any = createAsyncThunk(
  'tableView/checkDBTableNameExists',
  async (db_table_name: string, thunkAPI) => {
    try {
      // Append the db_table_name as a query parameter
      const response = await ApiService(
        PORT,
        'get',
        `/is_unique_db_table_name_exists?db_table_name=${encodeURIComponent(db_table_name)}` // Properly encode query parameter
      );
      return response?.data?.exists; // Assuming API returns a boolean indicating existence
    } catch (error: any) {
      console.error("Error checking Module Name:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const dbTableSlice = createSlice({
  name: "api/dbTableSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllDbTable (GET request)
      .addCase(getAllDbTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDbTable.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.dbTableList = action.payload;
      })
      .addCase(getAllDbTable.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createDbTable (POST request)
      .addCase(createDbTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDbTable.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createDbTableResult = action.payload;  // Store the result of create_db_table
      })
      .addCase(createDbTable.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createDbTable (PUT request)
      .addCase(updateDbTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDbTable.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Update dbTableList by finding the updated item and replacing it
        const updatedTable = action.payload;
        state.dbTableList = state.dbTableList.map((table: any) =>
          table.dbTableId === updatedTable.dbTableId ? updatedTable : table
        );
      })
      .addCase(updateDbTable.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle checkDBTableNameExists (to check if DB Tanle name exists)
      .addCase(checkDBTableNameExists.pending, (state) => {
        state.checking = true;
      })
      .addCase(checkDBTableNameExists.fulfilled, (state) => {
        state.checking = false;
      })
      .addCase(checkDBTableNameExists.rejected, (state) => {
        state.checking = false;
      });

  },
});

export default dbTableSlice.reducer;
