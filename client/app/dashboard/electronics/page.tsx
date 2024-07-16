'use client';
import React, { useEffect } from 'react';
import styles from '@/app/ui/dashboard/electronics/electronics.module.css';
import CustomsCard from '@/app/ui/dashboard/card/CustomsCard';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import { fetchProducts } from '@/app/slice/productSlice';
import { fetchImages } from '@/app/slice/imagesSlice';
import { Product } from '@/app/slice/types';

const Electronics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const electronicsItems = useSelector((state: RootState) => state.products.items);
  const images = useSelector((state: RootState) => state.images.items);
  const loading = useSelector((state: RootState) => state.products.status) === 'loading';
  const error = useSelector((state: RootState) => state.products.error);

  useEffect(() => {
    dispatch(fetchProducts('http://localhost:3000/products/category/electronics'));
  }, [dispatch]);

  useEffect(() => {
    if (electronicsItems.length > 0) {
      const electronicsIds = electronicsItems.map((product) => product._id);
      dispatch(fetchImages(electronicsIds));
    }
  }, [electronicsItems, dispatch]);

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.split(' ').length > maxLength) {
      return description.split(' ').slice(0, maxLength).join(' ') + '...';
    } else {
      return description;
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  
  const handleItemClick = (item: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${item._id}`);
  };

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
      </div>

      <div className={styles.grid}>
        {electronicsItems.map((item) => (
          <div key={item._id} onClick={() => handleItemClick(item)}>
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
    </div>
  );
};

export default Electronics;
