import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { MapPin, Star, Building, Calendar, Hash, Info, ExternalLink, Timer } from 'lucide-react';
import { Card, Skeleton } from '@mui/material';
import { CardContent, CardHeader, CardTitle } from '@components/MasterCard';

const EntityDetails: React.FC = () => {
    const { entityId } = useParams<{ entityId: string }>();
    const { qboxEntityList } = useSelector((state: RootState) => state.qboxEntity);
    const [entityDetails, setEntityDetails] = useState<any>(null);

    useEffect(() => {
        const selectedEntity = qboxEntityList.find(
            (entity) => entity.qboxEntitySno.toString() === entityId
        );
        setEntityDetails(selectedEntity);
    }, [entityId, qboxEntityList]);
    const formatDateTime = (dateString) => {
        const date = new Date();
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }
        return date.toLocaleString();
    };

    if (!entityDetails) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-12 w-1/2 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-40 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="flex items-start space-x-4">
                <div className="p-3 bg-red-50 rounded-lg group-hover:low-bg-color transition-colors duration-300">
                    <Icon className="w-6 h-6 text-color" />
                </div>
                <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
                    <div className="text-lg font-semibold text-gray-900">{value || 'N/A'}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Card className="mb-8 overflow-hidden border-none shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-red-100 text-sm mb-2">Entity Details</div>
                                <CardTitle className="text-3xl text-white font-bold">
                                    {entityDetails.qboxEntityName}
                                </CardTitle>
                            </div>
                            {entityDetails.activeFlag !== undefined && (
                                <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${entityDetails.activeFlag
                                    ? 'bg-green-400/20 text-green-50'
                                    : 'bg-red-400/20 text-red-50'
                                    }`}>
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${entityDetails.activeFlag ? 'bg-green-400' : 'bg-red-400'
                                        }`} />
                                    {entityDetails.activeFlag ? 'Active' : 'Inactive'}
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem
                                icon={Star}
                                label="Rating"
                                value={entityDetails.rating}
                            />
                            <InfoItem
                                icon={MapPin}
                                label="Area"
                                value={entityDetails.areaName}
                            />
                            <InfoItem
                                icon={Building}
                                label="Entity Code"
                                value={entityDetails.entityCode}
                            />
                            <InfoItem
                                icon={Timer}
                                label="Created On"
                                value={formatDateTime(entityDetails.createdOn)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EntityDetails;