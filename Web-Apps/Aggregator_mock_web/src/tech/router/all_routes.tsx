export const all_routes = {
  // dashboard routes
  qboxDashboard: "/",
  remoteLocationPerformance: "/dashboard/remote-location-performance",
  skuMovement: "/dashboard/sku-movement",


  //Supply Chain

  inwardOrder:"/supply-chain/inward-order",
  inwardOrderDetails:"/supply-chain/inward-order-details",
  outwardOrder:"/supply-chain/outward-order",
  outwardOrderDetails:"/supply-chain/outward-order-details",
  inventoryWorkFlow:"/supply-chain/inventory-workflow",
  qboxInventory:"/supply-chain/qbox-inventory",
  warehouseInventory:"/warehouse-chain/qbox-inventory",
  skuTracking: "/supply-chain/sku-tracking",
  qboxCell: "/supply-chain/qbox-cell",	
  tracking: "/supply-chain/tracking",
  timeline: "/supply-chain/purchase-order/Timeline",
  qrcode: "/supply-chain/qr generator/qr-genarator",

// Admin Management

  appRoles: "/user-management/app-roles",
  manageUsers: "/user-management/manage-users",
  appMenus: "/user-management/app-menus",
  permissions: "/user-management/permissions",



 // Masters
 // Location Masters
 pages: "/content/pages",
 cities: "/masters/location/cities",
 states: "/masters/location/states",
 countries: "/masters/location/countries",
 areas:"/masters/location/areas",

// Restaurant Masters
deliveryPartners: "/content/pages",
restaurantBrands: "/masters/restaurant/cities",
partnerFoodNames: "/masters/restaurant/partner-food-names",
restaurants: "/masters/restaurant/restaurants",
foodItems: "/masters/restaurant/food-items",
restaurantFoodItems:"/masters/restaurant/restaurant-food-items",

// QBOX  Masters
infraStructures : "/masters/qbox/infrastructure",
infraProperties : "/masters/qbox/infra-properties",

// Meta Data Masters
codesDetails: "/masters/meta-data/codes-details",
codesHeader: "/masters/meta-data/codes-headers",

// Qbox Admin

qboxRemoteLocation:"/qbox-admin/qbox-remote-location",
qboxCurrentStatus:"/qbox-admin/qbox-current-status",

entityInfra : "/qbox-admin/entity-infra",
entityInfraProperties : "/qbox-admin/entity-infra-properties",
qboxOrder:'/qbox-admin/box-order/all order',

// auth routes routes
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  twoStepVerification: "/two-step-verification",
  success: "/success",
  emailVerification: "/email-verification",
  lockScreen: "/lock-screen",
  resetPassword: "/reset-password",

  // pages routes
  error404: "/error-404",
  error500: "/error-500",
  underMaintenance: "/under-maintenance",

  // settings routes
  customFields: "/app-settings/custom-fields",
  invoiceSettings: "/app-settings/invoice-settings",
  printers: "/app-settings/printers",

  bankAccount: "/financial-settings/bank-ccount",
  currencies: "/financial-settings/currencies",
  paymentGateways: "/financial-settings/payment-gateways",
  taxRates: "/financial-settings/tax-rates",

  connectedApps: "/general-settings/connected-apps",
  notification: "/general-settings/notification",
  profile: "/general-settings/profile",
  security: "/general-settings/security",

  banIpAddrress: "/other-settings/ban-ip-address",
  storage: "/other-settings/storage",

  emailSettings: "/system-settings/storage",
  gdprCookies: "/system-settings/gdpr-cookies",
  smsGateways: "/system-settings/sms-gateways",

  appearance: "/website-settings/appearance",
  companySettings: "/website-settings/company-settings",
  language: "/website-settings/language",
  localization: "/website-settings/localization",
  preference: "/website-settings/preference",
  prefixes: "/website-settings/prefixes",
  languageWeb: "/website-settings/language-web",

  
};
