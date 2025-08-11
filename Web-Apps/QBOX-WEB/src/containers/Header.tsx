import React, { useEffect, useState } from "react"
import { Search, Bell, User, Settings, LogOut, Sun, Clock, CalendarCheck, MapPin, Building } from "lucide-react"
import { motion } from "framer-motion"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { removeFromLocalStorage, getFromLocalStorage } from "@utils/storage"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Grow from "@mui/material/Grow"
import Paper from "@mui/material/Paper"
import Popper from "@mui/material/Popper"
import MenuList from "@mui/material/MenuList"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import ThemeSwitcher from "@view/Loader/Theme Settings/theme_switcher"
import Breadcrumbs from "@components/Breadcrumbs"
import { Button, Menu, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@state/store"
import { getDashboardQboxEntityByauthUser } from "@state/superAdminDashboardSlice"
import { getAllArea } from "@state/areaSlice"


interface HeaderProps {
    paths: Array<{
        name: string
        href: string
        icon?: React.ComponentType
        description?: string
    }>
    isHovered?: any
}

interface Entity {
    qboxEntityName: string;
    qboxEntitySno: string;
    hasClockedIn: boolean;
}

interface AttendanceButtonProps {
    dashboardQboxEntityByauthUserList: Entity[];
}


interface UserProfile {
    profileName: string;
    roleName: string;
    email: string;
    areaName?: string;
    deliveryPartnerName?: string;
    lastLogin?: string;
    mediaLink?: string; // Add this field

}

interface AreaData {
    areaSno: number;
    name: string;
}

const ElegantHeader: React.FC<HeaderProps> = ({ paths, isHovered }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    // const [userProfile, setUserProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()
    const pathnames = location.pathname.split("/").filter((x) => x)
    const pathSegments = location.pathname.split("/").filter((x) => x);

    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"))
    const [selectedTheme, setSelectedTheme] = useState("light")
    const [hasClockedIn, setHasClockedIn] = useState(false)
    const [authUserSno, setAuthUserSno] = useState<number | null>(null);
    const { dashboardQboxEntityByauthUserList } = useSelector((state: RootState) => state.dashboardSlice);
    // Material UI Menu state
    const [menuOpen, setMenuOpen] = React.useState(false)
    const anchorRef = React.useRef<HTMLButtonElement>(null)
    const [roleName, setRoleName]: any = useState(null);
    const [areaSno, setAreaSno] = useState<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { areaList } = useSelector((state: RootState) => state.area);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isAggDashboard, setIsAggDashboard] = useState(false);


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
                console.log(loginDetails)
                setRoleName(loginDetails?.roleName);
                setAreaSno(loginDetails?.areaSno || null);
                setAuthUserSno(loginDetails?.authUserId || null);

            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    useEffect(() => {
        if (location.pathname.includes('/aggregator-dashboard')) {
            setIsAggDashboard(true);
        } else {
            setIsAggDashboard(false);
        }
    }, [location.pathname]);

    const handleDashboardToggle = () => {
        setIsAggDashboard(!isAggDashboard);
        if (!isAggDashboard) {
            navigate('/aggregator-dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    useEffect(() => {
        console.log(roleName, authUserSno)
        if (((roleName === 'Loader') || (roleName === 'Supervisor')) && authUserSno) {
            dispatch(getDashboardQboxEntityByauthUser({ authUserId: authUserSno }));
        }
    }, [authUserSno, roleName]);

    useEffect(() => {
        if (userProfile?.roleName === 'Admin') {
            dispatch(getAllArea({}));
        }
    }, [dispatch, userProfile?.roleName]);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const storedData = getFromLocalStorage("user")

                if (!storedData) {
                    throw new Error("No user data found")
                }

                const { roleId, authUserName, loginDetails } = storedData

                if (!roleId) {
                    throw new Error("Role ID is missing")
                }

                if (loginDetails?.profileName && loginDetails?.roleName && loginDetails?.authUserName) {
                    setUserProfile({
                        profileName: loginDetails?.profileName,
                        roleName: loginDetails?.roleName,
                        email: loginDetails?.authUserName,
                    })
                }
            } catch (err: any) {
                setError(err.message)
                console.error("Error loading user data:", err)
            } finally {
                setIsLoading(false)
            }
        }

        loadUserData()
    }, [])

    // Material UI Menu handlers
    const handleToggle = () => {
        setMenuOpen((prevOpen) => !prevOpen)
    }

    const handleCloseButton = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return
        }
        setMenuOpen(false)
    }

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Tab") {
            event.preventDefault()
            setMenuOpen(false)
        } else if (event.key === "Escape") {
            setMenuOpen(false)
        }
    }

    const getAreaName = (areaSno: number | null): string => {
        if (!areaSno) return 'Not Assigned';
        const area = areaList?.find(
            (area: AreaData) => String(area.areaSno) === String(areaSno)
        );
        return area?.name || 'Not Assigned';
    };

    const getRoleBadgeStyles = (roleName: string) => {
        switch (roleName) {
            case 'Super Admin':
                return 'bg-purple-100 text-purple-800';
            case 'Admin':
                return 'bg-blue-100 text-blue-800';
            case 'Aggregator Admin':
                return 'bg-amber-100 text-amber-800';
            case 'Supervisor':
                return 'bg-green-100 text-green-800';
            case 'Loader':
                return 'bg-cyan-100 text-cyan-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(menuOpen)
    React.useEffect(() => {
        if (prevOpen.current === true && menuOpen === false) {
            anchorRef.current!.focus()
        }
        prevOpen.current = menuOpen
    }, [menuOpen])

    const handleClockInOut = () => {
        const now = new Date()
        navigate('/attendance');
    }

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading) {
            console.warn('Data is still loading');
            return;
        }
        console.log(dashboardQboxEntityByauthUserList)
        if (dashboardQboxEntityByauthUserList && dashboardQboxEntityByauthUserList.length > 1) {
            setAnchorEl(event.currentTarget);
        } else if (dashboardQboxEntityByauthUserList && dashboardQboxEntityByauthUserList.length === 1) {
            const qboxEntitySno = dashboardQboxEntityByauthUserList[0].qboxEntitySno;
            const qboxEntityName = dashboardQboxEntityByauthUserList[0].qboxEntityName;
            navigate(`/attendance?qboxEntitySno=${String(qboxEntitySno)}&qboxEntityName=${encodeURIComponent(qboxEntityName)}`);
        } else {
            console.warn('No entities available to mark attendance');
            // Optionally show a user message or trigger a fetch
        }
    };

    // When a menu item is clicked, navigate and close the menu
    const handleMenuItemClick = (qboxEntitySno: number, qboxEntityName: string) => {
        setAnchorEl(null);
        navigate(`/attendance?qboxEntitySno=${qboxEntitySno}&qboxEntityName=${encodeURIComponent(qboxEntityName)}`);

    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClosePopper = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return; // Prevent closing when clicking the button again
        }
        setMenuOpen(false);
    };

    return (
        <>
            <header
                className="
                    sticky
                    top-0
                    flex
                    items-center
                    justify-between
                    bg-gradient-to-r
                    from-white
                    to-gray-50
                    shadow-sm
                    border-b
                    border-color
                    px-6
                    py-4
                    backdrop-blur-sm
                    transition-all
                    duration-200
                    relative
                    z-10
                    align-self-center
                "
            >
                <Breadcrumbs />

                <div className={`flex justify-end items-center space-x-6 relative`}>
                    {(userProfile?.roleName === "Aggregator Admin" || userProfile?.roleName === "Super Admin") &&
                        (pathSegments.some(segment => ['home', 'dashboard'].includes(segment))) && (
                            <div className="flex items-center">
                                <button
                                    onClick={handleDashboardToggle}
                                    className={`px-4 py-2 rounded-l-lg font-medium text-sm transition-colors ${isAggDashboard ? "bg-color text-white" : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    Performance Dashboard
                                </button>
                                <button
                                    onClick={handleDashboardToggle}
                                    className={`px-4 py-2 rounded-r-lg font-medium text-sm transition-colors ${!isAggDashboard ? "bg-color text-white" : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    Dashboard
                                </button>
                            </div>
                        )}
                    <div className="flex items-center space-x-2">
                        {isLoading ? (
                            <span className="text-gray-600 font-medium text-sm md:text-base animate-pulse">
                                Welcome, User
                            </span>
                        ) : (
                            userProfile?.profileName && (
                                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:scale-105 group">
                                    <div className="w-10 h-10 bg-color rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                        <User size={18} className="text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">Welcome back</span>
                                        <span className="text-gray-800 font-bold text-lg leading-tight truncate max-w-[200px]">
                                            {userProfile.profileName}
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Material UI Menu for Settings */}
                    <div className="relative">
                        <Button
                            style={{ color: 'black' }}
                            ref={anchorRef}
                            id="composition-button"
                            aria-controls={menuOpen ? "composition-menu" : undefined}
                            aria-expanded={menuOpen ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                            className="min-w-0 p-0"
                            sx={{
                                minWidth: 0,
                                padding: "10px",
                                borderRadius: "50%",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                            }}
                        >
                            <Settings size={20} />
                        </Button>
                        <Popper
                            open={menuOpen}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-end"
                            transition
                            disablePortal
                            style={{ zIndex: 1000 }}

                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === "bottom-end" ? "right top" : "right bottom",
                                    }}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            width: 280,
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <ClickAwayListener onClickAway={handleClosePopper}>
                                            <div>
                                                <div className="p-4 bg-neutral-50 border-b">

                                                    <div className="flex items-center mb-3">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mr-3 shadow-lg">
                                                            {userProfile?.mediaLink ? (
                                                                <img
                                                                    src={userProfile.mediaLink}
                                                                    alt={userProfile?.profileName}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0yMCA3LjA3djJhMiAyIDAgMCAxLTIgMmgtMmExIDEgMCAwIDEtMS0xVjRhMSAxIDAgMCAxIDEtMWgyYTIgMiAwIDAgMSAyIDJ6Ii8+PHBhdGggZD0iTTE0IDR2NmExIDEgMCAwIDEtMSAxSDVhMSAxIDAgMCAxLTEtMVY0YTEgMSAwIDAgMSAxLTFoOGExIDEgMCAwIDEgMSAxeiIvPjxwYXRoIGQ9Ik0xMiAxM3Y3YTEgMSAwIDAgMS0xIDFINWExIDEgMCAwIDEtMS0xdi03YTEgMSAwIDAgMSAxLTFoNmExIDEgMCAwIDEgMSAxeiIvPjxwYXRoIGQ9Ik0yMCAxM3Y3YTEgMSAwIDAgMS0xIDFoLTJhMSAxIDAgMCAxLTEtMXYtN2ExIDEgMCAwIDEgMS0xaDJhMSAxIDAgMCAxIDEgMXoiLz48L3N2Zz4=';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-r from-color to-color/80 flex items-center justify-center">
                                                                    <User size={24} className="text-color" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{userProfile?.profileName}</h4>
                                                            <p className="text-sm text-gray-500">{userProfile?.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        {/* Role Badge */}
                                                        <div className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2 ${getRoleBadgeStyles(userProfile?.roleName || '')}`}>
                                                            <span className="w-2 h-2 rounded-full bg-current" />
                                                            {userProfile?.roleName}
                                                        </div>

                                                        {/* Additional Info based on role */}
                                                        {userProfile?.roleName === 'Admin' && (
                                                            <div className="text-sm text-gray-600 flex items-center gap-2 px-3">
                                                                <MapPin size={14} />
                                                                Area: {getAreaName(areaSno)}
                                                            </div>
                                                        )}

                                                        {userProfile?.roleName === 'Aggregator Admin' && (
                                                            <div className="text-sm text-gray-600 flex items-center gap-2 px-3">
                                                                <Building size={14} />
                                                                Partner: {userProfile?.deliveryPartnerName || 'Not Assigned'}
                                                            </div>
                                                        )}

                                                        {/* Last Login Info */}
                                                        <div className="text-xs text-gray-500 flex items-center gap-2 px-3 mt-1">
                                                            <Clock size={12} />
                                                            Last login: {new Date().toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <MenuList
                                                    autoFocusItem={menuOpen}
                                                    id="composition-menu"
                                                    aria-labelledby="composition-button"
                                                    onKeyDown={handleListKeyDown}
                                                    className="p-2"
                                                >
                                                    <MenuItem
                                                        onClick={handleClose}
                                                        component={Link}
                                                        to="/profile"
                                                        className="rounded-lg hover:bg-gray-50 mb-1"
                                                    >
                                                        <User size={16} className="mr-2 text-gray-500" />
                                                        <span className="text-gray-700">Profile</span>
                                                    </MenuItem>

                                                    {/* Theme Settings */}
                                                    <div className="px-4 py-3 border-t">
                                                        <div className="flex items-center mb-3">
                                                            <Sun size={16} className="mr-2 text-gray-500" />
                                                            <span className="text-sm font-medium text-gray-700">Theme Settings</span>
                                                        </div>
                                                        <ThemeSwitcher />
                                                    </div>

                                                    {/* Logout Button */}
                                                    <MenuItem
                                                        onClick={() => {
                                                            handleClose();
                                                            // Add your logout logic here
                                                        }}
                                                        className="rounded-lg hover:bg-red-50 mt-2 text-red-600"
                                                    >
                                                        {/* <LogOut size={16} className="mr-2" />
                                                        <span>Logout</span> */}
                                                    </MenuItem>
                                                </MenuList>
                                            </div>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </div>
            </header>

        </>
    )
}

export default ElegantHeader

