'use client'
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './search.module.css';
import { MdSearch } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface SearchProps {
  placeholder: string;
}

const Search: React.FC<SearchProps> = ({ placeholder }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value.length > 2) {
      params.set("q", e.target.value);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params}`);
  };

  return (
    <div className={`${styles.searchContainer} ${styles.topbarSearch}`}>
      <MdSearch />
      <input
        id="searchInput"
        type="text"
        name="search"
        placeholder={placeholder}
        className={styles.searchInput}
        onChange={handleSearch}
        aria-label="Search"
      />
    </div>
  );
};

export default Search;
