'use client'
import React, { useEffect, useState, useCallback } from 'react';
import styles from '@/app/dashboard/accessories/accessories.module.css';
import CustomsCard from '@/app/ui/dashboard/card/CustomsCard';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import { Product } from '@/app/slice/types';
import { fetchProducts } from '@/app/slice/productSlice';
import { fetchImages } from '@/app/slice/imagesSlice';
import Pagination from '@/app/ui/dashboard/pagination/pagination';

const Furniture: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalItems = useSelector((state: RootState) => state.products.totalItems);
  const furnitureItems = useSelector((state: RootState) => state.products.items);
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
    router.replace(`/dashboard/furniture?search=${query}&page=1`);
  }, 1000), [router]);

  // Fetch products based on search query and page number
  useEffect(() => {
    const fetchData = async () => {
      const query = searchQuery ? `search=${searchQuery}&` : '';
      await dispatch(fetchProducts(`http://localhost:3000/products/category/furniture?${query}page=${page}&limit=${itemsPerPage}`));
    };
    fetchData();
  }, [dispatch, searchQuery, page, itemsPerPage]);

  // Fetch images for the products
  useEffect(() => {
    if (furnitureItems.length > 0) {
      const furnitureIds = furnitureItems.map((product) => product._id);
      dispatch(fetchImages(furnitureIds));
    }
  }, [furnitureItems, dispatch]);

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
    router.replace(`/dashboard/furniture?search=${searchQuery}&page=${newPage}`);
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
        <h3>Furniture</h3>
        <p>
          <i>
            Explore our collection of furniture. Discover stylish options designed to<br />
            complement your look and enhance your lifestyle.
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
        {furnitureItems.map(item => (
          <div key={item._id} className={styles.productItem} onClick={() => handleItemClick(item)}>
            <CustomsCard
              image={images[item._id] || ''}
              title={item.name}
              altText={item.name}
              price={item.price.toString()}
              description={truncateDescription(item.description, 15)}
            />
          </div>
        ))}
      </div>
      <Pagination count={totalItems} />
    </div>
  );
};

export default Furniture;
