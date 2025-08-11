type ButtonProps = {
  children?: React.ReactNode;
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  // Enhanced variant options
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  ariaLabel?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  label,
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  fullWidth = false,
  ariaLabel,
}) => {
  // Enhanced variant classes with more options
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-color hover:bg-color text-white focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    outline: 'border-2 bg-transparent hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
  };

  // Enhanced size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  // Get outline text color
  const outlineTextColor = variant === 'outline' 
    ? 'text-blue-600 border-blue-600 hover:text-blue-700' 
    : 'text-inherit';

  const content = (
    <>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && iconPosition === 'left' && !isLoading && <span className="mr-2">{icon}</span>}
      {label || children}
      {icon && iconPosition === 'right' && !isLoading && <span className="ml-2">{icon}</span>}
    </>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center 
        rounded-md font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${outlineTextColor}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {content}
    </button>
  );
};

// Usage
//   <Button label="Submit" onClick={handleSubmit} />


export const SecondaryButton = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="px-6 py-2 rounded-full text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500"
    >
        {label}
    </button>
);

// Usage
//   <SecondaryButton label="Cancel" onClick={handleCancel} />



// const Button = ({
//     children,
//     onClick,
//     disabled,
//   }: {
//     children: React.ReactNode;
//     onClick: () => void;
//     disabled?: boolean;
//   }) => {
//     return (
//       <button onClick={onClick} disabled={disabled}>
//         {children}
//       </button>
//     );
//   };
  
//   export default Button;
  