'use client';
import React from 'react';
import styles from './pagination.module.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  count: number;
}

const Pagination: React.FC<PaginationProps> = ({ count }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);
  let page = parseInt(params.get("page") || "1", 10); 

  const ITEMS_PER_PAGE = 6;

  const hasPrev = page > 1;
  const hasNext = (page * ITEMS_PER_PAGE) < count;

  const handlePageChange = (type: "prev" | "next") => {
    const newPage = type === "prev" ? page - 1 : page + 1;
    params.set("page", newPage.toString());
    replace(`${pathname}?${params}`);
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => handlePageChange("prev")}
        aria-label="Previous page"
      >
        Previous
      </button>
      <button
        className={styles.button}
        disabled={!hasNext}
        onClick={() => handlePageChange("next")}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
