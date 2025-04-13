import styles from "./Modal.module.scss";

const Modal = ({ isOpen, onClose, teacher }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>

        <h2 className={styles.teacherTitile}>Book trial lesson</h2>
        <p className={styles.teacherTitileP}>Our experienced tutor will assess your current language level and tailor the lesson to your needs.</p>

        <div className={styles.teacherInfo}>
          <img src={teacher.avatar_url || "https://via.placeholder.com/40"} alt={teacher.name} className={styles.avatar} />
          <div>
            <p className={styles.teacherLabel}>Your teacher</p>
            <strong className={styles.teacherLabelname}>{teacher.name}</strong>
          </div>
        </div>

        <form className={styles.form}>
          <p className={styles.labelForm}>Why do you want to learn {teacher.languages?.join(", ")}?</p>
          <div className={styles.radioGroup}>
            {["Career and business", "Lessons for kids", "Living abroad", "Exams and coursework", "Culture, travel, or hobby"].map((option, index) => (
              <label key={index} className={styles.radioLabel}>
                <input type="radio" name="reason" value={option} />
                {option}
              </label>
            ))}
          </div>

          <input type="text" placeholder="Full Name" className={styles.input} />
          <input type="email" placeholder="Email" className={styles.input} />
          <input type="tel" placeholder="Phone number" className={styles.input} />

          <button type="submit" className={styles.bookButton}>Book</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
