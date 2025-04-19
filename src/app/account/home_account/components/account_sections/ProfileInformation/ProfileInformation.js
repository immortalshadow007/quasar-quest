// src/app/account/home_account/components/account_sections/ProfileInformation.js

import React, { useState } from 'react';
import styles from './ProfileInformation.module.css';

const ProfileInformation = () => {
  const [firstName] = useState('Kartik');
  const [lastName] = useState('A');
  const [email] = useState('kartikswamy2000@gmail.com');
  const [mobileNumber] = useState('+917676125113');
  const [gender] = useState('Male');

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        {/* Personal Information */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Personal Information</span>
            <span className={styles.editButton}>Edit</span>
          </div>
          <form className={styles.form}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <input type="text" name="firstName" value={firstName} disabled />
              </div>
              <div className={styles.fieldGroup1}>
                <input type="text" name="lastName" value={lastName} disabled />
              </div>
            </div>
            <div className={styles.genderField}>
              <label>Your Gender</label>
              <div className={styles.genderOptions}>
                <label>
                  <input type="radio" name="gender" checked={gender === 'Male'} disabled />
                  Male
                </label>
                <label>
                  <input type="radio" name="gender" checked={gender === 'Female'} disabled />
                  Female
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Email Information */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Email Address</span>
            <span className={styles.editButton1}>Edit</span>
          </div>
          <form className={styles.form}>
            <div className={styles.fieldGroup2}>
              <input type="text" name="email" value={email} disabled />
            </div>
          </form>
        </div>

        {/* Mobile Number */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Mobile Number</span>
            <span className={styles.editButton2}>Edit</span>
          </div>
          <form className={styles.form}>
            <div className={styles.fieldGroup2}>
              <input type="text" name="mobileNumber" value={mobileNumber} disabled />
            </div>
          </form>
        </div>

        {/* FAQs */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>FAQs</div>
          <div className={styles.faq}>
            <h4>What happens when I update my email address (or mobile number)?</h4>
            <p>Your login email id (or mobile number) changes, likewise.</p>

            <h4>When will my ELW account be updated with the new email address (or mobile number)?</h4>
            <p>It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>

            <h4>What happens to my existing ELW account when I update my email address (or mobile number)?</h4>
            <p>Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your order history, saved information, and personal details.</p>
          </div>
        </div>

        {/* Deactivate / Delete Account */}
        <div className={styles.section}>
          <div className={styles.deactivate}>Deactivate Account</div>
          <div className={styles.delete}>Delete Account</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
