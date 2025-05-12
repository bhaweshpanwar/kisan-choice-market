// src/components/ui/pagination.tsx (Example simple pagination)
import React from 'react';
import { Button } from './button'; // Assuming you use shadcn Button

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  // Logic to determine which page numbers to show (e.g., first, last, current, and some neighbors)
  // This is a simple version showing all pages if not too many, or with ellipses
  const MAX_VISIBLE_PAGES = 5;

  if (totalPages <= MAX_VISIBLE_PAGES + 2) {
    // Show all if few pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1); // Always show first page
    let startPage = Math.max(
      2,
      currentPage - Math.floor((MAX_VISIBLE_PAGES - 2) / 2)
    );
    let endPage = Math.min(
      totalPages - 1,
      currentPage + Math.ceil((MAX_VISIBLE_PAGES - 2) / 2) - 1
    );

    if (currentPage <= Math.ceil(MAX_VISIBLE_PAGES / 2)) {
      endPage = MAX_VISIBLE_PAGES - 1;
    } else if (currentPage > totalPages - Math.floor(MAX_VISIBLE_PAGES / 2)) {
      startPage = totalPages - MAX_VISIBLE_PAGES + 2;
    }

    if (startPage > 2) {
      pageNumbers.push(-1); // Ellipsis placeholder
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(-1); // Ellipsis placeholder
    }
    pageNumbers.push(totalPages); // Always show last page
  }

  return (
    <nav className='flex items-center space-x-1'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <span key={`ellipsis-${index}`} className='px-2 py-1 text-sm'>
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size='sm'
            onClick={() => onPageChange(page)}
            className={`${
              page === currentPage ? 'bg-kisan-primary text-white' : ''
            }`}
          >
            {page}
          </Button>
        )
      )}
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </nav>
  );
};
