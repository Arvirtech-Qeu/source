import { Column } from "@components/Table";
import { Order } from "../types/userTypes";

export const recentOrders: Order[] = [
    {
        id: 'ORD-001',
        customer: 'John Doe',
        items: ['Laptop', 'Mouse'],
        total: 1299.99,
        status: 'Completed',
        statusColor: '#10B981'  // Green
    },
    {
        id: 'ORD-002',
        customer: 'Jane Smith',
        items: ['Smartphone'],
        total: 799.50,
        status: 'Processing',
        statusColor: '#F59E0B'  // Yellow
    },
    {
        id: 'ORD-003',
        customer: 'Mike Johnson',
        items: ['Headphones', 'Charger'],
        total: 249.99,
        status: 'Shipped',
        statusColor: '#3B82F6'  // Blue
    },
    {
        id: 'ORD-004',
        customer: 'Emily Brown',
        items: ['Monitor'],
        total: 299.99,
        status: 'Pending',
        statusColor: '#EF4444'  // Red
    },
    {
        id: 'ORD-005',
        customer: 'David Wilson',
        items: ['Keyboard', 'Gaming Mouse'],
        total: 199.50,
        status: 'Completed',
        statusColor: '#10B981'  // Green
    }
];

// Define columns for the table
export const columns: Column<Order>[] = [
    {
        key: 'id',
        header: 'Order ID',
        sortable: true,
        className: 'text-sm font-medium'
    },
    {
        key: 'customer',
        header: 'Customer',
        sortable: true,
        className: 'text-sm'
    },
    {
        key: 'items',
        header: 'Items',
        render: (order) => (
            <span className="text-sm text-gray-500">
                {order.items.join(', ')}
            </span>
        ),
        sortable: false
    },
    {
        key: 'total',
        header: 'Total',
        sortable: true,
        render: (order) => (
            <span className="font-semibold text-sm">
                ${order.total.toFixed(2)}
            </span>
        )
    },
    {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (order) => (
            <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                    backgroundColor: `${order.statusColor}20`,
                    color: order.statusColor,
                }}
            >
                {order.status}
            </span>
        )
    }
];