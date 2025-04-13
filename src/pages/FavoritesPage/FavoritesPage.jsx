import { useState, useEffect, useCallback } from "react";
import { auth, getFavoriteTeachers } from "../../services/firebase";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import Header from "../../components/Header/Header";
import styles from "./FavoritesPage.module.scss";

const FavoritesPage = () => {
  const [user, setUser] = useState(null);
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    
    try {
      const favorites = await getFavoriteTeachers(user.uid);

      const updatedFavorites = favorites.map((teacher) => ({
        ...teacher,
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

  
  const handleFavoriteUpdate = async () => {
    await fetchFavorites();
  };

  return (
    <div className={styles.page}>
      <Header className={styles.header} /> 
      <div className={styles.content}>
        {favoriteTeachers.length > 0 ? (
          favoriteTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
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
