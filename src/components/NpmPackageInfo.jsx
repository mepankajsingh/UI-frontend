import { useState, useEffect } from 'react';
import { revalidatePaths } from '../lib/revalidate';

export default function NpmPackageInfo({ packageName, currentPath }) {
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPackageInfo() {
      try {
        setLoading(true);
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch package info: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPackageInfo(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching package info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (packageName) {
      fetchPackageInfo();
    }
  }, [packageName]);

  // Function to trigger revalidation for this page
  const handleRevalidate = async () => {
    if (!currentPath) return;
    
    try {
      const result = await revalidatePaths([currentPath]);
      if (result.success) {
        alert('Page will be revalidated shortly');
      } else {
        console.error('Revalidation failed:', result.error);
      }
    } catch (err) {
      console.error('Error triggering revalidation:', err);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-100 h-32 rounded-md"></div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!packageInfo) {
    return <div>No package information available</div>;
  }

  const latestVersion = packageInfo['dist-tags']?.latest || 'Unknown';
  const license = packageInfo.license || 'Not specified';
  const lastUpdated = packageInfo.time?.modified 
    ? new Date(packageInfo.time.modified).toLocaleDateString() 
    : 'Unknown';

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Package Information
        </h3>
        <button 
          onClick={handleRevalidate}
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
        >
          Refresh Data
        </button>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Package name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{packageName}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Latest version</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{latestVersion}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">License</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{license}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Last updated</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{lastUpdated}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
