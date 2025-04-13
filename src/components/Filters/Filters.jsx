import { useState } from "react";
import styles from "./Filters.module.scss";
import Dropdown from "../Dropdown/Dropdown";

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    language: "French",
    level: "A1 Beginner",
    price: "30$",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      onFilterChange(updatedFilters);
      document.activeElement.blur(); // Відключаємо фокус після вибору
      return updatedFilters;
    });
  };

  return (
    <div className={styles.filters} tabIndex="-1"> {/* Додаємо tabIndex */}
      <Dropdown
        label="Languages"
        options={["French", "English", "German", "Ukrainian", "Polish"]}
        selected={filters.language}
        onSelect={(value) => handleFilterChange("language", value)}
      />

      <Dropdown
        label="Level of knowledge"
        options={[
          "A1 Beginner",
          "A2 Elementary",
          "B1 Intermediate",
          "B2 Upper-Intermediate",
        ]}
        selected={filters.level}
        onSelect={(value) => handleFilterChange("level", value)}
      />

      <Dropdown
        label="Price"
        options={["10$", "20$", "30$", "40$"]}
        selected={filters.price}
        onSelect={(value) => handleFilterChange("price", value)}
      />
    </div>
  );
};

export default Filters;
