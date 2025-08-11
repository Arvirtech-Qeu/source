import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./card2";

interface OrderItem {
    name: string;
    quantity: number;
}

interface Order {
    inawrdOrderId: string;
    restaurant: string;
    orderStatus: number;
    deliveryPartner: number;
    logo: string;
    items: OrderItem[];
}

interface LocationOrderCardProps {
    location: string;
    orders: Order[];
}

const ORDER_STATUS_BADGES = {
    38: {
        label: 'Conflicting',
        className: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
        variant: 'primary'
    },
    36: {
        label: 'Ordered',
        className: 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/20',
        variant: 'primary'
    },
    37: {
        label: 'Delivered',
        className: 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
        variant: 'soft'
    }
} as const;

export function LocationOrderCard({ location, orders }: LocationOrderCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-red-100/50 overflow-hidden border border-red-100">
            <div className="bg-gradient-to-r from-red-600 to-red-400 p-4">
                <h2 className="text-lg font-medium text-white/90 tracking-wide flex items-center gap-2">
                    <svg className="w-5 h-5 text-white/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {orders.map((order) => (
                    <div
                        key={order.inawrdOrderId}
                        className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 hover:border-orange-200"
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Order ID:</span>
                                    <span className="ml-2 font-mono text-orange-600">{order.inawrdOrderId}</span>
                                </div>
                                {ORDER_STATUS_BADGES[order.orderStatus as keyof typeof ORDER_STATUS_BADGES] && (
                                    <Badge
                                        variant={ORDER_STATUS_BADGES[order.orderStatus].variant}
                                        className={ORDER_STATUS_BADGES[order.orderStatus].className}
                                    >
                                        {ORDER_STATUS_BADGES[order.orderStatus].label}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <img src={order.logo} alt="Swiggy Logo" className="w-10 h-10 rounded-full" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    {order.restaurant}
                                </h3>
                            </div>

                            <div className="space-y-3 pt-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex flex-col space-y-2 p-3 rounded-lg bg-gray-50 group-hover:bg-orange-50/50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {ORDER_STATUS_BADGES[order.orderStatus as keyof typeof ORDER_STATUS_BADGES]?.label}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium px-2 py-1 bg-blue-100 rounded-md shadow-sm">
                                                × {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 