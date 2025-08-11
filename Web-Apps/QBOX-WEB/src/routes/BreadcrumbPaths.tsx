import { dashboardBreadcrumbs } from "./BreadCrumbList";

export const getBreadcrumbPaths = () => {
    switch (location.pathname) {
        case '/Dashboard':
            return dashboardBreadcrumbs;
        case '/dashboard/orders':
            return [
                { name: 'Home', href: '/' },
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Orders', href: '/dashboard/orders' }
            ];
        default:
            return [{ name: 'Home', href: '/' }];
    }
};