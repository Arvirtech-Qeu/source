import React, { useState } from 'react';
import { Box } from 'lucide-react';

// First, let's keep the ProgressContainer component from before
interface ProgressContainerProps {
  title: string;
  location: string;
  itemCount: number;
  isActive?: boolean;
  progressPercent?: number;
  progressLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const ProgressContainer: React.FC<ProgressContainerProps> = ({
  title,
  location,
  itemCount,
  isActive = false,
  progressPercent = 0,
  progressLabel,
  icon,
  onClick
}) => {
  const containerBgColor = isActive ? 'bg-color' : 'bg-gray-400';
  const progressBgColor = isActive ? 'low-bg-color' : 'bg-gray-300';
  const iconColor = isActive ? 'text-white' : 'text-gray-600';
  const textColor = isActive ? 'text-color' : 'text-gray-600';
  
  return (
    <div 
      className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={onClick}
    >
      <div className="flex">
        <div className={`${containerBgColor} p-4 flex flex-col justify-between w-2/3`}>
          <div className="flex items-center space-x-2">
            {icon && (
              <div className={iconColor}>
                {icon}
              </div>
            )}
            <h3 className={`font-semibold text-white`}>{title}</h3>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm text-white opacity-90`}>{location}</span>
            <span className={`text-sm text-white opacity-90`}>Items: {itemCount}</span>
          </div>
        </div>
        <div className={`${progressBgColor} p-4 flex flex-col justify-center items-center w-1/3`}>
          <div className="text-center">
           {(progressBgColor == 'low-bg-color') && <h3 className={`text-xl font-bold ${textColor}`}>
              {progressPercent}%
            </h3>} 
            {(progressBgColor == 'low-bg-color') && <p className={`text-sm ${textColor} opacity-90`}>
              {progressLabel || 'Capacity'}
            </p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressContainer;