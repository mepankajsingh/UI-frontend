import { useState, useEffect } from 'react';
import { getOptimizedNpmStats } from '../lib/npmStats';

export default function DownloadStatsChart({ packageName }) {
  const [downloadsData, setDownloadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!packageName) {
        if (isMounted) {
          setLoading(false);
          setError('No package name provided');
        }
        return;
      }

      try {
        if (isMounted) setLoading(true);
        
        // Use the optimized function that leverages caching
        const data = await getOptimizedNpmStats(packageName);
        
        if (isMounted && data && data.length > 0) {
          // Filter out current day's data and use the last 7 days
          const today = new Date().toISOString().split('T')[0];
          const filteredData = data.filter(day => day.day !== today);
          const last7DaysData = filteredData.slice(-7);
          
          setDownloadsData(last7DaysData);
          setLoading(false);
          setError(null);
        } else if (isMounted) {
          setError(`No download data available for ${packageName}`);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error fetching download stats for ${packageName}:`, err);
        if (isMounted) {
          setError(`Failed to load download stats: ${err.message}`);
          setLoading(false);
        }
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [packageName]);

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-md p-4 flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">Loading download statistics...</div>
      </div>
    );
  }

  if (error || !downloadsData || downloadsData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-4 flex items-center justify-center h-64">
        <div className="text-gray-400">
          {error || `No download statistics available for ${packageName}`}
        </div>
      </div>
    );
  }

  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = '100%';
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  
  // Find max downloads for scaling
  const maxDownloads = Math.max(...downloadsData.map(day => day.downloads));
  
  // Calculate scale for y-axis
  const yScale = (value) => {
    return chartHeight - padding.bottom - (value / maxDownloads) * (chartHeight - padding.top - padding.bottom);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };
  
  // Format total downloads
  const totalDownloads = downloadsData.reduce((sum, day) => sum + day.downloads, 0);
  const formatTotal = (num) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-gray-900">Download Statistics</h2>
        <div className="text-xs text-gray-500">
          Last 7 days: <span className="font-medium text-gray-700">{formatTotal(totalDownloads)} downloads</span>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <div style={{ height: `${chartHeight}px`, width: chartWidth, position: 'relative' }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500" style={{ paddingTop: padding.top, paddingBottom: padding.bottom }}>
            <span>{formatTotal(maxDownloads)}</span>
            <span>{formatTotal(maxDownloads/2)}</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="absolute inset-0" style={{ paddingTop: padding.top, paddingBottom: padding.bottom, paddingLeft: padding.left, paddingRight: padding.right }}>
            <svg width="100%" height="100%" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1={yScale(0)} x2="100%" y2={yScale(0)} stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1={yScale(maxDownloads/2)} x2="100%" y2={yScale(maxDownloads/2)} stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1={yScale(maxDownloads)} x2="100%" y2={yScale(maxDownloads)} stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Columns */}
              {downloadsData.map((day, index) => {
                // Calculate column position and dimensions
                const barWidth = 100 / downloadsData.length;
                // Reduce column width by 70% (keep only 30% of original width)
                const barPadding = barWidth * 0.7; // 70% padding (35% on each side)
                const x = index * barWidth;
                const columnWidth = barWidth - barPadding;
                
                const columnHeight = (day.downloads / maxDownloads) * (chartHeight - padding.top - padding.bottom);
                const y = chartHeight - padding.bottom - columnHeight;
                
                return (
                  <g key={day.day}>
                    {/* The actual column */}
                    <rect
                      x={`${x + barPadding/2}%`}
                      y={y}
                      width={`${columnWidth}%`}
                      height={columnHeight}
                      fill="#6B7280" // Gray-500 from Tailwind
                      rx="2"
                    />
                    
                    {/* Column hover area with tooltip */}
                    <foreignObject
                      x={`${x}%`}
                      y={0}
                      width={`${barWidth}%`}
                      height={chartHeight}
                    >
                      <div 
                        className="w-full h-full relative" 
                        xmlns="http://www.w3.org/1999/xhtml"
                      >
                        {/* Invisible hover target */}
                        <div className="absolute inset-0 cursor-pointer group">
                          {/* Tooltip */}
                          <div 
                            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mt-[-10px] px-3 py-1.5 bg-gray-700 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                            style={{ top: y - 5, zIndex: 99999 }}
                          >
                            <div className="absolute w-3 h-3 bg-gray-700 transform rotate-45 -bottom-1 left-1/2 -ml-1.5"></div>
                            {day.downloads.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* X-axis labels */}
          <div className="absolute left-0 right-0 bottom-0" style={{ paddingLeft: padding.left, paddingRight: padding.right }}>
            <div className="flex justify-between text-xs text-gray-500">
              {downloadsData.map((day, index) => (
                <div key={day.day} className="text-center" style={{ width: `${100 / downloadsData.length}%` }}>
                  {formatDate(day.day)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
