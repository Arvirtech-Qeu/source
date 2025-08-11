import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { X } from 'lucide-react';
import '../App.css';
import logo from '@assets/images/q-logo.png';

interface FoodImage {
    src: string;
    alt: string;
}

interface AnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: React.ReactNode;
    subtitle?: string;
    foodImages?: FoodImage[];  // Array of your custom food images
    type?: 'default' | 'warning' | 'success' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom' | 'custom1' | 'custom2' | 'full';
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
}

// Default placeholder images (replace these with your actual images)
const FoodImages = [
    "//assets/images/burger.jpeg",
    "//assets/images/burger 2.jpeg",
    "//assets/images/noodles.jpeg",
    "//assets/images/biryani.jpg",
    "//assets/images/Curd-Rice.jpg",
    "//assets/images/meals.jpeg",
    "//assets/images/pizza.jpg",
    // "//assets/images/download.jpeg",

];
export const AnimatedModal: React.FC<AnimatedModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    subtitle,
    foodImages = FoodImages,
    size = 'md',
    footer
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationPhase, setAnimationPhase] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
            setTimeout(() => setAnimationPhase(1), 50);
            setTimeout(() => setAnimationPhase(2), 200);
        } else {
            setAnimationPhase(0);
            document.body.style.overflow = 'unset';
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % foodImages.length);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isVisible, foodImages.length]);

    // const handleImageLoad = () => {
    //     setIsImageLoading(false);
    // };
    if (!isVisible) return null;
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * FoodImages.length);
        return FoodImages[randomIndex];
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop with elegant blur effect */}
            <div
                className={`
                    fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-500 pointer-events-none
                    ${animationPhase > 0 ? 'opacity-100' : 'opacity-0'}
                `}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                ref={modalRef}
                className={`
                     relative w-full 
                    ${size === 'sm' ? 'max-w-sm' : ''}
                    ${size === 'md' ? 'max-w-md' : ''}
                    ${size === 'lg' ? 'max-w-lg' : ''}
                    ${size === 'xl' ? 'max-w-xl' : ''}
                    ${size === '2xl' ? 'max-w-2xl' : ''}
                    ${size === 'custom' ? 'max-w-[calc(60%-8rem)]' : ''}
                    ${size === 'custom1' ? 'max-w-[calc(80%-8rem)]' : ''}  
                    ${size === 'custom2' ? 'max-w-[calc(60%-6rem)] h-[700px]' : ''}
                    ${size === 'full' ? 'w-full' : ''}

                flex  bg-white rounded-lg shadow-2xl overflow-hidden
                    transition-all duration-500 ease-out
                    ${animationPhase > 0 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                `}
            >
                {/* Decorative Side Panel with Image */}
                <div className={`
                    hidden lg:block lg:w-1/3 
                    low-bg-color
                    relative 
                    transition-all duration-700 ease-out
                    ${animationPhase > 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
                `}>
                    {/* Loading Overlay */}
                    {/* {isImageLoading && (
                        <div className="absolute inset-0 animate-pulse z-20" />
                    )} */}
                    <div className="flex flex-col items-center justify-center h-full">
                        <img
                            src={logo}
                            alt="QeuBox Logo"
                            className="w-100 h-100 mb-2"
                        />
                        <h1 className="text-3xl font-bold drop-shadow-lg mt-2 text-black">QEUBOX</h1>
                    </div>
                </div>

                {/* Content Panel */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-color 
                                 transition-all duration-200 p-2 rounded-full 
                                 hover:bg-red-50 hover:scale-110 z-50"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="border-b border-gray-100/80">
                        {title && (
                            <h2 className="text-xl ml-8 pt-4 pb-2 text-gray-800 tracking-tight">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="ml-8 pb-4 text-gray-600">{subtitle}</p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {children}
                    </div>

                    {/* Footer */}
                    {/* {footer && (
                        <div className="p-4">
                            {footer}
                        </div>
                    )} */}
                    {footer && (
                        <div className="p-4 border-t border-gray-100/80 mt-auto">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnimatedModal;