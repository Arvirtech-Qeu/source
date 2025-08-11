import React, { createContext, useContext, useState } from 'react';

// Step 1: Create the context
interface CCTVData {
    qboxEntitySno: string | null;
    transactionDate: string | null;
    url: string | null;
    activeTab: string | null;
    qboxEntityName: string | null;
}

interface CCTVContextType {
    cctvData: CCTVData;
    setCCTVData: React.Dispatch<React.SetStateAction<CCTVData>>;
}

const CCTVContext = createContext<CCTVContextType>({
    cctvData: {
        qboxEntitySno: null,
        transactionDate: null,
        url: null,
        activeTab: null,
        qboxEntityName: null,
    },
    setCCTVData: () => { },
});

// Step 2: Create the Provider
export const CCTVProvider = ({ children }) => {
    const [cctvData, setCCTVData] = useState<CCTVData>({
        qboxEntitySno: null,
        transactionDate: null,
        url: null,
        activeTab: null,
        qboxEntityName: null
    });
    console.log("CCTVProvider", cctvData);

    return (
        <CCTVContext.Provider value={{ cctvData, setCCTVData }}>
            {children}
        </CCTVContext.Provider>
    );


};

// Step 3: Custom hook to use the context
export const useCCTV = () => useContext(CCTVContext);