
import React, { useState } from "react";
import { Truck, CookingPot, Salad, Handshake, Building, Cable, TableCellsMerge } from "lucide-react";
import Infrastructures from "@view/Q-box-master/infrastructure";
import InfraProperties from "@view/Q-box-master/infra-properties";
import BoxCell from "./box-cell";

interface InfraMastersHubProps {
    isHovered: any;
}

const InfraMastersHub: React.FC<InfraMastersHubProps> = ({ isHovered }) => {

    const [activeTab, setActiveTab] = useState("infrastructure"); // Track active tab
    const [selectedInfraSno, setSelectedInfraSno] = useState<number | null>(null); // Store infraSno

    console.log(selectedInfraSno)

    return (
        // <div className="w-full h-full">
        <div>
            {/* Tabs Navigation */}
            <div className="mb-8 border-b border-gray-200">
                <nav className="flex -mb-px">
                    <button
                        onClick={() => setActiveTab("infrastructure")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "infrastructure"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <Building className="w-4 h-4" />
                        Asset
                    </button>

                    <button
                        onClick={() => setActiveTab("infra-properties")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "infra-properties"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <Cable className="w-4 h-4" />
                        Asset Properties
                    </button>

                    <button
                        onClick={() => setActiveTab("box-cell")}
                        className={`py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm 
                            ${activeTab === "box-cell"
                                ? "border-color text-color"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        <TableCellsMerge className="w-4 h-4" />
                        Cell Box Properties
                    </button>

                </nav>
            </div>

            {/* Tabs Content Rendering */}
            <div className="">
                {activeTab === "infrastructure" && (
                    <Infrastructures
                        setActiveTab={setActiveTab}
                        setSelectedInfraSno={setSelectedInfraSno}
                    />
                )}
                {activeTab === "infra-properties" && <InfraProperties infraSno={selectedInfraSno} />}
                {activeTab === "box-cell" && <BoxCell isHovered={undefined} />}
            </div>
        </div>
    );
};

export default InfraMastersHub;
