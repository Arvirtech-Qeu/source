import React, { forwardRef } from 'react';

type DatePickerProps = {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    className?: string;
    required?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'>;

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    (
        {
            label,
            value,
            onChange,
            error = '',
            className = '',
            required = false,
            ...rest
        },
        ref
    ) => {
        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label className="block text-ms font-medium text-gray-700 mb-1">
                        {label}
                        {required && <span className="text-color">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    type="date"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`
                        w-full 
                        px-3 
                        border 
                        py-2
                        rounded-md 
                        focus:outline-none 
                        focus:ring-1
                        ${error
                            ? 'border-color focus:ring-red-200'
                            : 'border-gray-300 focus:ring-orange-50 focus:border-orange-400'
                        }
                        transition-colors duration-200
                    `}
                    {...rest}
                />
                {error && <p className="mt-1 text-sm text-color">{error}</p>}
            </div>
        );
    }
);

export default DatePicker; 