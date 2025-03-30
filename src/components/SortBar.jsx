import { useState, useEffect } from 'react';

export default function SortBar({ onSortChange = () => {}, initialSort = { field: 'popularity', direction: 'desc' } }) {
  const [sortConfig, setSortConfig] = useState(initialSort);

  const handleSortChange = (field) => {
    const direction = 
      sortConfig.field === field && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    
    const newSortConfig = { field, direction };
    setSortConfig(newSortConfig);
    
    // Try the callback first
    try {
      if (typeof onSortChange === 'function') {
        onSortChange(newSortConfig);
      }
    } catch (error) {
      console.error('Error in onSortChange callback:', error);
    }
    
    // Always dispatch the event as a backup
    const event = new CustomEvent('sort-change', { 
      detail: newSortConfig,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
    
    // Store in sessionStorage as fallback for ISR
    try {
      sessionStorage.setItem('ui-library-sort', JSON.stringify(newSortConfig));
    } catch (e) {
      console.error('Failed to store sort config in sessionStorage:', e);
    }
  };

  // Initialize sort on mount with a slight delay to ensure DOM is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      // Dispatch initial sort when component mounts
      const event = new CustomEvent('sort-change', { 
        detail: sortConfig,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
      
      // Store in sessionStorage as fallback for ISR
      try {
        sessionStorage.setItem('ui-library-sort', JSON.stringify(sortConfig));
      } catch (e) {
        console.error('Failed to store sort config in sessionStorage:', e);
      }
      
      // Signal that the component is mounted and ready
      document.dispatchEvent(new CustomEvent('sort-component-ready'));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return null;
    }
    
    return sortConfig.direction === 'desc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  };

  const sortOptions = [
    { id: 'popularity', label: 'Popularity' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'components', label: 'Components' },
    { id: 'updated', label: 'Last Updated' },
    { id: 'name', label: 'Name' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
      <div className="flex items-center">
        <span className="text-xs font-medium text-gray-700 mr-2">Sort:</span>
        
        <div className="flex flex-wrap gap-1">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSortChange(option.id)}
              className={`flex items-center px-2 py-1 text-xs rounded-md ${
                sortConfig.field === option.id
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.label}
              {getSortIcon(option.id) && <span className="ml-1">{getSortIcon(option.id)}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
