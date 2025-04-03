import { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

export default function FilterComponent({ frameworks = [], tags = [] }) {
  const [filters, setFilters] = useState({
    framework: '',
    theme: '',
    pricing: '',
    stars: ''
  });
  
  // Reset state when component is mounted to ensure consistent state after navigation
  useEffect(() => {
    // If there were previously selected filters in localStorage, use those
    const savedFilters = localStorage.getItem('libraryFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(parsedFilters);
        // Also dispatch the event to apply the filters immediately
        dispatchFilterEvent(parsedFilters);
      } catch (e) {
        console.error('Error parsing saved filters:', e);
      }
    }
  }, []);
  
  const dispatchFilterEvent = (newFilters) => {
    const event = new CustomEvent('filterChange', {
      detail: { filters: newFilters }
    });
    document.dispatchEvent(event);
  };
  
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Save to localStorage for persistence
    localStorage.setItem('libraryFilters', JSON.stringify(newFilters));
    
    // Dispatch the custom event
    dispatchFilterEvent(newFilters);
  };
  
  // Wrap the Select component in a client-only renderer
  const SelectWrapper = ({ children, ...props }) => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    if (!isMounted) {
      // Return a placeholder while not mounted
      return (
        <div className="relative w-full border border-gray-300 rounded-md py-1 px-2 text-xs">
          Loading...
        </div>
      );
    }
    
    return <Select.Root {...props}>{children}</Select.Root>;
  };
  
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xs font-medium text-gray-700 mb-1">Framework</h3>
        <SelectWrapper
          value={filters.framework}
          onValueChange={(value) => handleFilterChange('framework', value)}
        >
          <Select.Trigger
            className="inline-flex items-center justify-between w-full border border-gray-300 rounded-md py-1 px-2 text-xs bg-white hover:bg-gray-50"
            aria-label="Framework"
          >
            <Select.Value placeholder="All frameworks" />
            <Select.Icon>
              <ChevronDownIcon className="h-3 w-3" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content
              className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50"
              position="popper"
              sideOffset={5}
            >
              <Select.ScrollUpButton className="flex items-center justify-center h-5 bg-white text-gray-700 cursor-default">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>All frameworks</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                {frameworks && frameworks.map((framework) => (
                  <Select.Item
                    key={framework.slug}
                    value={framework.slug}
                    className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                  >
                    <Select.ItemText>{framework.name}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                      <CheckIcon className="h-3 w-3" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
              
              <Select.ScrollDownButton className="flex items-center justify-center h-5 bg-white text-gray-700 cursor-default">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </SelectWrapper>
      </div>
      
      <div>
        <h3 className="text-xs font-medium text-gray-700 mb-1">Theme Style</h3>
        <SelectWrapper
          value={filters.theme}
          onValueChange={(value) => handleFilterChange('theme', value)}
        >
          <Select.Trigger
            className="inline-flex items-center justify-between w-full border border-gray-300 rounded-md py-1 px-2 text-xs bg-white hover:bg-gray-50"
            aria-label="Theme Style"
          >
            <Select.Value placeholder="All styles" />
            <Select.Icon>
              <ChevronDownIcon className="h-3 w-3" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content
              className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50"
              position="popper"
              sideOffset={5}
            >
              <Select.ScrollUpButton className="flex items-center justify-center h-5 bg-white text-gray-700 cursor-default">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>All styles</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="tailwind"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>Tailwind CSS</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="css"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>CSS / SCSS</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="styled"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>Styled Components</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
              
              <Select.ScrollDownButton className="flex items-center justify-center h-5 bg-white text-gray-700 cursor-default">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </SelectWrapper>
      </div>
      
      <div>
        <h3 className="text-xs font-medium text-gray-700 mb-1">Pricing</h3>
        <SelectWrapper
          value={filters.pricing}
          onValueChange={(value) => handleFilterChange('pricing', value)}
        >
          <Select.Trigger
            className="inline-flex items-center justify-between w-full border border-gray-300 rounded-md py-1 px-2 text-xs bg-white hover:bg-gray-50"
            aria-label="Pricing"
          >
            <Select.Value placeholder="All pricing" />
            <Select.Icon>
              <ChevronDownIcon className="h-3 w-3" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content
              className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50"
              position="popper"
              sideOffset={5}
            >
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>All pricing</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="free"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>Free</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="paid"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>Paid</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="freemium"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>Freemium</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </SelectWrapper>
      </div>
      
      <div>
        <h3 className="text-xs font-medium text-gray-700 mb-1">GitHub Stars</h3>
        <SelectWrapper
          value={filters.stars}
          onValueChange={(value) => handleFilterChange('stars', value)}
        >
          <Select.Trigger
            className="inline-flex items-center justify-between w-full border border-gray-300 rounded-md py-1 px-2 text-xs bg-white hover:bg-gray-50"
            aria-label="GitHub Stars"
          >
            <Select.Value placeholder="Any stars" />
            <Select.Icon>
              <ChevronDownIcon className="h-3 w-3" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content
              className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200 z-50"
              position="popper"
              sideOffset={5}
            >
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>Any stars</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="1000+"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>1,000+ stars</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="5000+"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>5,000+ stars</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
                
                <Select.Item
                  value="10000+"
                  className="relative flex items-center px-6 py-1 text-xs rounded-md hover:bg-gray-100 cursor-pointer outline-none data-[highlighted]:bg-gray-100"
                >
                  <Select.ItemText>10,000+ stars</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                    <CheckIcon className="h-3 w-3" />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </SelectWrapper>
      </div>
      
      {/* Reset filters button */}
      <button
        onClick={() => {
          const resetFilters = {
            framework: '',
            theme: '',
            pricing: '',
            stars: ''
          };
          setFilters(resetFilters);
          localStorage.removeItem('libraryFilters');
          dispatchFilterEvent(resetFilters);
        }}
        className="w-full mt-2 py-1 px-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}
