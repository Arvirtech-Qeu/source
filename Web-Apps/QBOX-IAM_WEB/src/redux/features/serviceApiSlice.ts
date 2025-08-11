import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  serviceApiList: any;
  createServiceApiResult: any;
  checking: boolean;
  totalServiceApiCount: number;  // Add this line to store the total count
}

const initialState: ApiState = {
  loading: false,
  error: null,
  serviceApiList: [],
  createServiceApiResult: null,
  checking: false,
  totalServiceApiCount: 0,  // Initialize the count to 0
};

interface ApiResponse {
  id: number;
  name: string;
}

export const getAllServiceApi: any = createAsyncThunk(
  'serviceApi/getAllServiceApi',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'get', '/get_all_service_apis', null, params);
      const serviceApiList = response?.data?.data;
      const count = serviceApiList.length;  // Get the count of service APIs
      console.log(serviceApiList)
      return { serviceApiList, count }; // Return both the list and count
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New createAsyncThunk for create_service_api (POST request)
export const createServiceApi: any = createAsyncThunk(
  'serviceApi/createServiceApi',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'post', '/create_service_api', params, null);
      console.log(response)
      if (response?.data?.status === "success") {
        toast.success("Saved Successfully");
        return response;
      } else if (response?.data?.status === "error" && response?.data?.message === "serviceApiUrl already exists") {
        toast.error("serviceApiUrl already exists");
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


// createAsyncThunk for update_service_api (PUT request)
export const updateServiceApi: any = createAsyncThunk(
  'serviceApi/updateServiceApi',
  async (params: any, thunkAPI) => {
    try {
      const response = await ApiService(PORT, 'put', `/update_service_api`, params);
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

// New createAsyncThunk to check if serviceApi name exists
export const checkServiceApiNameExists: any = createAsyncThunk(
  'serviceApi/checkServiceApiNameExists',
  async (service_api_url: string, thunkAPI) => {
    try {
      // Append the service_api_url as a query parameter
      const response = await ApiService(
        PORT,
        'get',
        `/is_unique_service_api_url_exists?service_api_url=${encodeURIComponent(service_api_url)}` // Properly encode query parameter
      );
      return response?.data?.exists; // Assuming API returns a boolean indicating existence
    } catch (error: any) {
      console.error("Error checking service_api_url Name:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const serviceApiSlice = createSlice({
  name: "api/serviceApiSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
  },
  extraReducers: (builder) => {
    builder

      // Handle getAllserviceApi (GET request)
      .addCase(getAllServiceApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServiceApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.serviceApiList = action.payload.serviceApiList;
        state.totalServiceApiCount = action.payload.count;  // Store the total count
      })

      .addCase(getAllServiceApi.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle createServiceApi (POST request)
      .addCase(createServiceApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.createServiceApiResult = action.payload;  // Store the result of create_service_api
      })
      .addCase(createServiceApi.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateServiceApi (PUT request)
      .addCase(updateServiceApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceApi.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updatedTable = action.payload;
        state.serviceApiList = state.serviceApiList.map((table: any) =>
          table.serviceApiId === updatedTable.serviceApiId ? updatedTable : table
        );
      })
      .addCase(updateServiceApi.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle checkServiceApiNameExists (to check if service api name exists)
      .addCase(checkServiceApiNameExists.pending, (state) => {
        state.checking = true;
      })
      .addCase(checkServiceApiNameExists.fulfilled, (state) => {
        state.checking = false;
      })
      .addCase(checkServiceApiNameExists.rejected, (state) => {
        state.checking = false;
      });

  },
});

export default serviceApiSlice.reducer;
