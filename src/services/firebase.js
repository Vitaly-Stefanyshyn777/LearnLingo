import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";

// 🔹 Firebase конфігурація
const firebaseConfig = {
  apiKey: "AIzaSyCxPfvb-4sRst0qGBJ10QNX7rl4hDV-kas",
  authDomain: "learnlingo-7da97.firebaseapp.com",
  projectId: "learnlingo-7da97",
  storageBucket: "learnlingo-7da97.appspot.com",
  messagingSenderId: "1047555671913",
  appId: "1:1047555671913:web:8360c4de6914f3ad2a9ff8",
  measurementId: "G-7J1X7KSK58",
  databaseURL: "https://learnlingo-7da97-default-rtdb.firebaseio.com/",
};

// 🔹 Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

/**
 * 🔹 Додає викладачів у базу
 * @param {Array} teachers - Масив об'єктів викладачів
 */
export const addTeachersToDatabase = async (teachers) => {
  const updates = {};
  teachers.forEach((teacher) => {
    const id = teacher.id || crypto.randomUUID();
    updates[`teachers/${id}`] = { ...teacher, id };
  });

  try {
    await update(ref(db), updates);
  } catch (error) {
    // Обробка помилки без виводу в консоль
  }
};

/**
 * 🔹 Отримує список викладачів із Firebase
 * @returns {Promise<Array>} Масив викладачів
 */
export const getTeachers = async () => {
  try {
    const snapshot = await get(ref(db, "teachers"));
    if (!snapshot.exists()) {
      return [];
    }
    return Object.entries(snapshot.val()).map(([id, teacher]) => ({ id, ...teacher }));
  } catch (error) {
    return [];
  }
};

/**
 * 🔹 Перемикає стан "обраного" викладача (додає або видаляє)
 * @param {string} userId - ID користувача
 * @param {Object} teacher - Об'єкт викладача
 */
export const toggleFavorite = async (userId, teacher) => {
  if (!teacher || !teacher.id) return;

  try {
    const userRef = ref(db, `users/${userId}/favorites/${teacher.id}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      await remove(userRef); // Видаляємо, якщо вже в обраних
    } else {
      await set(userRef, {
        id: teacher.id,
        name: teacher.name || "Unknown",
        avatar_url: teacher.avatar_url || null,
        languages: teacher.languages || [],
        levels: teacher.levels || [],
        price_per_hour: teacher.price_per_hour || "N/A",
        rating: teacher.rating || 0,
        lesson_info: teacher.lesson_info || "No info available",
        conditions: teacher.conditions || [],
        reviews: teacher.reviews || [],
        experience: teacher.experience || "No experience provided", // Додаємо поле Experience
      });
    }
  } catch (error) {
    // Обробка помилки без виводу в консоль
  }
};

/**
 * 🔹 Перевіряє, чи викладач у списку "обраних"
 * @param {string} userId - ID користувача
 * @param {string} teacherId - ID викладача
 * @returns {Promise<boolean>}
 */
export const isFavorite = async (userId, teacherId) => {
  try {
    const userRef = ref(db, `users/${userId}/favorites/${teacherId}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
  } catch (error) {
    return false;
  }
};

/**
 * 🔹 Отримує список обраних викладачів користувача
 * @param {string} userId - ID користувача
 * @returns {Promise<Array>} Масив об'єктів викладачів
 */
export const getFavoriteTeachers = async (userId) => {
  try {
    const snapshot = await get(ref(db, `users/${userId}/favorites`));
    if (!snapshot.exists()) return [];

    // Перетворюємо об'єкти у масив, фільтруючи неповні записи
    const favoriteTeachers = Object.values(snapshot.val()).filter(teacher => teacher && teacher.id && teacher.name);

    return favoriteTeachers.map(teacher => ({
      ...teacher,
      avatar_url: teacher.avatar_url || "https://via.placeholder.com/100", // ✅ Плейсхолдер
    }));
  } catch (error) {
    return [];
  }
};
