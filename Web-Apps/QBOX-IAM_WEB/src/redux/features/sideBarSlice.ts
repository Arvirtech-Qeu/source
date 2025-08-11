import { ApiService } from "@/services/apiServices";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const PORT = import.meta.env.VITE_API_IAM_PORT;

export interface ApiState {
  loading: boolean;
  error: string | null;
  selectedItem: string
}

const initialState: ApiState = {
  loading: false,
  error: null,
  selectedItem: 'Dashboard'
};

interface ApiResponse {
  id: number;
  name: string;
}


const sideBarSlice = createSlice({
  name: "api/sideBarSlice",
  initialState,
  reducers: {
    // Any other reducers if needed
    setSelectedItem: (state,action) =>{
        state.selectedItem = action.payload;
    }
  },
  
});

export default sideBarSlice.reducer;
export const {setSelectedItem} = sideBarSlice.actions;
