import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";

export interface Teacher {
  id?: string;
  name: string;
  surname?: string;
  avatar_url?: string;
  languages?: string[];
  levels?: string[];
  price_per_hour?: number | string;
  rating?: number | string;
  lesson_info?: string;
  experience?: string | string[];
  conditions?: string[];
  lessons_done?: number;
  reviews?: {
    reviewer_name: string;
    reviewer_rating: number;
    comment: string;
  }[];
}

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
 */
export const addTeachersToDatabase = async (
  teachers: Teacher[]
): Promise<void> => {
  const updates: Record<string, any> = {};
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
 */
export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    const snapshot = await get(ref(db, "teachers"));
    if (!snapshot.exists()) {
      return [];
    }
    // id is string, teacher is any
    return Object.entries(snapshot.val()).map(
      ([id, teacher]: [string, any]) => ({ id, ...teacher })
    );
  } catch (error) {
    return [];
  }
};

/**
 * 🔹 Перемикає стан "обраного" викладача (додає або видаляє)
 */
export const toggleFavorite = async (
  userId: string,
  teacher: Teacher
): Promise<void> => {
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
 */
export const isFavorite = async (
  userId: string,
  teacherId: string
): Promise<boolean> => {
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
 */
export const getFavoriteTeachers = async (
  userId: string
): Promise<Teacher[]> => {
  try {
    const snapshot = await get(ref(db, `users/${userId}/favorites`));
    if (!snapshot.exists()) return [];
    // Перетворюємо об'єкти у масив, фільтруючи неповні записи
    const favoriteTeachers = Object.values(snapshot.val()).filter(
      (teacher: any) => teacher && teacher.id && teacher.name
    );
    return favoriteTeachers.map((teacher: any) => ({
      ...teacher,
      avatar_url: teacher.avatar_url || "https://via.placeholder.com/100",
    }));
  } catch (error) {
    return [];
  }
};
