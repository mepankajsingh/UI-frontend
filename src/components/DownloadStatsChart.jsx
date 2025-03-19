import { useState, useEffect, useRef } from 'react';
import { getOptimizedNpmStats } from '../lib/npmStats';

export default function DownloadStatsChart({ packageName }) {
  const [downloadsData, setDownloadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const chartRef = useRef(null);

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
        const data = await getOptimizedNpmStats(packageName, 7);
        
        if (isMounted && data && data.length > 0) {
          setDownloadsData(data);
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

  // Handle mouse movement for interactive tooltips
  const handleMouseMove = (e) => {
    if (!chartRef.current || !downloadsData.length) return;
    
    const chartRect = chartRef.current.getBoundingClientRect();
    const chartWidth = chartRect.width - 80;
    const relativeX = e.clientX - chartRect.left - 50;
    
    if (relativeX < 0 || relativeX > chartWidth) {
      setActivePoint(null);
      return;
    }
    
    // Find the closest data point
    const pointIndex = Math.round((relativeX / chartWidth) * (downloadsData.length - 1));
    if (pointIndex >= 0 && pointIndex < downloadsData.length) {
      setActivePoint(pointIndex);
    }
  };
  
  const handleMouseLeave = () => {
    setActivePoint(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center h-64 shadow-sm">
        <div className="animate-pulse text-gray-400 flex flex-col items-center">
          <svg className="animate-spin h-6 w-6 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading download statistics...
        </div>
      </div>
    );
  }

  if (error || !downloadsData || downloadsData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center h-64 shadow-sm">
        <div className="text-gray-400 flex flex-col items-center">
          <svg className="h-6 w-6 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error || `No download statistics available for ${packageName}`}
        </div>
      </div>
    );
  }

  // Calculate total downloads
  const totalDownloads = downloadsData.reduce((sum, day) => sum + day.downloads, 0);
  
  // Calculate average downloads per day
  const avgDownloadsPerDay = Math.round(totalDownloads / downloadsData.length);
  
  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Find min and max downloads for scaling
  const maxDownloads = Math.max(...downloadsData.map(day => day.downloads));
  const minDownloads = Math.min(...downloadsData.map(day => day.downloads));
  
  // Add padding to the top of the chart and to the bottom for better spacing
  const chartMax = maxDownloads * 1.1;
  const chartMin = Math.max(0, minDownloads * 0.9); // Ensure we don't go below 0
  
  // Chart dimensions
  const chartHeight = 200;
  const chartPadding = { top: 30, bottom: 80, left: 50, right: 30 };
  
  // Create data points with precise spacing
  const dataPoints = downloadsData.map((day, index) => {
    // Use fixed positions for each data point to ensure precise alignment
    const totalPoints = downloadsData.length;
    const availableWidth = 90; // 90% of the available width
    const sideMargin = (100 - availableWidth) / 2;
    
    // Calculate fixed x positions to ensure consistent alignment of dots, tooltip, and dates
    const x = sideMargin + (index / (totalPoints - 1)) * availableWidth;
    
    // Calculate y position
    const y = chartHeight - ((day.downloads - chartMin) / (chartMax - chartMin)) * chartHeight;
    
    return { x, y, downloads: day.downloads, date: day.day };
  });

  // Create SVG path for the chart
  const createChartPath = () => {
    if (!dataPoints.length) return '';
    
    // Create a smooth curve
    let path = `M ${dataPoints[0].x}% ${dataPoints[0].y}`;
    
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const currentPoint = dataPoints[i];
      const nextPoint = dataPoints[i + 1];
      
      // Calculate control points for the curve
      const controlPoint1X = currentPoint.x + (nextPoint.x - currentPoint.x) / 2;
      const controlPoint2X = currentPoint.x + (nextPoint.x - currentPoint.x) / 2;
      
      path += ` C ${controlPoint1X}% ${currentPoint.y} ${controlPoint2X}% ${nextPoint.y} ${nextPoint.x}% ${nextPoint.y}`;
    }
    
    return path;
  };
  
  // Create area path (line + bottom enclosure)
  const createAreaPath = () => {
    if (!dataPoints.length) return '';
    
    let path = createChartPath();
    path += ` L ${dataPoints[dataPoints.length - 1].x}% ${chartHeight} L ${dataPoints[0].x}% ${chartHeight} Z`;
    
    return path;
  };
  
  // Get day of week
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-gray-900">Download Statistics</h2>
        <div className="text-xs text-gray-500 flex items-center space-x-4">
          <span>Last 7 days: <span className="font-medium text-gray-700">{formatNumber(totalDownloads)} downloads</span></span>
          <span>Daily average: <span className="font-medium text-gray-700">{formatNumber(avgDownloadsPerDay)}</span></span>
        </div>
      </div>
      
      <div 
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        ref={chartRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'relative' }}
      >
        <div style={{ height: `${chartHeight + chartPadding.top + chartPadding.bottom}px`, position: 'relative' }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500" 
               style={{ 
                 paddingBottom: `${chartPadding.bottom}px`, 
                 paddingTop: `${chartPadding.top}px`,
                 width: `${chartPadding.left - 10}px` 
               }}>
            <span>{formatNumber(chartMax)}</span>
            <span>{formatNumber((chartMax + chartMin) / 2)}</span>
            <span>{formatNumber(chartMin)}</span>
          </div>
          
          {/* Chart area */}
          <div className="absolute inset-0" style={{ 
            paddingLeft: `${chartPadding.left}px`, 
            paddingRight: `${chartPadding.right}px`, 
            paddingBottom: `${chartPadding.bottom}px`,
            paddingTop: `${chartPadding.top}px`
          }}>
            <svg width="100%" height={chartHeight} preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1={0} x2="100%" y2={0} stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1={chartHeight/2} x2="100%" y2={chartHeight/2} stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1={chartHeight} x2="100%" y2={chartHeight} stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Vertical grid lines at exact data point positions */}
              {dataPoints.map((point, idx) => (
                <line key={`grid-${idx}`} 
                      x1={`${point.x}%`} y1="0" 
                      x2={`${point.x}%`} y2={chartHeight} 
                      stroke="#f3f4f6" strokeWidth="1" />
              ))}
              
              {/* Area under the curve */}
              <path
                d={createAreaPath()}
                fill="rgba(79, 70, 229, 0.1)"
                stroke="none"
              />
              
              {/* Line connecting all points */}
              <path
                d={createChartPath()}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Average line */}
              <line 
                x1="0" 
                y1={chartHeight - ((avgDownloadsPerDay - chartMin) / (chartMax - chartMin)) * chartHeight} 
                x2="100%" 
                y2={chartHeight - ((avgDownloadsPerDay - chartMin) / (chartMax - chartMin)) * chartHeight} 
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              
              {/* Data points */}
              {dataPoints.map((point, index) => (
                <circle
                  key={index}
                  cx={`${point.x}%`}
                  cy={point.y}
                  r={activePoint === index ? 6 : 4}
                  fill={activePoint === index ? "#4f46e5" : "white"}
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
            
            {/* Average line label */}
            <div className="absolute right-2 text-xs text-gray-500" 
                 style={{ 
                   top: `${chartHeight - ((avgDownloadsPerDay - chartMin) / (chartMax - chartMin)) * chartHeight}px`,
                   transform: 'translate(0, -50%)'
                 }}>
              <span className="bg-white px-1 border border-gray-200 rounded text-xs">Avg</span>
            </div>
            
            {/* Active point tooltip - FIXED ALIGNMENT */}
            {activePoint !== null && (
              <div className="pointer-events-none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {/* FIXED: Ensure vertical line is precisely aligned with the data point */}
                <div style={{
                  position: 'absolute',
                  left: `${dataPoints[activePoint].x}%`,
                  top: 0,
                  height: '100%', // Extend to cover entire chart including date labels
                  width: '1px', // Exact 1px width
                  backgroundColor: '#4f46e5',
                  opacity: 0.7,
                  zIndex: 5
                }}></div>
                
                {/* FIXED: Position tooltip exactly on same line as dot */}
                <div style={{
                  position: 'absolute',
                  left: `calc(${dataPoints[activePoint].x}% + 8px)`,
                  top: `${dataPoints[activePoint].y}px`,
                  transform: 'translateY(-50%)', // Center vertically with the dot
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  zIndex: 20,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>
                  {formatNumber(dataPoints[activePoint].downloads)}
                  <span className="ml-1 opacity-80">
                    {formatDate(dataPoints[activePoint].date)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* X-axis labels - FIXED ALIGNMENT */}
          <div className="absolute left-0 right-0 bottom-0" style={{ 
            paddingLeft: `${chartPadding.left}px`, 
            paddingRight: `${chartPadding.right}px`,
            height: `${chartPadding.bottom}px`
          }}>
            {dataPoints.map((point, index) => (
              <div key={`day-${index}`} className="flex flex-col items-center absolute text-xs text-gray-500" 
                   style={{ 
                     left: `${point.x}%`, 
                     transform: 'translateX(-50%)',
                     bottom: '20px', // Position from bottom for better control
                     width: '60px',
                     textAlign: 'center'
                   }}>
                <span className="font-medium">{getDayOfWeek(downloadsData[index].day)}</span>
                <span>{formatDate(downloadsData[index].day)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}