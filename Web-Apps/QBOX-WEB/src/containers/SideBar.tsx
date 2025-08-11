import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronRight,
    LogOut,
    CalendarCheck
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { useDispatch } from 'react-redux';
import { getAllMenuSubmenu, getMenuByRole } from '@state/authnSlice';
import { getDashboardQboxEntityByauthUser } from '@state/superAdminDashboardSlice';
import { getFromLocalStorage, removeFromLocalStorage } from '@utils/storage';
import * as lucide from "lucide-react";
import logo from '@assets/images/q-logo.png';
import { PanelLeft } from 'lucide-react';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Typography, useMediaQuery, useTheme, Button, Menu, MenuItem } from '@mui/material';

const SidebarMenu = ({ }) => {
    const [activeMenuItem, setActiveMenuItem] = useState(0);
    const [activeSubMenuItem, setActiveSubMenuItem] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    const [filteredMenu, setFilteredMenu]: any = useState([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [email, setEmail] = useState<any>(null);
    const [roleId, setRoleId] = useState<number | null>(null);
    const [authUserSno, setAuthUserSno] = useState<number | null>(null);
    const [hasClockedIn, setHasClockedIn] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const { roleMenuList } = useSelector((state: RootState): any => state.authnSlice);
    const { menuList } = useSelector((state: RootState): any => state.authnSlice);
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const open = Boolean(anchorEl);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (filteredMenu?.length > 0 && location.pathname) {
            let currentPath = location.pathname;

            // Map /dashboard to /super-admin-dashboard
            if (currentPath === "/dashboard") {
                currentPath = "/super-admin-dashboard";
            }

            let foundMatch = false;

            filteredMenu.forEach((menuItem, menuIndex) => {
                if (menuItem.subMenu?.length > 0) {
                    const subMenuIndex = menuItem.subMenu.findIndex(subItem => subItem.path === currentPath);

                    if (subMenuIndex !== -1) {
                        setActiveMenuItem(menuIndex);
                        setActiveMenu(menuItem.label);
                        setActiveSubMenuItem(subMenuIndex);
                        foundMatch = true;
                    }
                }
            });

            if (!foundMatch) {
                const mainMenuIndex = filteredMenu.findIndex(item => item.path === currentPath);

                if (mainMenuIndex !== -1) {
                    setActiveMenuItem(mainMenuIndex);
                    setActiveMenu(null);
                    setActiveSubMenuItem(null);
                }
            }
        }
    }, [filteredMenu, location.pathname]);

    console.log(filteredMenu)
    console.log(location.pathname)

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const storedData = getFromLocalStorage('user');

                if (!storedData) {
                    throw new Error('No user data found');
                }

                const { roleId, authUserName, loginDetails } = storedData;

                if (!roleId) {
                    throw new Error('Role ID is missing');
                }

                setRoleId(roleId);
                setEmail(authUserName);
                setAuthUserSno(loginDetails?.authUserSno || null);

                // Optional: Load user profile if needed
                if (loginDetails?.profileName && loginDetails?.roleName && loginDetails?.media_link) {
                    setUserProfile({
                        profileName: loginDetails.profileName,
                        roleName: loginDetails.roleName,
                        mediaLink: loginDetails.media_link
                    });
                }

                await Promise.all([
                    dispatch(getMenuByRole({ roleId })).unwrap(),
                    dispatch(getAllMenuSubmenu({})).unwrap()
                ]);

                // Load dashboard data for loaders
                if ((loginDetails?.roleName === 'Loader' || loginDetails?.roleName === 'Supervisor') && loginDetails?.authUserSno) {
                    console.log(loginDetails?.authUserSno)
                    await dispatch(getDashboardQboxEntityByauthUser({ authUserId: loginDetails.authUserSno })).unwrap();
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [dispatch]);

    useEffect(() => {
        const mappedMenuIds = roleMenuList?.map(item => item.menuId);
        const filteredMenuItems = menuList?.filter(menuItem => {
            const isMainMenuAllowed = mappedMenuIds?.includes(menuItem.menuId);
            const hasAllowedSubMenu = menuItem.subMenu?.some(subItem =>
                mappedMenuIds?.includes(subItem.menuId)
            );
            return isMainMenuAllowed || hasAllowedSubMenu;
        }, []);

        const processedMenu = filteredMenuItems?.map(menuItem => ({
            ...menuItem,
            subMenu: menuItem.subMenu?.filter(subItem =>
                mappedMenuIds?.includes(subItem.menuId)
            ) || []
        }));

        // Sort the menu items based on their labels
        const sortedMenu = processedMenu?.sort((a, b) => {
            const order = {
                'Dashboard': 1,
                'Inventory': 2,
                'Orders': 3,
                'Remote Location Onboarding': 4,
                'Delivery Aggregator': 5,
                'Purchase Order Management': 6,
                'Top Selling Sku': 7,
                'Master Settings': 8,
                'Reports': 9,
                'System Settings': 10,
            };

            const orderA = order[a.label] || 999;
            const orderB = order[b.label] || 999;

            return orderA - orderB;
        });

        setFilteredMenu(sortedMenu || []);
    }, [roleMenuList, menuList]);

    const handleMenuClick = (item, index) => {
        setActiveMenuItem(index);

        if (!isExpanded && item.subMenu?.length > 0) {
            setIsExpanded(true);
            setTimeout(() => {
                setActiveMenu(item.label);
            }, 300);
            return;
        }

        if (item.subMenu?.length > 0) {
            setActiveMenu(activeMenu === item.label ? null : item.label);
        } else {
            if (item.label === 'Dashboard') {
                const userRole = userProfile?.roleName;
                if (userRole === 'Super Admin' || userRole === 'Admin' || userRole === 'Aggregator Admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/super-admin-dashboard');
                }
                setActiveMenu(null);
            } else if (item.path) {
                navigate(item.path);
                setActiveMenu(null);
            }
        }
    };

    const handleSubMenuClick = (subItem, subIndex) => {
        setActiveSubMenuItem(subIndex);
        if (!isExpanded) {
            setIsExpanded(true);
        }
        if (subItem.path) {
            navigate(subItem.path);
        }
    };

    // Attendance button handlers
    const handleAttendanceButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (dashboardQboxEntityByauthUserList.length > 1) {
            setAnchorEl(event.currentTarget);
        } else if (dashboardQboxEntityByauthUserList.length === 1) {
            const entity = dashboardQboxEntityByauthUserList[0];
            navigate(`/attendance?qboxEntitySno=${entity.qboxEntitySno}&qboxEntityName=${encodeURIComponent(entity.qboxEntityName)}`);
        }
    };

    const handleMenuItemClick = (qboxEntitySno: number, qboxEntityName: string) => {
        setAnchorEl(null);
        navigate(`/attendance?qboxEntitySno=${qboxEntitySno}&qboxEntityName=${encodeURIComponent(qboxEntityName)}`);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const [openLogout, setOpenLogout] = React.useState(false);

    const handleClickOpen = () => {
        setOpenLogout(true);
    };

    const handleClose = () => {
        setOpenLogout(false);
    };

    const logout = () => {
        setOpenLogout(false);
        try {
            removeFromLocalStorage('user');
            removeFromLocalStorage('dashboardFilters');
            removeFromLocalStorage('orderFilters');
            removeFromLocalStorage('dashboardSelectedLocation');
            removeFromLocalStorage('dashboardSelectedRestaurant');
            removeFromLocalStorage('dashboardSelectedDate');
            removeFromLocalStorage('dashboardSelectedStatus');
            removeFromLocalStorage('dashboardIsFilterApply');
            removeFromLocalStorage('dashboardCountFilters');
            removeFromLocalStorage('dashboardSelectedLocationName');
            removeFromLocalStorage('dashboardSelectedRestaurantName');
            removeFromLocalStorage('dashboardSelectedArea');
            removeFromLocalStorage('dashboardSelectedAreaName');
            removeFromLocalStorage('dashboardSelectedAggregatorName');
            sessionStorage.clear();

            navigate('/login', { replace: true });

            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/login';
        }
    };

    return (
        <>
            {isLoading && <div className="p-4 text-center">Loading menu...</div>}
            {error && <div className="p-4 text-color text-center">{error}</div>}
            {!isLoading && !error && menuList?.length > 0 && (
                <div
                    style={{ zIndex: 50 }}
                    className={`${isExpanded ? "w-80" : "w-20"} relative transition-all duration-300 ease-in-out`}
                >
                    <div
                        className={`fixed left-0 top-0 h-screen low-bg-color z-50 overflow-hidden flex flex-col transition-all duration-300
                      ${isExpanded ? "w-80" : "w-20"} border-r border-color`}
                    >
                        <div className="p-3 border-neutral-200 low-bg-color space-x-4">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12">
                                    {isExpanded && (<img
                                        src={logo}
                                        alt="User Avatar"
                                        className="w-full h-full"
                                    />)}
                                </div>
                                <div onClick={toggleSidebar} className="cursor-pointer right-5 absolute low-bg-color rounded-full w-8 h-8 border border-color flex justify-center items-center">
                                    {isExpanded ? <lucide.ChevronLeft className='text-color' /> : <ChevronRight className='text-color' />}
                                </div>
                            </div>
                        </div>

                        <nav className="overflow-y-auto h-[calc(120vh-250px)] hide-scrollbar">
                            <div className="mb-6 flex items-center px-2 justify-center bg-color py-2 text-white">
                                <p className="mx-4 text-lg font-semibold tracking-wide text-center">
                                    MENU
                                </p>
                            </div>

                            {/* Attendance Button for Loader Role */}
                            {(userProfile?.roleName === "Loader" || userProfile?.roleName === "Supervisor") && dashboardQboxEntityByauthUserList?.length > 0 && (
                                <div className="px-2 mb-2">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size={isExpanded ? "large" : "small"}
                                        onClick={handleAttendanceButtonClick}
                                        startIcon={isExpanded ? <CalendarCheck /> : null}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 290,
                                            px: isExpanded ? 2.5 : 1,
                                            py: 1,
                                            borderRadius: '10px',
                                            background: hasClockedIn
                                                ? 'linear-gradient(45deg, #f44336, #e57373)'
                                                : 'linear-gradient(45deg, #4caf50, #81c784)',
                                            color: '#fff',
                                            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
                                            '&:hover': {
                                                background: hasClockedIn
                                                    ? 'linear-gradient(45deg, #e53935, #ef5350)'
                                                    : 'linear-gradient(45deg, #43a047, #66bb6a)',
                                            },
                                            minWidth: isExpanded ? 'auto' : '48px',
                                        }}
                                    >
                                        {!isExpanded ? (
                                            <CalendarCheck size={20} />
                                        ) : (
                                            dashboardQboxEntityByauthUserList.length === 1
                                                ? 'Mark Attendance'
                                                : 'Select Delivery Location to Mark Attendance'
                                        )}
                                    </Button>

                                    {/* Entity Selection Menu */}
                                    {dashboardQboxEntityByauthUserList.length > 1 && (
                                        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} sx={{
                                            '& .MuiPaper-root': {
                                                width: '290px', // Increased dropdown width
                                                maxWidth: '100%',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            },
                                        }}>
                                            {dashboardQboxEntityByauthUserList.map((entity) => (
                                                <MenuItem
                                                    key={entity.qboxEntitySno}
                                                    onClick={() => handleMenuItemClick(entity.qboxEntitySno, entity.qboxEntityName)}

                                                >
                                                    {entity.qboxEntityName}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    )}
                                </div>
                            )}

                            <ul className="px-4 space-y-3">
                                {filteredMenu?.map((item, index) => {
                                    const IconComponent = lucide[item.icon] || lucide.AlertCircle;
                                    const isActive = activeMenuItem === index && location.pathname !== "/home";
                                    return (
                                        <li key={index} className="relative">
                                            <div
                                                className={`group flex items-center rounded-lg transition-all duration-300 cursor-pointer p-2
                                                ${isActive ? "menu-background-color" : "text-black menu-item"}`}
                                                onClick={() => handleMenuClick(item, index)}
                                            >
                                                <div className={`flex items-center`}>
                                                    <div className="flex items-center space-x-3 ">
                                                        <IconComponent size={24} className="text-color" />
                                                        {isExpanded && (
                                                            <span className="font-normal">
                                                                {item.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isExpanded && item.subMenu?.length > 0 && (
                                                        <ChevronRight
                                                            size={20}
                                                            className={`ml-auto transition-transform ${activeMenu === item.label ? "rotate-90" : ""}`}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Submenu - Only show when expanded */}
                                            {isExpanded && activeMenu === item.label && item.subMenu?.length > 0 && (
                                                <ul className="pl-6 overflow-hidden">
                                                    {item.subMenu.map((subItem, subIndex) => {
                                                        const SubIconComponent = lucide[subItem.icon] || lucide.AlertCircle;
                                                        const isSubActive = activeSubMenuItem === subIndex;
                                                        return (
                                                            <li
                                                                key={subIndex}
                                                                className="block rounded-xl text-black transition-all duration-300 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSubMenuClick(subItem, subIndex);
                                                                }}
                                                            >
                                                                <div className={`my-2 flex items-center space-x-3 transition-all duration-300 p-2 rounded-lg ${isSubActive ? "menu-background-color text-black" : "text-black hover:low-bg-color"}`}>
                                                                    <SubIconComponent
                                                                        size={30}
                                                                        className={`p-1.5 rounded-lg ${isSubActive ? "text-black" : "text-color"}`}
                                                                    />
                                                                    <span className={`font-medium transition-all duration-300 inline-block ${isSubActive ? "text-black" : ""}`}>
                                                                        {subItem.label}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Fixed Bottom Section */}
                        <div className='border-t border-color py-5 px-4 mt-auto'>
                            <div className='flex items-center justify-between'>
                                {isExpanded ? (
                                    <>
                                        <div className="flex">
                                            <div className="w-14 h-14">
                                                <img
                                                    src={
                                                        userProfile?.mediaLink?.mediaUrl
                                                            ? JSON.parse(userProfile.mediaLink.mediaUrl).mediaUrl
                                                            : "https://as2.ftcdn.net/v2/jpg/05/49/98/39/1000_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                                                    }
                                                    alt="User Avatar"
                                                    className="w-full h-full object-cover rounded-full border-3 border-primary-500 shadow-light"
                                                />
                                            </div>
                                            <div className="pl-2">
                                                <h3 className="text-lg font-medium">{userProfile?.profileName}</h3>
                                                <p className="text-sm text-color">{userProfile?.roleName}</p>
                                            </div>
                                        </div>
                                        <div onClick={handleClickOpen}>
                                            <lucide.LogOutIcon className='text-color cursor-pointer' />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-10 h-10 mx-auto">
                                        <div onClick={handleClickOpen}>
                                            <lucide.LogOutIcon className='text-color cursor-pointer' />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Dialog
                open={openLogout}
                fullWidth={false}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                maxWidth="xs"
                PaperProps={{
                    className: "rounded-lg p-4",
                    style: { width: '100%', maxWidth: 400 },
                }}
            >
                <DialogTitle
                    id="responsive-dialog-title"
                    className="text-xl font-semibold text-gray-800"
                >
                    Logout
                </DialogTitle>

                <DialogContent>
                    <DialogContentText className="text-gray-600">
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>

                <DialogActions className="px-6 pb-4">
                    <button
                        onClick={handleClose}
                        className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded transition duration-150"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={logout}
                        className="bg-color menu-item text-white px-5 py-2 rounded flex items-center gap-2 transition duration-150"
                    >
                        Logout
                        <LogOut size={18} />
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SidebarMenu;