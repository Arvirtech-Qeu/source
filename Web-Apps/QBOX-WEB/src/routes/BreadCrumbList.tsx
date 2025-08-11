import { Home, User } from "lucide-react";

export const dashboardBreadcrumbs = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        description: 'Main dashboard overview'
    },
    {
        name: 'Users',
        href: '/dashboard/users',
        icon: User,
        description: 'User management section'
    },
    {
        name: 'Profile',
        href: '/dashboard/users/profile',
        description: 'User profile details'
    }
]