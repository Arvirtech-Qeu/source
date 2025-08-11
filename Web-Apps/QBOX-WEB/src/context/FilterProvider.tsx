import React, { createContext, useContext, useState, useEffect } from 'react';

interface DashboardCounts {
    inventoryCount: number;
    rejectCount: number;
    orderCount: number;
    loaderCount: number;
    isFiltered: boolean;
}

interface FilterContextType {
    qboxEntitySno: string;
    qboxEntityName: string;
    transactionDate: string;
    deliveryPartnerSno: number;
    roleId: number;
    areaName: string;
    dashboardCounts: DashboardCounts;
    setFilters: (filters: {
        qboxEntitySno: string;
        qboxEntityName: string;
        transactionDate: string;
        deliveryPartnerSno: number;
        roleId: number;
        areaName: string;
    }) => void;
    setDashboardCounts: (counts: DashboardCounts) => void;
    resetDashboardCounts: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [qboxEntitySno, setQboxEntitySno] = useState('');
    const [qboxEntityName, setQboxEntityName] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [deliveryPartnerSno, setDeliveryPartnerSno] = useState<number>(0);
    const [roleId, setRoleId] = useState<number>(0);
    const [areaName, setAreaName] = useState('');
    const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts>({
        inventoryCount: 0,
        rejectCount: 0,
        orderCount: 0,
        loaderCount: 0,
        isFiltered: false
    });

    const setFilters = (filters: {
        qboxEntitySno: string; qboxEntityName: string;
        transactionDate: string; deliveryPartnerSno: number; roleId: number; areaName: string
    }) => {
        console.log('Setting filters:', filters);
        setQboxEntitySno(filters.qboxEntitySno);
        setQboxEntityName(filters.qboxEntityName);
        setTransactionDate(filters.transactionDate);
        setDeliveryPartnerSno(filters.deliveryPartnerSno);
        setRoleId(filters.roleId);
        setAreaName(filters.areaName);
    };

    const updateDashboardCounts = (counts: DashboardCounts) => {
        setDashboardCounts(prev => ({
            ...prev,
            ...counts
        }));
    };

    const resetDashboardCounts = () => {
        setDashboardCounts({
            inventoryCount: 0,
            rejectCount: 0,
            orderCount: 0,
            loaderCount: 0,
            isFiltered: false
        });
    };

    useEffect(() => {
        console.log('Current context values:', {
            qboxEntitySno, qboxEntityName, transactionDate,
            deliveryPartnerSno, roleId, areaName,
            dashboardCounts
        });
    }, [qboxEntitySno, qboxEntityName, transactionDate, deliveryPartnerSno, roleId, areaName, dashboardCounts]);

    return (
        <FilterContext.Provider value={{
            qboxEntitySno, qboxEntityName, transactionDate,
            deliveryPartnerSno, roleId, areaName,
            dashboardCounts,
            setFilters,
            setDashboardCounts: updateDashboardCounts,
            resetDashboardCounts
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilterContext must be used within a FilterProvider');
    }
    return context;
};