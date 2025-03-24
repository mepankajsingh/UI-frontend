import { useState, useEffect } from 'react';

export default function SortingControl() {
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    // Load saved sort preference from localStorage on component mount
    const savedSort = localStorage.getItem('uiriver-sort');
    if (savedSort) {
      setSortBy(savedSort);
      // Dispatch event to apply sorting immediately
      dispatchSortEvent(savedSort);
    }
  }, []);

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    
    // Save to localStorage
    localStorage.setItem('uiriver-sort', newSortBy);
    
    // Dispatch custom event for sorting
    dispatchSortEvent(newSortBy);
  };

  const dispatchSortEvent = (sortValue) => {
    const event = new CustomEvent('sortChange', {
      detail: { sortBy: sortValue }
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-sm font-medium text-gray-700">Sort by</h2>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="popular">Most Popular</option>
          <option value="latest">Recently Updated</option>
          <option value="components">Component Count</option>
          <option value="downloads">Downloads</option>
          <option value="forks">Forks</option>
        </select>
      </div>
    </div>
  );
}
