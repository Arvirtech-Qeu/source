import { Pencil, Trash2, MapPin, Home } from "lucide-react";
import { useState } from "react";

type Column = {
    key: string;
    icon?: JSX.Element;
    label?: string;
};

type CardProps = {
    data: any;
    columns: Column[];
    headerName: string | undefined;
    onEdit?: () => void;
    onDelete?: () => void;
    editIcon?: JSX.Element;
    deleteIcon?: JSX.Element;
    defaultIcon?: JSX.Element;
    homeIcon?: JSX.Element;
};

const Card: React.FC<CardProps> = ({
    data,
    columns = [],
    headerName,
    onEdit,
    onDelete,
    editIcon = <Pencil size={16} className="text-gray-600" />,
    deleteIcon = <Trash2 size={16} className="text-color" />,
    defaultIcon = <MapPin size={16} className="text-gray-400" />,
    homeIcon = <Home className="text-orange-500 mr-2" size={24} />,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg transform -translate-y-1' : ''
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="border-l-4 border-color">
                {/* Header with background */}
                <div className={`bg-gradient-to-r from-red-100 to-white p-2 transition-colors duration-300 ${isHovered ? 'from-red-300' : 'from-red-100'
                    }`}>
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex items-center min-w-0">
                            <div className={`transition-transform duration-300 flex-shrink-0 ${isHovered ? 'scale-110' : ''
                                }`}>
                                {homeIcon}
                            </div>
                            <h3 className="text-xl text-gray-800 truncate">
                                {headerName}
                            </h3>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            {onEdit && (
                                <button
                                    onClick={onEdit}
                                    className="p-1.5 hover:bg-white/80 rounded-full transition-all duration-200 hover:shadow-sm"
                                    aria-label="Edit"
                                >
                                    {editIcon}
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="p-1.5 hover:bg-red-50 rounded-full transition-all duration-200 hover:shadow-sm"
                                    aria-label="Delete"
                                >
                                    {deleteIcon}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="p-2 space-y-2">
                    {columns.map(({ key, icon, label }) => (
                        <div key={key}
                            className="flex items-center text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200">
                            <div className="text-gray-500 flex-shrink-0">
                                {icon || defaultIcon}
                            </div>
                            <span className="ml-2 min-w-0">
                                {label && (
                                    <span className="font-medium text-gray-900">{label}: </span>
                                )}
                                <span className="text-gray-600">{data[key]}</span>
                            </span>
                        </div>
                    ))}

                    {/* Footer - Only show if activeFlag is defined */}
                    {typeof data.activeFlag !== 'undefined' && (
                        <div className="pt-2 mt-2 border-t border-gray-100">
                            {data.activeFlag ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium low-bg-color text-red-700">
                                    <span className="w-2 h-2 rounded-full bg-color mr-1"></span>
                                    InActive
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;