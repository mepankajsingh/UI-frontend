import { useState, useEffect } from 'react';

export default function SortingControl({ onSortChange, initialSort = 'popular' }) {
  const [activeSort, setActiveSort] = useState(initialSort);
  
  // Reset state when component is mounted to ensure consistent state after navigation
  useEffect(() => {
    setActiveSort(initialSort);
    
    // If there was a previously selected sort in localStorage, use that
    const savedSort = localStorage.getItem('librarySort');
    if (savedSort) {
      setActiveSort(savedSort);
      // Also dispatch the event to apply the sort immediately
      dispatchSortEvent(savedSort);
    }
  }, [initialSort]);
  
  const sortOptions = [
    { id: 'popular', label: 'Popular' },
    { id: 'latest', label: 'Latest' },
    { id: 'components', label: 'Components' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'forks', label: 'Forks' }
  ];
  
  const dispatchSortEvent = (sortId) => {
    const event = new CustomEvent('sortChange', {
      detail: { sortBy: sortId }
    });
    document.dispatchEvent(event);
  };
  
  const handleSortChange = (sortId) => {
    setActiveSort(sortId);
    
    // Save to localStorage for persistence
    localStorage.setItem('librarySort', sortId);
    
    // Dispatch the custom event
    dispatchSortEvent(sortId);
  };
  
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
