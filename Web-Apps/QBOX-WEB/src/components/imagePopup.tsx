import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share, AlertTriangle } from 'lucide-react';

const ImagePopup = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setLoading(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-3xl w-full mx-4 bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Damaged Food Package</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={toggleZoom}
            >
              {isZoomed ? (
                <ZoomOut className="w-5 h-5 text-gray-600" />
              ) : (
                <ZoomIn className="w-5 h-5 text-gray-600" />
              )}
            </button> */}
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Image Section */}
        <div className="relative h-[60vh] bg-gray-50 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className={`max-h-full max-w-full object-contaAwaiting Deliveryion-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={toggleZoom}
              onLoad={() => setLoading(false)}
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 ${currentIndex === index
                  ? 'ring-2 ring-orange-500'
                  : 'hover:ring-2 hover:ring-gray-300'
                  }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                {currentIndex === index && (
                  <div className="absolute inset-0 bg-orange-500/10 rounded-lg" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Image {currentIndex + 1} of {images.length}
          </div>
          {/* <div className="flex gap-3">
            <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2">
              <Share className="w-4 h-4" />
              Share
            </button>
          </div> */}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImagePopup;