import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@/hooks/useTheme';
import storage from '@/utils/storage';
import { LoginPage } from './pages/login';
import RolePermissions from './module/role-permission/role-permission';
import TableView from './module/database-tables/tableview';
import RecordActions from './module/database-tables/record-actions';
import Modules from './module/modules/modules';
import PermissionService from './module/permission-service/permission-service';
// import MenuPermissions from './module/menu-permissions/menu-permissions';
import ModuleMenu from './module/module-menu/module-menu';
import AuthStatus from './module/auth-status/auth-status';
import ServiceApi from './module/service-api/service-api';
import Menu from './module/menu/menu';
import MenuActions from './module/menu/menuaction';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import MenuPermissions from './module/menu/menupermission';
import Permissions from './module/permissions/permissions';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import RoleMappingComponent from './module/mapping/role-permission-mapping';
import RolePermissionMapping from './module/mapping/role-permission-mapping';
import ModuleMenuMapping from './module/mapping/module-menu-mapping';
import Dashboard from './module/dashboard/dashboard';
import { SignUpPage } from './pages/signup';
import { OTPVerification } from './pages/otp-verification';
import { PasswordPage } from './pages/password-page';
import ForgotPassword from './pages/forgot-password';

// Lazy-load components
const Layout = lazy(() => import('@/pages/layout'));
const Role = lazy(() => import('./module/role/role'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  console.log(isAuthenticated)

  useEffect(() => {
    // Simulate an async authentication check
    const checkAuthentication = async () => {
      try {
        const authStatus = storage.isAuthenticated();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (

    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading components...</div>}>
            <Routes>
              <Route path="/signin" element={<SignUpPage />} />
              <Route path="/OTPVerification" element={<OTPVerification />} />
              <Route path="/setPassword" element={<PasswordPage />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />} >
                <Route path="/layout" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />} />
                <Route path="/roles" element={isAuthenticated ? <Role /> : <Navigate to="/login" replace />} />
                <Route path="/role-permissions" element={isAuthenticated ? <RolePermissions /> : <Navigate to="/login" replace />} />
                <Route path="/database/tables" element={<TableView />} />
                <Route path="/database/actions" element={<RecordActions />} />
                <Route path="/modules" element={<Modules />} />
                <Route path="/permissions" element={<Permissions />} />
                <Route path="/permission-service" element={<PermissionService />} />
                {/* <Route path="/menu-permissions" element= {<MenuPermissions />} />  */}
                <Route path="/module-menu" element={<ModuleMenu />} />
                <Route path="/auth-status" element={<AuthStatus />} />
                <Route path="/service-api" element={<ServiceApi />} />
                <Route path="/menu/menu-list" element={<Menu />} />
                <Route path="/menu/menu-permission" element={<MenuPermissions />} />
                <Route path="/menu/menu-action" element={<MenuActions />} />
                <Route path="/mapping/role-permission-mapping" element={<RolePermissionMapping />} />
                <Route path="/mapping/module-menu-mapping" element={<ModuleMenuMapping />} />
                <Route path="/dashboard" element={<Dashboard />} />


                {/* <Route path="/database/tables" element={isAuthenticated ? <DatabaseTable /> : <Navigate to="/login" replace />} />
            <Route path="/database/actions" element={isAuthenticated ? <DatabaseActions /> : <Navigate to="/login" replace />} /> */}
              </Route>
              <Route path="/login" element={isAuthenticated ? <Layout /> : <LoginPage />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
