import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the initial state and type for the user slice
interface UserState {
    id: string | null
    name: string | null
    email: string | null
    isAuthenticated: boolean
}

const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    isAuthenticated: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.email = action.payload.email
            state.isAuthenticated = true
        },
        clearUser: (state) => {
            state.id = null
            state.name = null
            state.email = null
            state.isAuthenticated = false
        },
    },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
