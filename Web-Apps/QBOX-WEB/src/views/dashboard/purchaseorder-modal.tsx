
import DateTime from '@components/DateTime';
import { X } from 'lucide-react';

const PurchaseOrderModal = ({ location, partner, onClose }) => {
    console.log(location);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-xl shadow-lg m-4 overflow-hidden">
                <div className="sticky top-0 bg-color px-6 py-4 rounded-t-xl shadow-md">
                    <div className="flex items-center justify-between text-white text-xl">
                        <div>
                            {location.qboxEntityName}
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-white/10 transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[60vh] custom-scrollbar p-4 mr-1">
                    <div className="space-y-4">
                        <div className="flex justify-between p-2">
                            <h3 className="text-xl font-semibold">
                                Ordered From <span className='text-emerald-600'>{partner.deliveryAggregateName}</span>
                            </h3>
                            <div className="flex justify-end text-emerald-700">
                                {partner.orders.length > 0 && (
                                    <DateTime date={partner.orders[0].orderTime} showTime={false} color="emerald" showDateIcon={true} showTimeIcon={false} />
                                )}
                            </div>
                        </div>

                        {partner.orders.map((order, idx) => (
                            <div
                                key={idx}
                                className="group bg-white rounded-xl p-5 hover:bg-blue-50 transition-all duration-200 border border-gray-200 hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="mb-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            PO #{order.purchaseOrderId}
                                        </span>
                                        <div className="flex justify-end text-emerald-700">
                                            {partner.orders.length > 0 && (
                                                <DateTime date={order.orderTime} showDate={false} color="emerald" showDateIcon={true} showTimeIcon={false} />
                                            )}
                                        </div>

                                    </div>

                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">Restaurant</span>
                                        <span className="text-gray-900 font-medium group-hover:text-blue-700">
                                            {order.restaurantName}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500">SKU Name</span>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-900 font-medium group-hover:text-blue-700">
                                                {order.skuName}
                                            </span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                Qty: {order.OrderQty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderModal;