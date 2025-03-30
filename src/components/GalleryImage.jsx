import { useState, useEffect } from 'react';
import ImageModal from './ImageModal';

export default function GalleryImage({ image, index, libraryName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Reset loading state when image prop changes
  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
    
    // Preload the image
    const img = new Image();
    img.src = image.url;
    
    img.onload = () => {
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      setHasError(true);
    };
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [image.url]);
  
  const alt = image.alt || `${libraryName} screenshot ${index + 1}`;
  
  return (
    <>
      <div 
        className="border border-gray-200 rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] relative"
        onClick={() => !hasError && setIsModalOpen(true)}
        style={{ 
          height: '160px', // Fixed height for consistent thumbnails
          background: '#f9fafb' // Light gray background while loading
        }}
      >
        {/* Loading placeholder */}
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Error placeholder */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Actual image with object-cover for cropping */}
        <img 
          src={image.url} 
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      
      <ImageModal 
        isOpen={isModalOpen}
        imageUrl={image.url}
        alt={alt}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
