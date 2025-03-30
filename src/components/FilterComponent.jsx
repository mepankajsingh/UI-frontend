import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

export default function FilterComponent({ frameworks = [], onFilterChange }) {
  const [filters, setFilters] = useState({
    framework: '',
    theme: '',
    pricing: '',
    stars: ''
  });
  
  // Reset state when component is mounted to ensure consistent state after navigation
  useEffect(() => {
    // Try to load saved filters from localStorage
    try {
      const savedFilters = localStorage.getItem('libraryFilters');
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
        
        // Also dispatch the event to apply the filters immediately
        dispatchFilterEvent(parsedFilters);
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
      // Reset to default if there's an error
      setFilters({
        framework: '',
        theme: '',
        pricing: '',
        stars: ''
      });
    }
  }, []);
  
  const dispatchFilterEvent = (filterValues) => {
    const event = new CustomEvent('filterChange', {
      detail: { filters: filterValues }
    });
    document.dispatchEvent(event);
  };
  
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    
    setFilters(newFilters);
    
    // Save to localStorage for persistence
    localStorage.setItem('libraryFilters', JSON.stringify(newFilters));
    
    // Dispatch the custom event
    dispatchFilterEvent(newFilters);
  };
  
  const themeOptions = [
    { id: 'all', label: 'All Themes' },
    { id: 'styled', label: 'Styled' },
    { id: 'unstyled', label: 'Unstyled' }
  ];
  
  const pricingOptions = [
    { id: 'all', label: 'All Pricing' },
    { id: 'free', label: 'Free' },
    { id: 'freemium', label: 'Freemium' }
  ];
  
  const starsOptions = [
    { id: 'all', label: 'All Stars' },
    { id: '1000+', label: '1000+' },
    { id: '5000+', label: '5000+' },
    { id: '10000+', label: '10,000+' }
  ];
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filters</h3>
      
      <div className="space-y-4">
        {/* Framework filter - Radix Select */}
        <div>
          <label htmlFor="framework-filter" className="block text-xs font-medium text-gray-500 mb-1.5">
            Framework
          </label>
          <Select.Root 
            value={filters.framework} 
            onValueChange={(value) => handleFilterChange('framework', value)}
          >
            <Select.Trigger 
              id="framework-filter"
              className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="Framework"
            >
              <Select.Value placeholder="All Frameworks" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content 
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50"
                position="popper"
                sideOffset={5}
              >
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                
                <Select.Viewport className="p-1">
                  <Select.Item 
                    value="all" 
                    className="text-xs relative flex items-center px-6 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-900 cursor-default select-none outline-none data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900"
                  >
                    <Select.ItemText>All Frameworks</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                  
                  {frameworks.map((framework) => (
                    <Select.Item 
                      key={framework.id} 
                      value={framework.slug}
                      className="text-xs relative flex items-center px-6 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-900 cursor-default select-none outline-none data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900"
                    >
                      <Select.ItemText>{framework.name}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        
        {/* Theme filter - Radix Select */}
        <div>
          <label htmlFor="theme-filter" className="block text-xs font-medium text-gray-500 mb-1.5">
            Theme
          </label>
          <Select.Root 
            value={filters.theme} 
            onValueChange={(value) => handleFilterChange('theme', value)}
          >
            <Select.Trigger 
              id="theme-filter"
              className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="Theme"
            >
              <Select.Value placeholder="All Themes" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content 
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50"
                position="popper"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  {themeOptions.map((option) => (
                    <Select.Item 
                      key={option.id} 
                      value={option.id}
                      className="text-xs relative flex items-center px-6 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-900 cursor-default select-none outline-none data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        
        {/* Pricing filter - Radix Select */}
        <div>
          <label htmlFor="pricing-filter" className="block text-xs font-medium text-gray-500 mb-1.5">
            Pricing
          </label>
          <Select.Root 
            value={filters.pricing} 
            onValueChange={(value) => handleFilterChange('pricing', value)}
          >
            <Select.Trigger 
              id="pricing-filter"
              className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="Pricing"
            >
              <Select.Value placeholder="All Pricing" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content 
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50"
                position="popper"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  {pricingOptions.map((option) => (
                    <Select.Item 
                      key={option.id} 
                      value={option.id}
                      className="text-xs relative flex items-center px-6 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-900 cursor-default select-none outline-none data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        
        {/* GitHub Stars filter - Radix Select */}
        <div>
          <label htmlFor="stars-filter" className="block text-xs font-medium text-gray-500 mb-1.5">
            GitHub Stars
          </label>
          <Select.Root 
            value={filters.stars} 
            onValueChange={(value) => handleFilterChange('stars', value)}
          >
            <Select.Trigger 
              id="stars-filter"
              className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-label="GitHub Stars"
            >
              <Select.Value placeholder="All Stars" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content 
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50"
                position="popper"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  {starsOptions.map((option) => (
                    <Select.Item 
                      key={option.id} 
                      value={option.id}
                      className="text-xs relative flex items-center px-6 py-2 rounded-md hover:bg-indigo-100 hover:text-indigo-900 cursor-default select-none outline-none data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-900"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
      
      {/* Clear filters button - only show if at least one filter is active */}
      {Object.values(filters).some(value => value !== '') && (
        <button
          onClick={() => {
            const emptyFilters = {
              framework: '',
              theme: '',
              pricing: '',
              stars: ''
            };
            
            setFilters(emptyFilters);
            
            // Clear localStorage
            localStorage.removeItem('libraryFilters');
            
            // Dispatch event for clearing filters
            dispatchFilterEvent(emptyFilters);
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
