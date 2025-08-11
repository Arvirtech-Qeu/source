
type MasterCardProps = {
    children?: React.ReactNode; // Allow any valid React children
    className?: string; // Optional className for additional styles
    onClick?: () => void; // Optional onClick handler
};

export const MasterCard: React.FC<MasterCardProps> = ({ children, className = '', onClick }) => (
    <div
        className={`bg-white rounded-lg shadow-sm ${className}`}
        onClick={onClick}
    >
        {children}
    </div>
);



export const CardHeader = ({ children, className = '' }) => (
    <div className={`p-4 border-b ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
    </h3>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);


