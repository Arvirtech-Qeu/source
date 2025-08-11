import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/Dialog';
import { MasterCard } from '@components/MasterCard';
import { getQboxCurrentStatus } from '@state/supplyChainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';



const FlipCard = ({ box, index, skuImages }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="perspective-1000 relative w-full h-[300px]">
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
                {/* Front - QR Code */}
                <div className={`absolute w-full h-full backface-hidden bg-orange-100 rounded-xl p-4 
            ${isFlipped ? 'invisible' : ''}`}>
                    <div className="flex flex-col h-full items-center justify-between">
                        <div className="flex-1 flex justify-center items-center">
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={box.boxCellSno ? `${box.boxCellSno}` : 'No BoxCellSno'} // Generate QR code for boxCellSno
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            <span className="font-semibold">Item Stored:</span>
                            {box.foodUniqueCode ? ' Available' : ' None'}
                        </div>
                        {/* <button
                            onClick={() => setIsFlipped(true)}
                            className="mt-4 bg-color hover:bg-color text-white px-4 py-2 rounded-lg 
                  transition-colors duration-200 w-full"
                        >
                            Load
                        </button> */}
                    </div>
                </div>

                {/* Back - Image */}
                <div className={`absolute w-full h-full backface-hidden bg-orange-100 rounded-xl p-4 
            rotate-y-180 ${!isFlipped ? 'invisible' : ''}`}>
                    <div className="flex flex-col h-full items-center justify-between">
                        <div className="flex-1 w-full">
                            <img
                                src={skuImages[index]}
                                alt="Food Item"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const QRCodeTab = () => {
    const [selectedBox, setSelectedBox]: any = useState(null);
    const [images, setImages] = useState({}); // Store images for each box
    const [loadedImage, setLoadedImage] = useState(null); // Track which box has its image loaded



    const [data] = useState([
        { "boxCellSno": 2, "description": "Row-1- Column-2", "foodUniqueCode": "123ABC" },
        { "boxCellSno": 4, "description": "Row-2- Column-2", "foodUniqueCode": null },
        { "boxCellSno": 1, "description": "Row-1- Column-1", "foodUniqueCode": null },
        { "boxCellSno": 5, "description": "Row-2- Column-1", "foodUniqueCode": "456DEF" },
        { "boxCellSno": 6, "description": "Row-2- Column-1", "foodUniqueCode": null },
        { "boxCellSno": 2, "description": "Row-1- Column-2", "foodUniqueCode": "123ABC" },
        { "boxCellSno": 4, "description": "Row-2- Column-2", "foodUniqueCode": null },
        { "boxCellSno": 1, "description": "Row-1- Column-1", "foodUniqueCode": null },
        { "boxCellSno": 5, "description": "Row-2- Column-1", "foodUniqueCode": "456DEF" },
        { "boxCellSno": 6, "description": "Row-2- Column-1", "foodUniqueCode": null },
    ].sort((a, b) => a.boxCellSno - b.boxCellSno));

    const handleBoxClick = (box) => {
        setSelectedBox(box);
    };
    const { qboxCurrentStatusList } = useSelector((state: RootState) => state.supplyChain);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getQboxCurrentStatus({}));
    }, [dispatch]);
    const skuImages = [
        "https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMpzF8xvAowVidEeHHCjoAKjPEuWju2D3Lyw&s",
        "https://i.ytimg.com/vi/s4YsKuoYTe8/maxresdefault.jpg",
        "https://www.recipemagik.com/wp-content/uploads/2021/05/Curd-Rice-Recipe-5.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgSsJV_wAET3J-NuauVcCKvyLdAUFq7KZgiw&s",
    ];

    const handleLoadImage = (box) => {
        // Set the loaded image for the specific box
        setLoadedImage(box.boxCellSno); // Use boxCellSno to identify which box's image to load
    };
    console.log(qboxCurrentStatusList)


    return (
        <div>
            <h1 className="text-2xl text-color flex items-center gap-3">QBox </h1>


            {qboxCurrentStatusList?.length === 0 || qboxCurrentStatusList === null ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    {/* <div className="text-center">
                        <h2 className="text-xl text-gray-500">No QBox Data Found</h2>
                    </div> */}
                    <div className="flex flex-col items-center">
                        <SearchX size={64} className="text-color mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No QBox Details Found</h3>
                        <p className="text-gray-500 text-center">No matching QBox Details were found.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {qboxCurrentStatusList.map((box, index) => (
                        <FlipCard
                            key={box.boxCellSno}
                            box={box}
                            index={index}
                            skuImages={skuImages}
                        />
                    ))}

                </div>
            )}

        </div>
    );
};

export default QRCodeTab;