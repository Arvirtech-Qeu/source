import { AppDispatch, RootState } from "@state/store";
import { getHotboxCurrentStatusV2 } from "@state/supplyChainSlice";
import { QrCode, SearchX } from "lucide-react";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";

export default function HotBox() {
    const { hotboxCurrentStatusList } = useSelector((state: RootState) => state.supplyChain);
    const { qboxEntityList, qboxEntitySno } = useSelector(
        (state: RootState) => state.qboxEntity
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // dispatch(getHotboxCurrentStatusV2({}));
        dispatch(getHotboxCurrentStatusV2(qboxEntitySno != '0' ? { qboxEntitySno: qboxEntitySno } : {}));
    }, [dispatch, qboxEntitySno]);

    // Array of random images
    const skuImages = [
        "https://recipesblob.oetker.in/assets/d8a4b00c292a43adbb9f96798e028f01/1272x764/pizza-pollo-arrostojpg.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMpzF8xvAowVidEeHHCjoAKjPEuWju2D3Lyw&s",
        "https://i.ytimg.com/vi/s4YsKuoYTe8/maxresdefault.jpg",
        "https://www.recipemagik.com/wp-content/uploads/2021/05/Curd-Rice-Recipe-5.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgSsJV_wAET3J-NuauVcCKvyLdAUFq7KZgiw&s",
    ];


    // Function to get a random image
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * skuImages.length);
        return skuImages[randomIndex];
    };

    return (
        <div>
            <h1 className="text-2xl text-color flex items-center gap-3">HotBox</h1>
            {hotboxCurrentStatusList?.length === 0 || hotboxCurrentStatusList === null ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    {/* <div className="text-center">
                        <h2 className="text-xl text-gray-500">No HotBox Data Found</h2>
                    </div> */}
                    <div className="flex flex-col items-center">
                        <SearchX size={64} className="text-color mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No HotBox Details Found</h3>
                        <p className="text-gray-500 text-center">No matching HotBox Details were found.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">
                    {hotboxCurrentStatusList?.map((sku, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-between p-6 rounded-xl bg-white transition-transform hover:scale-105"
                        >
                            {/* SKU Image and QR Code Section */}
                            <div className="flex justify-center items-center mb-6">
                                <img
                                    src={sku.image || getRandomImage()}
                                    alt={sku.name || "Random Image"}
                                    className="max-w-[200px] max-h-[150px] object-cover rounded-lg border border-gray-200"
                                />
                            </div>

                            {/* QR Code Section */}
                            <div className="flex-1 flex justify-center items-center">
                                <QRCode
                                    size={100}
                                    style={{ height: "auto", maxWidth: "50%", width: "100%" }}
                                    value={sku.uniqueCode ? `${sku.uniqueCode}` : 'No uniqueCode'}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>

                            {/* SKU Details Section */}
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {sku.name}
                                </h3>
                            </div>
                            <div className="text-left">
                                <span className="block mt-2 px-4 py-2 text-sm font-medium text-white bg-green-800 rounded-md">
                                    {sku.uniqueCode}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>


    );
}