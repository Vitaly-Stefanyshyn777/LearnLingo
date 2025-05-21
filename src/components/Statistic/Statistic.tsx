import styles from "./Statistic.module.scss";

const Statistic: React.FC = () => {
  return (
    <div className={styles.statisticWrapper}>
      <div className={styles.statisticContainer}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>32,000+</span>
          <span className={styles.statLabel}>Experienced tutors</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>300,000+</span>
          <span className={styles.statLabel}>5-star tutor reviews</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>120+</span>
          <span className={styles.statLabel}>Subjects taught</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>200+</span>
          <span className={styles.statLabel}>Tutor nationalities</span>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
