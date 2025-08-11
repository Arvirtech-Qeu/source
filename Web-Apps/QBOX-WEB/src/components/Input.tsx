import React, { forwardRef } from 'react';

type InputProps = {
    label?: string;
    value?: string | number | boolean | null;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    error?: string;
    className?: string;
    required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            value,
            onChange,
            type = 'text',
            placeholder = '',
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
                    ref={ref} // Attach the ref with the correct type
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
                        w-full 
                        px-3 
                        border 
                        py-1
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

export default Input;

