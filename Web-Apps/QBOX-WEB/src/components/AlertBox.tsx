import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

// Enhanced AlertBox with multiple types and icon support
export const AlertBox = ({
    message,
    type = 'info',
    className = '',
    onClose
}) => {
    // Define alert styles based on type
    const alertStyles = {
        info: 'bg-blue-50 border-blue-500 text-blue-800',
        success: 'bg-green-50 border-green-500 text-green-800',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
        error: 'bg-red-50 border-color text-red-800'
    };

    // Define icons for each type
    const alertIcons = {
        info: <Info className="w-5 h-5 text-blue-500" />,
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        error: <XCircle className="w-5 h-5 text-color" />
    };

    return (
        <div
            className={`
        flex items-center justify-between 
        p-4 border-l-4 rounded-md 
        ${alertStyles[type]} 
        ${className}
      `}
        >
            <div className="flex items-center space-x-3">
                {alertIcons[type]}
                <span className="font-medium">{message}</span>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <XCircle className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};
