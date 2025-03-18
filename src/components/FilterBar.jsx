import { useState, useEffect } from 'react';

export default function FilterBar({ onFilterChange = () => {}, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    minComponents: initialFilters.minComponents || '',
    minDownloads: initialFilters.minDownloads || '',
    lastUpdated: initialFilters.lastUpdated || '',
    tags: initialFilters.tags || [],
    ...initialFilters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Try the callback first
    try {
      if (typeof onFilterChange === 'function') {
        onFilterChange(newFilters);
      }
    } catch (error) {
      console.error('Error in onFilterChange callback:', error);
    }
    
    // Always dispatch the event as a backup
    const event = new CustomEvent('filter-change', { 
      detail: newFilters,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
    
    // Store in sessionStorage as fallback for ISR
    try {
      sessionStorage.setItem('ui-library-filters', JSON.stringify(newFilters));
    } catch (e) {
      console.error('Failed to store filters in sessionStorage:', e);
    }
  };

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    handleFilterChange('tags', newTags);
  };

  // Initialize filters on mount with a slight delay to ensure DOM is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      // Dispatch initial filters when component mounts
      const event = new CustomEvent('filter-change', { 
        detail: filters,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
      
      // Store in sessionStorage as fallback for ISR
      try {
        sessionStorage.setItem('ui-library-filters', JSON.stringify(filters));
      } catch (e) {
        console.error('Failed to store filters in sessionStorage:', e);
      }
      
      // Signal that the component is mounted and ready
      document.dispatchEvent(new CustomEvent('filter-component-ready'));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
      <h2 className="text-sm font-medium text-gray-900 mb-2">Filters</h2>
      
      <div className="space-y-3">
        {/* Components count filter */}
        <div>
          <label htmlFor="components-filter" className="block text-xs font-medium text-gray-700 mb-1">
            Minimum Components
          </label>
          <input
            id="components-filter"
            type="number"
            min="0"
            value={filters.minComponents}
            onChange={(e) => handleFilterChange('minComponents', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
            placeholder="Min components"
          />
        </div>

        {/* Downloads filter */}
        <div>
          <label htmlFor="downloads-filter" className="block text-xs font-medium text-gray-700 mb-1">
            Minimum Downloads
          </label>
          <select
            id="downloads-filter"
            value={filters.minDownloads}
            onChange={(e) => handleFilterChange('minDownloads', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
          >
            <option value="">Any</option>
            <option value="1000">1k+</option>
            <option value="10000">10k+</option>
            <option value="100000">100k+</option>
            <option value="1000000">1M+</option>
          </select>
        </div>

        {/* Update date filter */}
        <div>
          <label htmlFor="update-filter" className="block text-xs font-medium text-gray-700 mb-1">
            Last Updated
          </label>
          <select
            id="update-filter"
            value={filters.lastUpdated}
            onChange={(e) => handleFilterChange('lastUpdated', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xs"
          >
            <option value="">Any time</option>
            <option value="7">Last week</option>
            <option value="30">Last month</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Feature tags */}
        <div>
          <span className="block text-xs font-medium text-gray-700 mb-1">Features</span>
          <div className="flex flex-wrap gap-1">
            {['Styling', 'Customization', 'Accessibility', 'Dark Mode', 'TypeScript'].map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag.toLowerCase())}
                className={`px-2 py-0.5 text-xs rounded-full ${
                  filters.tags.includes(tag.toLowerCase())
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
