import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoleState {
    role: string;
}

const initialState: RoleState = {
    role: 'QBox-Admin'
};

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload;
        }
    }
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer; 