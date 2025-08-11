import { UserCog, Building, Package, Leaf, ChevronUp, Truck } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';


interface DashboardPanelProps {
    roleName: string;
    deliveryPartnerLogo?: any;
    deliveryPartnerName: any;
    stateList?: { length: number };
    cityList?: { length: number };
    areaList?: { length: number };
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
    roleName,
    deliveryPartnerLogo,
    deliveryPartnerName,
    stateList,
    cityList,
    areaList,

}) => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center">
            <div className="relative w-full max-w-5xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20" />
                <div className="relative grid grid-cols-3 gap-8 p-12">
                    <div className="col-span-1 space-y-6">
                        {roleName === 'Aggregator Admin' ? (
                            <div className="p-2 custom-gradient-right rounded-2xl border border-white/20 shadow-lg flex items-center">
                                <div className="w-16 h-16 mr-4 rounded-full bg-white/20 flex items-center justify-center">
                                    <img
                                        src={deliveryPartnerLogo ?? "/assets/images/logo.png"}
                                        alt="Logo"
                                        className="h-14 w-14 object-cover rounded-full border-4 border-white"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/assets/images/logo.png";
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-white uppercase">{deliveryPartnerName}</h4>
                                    <p className="text-sm text-white/80">{roleName}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-2 custom-gradient-right rounded-2xl border border-white/20 shadow-lg flex items-center">
                                    <div className="w-16 h-16 mr-4 rounded-full bg-white/20 flex items-center justify-center">
                                        <UserCog className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-white uppercase">{roleName}</h4>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
                            onClick={() => navigate('/orders')}>
                            <div className="w-12 h-12 mb-4 rounded-xl bg-color/10 flex items-center justify-center">
                                <Truck className="w-6 h-6 text-color" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Orders</h4>
                            <p className="text-sm text-gray-600">
                                Track stock levels and monitor Orders
                            </p>
                        </div>

                        <div
                            className="p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg cursor-pointer"
                            onClick={() => navigate('/inventory')}
                        >
                            <div className="w-12 h-12 mb-4 rounded-xl low-bg-color flex items-center justify-center">
                                <Package className="w-6 h-6 text-color" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Inventory</h4>
                            <p className="text-sm text-gray-600">
                                Track stock levels and monitor product movement
                            </p>
                        </div>


                    </div>

                    {/* Center Panel - Main Content */}
                    <div className="col-span-2 p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl low-bg-color backdrop-blur-sm border border-white/20 shadow-xl">
                                <Leaf className="w-10 h-10 text-color" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 bg-clip-text">
                                Welcome to Your Dashboard
                            </h2>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Select your preferred filters above to begin exploring your operational insights and analytics.
                            </p>
                        </div>

                        {/* Interactive Elements */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {['States', 'Cities', 'Areas'].map((item, index) => (
                                <div
                                    key={item}
                                    className="group relative p-4 bg-white/30 rounded-xl border border-white/20 shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="absolute inset-0 low-bg-color rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative text-center">
                                        <span className="block text-2xl font-bold text-gray-400 mb-1">
                                            {index === 0 ? stateList?.length || '0' :
                                                index === 1 ? cityList?.length || '0' :
                                                    areaList?.length || '0'}
                                        </span>
                                        <span className="text-sm text-gray-600">{item}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Hint */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="animate-bounce">
                                <ChevronUp className="w-6 h-6 text-color" />
                            </div>
                            <span className="text-sm text-gray-500">
                                Use filters above to start your exploration
                            </span>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-color/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
};

export default DashboardPanel;