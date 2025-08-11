import { Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NotFound from '../views/Register';
import ErrorBoundary from '../components/ErrorBoundary';
import PrivateRoute from './PrivateRoute';
import { Spinner } from '@components/Spinner';
import Area from '@view/location-masters/area';
import DeliveryPartners from '@view/restaurant-masters/delivery-partners';
import Restaurants from '@view/restaurant-masters/restaurants';
import CodesHdr from '@view/meta -data-masters/codes-headers';
import CodesDtl from '@view/meta -data-masters/codes-details';
import Address from '@view/location-masters/address';
import PartnerFoodSku from '@view/restaurant-masters/partner-food-name';
import RestaurantFoodSku from '@view/restaurant-masters/restaurans-food-items';
import RemoteLocationOnboarding from '@view/Q-box-master/remote-location-onboarding';
import QboxOrder from '@view/qbox-admin/qbox-order';
import EntityDashboard from '@view/qbox-admin/entity-dashboard';
import QboxCell from '@view/supply-chain/qBox-cell';
import InfraConfig from '@view/qbox-admin/infra-config';
import FoodSkuTracking from '@view/supply-chain/food-sku-traking';
import { ToastContainer } from 'react-toastify';
import Dashboard from '@view/location-masters/dashboard';
import ReportPage from '@view/reports/report';
import EtlJob from '@view/etl-masters/etl-job';
import EtleTableColumn from '@view/etl-masters/etl-table-column';
import OrderEtl from '@view/etl-masters/order-etl-hdr';
import PurchaseOrder from '@view/location-masters/orders';
import DeliveryPartnerDashboard from '@view/delivery-partner-dashboard';
import EntityDetails from '@view/qbox-admin/entity-details';
import InwardOrders from '@view/supply-chain/inward-orders';
import AggregatedDashboard from '@view/aggregated-dashboard';
import PurchaseReport from '@view/reports/purchase-report';
import SalesReport from '@view/reports/sales-report';
import SignUpPage from '@view/signup';
import { OTPVerification } from '@view/otp-verification';
import { PasswordPage } from '@view/password-page';
import ForgotPassword from '@view/forgot-password';
import { useAuth } from '@hooks/useAuth';
import ModuleMenuMapping from '@view/mapping/module-menu-mapping';
import RolePermissionMapping from '@view/mapping/role-permission-mapping';
import SuperAdminDashboard from '@view/dashboard/super-admin-dashboard';
import { getFromLocalStorage } from '@utils/storage';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@state/store';
import AddUserDetails from '@view/add-user/Add-User-details';
import AddUserPage from '@view/add-user/Add-User';
import DeliveryAggregatorHub from '@view/restaurant-masters/deliver-aggregate-hub';
import InfraMastersHub from '@view/qbox-admin/infra-master-hub';
import CCTVViewer from '@view/dashboard/cctv-viewer';
import BoxCell from '@view/qbox-admin/box-cell';
import AggregatorAdminDashboard from '@view/dashboard/aggregator-admin-dashboard';
import { LoginTrail } from '@view/LoginTrail';
import { LoginTrail2 } from '@view/LoginTrail2';
import Profile from '@view/profile/Profile';
import DailyStockReport from '@view/reports/daily-stock-report';
import DailyGoodsReturnReport from '@view/reports/daily-goods-returned-report';
import TopSelling from '@view/TopSelling';
import ConsolidatedDashboard from '@view/dashboard/consolidated-data-dashboard';
import OutwardOrders from '@view/supply-chain/outward-orders';
import PurchaseOrderFileExport from '@view/supply-chain/purchase-order';
import DashboardPage from '@view/Loader/Dashboard/screens/dashboard_header';
import InventoryPage from '@view/Loader/Inventory/screens/inventory_header';
import OrderPage from '@view/Loader/Orders/order_header';
import QueueBoxPage from '@view/Loader/QueueBoxes/screens/queuebox_header';
import ThemeSwitcher from '@view/Loader/Theme Settings/theme_switcher';
import { ThemeProvider } from '@view/Loader/Theme Settings/theme_provider';
import '../styles.css';
import DashboardRejectSku from '@view/Loader/Dashboard/screens/reject-sku';
import DashboardActiveOrders from '@view/Loader/Dashboard/screens/active-orders';
import Loaders from '@view/Loader/Dashboard/screens/loader';
import LowStockDtl from '@view/Loader/Inventory/low-stock';
import OrderDetails from '@view/Loader/Orders/order-details';
import DamagedSku from '@view/Loader/Inventory/screens/damaged_sku';
import OrderCardsView from '@view/Loader/Orders/order_cards_view';
import OrderedSkuDtl from '@view/Loader/Orders/ordered-sku-dtl';
import FoodTracking from '@view/Loader/Orders/food-tracking';
import LoaderDashboard from '@view/dashboard/loader-dashboard';
import SupervisorDashboard from '@view/dashboard/supervisor-dashboard';
import LoaderAttendance from '@view/add-user/attendance';
import QboxDashboard from '@view/dashboard/qbox-location-dashboard';
import SKUSalesDashboard from '@view/dashboard/top-selling-sku';
import SkuLoadedInQueBox from '@view/Loader/Dashboard/screens/sku_loaded_in_quebox';
import EntityInfraDtls from '@view/Loader/Dashboard/screens/entity_infra_details';
import LowStockMaster from '@view/Q-box-master/low-stock-masters';
import LoginPage from '@view/Login';
import HomeScreen from '@view/home';
import OrderManagement from '@view/supply-chain/order-management';
import EntityInfraDtl from '@view/dashboard/entity-infra-dtl';
import AssertDetails from '@view/dashboard/assert-details';
import CCTVViewerAssert from '@view/dashboard/cctv-view-assert';
import UserDetails from '@view/dashboard/user-detail';
import RejectReason from '@view/Q-box-master/reject-reason';
// const Layout = lazy(() => import('@view/layout'));

const RoutesConfig: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth(); // Access auth state
    const [roleId, setRoleId] = useState<any>(null);
    const [isHovered, setIsHovered] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [roleName, setRoleName]: any = useState(null);

    const getDashboardForRole = (roleName: string | null, isHovered: boolean) => {
        if (roleName === 'Admin' || roleName === 'Super Admin' || roleName === 'Aggregator Admin') {
            return <DashboardPage />;
        }
        return <SuperAdminDashboard isHovered={isHovered} />;
    };

    // Update the useEffect to get user role on mount
    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                const userData = getFromLocalStorage('user');
                console.log(JSON.stringify(userData?.loginDetails?.roleName))
                if (userData) {
                    setRoleName(userData?.loginDetails?.roleName);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            loadUserData();
        }
    }, [isAuthenticated]);


    return (
        <ThemeProvider>
            <div className="flex h-screen">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        <div className=''>
                            <Suspense fallback={<Spinner />}>
                                <ErrorBoundary>
                                    <Routes>
                                        {/* <Route path="/signin" element={<SignUpPage />} />
                                        <Route path="/OTPVerification" element={<OTPVerification />} />
                                        <Route path="/setPassword" element={<PasswordPage />} />
                                        <Route path="/forgotPassword" element={<ForgotPassword />} /> */}
                                        <Route path="/login" element={isAuthenticated ? <PrivateRoute isAuthenticated={isAuthenticated}
                                            isHovered={isHovered}
                                            setIsHovered={setIsHovered} /> : <LoginPage />} />
                                        {/* <Route path="/login1" element={isAuthenticated ? <PrivateRoute isAuthenticated={isAuthenticated}
                                            isHovered={isHovered}
                                            setIsHovered={setIsHovered} /> : <LoginTrail />} />
                                        <Route path="/login2" element={isAuthenticated ? <PrivateRoute isAuthenticated={isAuthenticated}
                                            isHovered={isHovered}
                                            setIsHovered={setIsHovered} /> : <LoginTrail2 />} /> */}
                                        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} isHovered={isHovered} setIsHovered={setIsHovered} />}>
                                            <Route
                                                path="/"
                                                element={
                                                    isLoading ? (
                                                        <Spinner />
                                                    ) : (
                                                        getDashboardForRole(roleName, isHovered)
                                                    )
                                                }
                                            />
                                            <Route path="/home" element={<HomeScreen />} />
                                            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard isHovered={isHovered} />} />
                                            <Route path="location-masters/address" element={<Address />} />
                                            <Route path="/profile" element={<Profile />} />
                                            <Route path="/reports/top-selling" element={<TopSelling isHovered={isHovered} />} />
                                            <Route path="/consolidated-dashboard" element={<ConsolidatedDashboard isHovered={isHovered} />} />
                                            <Route path="/reports/daily-stock-report" element={<DailyStockReport isHovered={isHovered} />} />
                                            <Route path="/reports/daily-goods-returned-report" element={<DailyGoodsReturnReport isHovered={isHovered} />} />

                                            <Route path="/master-settings/area" element={<Area isHovered={isHovered} />} />
                                            <Route path="/master-settings/delivery-aggregators" element={<DeliveryPartners />} />
                                            <Route path="/master-settings/restaurants" element={<Restaurants />} />
                                            <Route path="/master-settings/partner-food-name" element={<PartnerFoodSku />} />
                                            <Route path="/master-settings/restaurant-food-items" element={<RestaurantFoodSku />} />
                                            {/* <Route path="/master-settings/delivery-aggregators" element={<DeliveryPartners isHovered={isHovered} />} />
                                            <Route path="/master-settings/restaurants" element={<Restaurants isHovered={isHovered} />} />
                                            <Route path="/master-settings/partner-food-name" element={<PartnerFoodSku isHovered={isHovered} />} />
                                            <Route path="/master-settings/restaurant-food-items" element={<RestaurantFoodSku isHovered={isHovered} />} /> */}

                                            <Route path="/system-settings/codes-headers" element={<CodesHdr isHovered={isHovered} />} />
                                            <Route path="/system-settings/codes-details" element={<CodesDtl isHovered={isHovered} />} />
                                            <Route path="/entity-dashboard/infra-config" element={<InfraConfig isHovered={isHovered} />} />
                                            <Route path="/Q-box-master/remote-location-onboarding" element={<RemoteLocationOnboarding />} />
                                            <Route path="/qbox-admin/qbox-order" element={<QboxOrder />} />
                                            <Route path="/master-settings/entity-dashboard" element={<EntityDashboard isHovered={isHovered} />} />
                                            <Route path="/supply-chain/qBox-cell" element={<QboxCell isHovered={isHovered} />} />
                                            <Route path="/supply-chain/inward-orders" element={<InwardOrders qboxEntitySno={undefined} partnerPurchaseOrderId={undefined} transactionDate={undefined} inwardOrderDetailList={undefined} deliveryPartnerSno={undefined} />} />
                                            <Route path="/supply-chain/outward-orders" element={<OutwardOrders qboxEntitySno={undefined} setActiveTab={undefined} orderedTime={undefined} />} />
                                            <Route path="/supply-chain/food-sku-traking" element={<FoodSkuTracking skuInventorySno={undefined} />} />
                                            <Route path="/location-masters/dashboard" element={<Dashboard />} />
                                            <Route path="/qbox-admin/purchase-order" element={<PurchaseOrder isHovered={isHovered} />} />
                                            <Route path="/reports/report" element={<ReportPage />} />
                                            <Route path="/system-settings/etl-job" element={<EtlJob isHovered={isHovered} />} />
                                            <Route path="/system-settings/etl-table-column" element={<EtleTableColumn isHovered={isHovered} />} />
                                            <Route path="/system-settings/order-etl-hdr" element={<OrderEtl isHovered={isHovered} />} />
                                            <Route path="/delivery-partner-dashboard" element={<DeliveryPartnerDashboard />} />
                                            <Route path="/entities/:entityId" element={<EntityDetails />} />
                                            <Route path="/aggregator-dashboard" element={<AggregatedDashboard isHovered={isHovered} />} />
                                            <Route path="/reports/purchase-report" element={<PurchaseReport isHovered={isHovered} />} />
                                            <Route path="/reports/sales-report" element={<SalesReport isHovered={isHovered} />} />
                                            <Route path="/mapping/module-menu-mapping" element={<ModuleMenuMapping />} />
                                            <Route path="/mapping/module-menu-mapping" element={<ModuleMenuMapping />} />
                                            <Route path="/mapping/role-permission-mapping" element={<RolePermissionMapping isHovered={isHovered} />} />
                                            <Route path="/qbox-location-dashboard" element={<QboxDashboard isHovered={isHovered} />} />
                                            <Route path="/aggregator-admin-dashboard" element={<AggregatorAdminDashboard isHovered={isHovered} />} />
                                            <Route path="/add-user/addUser" element={<AddUserDetails isHovered={isHovered} />} />
                                            <Route path="/add-user/addUserPage" element={<AddUserPage userData={isHovered} />} />
                                            <Route path="/master-settings/deliver-aggregate-hub" element={<DeliveryAggregatorHub isHovered={isHovered} />} />
                                            <Route path="/restaurant-masters/deliver-aggregate-hub" element={<InfraMastersHub isHovered={isHovered} />} />
                                            <Route path="/super-admin-dashboard/cctv-viewer" element={<CCTVViewer />} />
                                            <Route path="/qbox-admin/box-cell" element={<BoxCell isHovered={isHovered} />} />
                                            <Route path="/supply-chain/purchase-order" element={<PurchaseOrderFileExport isHovered={isHovered} />} />
                                            <Route path="/loader-dashboard" element={<LoaderDashboard isHovered={isHovered} />} />
                                            <Route path="/supervisor-dashboard" element={<SupervisorDashboard isHovered={isHovered} />} />
                                            <Route path="/attendance" element={<LoaderAttendance />} handle={{ breadcrumb: "Supervisor Dashboard" }} />

                                            <Route path="/master-settings/entity-dashboard/remote-location-onboarding" element={<RemoteLocationOnboarding />} />
                                            <Route path="/master-settings/entity-dashboard/infra-config" element={<InfraConfig isHovered={isHovered} />} />
                                            <Route path="/purchase-order-management" element={<OrderManagement isHovered={isHovered} />} />
                                            {/* Loader Admin New Routes*/}
                                            <Route path="/dashboard" element={<DashboardPage />} />
                                            <Route path="/inventory" element={<InventoryPage />} />
                                            <Route path="/top-selling-sku" element={<SKUSalesDashboard />} />
                                            <Route path="/orders" element={<OrderPage />} />
                                            <Route path="/qeubox" element={<QueueBoxPage />} />
                                            <Route path="/inventory/active-orders" element={<DashboardActiveOrders isHovered={isHovered} />} />
                                            <Route path="/dashboard/loader" element={<Loaders isHovered={isHovered} />} />
                                            <Route path="/dashboard/reject-sku" element={<DashboardRejectSku isHovered={isHovered} />} />
                                            <Route path="/inventory/low-stock" element={<LowStockDtl isHovered={isHovered} />} />
                                            <Route path="/orders/order-details" element={<OrderDetails isHovered={isHovered} />} />
                                            <Route path="/dashboard/damaged-sku" element={<DamagedSku isHovered={isHovered} />} />
                                            <Route path="/orders/order-cards-view" element={<OrderCardsView isHovered={isHovered} />} />
                                            <Route path="/orders/order-cards-view/ordered-sku-dtl" element={<OrderedSkuDtl isHovered={isHovered} />} />
                                            <Route path="/orders/order-cards-view/ordered-sku-dtl/food-tracking" element={<FoodTracking skuInventorySno={undefined} />} />
                                            <Route path="/inventory/active-orders/qbox-location-dashboard" element={<QboxDashboard isHovered={isHovered} />} />
                                            <Route path="/inventory/sku-loaded-in-qeubox/qbox-location-dashboard" element={<QboxDashboard isHovered={isHovered} />} />
                                            <Route path="/inventory/sku-loaded-in-qeubox" element={<SkuLoadedInQueBox isHovered={isHovered} />} />
                                            <Route path="/inventory/entity-infra-details" element={<EntityInfraDtls isHovered={isHovered} />} />
                                            <Route path="/inventory/low-stock/purchase-order" element={<PurchaseOrderFileExport isHovered={isHovered} />} />
                                            <Route path="/dashboard/inventory" element={<InventoryPage />} />
                                            <Route path="/dashboard/orders" element={<OrderPage />} />
                                            <Route path="/low-stock-masters" element={<LowStockMaster isHovered={isHovered} />} />


                                            <Route path="/inventory/sku-loaded-in-qeubox/supervisor-dashboard" element={<QboxDashboard isHovered={isHovered} />} />
                                            <Route path="/inventory/active-orders/supervisor-dashboard" element={<QboxDashboard isHovered={isHovered} />} />

                                            <Route path="/assert-detail" element={<AssertDetails isHovered={isHovered} />} />
                                            <Route path="/assert-detail/cctv-viewer-assert" element={<CCTVViewerAssert />} />
                                            <Route path="/user-detail" element={<UserDetails qboxEntitySno={undefined} />} />

                                            <Route path="/dashboard/aggregator-admin-dashboard" element={<AggregatorAdminDashboard isHovered={isHovered} />} />
                                            <Route path="/dashboard/qbox-location-dashboard" element={<QboxDashboard isHovered={isHovered} />} />

                                            <Route path="/super-admin-dashboard/supervisor-dashboard" element={<SupervisorDashboard isHovered={isHovered} />} />
                                            <Route path="/super-admin-dashboard/loader-dashboard" element={<LoaderDashboard isHovered={isHovered} />} />
                                            <Route path="/master-settings/reject-reason" element={<RejectReason isHovered={isHovered} />} />
                                            <Route path="/qbox-location-dashboard/cctv-viewer" element={<CCTVViewer />} />

                                        </Route>
                                        {/* Wildcard route for 404 */}
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                                </ErrorBoundary>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default RoutesConfig;