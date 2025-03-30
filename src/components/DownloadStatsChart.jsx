import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getOptimizedNpmStats } from '../lib/npmStats';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
          // Filter out current day's data and exclude the last 2 days
          const filteredData = data.slice(0, -2);
          // Get the last 7 days from the filtered data
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

  // Format date for display (MM/DD format)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
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

  // Prepare data for Chart.js
  const chartData = {
    labels: downloadsData.map(day => formatDate(day.day)),
    datasets: [
      {
        label: 'Downloads',
        data: downloadsData.map(day => day.downloads),
        fill: false,
        backgroundColor: 'rgb(75, 85, 99)',
        borderColor: 'rgb(75, 85, 99)',
        borderWidth: 1.5, // Thinner line
        tension: 0.1,
        pointRadius: 3, // Slightly smaller points to match thinner line
        pointHoverRadius: 5
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Downloads: ${context.parsed.y.toLocaleString()}`;
          },
          title: function(context) {
            // Show full date in tooltip (YYYY-MM-DD)
            return context[0].label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatTotal(value);
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10 // Smaller font for dates
          }
        }
      }
    }
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
        <div style={{ height: '200px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
