import { useState, useRef, useEffect } from "react";
import Filters from "../../components/Filters/Filters";
import TeachersList from "../../components/TeachersList/TeachersList";
import Header from "../../components/Header/Header";
import styles from "./TeachersPage.module.scss";
import { getTeachers, Teacher } from "../../services/firebase";

interface Filters {
  language: string;
  level: string;
  price: string;
}

const TeachersPage = () => {
  const [filters, setFilters] = useState<Filters>({
    language: "French",
    level: "A1 Beginner",
    price: "30$",
  });

  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      try {
        const data = await getTeachers();
        if (data.length > 0) {
          setTeachers(data);
        }
      } catch (error) {
        console.error("❌ Помилка отримання викладачів:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchTeachers();
  }, []);

  const handleFilterChange = (newFilters: Filters): void => {
    setFilters(newFilters);
    setVisibleCount(4);
  };

  const handleLoadMore = (): void => {
    setVisibleCount((prev) => prev + 4);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <Header />
        <Filters onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>Loading...</div>
      ) : (
        <div className={styles.contentContainer}>
          <TeachersList
            filters={filters}
            visibleCount={visibleCount}
            onLoadMore={handleLoadMore}
            teachers={teachers}
          />
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
