import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./App.scss";
import HomePage from "./pages/HomePage/HomePage";
import {
  Teacher,
  addTeachersToDatabase,
  getTeachers,
} from "./services/firebase";
import TeachersPage from "./pages/TeachersPage/TeachersPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import teachersData from "./data/teachers.json";

const teachers: Teacher[] = teachersData as Teacher[];

const App: React.FC = () => {
  useEffect(() => {
    addTeachersToDatabase(teachers);
    getTeachers();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/teachers" element={<TeachersPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  );
};

export default App;
