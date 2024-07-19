'use client';
import React, { useEffect, useState } from 'react';
import CustomsCard from '@/app/ui/dashboard/card/CustomsCard';
import styles from '@/app/ui/dashboard/textbook/textbook.module.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';
import { Product } from '@/app/slice/types';
import { fetchProducts } from '@/app/slice/productSlice';
import { fetchImages } from '@/app/slice/imagesSlice';


const Clothing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const clothingItems = useSelector((state:RootState)=>state.products.items);
  const images = useSelector((state:RootState)=>state.images.items);
  const loading = useSelector((state:RootState)=>state.products.status) === 'loading';
  const error = useSelector((state:RootState)=>state.products.error)
  
  useEffect(()=>{
    dispatch(fetchProducts('http://localhost:3000/products/category/clothing'))
  },[dispatch]);

  useEffect(()=>{
    if(clothingItems.length>0){
      const clothingItemsIds = clothingItems.map((product)=> product._id);
      dispatch(fetchImages(clothingItemsIds));
    }
  },[clothingItems,dispatch])
  
  const handleItemClick = (item: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${item._id}`);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h3>Clothing</h3>
        <p>
          <i>
            Dive into our clothing collection. Find pieces that define your style,<br />
            from casual essentials to statement pieces that make every day fashionable.
          </i>
        </p>
      </div>

      <div className={styles.products}>
        {clothingItems.map((item) => (
          <div key={item._id} className={styles.productItem} onClick={() => handleItemClick(item)}>
            <CustomsCard
              image={images[item._id] || ''}
              title={item.name}
              altText={item.name}
              price={item.price.toString()}
              description={item.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clothing;
