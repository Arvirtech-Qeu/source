import { useState } from 'react';
import PropTypes from 'prop-types';

export const Tooltip = ({
    children,
    text,
    position = 'top', // 'top', 'bottom', 'left', 'right'
    backgroundColor = 'bg-gray-800',
    textColor = 'text-white',
    arrowColor = 'bg-gray-800',
    delay = 0,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setTimeout(() => setShowTooltip(true), delay);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const tooltipPositionClasses = {
        top: 'bottom-full mb-2',
        bottom: 'top-full mt-2',
        left: 'right-full mr-2',
        right: 'left-full ml-2',
    };

    const arrowPositionClasses = {
        top: 'top-full left-1/2 transform -translate-x-1/2 border-t-8 border-t-transparent border-b-8 border-b-white border-l-8 border-l-transparent',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-8 border-b-transparent border-t-8 border-t-white border-l-8 border-l-transparent',
        left: 'left-full top-1/2 transform -translate-y-1/2 border-l-8 border-l-transparent border-r-8 border-r-white border-t-8 border-t-transparent',
        right: 'right-full top-1/2 transform -translate-y-1/2 border-r-8 border-r-transparent border-l-8 border-l-white border-t-8 border-t-transparent',
    };

    return (
        <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
            {showTooltip && (
                <div
                    className={`absolute ${tooltipPositionClasses[position]} left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm ${textColor} ${backgroundColor} rounded opacity-100 transition-opacity duration-200`}
                    role="tooltip"
                    aria-live="polite"
                >
                    {text}
                    <div
                        className={`absolute ${arrowPositionClasses[position]} ${arrowColor}`}
                        style={{
                            borderWidth: '8px',
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Prop Types
Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    arrowColor: PropTypes.string,
    delay: PropTypes.number,
};

// Default Props
Tooltip.defaultProps = {
    position: 'top',
    backgroundColor: 'bg-gray-800',
    textColor: 'text-white',
    arrowColor: 'bg-gray-800',
    delay: 0,
};


{/* <Tooltip
    text="Click here to delete"
    position="bottom"
    backgroundColor="bg-color"
    textColor="text-white"
    arrowColor="bg-color"
    delay={300} // 300ms delay before showing tooltip
>
    <button className="text-color">Delete</button>
</Tooltip> */}
