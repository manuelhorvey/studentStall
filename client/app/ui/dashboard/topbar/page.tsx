'use client'
import React, { useState } from 'react';
import { MdEmail, MdSearch } from 'react-icons/md';
import styles from './topbar.module.css';
import { Drawer } from '@mui/material';
import { BiMenu } from 'react-icons/bi';
import Sidebar from '../../sidebar/sidebar';
import Link from 'next/link';

const TopBar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.topbar}>
      <h3 className={styles.logo}>
        <BiMenu onClick={toggleDrawer} className={styles.toggle} />
        CampusMarket
      </h3>
      <Drawer
        sx={{ '& .MuiDrawer-paper': { width: 250 } }}
        open={open}
        onClose={toggleDrawer}
      >
        <Sidebar />
      </Drawer>
      {/* <div className={`${styles.searchContainer} ${styles.topbarSearch}`}>
        <MdSearch />
        <input type='text' className={styles.searchInput} placeholder='Search for something...' />
      </div> */}
      <div className={styles.buttons}>
        
        <Link href={"/dashboard/inbox"}>
          <MdEmail size={40} color='white' />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
