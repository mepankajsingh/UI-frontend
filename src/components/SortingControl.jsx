import { useState, useEffect } from 'react';

export default function SortingControl({ onSortChange, initialSort = 'popular' }) {
  const [activeSort, setActiveSort] = useState(initialSort);
  
  const sortOptions = [
    { id: 'popular', label: 'Popular' },
    { id: 'latest', label:<boltAction type="file" filePath="src/components/SortingControl.jsx">import { useState, useEffect } from 'react';

export default function SortingControl({ onSortChange, initialSort = 'popular' }) {
  const [activeSort, setActiveSort] = useState(initialSort);
  
  const sortOptions = [
    { id: 'popular', label: 'Popular' },
    { id: 'latest', label: 'Latest' },
    { id: 'components', label: 'Components' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'forks', label: 'Forks' }
  ];
  
  const handleSortChange = (sortId) => {
    setActiveSort(sortId);
    
    // Dispatch a custom event that the vanilla JS can listen for
    const event = new CustomEvent('sortChange', {
      detail: { sortBy: sortId }
    });
    document.dispatchEvent(event);
  };
  
  // Re-initialize component state when navigating between pages
  useEffect(() => {
    // This ensures the component state is properly reset when navigating
    setActiveSort(initialSort);
    
    // Clean up event listeners when component unmounts
    return () => {
      // Any cleanup if needed
    };
  }, [initialSort]);
  
  return (
    <div className="flex items-center space-x-1 mb-4">
      <span className="text-sm text-gray-500 mr-2">Sort by:</span>
      <div className="flex flex-wrap gap-1">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSortChange(option.id)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              activeSort === option.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
