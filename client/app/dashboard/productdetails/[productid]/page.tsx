'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import {jwtDecode} from 'jwt-decode';
import styles from '@/app/ui/dashboard/productid/productdetail.module.css';
import StartChatButton from '@/app/ui/startChart/startChatButton';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  images: {
    _id: string;
    url: string;
    altText: string;
  }[];
  user: {
    _id: string;
    name: string;
  };
  negotiable: boolean;
}

interface DecodedToken {
  userId: string;
}

const ProductDetails = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const productId = searchParams.get('productid');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Token not found");
        }
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUserId(decodedToken.userId);

        const response = await axios.get<Product>(`http://localhost:3000/products/${productId}`);
        setProduct(response.data);

        const imagesResponse = await axios.get<{ url: string }[]>(`http://localhost:3000/images/${productId}`);
        setImages(imagesResponse.data.map((img) => img.url));
        setLoading(false);
      } catch (error) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>; 
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  if (!product) {
    return <div className={styles.loadingContainer}>Product not found</div>;
  }

  const isChatDisabled = userId === product.user._id;

  return (
    <div className={styles.productDetailsContainer}>
      <div className={styles.imagesContainer}>
        {images.length > 0 ? (
          images.map((url, index) => (
            <Image key={index} src={url} alt={product.name} width={500} height={500} className={styles.image} />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
      <div className={styles.productDetails}>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: GHS {product.price}</p>
        <p>Category: {product.category.name}</p>
        <p>Negotiable: {product.negotiable ? 'Yes' : 'No'}</p>
        <div className={styles.userDetails}>
          <h2>Seller: {product.user.name}</h2>
          <StartChatButton
            userId={userId}
            recipientId={product.user._id}
            disabled={isChatDisabled}
            className={styles.button}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
