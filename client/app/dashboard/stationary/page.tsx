'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './textbook.module.css';
import debounce from 'lodash.debounce';
import CustomsCard from '@/app/ui/dashboard/card/CustomsCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchProducts } from '@/app/slice/productSlice';
import { fetchImages } from '@/app/slice/imagesSlice';
import { AppDispatch, RootState } from '@/app/store/store';
import { Product } from '@/app/slice/types';
import Pagination from '@/app/ui/dashboard/pagination/pagination';

const Textbooks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const textbooks = useSelector((state: RootState) => state.products.items);
  const totalItems = useSelector((state: RootState) => state.products.totalItems);
  const images = useSelector((state: RootState) => state.images.items);
  const loading = useSelector((state: RootState) => state.products.status) === 'loading';
  const error = useSelector((state: RootState) => state.products.error);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [inputValue, setInputValue] = useState(searchQuery);

  const page = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = 6;

  // Fetch products when searchQuery or page changes
  useEffect(() => {
    const fetchData = async () => {
      const query = searchQuery ? `search=${searchQuery}&` : '';
      await dispatch(fetchProducts(`http://localhost:3000/products/category/stationary?${query}page=${page}&limit=${itemsPerPage}`));
    };
    fetchData();
  }, [dispatch, searchQuery, page, itemsPerPage]);

  // Fetch images when textbooks data changes
  useEffect(() => {
    if (textbooks.length > 0) {
      const textbookIds = textbooks.map((product) => product._id);
      dispatch(fetchImages(textbookIds));
    }
  }, [textbooks, dispatch]);

  const handleItemClick = (product: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${product._id}`);
  };

  const handleSearch = useCallback(debounce((query: string) => {
    setSearchQuery(query);
    router.replace(`/dashboard/stationary?search=${query}&page=1`);
  }, 1000), [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    handleSearch(newValue);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h3>Stationaries</h3>
        <p><i>
          Browse our collection of Stationaries. Find essential resources<br />
          to support your learning journey and achieve academic success.
        </i></p>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={inputValue} 
          onChange={handleInputChange} 
          className={styles.searchBar} 
        />
      </div>

      <div className={styles.products}>
        {textbooks.map((product) => (
          <div key={product._id} className={styles.productItem} onClick={() => handleItemClick(product)}>
            <CustomsCard
              image={images[product._id] || ''}
              title={product.name}
              altText={product.name}
              price={product.price.toString()}
              description={product.description}
            />
          </div>
        ))}
      </div>
      <Pagination count={totalItems} />
    </div>
  );
};

export default Textbooks;
