import React from 'react';
import { CgCommunity, CgShoppingCart } from 'react-icons/cg';
import styles from './ladingpage.module.css';
import Image from 'next/image';
import { GrSecure } from 'react-icons/gr';
import { FaLeaf } from 'react-icons/fa';
import { HiArrowNarrowRight } from 'react-icons/hi';
import Link from 'next/link';
import { IoLocateOutline, IoTimerOutline } from 'react-icons/io5';
import { MdPhone } from 'react-icons/md';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <h2 className={styles.Logo}>CampusMarket</h2>
        <div className={styles.groupList}>
          <Link href={'/'}>
            <p>Home</p>
          </Link>
          <Link href={'/dashboard/listproducts'}>
            <p>sell Items</p>
          </Link>
        </div>
      </div> 
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.welcome}>
            <h1>Welcome to CampusMarket</h1>
            <p className={styles.users}>
              100+
              <i>Active sellers</i>
            </p>
            <Link href={'/signin'}>
              <button className={styles.button}>Start Shopping</button>
            </Link>
            <p>Discover great deals and unique items within your campus community.</p>
          </div>
          <div className={styles.sideImage}>
            <div className={styles.imageContainer}>
              <Image
                src="/assets/knust_entrance.jpg"
                alt="Our Campus Community"
                width={400}
                height={300}
              />
              <div className={styles.imageText}>
                <p className={styles.overlayText}>Join a vibrant marketplace where students connect to buy and sell items easily.</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.exclusiveDeals}>
          <h4>Exclusive deals</h4>
          <h2>Why Choose CampusMarket?</h2>
          <p>Unlock special offers and find unique items from fellow students.</p>
          <div className={styles.exclusiveDealsContent}>
            <div>
              <CgShoppingCart className={styles.icon} />
              <div className="text">
                <h3>Convenient</h3>
                <p>Easily buy and sell within your campus.</p>
              </div>
              <GrSecure className={styles.icon} />
              <div className="text">
                <h3>Secure</h3>
                <p>Safe transactions with trusted peers.</p>
              </div>
            </div>

            <div>
              <CgCommunity className={styles.icon} />
              <div className="text">
                <h3>Community-Driven</h3>
                <p>Support your campus community.</p>
              </div>
              <FaLeaf className={styles.icon} />
              <div className="text">
                <h3>Eco-Friendly</h3>
                <p>Promote sustainability by reusing items.</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.catHeader}>
          <h3>Explore Categories</h3>
          <a href='/dashboard'>VIEW ALL CATEGORIES <HiArrowNarrowRight /></a>
        </div>
        <div className={styles.explorcategories}>
          <div className={styles.image}>
            <Image
              src="/assets/books.jpg"
              alt="Our Campus Community"
              width={300}
              height={200}
            />
            <h3>Books</h3>
            <p>Find textbooks and novels.</p>
          </div>
          <div className={styles.image}>
            <Image
              src="/assets/electronics.jpg"
              alt="Our Campus Community"
              width={300}
              height={200}
            />
            <h3>Electronics</h3>
            <p>Get the latest gadgets.</p>
          </div>

          <div className={styles.image} >
            <Image
              src="/assets/clothing.jpg"
              alt="Our Campus Community"
              width={300}
              height={200}
            />
            <h3>Clothing</h3>
            <p>Shop for trendy outfits.</p>
          </div>

          <div className={styles.image}>
            <Image
              src="/assets/furniture.jpg"
              alt="Our Campus Community"
              width={300}
              height={200}
            />
            <h3>Furniture</h3>
            <p>Discover hostel essentials.</p>
          </div>
        </div>
        <div className={styles.help}>
          <div className={styles.helpheader}>
            <h2>Need Help?</h2>
            <p>Our support team is here to assist you with any questions.</p>
          </div>
          <div className={styles.helpIcons} >
            <IoTimerOutline className={styles.icon} />
            <div className="text">
              <h3>Office Hours</h3>
              <p>Monday-Friday 8:00 am to 5:00 pm</p>
            </div>

            <IoLocateOutline className={styles.icon} />
            <div className="text">
              <h3>Our Address</h3>
              <p>College of Science, KNUST,MCFM+F94, Kumasi</p>
            </div>

            <MdPhone className={styles.icon} />
            <div className="text">
              <h3>Contact Us</h3>
              <p>+233 2449 00681</p>
            </div>
          </div>
          <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h3>About Us</h3>
            <p>Learn more about StudentStall and our mission.</p>
          </div>
          <div className={styles.footerColumn}>
            <h3>Privacy Policy</h3>
            <p>Understand how we protect your data.</p>
          </div>
          <div className={styles.footerColumn}>
            <h3>Terms of Service</h3>
            <p>Read the legal terms you agree to by using our platform.</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 StudentStall. All rights reserved.</p>
        </div>
      </footer>
        </div>
      </div>
    </div>
  );
}

export default Home;
