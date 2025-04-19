// src/components/NotFoundContent.js
import Link from 'next/link';
import Image from 'next/image';
import styles from './not-found.module.css';
import err404 from './error-images/error-404.webp';

export default function NotFoundContent() {
  return (
    <div className={styles.content}>
      <Image src={err404} alt="404 Error" width={500} height={400} className={styles.errorImage} />
      <p className={styles.message}>Unfortunately the page you are looking for has been moved or deleted</p>
      <Link href="/" className={styles.homeButton}>
        RETURN TO HOMEPAGE
      </Link>
    </div>
  );
}
