import React from "react";
import * as LucideIcons from 'lucide-react';

interface PopupProps {
  IsPopupOpen: boolean;
  icon?: React.ReactNode; // Accepts any valid React element
  confirmSave: () => void;
  cancelSave: () => void;
  Description: string;
  option1: string;
  option2: string;
}

const Popup: React.FC<PopupProps> = ({
  IsPopupOpen,
  icon,
  confirmSave,
  cancelSave,
  Description,
  option1,
}: any) => {
  if (!IsPopupOpen) return null;

  return (
    <>
      {IsPopupOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          {/* Animated backdrop */}
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Main popup container */}
          <div className="relative bg-white p-8 drop-shadow-2xl max-w-lg w-full mx-4 rounded-lg">
            {/* Close icon */}
            <button
              onClick={cancelSave}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <LucideIcons.X className="w-6 h-6" />
            </button>

            {/* Header section */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              {icon && <div className="mr-2">{icon}</div>}
              <span className="font-bold text-2xl text-emerald-600">AuthTool</span>
            </div>

            {/* Content */}
            <div className="relative">
              <h3 className="text-xl font-bold text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                {Description}
              </h3>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <button
                onClick={confirmSave}
                className="group relative bg-emerald-600 text-white py-2.5 px-8 rounded-lg overflow-hidden"
              >
                <span className="relative z-1">{option1}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
