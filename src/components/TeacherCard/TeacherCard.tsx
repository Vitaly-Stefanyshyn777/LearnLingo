import { useState, useEffect } from "react";
import { auth, isFavorite, toggleFavorite } from "../../services/firebase";
import TeacherCardHeader from "./TeacherCardHeader/TeacherCardHeader";
import Modal from "../TeacherCard/Modal/Modal";
import styles from "./TeacherCard.module.scss";
import heartIcon from "../../assets/like-heart.svg";
import { Teacher } from "../../services/firebase";
import { User } from "firebase/auth";

interface TeacherCardProps {
  teacher: Teacher;
  selectedLevel: string;
  onFavoriteUpdate?: () => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  selectedLevel,
  onFavoriteUpdate,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkFavorite = async () => {
      if (user && teacher.id) {
        const isFav = await isFavorite(user.uid, teacher.id);
        setFavorite(isFav);
      }
    };

    checkFavorite();
  }, [user, teacher.id]);

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Ця функція доступна тільки для авторизованих користувачів.");
      return;
    }

    await toggleFavorite(user.uid, teacher);
    setFavorite((prev) => !prev);

    if (onFavoriteUpdate) {
      onFavoriteUpdate();
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img
          className={styles.avatar}
          src={teacher.avatar_url || "https://via.placeholder.com/100"}
          alt={teacher.name || "Unknown"}
        />
        <div className={styles.headerContent}>
          <TeacherCardHeader
            name={teacher.name || "Unknown"}
            surname={teacher.surname || ""}
            languages={teacher.languages || []}
            lessonsDone={teacher.lessons_done ?? 0}
            rating={teacher.rating || "N/A"}
            pricePerHour={teacher.price_per_hour || "N/A"}
          />
        </div>
        <button className={styles.favoriteBtn} onClick={handleFavoriteClick}>
          <img
            src={heartIcon}
            alt="Like Heart"
            className={`${styles.heartIcon} ${favorite ? styles.filled : ""}`}
          />
        </button>
      </div>

      <div className={styles.details}>
        <p>
          Speaks:{" "}
          <strong className={styles.underlinedText}>
            {Array.isArray(teacher.languages)
              ? teacher.languages.join(", ")
              : "Unknown"}
          </strong>
        </p>
        <p>
          Lesson Info:{" "}
          <strong className={styles.underlinedTextet}>
            {teacher.lesson_info || "No info available"}
          </strong>
        </p>
        <p>
          Conditions:{" "}
          <strong className={styles.underlinedTextet}>
            {Array.isArray(teacher.conditions)
              ? teacher.conditions.join(" ")
              : "No conditions provided"}
          </strong>
        </p>
        <button
          className={styles.readMore}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "" : "Read more"}
        </button>

        {expanded && (
          <div className={styles.extraDetails}>
            <p className={styles.extraDetailsis}>
              {teacher.experience
                ? Array.isArray(teacher.experience)
                  ? teacher.experience.join(" ")
                  : teacher.experience
                : "No experience provided"}
            </p>

            <div className={styles.reviews}>
              {teacher.reviews && teacher.reviews.length > 0 ? (
                teacher.reviews.map((review, index) => (
                  <div key={index} className={styles.review}>
                    <p className={styles.reviewName}>
                      <strong>{review.reviewer_name}</strong>
                    </p>
                    <p className={styles.reviewRating}>
                      ⭐ {review.reviewer_rating}
                    </p>
                    <p className={styles.reviewText}>
                      <strong>{review.comment}</strong>
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews available</p>
              )}
            </div>
          </div>
        )}

        <div className={styles.levels}>
          {Array.isArray(teacher.levels) && teacher.levels.length > 0 ? (
            teacher.levels.map((level, index) => (
              <span
                key={index}
                className={`${styles.level} ${
                  selectedLevel === level ? styles.selectedLevel : ""
                }`}
              >
                {`#${level}`}
              </span>
            ))
          ) : (
            <p>No levels available</p>
          )}
        </div>

        {expanded && (
          <button className={styles.bookButton} onClick={openModal}>
            Book trial lesson
          </button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} teacher={teacher} />
    </div>
  );
};

export default TeacherCard;
