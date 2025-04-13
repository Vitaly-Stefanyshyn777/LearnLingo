import { useState, useEffect, useMemo, useRef } from "react";
import styles from "./TeachersList.module.scss";
import TeacherCard from "../TeacherCard/TeacherCard";
import { getTeachers } from "../../services/firebase";

const TeachersList = ({ filters, visibleCount, onLoadMore }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("❌ Помилка отримання викладачів:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      if (!teacher) return false;

      const maxPrice = parseInt(filters.price, 10) || Infinity;
      const matchesPrice = teacher.price_per_hour <= maxPrice;
      const matchesLevel = filters.level ? teacher.levels?.includes(filters.level) : true;
      const matchesLanguage = filters.language ? teacher.languages?.includes(filters.language) : true;

      return matchesPrice && matchesLevel && matchesLanguage;
    });
  }, [teachers, filters]);

  const handleLoadMore = () => {
    onLoadMore();
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      {!loading && filteredTeachers.slice(0, visibleCount).map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} selectedLevel={filters.level} />
      ))}

      {!loading && visibleCount < filteredTeachers.length && (
        <button className={styles.loadMore} onClick={handleLoadMore}>
          Load More
        </button>
      )}

      <div ref={bottomRef} style={{ width: "100%", height: "1px" }} />
    </div>
  );
};

export default TeachersList;
