import React, { useState, useMemo, useCallback, ReactNode } from 'react';
import NoData from '@assets/images/nodata.png';
import { EmptyState } from '@view/Loader/Common widgets/empty_state';

type ColumnRenderFunction<T> = (row: T) => ReactNode;
type SortFunction<T> = (a: T, b: T) => number;

export interface Column<T> {
    key: string;
    header: string | ReactNode;
    render?: ColumnRenderFunction<T>;
    sortable?: boolean;
    sortFunction?: SortFunction<T>;
    width?: string;
    className?: string;
    noDataMessage?: string;
    accessor?: keyof T; // Add this
    cell?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowsPerPage?: number;
    onRowClick?: (row: T) => void;
    initialSortKey?: string;
    initialSortDirection?: 'asc' | 'desc';
    globalSearch?: boolean;
    rowKey?: any;
    emptyStateMessage?: ReactNode;
    loading?: boolean;
    className?: string;
    onSelectionChange?: (selectedRows: T[]) => void;
    pageSizeOptions?: number[];
    noDataMessage?: string;
}

export function Table<T>({
    columns,
    data,
    rowsPerPage = 10,
    onRowClick,
    initialSortKey = '',
    initialSortDirection = 'asc',
    globalSearch = true,
    rowKey = 'id',
    emptyStateMessage = 'No data found',
    loading = false,
    className = '',
    onSelectionChange,
    pageSizeOptions = [5, 10, 20, 50],
    noDataMessage
}: TableProps<T>) {
    // State management
    const [sortConfig, setSortConfig] = useState({
        key: initialSortKey,
        direction: initialSortDirection
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(rowsPerPage);
    const [selectedRows, setSelectedRows] = useState<T[]>([]);

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!data.length) return [];

        return [...data].sort((a, b) => {
            const column = columns.find(col => col.key === sortConfig.key);

            // Custom sort function
            if (column?.sortFunction) {
                return sortConfig.direction === 'asc'
                    ? column.sortFunction(a, b)
                    : column.sortFunction(b, a);
            }

            // Default comparative sorting
            const valueA = a[sortConfig.key as keyof T];
            const valueB = b[sortConfig.key as keyof T];

            if (valueA == null) return sortConfig.direction === 'asc' ? 1 : -1;
            if (valueB == null) return sortConfig.direction === 'asc' ? -1 : 1;

            return sortConfig.direction === 'asc'
                ? String(valueA).localeCompare(String(valueB))
                : String(valueB).localeCompare(String(valueA));
        });
    }, [data, sortConfig, columns]);

    // Filtering logic
    const filteredData = useMemo(() => {
        if (!searchQuery) return sortedData;

        return sortedData.filter(row =>
            columns.some(col => {
                if (col.render) {
                    const renderedValue = col.render(row);
                    return String(renderedValue).toLowerCase().includes(searchQuery.toLowerCase());
                }

                const value = row[col.key as keyof T];
                return String(value).toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [sortedData, searchQuery, columns]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredData.length);
    const currentPageData = filteredData.slice(startIndex, endIndex);

    console.log('currentPageData', currentPageData);

    // Sorting handler
    const handleSort = useCallback((key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setCurrentPage(1);  // Reset to first page on sorting
    }, []);

    // Row selection handler
    const handleRowSelection = useCallback((row: T) => {
        const isSelected = selectedRows.some(
            selectedRow => getRowKey(selectedRow) === getRowKey(row)
        );

        const newSelectedRows = isSelected
            ? selectedRows.filter(selectedRow => getRowKey(selectedRow) !== getRowKey(row))
            : [...selectedRows, row];

        setSelectedRows(newSelectedRows);
        onSelectionChange?.(newSelectedRows);
    }, [selectedRows, onSelectionChange, rowKey]);

    // Page size change handler
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    // Get unique row key
    const getRowKey = useCallback((row: T): string => {
        if (typeof rowKey === 'function') return rowKey(row);
        return String(row[rowKey]);
    }, [rowKey]);

    // Table header rendering
    const renderTableHeader = () => (
        <thead>
            <tr className="border-b border-gray-200 low-bg-color">
                {onSelectionChange && (
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                        <input
                            type="checkbox"
                            checked={selectedRows.length === data.length}
                            onChange={() => {
                                setSelectedRows(selectedRows.length === data.length ? [] : [...data]);
                                onSelectionChange?.(selectedRows.length === data.length ? [] : [...data]);
                            }}
                        />
                    </th>
                )}
                {columns.map((col, index) => (
                    <th
                        key={index}
                        className={`px-4 py-3 text-left font-medium text-color ${col.sortable !== false ? 'cursor-pointer' : ''} ${col.className || ''}`}
                        style={{ width: col.width }}
                        onClick={() => col.sortable !== false && handleSort(col.key)}
                    >
                        <div className="flex items-center">
                            {col.header}
                            {col.sortable !== false && (
                                <span className={`ml-1 ${sortConfig.key === col.key ? 'opacity-100' : 'opacity-0'}`}>
                                    {sortConfig.key === col.key && sortConfig.direction === 'asc' ? '↑' : '↓'}
                                </span>
                            )}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );

    // Table body rendering with loading and empty state
    const renderTableBody = () => {
        if (loading) return (
            <tbody>
                <tr>
                    <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className="text-center py-4">
                        Loading...
                    </td>
                </tr>
            </tbody>
        );

        if (!currentPageData.length) return null; // We'll handle empty state outside table

        return (
            <tbody>
                {currentPageData.map((row, rowIndex) => (
                    <tr
                        key={getRowKey(row)}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        onClick={() => onRowClick?.(row)}
                    >
                        {onSelectionChange && (
                            <td className="px-4 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.some(
                                        selectedRow => getRowKey(selectedRow) === getRowKey(row)
                                    )}
                                    onChange={() => handleRowSelection(row)}
                                />
                            </td>
                        )}

                        {columns.map((col, colIndex) => {
                            const isSnoColumn = col.key === 'sno';
                            const cellContent = isSnoColumn
                                ? (startIndex + rowIndex + 1)
                                : (col.render ? col.render(row) : String(row[col.key as keyof T] ?? '--'));

                            return (
                                <td
                                    key={colIndex}
                                    className={`px-4 py-4 ${col.className || ''}`}
                                    style={{ width: col.width }}
                                >
                                    {cellContent}
                                </td>
                            );
                        })}
                    </tr>
                ))}

            </tbody>
        );
    };

    return (
        <div className={`table-container ${className}`}>
            {globalSearch && (
                <div className="mb-4 flex justify-end">
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder="Search by SKU name,Code,Restaurant,location..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className=" px-10 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {currentPageData.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            {renderTableHeader()}
                            {renderTableBody()}
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Show</span>
                            <select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                className="text-sm border rounded px-2 py-1 w-[55px]"
                            >
                                {pageSizeOptions.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            <span className="text-sm text-gray-600">entries</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm">
                                Page {currentPage} of {totalPages || 1}
                                ({startIndex + 1}-{endIndex} of {filteredData.length})
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState title={noDataMessage} />
            )}
        </div>
    );
}