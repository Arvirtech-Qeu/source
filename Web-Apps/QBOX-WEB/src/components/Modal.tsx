import React, { useEffect, useRef, useState, ReactNode, MouseEvent } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// Define prop types with detailed interface
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: React.ReactNode;
    type?: 'default' | 'warning' | 'success' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
    dialogClassName?: string;
    overlayClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    type = 'default',
    size = 'md',
    closeOnOverlay = true,
    closeOnEscape = true,
    className = '',
    header,
    footer,
    dialogClassName = '',
    overlayClassName = ''
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Modal type configurations
    const modalTypes = {
        default: {
            icon: null,
            iconClass: '',
            borderClass: 'border-gray-200'
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-color" />,
            iconClass: 'text-color',
            borderClass: 'border-color'
        },
        success: {
            icon: <CheckCircle className="w-6 h-6 text-color" />,
            iconClass: 'text-color',
            borderClass: 'border-color'
        },
        error: {
            icon: <X className="w-6 h-6 text-color" />,
            iconClass: 'text-color',
            borderClass: 'border-color'
        },
        info: {
            icon: <Info className="w-6 h-6 text-color" />,
            iconClass: 'text-color',
            borderClass: 'border-color'
        }
    };

    // Size configurations
    // const sizeClasses = {
    //     sm: 'max-w-sm',
    //     md: 'max-w-md',
    //     lg: 'max-w-lg',
    //     xl: 'w-4/12 max-w-xl',
    //     '2xl': 'w-6/12 max-w-2xl',
    //     full: 'w-11/12 max-w-6xl'
    // };

    // Animate modal in and out
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Focus first focusable element in modal
            setTimeout(() => {
                if (modalRef.current) {
                    const focusableElements = modalRef.current.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    if (focusableElements.length > 0) {
                        (focusableElements[0] as HTMLElement).focus();
                    }
                }
            }, 100);
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Keyboard and overlay event handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isOpen && closeOnEscape && e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, closeOnEscape]);

    // Prevent rendering if not visible
    if (!isOpen && !isVisible) return null;

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnOverlay) {
            onClose();
        }
    };

    const typeConfig = modalTypes[type] || modalTypes.default;

    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center 
                transition-all duration-300 ease-in-out 
                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                ${overlayClassName}
            `}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: isOpen ? 'blur(4px)' : 'none'
            }}
            // onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={modalRef}
                className={`
                    relative bg-white rounded-md shadow-2xl
                    transform transition-all duration-300 ease-in-out p-4
                    border ${typeConfig.borderClass}

                    ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                    ${dialogClassName}
                    ${className}
                `}
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="
                        absolute top-5 right-4
                        text-gray-500 hover:text-gray-700 
                        focus:outline-none ring-color
                        rounded-full p-1 transition-all
                    "
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Custom or Default Header */}
                <div className="pt-4 pb-4 border-b border-gray-100 ">
                    {header || (
                        <div className="flex items-center space-x-3">
                            {typeConfig.icon && (
                                <div className={`${typeConfig.iconClass}`}>
                                    {typeConfig.icon}
                                </div>
                            )}
                            {title && (
                                <h2 className="text-md font-semibold text-gray-800">
                                    {title}
                                </h2>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal Content */}
                <div className="px-6 pt-4">
                    {children}
                </div>

                {/* Custom or Default Footer */}
                {footer && (
                    <div className="px-4 mt-12 pb-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};