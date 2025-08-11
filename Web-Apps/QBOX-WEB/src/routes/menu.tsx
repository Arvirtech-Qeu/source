import {
    Home,
    Pizza,
    MapPin,
    Globe,
    Utensils,
    Truck,
    Handshake,
    Store,
    Box,
    Building,
    Database,
    Code,
    List,
    CookingPot,
    Shield,
    ArrowDownCircle,
    ArrowUpCircle,
    Grid,
    Network,
    MonitorCog,
    Cable,
    Table2,
    Server,
    TableColumnsSplit,
    Columns,
    FileText,
    PieChart,
    User,
    LayoutDashboard
} from 'lucide-react';

const aggregatorMenu = [
    {
        icon: Home,
        label: 'Aggregator Dashboard',
        path: '/aggregator-dashboard',
        gradient: 'from-red-400 to-red-600',
        description: 'Overview of aggregator activity'
    }
];

export const getMenuItems = (role: string) => {
    if (role === 'Aggregator') {
        return aggregatorMenu;
    }
    return menuItems;
};

export const menuItems = [
    {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/dashboard',
        gradient: 'from-red-400 to-red-600',
        description: 'Overview of your activity'
    },
    {
        icon: User,
        label: 'Add User',
        path: '/add-user/addUser',
        gradient: 'from-red-400 to-red-600',
        description: 'Overview of your activity'
    },
    {
        icon: Home,
        label: 'Admin Dashboard',
        path: '/super-admin-dashboard',
        gradient: 'from-red-400 to-red-600',
        description: 'Overview of your activity'
    },
    {
        icon: Globe,
        label: 'Location Masters',
        path: '/location-masters',
        gradient: 'from-red-400 to-rose-600',
        description: 'Explore delicious options',
        subMenu: [
            {
                icon: MapPin,
                label: 'Area',
                path: '/location-masters/area',
                description: 'Handcrafted pizzas'
            },
        ]
    },
    {
        icon: Utensils,
        label: 'Restaurant Masters',
        path: '/restaurant-masters',
        gradient: 'from-red-400 to-red-600',
        description: 'Explore delicious options',
        subMenu: [
            {
                icon: Truck,
                label: 'Delivery Aggregate',
                path: '/restaurant-masters/delivery-partners',
                description: 'Handcrafted pizzas'
            },
            {
                icon: CookingPot,
                label: 'Restaurants',
                path: '/restaurant-masters/restaurants',
                description: 'Handcrafted pizzas'
            },
            {
                icon: Pizza,
                label: 'Restaurant Food Items',
                path: '/restaurant-masters/restaurans-food-items',
                description: 'Handcrafted pizzas'
            },
            {
                icon: Handshake,
                label: 'Partner Food Names',
                path: '/restaurant-masters/partner-food-name',
                description: 'Handcrafted pizzas'
            },
        ]
    },
    {
        icon: Box,
        label: 'Q-Box Masters',
        path: '/Q-box-master',
        gradient: 'from-red-400 to-red-600',
        description: 'Explore delicious options',
        subMenu: [
            {
                icon: Building,
                label: 'Infrastructure',
                path: '/Q-box-master/infrastructure',
                description: 'Handcrafted pizzas'
            },
            {
                icon: Cable,
                label: 'Infra Properties',
                path: '/Q-box-master/infra-properties',
                description: 'Handcrafted pizzas'
            },
        ]
    },
    {
        icon: Database,
        label: 'Meta Data Masters',
        path: '/meta-data-masters',
        gradient: 'from-red-400 to-red-600',
        description: 'Explore delicious options',
        subMenu: [
            {
                icon: Code,
                label: 'Codes Headers',
                path: '/meta-data-masters/codes-headers',
                description: 'Handcrafted pizzas'
            },
            {
                icon: List,
                label: 'Codes Details',
                path: '/meta-data-masters/codes-details',
                description: 'Handcrafted pizzas'
            },
        ]
    },
    {
        icon: Table2,
        label: 'ETL Masters',
        path: '/etl-masters',
        gradient: 'from-red-400 to-red-600',
        description: 'Explore delicious options',
        subMenu: [
            {
                icon: Server,
                label: 'ETL Jobs',
                path: '/etl-masters/etl-job',
                description: 'Handcrafted pizzas'
            },
            {
                icon: TableColumnsSplit,
                label: 'ETL Table Column',
                path: '/etl-masters/etl-table-column',
                description: 'Handcrafted pizzas'
            },
            {
                icon: Columns,
                label: 'Order ETL hdr',
                path: '/etl-masters/order-etl-hdr',
                description: 'Handcrafted pizzas'
            },
        ]
    },
    {
        icon: Shield,
        label: 'QBox-Admin',
        path: '/menu',
        gradient: 'from-red-400 to-red-600',
        description: 'Explore delicious options',
        subMenu: [
            {
                icon: MapPin,
                label: 'Purchase Order',
                path: '/qbox-admin/purchase-order',
                description: 'Handcrafted pizzas'
            },
            {
                icon: Store,
                label: 'Remote Location Onboarding',
                path: '/entity-dashboard',
                description: 'Handcrafted pizzas'
            },

        ]
    },
    {
        icon: Network,
        label: 'Supply Chain',
        path: '/menu',
        gradient: 'from-red-400 to-red-600',
        description: 'Explore delicious options',
        subMenu: [
            {
                icon: ArrowDownCircle,
                label: 'Inward Orders',
                path: '/supply-chain/inward-orders',
                description: 'Handcrafted pizzas'
            },
            {
                icon: ArrowUpCircle,
                label: 'Outward Orders',
                path: '/supply-chain/outward-orders',
                description: 'Handcrafted pizzas'
            },
            {
                icon: Grid,
                label: 'QBox-Cell',
                path: '/supply-chain/qBox-cell',
                description: 'Handcrafted pizzas'
            },
        ]
    },
    {
        icon: FileText,
        label: 'Reports',
        path: '/reports',
        gradient: 'from-red-400 to-red-600',
        description: 'Manage your account',
        subMenu: [
            {
                icon: PieChart,
                label: 'Purchase Report',
                path: '/reports/purchase-report',
                description: 'Handcrafted pizzas'
            },
            {
                icon: PieChart,
                label: 'Sales Report',
                path: '/reports/sales-report',
                description: 'Handcrafted pizzas'
            },
        ]
    },
];