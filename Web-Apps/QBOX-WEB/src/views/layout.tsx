import ElegantHeader from "@containers/Header";
import SidebarMenu from "@containers/SideBar";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }: any) => {

  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to dashboard if logged in and on the root path
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarMenu />
      <div className="flex-1 flex flex-col">
        <ElegantHeader paths={[]} />
        {/* <main className={`flex-1 ${!() ? 'p-6' : ''} overflow-auto`}> */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default Layout;