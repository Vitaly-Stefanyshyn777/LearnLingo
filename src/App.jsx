import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import './App.scss';
import HomePage from "./pages/HomePage/HomePage";
import { addTeachersToDatabase, getTeachers } from "./services/firebase";
import TeachersPage from "./pages/TeachersPage/TeachersPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import teachers from "./data/teachers.json";

function App() {
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
}

export default App;
