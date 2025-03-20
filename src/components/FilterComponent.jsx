import { useState, useEffect } from 'react';

export default function FilterComponent({ frameworks = [], onFilterChange }) {
  const [filters, setFilters] = useState({
    framework: '',
    theme: '',
    pricing: '',
    stars: ''
  });
  
  const [isOpen, setIsOpen] = useState({
    framework: false,
    theme: false,
    pricing: false,
    stars: false
  });
  
  // Reset state when component is mounted to ensure consistent state after navigation
  useEffect(() => {
    setFilters({
      framework: '',
      theme: '',
      pricing: '',
      stars: ''
    });
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsOpen({
          framework: false,
          theme: false,
          pricing: false,
          stars: false
        });
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = (dropdownName) => {
    setIsOpen(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };
  
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: filters[filterType] === value ? '' : value
    };
    
    setFilters(newFilters);
    setIsOpen(prev => ({
      ...prev,
      [filterType]: false
    }));
    
    // Dispatch a custom event that the vanilla JS can listen for
    const event = new CustomEvent('filterChange', {
      detail: { filters: newFilters }
    });
    document.dispatchEvent(event);
    
    console.log('Filter changed:', filterType, 'to', value);
    console.log('New filters state:', newFilters);
  };
  
  const themeOptions = [
    { id: 'styled', label: 'Styled' },
    { id: 'unstyled', label: 'Unstyled' }
  ];
  
  const pricingOptions = [
    { id: 'free', label: 'Free' },
    { id: 'freemium', label: 'Freemium' }
  ];
  
  const starsOptions = [
    { id: '1000', label: '1000+' },
    { id: '5000', label: '5000+' },
    { id: '10000', label: '10,000+' }
  ];
  
  const getSelectedLabel = (filterType, options) => {
    if (!filters[filterType]) return 'All';
    const selected = options.find(option => option.id === filters[filterType]);
    return selected ? selected.label : 'All';
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
      
      <div className="space-y-4">
        {/* Framework filter dropdown */}
        <div className="dropdown-container">
          <h4 className="text-xs font-medium text-gray-500 mb-1.5">Framework</h4>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('framework')}
              className="w-full flex justify-between items-center px-3 py-2 text-xs font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span>{filters.framework ? frameworks.find(f => f.slug === filters.framework)?.name || 'All' : 'All'}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isOpen.framework && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                <div 
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${!filters.framework ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}
                  onClick={() => handleFilterChange('framework', '')}
                >
                  All
                </div>
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                      filters.framework === framework.slug ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`}
                    onClick={() => handleFilterChange('framework', framework.slug)}
                  >
                    {framework.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Theme filter dropdown */}
        <div className="dropdown-container">
          <h4 className="text-xs font-medium text-gray-500 mb-1.5">Theme</h4>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('theme')}
              className="w-full flex justify-between items-center px-3 py-2 text-xs font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span>{getSelectedLabel('theme', themeOptions)}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isOpen.theme && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                <div 
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${!filters.theme ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}
                  onClick={() => handleFilterChange('theme', '')}
                >
                  All
                </div>
                {themeOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                      filters.theme === option.id ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`}
                    onClick={() => handleFilterChange('theme', option.id)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Pricing filter dropdown */}
        <div className="dropdown-container">
          <h4 className="text-xs font-medium text-gray-500 mb-1.5">Pricing</h4>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('pricing')}
              className="w-full flex justify-between items-center px-3 py-2 text-xs font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span>{getSelectedLabel('pricing', pricingOptions)}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isOpen.pricing && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                <div 
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${!filters.pricing ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}
                  onClick={() => handleFilterChange('pricing', '')}
                >
                  All
                </div>
                {pricingOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                      filters.pricing === option.id ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`}
                    onClick={() => handleFilterChange('pricing', option.id)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* GitHub Stars filter dropdown */}
        <div className="dropdown-container">
          <h4 className="text-xs font-medium text-gray-500 mb-1.5">GitHub Stars</h4>
          <div className="relative">
            <button
              onClick={() => toggleDropdown('stars')}
              className="w-full flex justify-between items-center px-3 py-2 text-xs font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span>{getSelectedLabel('stars', starsOptions)}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isOpen.stars && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                <div 
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${!filters.stars ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`}
                  onClick={() => handleFilterChange('stars', '')}
                >
                  All
                </div>
                {starsOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                      filters.stars === option.id ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`}
                    onClick={() => handleFilterChange('stars', option.id)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
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
            console.log('All filters cleared');
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
