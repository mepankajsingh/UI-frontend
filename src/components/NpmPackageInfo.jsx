import { useState, useEffect } from 'react';
import { getNpmPackageDetails } from '../lib/npmStats';

export default function NpmPackageInfo({ packageName }) {
  const [packageDetails, setPackageDetails] = useState(null);
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
        
        const data = await getNpmPackageDetails(packageName);
        
        if (isMounted && data) {
          setPackageDetails(data);
          setLoading(false);
          setError(null);
        } else if (isMounted) {
          setError(`No data available for ${packageName}`);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error fetching package details for ${packageName}:`, err);
        if (isMounted) {
          setError(`Failed to load package details: ${err.message}`);
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
      <div className="bg-gray-50 rounded-md p-3 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">Loading package info...</div>
      </div>
    );
  }

  if (error || !packageDetails) {
    return (
      <div className="bg-gray-50 rounded-md p-3 flex items-center justify-center">
        <div className="text-gray-400 text-sm">
          {error || `No package information available for ${packageName}`}
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-md p-3">
      <h3 className="text-base font-medium text-gray-700 mb-2">Package Information</h3>
      
      <div className="space-y-2">
        {packageDetails.version && (
          <div className="flex">
            <span className="w-32 font-medium text-gray-500 text-sm">Latest Version:</span>
            <span className="text-gray-700 text-sm">{packageDetails.version}</span>
          </div>
        )}
        
        {packageDetails.lastUpdate && (
          <div className="flex">
            <span className="w-32 font-medium text-gray-500 text-sm">Last Updated:</span>
            <span className="text-gray-700 text-sm">{formatDate(packageDetails.lastUpdate)}</span>
          </div>
        )}
        
        {packageDetails.license && (
          <div className="flex">
            <span className="w-32 font-medium text-gray-500 text-sm">License:</span>
            <span className="text-gray-700 text-sm">{packageDetails.license}</span>
          </div>
        )}
        
        {packageDetails.installCommand && (
          <div className="mt-3">
            <span className="font-medium text-gray-500 text-sm block mb-1">Installation:</span>
            <div className="bg-gray-50 rounded-md p-2 font-mono text-sm overflow-x-auto">
              {packageDetails.installCommand}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
