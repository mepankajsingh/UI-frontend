import React from 'react';

/**
 * Skeleton loader component for content that's still loading
 * @param {Object} props - Component props
 * @param {string} props.type - Type of skeleton (card, text, image)
 * @param {number} props.count - Number of skeleton items to display
 * @param {string} props.className - Additional CSS classes
 */
export default function SkeletonLoader({ type = 'card', count = 1, className = '' }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
            <div className="h-40 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
          </div>
        );
        
      case 'image':
        return (
          <div className={`bg-gray-200 animate-pulse ${className}`}></div>
        );
        
      default:
        return (
          <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
}
