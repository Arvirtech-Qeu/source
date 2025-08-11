import { configureStore } from '@reduxjs/toolkit'
import tableViewSlice from './features/dbTableSlice'
import moduleSlice from './features/modulesSlice'
import roleSlice from './features/roleSlice'
import rolePermissionSlice from './features/rolePermissionSlice'
import permissionSlice from './features/permissionsSlice'
import serviceApiSlice from './features/serviceApiSlice'
import authStatusSlice from './features/authStatusSlice'
import menuSlice from './features/menuSlice'
import moduleMenuSlice from './features/moduleMenuSlice'
import recordActionSlice from './features/recordActionSlice'
import menuPermissionSlice from './features/menuPermissionSlice'
import permissionServiceApiSlice from './features/permissionServiceApiSlice'
import sideBarSlice from './features/sideBarSlice'

export const store = configureStore({
  reducer: {
    tableSlice: tableViewSlice,
    moduleSlice: moduleSlice,
    roleSlice: roleSlice,
    rolePermissionSlice: rolePermissionSlice,
    permissionSlice: permissionSlice,
    serviceApiSlice: serviceApiSlice,
    authStatusSlice: authStatusSlice,
    menuSlice: menuSlice,
    moduleMenuSlice: moduleMenuSlice,
    recordActionSlice: recordActionSlice,
    menuPermissionSlice: menuPermissionSlice,
    permissionServiceApiSlice: permissionServiceApiSlice,
    sideBarApi: sideBarSlice

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;