export default function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-12 w-3/4 mx-auto bg-accent-dark/50 rounded mb-8"></div>
      <div className="space-y-4 border border-accent-light/25 bg-gradient-to-b from-accent-dark/66 to-accent-dark/33 p-6 rounded-lg">
        <div className="h-4 bg-accent-dark/50 rounded w-full"></div>
        <div className="h-4 bg-accent-dark/50 rounded w-5/6"></div>
        <div className="h-4 bg-accent-dark/50 rounded w-4/6"></div>
        <div className="h-4 bg-accent-dark/50 rounded w-full"></div>
        <div className="h-4 bg-accent-dark/50 rounded w-3/4"></div>
        <div className="h-4 bg-accent-dark/50 rounded w-5/6"></div>
      </div>
    </div>
  );
}
