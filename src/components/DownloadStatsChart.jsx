import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { getNpmDownloads } from '../lib/npmStats';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function DownloadStatsChart({ packageName }) {
  const [downloadsData, setDownloadsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartId] = useState(`chart-${Math.random().toString(36).substring(2, 9)}`);

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
        console.log(`Fetching download stats for package: ${packageName}`);
        if (isMounted) setLoading(true);
        
        const data = await getNpmDownloads(packageName);
        console.log(`Download data received for ${packageName}:`, data);
        
        if (isMounted && data) {
          setDownloadsData(data);
          setLoading(false);
          setError(null);
        } else if (isMounted) {
          setError(`No data available for ${packageName}`);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error fetching download stats for ${packageName}:`, err);
        if (isMounted) {
          setError(`Failed to load download statistics: ${err.message}`);
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
      <div className="bg-gray-50 rounded-md p-3 h-40 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading stats for {packageName}...</div>
      </div>
    );
  }

  if (error || !downloadsData || !downloadsData.downloads || downloadsData.downloads.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-3 h-40 flex items-center justify-center">
        <div className="text-gray-400 text-sm">
          {error || `No download data available for ${packageName}`}
        </div>
      </div>
    );
  }

  // Prepare data for Chart.js
  const labels = downloadsData.downloads.map(day => {
    const date = new Date(day.day);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const downloads = downloadsData.downloads.map(day => day.downloads);

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: `Downloads for ${packageName}`,
        data: downloads,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const date = new Date(downloadsData.downloads[index].day);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
          },
          label: (context) => {
            return `Downloads: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
          font: {
            size: 8
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        ticks: {
          font: {
            size: 8
          },
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'k';
            }
            return value;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-md p-3">
      <h3 className="text-xs font-medium text-gray-700 mb-2">Downloads (Last 30 Days)</h3>
      <div className="h-40">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
