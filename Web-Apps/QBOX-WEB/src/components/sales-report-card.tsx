import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Package, Badge, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '@components/card2';

interface SalesData {
  order_date: string;
  food_sku_name: string;
  restaurant_id: number;
  total_revenue: number;
  qbox_entity_id: number;
  total_quantity: number;
  rank_by_revenue: number;
  delivery_partner_id: number;
}

interface SalesReportCardProps {
  data: SalesData[];
}

export function SalesReportCard({ data }: SalesReportCardProps) {
  // Calculate summary metrics
  const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
  const totalQuantity = data.reduce((sum, item) => sum + item.total_quantity, 0);
  const avgOrderValue = totalRevenue / totalQuantity;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);


  // Process data for the charts
  const chartData = Object.values(
    data.reduce((acc: any, item) => {
      if (!acc[item.order_date]) {
        acc[item.order_date] = {
          date: new Date(item.order_date).toLocaleDateString(),
          revenue: 0,
          quantity: 0,
        };
      }
      acc[item.order_date].revenue += item.total_revenue;
      acc[item.order_date].quantity += item.total_quantity;
      return acc;
    }, {})
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      </div>
      {/* Detailed Orders Table */}
      <Card className="overflow-hidden" onClick={undefined}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b border-gray-200 low-bg-color">
                  <th className="p-3">Date</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Quantity</th>
                  {/* <th className="p-3">Revenue</th>
                  <th className="p-3">Rank</th> */}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 text-center">
                    <td className="p-3">{new Date(item.order_date).toLocaleDateString()}</td>
                    <td className="p-3">{item.food_sku_name}</td>
                    <td className="p-3">{item.total_quantity}</td>
                    {/* <td className="p-3">₹{item.total_revenue.toLocaleString()}</td>
                    <td className="p-3 align-middle text-center">
                      <Badge className={
                        item.rank_by_revenue === 1
                          ? 'bg-green-100 text-green-700 inline-block'
                          : 'bg-gray-100 text-gray-700 inline-block'
                      }>
                        #{item.rank_by_revenue}
                      </Badge>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <select
                  className="px-2 py-1 border rounded-md text-sm"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded-full ${currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(currentPage - page) <= 1
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="text-gray-400">...</span>
                      )}
                      <button
                        className={`px-3 py-1 rounded-md ${currentPage === page
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  className={`p-2 rounded-full ${currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SalesReportCard;