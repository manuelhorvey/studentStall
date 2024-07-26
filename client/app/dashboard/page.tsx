'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '@/app/ui/dashboard/dashboard.module.css';
import CustomsCard from '../ui/dashboard/card/CustomsCard';
import { fetchProducts } from '../slice/productSlice';
import { fetchImages } from '../slice/imagesSlice';
import { Product } from '../slice/types';
import { AppDispatch, RootState } from '../store/store';
import Pagination from '../ui/dashboard/pagination/pagination';
import { useRouter, useSearchParams } from 'next/navigation';

const Discover: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const products = useSelector((state: RootState) => state.products.items);
  const totalItems = useSelector((state: RootState) => state.products.totalItems);
  const images = useSelector((state: RootState) => state.images.items);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 6; 

  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchProducts(`http://localhost:3000/products/items?search=${searchQuery}&page=${page}&limit=${itemsPerPage}`));
    };
    fetchData();
  }, [dispatch, searchQuery, page, itemsPerPage]);

  useEffect(() => {
    if (products.length > 0) {
      const productIds = products.map((product) => product._id);
      dispatch(fetchImages(productIds));
    }
  }, [products, dispatch]);

  const handleCardClick = (product: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${product._id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    router.replace(`/dashboard?search=${e.target.value}&page=1`);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.split(' ').length > maxLength) {
      return description.split(' ').slice(0, maxLength).join(' ') + '...';
    } else {
      return description;
    }
  };

  return (
    <div className={styles.discoverContainer}>
      <div className={styles.textContainer}>
        <h3>All Products</h3>
        <p><i>
          This is your category description. It’s a great place to tell customers what this category is
          <br />
          about, connect with your audience and draw attention to your products.
        </i></p>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
          className={styles.searchBar} 
        />
      </div>
      <div className={styles.products}>
        {products.map((product) => (
          <div key={product._id} className={styles.productItem} onClick={() => handleCardClick(product)}>
            <CustomsCard
              image={images[product._id] || ''}
              title={product.name}
              altText={product.name}
              price={`GHS ${product.price}`}
              description={truncateDescription(product.description, 20)}
            />
          </div>
        ))}
      </div>
      <Pagination count={totalItems} />
    </div>
  );
};

export default Discover;
