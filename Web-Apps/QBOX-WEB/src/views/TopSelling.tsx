import { Clock, BarChart, ShoppingBag, Store, ChartNoAxesCombined } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { useState, useEffect } from 'react';
import { apiService } from '@services/apiService';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface TopSellingItem {
    ranking: number;
    restaurant_name: string;
    total_sold_count: number;
    avg_food_duration: number;
    food_sku_description: string;
    partner_food_sku_sno: number;
    final_performance_score: number;
    normalized_waiting_score: number;
    normalized_sales_percentage: number;
}


interface TopSellingProps {
    isHovered: any;
}
const TopSelling: React.FC<TopSellingProps> = ({ isHovered }) => {
    const [data, setData] = useState<TopSellingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopSellingItems = async () => {
            try {
                const PORT_NUMBER = import.meta.env.VITE_API_QBOX_MASTER_PORT;
                const PREFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

                const response = await apiService.post<{ data: TopSellingItem[], isSuccess: boolean }>(
                    '/get_best_selling_food',
                    {},  // empty body for this POST request
                    PORT_NUMBER,
                    PREFIX_URL
                );

                if (response.isSuccess) {
                    setData(response.data);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                console.error('Error fetching top selling items:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchTopSellingItems();
    }, []);

    // Enhanced Bar Chart configuration
    const barChartData = {
        labels: data.map(item => item.food_sku_description),
        datasets: [
            {
                label: 'Sales Performance',
                data: data.map(item => item.normalized_sales_percentage),
                backgroundColor: 'rgba(147, 51, 234, 0.5)',
                borderColor: 'rgba(147, 51, 234, 0.8)',
                borderWidth: 1.5,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: 'rgba(147, 51, 234, 0.7)',
            },
            {
                label: 'Waiting Score',
                data: data.map(item => item.normalized_waiting_score),
                backgroundColor: 'rgba(236, 72, 153, 0.5)',
                borderColor: 'rgba(236, 72, 153, 0.8)',
                borderWidth: 1.5,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: 'rgba(236, 72, 153, 0.7)',
            }
        ]
    };

    const barChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        height: 300,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        weight: '500',
                        size: 12
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    boxWidth: 8,
                    boxHeight: 8,
                }
            },
            title: {
                display: true,
                text: 'Performance Metrics',
                color: '#4B5563',
                font: {
                    size: 16,
                    weight: '600',
                    family: "'Inter', sans-serif"
                },
                padding: { bottom: 20 }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1F2937',
                bodyColor: '#4B5563',
                bodyFont: {
                    size: 12
                },
                titleFont: {
                    size: 13,
                    weight: '600'
                },
                borderColor: '#E5E7EB',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                usePointStyle: true,
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: ${Math.round(context.raw)}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    display: true,
                    drawBorder: false,
                    color: 'rgba(0, 0, 0, 0.05)',
                    lineWidth: 0.5
                },
                ticks: {
                    callback: (value: number) => `${value}%`,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    },
                    padding: 8,
                    color: '#6B7280'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    },
                    maxRotation: 45,
                    minRotation: 45,
                    color: '#6B7280',
                    padding: 8
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
        },
    };

    // Doughnut Chart Configuration
    const doughnutData = {
        labels: data.map(item => item.food_sku_description),
        datasets: [{
            data: data.map(item => item.total_sold_count),
            backgroundColor: [
                'rgba(147, 51, 234, 0.6)',
                'rgba(236, 72, 153, 0.6)',
                'rgba(59, 130, 246, 0.6)',
                'rgba(16, 185, 129, 0.6)',
                'rgba(245, 158, 11, 0.6)',
                'rgba(99, 102, 241, 0.6)',
                'rgba(239, 68, 68, 0.6)',
            ],
            borderColor: [
                'rgba(147, 51, 234, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(99, 102, 241, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
            borderWidth: 1.5,
            hoverOffset: 12,
            hoverBorderWidth: 2,
        }]
    };

    const doughnutOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        height: 300,
        cutout: '75%',
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        weight: '500',
                        size: 11
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                }
            },
            title: {
                display: true,
                text: 'Sold Orders Distribution',
                color: '#4B5563',
                font: {
                    size: 16,
                    weight: '600',
                    family: "'Inter', sans-serif"
                },
                padding: { bottom: 15 }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1F2937',
                bodyColor: '#4B5563',
                bodyFont: {
                    size: 12
                },
                titleFont: {
                    size: 13,
                    weight: '600'
                },
                borderColor: '#E5E7EB',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                usePointStyle: true,
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 1500,
            easing: 'easeInOutQuart'
        }
    };

    return (
        <div className="min-h-screen">
            <div className="custom-gradient-left h-32" />

            <div className={`-mt-24 ${isHovered ? 'pl-32 pr-14' : 'pl-16 pr-14 '}`}>
                <div className="max-w-8xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6">


                        <div className="flex items-center gap-4  rounded-xl">
                            <div className="low-bg-color p-3 rounded-xl">
                                <ChartNoAxesCombined className="w-8 h-8 text-color" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800"> Top Selling Items</h1>
                                <p className="text-gray-600">Manage and track your Purchase Reports</p>
                            </div>
                        </div>
                    </div>
                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4  mb-8">
                        {/* Bar Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-500 h-[500px]">
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>

                        {/* Doughnut Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-500 h-[500px]">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
                        {data.map((item) => (
                            <div
                                key={item.partner_food_sku_sno}
                                className="bg-white backdrop-blur-sm bg-opacity-90 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                            >
                                <div className="p-6">
                                    {/* Restaurant Name */}
                                    <div className="flex items-center mb-4">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm">
                                            <Store className="w-4 h-4 mr-2" />
                                            {item.restaurant_name}
                                        </span>
                                    </div>

                                    {/* Food Item Name */}
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 hover:text-purple-600 transition-colors duration-200">
                                        {item.food_sku_description}
                                    </h2>

                                    {/* Preparation Time */}
                                    <div className="flex items-center mb-4 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <Clock className="w-5 h-5 mr-2 text-orange-500" />
                                        <span className="text-sm">
                                            Avg. Inventory Time: <span className="font-semibold text-orange-600">{Math.round(item.avg_food_duration / 60)} minutes</span>
                                        </span>
                                    </div>

                                    {/* Performance Score */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-600">Performance Score</span>
                                            <span className="text-sm font-bold text-purple-600">
                                                {Math.round(item.final_performance_score)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 p-0.5">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                                                style={{ width: `${Math.min(item.final_performance_score, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Bottom Stats */}
                                    <div className="flex items-center justify-between mt-6 space-x-4">
                                        <div className="flex items-center">
                                            <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                                                <ShoppingBag className="w-4 h-4 mr-1" />
                                                {item.total_sold_count} Orders
                                            </span>
                                        </div>
                                        <div className="flex items-center px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white">
                                            <BarChart className="w-4 h-4 mr-1" />
                                            <span className="text-sm font-medium">
                                                Sales: {Math.round(item.normalized_sales_percentage)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TopSelling;