import React from 'react';
import styles from '../ui/dashboard/layout.module.css';
import TopBar from '../ui/dashboard/topbar/page';
import Footer from '../ui/dashboard/footer/footer';
import Sidebar from '../ui/sidebar/sidebar';

const Layout = ({ children }: any) => {
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.mainContainer}>
        <div className={styles.sidebarContainer}>
          <Sidebar />
        </div>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
