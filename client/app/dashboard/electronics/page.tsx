'use client';
import React, { useEffect, useState, useCallback } from 'react';
import styles from './electronics.module.css';
import CustomsCard from '@/app/ui/dashboard/card/CustomsCard';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import { Product } from '@/app/slice/types';
import { fetchProducts } from '@/app/slice/productSlice';
import { fetchImages } from '@/app/slice/imagesSlice';
import Pagination from '@/app/ui/dashboard/pagination/pagination';

const Electronics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalItems = useSelector((state: RootState) => state.products.totalItems);
  const electronicsItems = useSelector((state: RootState) => state.products.items);
  const images = useSelector((state: RootState) => state.images.items);
  const loading = useSelector((state: RootState) => state.products.status) === 'loading';
  const error = useSelector((state: RootState) => state.products.error);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [inputValue, setInputValue] = useState(searchQuery);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 8;

  // Debounced search handler
  const handleSearch = useCallback(debounce((query: string) => {
    setSearchQuery(query);
    router.replace(`/dashboard/electronics?search=${query}&page=1`);
  }, 1000), [router]);

  // Fetch products based on search query and page number
  useEffect(() => {
    const fetchData = async () => {
      const query = searchQuery ? `search=${searchQuery}&` : '';
      await dispatch(fetchProducts(`http://localhost:3000/products/category/electronics?${query}page=${page}&limit=${itemsPerPage}`));
    };
    fetchData();
  }, [dispatch, searchQuery, page, itemsPerPage]);

  // Fetch images for the products
  useEffect(() => {
    if (electronicsItems.length > 0) {
      const electronicsIds = electronicsItems.map((product) => product._id);
      dispatch(fetchImages(electronicsIds));
    }
  }, [electronicsItems, dispatch]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    handleSearch(newValue);
  };

  // Handle item click
  const handleItemClick = (item: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${item._id}`);
  };

  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    router.replace(`/dashboard/electronics?search=${searchQuery}&page=${newPage}`);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.split(' ').length > maxLength) {
      return description.split(' ').slice(0, maxLength).join(' ') + '...';
    } else {
      return description;
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h3>Electronics</h3>
        <p>
          <i>
            Discover our range of electronics. Explore innovative gadgets and<br />
            devices designed to enhance your everyday life and beyond.
          </i>
        </p>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={inputValue} 
          onChange={handleInputChange} 
          className={styles.searchBar} 
        />
      </div>

      <div className={styles.products}>
        {electronicsItems.map((item) => (
          <div key={item._id} className={styles.productItem} onClick={() => handleItemClick(item)}>
            <CustomsCard
              image={images[item._id] || ''}
              title={item.name}
              altText={item.name}
              price={item.price.toString()}
              description={truncateDescription(item.description, 20)}
            />
          </div>
        ))}
      </div>

      <Pagination count={totalItems} />
    </div>
  );
};

export default Electronics;
