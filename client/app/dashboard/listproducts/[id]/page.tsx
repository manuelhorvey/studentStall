'use client'
import React, { useEffect, useState } from 'react';
import styles from '@/app/ui/dashboard/listproducts/editItem/edititem.module.css';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

interface DecodedToken {
  userId: string;
}

const EditItem = () => {
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    negotiable: false
  });

  const params = useSearchParams();
  const productId = params.get('id');

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://localhost:3000/user/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            userId: userId
          },
          withCredentials: true
        });

        const fetchedProduct = response.data;
        setProduct(fetchedProduct);
        setFormData({
          name: fetchedProduct.name,
          description: fetchedProduct.description,
          price: fetchedProduct.price,
          category: fetchedProduct.category._id,
          negotiable: fetchedProduct.negotiable
        });
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories/getall');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    if (productId) {
      fetchSingleProduct();
      fetchCategories();
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken = jwtDecode<DecodedToken>(token);
    const userId = decodedToken.userId;

    try {
      const response = await axios.put(`http://localhost:3000/user/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          userId: userId
        },
        withCredentials: true
      });

      setProduct(response.data);
      router.push('/dashboard/listproducts')
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Edit Product</h3>
      <form className={styles.form} onSubmit={handleUpdateProduct}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            className={styles.input}
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>Price:</label>
          <input
            type="text"
            id="price"
            name="price"
            className={styles.input}
            value={formData.price}
            onChange={handleInputChange}
            required
            pattern="^\d*(\.\d{0,2})?$" // Regex pattern for validating decimal numbers
            title="Enter a valid price (e.g., 55.99)"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="categoryName" className={styles.label}>Category Name:</label>
          <select
            id="categoryName"
            name="category"
            className={styles.select}
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <input
            type="checkbox"
            id="negotiable"
            name="negotiable"
            className={styles.checkbox}
            checked={formData.negotiable}
            onChange={handleInputChange}
          />
          <label htmlFor="negotiable" className={styles.checkboxLabel}>Negotiable</label>
        </div>
        <button type="submit" className={styles.button}>Update Product</button>
      </form>
    </div>
  );
};

export default EditItem;
