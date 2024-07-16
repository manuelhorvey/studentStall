'use client';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '@/app/ui/dashboard/textbook/textbook.module.css';
import CustomsCard from '@/app/ui/dashboard/card/CustomsCard';
import { useRouter } from 'next/navigation';
import { fetchProducts } from '@/app/slice/productSlice';
import { fetchImages } from '@/app/slice/imagesSlice';
import { AppDispatch, RootState } from '@/app/store/store';
import { Product } from '@/app/slice/types';


const Textbooks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const textbooks = useSelector((state: RootState) => state.products.items);
  const images = useSelector((state: RootState) => state.images.items);
  const loading = useSelector((state: RootState) => state.products.status) === 'loading';
  const error = useSelector((state: RootState) => state.products.error);

  useEffect(() => {
    dispatch(fetchProducts('http://localhost:3000/products/category/books'));
  }, [dispatch]);

  useEffect(() => {
    if (textbooks.length > 0) {
      const textbookIds = textbooks.map((product) => product._id);
      dispatch(fetchImages(textbookIds));
    }
  }, [textbooks, dispatch]);

  const handleItemClick = (product: Product) => {
    router.push(`/dashboard/productdetails/product?productid=${product._id}`);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h3>Textbooks</h3>
        <p>
          <i>
            Browse our collection of textbooks. Find essential resources<br />
            to support your learning journey and achieve academic success.
          </i>
        </p>
      </div>

      <div className={styles.grid}>
        {textbooks.map((product) => (
          <div key={product._id} onClick={() => handleItemClick(product)}>
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
    </div>
  );
};

export default Textbooks;
