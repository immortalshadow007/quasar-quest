// src/components/Header.js
import Image from 'next/image';
import styles from './not-found.module.css';
import logo from './error-images/logo.webp';

export default function Header() {
  return (
    <header className={styles.header}>
      <Image src={logo} alt="Material Design Logo" width={200} height={50} />
    </header>
  );
}
