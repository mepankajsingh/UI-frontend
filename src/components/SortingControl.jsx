import { useState, useEffect } from 'react';

export default function SortingControl() {
  const [sortBy, setSortBy] = useState('popular');
  
  // Initialize from localStorage if available
  useEffect(() => {
    const savedSort = localStorage.getItem('librarySortBy');
    if (savedSort) {
      setSortBy(savedSort);
      // Also dispatch the event to apply the sort immediately
      dispatchSortEvent(savedSort);
    }
  }, []);
  
  const dispatchSortEvent = (sortValue) => {
    const event = new CustomEvent('sortChange', {
      detail: { sortBy: sortValue }
    });
    document.dispatchEvent(event);
  };
  
  const handleSortChange = (value) => {
    setSortBy(value);
    localStorage.setItem('librarySortBy', value);
    dispatchSortEvent(value);
  };
  
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
      <div className="text-sm font-medium text-gray-700">Sort by:</div>
      <div className="flex space-x-2">
        <SortButton 
          active={sortBy === 'popular'} 
          onClick={() => handleSortChange('popular')}
        >
          Popular
        </SortButton>
        <SortButton 
          active={sortBy === 'latest'} 
          onClick={() => handleSortChange('latest')}
        >
          Latest
        </SortButton>
        <SortButton 
          active={sortBy === 'components'} 
          onClick={() => handleSortChange('components')}
        >
          Components
        </SortButton>
        <SortButton 
          active={sortBy === 'downloads'} 
          onClick={() => handleSortChange('downloads')}
        >
          Downloads
        </SortButton>
      </div>
    </div>
  );
}

function SortButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
        active
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}
