export default function SkeletonLoader({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
            <div className="flex justify-between items-start mb-2">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between mt-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === 'detail') {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex gap-2 mb-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-4 mb-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (type === 'framework') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 animate-pulse">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === 'tag') {
    return (
      <div className="animate-pulse flex flex-wrap gap-2">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
        ))}
      </div>
    );
  }
  
  return null;
}
