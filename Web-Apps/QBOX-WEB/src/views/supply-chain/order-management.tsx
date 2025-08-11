
import React, { useEffect, useState } from "react";
import { Truck, Package, AlertCircle, GridIcon, Building, CookingPot, Salad, Handshake, FilePlus, ShoppingCart } from "lucide-react";
import { useLocation } from "react-router-dom";
import PurchaseOrderFileExport from "./purchase-order";
import PurchaseOrder from "@view/location-masters/orders";
import OrderPage from "@view/Loader/Orders/order_header";

interface OrderManagementProps {
    isHovered: any;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ isHovered }) => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get("tab") || "purchase-orders";

    const [activeTab, setActiveTab] = useState(initialTab); // Track active tab

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab])
    return (
        // <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
        <div>
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                    <button
                        onClick={() => setActiveTab("purchase-orders")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "purchase-orders"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Purchase Order
                    </button>
                    <button
                        onClick={() => setActiveTab("create-order")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "create-order"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <FilePlus className="w-4 h-4" />
                        Create Order
                    </button>

                    <button
                        onClick={() => setActiveTab("upload-order-file")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "upload-order-file"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Upload Purchase Order File
                    </button>
                </nav>
            </div>

            {/* Tabs Content Rendering */}
            <div className="">
                {activeTab === "create-order" && <PurchaseOrderFileExport isHovered={isHovered} />}
                {activeTab === "upload-order-file" && <PurchaseOrder isHovered={isHovered} />}
                {activeTab === "purchase-orders" && <OrderPage />}
            </div>
        </div>
    );
};

export default OrderManagement;
