'use client'
import React, { useState } from 'react';
import styles from '@/app/ui/dashboard/uploadproducts/add/listproducts.module.css';
import { MdCameraAlt } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  negotiable: boolean;
  user: string;
  images: string[];
}

interface DecodedToken {
  userId: string;
}

const ListProducts: React.FC = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    negotiable: false,
    user: '',
    images: [],
  });


  const token = localStorage.getItem('token');
  let userId: string | null = '';

  if (token) {
    const decodedToken = jwtDecode<DecodedToken>(token);
    userId = decodedToken.userId;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? isChecked : value,
    });
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files);
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          setImages(prevState => [...prevState, imageUrl]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const capitalizeFirstLetterOfEachWord = (text: string): string => {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, description, price, category, negotiable } = productData;

    if (!userId) {
      alert('User not authenticated');
      return;
    }

    const formattedName = capitalizeFirstLetterOfEachWord(name);
    const formattedDescription = capitalizeFirstLetterOfEachWord(description);

    try {
      const formData = {
        name: formattedName,
        description: formattedDescription,
        price,
        category,
        negotiable,
        user: userId,
        images,
      };

      const response = await fetch('http://localhost:3000/products/additem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Product added successfully');
        router.push('/dashboard/uploadproducts');
      } else {
        const errorMessage = await response.text();
        console.error('Failed to add product:', errorMessage);
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };


  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Upload A Product</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.addPhotos}>
          <label htmlFor="photos" className={styles.photoLabel}>
            <MdCameraAlt className={styles.cameraIcon} />
            Add Photos
            <input
              type="file"
              id="photos"
              className={styles.fileInput}
              onChange={handleImageChange}
              multiple
              required
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            value={productData.name}
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
            value={productData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            className={styles.input}
            value={productData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>Category Name:</label>
          <select
            id="categoryName"
            name="category"
            className={styles.input}
            value={productData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="stationary">Stationary</option>
            <option value="accessories">Accessories</option>
            <option value="furniture">Furniture</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <input
            type="checkbox"
            id="negotiable"
            name="negotiable"
            className={styles.checkbox}
            checked={productData.negotiable}
            onChange={handleInputChange}
          />
          <label htmlFor="negotiable" className={styles.checkboxLabel}>Negotiable</label>
        </div>
        <button type="submit" className={styles.button}>Add Product</button>
      </form>
    </div>
  );
};

export default ListProducts;
