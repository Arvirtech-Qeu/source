import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import themeReducer from './themeSlice'
import areaReducer from './areaSlice'
import countryReducer from './countrySlice'
import stateReducer from './stateSlice'
import cityReducer from './citySlice'
import deliveryPartnersReducer from './deliveryPartnerSlice'
import foodSkuReducer from './foodSkuSlice'
import restaurantReducer from './restaurantSlice'
import codesDtlReducer from './codeDtlSlice'
import codesHdrReducer from './codeHdrSlice'
import addressReducer from './addressSlice'
import partnetFoodSkuReducer from './partnerFoodSkuSlice'
import infrastructureReducer from './infrastructureSlice'
import infraPropertyReducer from './infraPropertiesSlice'
import restaurantFoodSkuReducer from './restaurantFoodSkuSlice'
import qboxEntityReducer from './qboxEntitySlice'
import supplyChainReducer from './supplyChainSlice'
import etlSliceReducer from './etlJobSlice'
import etlTableColumnReducer from './etlTableColumnSlice'
import etlHdrReducer from './etlHdrSlice'
import roleReducer from './roleSlice'
import reportReducer from './reportSlice'
import authnReducer from './authnSlice'
import dashboardReducer from './superAdminDashboardSlice'
import profileReducer from './profileSlice'
import loaderDashboardReducer from './loaderDashboardSlice'
import attendanceReducer from './attendanceSlice'
import lowStockReducer from './lowStockMasters'
import rejectReasonReducer from './rejectReasonSlice'

// Configure the store
export const store = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer,
        area: areaReducer,
        country: countryReducer,
        state: stateReducer,
        city: cityReducer,
        deliveryPartners: deliveryPartnersReducer,
        restaurant: restaurantReducer,
        codesDtl: codesDtlReducer,
        codesHdr: codesHdrReducer,
        address: addressReducer,
        foodSku: foodSkuReducer,
        partnetFoodSku: partnetFoodSkuReducer,
        infra: infrastructureReducer,
        infraProperty: infraPropertyReducer,
        restaurantFoodSku: restaurantFoodSkuReducer,
        qboxEntity: qboxEntityReducer,
        supplyChain: supplyChainReducer,
        etlSlice: etlSliceReducer,
        etlTableColumnSlice: etlTableColumnReducer,
        etlHdrSlice: etlHdrReducer,
        role: roleReducer,
        reportSlice: reportReducer,
        authnSlice: authnReducer,
        dashboardSlice: dashboardReducer,
        profileSlice: profileReducer,
        loaderDashboard: loaderDashboardReducer,
        attendance: attendanceReducer,
        lowStockSlice: lowStockReducer,
        rejectReason: rejectReasonReducer,
    },
})

// Types for dispatch and root state
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
