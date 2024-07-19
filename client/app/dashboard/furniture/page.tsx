'use client'
import React, { useEffect, useState } from 'react';
import styles from '@/app/ui/dashboard/accessories/accessories.module.css';
import CustomsCard from '@/app/ui/dashboard/card/CustomsCard';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';
import { Product } from '@/app/slice/types';
import { fetchProducts } from '@/app/slice/productSlice';
import { fetchImages } from '@/app/slice/imagesSlice';


const Furniture: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const furnitureItems = useSelector((state:RootState)=>state.products.items);
  const images = useSelector((state:RootState)=>state.images.items);
  const loading = useSelector((state:RootState)=>state.products.status) === 'loading';
  const error = useSelector((state:RootState)=>state.products.error);

  useEffect(()=>{
    dispatch(fetchProducts('http://localhost:3000/products/category/furniture'));
  }, [dispatch]);

  useEffect(() => {
    if (furnitureItems.length > 0) {
      const furnitureItemsIds = furnitureItems.map((product) => product._id);
      dispatch(fetchImages(furnitureItemsIds));
    }
  }, [furnitureItems, dispatch]);


  const handleItemClick = (item: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${item._id}`);
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
        <h3>furniture</h3>
        <p>
          <i>
            Explore our collection of furnitureItems. Discover stylish options designed to<br />
            complement your look and enhance your lifestyle on campus.
          </i>
        </p>
      </div>

      <div className={styles.products}>
        {furnitureItems.map(accessory => (
          <div key={accessory._id} className={styles.productItem} onClick={() => handleItemClick(accessory)}>
            <CustomsCard
              image={images[accessory._id] || ''}
              title={accessory.name}
              altText={accessory.name}
              price={accessory.price.toString()}
              description={truncateDescription(accessory.description, 15)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Furniture;