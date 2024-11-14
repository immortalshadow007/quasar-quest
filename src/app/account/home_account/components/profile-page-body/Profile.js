"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaShoppingBag, FaUserCog, FaBox, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../../../../../store/slices/authSlices';
import styles from './Profile.module.css';

// Image imports
import ProfileImage from './comp_images/profile-image.webp';

// Import dynamic content components
import ProfileInformation from '../account_sections/ProfileInformation/ProfileInformation';

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [activePage, setActivePage] = useState('');
  const [activeButton, setActiveButton] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        dispatch(logoutAction());

        const channel = new BroadcastChannel('auth');
        channel.postMessage('logout');
        channel.close();

        router.push('/');
      } else {
        console.error('Logout failed:', data);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderDynamicContent = () => {
    switch (activeButton) {
      case 'manageAddresses':
        return <ManageAddresses />;
      default:
        return <ProfileInformation />;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        {/* Profile Header Section */}
        <div className={styles.profileHeader}>
          <Image
            src={ProfileImage}
            alt="Profile"
            className={styles.avatar}
            width={50}
            height={50}
          />
          <div className={styles.userInfo}>
            <div className={styles.hello}>Hello,</div>
            <div className={styles.userName}>Kartik A</div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className={styles.navSection}>
          {/* My Orders */}
          <div className={styles.navGroup}>
            <a href="/account/orders" className={styles.navLink}>
              <div className={styles.navItem}>
                <FaShoppingBag className={styles.navIcon} />
                <span className={styles.navLabel1}>MY ORDERS</span>
                <span className={styles.arrowIcon}>
                  <svg width="16" height="16" viewBox="0 0 16 27" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z" fill="#878787"></path>
                  </svg>
                </span>
              </div>
            </a>
          </div>

          {/* Account Settings */}
          <div className={styles.navGroup}>
            <div className={styles.navItem}>
              <FaUserCog className={styles.navIcon} />
              <span className={styles.navLabel}>ACCOUNT SETTINGS</span>
            </div>
            <div className={styles.subNav}>
              <button
                className={`${styles.subNavItem} ${activeButton === 'profileInformation' ? styles.activeButton : ''}`}
                onClick={() => setActiveButton('profileInformation')}
              >
                Profile Information
              </button>
              <a className={styles.subNavItem}>Manage Addresses</a>
            </div>
          </div>

          {/* My Stuff Section */}
          <div className={styles.navGroup}>
            <div className={styles.navItem}>
              <FaBox className={styles.navIcon} />
              <span className={styles.navLabel}>MY STUFF</span>
            </div>
            <div className={styles.subNav}>
              <a href="/account/reviews" className={styles.subNavItem}>My Reviews & Ratings</a>
              <a href="/wishlist" className={styles.subNavItem}>My Wishlist</a>
            </div>
          </div>

          {/* Logout Section */}
          <div className={styles.logoutContainer}>
            <div className={styles.logout} onClick={handleLogout}>
              <FaSignOutAlt className={styles.navIcon} />
              <span className={styles.logoutText}>Logout</span>
            </div>
          </div>

          {/* Dynamic render prop container */}
          <div className={styles.dynamicPageContainer}>
            {renderDynamicContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
