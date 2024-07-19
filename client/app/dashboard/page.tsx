'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '@/app/ui/dashboard/dashboard.module.css';
import CustomsCard from '../ui/dashboard/card/CustomsCard';
import imageSrc from '@/public/assets/allproducts.webp'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchProducts } from '../slice/productSlice';
import { fetchImages } from '../slice/imagesSlice';
import { Product } from '../slice/types';
import { AppDispatch, RootState } from '../store/store';

const Discover: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const products = useSelector((state: RootState) => state.products.items);
  const images = useSelector((state: RootState) => state.images.items);

  useEffect(() => {
    dispatch(fetchProducts('http://localhost:3000/products/items'));
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const productIds = products.map((product) => product._id);
      dispatch(fetchImages(productIds));
    }
  }, [products, dispatch]);

  const handleCardClick = (product: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${product._id}`);
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
        This is your category description. It’s a great place to tell customers what this category is<br/>about, connect with your audience and draw attention to your products.
        </i></p>
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
    </div>
  );
};

export default Discover;
