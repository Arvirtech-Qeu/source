import { all_routes } from "../../../router/all_routes";

const route = all_routes;
export const SidebarData = [
  //{
  //   label: "TRANSCTIONS",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Main",
  //   submenuItems: [
  //     // {
  //     //   label: "Dashboard",
  //     //   icon: "ti ti-layout-2",
  //     //   submenu: true,
  //     //   showSubRoute: false,

  //     //   submenuItems: [
  //     //     { label: "Q-BOX Dashboard", link: route.qboxDashboard },
  //     //     { label: "Remote Location Performance", link: route.remoteLocationPerformance },
  //     //     { label: "SKU Movement", link: route.skuMovement },
  //     //   ],
  //     // },
  //     {
  //       label: "Supply Chain",
  //       icon: "ti ti-brand-airtable",
  //       submenu: true,
  //       showSubRoute: false,
  //       submenuItems: [
  //         {
  //           label: "Inward Order",
  //           link: route.inwardOrder,
  //           showSubRoute: false,
  //         },
  //         // {
  //         //   label: "Inward Order Details",
  //         //   link: route.inwardOrderDetails,
  //         //   showSubRoute: false,
  //         // },
  //         {
  //           label: "Outward Order",
  //           link: route.outwardOrder,
  //           showSubRoute: false,
  //         },
  //         // {
  //         //   label: "Outward Order Details",
  //         //   link: route.outwardOrderDetails,
  //         //   showSubRoute: false,
  //         // },
  //         // {
  //         //   label: "Q-Box Inventory",
  //         //   link: route.qboxInventory,
  //         //   showSubRoute: false,
  //         // },
  //         // {
  //         //   label: "SKU Tracking",
  //         //   link: route.skuTracking,
  //         //   showSubRoute: false,
  //         // },
  //         {
  //           label: "Qbox Cell",
  //           link: route.qboxCell,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Food SKU Tracking",
  //           link: route.tracking,
  //           showSubRoute: false,
  //         },
  //         // {
  //         //   label: "Food QR",
  //         //   link: route.qrcode,
  //         //   showSubRoute: false,
  //         // },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "ADMIN MANAGEMENT",
  //   submenuOpen: true,
  //   submenuHdr: "Admin",
  //   submenu: true,
  //   showSubRoute: false,
  //   submenuItems: [
  //     // {
  //     //   label: "User Management",
  //     //   submenuOpen: true,
  //     //   submenuHdr: "Admin",
  //     //   icon: "ti ti-file-invoice",
  //     //   submenu: true,
  //     //   showSubRoute: false,
  //     //   submenuItems: [
  //     //     {
  //     //       label: "Manage Users",
  //     //       link: route.manageUsers,
  //     //       icon: "ti ti-file-invoice",
  //     //       showSubRoute: false,
  //     //       submenu: false,
  //     //     },
  //     //     {
  //     //       label: "App Menus",
  //     //       link: route.appMenus,
  //     //       icon: "ti ti-navigation-cog",
  //     //       showSubRoute: false,
  //     //       submenu: false,
  //     //     },
  //     //     {
  //     //       label: "User Roles",
  //     //       link: route.appRoles,
  //     //       icon: "ti ti-navigation-cog",
  //     //       showSubRoute: false,
  //     //       submenu: false,
  //     //     },
  //     //     {
  //     //       label: "Permission",
  //     //       link: route.permissions,
  //     //       icon: "ti ti-navigation-cog",
  //     //       showSubRoute: false,
  //     //       submenu: false,
  //     //     }
  //     //   ],
  //     // }
  //   ]
  // },
  // {
  //   label: "MASTERS",
  //   submenuOpen: true,
  //   submenuHdr: "Masters",
  //   submenu: false,
  //   showSubRoute: false,
  //   submenuItems: [{
  //     label: "Location Masters",
  //     submenu: true,
  //     showSubRoute: false,
  //     icon: "ti ti-file-invoice",
  //     submenuItems: [
  //       {
  //         label: "Countries",
  //         link: route.countries,
  //         icon: "ti ti-file-invoice",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "States",
  //         link: route.states,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Cities",
  //         link: route.cities,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Areas",
  //         link: route.areas,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },]
  //   },
  //   {
  //     label: "Restaurant Masters",
  //     submenu: true,
  //     showSubRoute: false,
  //     icon: "ti ti-file-invoice",
  //     submenuItems: [
  //       {
  //         label: "Delivery Partners",
  //         link: route.deliveryPartners,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Restaurant Brands",
  //         link: route.restaurantBrands,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Restaurants",
  //         link: route.restaurants,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Food Items",
  //         link: route.foodItems,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Restaurant Food Items",
  //         link: route.restaurantFoodItems,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Partner Food Names",
  //         link: route.partnerFoodNames,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },]
  //   },
  //   {
  //     label: "Q-Box Masters",
  //     submenu: true,
  //     showSubRoute: false,
  //     icon: "ti ti-file-invoice",
  //     submenuItems: [
  //       {
  //         label: "Infrastructure",
  //         link: route.infraStructures,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Infra Properties",
  //         link: route.infraProperties,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },]
  //   },
  //   {
  //     label: "Meta Data Masters",
  //     submenu: true,
  //     showSubRoute: false,
  //     icon: "ti ti-file-invoice",
  //     submenuItems: [
  //       {
  //         label: "Codes Headers",
  //         link: route.codesHeader,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },
  //       {
  //         label: "Codes Details",
  //         link: route.codesDetails,
  //         icon: "ti ti-navigation-cog",
  //         showSubRoute: false,
  //         submenu: false,
  //       },]
  //   }
  //   ],
  // },
  // {
  //   label: "QBOX ADMIN",
  //   submenuOpen: true,
  //   submenuHdr: "Qbox Admin",
  //   submenu: false,
  //   showSubRoute: false,
  //   submenuItems: [
  //     {
  //       label: "Q-Box Remote Location",
  //       link: route.qboxRemoteLocation,
  //       icon: "ti ti-file-invoice",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Remote Location Infra",
  //       link: route.entityInfra,
  //       icon: "ti ti-file-invoice",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Infra Properties",
  //       link: route.entityInfraProperties,
  //       icon: "ti ti-file-invoice",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Q-Box Current Status",
  //       link: route.qboxCurrentStatus,
  //       icon: "ti ti-navigation-cog",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Q-Box Order",
  //       link: route.qboxOrder,
  //       icon: "ti ti-navigation-cog",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //   ],
  // },
  // {
  //   label: "REPORTS",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Finance & Accounts",
  //   submenuItems: [
  //     {
  //       label: "Reports",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-file-invoice",
  //       submenuItems: [],
  //     },
  //   ],
  // },
  {
    label: "Delhi Belly Order",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Help",
    submenuItems: [
      {
        label: " Order To Q-Box",
        link: route.inwardOrder,
        showSubRoute: false,
        icon: "ti ti-file-type-doc",
      },
      {

        label: " Customer Orders",
        link: route.outwardOrder,
        showSubRoute: false,

        icon: "ti ti-arrow-capsule",

      },
      // {
      //   label: "Qbox Cell",
      //   link: route.qboxCell,
      //   showSubRoute: false,
      //   icon: "ti ti-arrow-capsule",
      // },
      // {
      //   label: "Food SKU Tracking",
      //   link: route.tracking,
      //   showSubRoute: false,
      //   icon: "ti ti-arrow-capsule",
      // },
      // {
      //   label: "Outward Order Details",
      //   link: route.outwardOrderDetails,
      //   showSubRoute: false,
      // },
    ],
  },
  // {
  //   label: "Help",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Help",
  //   submenuItems: [
  //     {
  //       label: "Documentation",
  //       link: "#",
  //       icon: "ti ti-file-type-doc",
  //       showSubRoute: false,
  //     },
  //     {
  //       label: "Version : V1.0.0",
  //       link: "#",
  //       icon: "ti ti-arrow-capsule",
  //       showSubRoute: false,
  //     },
  //   ],
  // },
];
