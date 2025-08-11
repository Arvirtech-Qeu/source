import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  UserPlus,
  Package,
  Clock,
  MoreVerticalIcon
} from 'lucide-react';
import { IconButton } from '@mui/material';

interface ActivityItem {
  id: string;
  type: 'order' | 'alert' | 'assignment' | 'inventory';
  description?: string;
  timestamp: string;
  meta?: {
    by?: string;
    role?: string;
    at?: string;
  };
}

interface RecentActivitiesGridProps {
  activities: any;
  title?: string;
  showFooter?: boolean;
}

const RecentActivitiesGrid: React.FC<RecentActivitiesGridProps> = ({
  activities,
  showFooter = true
}) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order': return <CheckCircle className="w-5 h-5 text-color" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-color" />;
      case 'assignment': return <UserPlus className="w-5 h-5 text-color" />;
      case 'inventory': return <Package className="w-5 h-5 text-color" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 low-bg-color p-3 rounded-full">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.timestamp}
                  {activity.meta?.by && ` by ${activity.meta.by}`}
                  {activity.meta?.role && ` (${activity.meta.role})`}
                  {activity.meta?.at && ` at ${activity.meta.at}`}
                </p>

              </div>
              <IconButton>
                <MoreVerticalIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivitiesGrid;