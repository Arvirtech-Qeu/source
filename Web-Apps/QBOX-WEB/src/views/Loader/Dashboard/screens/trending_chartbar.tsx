import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { useThemeColors } from '@view/Loader/Theme Settings/usetheme_hook';

interface DataItem {
  name: string;
  value: number;
  inventory?: number;
  orders?: number;
  alerts?: number;
}

const data: DataItem[] = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600, inventory: 1245, orders: 87, alerts: 12 },
  { name: 'Apr', value: 250 },
  { name: 'May', value: 800, inventory: 1245, orders: 87, alerts: 12 },
  { name: 'Jun', value: 200 },
  { name: 'Jul', value: 400 },
  { name: 'Aug', value: 350 },
  { name: 'Sep', value: 500 }
];

const DashboardGraph = () => {
  const [selectedMonth, setSelectedMonth] = useState('Month');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const { primary, primaryRgb } = useThemeColors();

  // Memoized cells for better performance
  const barCells = useMemo(() => (
    data.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={entry.name === 'May' ? primary : `rgba(${primaryRgb}, 0.1)`}
      />
    ))
  ), [primary, primaryRgb]);

  return (
    <div 
      className="p-6 rounded-2xl border"
      style={{
        backgroundColor: `rgba(${primaryRgb}, 0.1)`,
        borderColor: primary
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-full"
            style={{ backgroundColor: `rgba(${primaryRgb}, 0.1)` }}
          >
            <TrendingUp style={{ color: primary }} />
          </div>
          <div>
            <h2 className="font-bold">Graphs and Analysis</h2>
            <p className="text-sm text-gray-500">Active Hotboxes per month</p>
          </div>
        </div>
        
        {/* Month selector */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          >
            {selectedMonth}
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showMonthDropdown && (
            <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-md z-10 w-32">
              {['Month', 'Quarter', 'Year'].map(option => (
                <div
                  key={option}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSelectedMonth(option);
                    setShowMonthDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip 
            content={({ active, payload }) => (
              <div className="bg-white p-3 rounded-lg shadow border">
                {active && payload?.length && (
                  <>
                    <p style={{ color: primary }}>• Inventory: {payload[0].payload.inventory}</p>
                    <p style={{ color: primary }}>• Orders: {payload[0].payload.orders}</p>
                    <p style={{ color: primary }}>• Alerts: {payload[0].payload.alerts}</p>
                  </>
                )}
              </div>
            )}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            barSize={30}
          >
            {barCells}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardGraph;