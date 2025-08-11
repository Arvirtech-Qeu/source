import React, { ReactNode } from 'react';
import { Check, Info, AlertCircle } from 'lucide-react';

// Define comprehensive prop types
interface RadioButtonProps {
    name: string;
    label: string;
    value: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    
    // Enhanced optional props
    disabled?: boolean;
    description?: string;
    icon?: ReactNode;
    color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
    variant?: 'default' | 'card' | 'highlight';
    className?: string;
    labelClassName?: string;
    errorMessage?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
    name,
    label,
    value,
    checked,
    onChange,
    disabled = false,
    description,
    icon,
    color = 'blue',
    variant = 'default',
    className = '',
    labelClassName = '',
    errorMessage
}) => {
    // Color configuration for different states
    const colorVariants = {
        blue: {
            border: checked ? 'border-blue-600' : 'border-gray-300',
            ring: 'focus:ring-blue-500',
            text: checked ? 'text-blue-600' : 'text-gray-700',
            bg: checked ? 'bg-blue-600' : 'bg-white'
        },
        green: {
            border: checked ? 'border-green-600' : 'border-gray-300',
            ring: 'focus:ring-green-500',
            text: checked ? 'text-green-600' : 'text-gray-700',
            bg: checked ? 'bg-green-600' : 'bg-white'
        },
        red: {
            border: checked ? 'border-red-600' : 'border-gray-300',
            ring: 'focus:ring-red-500',
            text: checked ? 'text-color' : 'text-gray-700',
            bg: checked ? 'bg-color' : 'bg-white'
        },
        purple: {
            border: checked ? 'border-purple-600' : 'border-gray-300',
            ring: 'focus:ring-purple-500',
            text: checked ? 'text-purple-600' : 'text-gray-700',
            bg: checked ? 'bg-purple-600' : 'bg-white'
        },
        gray: {
            border: checked ? 'border-gray-600' : 'border-gray-300',
            ring: 'focus:ring-gray-500',
            text: checked ? 'text-gray-600' : 'text-gray-700',
            bg: checked ? 'bg-gray-600' : 'bg-white'
        }
    };

    const currentColor = colorVariants[color];

    // Render different variants
    const renderDefaultVariant = () => (
        <div className={`flex items-center ${className}`}>
            <div className="relative">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        h-4 w-4 
                        border-2 rounded-full
                        ${currentColor.border}
                        ${currentColor.ring}
                        focus:ring-2 focus:ring-offset-2
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                />
                {checked && !disabled && (
                    <div 
                        className={`
                            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                            w-2 h-2 rounded-full
                            ${currentColor.bg}
                        `}
                    />
                )}
            </div>
            <label 
                className={`
                    ml-2 text-sm 
                    ${currentColor.text}
                    ${disabled ? 'opacity-50' : ''}
                    ${labelClassName}
                `}
            >
                {label}
            </label>
        </div>
    );

    const renderCardVariant = () => (
        <div 
            className={`
                relative border-2 rounded-lg p-4 
                transition-all duration-300
                ${checked ? `${currentColor.border} shadow-md` : 'border-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
                ${className}
            `}
            onClick={!disabled ? () => onChange({ target: { value, name } } as React.ChangeEvent<HTMLInputElement>) : undefined}
        >
            <div className="flex items-start space-x-3">
                <div className="relative">
                    <input
                        type="radio"
                        name={name}
                        value={value}
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        className="sr-only"
                    />
                    <div 
                        className={`
                            w-5 h-5 border-2 rounded-full
                            ${currentColor.border}
                            ${checked ? 'border-4' : ''}
                        `}
                    />
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        {icon && <span className="w-5 h-5">{icon}</span>}
                        <span className={`font-semibold ${currentColor.text}`}>{label}</span>
                    </div>
                    {description && (
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderHighlightVariant = () => (
        <div 
            className={`
                relative border rounded-lg p-3 
                transition-all duration-300
                ${checked 
                    ? `${currentColor.border} ${currentColor.text} bg-${color}-50` 
                    : 'border-gray-200 text-gray-700'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
                ${className}
            `}
            onClick={!disabled ? () => onChange({ target: { value, name } } as React.ChangeEvent<HTMLInputElement>) : undefined}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <input
                        type="radio"
                        name={name}
                        value={value}
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                        {icon && <span className="w-5 h-5">{icon}</span>}
                        <span className="font-medium">{label}</span>
                    </div>
                </div>
                {checked && <Check className="w-5 h-5" />}
            </div>
            {description && (
                <p className={`text-sm mt-1 ${checked ? 'text-opacity-80' : 'text-gray-500'}`}>
                    {description}
                </p>
            )}
        </div>
    );

    return (
        <div>
            {variant === 'default' && renderDefaultVariant()}
            {variant === 'card' && renderCardVariant()}
            {variant === 'highlight' && renderHighlightVariant()}
            
            {/* Error Message */}
            {errorMessage && (
                <div className="flex items-center mt-1 text-color text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{errorMessage}</span>
                </div>
            )}
        </div>
    );
};

// function SubscriptionSelection() {
//     const [subscription, setSubscription] = useState('monthly');
  
//     return (
//       <div className="space-y-4">
//         {/* Default Variant */}
//         <RadioButton
//           name="subscription"
//           label="Monthly"
//           value="monthly"
//           checked={subscription === 'monthly'}
//           onChange={(e) => setSubscription(e.target.value)}
//         />
  
//         {/* Card Variant with Icon */}
//         <RadioButton
//           name="subscription"
//           label="Annual"
//           value="annual"
//           checked={subscription === 'annual'}
//           onChange={(e) => setSubscription(e.target.value)}
//           variant="card"
//           color="green"
//           description="Save 20% with annual plan"
//           icon={<DollarSign className="w-5 h-5" />}
//         />
  
//         {/* Highlight Variant with Error */}
//         <RadioButton
//           name="plan"
//           label="Pro Plan"
//           value="pro"
//           checked={false}
//           onChange={() => {}}
//           variant="highlight"
//           color="purple"
//           disabled
//           description="Upgrade to unlock more features"
//           errorMessage="Upgrade required"
//         />
//       </div>
//     );
//   }