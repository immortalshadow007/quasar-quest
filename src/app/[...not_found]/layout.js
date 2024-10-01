// src/app/not-found/not-found.js
import styles from './not-found.module.css';
import Header from './not-found-header';

export default function NotFound({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      { children }
    </div>
  );
}
