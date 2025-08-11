import React, { useState, useRef, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

// Enhanced type definitions
type AccordionVariant = 'default' | 'outlined' | 'minimal' | 'colorful';
type AccordionStatus = 'neutral' | 'info' | 'warning' | 'success' | 'error';

interface AccordionProps {
    title: string | ReactNode;
    content: string | ReactNode;
    variant?: AccordionVariant;
    status?: AccordionStatus;
    icon?: ReactNode;
    defaultOpen?: boolean;
    disabled?: boolean;
    onToggle?: (isOpen: boolean) => void;
    className?: string;
    contentClassName?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
    title,
    content,
    variant = 'default',
    status = 'neutral',
    icon,
    defaultOpen = false,
    disabled = false,
    onToggle,
    className = '',
    contentClassName = ''
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    // Status color and icon mapping
    const statusStyles = {
        neutral: {
            border: 'border-gray-200',
            text: 'text-gray-700',
            icon: null
        },
        info: {
            border: 'border-blue-200',
            text: 'text-blue-700',
            icon: <Info className="text-blue-500" />
        },
        warning: {
            border: 'border-yellow-200',
            text: 'text-yellow-700',
            icon: <AlertCircle className="text-yellow-500" />
        },
        success: {
            border: 'border-green-200',
            text: 'text-green-700',
            icon: <CheckCircle2 className="text-green-500" />
        },
        error: {
            border: 'border-red-200',
            text: 'text-red-700',
            icon: <AlertCircle className="text-color" />
        }
    };

    // Measure content height for smooth animation
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [content]);

    // Toggle handler with optional callback
    const handleToggle = () => {
        if (disabled) return;
        const newOpenState = !isOpen;
        setIsOpen(newOpenState);
        onToggle?.(newOpenState);
    };

    // Render variant-specific styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'outlined':
                return `border rounded-lg ${statusStyles[status].border}`;
            case 'minimal':
                return 'border-b';
            case 'colorful':
                return `rounded-lg ${statusStyles[status].border} bg-${status}-50`;
            default:
                return 'border-b';
        }
    };

    // Animation variants for Framer Motion
    const contentVariants = {
        open: {
            height: contentHeight,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        closed: {
            height: 0,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div
            className={`
                ${getVariantStyles()} 
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            <motion.button
                onClick={handleToggle}
                className={`
                    flex items-center justify-between 
                    w-full py-4 text-left 
                    ${statusStyles[status].text}
                    ${disabled ? 'pointer-events-none' : 'hover:bg-gray-50'}
                    transition-colors duration-200 
                    px-4 rounded
                `}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
            >
                <div className="flex items-center space-x-3">
                    {icon || statusStyles[status].icon}
                    {typeof title === 'string' ? (
                        <span className="font-semibold text-lg">{title}</span>
                    ) : (
                        title
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown
                        className={`
                            w-5 h-5 
                            ${disabled ? 'text-gray-300' : statusStyles[status].text}
                        `}
                    />
                </motion.div>
            </motion.button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        ref={contentRef}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={contentVariants}
                        className={`
                            overflow-hidden 
                            ${statusStyles[status].text}
                            px-4 
                            ${contentClassName}
                        `}
                    >
                        <div className="pb-4">
                            {typeof content === 'string' ? (
                                <p>{content}</p>
                            ) : (
                                content
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Example Usage
// export const AccordionShowcase: React.FC = () => {
//     return (
//         <div className="max-w-2xl mx-auto space-y-4">
//             <Accordion
//                 title="What is React?"
//                 content="React is a JavaScript library for building user interfaces, developed by Facebook. It allows developers to create reusable UI components."
//             />

//             <Accordion
//                 title="Advanced Features"
//                 content={
//                     <div>
//                         <p>This Accordion supports:</p>
//                         <ul className="list-disc list-inside">
//                             <li>Multiple variants</li>
//                             <li>Status indicators</li>
//                             <li>Custom icons</li>
//                             <li>Disabled state</li>
//                         </ul>
//                     </div>
//                 }
//                 variant="colorful"
//                 status="info"
//             />

//             <Accordion
//                 title="Disabled Accordion"
//                 content="This accordion is disabled and cannot be opened."
//                 disabled
//             />

//             <Accordion
//                 title={<span className="text-green-600">Custom Title</span>}
//                 content="You can use custom React nodes for both title and content."
//                 variant="outlined"
//                 status="success"
//             />
//         </div>
//     );
// };