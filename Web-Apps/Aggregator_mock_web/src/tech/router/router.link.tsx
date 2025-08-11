import { Route } from "react-router";
import { all_routes } from "./all_routes";
 
 
import Ribbon from "antd/es/badge/Ribbon";

import AppMenus from "../../shared/user-management/appMenus";

import Permissions from "../../shared/user-management/permissions";

import AppRoles from "../../shared/user-management/appRoles";

import Login from "../../shared/authentication/login";
import Register from "../../shared/authentication/register";
import TwoStepVerification from "../../shared/authentication/twoStepVerification";
import EmailVerification from "../../shared/authentication/emailVerification";
import Success from "../../shared/authentication/success";
import ResetPassword from "../../shared/authentication/resetPassword";
import ForgotPassword from "../../shared/authentication/forgotPassword";

import ManageUsers from "../../shared/user-management/manageUsers";
 
import Error404 from "../exception-pages/error/error-404";
import Error500 from "../exception-pages/error/error-500";
import UnderMaintenance from "../exception-pages/underMaintenance";
 

import QboxDashboard from "../../domain/transactions/dashboard/qboxDashboard";
import RemoteLocationPerformance from "../../domain/transactions/dashboard/remoteLocationPerformance";
import SkuMovement from "../../domain/transactions/dashboard/skuMovement";
import Cities from "../../shared/masters/location/city/city-main";
import Countries from "../../shared/masters/location/country/country-main";
import States from "../../shared/masters/location/state/state-main";
import Areas from "../../shared/masters/location/area/area-main";
import CodesHdrs from "../../shared/masters/meta-data/codes-hdr/codes-hdr-main";
import CodesDtls from "../../shared/masters/meta-data/codes-dtl/codes-dtl-main";
import PartnerFoodSkus from "../../domain/masters/restaurant/partner-food-sku/partner-food-sku-main";
import FoodSkus from "../../domain/masters/restaurant/food-sku/food-sku-main";
import DeliveryPartners from "../../domain/masters/restaurant/delivery-partner/delivery-partner-main";
import RestaurantFoodSkus from "../../domain/masters/restaurant/restaurant-food-sku/restaurant-food-sku-main";
import Restaurants from "../../domain/masters/restaurant/restaurant/restaurant-main";
import Infras from "../../domain/masters/qbox/infra/infra-main";
import InfraProperties from "../../domain/masters/qbox/infra-property/infra-property-main";
import QboxEntities from "../../domain/qbox-admin/qbox-entity/qbox-entity-main";
import EntityInfras from "../../domain/qbox-admin/entity-infra/entity-infra-main";
import EntityInfraProperties from "../../domain/qbox-admin/entity-infra-property/entity-infra-property-main";
import PurchaseOrders from "../../domain/transactions/supply-chain/purchase-order/purchase-order-main";
import PurchaseOrderDtls from "../../domain/transactions/supply-chain/purchase-order-dtl/purchase-order-dtl-main";
import SalesOrders from "../../domain/transactions/supply-chain/sales-order/sales-order-main";
import SkuInventories from "../../domain/transactions/supply-chain/sku-inventory/sku-inventory-main";
import SkuTraceWfs from "../../domain/transactions/supply-chain/sku-trace-wf/sku-trace-wf-main";
import QBoxOrder from "../../domain/qbox-admin/box-order/all order";
import OrderDetails from "../../domain/transactions/supply-chain/qbox-cell.main";
import TrackingOrder from "../../domain/transactions/supply-chain/tracking/tracking-main";
import Timeline from "../../domain/transactions/supply-chain/purchase-order/Timeline";
import QRCreater from "../../domain/transactions/supply-chain/qr generator/qr-genarator";
import SalesOrderDtls from "../../domain/transactions/supply-chain/sales-order-dtl/sales-order-dtl-main";



const route = all_routes;

export const publicRoutes = [  
  {
    path: route.manageUsers,
    element: <ManageUsers />,
  },
  {
    path: route.appMenus,
    element: <AppMenus />,
  },
  {
    path: route.permissions,
    element: <Permissions />,
  },
 
  {
    path: route.countries,
    element: <Countries />,
    route: Route,
  },    
  {
    path: route.cities,
    element: <Cities />,
    route: Route,
  },  
  {
    path: route.appRoles,
    element: <AppRoles />,
    route: Route,
  }, 
  {
    path: route.states,
    element: <States />,
    route: Route,
  },  
  {
    path: route.areas,
    element: <Areas />,
    route: Route,
  },
  {
    path: route.codesHeader,
    element: <CodesHdrs />,
    route: Route,
  },  
  {
    path: route.codesDetails,
    element: <CodesDtls />,
    route: Route,
  },    
  {
    path: route.partnerFoodNames,
    element: <PartnerFoodSkus />,
    route: Route,
  },  
  {
    path: route.foodItems,
    element: <FoodSkus />,
    route: Route,
  }, 
  {
    path: route.deliveryPartners,
    element: <DeliveryPartners />,
    route: Route,
  },  
  {
    path: route.restaurantFoodItems,
    element: <RestaurantFoodSkus />,
    route: Route,
  },  
  {
    path: route.restaurants,
    element: <Restaurants />,
    route: Route,
  },
  {
    path: route.infraStructures,
    element: <Infras />,
    route: Route,
  },  
  {
    path: route.infraProperties,
    element: <InfraProperties />,
    route: Route,
  },
  {
    path: route.qboxDashboard,
    element: <QboxDashboard />,
    route: Route,
  },
  {
    path: route.remoteLocationPerformance,
    element: <RemoteLocationPerformance />,
    route: Route,
  },
  {
    path: route.skuMovement,
    element: <SkuMovement />,
    route: Route,
  },

  {
    path: route.inwardOrder,
    element: <PurchaseOrders />,
    route: Route,
  },  
  {
    path: route.inwardOrderDetails,
    element: <PurchaseOrderDtls />,
    route: Route,
  },  
  {
    path: route.outwardOrder,
    element: <SalesOrders />,
    route: Route,
  },
  {
    path: route.outwardOrderDetails,
    element: <SalesOrderDtls />,
    route: Route,
  },
  {
    path: route.inventoryWorkFlow,
    element: <SkuTraceWfs />,
    route: Route,
  },
  {
    path: route.qboxInventory,
    element: <SkuInventories />,
    route: Route,
  },
  {
    path: route.skuTracking,
    element: <SkuTraceWfs />,
    route: Route,
  }, 
  {
    path: route.qboxRemoteLocation,
    element: <QboxEntities />,
    route: Route,
  },
  {
    path: route.entityInfra,
    element: <EntityInfras />,
    route: Route,
  },  
  {
    path: route.entityInfraProperties,
    element: <EntityInfraProperties />,
    route: Route,
  },
  {
    path: route.qboxOrder,
    element: <QBoxOrder />, 
    route: Route,
  },
  {
    path: route.qboxCell,
    element: <OrderDetails />,
    route: Route,
  },
  {
    path: route.tracking,
    element: <TrackingOrder />,
    route: Route,
  },
  {
    path: route.timeline,
    element: <Timeline />,
    route: Route,
  },
  {
    path: route.qrcode,
    element: <QRCreater />,
    route: Route,
  },
];

export const authRoutes = [
  
  {
    path: route.login,
    element: <Login />,
    route: Route,
  },
  {
    path: route.register,
    element: <Register />,
    route: Route,
  },
  {
    path: route.twoStepVerification,
    element: <TwoStepVerification />,
    route: Route,
  },
  {
    path: route.success,
    element: <Success />,
    route: Route,
  },
  {
    path: route.register,
    element: <Register />,
    route: Route,
  },
  {
    path: route.resetPassword,
    element: <ResetPassword />,
    route: Route,
  },
  {
    path: route.forgotPassword,
    element: <ForgotPassword />,
    route: Route,
  },
  {
    path: route.error404,
    element: <Error404 />,
    route: Route,
  },
  {
    path: route.error500,
    element: <Error500 />,
    route: Route,
  },
  {
    path: route.underMaintenance,
    element: <UnderMaintenance />,
    route: Route,
  },

];
