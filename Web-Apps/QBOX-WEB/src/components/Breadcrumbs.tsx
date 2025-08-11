import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { getFromLocalStorage } from "@utils/storage";


export const breadcrumbNameMap: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/super-admin-dashboard": "Dashboard",
    "/location-masters/area": "Area Master",
    "/location-masters/address": "Address Master",
    "/profile": "Profile",
    "/reports/top-selling": "Top Selling Report",
    "/consolidated-dashboard": "Consolidated Dashboard",
    "/reports/daily-stock-report": "Daily Stock Report",
    "/reports/daily-goods-returned-report": "Goods Returned Report",
    "/meta-data-masters/codes-headers": "Code Headers",
    "/meta-data-masters/codes-details": "Code Details",
    "/entity-dashboard/infra-config": "Infra Configuration",
    "/Q-box-master/remote-location-onboarding": "Remote Onboarding",
    "/qbox-admin/qbox-order": "QBox Order",
    "/supply-chain/qBox-cell": "QBox Cell",
    "/supply-chain/inward-orders": "Inward Orders",
    "/supply-chain/outward-orders": "Outward Orders",
    "/supply-chain/food-sku-traking": "Food SKU Tracking",
    "/location-masters/dashboard": "Dashboard",
    "/qbox-admin/purchase-order": "Purchase Order",
    "/reports/report": "Reports",
    "/etl-masters/etl-job": "ETL Job",
    "/etl-masters/etl-table-column": "ETL Table Column",
    "/etl-masters/order-etl-hdr": "Order ETL Header",
    "/delivery-partner-dashboard": "Dashboard",
    "/entities/:entityId": "Entity Details",
    "/aggregator-dashboard": "Performance Dashboard",
    "/reports/purchase-report": "Purchase Report",
    "/reports/sales-report": "Sales Report",
    "/mapping/module-menu-mapping": "Module-Menu Mapping",
    "/mapping/role-permission-mapping": "Role-Permission Mapping",
    "/qbox-location-dashboard": "QeuBox Remote Location Details",
    "/aggregator-admin-dashboard": "Dashboard",
    "/add-user/addUser": "View User Details",
    "/add-user/addUserPage": "Add User",
    "/restaurant-masters/deliver-aggregate-hub": "Delivery Aggregate Hub",
    "/super-admin-dashboard/cctv-viewer": "CCTV Viewer",
    "/qbox-admin/box-cell": "Box Cell",
    "/supply-chain/purchase-order": "Purchase Order Export",
    "/loader-dashboard": "Dashboard",
    // "/supervisor-dashboard": "Dashboard",
    "/add-user/attendance": "Attendance",
    "/inventory": "Inventory",
    "/orders": "Orders",
    "/qeubox": "Queue Box",
    "/inventory/active-orders": "Active Orders",
    "/dashboard/loader": "Loader Details",
    "/dashboard/reject-sku": "Rejected SKU",
    "/inventory/low-stock": "Low Stock Details",
    "/orders/order-details": "Order Details",
    "/dashboard/damaged-sku": "Damaged SKU",
    "/orders/order-cards-view": "Order Cards View",
    "/orders/order-cards-view/ordered-sku-dtl": "Ordered SKU Details",
    "/orders/food-tracking": "Food Tracking",
    "/top-selling-sku": "Top Selling SKU",
    "/inventory/sku-loaded-in-qeubox": "Sku In Qeubox",
    "/master-settings/delivery-aggregators": "Delivery Aggregators",
    "/master-settings/restaurants": "Restaurants",
    "/master-settings/restaurant-food-items": "Restaurant Food Sku",
    "/master-settings/area": "Area",
    "/master-settings/partner-food-name": "Delivery Aggregator Food Sku",
    "/system-settings/codes-headers": "Codes Headers",
    "/system-settings/codes-details": "Codes Details",
    "/system-settings/etl-job": "ETL Job",
    "/system-settings/etl-table-column": "ETL Table Column",
    "/system-settings/order-etl-hdr": "Order ETL Header",
    "/master-settings/entity-dashboard": "View Delivert Store",
    "/master-settings/entity-dashboard/remote-location-onboarding": "Delivery Location Onboarding",
    "/master-settings/entity-dashboard/infra-config": "Assets Config",
    "/master-settings/deliver-aggregate-hub": "Delivery Aggregate Hub",
    "/purchase-order-management": "Purchse Order Management",
    "/dashboard/aggregator-admin-dashboard": "Delivery Location Details",
    "/assert-detail": "Assets Details",
    "/super-admin-dashboard/supervisor-dashboard": "Delivery Location Details",
    "/super-admin-dashboard/loader-dashboard": "Delivery Location Details",
    "/assert-detail/cctv-viewer-assert": "CCTV",
    "/dashboard/qbox-location-dashboard": "Delivery Location Details",
    "/inventory/entity-infra-details": "Assert Details",
    "/user-detail": "User Details",
    "/qbox-location-dashboard/cctv-viewer": "CCTV Viewer",

};


export default function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter(Boolean);
    const [error, setError] = useState<any>({})
    const [roleId, setRoleId]: any = useState(null);
    const [roleName, setRoleName]: any = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    let pathSoFar = "";

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const storedData = getFromLocalStorage('user');

                if (!storedData) {
                    throw new Error('No user data found');
                }
                const { roleId, loginDetails } = storedData;
                if (!roleId) {
                    throw new Error('Role ID is missing');
                }
                // Set the state values and trigger API call immediately
                if (loginDetails) {
                    setRoleId(loginDetails.roleId || null);
                    setRoleName(loginDetails.roleName || null);
                }

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    return (
        <nav className="px-4 py-2 rounded text-sm font-medium text-gray-700 bg-white">
            <ol className="flex items-center space-x-1">
                <li className="flex items-center space-x-1">
                    {/* <Link to="/home" className="text-color hover:underline">Home</Link> */}
                    <li className="flex items-center space-x-1">
                        {roleName === 'Super Admin' || roleName === 'Admin' || roleName === 'Aggregator Admin' ? (
                            <Link to="/home" className="text-color hover:underline">Home</Link>
                        ) : roleName === 'Loader' || roleName === 'Supervisor' ? (
                            <Link to="/super-admin-dashboard" className="text-color hover:underline"></Link>
                        ) : null}
                    </li>

                </li>
                {pathnames.map((part, index) => {
                    pathSoFar += `/${part}`;
                    const label = breadcrumbNameMap[pathSoFar];
                    const isLast = index === pathnames.length - 1;

                    // console.log("Path So Far:", pathSoFar);
                    // console.log("Label:", label);
                    return (
                        (pathSoFar !== "/home") && (
                            <li key={pathSoFar} className="flex items-center space-x-1">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                {/* {label ? (
                                    isLast ? (
                                        <span className="text-gray-500">{label}</span>
                                    ) : (
                                        <Link to={pathSoFar} className="text- hover:underline">
                                            {label}
                                        </Link>
                                    )
                                ) : (
                                    <span className="text-gray-400 capitalize">{part}</span> // unknown, non-navigable
                                )} */}
                                {label ? (
                                    isLast || pathSoFar === "/assert-detail" || pathSoFar === "/qbox-location-dashboard" ? (
                                        <span className="text-gray-500">{label}</span>
                                    ) : (
                                        <Link to={pathSoFar} className="text-color hover:underline">
                                            {label}
                                        </Link>
                                    )
                                ) : (
                                    <span className="text-gray-400 capitalize">{part}</span>
                                )}

                            </li>
                        )
                    );
                })}
            </ol>
        </nav>
    );
}


