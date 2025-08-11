import React, { useState } from 'react';
import { Card, CardContent } from '@components/card2';
import { Package, CheckCircle, XCircle, X } from 'lucide-react';

interface Box {
    id: number;
    status: 'pending' | 'accepted';
    items: { name: string; quantity: number }[];
}

const Dashboard: React.FC = () => {
    const [boxes, setBoxes] = useState<Box[]>([
        {
            id: 1,
            status: 'pending',
            items: [
                { name: 'Sambar Rice', quantity: 1 },
                { name: 'Curd Rice', quantity: 2 },
                { name: 'Biryani', quantity: 2 }
            ]
        },
        {
            id: 2,
            status: 'accepted',
            items: [
                { name: 'Chicken Burger', quantity: 2 },
                { name: 'French Fries', quantity: 1 },
                { name: 'Milkshake', quantity: 2 }
            ]
        },
        {
            id: 3,
            status: 'pending',
            items: [
                { name: 'Veg Biryani', quantity: 1 },
                { name: 'Meals', quantity: 1 },
                { name: 'Lemon Rice', quantity: 1 }
            ]
        }
    ]);

    const [selectedBox, setSelectedBox] = useState<Box | null>(null);

    const handleStatusToggle = (boxId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setBoxes((prevBoxes) =>
            prevBoxes.map((box) =>
                box.id === boxId
                    ? { ...box, status: box.status === 'pending' ? 'accepted' : 'pending' }
                    : box
            )
        );
    };

    return (
        <div className="pl-32 pr-14 p-10 font-semibold text-2xl">
            <div className="min-h-screen">
                <div className=" mx-auto p-6 ">
                    <h1 className="text-3xl font-bold text-red-800 mb-6">Partner Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {boxes.map((box) => (
                            <Card
                                key={box.id}
                                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                                    box.status === 'accepted' 
                                        ? 'bg-green-700 hover:bg-green-200 text-white' 
                                        : 'bg-color hover:bg-red-200 text-white'
                                }`}
                                onClick={() => setSelectedBox(selectedBox?.id === box.id ? null : box)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center space-x-3">
                                            <Package className={`${
                                                box.status === 'accepted' ? 'text-white' : 'text-white'
                                            }`} />
                                            <span className="font-semibold text-xl">Box {box.id}</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleStatusToggle(box.id, e)}
                                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                                                box.status === 'accepted'
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-color hover:bg-color'
                                            } text-white font-medium text-sm`}
                                        >
                                            {box.status === 'accepted' ? 'Accepted' : 'Pending'}
                                        </button>
                                    </div>
                                    <div className="flex justify-center">
                                        {box.status === 'accepted' ? (
                                            <CheckCircle className={`text-white w-12 h-12 animate-pulse `}/>
                                        ) : (
                                            <XCircle className="text-color w-12 h-12" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {selectedBox && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <Card className="w-full max-w-md bg-white" onClick={handleStatusToggle}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-red-800">
                                                Box {selectedBox.id} Items
                                            </h2>
                                            <p className={`text-sm mt-1 ${
                                                selectedBox.status === 'accepted' 
                                                    ? 'text-green-600' 
                                                    : 'text-color'
                                            }`}>
                                                Status: {selectedBox.status.charAt(0).toUpperCase() + selectedBox.status.slice(1)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedBox(null)}
                                            className="text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedBox.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="font-medium">{item.name}</span>
                                                <span className="low-bg-color text-red-800 px-3 py-1 rounded-full text-sm">
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;