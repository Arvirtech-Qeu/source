import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import SidebarMenu from '@containers/SideBar';
import ElegantHeader from '@containers/Header';

interface PrivateRouteProps {
    isAuthenticated: boolean;
    isHovered: boolean;
    setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, isHovered, setIsHovered }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        console.log('isAuthenticated Routers:', isAuthenticated);
    }, [isAuthenticated]);

    return (
        <div className="flex h-screen">
            <SidebarMenu />
            <div className="flex-1 flex flex-col overflow-hidden">
                <ElegantHeader paths={[]} isHovered={isHovered} />
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default PrivateRoute;
