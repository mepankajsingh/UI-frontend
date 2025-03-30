import { useState, useEffect } from 'react';

export default function ImageModal({ isOpen, imageUrl, alt, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Reset loading state when modal opens with new image
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, imageUrl]);
  
  // Handle keyboard events (Escape key to close)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full">
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Error message */}
        {hasError && (
          <div className="bg-gray-800 text-white p-4 rounded-md">
            <p>Failed to load image</p>
          </div>
        )}
        
        {/* Full-size image */}
        <img 
          src={imageUrl} 
          alt={alt} 
          className={`max-h-[90vh] max-w-[90vw] object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onClick={(e) => e.stopPropagation()}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
    </div>
  );
}
