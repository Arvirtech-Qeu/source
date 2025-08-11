import React from 'react';
import { Column, Table } from '@components/Table';
import { RotateCcw } from 'lucide-react';

interface SalesReportItem {
  order_date: string;
  food_sku_name: string;
  restaurant_id: number;
  total_revenue: number;
  qbox_entity_id: number;
  total_quantity: number;
  rank_by_revenue: number;
  delivery_partner_id: number;
  restaurant_name?: string;
  delivery_partner_name?: string;
  qbox_entity_name?: string;
}

interface SalesReportTableProps {
  data: SalesReportItem[];
  loading: boolean;
  onResetFilters: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // ensures 2-digit day
  const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // 3-letter lowercase month
  const year = date.getFullYear();
  return `${day} - ${month} - ${year}`;
};



export const SalesReportTable: React.FC<SalesReportTableProps> = ({
  data,
  loading,
  onResetFilters
}) => {

  const columns: Column<SalesReportItem>[] = [
    {
      key: 'sno',
      header: 'S.No',
      sortable: false,
    },
    {
      key: 'qbox_entity_name',
      header: 'Delivery Location',
      sortable: true,
      render: (item: SalesReportItem) => item.qbox_entity_name || 'N/A',
    },
    {
      key: 'restaurant_name',
      header: 'Restaurant',
      sortable: true,
      render: (item: SalesReportItem) => item.restaurant_name || 'N/A',
    },
    {
      key: 'food_sku_name',
      header: 'Restaurant SKU',
      sortable: true,
    },
    {
      key: 'total_quantity',
      header: 'Sold Count',
      sortable: true,
    },
    {
      key: 'total_revenue',
      header: 'Total Revenue',
      sortable: true,
    },
    {
      key: 'order_date',
      header: 'Sales Order Date',
      sortable: false,
      render: (item: SalesReportItem) => item.order_date
        ? formatDate(item.order_date)
        : 'N/A',
    },

    {
      key: 'delivery_partner_name',
      header: 'Delivery Aggregator',
      sortable: true,
      render: (item: SalesReportItem) => item.delivery_partner_name || 'N/A',
    },

  ];

  return (

    <div className="w-full overflow-x-auto">
      <Table
        columns={columns}
        data={data}
        rowsPerPage={10}
        initialSortKey="s_no"
        globalSearch={false}
        loading={loading}
        emptyStateMessage="No sales records found"
        className="min-w-full"
      />
    </div>
  );
};