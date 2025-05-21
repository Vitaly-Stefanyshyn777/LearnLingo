import { useState } from "react";
import styles from "./Filters.module.scss";
import Dropdown from "../Dropdown/Dropdown";

export interface FilterState {
  language: string;
  level: string;
  price: string;
}

export interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    language: "French",
    level: "A1 Beginner",
    price: "30$",
  });

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      onFilterChange(updatedFilters);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return updatedFilters;
    });
  };

  return (
    <div className={styles.filters} tabIndex={-1}>
      <Dropdown
        label="Languages"
        options={["French", "English", "German", "Ukrainian", "Polish"]}
        selected={filters.language}
        onSelect={(value: string) => handleFilterChange("language", value)}
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
        onSelect={(value: string) => handleFilterChange("level", value)}
      />

      <Dropdown
        label="Price"
        options={["10$", "20$", "30$", "40$"]}
        selected={filters.price}
        onSelect={(value: string) => handleFilterChange("price", value)}
      />
    </div>
  );
};

export default Filters;
