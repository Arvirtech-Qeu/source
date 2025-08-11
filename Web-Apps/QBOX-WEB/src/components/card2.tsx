// Card.js
import React from 'react';

export const Card = ({ className, children, onClick }) => {
    return (
        <div
            className={`bg-white border rounded-lg shadow-md hover:shadow-lg transition-all ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export const CardContent = ({ className, children }) => {
    return <div className={`p-4 ${className}`}>{children}</div>;
};
