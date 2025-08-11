import React from 'react';
import { Column, Table } from '@components/Table';
import { RotateCcw } from 'lucide-react';

interface PurchaseReportItem {
  total_cost: number;
  food_sku_code: string;
  food_sku_name: string;
  purchase_date: string;
  restaurant_id: number;
  qbox_entity_id: number;
  delivery_partner_id: number;
  latest_workflow_stage: number;
  total_ordered_quantity: number;
  total_accepted_quantity: number;
  latest_workflow_stage_description: string;
  restaurant_name: string;
  delivery_partner_name: string;
  qbox_entity_name?: string;
}

interface PurchaseReportTableProps {
  data: PurchaseReportItem[];
  loading: boolean;
  onResetFilters: () => void;
}

const WORKFLOW_STAGE_BADGES: Record<number, { label: string; className: string }> = {
  13: {
    label: 'Returned',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
  }
};

const DeliveryPartnerBadge: Record<string, string> = {
  'Zomato': 'bg-red-100 text-red-700',
  'Swiggy': 'bg-orange-100 text-orange-700'
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // ensures 2-digit day
  const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // 3-letter lowercase month
  const year = date.getFullYear();
  return `${day} - ${month} - ${year}`;
};


export const PurchaseReportTable: React.FC<PurchaseReportTableProps> = ({
  data,
  loading,
  onResetFilters
}) => {
  const columns: Column<PurchaseReportItem>[] = [
    {
      key: 'sno',
      header: 'S.No',
      sortable: true,
    },
    {
      key: 'qbox_entity_name',
      header: 'Delivery Location',
      sortable: true,
      render: (item: PurchaseReportItem) => item.qbox_entity_name || 'N/A',
    },
    {
      key: 'restaurant_name',
      header: 'Restaurant',
      sortable: true,
    },
    {
      key: 'food_sku_name',
      header: 'SKU Name',
      sortable: true,
    },
    {
      key: 'purchase_date',
      header: 'Purchase Date',
      sortable: true,
      render: (item: PurchaseReportItem) => formatDate(item.purchase_date) || 'N/A',
    },
    {
      key: 'total_ordered_quantity',
      header: 'Ordered Qty',
      sortable: true,
      render: (item: PurchaseReportItem) => (
        <span className="px-2 py-1 text-sm font-medium rounded text-blue-500 bg-blue-100">
          {item.total_ordered_quantity}
        </span>
      ),
    },
    {
      key: 'total_accepted_quantity',
      header: 'Accepted Qty',
      sortable: true,
      render: (item: PurchaseReportItem) => (
        <span className="px-2 py-1 text-sm font-medium rounded text-green-500 bg-green-100">
          {item.total_accepted_quantity}
        </span>
      ),
    },
    {
      key: 'delivery_partner_name',
      header: 'Delivery Aggregator',
      sortable: true,
      render: (item: PurchaseReportItem) => (
        <span className={`px-2 py-1 text-sm font-medium rounded ${DeliveryPartnerBadge[item.delivery_partner_name] || 'bg-gray-100 text-gray-700'
          }`}>
          {item.delivery_partner_name}
        </span>
      ),
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
        emptyStateMessage="No purchase records found"
        className="min-w-full" // Add this to ensure table takes full width
      />
    </div>
  );
};