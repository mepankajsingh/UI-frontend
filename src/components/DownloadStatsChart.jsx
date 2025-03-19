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
    const chartWidth = chartRect.width - 40; // Adjust for padding
    const relativeX = e.clientX - chartRect.left - 30; // Adjust for left padding
    
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

  // Calculate total downloads
  const totalDownloads = downloadsData.reduce((sum, day) => sum + day.downloads, 0);
  
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
  
  // Add a 10% padding to the top of the chart
  const chartMax = maxDownloads * 1.1;
  
  // Chart dimensions
  const chartHeight = 200;
  
  // Create data points for rendering circles
  const dataPoints = downloadsData.map((day, index) => {
    const x = (index / (downloadsData.length - 1)) * 100;
    const y = chartHeight - ((day.downloads - minDownloads) / (chartMax - minDownloads)) * chartHeight;
    return { x, y, downloads: day.downloads, date: day.day };
  });

  // Create SVG path for the chart - using absolute positions to match the image
  const createChartPath = () => {
    if (!dataPoints.length) return '';
    
    // Start at the first point
    let path = `M ${dataPoints[0].x}% ${dataPoints[0].y}`;
    
    // Connect all subsequent points with line segments
    for (let i = 1; i < dataPoints.length; i++) {
      path += ` L ${dataPoints[i].x}% ${dataPoints[i].y}`;
    }
    
    return path;
  };
  
  // Create area path (line + bottom enclosure)
  const createAreaPath = () => {
    if (!dataPoints.length) return '';
    
    let path = createChartPath();
    path += ` L 100% ${chartHeight} L 0 ${chartHeight} Z`;
    
    return path;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-gray-900">Download Statistics</h2>
        <div className="text-xs text-gray-500">
          Last 7 days: <span className="font-medium text-gray-700">{formatNumber(totalDownloads)} downloads</span>
        </div>
      </div>
      
      <div 
        className="bg-white border border-gray-200 rounded-md p-4"
        ref={chartRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'relative' }}
      >
        <div style={{ height: `${chartHeight}px`, position: 'relative' }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500" style={{ paddingBottom: '20px' }}>
            <span>{formatNumber(chartMax)}</span>
            <span>{formatNumber(chartMax/2)}</span>
            <span>0</span>
          </div>
          
          {/* Chart */}
          <div className="absolute inset-0" style={{ paddingLeft: '30px', paddingRight: '10px', paddingBottom: '20px' }}>
            <svg width="100%" height="100%" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1={0} x2="100%" y2={0} stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1={chartHeight/2} x2="100%" y2={chartHeight/2} stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1={chartHeight} x2="100%" y2={chartHeight} stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Area under the curve */}
              <path
                d={createAreaPath()}
                fill="rgba(79, 70, 229, 0.1)"
                stroke="none"
              />
              
              {/* Line connecting all points - this is the key change */}
              <path
                d={createChartPath()}
                fill="none"
                stroke="#404857"  /* Darker color to match image */
                strokeWidth="3"   /* Thicker line to match image */
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {dataPoints.map((point, index) => (
                <circle
                  key={index}
                  cx={`${point.x}%`}
                  cy={point.y}
                  r={activePoint === index ? 6 : 5}  /* Larger dots to match image */
                  fill={activePoint === index ? "#404857" : "white"}
                  stroke="#404857"  /* Darker color to match image */
                  strokeWidth="2.5"
                />
              ))}
            </svg>
            
            {/* Active point tooltip */}
            {activePoint !== null && (
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                pointerEvents: 'none',
                zIndex: 10
              }}>
                <div style={{
                  position: 'absolute',
                  left: `calc(${dataPoints[activePoint].x}% - 30px)`,
                  top: `${dataPoints[activePoint].y - 40}px`,
                  backgroundColor: '#404857',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '60px',
                  zIndex: 20
                }}>
                  {formatNumber(dataPoints[activePoint].downloads)}
                </div>
                <div style={{
                  position: 'absolute',
                  left: `${dataPoints[activePoint].x}%`,
                  top: 0,
                  height: '100%',
                  borderLeft: '1px dashed #404857',
                  zIndex: 10
                }}></div>
              </div>
            )}
          </div>
          
          {/* X-axis labels */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-500" style={{ paddingLeft: '30px', paddingRight: '10px' }}>
            {downloadsData.length > 0 && (
              <>
                <span>{formatDate(downloadsData[0]?.day)}</span>
                <span>{formatDate(downloadsData[Math.floor(downloadsData.length / 2)]?.day)}</span>
                <span>{formatDate(downloadsData[downloadsData.length - 1]?.day)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}