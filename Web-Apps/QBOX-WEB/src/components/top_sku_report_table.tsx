// components/Table.tsx
import { useState, useMemo } from 'react';
import { Pagination } from './pagination';

interface Column<T = any> {
    key: string;
    header: string;
    width?: string;
    sortable?: boolean;
    render?: (value: any, row: T, index?: number) => React.ReactNode;
}

interface TableProps {
    columns: Column[];
    data: any[];
    rowsPerPage?: number;
    initialSortKey?: string;
    globalSearch?: boolean;
    loading?: boolean;
    emptyStateMessage?: string;
    className?: string;
}

export const TopSkuReportTable = ({
    columns,
    data,
    rowsPerPage = 10,
    initialSortKey = '',
    globalSearch = false,
    loading = false,
    emptyStateMessage = 'No data found',
    className = '',
}: TableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({
        key: initialSortKey,
        direction: 'asc',
    });

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const requestSort = (key: string) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 ${className}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={`flex justify-center items-center h-64 ${className}`}>
                <p className="text-gray-500">{emptyStateMessage}</p>
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width || ''}`}
                                onClick={() => column.sortable && requestSort(column.key)}
                            >
                                <div className="flex items-center">
                                    {column.header}
                                    {column.sortable && (
                                        <span className="ml-2">
                                            {sortConfig.key === column.key ? (
                                                sortConfig.direction === 'asc' ? '↑' : '↓'
                                            ) : (
                                                '↕'
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            // In your Table component's render method:
                            {columns.map((column) => (
                                <td
                                    key={`${rowIndex}-${column.key}`}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                    {column.render
                                        ? column.render(row[column.key], row, rowIndex)
                                        : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <Pagination
                    totalItems={data.length}
                    itemsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};