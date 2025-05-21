import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { auth, getFavoriteTeachers } from "../../services/firebase";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import Header from "../../components/Header/Header";
import styles from "./FavoritesPage.module.scss";

import { Teacher } from "../../services/firebase";

const FavoritesPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favoriteTeachers, setFavoriteTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  const fetchFavorites = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      const favorites = await getFavoriteTeachers(user.uid);

      const updatedFavorites: Teacher[] = favorites.map((teacher) => ({
        ...teacher,
        id: teacher.id || crypto.randomUUID(),
        experience: Array.isArray(teacher.experience)
          ? teacher.experience.join(" ")
          : teacher.experience || "No experience provided",
      }));

      setFavoriteTeachers(updatedFavorites);
    } catch (error) {
      console.error("❌ Помилка отримання улюблених викладачів:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleFavoriteUpdate = async (): Promise<void> => {
    await fetchFavorites();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>
        {favoriteTeachers.length > 0 ? (
          favoriteTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              selectedLevel=""
              onFavoriteUpdate={handleFavoriteUpdate}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
