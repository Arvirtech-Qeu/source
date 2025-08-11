import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Rating = ({
    value = 0,
    onChange,
    max = 5,
    color = '#FFD700',
    emptyColor = '#E0E0E0',
    size = 24,
    editable = true,
    showValue = true,
    hover = true
}) => {
    const [hoverValue, setHoverValue] = useState(0);

    const handleStarClick = (selectedStar) => {
        if (editable) {
            onChange(selectedStar);
        }
    };

    const handleMouseEnter = (starValue) => {
        if (hover && editable) {
            setHoverValue(starValue);
        }
    };

    const handleMouseLeave = () => {
        if (hover && editable) {
            setHoverValue(0);
        }
    };

    return (
        <div className="flex items-center">
            <div className="flex">
                {[...Array(max)].map((_, index) => {
                    const starValue = index + 1;
                    const filled = starValue <= (hoverValue || value);

                    return (
                        <button
                            key={starValue}
                            type="button"
                            className={`
                transition-colors duration-200 
                ${editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                ${filled ? 'text-opacity-100' : 'text-opacity-50'}
              `}
                            onClick={() => handleStarClick(starValue)}
                            onMouseEnter={() => handleMouseEnter(starValue)}
                            onMouseLeave={handleMouseLeave}
                            disabled={!editable}
                            aria-label={`Rate ${starValue} out of ${max}`}
                        >
                            <Star
                                size={size}
                                fill={filled ? color : emptyColor}
                                color={filled ? color : emptyColor}
                                strokeWidth={1.5}
                            />
                        </button>
                    );
                })}
            </div>
            {showValue && (
                <span className="ml-2 text-sm text-gray-600">
                    {value} / {max}
                </span>
            )}
        </div>
    );
};

// Example usage
const RatingDemo = () => {
    const [rating, setRating] = useState(0);

    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="mb-4 text-lg font-semibold">Rate Your Experience</h2>
            <Rating
                value={rating}
                onChange={setRating}
                max={5}
                color="#FFD700"
                emptyColor="#E0E0E0"
                size={32}
                editable={true}
                showValue={true}
                hover={true}
            />
            <p className="mt-2 text-sm text-gray-500">
                Your rating: {rating} stars
            </p>
        </div>
    );
};

export { Rating, RatingDemo };