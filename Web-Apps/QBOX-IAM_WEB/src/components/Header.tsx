// import React, { useState } from 'react';
// import {
//     Bell, Search, Sun, Moon,
//     User, Shield, LogOut, ChevronDown
// } from 'lucide-react';
// import { useTheme } from '@/hooks/useTheme';
// import { mockUser } from '@/pages/layout';
// import storage from '@/utils/storage';

// const Header = () => {
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const [notifications, setNotifications] = useState(3);
//     const { theme, toggleTheme } = useTheme();

//     return (
//         <header className="h-16 py-[34px] bg-white px-6 flex items-center justify-between transition-colors duration-200 shadow-md">
//             <div className="flex items-center flex-1 space-x-4 ">
//                 {/* <div className="relative w-64">
//             <input
//                 type="text"
//                 placeholder="Search..."
//                 className={`  ${theme === 'light'
//                     ? 'w-full pl-10 pr-4 py-2 text-black bg-white rounded-lg'
//                     : 'w-full pl-10 pr-4 py-2 text-black bg-white rounded-lg'}`}
//             />
//             <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
//         </div> */}
//             </div>

//             <div className="flex items-center space-x-6">
//                 <button
//                     className="relative p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
//                     aria-label="Notifications"
//                 >
//                     <Bell size={20} className="text-black " />
//                     {notifications > 0 && (
//                         <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
//                             {notifications}
//                         </span>
//                     )}
//                 </button>

//                 <button
//                     onClick={toggleTheme}
//                     className="p-2 hover:bg-gray-200   rounded-lg transition-colors duration-200"
//                     aria-label="Toggle theme"
//                 >
//                     {theme === 'light' ? (
//                         <Moon size={20} className="text-black " />
//                     ) : (
//                         <Sun size={20} className="text-black  " />
//                     )}
//                 </button>

//                 <div className="relative">
//                     <button
//                         onClick={() => setIsProfileOpen(!isProfileOpen)}
//                         className="flex items-center space-x-3 hover:bg-gray-200 rounded-lg p-2 transition-colors duration-200"
//                     >
//                         <div className="relative">
//                             <img
//                                 src={mockUser.avatar}
//                                 alt="Profile"
//                                 className="w-8 h-8 rounded-full "
//                             />
//                             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500  rounded-full"></span>
//                         </div>
//                         <div className="text-sm text-left">
//                             <p className={`${theme === 'light' ? 'font-medium text-black' : 'font-medium text-black'}`}>
//                                 {mockUser.name}
//                             </p>

//                             <p className={`${theme === 'light' ? 'text-gray-500 text-xs' : 'text-gray-500 text-xs'}`}>
//                                 {mockUser.role}
//                             </p>
//                         </div>
//                         <ChevronDown size={16} className="text-muted-foreground" />
//                     </button>

//                     {isProfileOpen && (
//                         <div className="absolute right-0 mt-2 w-72 bg-card rounded-xl shadow-xl py-2 border border-border transform transition-all duration-200 z-30">
//                             <div className="px-4 py-3 border-b border-border">
//                                 <p className="font-medium text-foreground">{mockUser.name}</p>
//                                 <p className="text-muted-foreground text-sm">{mockUser.email}</p>
//                             </div>
//                             <div className="px-4 py-2">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <span className="text-sm text-muted-foreground">Profile Completion</span>
//                                     <span className="text-sm font-medium text-primary">85%</span>
//                                 </div>
//                                 <div className="w-full bg-muted rounded-full h-2">
//                                     <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
//                                 </div>
//                             </div>
//                             <div className="border-t border-border mt-2 pt-2">
//                                 <a href="#profile" className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted">
//                                     <User size={16} className="mr-3 text-muted-foreground" />
//                                     Profile Settings
//                                 </a>
//                                 <a href="#security" className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted">
//                                     <Shield size={16} className="mr-3 text-muted-foreground" />
//                                     Security
//                                 </a>
//                                 <a onClick={() => storage.removeToken()} href="/" className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/10">
//                                     <LogOut size={16} className="mr-3 text-red-500" />
//                                     Logout
//                                 </a>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </header>

//     );
// };

// export default Header;


import React, { useState } from 'react';
import {
    Bell, Search, Sun, Moon,
    User, Shield, LogOut, ChevronDown
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { mockUser } from '@/pages/layout';
import storage from '@/utils/storage';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 py-[34px] bg-card border-b border-border px-6 flex items-center justify-between shadow-sm transition-colors duration-200">
            <div className="flex items-center flex-1 space-x-4">
                {/* <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200"
                    />
                    <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                </div> */}
            </div>

            <div className="flex items-center space-x-6">
                {/* <button
                    className="relative p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                    aria-label="Notifications"
                >
                    <Bell size={20} className="text-foreground" />
                    {notifications > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                            {notifications}
                        </span>
                    )}
                </button> */}

                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? (
                        <Moon size={20} className="text-foreground" />
                    ) : (
                        <Sun size={20} className="text-foreground" />
                    )}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-3 hover:bg-muted rounded-lg p-2 transition-colors duration-200"
                    >
                        <div className="relative">
                            <img
                                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                alt="Profile"
                                className="w-8 h-8 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                        </div>
                        <div className="text-sm text-left">
                            {/* <p className="font-medium text-foreground">{mockUser.email}</p> */}
                            <p className="font-medium text-foreground">
                                {mockUser.email.split('@')[0].charAt(0).toUpperCase() + mockUser.email.split('@')[0].slice(1)}
                            </p>

                            <p className="text-muted-foreground text-xs">{mockUser.roleName}</p>
                        </div>
                        <ChevronDown size={16} className="text-muted-foreground" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-card rounded-xl shadow-xl py-2 border border-border transform transition-all duration-200 z-30">
                            <div className="px-4 py-3 border-b border-border">
                                <p className="font-medium text-foreground">{mockUser.name}</p>
                                <p className="text-muted-foreground text-sm">{mockUser.email}</p>
                            </div>
                            <div className="px-4 py-2">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-muted-foreground">Profile Completion</span>
                                    <span className="text-sm font-medium text-primary">85%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <div className="border-t border-border mt-2 pt-2">
                                <a href="#profile" className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted">
                                    <User size={16} className="mr-3 text-muted-foreground" />
                                    Profile Settings
                                </a>
                                <a href="#security" className="flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-muted">
                                    <Shield size={16} className="mr-3 text-muted-foreground" />
                                    Security
                                </a>
                                <a onClick={() => storage.removeToken()} href="/" className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/10">
                                    <LogOut size={16} className="mr-3 text-red-500" />
                                    Logout
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;