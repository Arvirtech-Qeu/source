
import React, { useEffect, useState } from "react";
import { Truck, Package, AlertCircle, GridIcon, Building, CookingPot, Salad, Handshake } from "lucide-react";
import DeliveryPartner from "@view/restaurant-masters/delivery-partners";
import RestaurantFoodSku from "@view/restaurant-masters/restaurans-food-items";
import PartnerFoodSku from "@view/restaurant-masters/partner-food-name";
import Restaurant from "@view/restaurant-masters/restaurants";
import { useLocation } from "react-router-dom";
import { getFromLocalStorage } from "@utils/storage";

interface DeliveryAggregatorHubProps {
    isHovered: any;
}

const DeliveryAggregatorHub: React.FC<DeliveryAggregatorHubProps> = ({ isHovered }) => {

    const [error, setError] = useState<any>({})
    const [roleName, setRoleName]: any = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    // const initialTab = queryParams.get("tab") || "delivery-partners";
    const initialTab = queryParams.get("tab") ||
        (roleName === 'Super Admin' ? 'delivery-partners' :
            roleName === 'Aggregator Admin' ? 'restaurants' : 'restaurant-food-sku');

    const [activeTab, setActiveTab] = useState(initialTab); // Track active tab
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab])

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
                // Set the state values and trigger API call immediately
                if (loginDetails) {
                    setRoleName(loginDetails.roleName || null);
                }
            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    return (
        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            {/* Tabs Navigation */}
            <div className="mb-8 border-b border-gray-200">
                <nav className="flex -mb-px">
                    {roleName === 'Super Admin' && (
                        <button
                            onClick={() => setActiveTab("delivery-partners")}
                            className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "delivery-partners"
                                    ? "border-color text-color"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                        >
                            <Truck className="w-4 h-4" />
                            Delivery Aggregate
                        </button>
                    )}

                    <button
                        onClick={() => setActiveTab("restaurants")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "restaurants"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <CookingPot className="w-4 h-4" />
                        Restaurant
                    </button>

                    <button
                        onClick={() => setActiveTab("restaurans-food-items")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "restaurans-food-items"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <Salad className="w-4 h-4" />
                        Restaurant FoodSku
                    </button>

                    <button
                        onClick={() => setActiveTab("partner-food-name")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "partner-food-name"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <Handshake className="w-4 h-4" />
                        Partner FoodSku
                    </button>
                </nav>
            </div>

            {/* Tabs Content Rendering */}
            <div className="">
                {roleName === 'Super Admin' && (
                    activeTab === "delivery-partners" && <DeliveryPartner />
                )}
                {activeTab === "restaurants" && <Restaurant />}
                {activeTab === "restaurans-food-items" && <RestaurantFoodSku />}
                {activeTab === "partner-food-name" && <PartnerFoodSku />}
            </div>
        </div>
    );
};

export default DeliveryAggregatorHub;
