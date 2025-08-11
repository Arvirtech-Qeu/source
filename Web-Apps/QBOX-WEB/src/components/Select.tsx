import React, { forwardRef } from 'react';

interface SelectProps {
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: any;
    className?: string;
    options: Array<{
        label: string;
        value: string;
    }>;
    onChange?: (value: string) => void;
    value?: any;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, placeholder, required, error, options, className, onChange, value, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label} {required && <span className="text-color">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
                        block w-full border-gray-300 rounded-lg
                        shadow-sm focus:ring-2 focus:ring-red-50 focus:border-orange-400
                        text-sm text-gray-700 px-4 py-2.5 transition-colors duration-200
                        ${className}
                    `}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    {...props}
                >
                    {placeholder && (
                        <option value="" className="text-gray-500" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <span className="text-sm text-color mt-1">{error}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;