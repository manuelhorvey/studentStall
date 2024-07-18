'use client'
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { MdDashboard, MdEmail, MdLogout } from 'react-icons/md';
import { FaLaptop } from 'react-icons/fa';
import { GiBookshelf, GiClothes, GiSchoolBag } from 'react-icons/gi';
import { FaListCheck } from 'react-icons/fa6';
import styles from './sidebar.module.css';
import MenuLink from './menulinks/menuLink';
import { RootState } from '@/app/store/store';
import { loginSuccess, logout } from '@/app/slice/authSlice';
import axiosInstance from '@/app/utils/axiosInstance';

const menuItems = [
  {
    title: 'Browse by',
    list: [
      { title: 'All Products', path: '/dashboard', icon: <MdDashboard /> },
      { title: 'Textbooks', path: '/dashboard/textbooks', icon: <GiBookshelf /> },
      { title: 'Electronics', path: '/dashboard/electronics', icon: <FaLaptop /> },
      { title: 'Clothing', path: '/dashboard/clothing', icon: <GiClothes /> },
      { title: 'Accessories', path: '/dashboard/accessories', icon: <GiSchoolBag /> },
    ],
  },
  {
    title: 'User',
    list: [
      { title: 'List A Product', path: '/dashboard/listproducts', icon: <FaListCheck /> },
      { title: 'Inbox', path: '/dashboard/inbox', icon: <MdEmail /> },
    ],
  },
];

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    axiosInstance
      .get('/auth/user')
      .then((response) => {
        dispatch(loginSuccess({ token, user: response.data }));
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [dispatch, router]);

  const signOut = async () => {
    try {
      await axiosInstance.post('/auth/signout');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch(logout());
      router.push('/');
    } catch (error) {
      console.error('Logout Failed', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        {user && ( // Check if user is defined before accessing user properties
          <div className={styles.userDetails}>
            <span className={styles.username}>{user.name}</span>
            <span className={styles.userTitle}>{user.email}</span>
          </div>
        )}
      </div>
      <ul className={styles.menu}>
        {menuItems.map((cat) => (
          <li key={cat.title} className={styles.menuCategory}>
            <span className={styles.catTitle}>{cat.title}</span>
            <ul className={styles.menuList}>
              {cat.list.map((item) => (
                <li key={item.title} className={styles.menuItem}>
                  <MenuLink item={item} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <button className={styles.logout} onClick={signOut}>
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
