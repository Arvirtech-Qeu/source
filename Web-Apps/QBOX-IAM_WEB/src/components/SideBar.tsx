import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import {
    Menu, ChevronLeft, ChevronRight, Database, Table, Layers,
    Settings, Shield, Key, Users, Lock, FileCode,
    LogOut, User, ChevronDown, Bell, Search, Sun, Link, LayoutDashboard
} from 'lucide-react';
import { mockUser } from "@/pages/layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Root } from "react-dom/client";
import { RootState } from "@/redux/store";
import { setSelectedItem } from "@/redux/features/sideBarSlice";
import { getAllServiceApi } from "@/redux/features/serviceApiSlice";

export const Sidebar = () => {

    const totalServiceApiCount = useSelector((state: RootState) => state.serviceApiSlice.totalServiceApiCount);
    const { selectedItem } = useSelector((state: RootState) => state.sideBarApi);
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(true);
    // const [selectedItem, setSelectedItem] = useState(null);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const { theme } = useTheme();
    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state;  // This will give you the state passed with navigate

    // You can now access the 'title' from the state
    const currentTitle = state?.title;

    const handleNavigate = (path: any) => {
        if (path) {
            navigate(path);
        }
    };

    useEffect(() => {
        // Dispatch the getAllServiceApi action once the app is authenticated
        dispatch(getAllServiceApi({})); // You can pass parameters if needed
    }, [])

    const menuItems = [
        { id: 13, title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        // { id: 1, title: 'Database Tables', icon: Database, submenu: [{ title: 'Table View', path: '/database/tables' }, { title: 'Record Actions', path: '/database/actions' }] },
        // { id: 2, title: 'Modules', icon: Layers, path: '/modules', badge: 'New' },
        {
            id: 3, title: 'Menu Management', icon: Menu, submenu: [{ title: 'Menu', path: '/menu/menu-list' },
                // { title: 'Menu Permission', path: '/menu/menu-permission' },
                // { title: 'Menu Action', path: '/menu/menu-action' }
            ]
        },
        { id: 4, title: 'Permissions', icon: Shield, path: '/permissions' },
        // { id: 5, title: 'Service API', icon: Settings, path: '/service-api', badge: totalServiceApiCount ? totalServiceApiCount.toString() : '0' },
        // { id: 6, title: 'Permission Service', icon: Key, path: '/permission-service' },
        // { id: 7, title: 'Menu Permissions', icon: Lock, path: '/menu-permissions' },
        { id: 8, title: 'Roles', icon: Users, path: '/roles' },
        { id: 9, title: 'Role Permissions', icon: Shield, path: '/role-permissions' },
        // { id: 10, title: 'Module Menu', icon: FileCode, path: '/module-menu' },
        // { id: 11, title: 'Auth Status', icon: Shield, path: '/auth-status' },
        {
            id: 12, title: 'Mapping', icon: Link, submenu: [
                { title: 'Role Permission Mapping', path: '/mapping/role-permission-mapping' },
                // { title: 'Module Menu Mapping', path: '/mapping/module-menu-mapping' }
            ]
        },
    ];


    return (
        <aside
            className={`bg-red-600 border-r border-border text-card-foreground flex flex-col h-screen transition-all duration-300 relative
      ${isExpanded ? 'w-64' : 'w-20'}`}
        >
            <div className="flex items-center justify-between p-5 border-b border-border bg-green-800">
                <div className={`flex items-center space-x-3  ${!isExpanded && 'opacity-0 w-0'}`}>
                    <div className="relative ">
                        <Shield size={28} className="text-primary " />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <span className="font-bold text-lg text-yellow-300 ">
                        AuthTool
                    </span>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`fixed z-50 bg-white text-red-600 hover:bg-gray-100 text-black p-1.5 rounded-full shadow-2xl transition-colors ${isExpanded ? 'left-[240px]' : 'left-[55px]'} top-[45px]`}
                >
                    {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                </button>
            </div>

            <nav className="p-3 flex-1 overflow-y-auto aside mb-20">
                {menuItems.map((item: any) => (
                    <div key={item.title}>
                        <button
                            onMouseEnter={() => setHoveredItem(item.title)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => {
                                // setSelectedItem(item.title);
                                dispatch(setSelectedItem(item.title))
                                if (item.path) {
                                    handleNavigate(item.path);
                                }
                                if (item.submenu) {
                                    setOpenSubmenu(openSubmenu === item.title ? null : item.title);
                                }
                            }}
                            className={`w-full flex items-center p-3 rounded-lg mb-1 transition-all duration-200 relative 
              ${selectedItem === item.title
                                    ? 'bg-white text-black'
                                    : 'text-white'}
                             
              ${!isExpanded && 'justify-center'}`}
                        >
                            <item.icon
                                size={20}
                                className={`transition-colors duration-200 
                ${selectedItem === item.title
                                        ? 'text-black'
                                        : ''}
                ${hoveredItem === item.title && selectedItem !== item.title ? '' : ''}`}
                            />
                            {isExpanded && (
                                <>
                                    <span className="flex pl-2 text-sm">{item.title}</span>
                                    {item.badge && (
                                        <span
                                            className={`px-2 ml-2 py-0.5 text-xs rounded-full 
        ${item.badge === 'New' && selectedItem === item.title
                                                    ? 'bg-green-500/80  text-green-100'
                                                    : item.badge === 'New'
                                                        ? 'bg-green-500/20 text-green-300'
                                                        : selectedItem === item.title
                                                            ? 'bg-green-500/70  text-green-200'
                                                            : 'bg-green-500/20 text-green-300'
                                                }
        ${theme === 'light'
                                                    ? 'bg-green-500/60 text-green-300'
                                                    : 'bg-green-500/60 text-green-300'}`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}


                                    {item.submenu && (
                                        <ChevronDown
                                            size={16}
                                            className={`transform transition-transform duration-200 ml-2 
                      ${openSubmenu === item.title ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </>
                            )}
                            {!isExpanded && item.badge && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                            )}
                        </button>

                        {isExpanded && item.submenu && openSubmenu === item.title && (
                            <div className="ml-9 mt-1 space-y-1">
                                {item.submenu.map((subItem: any, index: any) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNavigate(subItem.path)}
                                        className="w-full text-left text-sm py-2 px-3 rounded-lg  transition-colors duration-200 text-white hover:text-black"
                                    >
                                        {subItem.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* <div className={`absolute  bottom-0 left-0 right-0 p-4 border-t border-border
      ${!isExpanded && 'flex justify-center '}`}>
                <div className={`flex items-center space-x-3 ${!isExpanded && 'hidden'}`}>
                    <div className="flex-shrink-0">
                        <img src={mockUser?.avatar} alt="Server Status" className="w-8 h-8 rounded-lg" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white flex-col">Server Status</p>
                        <p className="text-sm text-green-400 ">All systems operational</p>
                    </div>
                </div>
                {!isExpanded && (
                    <div className="w-2 h-2 bg-green-500 rounded-full "></div>
                )}
            </div> */}
        </aside>
    );
};