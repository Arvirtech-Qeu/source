import React from 'react';

export const Badge = ({
    children,
    color = 'blue',
    size = 'md',
    variant = 'primary',
    className = '',
    onClick
}: {
    children: React.ReactNode;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'outline' | 'solid' | 'soft' | 'subtle';
    className?: string;
    onClick?: () => void;
}) => {
    // Enhanced color variations for each variant
    const badgeColors = {
        primary: {
            blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
            green: 'bg-green-100 text-green-800 hover:bg-green-200',
            red: 'low-bg-color text-red-800 hover:bg-red-200',
            yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
            gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
            purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        },
        secondary: {
            blue: 'bg-blue-200 text-blue-900 hover:bg-blue-300',
            green: 'bg-green-200 text-green-900 hover:bg-green-300',
            red: 'bg-red-200 text-red-900 hover:bg-red-300',
            yellow: 'bg-yellow-200 text-yellow-900 hover:bg-yellow-300',
            gray: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
            purple: 'bg-purple-200 text-purple-900 hover:bg-purple-300',
        },
        outline: {
            blue: 'border-2 border-blue-500 text-blue-700 hover:bg-blue-50',
            green: 'border-2 border-green-500 text-green-700 hover:bg-green-50',
            red: 'border-2 border-color text-red-700 hover:bg-red-50',
            yellow: 'border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50',
            gray: 'border-2 border-gray-500 text-gray-700 hover:bg-gray-50',
            purple: 'border-2 border-purple-500 text-purple-700 hover:bg-purple-50',
        },
        solid: {
            blue: 'bg-blue-500 text-white hover:bg-blue-600',
            green: 'bg-green-500 text-white hover:bg-green-600',
            red: 'bg-color text-white hover:bg-color',
            yellow: 'bg-yellow-500 text-white hover:bg-yellow-600',
            gray: 'bg-gray-500 text-white hover:bg-gray-600',
            purple: 'bg-purple-500 text-white hover:bg-purple-600',
        },
        soft: {
            blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
            green: 'bg-green-50 text-green-600 hover:bg-green-100',
            red: 'bg-red-50 text-color hover:low-bg-color',
            yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
            gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
            purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
        },
        subtle: {
            blue: 'bg-blue-50/50 text-blue-700 hover:bg-blue-100/50',
            green: 'bg-green-50/50 text-green-700 hover:bg-green-100/50',
            red: 'bg-red-50/50 text-red-700 hover:low-bg-color/50',
            yellow: 'bg-yellow-50/50 text-yellow-700 hover:bg-yellow-100/50',
            gray: 'bg-gray-50/50 text-gray-700 hover:bg-gray-100/50',
            purple: 'bg-purple-50/50 text-purple-700 hover:bg-purple-100/50',
        },
    };

    const badgeSizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    // Determine which color to use based on the 'color' prop and 'variant' prop
    const badgeStyle = badgeColors[variant][color];

    return (
        <span
            className={`
                inline-block 
                rounded-full 
                font-semibold 
                ${badgeStyle} 
                ${badgeSizes[size]} 
                ${onClick ? 'cursor-pointer' : ''} 
                transition-colors duration-200 
                ${className}
            `}
            onClick={onClick}
        >
            {children}
        </span>
    );
};