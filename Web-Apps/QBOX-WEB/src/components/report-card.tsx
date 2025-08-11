import React from 'react';
import { Badge } from "./Badge";
import { Card } from "./card2";


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
}

interface ReportCardProps {
  data: ReportItem[];
}

const WORKFLOW_STAGE_BADGES = {
  13: {
    label: 'Returned',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  }
};

export function ReportCard({ data }: ReportCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-red-100/50 overflow-hidden border border-red-100">
      <div className="bg-gradient-to-r from-red-600 to-red-400 p-4">
        <h2 className="text-lg font-medium text-white/90 tracking-wide flex items-center gap-2">
          <svg className="w-5 h-5 text-white/75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Daily Food Report
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 hover:border-orange-200"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">SKU Code:</span>
                  <span className="ml-2 font-mono text-orange-600">{item.food_sku_code}</span>
                </div>
                <Badge
                  variant="outline"
                  className={WORKFLOW_STAGE_BADGES[item.latest_workflow_stage as keyof typeof WORKFLOW_STAGE_BADGES]?.className}
                >
                  {item.latest_workflow_stage_description}
                </Badge>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {item.food_sku_name}
                </h3>
                <span className="text-sm text-gray-500">
                  Purchase Date: {new Date(item.purchase_date).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-orange-50/50 transition-colors">
                  <span className="text-sm text-gray-500">Ordered</span>
                  <p className="text-lg font-semibold text-gray-900">{item.total_ordered_quantity}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-orange-50/50 transition-colors">
                  <span className="text-sm text-gray-500">Accepted</span>
                  <p className="text-lg font-semibold text-gray-900">{item.total_accepted_quantity}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
                <span>Restaurant ID: {item.restaurant_id}</span>
                <span>Partner ID: {item.delivery_partner_id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportCard;
