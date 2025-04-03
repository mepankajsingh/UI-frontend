import { useState, useEffect } from 'react';

export default function Pagination({ totalItems, itemsPerPage = 20, currentPage = 1, onPageChange }) {
  const [page, setPage] = useState(currentPage);
  const [total, setTotal] = useState(totalItems);
  const totalPages = Math.ceil(total / itemsPerPage);
  
  // Reset to page 1 if totalItems or itemsPerPage changes
  useEffect(() => {
    setTotal(totalItems);
    // Don't reset page when component mounts with a specific currentPage
    if (currentPage === 1) {
      setPage(1);
      if (onPageChange) onPageChange(1);
    }
  }, [totalItems, itemsPerPage]);
  
  // Update when currentPage prop changes
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);
  
  // Update parent when page changes
  useEffect(() => {
    if (onPageChange) onPageChange(page);
  }, [page, onPageChange]);
  
  // Listen for updatePagination events
  useEffect(() => {
    const handleUpdatePagination = (e) => {
      if (e.detail) {
        if (e.detail.totalItems !== undefined) {
          setTotal(e.detail.totalItems);
        }
        if (e.detail.currentPage !== undefined) {
          setPage(e.detail.currentPage);
        }
      }
    };
    
    document.addEventListener('updatePagination', handleUpdatePagination);
    
    return () => {
      document.removeEventListener('updatePagination', handleUpdatePagination);
    };
  }, []);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Dispatch custom event for page change
      const event = new CustomEvent('pageChange', {
        detail: { page: newPage },
        bubbles: true
      });
      document.dispatchEvent(event);
      
      // Update URL with page parameter
      const url = new URL(window.location);
      url.searchParams.set('page', newPage);
      window.history.pushState({}, '', url);
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range of pages to show around current page
    let startPage = Math.max(2, page - 1);
    let endPage = Math.min(totalPages - 1, page + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center items-center space-x-1 my-8">
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          page === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((pageNum, index) => (
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
        ) : (
          <button
            key={`page-${pageNum}`}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              page === pageNum
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        )
      ))}
      
      {/* Next button */}
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          page === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
