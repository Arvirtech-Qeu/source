import React from 'react';
import MedalImg from '@assets/images/medal.png';

interface DeliveryAgent {
    profile: string;
    name: string;
    efficiency: number;
    deliveries: number;
    issues: number;
    location: 'Chennai' | 'Madurai' | 'Trichy';
}

const DeliveryAgentsGrid: React.FC = () => {
    const agents: DeliveryAgent[] = [
        {
            profile: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu6Ur2YSrHsYLbQhFX0Lmx4VnQPKkrqSAHQw&s",
            name: 'Rajkumar S',
            efficiency: 98,
            deliveries: 142,
            issues: 0,
            location: 'Chennai'
        },
        {
            profile: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu6Ur2YSrHsYLbQhFX0Lmx4VnQPKkrqSAHQw&s",
            name: 'Selvamani M',
            efficiency: 93,
            deliveries: 128,
            issues: 0,
            location: 'Madurai'
        },
        {
            profile: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu6Ur2YSrHsYLbQhFX0Lmx4VnQPKkrqSAHQw&s",
            name: 'Vignesh D',
            efficiency: 90,
            deliveries: 156,
            issues: 2,
            location: 'Trichy'
        }
    ];

    return (
        <div className="p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {agents.map((agent, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex mb-2 justify-between">
                            <div>
                                <img src={agent.profile} alt="" width={80}/>
                            </div>
                            <div>
                                <img src={MedalImg} alt=""/> 
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-sm font-semibold pr-2">{agent.name}</h3>
                            {agent.issues > 0 ? (
                                <div className="flex items-center text-gray">
                                    <span className="text-sm">{agent.issues} issues</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-gray">
                                    <span className="text-sm">No issues</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-start">
                            <div className="text-center">
                                <p className="text-sm font-bold">{agent.efficiency}%</p>
                                <p className="text-sm text-gray-500">Efficiency</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-color">{agent.deliveries}</p>
                                <p className="text-sm text-color">Deliveries</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <p className="text-sm text-color flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="text-color" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {agent.location}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliveryAgentsGrid;