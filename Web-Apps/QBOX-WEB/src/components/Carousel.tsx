import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Expand,
    Heart,
    Share2,
    Info
} from 'lucide-react';

// Enhanced Image Interface
interface CarouselImage {
    id: string;
    src: string;
    title?: string;
    description?: string;
    alt?: string;
    tags?: string[];
}

interface CarouselProps {
    images: CarouselImage[];
    autoPlayInterval?: number;
    showThumbnails?: boolean;
    showInfo?: boolean;
    showControls?: boolean;
    onImageClick?: (image: CarouselImage) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
    images,
    autoPlayInterval = 0,
    showThumbnails = true,
    showInfo = true,
    showControls = true,
    onImageClick
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [liked, setLiked] = useState<{ [key: string]: boolean }>({});

    // Navigation handlers with wrap-around
    const nextImage = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images]);

    const prevImage = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images]);

    // Auto-play logic
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (autoPlayInterval > 0 && isAutoPlaying) {
            intervalId = setInterval(nextImage, autoPlayInterval);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [autoPlayInterval, isAutoPlaying, nextImage]);

    // Thumbnail click handler
    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    // Like toggle
    const toggleLike = (imageId: string) => {
        setLiked(prev => ({
            ...prev,
            [imageId]: !prev[imageId]
        }));
    };

    // Sharing (simulated)
    const shareImage = (image: CarouselImage) => {
        // Implement actual sharing logic
        console.log('Sharing image:', image);
    };

    // Variants for smooth animations
    const slideVariants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
            };
        }
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    // Render current image with advanced features
    const renderCurrentImage = () => {
        const currentImage = images[currentIndex];

        return (
            <motion.div
                key={currentImage.id}
                className={`
                    relative w-full h-[500px] 
                    ${isExpanded ? 'fixed inset-0 z-50 bg-black bg-opacity-90' : ''}
                `}
                onClick={() => onImageClick?.(currentImage)}
            >
                <AnimatePresence initial={false} custom={1}>
                    <motion.img
                        key={currentImage.id}
                        src={currentImage.src}
                        alt={currentImage.alt || 'Carousel Image'}
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                nextImage();
                            } else if (swipe > swipeConfidenceThreshold) {
                                prevImage();
                            }
                        }}
                        className={`
                            object-cover rounded-lg 
                            ${isExpanded
                                ? 'w-full h-full max-w-6xl max-h-screen mx-auto'
                                : 'w-full h-full'
                            }
                        `}
                    />
                </AnimatePresence>

                {/* Overlay Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                    {showControls && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="bg-white/50 backdrop-blur-sm p-2 rounded-full"
                            >
                                <ChevronLeft className="text-gray-800" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="bg-white/50 backdrop-blur-sm p-2 rounded-full"
                            >
                                <ChevronRight className="text-gray-800" />
                            </motion.button>
                        </>
                    )}
                </div>

                {/* Image Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="bg-white/50 backdrop-blur-sm p-2 rounded-full"
                    >
                        <Expand className="text-gray-800" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(currentImage.id);
                        }}
                        className={`
                            bg-white/50 backdrop-blur-sm 
                            p-2 rounded-full 
                            ${liked[currentImage.id] ? 'text-color' : 'text-gray-800'}
                        `}
                    >
                        <Heart fill={liked[currentImage.id] ? 'currentColor' : 'none'} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            shareImage(currentImage);
                        }}
                        className="bg-white/50 backdrop-blur-sm p-2 rounded-full"
                    >
                        <Share2 className="text-gray-800" />
                    </motion.button>
                </div>

                {/* Image Info */}
                {showInfo && currentImage.title && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 bg-white/50 backdrop-blur-sm p-3 rounded-lg"
                    >
                        <div className="flex items-center space-x-2">
                            <Info className="text-gray-800" size={18} />
                            <div>
                                <h3 className="font-semibold text-gray-800">{currentImage.title}</h3>
                                {currentImage.description && (
                                    <p className="text-sm text-gray-600">{currentImage.description}</p>
                                )}
                                {currentImage.tags && (
                                    <div className="flex space-x-2 mt-1">
                                        {currentImage.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="bg-gray-200 text-xs px-2 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    // Thumbnails strip
    const renderThumbnails = () => {
        if (!showThumbnails) return null;

        return (
            <div className="flex justify-center space-x-2 mt-4">
                {images.map((image, index) => (
                    <motion.img
                        key={image.id}
                        src={image.src}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => handleThumbnailClick(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                            w-16 h-16 object-cover rounded-lg cursor-pointer
                            ${index === currentIndex
                                ? 'border-2 border-blue-500'
                                : 'opacity-60 hover:opacity-100'
                            }
                        `}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="relative">
            {renderCurrentImage()}
            {renderThumbnails()}
        </div>
    );
};

// Example Usage
export const CarouselShowcase: React.FC = () => {
    const imageData = [
        {
            id: '1',
            src: 'https://t3.ftcdn.net/jpg/02/52/38/80/360_F_252388016_KjPnB9vglSCuUJAumCDNbmMzGdzPAucK.jpg',
            title: 'Mountain Landscape',
            description: 'Breathtaking view of snow-capped mountains',
            alt: 'Mountain view',
            tags: ['nature', 'landscape', 'mountains']
        },
        {
            id: '2',
            src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8ZJMkpJoYOJPyV728KwCNcxw3x6MNR3qg2w&s',
            title: 'Forest Path',
            description: 'A serene walk through a dense forest',
            alt: 'Forest path',
            tags: ['forest', 'nature', 'path']
        },
        {
            id: '3',
            src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSXZxM9oJMgCXnxPeMhjA_sSlUDyEF7IQw-Q&s',
            title: 'City Sunset',
            description: 'Urban landscape during golden hour',
            alt: 'City sunset',
            tags: ['city', 'sunset', 'urban']
        }
    ];

    return (
        <div className="v-full mx-auto">
            <Carousel
                images={imageData}
                autoPlayInterval={5000}
                showThumbnails
                showInfo
                showControls
            />
        </div>
    );
};