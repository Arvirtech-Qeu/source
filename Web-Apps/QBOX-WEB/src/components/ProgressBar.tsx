import React from 'react';
import {
    Check,
    X,
    ArrowRight,
    Info,
    ChevronUp,
    ChevronDown
} from 'lucide-react';

interface ProgressBarProps {
    progress: number;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    labelPosition?: 'inside' | 'outside';
    gradient?: boolean;
    animated?: boolean;
    striped?: boolean;
    status?: 'normal' | 'success' | 'error' | 'warning';
    tooltip?: string;
    onChange?: (progress: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress = 0,
    color = 'blue',
    size = 'md',
    showLabel = false,
    labelPosition = 'outside',
    gradient = false,
    animated = false,
    striped = false,
    status = 'normal',
    tooltip,
    onChange
}) => {
    // Ensure progress is between 0 and 100
    const safeProgress = Math.min(100, Math.max(0, progress));

    // Color and styling configurations
    const colorVariants = {
        blue: {
            base: 'bg-blue-500',
            gradient: 'from-blue-500 to-blue-700',
            text: 'text-blue-700'
        },
        green: {
            base: 'bg-green-500',
            gradient: 'from-green-500 to-green-700',
            text: 'text-green-700'
        },
        red: {
            base: 'bg-color',
            gradient: 'from-red-500 to-red-700',
            text: 'text-red-700'
        },
        yellow: {
            base: 'bg-yellow-500',
            gradient: 'from-yellow-500 to-yellow-700',
            text: 'text-yellow-700'
        },
        purple: {
            base: 'bg-purple-500',
            gradient: 'from-purple-500 to-purple-700',
            text: 'text-purple-700'
        }
    };

    // Size configurations
    const sizeVariants = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4'
    };

    // Status icons
    const statusIcons = {
        normal: null,
        success: <Check className="w-5 h-5 text-green-500" />,
        error: <X className="w-5 h-5 text-color" />,
        warning: <Info className="w-5 h-5 text-yellow-500" />
    };

    // Progressive increase/decrease handlers
    const handleIncrease = () => {
        if (onChange) {
            onChange(Math.min(100, safeProgress + 10));
        }
    };

    const handleDecrease = () => {
        if (onChange) {
            onChange(Math.max(0, safeProgress - 10));
        }
    };

    const progressColor = colorVariants[color];

    return (
        <div
            className={`
                flex flex-col 
                ${labelPosition === 'outside' ? 'space-y-2' : ''}
                ${onChange ? 'items-center' : 'items-start'}
            `}
            role="progressbar"
            aria-valuenow={safeProgress}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            {/* Optional Label */}
            {showLabel && labelPosition === 'outside' && (
                <div className="flex justify-between w-full">
                    <span className={`text-sm font-medium ${progressColor.text}`}>
                        Progress
                    </span>
                    <span className={`text-sm font-bold ${progressColor.text}`}>
                        {safeProgress}%
                    </span>
                </div>
            )}

            {/* Progress Container */}
            <div className="flex items-center w-full space-x-2">
                {/* Optional Decrease Button */}
                {onChange && (
                    <button
                        onClick={handleDecrease}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                )}

                {/* Main Progress Bar */}
                <div
                    className={`
                        relative w-full ${sizeVariants[size]} 
                        bg-gray-300 rounded-full 
                        overflow-hidden
                    `}
                    title={tooltip}
                >
                    <div
                        className={`
                            h-full 
                            ${progressColor.base}
                            ${gradient ? `bg-gradient-to-r ${progressColor.gradient}` : ''}
                            ${animated ? 'animate-pulse' : ''}
                            ${striped ? 'progress-bar-stripes' : ''}
                            transition-all duration-500 ease-in-out
                        `}
                        style={{
                            width: `${safeProgress}%`,
                            animationDuration: animated ? '1.5s' : undefined
                        }}
                    />

                    {/* Internal Label */}
                    {showLabel && labelPosition === 'inside' && (
                        <div
                            className={`
                                absolute inset-0 flex items-center justify-end 
                                pr-2 text-white font-bold 
                                ${safeProgress > 15 ? 'text-opacity-100' : 'text-opacity-0'}
                            `}
                        >
                            {safeProgress}%
                        </div>
                    )}
                </div>

                {/* Status Icon */}
                {statusIcons[status]}

                {/* Optional Increase Button */}
                {onChange && (
                    <button
                        onClick={handleIncrease}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Custom CSS for striped effect (you can add this to your global CSS)
const stripeStyles = `
    @keyframes progress-bar-stripes {
        0% { background-position: 1rem 0; }
        100% { background-position: 0 0; }
    }
    .progress-bar-stripes {
        background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
        );
        background-size: 1rem 1rem;
        animation: progress-bar-stripes 1s linear infinite;
    }
`;

// function ProgressDemo() {
//     const [progress, setProgress] = useState(30);
  
//     return (
//       <div className="space-y-4">
//         {/* Basic Usage */}
//         <ProgressBar progress={60} />
  
//         {/* Advanced Configuration */}
//         <ProgressBar 
//           progress={progress}
//           onChange={setProgress}
//           color="green"
//           size="lg"
//           showLabel
//           gradient
//           animated
//           striped
//           status="success"
//           tooltip="Project completion status"
//         />
//       </div>
//     );
//   }