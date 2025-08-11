import React from 'react';

type DialogTitleProps = {
    children?: React.ReactNode; // Optional children
    className?: string; // Optional custom className
};

export const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50"
                aria-hidden="true"
                onClick={onOpenChange} // Close dialog on clicking the backdrop
            />
            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export const DialogContent = ({ children, className }) => (
    <div
        className={`bg-white rounded-lg shadow-xl p-4 max-w-lg w-full ${className}`}
    >
        {children}
    </div>
);

export const DialogHeader = ({ children }) => (
    <div className="mb-4">
        {children}
    </div>
);

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = '' }) => (
    <h2 className="text-lg font-semibold text-gray-900">
        {children}
    </h2>
);
