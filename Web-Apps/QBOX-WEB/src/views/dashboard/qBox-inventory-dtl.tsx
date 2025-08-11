
import { useState } from "react";
import { AlertCircle, ShieldAlert, X } from "lucide-react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { DialogHeader, DialogTitle } from "@components/Dialog";
import DateTime from "@components/DateTime";

interface QBox {
    rowNo: number;
    columnNo: number;
    qboxId?: string;
    foodName?: string;
    foodCode?: string;
    logo?: string;
    skuCode?: string;
    foodSkuName?: string;
    entryTime?: string;
}

interface Config {
    entityInfraSno: number;
    rowCount: string;
    columnCount: string;
}

interface Props {
    qBoxConfigurations: Config[];
    groupedQBoxes: Record<number, QBox[]>;
}

const QBoxInventoryDtl: React.FC<Props> = ({ qBoxConfigurations, groupedQBoxes }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBox, setSelectedBox] = useState<QBox | null>(null);

    if (!qBoxConfigurations?.length) return null;

    const handleCardClick = (qbox: QBox | undefined) => {
        if (qbox) {
            setSelectedBox(qbox);
            setIsDialogOpen(true);
        }
    };

    const getGridTemplateColumns = (columnCount: number) => {
        return {
            display: 'grid',
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: '0.5rem',
            width: '100%',
            height: '100%'
        };
    };

    return (
        <div className="animate-fadeIn w-full h-full ">
            {qBoxConfigurations?.map((config) => {
                const entityQBoxes = groupedQBoxes[config?.entityInfraSno] || [];
                const rowCount = parseInt(config?.rowCount);
                const columnCount = parseInt(config?.columnCount);

                return (
                    <div key={config.entityInfraSno} className="mb-4">
                        <div className="bg-color p-2 mb-2 shadow-sm">
                            <span className="text-white font-semibold">
                                QBox Matrix (Rows: {rowCount}, Columns: {columnCount})
                            </span>
                        </div>

                        <div className="w-full">
                            <div style={getGridTemplateColumns(columnCount)}>
                                {[...Array(rowCount)]?.map((_, rowIndex) =>
                                    [...Array(columnCount)]?.map((_, colIndex) => {
                                        const matchingQBox = entityQBoxes.find(
                                            (qbox) => qbox.rowNo === rowIndex + 1 && qbox.columnNo === colIndex + 1
                                        );

                                        const isEmpty = !matchingQBox || matchingQBox.foodName === "EMPTY";

                                        return (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                onClick={() => handleCardClick(matchingQBox)}
                                                className={`
                                                    transform transition-all duration-300 ease-in-out
                                                    hover:scale-105
                                                    ${isEmpty ? "bg-gray-400" : "bg-green-600"}
                                                    rounded-lg shadow-md
                                                    relative overflow-hidden
                                                    aspect-square
                                                `}
                                            >
                                                {matchingQBox?.logo && !isEmpty && (
                                                    <div className="absolute top-1 right-1 w-8 h-8 rounded-full overflow-hidden shadow-md bg-white">
                                                        <img src={matchingQBox.logo} alt="Logo" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="p-1 mb-0 border-b-0">
                                                    <div className="text-[10px] mb-0 text-blue-100">
                                                        R{rowIndex + 1}-C{colIndex + 1}
                                                    </div>
                                                </div>
                                                <div className="p-1">
                                                    <div className="text-[10px] font-bold text-white truncate">
                                                        {matchingQBox?.qboxId || "N/A"}
                                                    </div>
                                                    {isEmpty ? (
                                                        <div className="flex flex-row justify-center items-center h-1/2">
                                                            <ShieldAlert className="text-white text-lg" />
                                                            <span className="text-sm text-white ml-1">Empty</span>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-0.5">
                                                            {matchingQBox?.foodSkuName && (
                                                                <div className="text-[12px] font-bold text-red-100 truncate">
                                                                    {matchingQBox.foodSkuName}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="text-[10px] font-bold text-white text-right truncate">
                                                        {matchingQBox?.entryTime
                                                            ? new Date(matchingQBox.entryTime).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })
                                                            : "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            <Dialog open={isDialogOpen}>
                <DialogContent className="max-w-md rounded-lg overflow-hidden">
                    {selectedBox && (
                        <div className="overflow-hidden">
                            {/* Header */}
                            {/* <div className={`relative ${selectedBox.foodName === "EMPTY" ? "bg-red-500" : "bg-green-500"}`}> */}
                            <div className="bg-color">
                                <div className="flex items-center justify-between p-4">
                                    <h2 className="text-lg font-semibold text-white">QBox Cell Details</h2>
                                    <button
                                        onClick={() => setIsDialogOpen(false)}
                                        className="rounded-full p-1.5 bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Logo Section */}
                                {selectedBox.logo && (
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                                            <img
                                                src={selectedBox.logo}
                                                alt="Food Logo"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4  rounded-lg ">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">QBox Location</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            R{selectedBox.rowNo}-C{selectedBox.columnNo}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">QBox ID</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedBox.qboxId || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">SKU Code</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedBox.skuCode || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">Box Detail</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedBox.foodName || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <>
                                            <p className="text-xs font-medium text-gray-500">Restaurant Sku Name</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {selectedBox.foodSkuName || "N/A"}
                                            </p>
                                        </>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <>
                                            <p className="text-xs font-medium text-gray-500">Food Code</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {selectedBox.foodCode || "N/A"}
                                            </p>
                                        </>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        {selectedBox.foodName !== "EMPTY" && (
                                            <>
                                                <p className="text-xs font-medium text-gray-500">Entry Time</p><div className="text-emerald-700">
                                                    <DateTime date={selectedBox.entryTime} color="emerald" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {/* Status Indicator */}
                                <div className="flex justify-center">
                                    <div className={`
                            px-4 py-1.5 rounded-full text-sm font-medium shadow-sm
                            ${selectedBox.foodName === "EMPTY"
                                            ? "low-bg-color text-color"
                                            : "bg-green-100 text-green-700"
                                        }
                        `}>
                                        {selectedBox.foodName === "EMPTY" ? "Empty Box" : selectedBox.skuCode}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QBoxInventoryDtl;