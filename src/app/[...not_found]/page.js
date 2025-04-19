import styles from './not-found.module.css';
import Header from './not-found-header';
import NotFoundContent from './not-found-body';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Header />
      <NotFoundContent />
    </div>
  );
}