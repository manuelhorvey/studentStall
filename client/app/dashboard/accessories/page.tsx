'use client';
import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import styles from './accessories.module.css';
import CustomsCard from '@/app/ui/dashboard/card/CustomsCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import { Product } from '@/app/slice/types';
import { fetchProducts } from '@/app/slice/productSlice';
import { fetchImages } from '@/app/slice/imagesSlice';
import Pagination from '@/app/ui/dashboard/pagination/pagination';

const Accessories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalItems = useSelector((state: RootState) => state.products.totalItems);
  const accessoriesItems = useSelector((state: RootState) => state.products.items);
  const images = useSelector((state: RootState) => state.images.items);
  const loading = useSelector((state: RootState) => state.products.status) === 'loading';
  const error = useSelector((state: RootState) => state.products.error);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [inputValue, setInputValue] = useState(searchQuery);

  const page = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = 6;

  // Debounced search handler
  const handleSearch = useCallback(debounce((query: string) => {
    setSearchQuery(query);
    router.replace(`/dashboard/accessories?search=${query}&page=1`);
  }, 1000), [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    handleSearch(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchProducts(`http://localhost:3000/products/category/accessories?search=${searchQuery}&page=${page}&limit=${itemsPerPage}`));
    };
    fetchData();
  }, [dispatch, searchQuery, page, itemsPerPage]);

  useEffect(() => {
    if (accessoriesItems.length > 0) {
      const accessoryIds = accessoriesItems.map(product => product._id);
      dispatch(fetchImages(accessoryIds));
    }
  }, [accessoriesItems, dispatch]);

  const handleItemClick = (item: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${item._id}`);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    const words = description.split(' ');
    return words.length > maxLength ? `${words.slice(0, maxLength).join(' ')}...` : description;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h3>Accessories</h3>
        <p><i>
          Explore our collection of accessories. Discover stylish options designed to<br />
          complement your look and enhance your lifestyle.
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
        {accessoriesItems.length > 0 ? accessoriesItems.map(accessory => (
          <div key={accessory._id} className={styles.productItem} onClick={() => handleItemClick(accessory)}>
            <CustomsCard
              image={images[accessory._id] || ''}
              title={accessory.name}
              altText={accessory.name}
              price={accessory.price.toString()}
              description={truncateDescription(accessory.description, 15)}
            />
          </div>
        )) : <p>No products found</p>}
      </div>
      <Pagination count={totalItems} />
    </div>
  );
};

export default Accessories;
