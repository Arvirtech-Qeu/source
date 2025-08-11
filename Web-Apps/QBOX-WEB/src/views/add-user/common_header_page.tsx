"use client"

import React from 'react';
import { Search } from 'lucide-react';

interface CommonHeaderPageProps {
    searchQuery?: string;
    placeholder?: string;
    setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
    // Filter props
    region?: string;
    setRegion?: React.Dispatch<React.SetStateAction<string>>;
    dateRange?: string;
    setDateRange?: React.Dispatch<React.SetStateAction<string>>;
    status?: string;
    setStatus?: React.Dispatch<React.SetStateAction<string>>;
    onApplyFilters?: () => void;
}

const CommonHeaderPage: React.FC<CommonHeaderPageProps> = ({
    searchQuery,
    setSearchQuery,
    placeholder,
    region,
    setRegion,
    dateRange,
    setDateRange,
    status,
    setStatus,
    onApplyFilters,
}) => {
    // Handle date range change (you might want to use a date picker library in reality)
    const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (setDateRange) {
            setDateRange(e.target.value);
        }
    };

    // Handle region change
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (setRegion) {
            setRegion(e.target.value);
        }
    };

    // Handle status change
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (setStatus) {
            setStatus(e.target.value);
        }
    };

    // Handle apply filters click
    const handleApplyClick = () => {
        if (onApplyFilters) {
            onApplyFilters();
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            {/* Search Bar */}
            {setSearchQuery && (
                <div className="flex-1 relative min-w-[200px]">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-color"
                        placeholder={placeholder || "Search by name, ID or category"}
                    />
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {/* Region Dropdown */}
                {setRegion && (
                    <select
                        value={region || ''}
                        onChange={handleRegionChange}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-red-100 focus:border-color"
                    >
                        <option value="">All Regions</option>
                        <option value="South Region">South Region</option>
                        <option value="North Region">North Region</option>
                        <option value="East Region">East Region</option>
                        <option value="West Region">West Region</option>
                    </select>
                )}

                {/* Date Range Input */}
                {setDateRange && (
                    <input
                        type="text"
                        value={dateRange || ''}
                        onChange={handleDateRangeChange}
                        onFocus={() => {
                            // In a real implementation, you might show a date picker here
                            if (setDateRange && !dateRange) {
                                setDateRange(new Date().toISOString().split('T')[0]);
                            }
                        }}
                        placeholder="Date Range"
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-red-100 focus:border-color"
                    />
                )}

                {/* Status Dropdown */}
                {setStatus && (
                    <select
                        value={status || ''}
                        onChange={handleStatusChange}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-red-100 focus:border-color"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>
                )}

                {/* Apply Button */}
                {onApplyFilters && (
                    <button
                        onClick={handleApplyClick}
                        className="bg-color  text-white px-4 py-2 rounded-lg"
                    >
                        Apply
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommonHeaderPage;