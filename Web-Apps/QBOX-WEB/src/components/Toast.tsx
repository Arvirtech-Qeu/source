import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const Toast = ({
    message,
    type = 'success',
    duration = 3000,
    position = 'bottom-4',
    dismissible = false,
    onClose,
}) => {
    const [visible, setVisible] = useState(true);

    // Automatically hide toast after the specified duration
    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setVisible(false);
        if (onClose) {
            onClose();
        }
    };

    if (!visible) return null;

    // Define classes for different types, positions, and animations
    const toastTypeClasses = {
        success: 'bg-green-500',
        error: 'bg-color',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    const toastPositionClasses = {
        top: 'top-4',
        bottom: 'bottom-4',
        left: 'left-4',
        right: 'right-4',
        center: 'top-1/2 transform -translate-y-1/2 left-1/2 transform -translate-x-1/2',
    };

    const iconClasses = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle',
    };

    return (
        <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className={`fixed ${toastPositionClasses[position]} z-50 p-4 rounded-lg shadow-lg flex items-center text-white ${toastTypeClasses[type]} transition-all duration-300 transform ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="mr-3">
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d={`M10 2a8 8 0 11-8 8 8 8 0 018-8zm0 14a6 6 0 100-12 6 6 0 000 12zm1-9h-2v4h2V7zM9 12h2v2H9v-2z`}
                    />
                </svg>
            </div>
            <div className="flex-1">{message}</div>
            {dismissible && (
                <button
                    onClick={handleClose}
                    className="ml-3 text-white hover:text-gray-200 focus:outline-none"
                    aria-label="Close toast"
                >
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6.293 4.293a1 1 0 011.414 0L10 6.586l2.293-2.293a1 1 0 111.414 1.414L11.414 8l2.293 2.293a1 1 0 01-1.414 1.414L10 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 8 6.293 5.707a1 1 0 010-1.414z"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

// Prop Types
Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    duration: PropTypes.number,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
    dismissible: PropTypes.bool,
    onClose: PropTypes.func,
};

// Default Props
Toast.defaultProps = {
    type: 'success',
    duration: 3000,
    position: 'bottom-4',
    dismissible: true,
    onClose: null,
};


{/* <Toast
    message="Data saved successfully!"
    type="success"
    duration={5000}   // Toast will disappear after 5 seconds
    position="top"    // Toast will appear at the top of the screen
    dismissible={true} // Toast can be manually dismissed
    onClose={() => console.log('Toast closed!')}
/> */}
