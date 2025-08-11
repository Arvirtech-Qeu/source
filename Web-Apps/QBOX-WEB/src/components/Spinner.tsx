import PropTypes from 'prop-types';

export const Spinner = ({
    size = 'medium', // 'small', 'medium', 'large'
    color = 'blue', // 'blue', 'red', 'green', 'purple', etc.
    speed = '1s', // Speed of the animation (e.g., '1s', '0.5s')
    className = '',
    ariaLabel = 'Loading',
}) => {
    // Dynamic classes for size and color
    const sizeClasses = {
        small: 'w-6 h-6 border-2',
        medium: 'w-12 h-12 border-4',
        large: 'w-16 h-16 border-6',
    };

    const colorClasses = {
        blue: 'border-t-transparent border-blue-600',
        red: 'border-t-transparent border-red-600',
        green: 'border-t-transparent border-green-600',
        purple: 'border-t-transparent border-purple-600',
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                role="alert"
                aria-live="assertive"
                className={`${sizeClasses[size]} ${colorClasses[color]} border-t-transparent border-solid rounded-full animate-spin`}
                style={{ animationDuration: speed }}
                aria-label={ariaLabel}
            ></div>
        </div>
    );
};

// Prop Types
Spinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['blue', 'red', 'green', 'purple']),
    speed: PropTypes.string,
    className: PropTypes.string,
    ariaLabel: PropTypes.string,
};

// Default Props
Spinner.defaultProps = {
    size: 'medium',
    color: 'blue',
    speed: '1s',
    className: '',
    ariaLabel: 'Loading',
};


{/* <Spinner size="large" color="green" speed="1.5s" ariaLabel="Loading data..." /> */ }
