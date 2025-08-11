import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Papa from "papaparse";
import { saveAs } from "file-saver";
import { getFromLocalStorage } from '@utils/storage';
import { getAllPartnerFoodSku } from '@state/partnerFoodSkuSlice';
import { getAllQboxEntities } from '@state/qboxEntitySlice';
import { getAllRestaurantFoodSku } from '@state/restaurantFoodSkuSlice';
import { getAllRestaurant } from '@state/restaurantSlice';
import { RootState, AppDispatch } from '@state/store';
import { generateOrderFile } from '@state/supplyChainSlice';
import { Leaf, ShoppingBag, Store, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface QboxEntity {
    qboxEntitySno: string;
    qboxEntityName: string;
    entityCode: string;
}

interface Restaurant {
    restaurantFoodSkuSno: any;
    restaurantSno: number;
    restaurantName: string;
    restaurantCode: string;
}

interface MenuItem {
    partnerFoodSkuCode: any;
    restaurantSkuCode: any;
    id: number;
    restaurantFoodSkuSno: string;
    restaurantFoodSku: string;
    quantity: number;
    count: number;
}

interface FoodItem {
    foodCode: string;
    count: number;
}

interface OrderCard {
    id: number;
    restaurantName: string;
    qboxRemoteLocation: string;
    qboxRemoteName: string;
    restaurantCode: string;
    partnerCode: string;
    foodTransactionDate: string;
    foodItems: FoodItem[];
}

interface PurchaseOrderFileExportProps {
    isHovered: any;
}

const PurchaseOrderFileExport: React.FC<PurchaseOrderFileExportProps> = ({ isHovered }) => {
    const [selectedEntity, setSelectedEntity] = useState<string>('');
    const [selectedEntityCode, setSelectedEntityCode] = useState<string>('');
    const [selectedEntityName, setSelectedEntityName] = useState<string>('');
    const [restaurantSearch, setRestaurantSearch] = useState<string>('');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [menuSearch, setMenuSearch] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
    const [orderCards, setOrderCards] = useState<OrderCard[]>([]);
    // const [currentDate, setCurrentDate] = useState<string>(
    //     new Date().toISOString().split('T')[0].replace(/-/g, '')
    // );
    const [partnerCode, setPartnerCode] = useState<string>('');
    const [deliveryPartnerSno, setDeliveryPartnerSno] = useState<string>('');
    const [restaurantMenu, setRestaurantMenu] = useState<MenuItem[]>([]);
    const [fileName, setFileName] = useState("");
    const [purchaseOrder, setPurchaseOrder]: any = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
    const { restaurantList } = useSelector((state: RootState) => state.restaurant);
    const dispatch = useDispatch<AppDispatch>();

    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                dispatch(getAllQboxEntities({})),
                dispatch(getAllRestaurant({}))
            ]);
        };
        fetchData();
    }, [dispatch]);


    useEffect(() => {
        const loadUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const storedData = getFromLocalStorage('user');

                if (!storedData) {
                    throw new Error('No user data found');
                }

                const { loginDetails } = storedData;
                setPartnerCode(loginDetails?.partnerCode);
                setDeliveryPartnerSno(loginDetails?.deliveryPartnerSno);
                console.log(loginDetails?.partnerCode)
                console.log(loginDetails?.deliveryPartnerSno)
            } catch (err: any) {
                setError(err.message);
                console.error('Error loading user data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    const getFormattedDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
        const day = String(now.getDate()).padStart(2, '0'); // Ensure 2-digit day

        return `${year}${month}${day}`;
    };

    const [currentDate, setCurrentDate] = useState<string>(getFormattedDate());


    const filteredRestaurants = restaurantSearch.trim() === ''
        ? restaurantList || []
        : restaurantList?.filter(r =>
            r.restaurantName?.toLowerCase().includes(restaurantSearch.toLowerCase())
        ) || [];


    const filteredMenuItems = menuSearch.trim() === ''
        ? restaurantMenu
        : restaurantMenu?.filter(item =>
            item.restaurantFoodSku.toLowerCase().includes(menuSearch.toLowerCase())
        );

    const handleEntitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const entitySno = e.target.value;
        setSelectedEntity(entitySno);

        const selectedQboxEntity = qboxEntityList?.find(entity =>
            entity.qboxEntitySno.toString() === entitySno
        );

        if (selectedQboxEntity) {
            setSelectedEntityCode(selectedQboxEntity.entityCode);
            setSelectedEntityName(selectedQboxEntity.qboxEntityName);
        } else {
            setSelectedEntityCode("");
            setSelectedEntityName("");
        }
    };

    const handleRestaurantClick = async (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setSelectedItems([]);
        setSelectedIndexes([]);

        try {
            const menuResponse = await dispatch(getAllRestaurantFoodSku({
                restaurantSno: restaurant.restaurantSno
            }));
            const partnerSkuResponse = await dispatch(getAllPartnerFoodSku({
                deliveryPartnerSno: deliveryPartnerSno
            })).unwrap();

            if (!menuResponse?.payload || !partnerSkuResponse) {
                console.warn("Empty menu or partner SKUs response");
                return;
            }
            console.log(partnerSkuResponse)

            const restaurantMenu = menuResponse.payload;
            const partnerFoodSkuList = Array.isArray(partnerSkuResponse) ? partnerSkuResponse : [];

            const filteredPartnerSkuList = partnerFoodSkuList.filter(
                sku => (sku.deliveryPartnerSno) === deliveryPartnerSno
            );

            let updatedMenu = restaurantMenu.map(menuItem => ({
                ...menuItem,
                count: 0,
                partnerFoodSkuCode: filteredPartnerSkuList.find(
                    sku => Number(sku.restaurantFoodSkuSno) === Number(menuItem.restaurantFoodSkuSno)
                )?.partnerFoodCode || null
            }));

            updatedMenu = updatedMenu.filter(item => item.partnerFoodSkuCode !== null);
            setRestaurantMenu(updatedMenu);
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    const handleCheckboxChange = (index: number, menuItem: MenuItem, isChecked: boolean) => {
        setSelectedIndexes(prevIndexes =>
            isChecked ? [...prevIndexes, index] : prevIndexes.filter(i => i !== index)
        );
        setSelectedItems(prevItems => {
            if (isChecked) {
                // Add the item at the correct index
                const updatedItems = [...prevItems];
                updatedItems[index] = { ...menuItem, count: 0 };
                return updatedItems;
            } else {
                // Remove the item at the given index
                return prevItems.filter((_, i) => i !== index);
            }
        });
    };

    const handleQuantityChange = (index: number, value: string) => {
        const quantity = Number(value) || 0;

        setSelectedItems(prevItems =>
            prevItems.map((item, i) => (i === index ? { ...item, count: quantity } : item))
        );
    };

    const handleAddOrderCard = () => {
        if (!selectedEntity || !selectedRestaurant || selectedItems.length === 0) {
            return;
        }

        const newFoodItems = selectedItems
            .filter(item => item.count > 0)
            .map(item => ({
                foodCode: item.partnerFoodSkuCode,
                count: item.count
            }));

        const newOrderCard: OrderCard = {
            id: Date.now(),
            qboxRemoteLocation: selectedEntityCode,
            restaurantCode: selectedRestaurant.restaurantCode,
            partnerCode,
            foodTransactionDate: currentDate,
            foodItems: newFoodItems,
            restaurantName: selectedRestaurant.restaurantName,
            qboxRemoteName: selectedEntityName
        };

        setOrderCards(prev => [...prev, newOrderCard]);

        setSelectedItems([]);
        setSelectedIndexes([]);
        setRestaurantMenu(prev => prev.map(item => ({ ...item, count: 0 })));
    };

    const removeOrderCard = (id: number) => {
        setOrderCards(prev => prev.filter(card => card.id !== id));
    };

    const handleExportClick = () => {
        if (!fileName.trim()) {
            return;
        }

        if (!purchaseOrder || !purchaseOrder.data) {
            return;
        }

        try {
            const csv = Papa.unparse(purchaseOrder.data);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `${fileName}.csv`);
        } catch (error) {
            console.error("Error exporting CSV:", error);
        }
        handleReset();
    };

    const formatDateForInput = (dateString: string): string => {
        if (dateString.length === 8) {
            return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
        }
        return '';
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedDate = e.target.value.replace(/-/g, '');
        setCurrentDate(formattedDate);
    };

    const handleCreateOrder = async () => {
        if (orderCards.length > 0) {
            try {
                const formattedPayload = { data: orderCards };
                const response = await dispatch(generateOrderFile(formattedPayload)).unwrap();

                console.log("API Response:", response); // Debugging log

                setPurchaseOrder(response);

                // Check where isSuccess is located
                if (response?.data?.length > 0) {
                    toast.success("Order created successfully!");
                } else {
                    toast.error("Order creation failed!");
                }
            } catch (error) {
                console.error("Error generating order file:", error);
                toast.error("Failed to create order. Please try again.");
            }
        }
    };



    const handleReset = () => {
        setSelectedEntity('');
        setSelectedEntityCode('');
        setSelectedEntityName('');
        setRestaurantSearch('');
        setSelectedRestaurant(null);
        setMenuSearch('');
        setSelectedItems([]);
        setOrderCards([]);
        // setCurrentDate(new Date().toISOString().split('T')[0].replace(/-/g, ''));
        // setPartnerCode('');
        // setDeliveryPartnerSno('');
        setRestaurantMenu([]);
        setFileName('');
        setPurchaseOrder([]);
        setIsLoading(false);
        setError(null);
        setSelectedIndexes([]);
    };


    return (
        <div className="min-h-screen">
            <div className="custom-gradient-left h-24" />
            <div className={`-mt-16 ${isHovered ? 'pl-32 pr-14 ' : 'pl-16 pr-14 '}`}>
                <div className="max-w-8xl mx-auto">
                    <header className="bg-white text-black p-6 shadow-lg flex rounded-2xl items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="low-bg-color p-3 rounded-xl">
                                <ShoppingBag className="w-8 h-8 text-color" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Food Order File Export</h1>
                                <p className="text-gray-500 mt-2">Export order data and monitor hub operations seamlessly.</p>
                            </div>
                        </div>
                        <span className="text-lg font-semibold">Partner Code: {partnerCode}</span>
                    </header>
                    <div className="mx-auto p-6">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Delivery Location
                                    </label>
                                    <select
                                        className={`w-full border border-gray-300 rounded-md shadow-sm p-2 ${selectedEntity ? 'bg-green-50 border-green-500' : ''
                                            }`}
                                        value={selectedEntity}
                                        onChange={handleEntitySelect}
                                    >
                                        <option value="">Choose Delivery Location...</option>
                                        {qboxEntityList?.map((qbe) => (
                                            <option key={qbe.qboxEntitySno} value={qbe.qboxEntitySno}>
                                                {qbe.qboxEntityName} ({qbe.entityCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transaction Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formatDateForInput(currentDate)}
                                        onChange={handleDateChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Restaurants</h2>
                                    <input
                                        type="text"
                                        placeholder="Search restaurants..."
                                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 mb-4"
                                        value={restaurantSearch}
                                        onChange={(e) => setRestaurantSearch(e.target.value)}
                                    />
                                    <div className="border rounded-md overflow-y-auto max-h-60">
                                        {filteredRestaurants?.map(restaurant => (
                                            <div
                                                key={restaurant.restaurantSno}
                                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-center 
                    ${selectedRestaurant?.restaurantSno === restaurant.restaurantSno
                                                        ? 'bg-green-100 border-l-4 border-green-600'
                                                        : ''
                                                    }`}
                                                onClick={() => handleRestaurantClick(restaurant)}
                                            >
                                                <span>{restaurant.restaurantName}</span>
                                                <span className="text-gray-600">{restaurant.restaurantCode}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Menu Items</h2>
                                    <input
                                        type="text"
                                        placeholder="Search menu items..."
                                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 mb-4"
                                        value={menuSearch}
                                        onChange={(e) => setMenuSearch(e.target.value)}
                                    />

                                    <div className="border rounded-md overflow-y-auto max-h-60">
                                        {filteredMenuItems?.length > 0 ? (
                                            filteredMenuItems.map((menuItem, index) => (
                                                <div
                                                    key={menuItem.id}
                                                    className={`p-4 border-b flex justify-between
                ${selectedIndexes.includes(index) ? 'bg-green-50' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIndexes.includes(index)}
                                                        onChange={(e) => handleCheckboxChange(index, menuItem, e.target.checked)}
                                                        className="w-5 h-5"
                                                    />
                                                    <span>{menuItem.restaurantFoodSku}</span>
                                                    <div className="flex items-center gap-3">
                                                        {/* Show input only when the checkbox is checked */}
                                                        {selectedIndexes.includes(index) && (
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={selectedItems[index]?.count || ''}
                                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                                className="w-20 p-2 border border-gray-300 rounded-md text-center"
                                                                placeholder="Qty"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">No menu items found</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    className="px-6 py-2 rounded-md text-white font-medium bg-color hover:bg-green-700"
                                    onClick={handleReset}
                                >
                                    Reset
                                </button>
                                <button
                                    className={`px-6 py-2 rounded-md text-white font-medium ${!selectedEntity || !selectedRestaurant || selectedItems.length === 0 || selectedItems.some(item => !item.count || item.count <= 0)
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    onClick={handleAddOrderCard}
                                    disabled={!selectedEntity || !selectedRestaurant || selectedItems.length === 0 || selectedItems.some(item => !item.count || item.count <= 0)}
                                >
                                    Add Order
                                </button>
                            </div>
                        </div>

                        {orderCards.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Purchase Order Summary</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Delivery Location
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Restaurant
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Items
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orderCards.map(card => (
                                                <tr key={card.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {card.qboxRemoteName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {card.restaurantName}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {card.foodItems.map((item, idx) => (
                                                            <div key={idx} className="text-sm text-gray-900">
                                                                {item.foodCode} (x{item.count})
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {card.foodTransactionDate}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            className="text-color hover:text-red-900"
                                                            onClick={() => removeOrderCard(card.id)}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <button
                                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        onClick={handleCreateOrder}
                                    >
                                        Create Purchase Order
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={fileName}
                                            onChange={(e) => setFileName(e.target.value)}
                                            placeholder="Enter filename"
                                            className="border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                        <button
                                            className={`px-6 py-2 rounded-md text-white font-medium ${purchaseOrder.length === 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                            onClick={handleExportClick}
                                            disabled={purchaseOrder.length === 0}
                                        >
                                            Export File
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderFileExport;