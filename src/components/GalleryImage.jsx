import { useState } from 'react';
import ImageModal from './ImageModal';

export default function GalleryImage({ image, index, libraryName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const alt = image.alt || `${libraryName} screenshot ${index + 1}`;
  
  return (
    <>
      <div 
        className="border border-gray-200 rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={image.url} 
          alt={alt}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
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
