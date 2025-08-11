import React, { useState } from 'react';
import { Badge } from "./Badge";
import { Card } from "./card2";
import {
  AlertCircle,
  Package,
  Calendar,
  Store,
  Building
} from 'lucide-react';

interface ReportItem {
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
}

interface PurchaseReportCardProps {
  data: ReportItem[];
}

const WORKFLOW_STAGE_BADGES: Record<number, { label: string; className: string }> = {
  13: {
    label: 'Returned',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
  }
};

const DeliveryPartnerIcon: Record<string, string> = {
  'Zomato': 'bg-red-50 text-color',
  'Swiggy': 'bg-orange-50 text-orange-600'
};

export function PurchaseReportCard({ data }: PurchaseReportCardProps) {
  const [filter, setFilter] = useState('all');

  const filteredData = filter === 'all'
    ? data
    : data.filter(item => item.delivery_partner_name.toLowerCase() === filter);

  return (
    <div className="space-y-6">
      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item, index) => (
          // {filteredData.map((item, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300" onClick={undefined}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {item.food_sku_code}
                  </span>
                  <Badge variant="outline" className={WORKFLOW_STAGE_BADGES[item.latest_workflow_stage]?.className}>
                    {item.latest_workflow_stage_description}
                  </Badge>
                </div>
                <Badge className={DeliveryPartnerIcon[item.delivery_partner_name]}>
                  {item.delivery_partner_name}
                </Badge>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {item.food_sku_name}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(item.purchase_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span className="text-sm">{item.restaurant_name}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100" onClick={undefined}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-700">{item.total_ordered_quantity}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100" onClick={undefined}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">Accepted Orders</p>
                      <p className="text-2xl font-bold text-green-700">{item.total_accepted_quantity}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PurchaseReportCard;