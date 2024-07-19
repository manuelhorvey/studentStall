'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/app/ui/dashboard/uploadproducts/products.module.css';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantityAvailable?: number;
  negotiable: boolean;
  category: {
    _id: string;
    name: string;
  };
}

interface DecodedToken {
  userId: string;
}

const Products: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://localhost:3000/user/products`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            userId: userId
          },
          withCredentials: true
        });

        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, []);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`http://localhost:3000/user/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.headertext}>Your Listing</h3>
        <Link href={'/dashboard/uploadproducts/add'}>
          <button className={styles.button}>New Product</button>
        </Link>
      </div>
      <div className={styles.content}>
        {products.length === 0 ? (
          <p>No products listed.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.cardContent}>
                <h4>{product.name}</h4>
                <p>{truncateText(product.description, 15)}</p>
                <p>Price: {product.price}</p>
                {/* Other product details */}
              </div>
              <div className={styles.buttonContainer}>
                <Link href={`/dashboard/uploadproducts/edititem?id=${product._id}`}>
                  <button className={styles.editButton}>Edit</button>
                </Link>
                <button className={styles.deleteButton} onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;