import { useState, useEffect } from 'react';

export default function FilterComponent({ frameworks = [], onFilterChange }) {
  const [filters, setFilters] = useState({
    framework: '',
    theme: '',
    pricing: '',
    stars: ''
  });
  
  // Reset state when component is mounted to ensure consistent state after navigation
  useEffect(() => {
    setFilters({
      framework: '',
      theme: '',
      pricing: '',
      stars: ''
    });
  }, []);
  
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    
    setFilters(newFilters);
    
    // Dispatch a custom event that the vanilla JS can listen for
    const event = new CustomEvent('filterChange', {
      detail: { filters: newFilters }
    });
    document.dispatchEvent(event);
  };
  
  const themeOptions = [
    { id: '', label: 'All Themes' },
    { id: 'styled', label: 'Styled' },
    { id: 'unstyled', label: 'Unstyled' }
  ];
  
  const pricingOptions = [
    { id: '', label: 'All Pricing' },
    { id: 'free', label: 'Free' },
    { id: 'freemium', label: 'Freemium' }
  ];
  
  const starsOptions = [
    { id: '', label: 'All Stars' },
    { id: '1000+', label: '1000+' },
    { id: '5000+', label: '5000+' },
    { id: '10000+', label: '10,000+' }
  ];
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filters</h3>
      
      <div className="space-y-4">
        {/* Framework filter - now a dropdown */}
        <div>
          <label htmlFor="framework-filter" className="block text-xs font-medium text-gray-500 mb-1.5">
            Framework
          </label>
          <select
            id="framework-filter"
            value={filters.framework}
            onChange={(e) => handleFilterChange('framework', e.target.value)}
            className="block w-full rounded-md border-gray-300 py-1.5 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Frameworks</option>
            {frameworks.map((framework) => (
              <option key={framework.id} value={framework.slug}>
                {framework.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Theme filter - now a dropdown */}
        <div>
          <label htmlFor="theme-filter" className="block text-xs font-medium text-gray-500 mb-1.5">
            Theme
          </label>
          <select
            id="theme-filter"
            value={filters.theme}
            onChange={(e) => handleFilterChange('theme', e.target.value)}
            className="block w-full rounded-md border-gray-300 py-1.5 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {themeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Pricing filter - now a dropdown */}
        <div>
          <label htmlFor="pricing-filter" className="block text-xs font-medium text-gray-500 mb-1.5">
            Pricing
          </label>
          <select
            id="pricing-filter"
            value={filters.pricing}
            onChange={(e) => handleFilterChange('pricing', e.target.value)}
            className="block w-full rounded-md border-gray-300 py-1.5 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {pricingOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* GitHub Stars filter - now a dropdown */}
        <div>
          <label htmlFor="stars-filter" className="block text-xs font-medium text-gray-500 mb-1.5">
            GitHub Stars
          </label>
          <select
            id="stars-filter"
            value={filters.stars}
            onChange={(e) => handleFilterChange('stars', e.target.value)}
            className="block w-full rounded-md border-gray-300 py-1.5 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {starsOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Clear filters button - only show if at least one filter is active */}
      {Object.values(filters).some(value => value !== '') && (
        <button
          onClick={() => {
            setFilters({
              framework: '',
              theme: '',
              pricing: '',
              stars: ''
            });
            
            // Dispatch event for clearing filters
            const event = new CustomEvent('filterChange', {
              detail: { 
                filters: {
                  framework: '',
                  theme: '',
                  pricing: '',
                  stars: ''
                } 
              }
            });
            document.dispatchEvent(event);
          }}
          className="mt-4 text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Clear filters
        </button>
      )}
    </div>
  );
}
